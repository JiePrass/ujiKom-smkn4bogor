const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const { v2: cloudinary } = require('cloudinary');

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const baseTempExtractDir = path.join(__dirname, '../../uploads/temp_extract');
const certificatesDir = path.join(__dirname, '../../uploads/certificates');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function listFilesOnly(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => {
    try {
      return fs.statSync(path.join(dir, f)).isFile();
    } catch {
      return false;
    }
  });
}

/**
 * Upload file ke Cloudinary dan hapus lokalnya.
 */
async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'simkas/certificates',
      resource_type: 'auto',
    });
    fs.unlinkSync(filePath); // hapus file lokal setelah sukses
    return result.secure_url;
  } catch (err) {
    console.error('❌ Gagal upload ke Cloudinary:', err.message);
    return null;
  }
}

/**
 * Proses bulk upload ZIP: cocokkan otomatis, upload ke Cloudinary bila match,
 * sisanya simpan sementara di lokal.
 */
exports.processBulkUpload = async (eventId, zipPath) => {
  const eventTempDir = path.join(baseTempExtractDir, String(eventId));

  // Bersihkan folder temp event sebelum ekstrak ZIP baru
  fs.rmSync(eventTempDir, { recursive: true, force: true });
  ensureDir(eventTempDir);

  // Ekstrak ZIP ke folder event
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(eventTempDir, true);

  // Hapus file ZIP asli setelah ekstrak
  fs.unlinkSync(zipPath);

  const allFiles = listFilesOnly(eventTempDir);
  let matchedCount = 0;
  const unmatchedFiles = [];

  for (const file of allFiles) {
    const token = path.parse(file).name; // nama file tanpa ekstensi
    const filePath = path.join(eventTempDir, file);

    const registration = await prisma.registration.findFirst({
      where: { eventId: parseInt(eventId), token },
    });

    if (registration) {
      // ✅ Jika match → upload langsung ke Cloudinary
      const uploadedUrl = await uploadToCloudinary(filePath);

      if (uploadedUrl) {
        await prisma.certificate.create({
          data: {
            registrationId: registration.id,
            url: uploadedUrl,
          },
        });
        matchedCount++;
      }
    } else {
      // ❌ Tidak match → simpan sementara untuk admin
      unmatchedFiles.push({
        filename: file,
        previewUrl: `${process.env.BACKEND_URL}/uploads/temp_extract/${eventId}/${file}`,
      });
    }
  }

  return { matchedCount, unmatchedFiles };
};

/**
 * Ambil daftar file yang belum cocok.
 */
exports.getUnmatchedFiles = async (eventId) => {
  const eventTempDir = path.join(baseTempExtractDir, String(eventId));
  const files = listFilesOnly(eventTempDir);
  return files.map(file => ({
    filename: file,
    previewUrl: `${process.env.BACKEND_URL}/uploads/temp_extract/${eventId}/${file}`,
  }));
};

/**
 * Saat admin melakukan manual match,
 * upload file lokal ke Cloudinary dan update DB.
 */
exports.mapCertificates = async (eventId, mappings) => {
  const eventTempDir = path.join(baseTempExtractDir, String(eventId));
  ensureDir(certificatesDir);

  for (const map of mappings) {
    const sourcePath = path.join(eventTempDir, map.filename);
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️ File ${map.filename} tidak ditemukan di temp_extract/${eventId}`);
      continue;
    }

    const uploadedUrl = await uploadToCloudinary(sourcePath);

    if (uploadedUrl) {
      await prisma.certificate.upsert({
        where: { registrationId: parseInt(map.registrationId) },
        update: { url: uploadedUrl },
        create: {
          registrationId: parseInt(map.registrationId),
          url: uploadedUrl,
        },
      });
    }
  }

  // Bersihkan folder temp jika sudah kosong
  try {
    if (fs.existsSync(eventTempDir) && listFilesOnly(eventTempDir).length === 0) {
      fs.rmSync(eventTempDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.warn('Gagal membersihkan folder temp:', err.message);
  }
};

/**
 * Ambil semua sertifikat berdasarkan event.
 */
exports.getCertificatesByEvent = async (eventId) => {
  return await prisma.certificate.findMany({
    where: { registration: { eventId: parseInt(eventId) } },
    include: {
      registration: {
        select: {
          id: true,
          user: { select: { fullName: true, email: true } },
        },
      },
    },
    orderBy: { id: 'desc' },
  });
};
