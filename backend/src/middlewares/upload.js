const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tentukan folder Cloudinary berdasarkan fieldname
function getCloudinaryFolder(fieldname) {
    switch (fieldname) {
        case "flyer":
            return "simkas/flyers";
        case "paymentProof":
            return "simkas/payments";
        case "profilePicture":
            return "simkas/profile-pictures";
        case "certificateFile":
            return "simkas/certificates";
        case "zipFile":
            return "simkas/temp";
        case "bannerUrl":
            return "simkas/banner-profiles";
        case "eventBanner":
            return "simkas/banner-events";
        case "media":
            return "simkas/gallery";
        default:
            return "simkas/uploads";
    }
}

// Storage Cloudinary dinamis
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: getCloudinaryFolder(file.fieldname),
        allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp", "zip"],
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        resource_type:
        file.mimetype.startsWith("video/") ? "video"
        : file.mimetype === "application/zip" ? "raw"
        : "image",
    }),
});

const upload = multer({ storage });

module.exports = upload;
