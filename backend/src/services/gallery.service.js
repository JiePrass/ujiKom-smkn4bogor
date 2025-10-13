const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

// === GALLERY UPLOAD (multi image → multi row) ===
async function createGallery(eventId, userId, mediaUrls, caption) {
    const gallery = await prisma.gallery.create({
        data: {
            eventId,
            userId,
            caption,
        },
    });

    if (mediaUrls?.length) {
        await prisma.galleryMedia.createMany({
            data: mediaUrls.map((url) => ({
                galleryId: gallery.id,
                mediaUrl: url,
            })),
        });
    }

    return prisma.gallery.findUnique({
        where: { id: gallery.id },
        include: {
            media: true,
            user: { select: { id: true, fullName: true, profilePicture: true } },
        },
    });
}

// === GET ALL GALLERIES ===
async function getAllGalleries(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [galleries, totalItems] = await Promise.all([
        prisma.gallery.findMany({
            skip,
            take: limit,
            include: {
                media: true,
                user: { select: { id: true, fullName: true, profilePicture: true } },
                _count: { select: { likes: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.gallery.count(), // hitung total seluruh galeri
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
        items: galleries,
        totalItems,
        totalPages,
        currentPage: page,
    };
}

// === GET GALLERY DETAIL ===
async function getGalleryById(id) {
    return prisma.gallery.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    profilePicture: true,
                },
            },
            event: {
                select: {
                    id: true,
                    title: true,
                },
            },
            media: true,
            likes: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            profilePicture: true,
                        },
                    },
                },
            },
            comments: {
                where: { parentId: null },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            profilePicture: true,
                        },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    profilePicture: true,
                                },
                            },
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });
}

// === DELETE GALLERY (Admin or Owner only) ===
async function deleteGallery(galleryId, userRole) {
    const id = parseInt(galleryId);

    const gallery = await prisma.gallery.findUnique({
        where: { id },
        include: { media: true },
    });

    if (!gallery) {
        throw new Error("Gallery tidak ditemukan.");
    }

    if (userRole !== "ADMIN") {
        throw new Error("Tidak memiliki izin untuk menghapus gallery ini.");
    }

    // Hapus file media (gambar) jika ada
    for (const media of gallery.media) {
        if (media.mediaUrl) {
            const fileName = path.basename(media.mediaUrl);

            const filePath = path.resolve(
                process.cwd(),
                "uploads",
                "gallery",
                fileName
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.log("⚠️ File tidak ditemukan:", filePath);
            }
        }
    }

    await prisma.galleryCommentReport.deleteMany({
        where: { comment: { galleryId: id } },
    });

    await prisma.galleryComment.deleteMany({
        where: { galleryId: id },
    });

    await prisma.galleryLike.deleteMany({
        where: { galleryId: id },
    });

    await prisma.galleryMedia.deleteMany({
        where: { galleryId: id },
    });

    await prisma.gallery.delete({ where: { id } });

    return { message: "Gallery berhasil dihapus" };
}

// === LIKE / UNLIKE ===
async function toggleLike(galleryId, userId) {
    const existing = await prisma.galleryLike.findUnique({
        where: { galleryId_userId: { galleryId, userId } },
    });

    if (existing) {
        await prisma.galleryLike.delete({ where: { id: existing.id } });
        return { liked: false };
    } else {
        await prisma.galleryLike.create({ data: { galleryId, userId } });
        return { liked: true };
    }
}

// === COMMENT (Nested) ===
async function addComment(galleryId, userId, content, parentId = null) {
    return prisma.galleryComment.create({
        data: { galleryId, userId, content, parentId },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    profilePicture: true,
                },
            },
            parent: {
                select: {
                    id: true,
                    content: true,
                },
            },
        },
    });
}

// === REPORT COMMENT ===
async function reportComment(commentId, userId, reason) {
    // validasi reason
    if (!reason || reason.trim() === "") {
        throw new Error("Reason is required");
    }

    // cek apakah comment ada
    const comment = await prisma.galleryComment.findUnique({
        where: { id: commentId },
    });
    if (!comment) {
        throw new Error("Comment not found");
    }

    // cek apakah user sudah report
    const existing = await prisma.galleryCommentReport.findUnique({
        where: {
            commentId_userId: { commentId, userId },
        },
    });
    if (existing) {
        throw new Error("You already reported this comment");
    }

    // baru insert
    return prisma.galleryCommentReport.create({
        data: { commentId, userId, reason },
    });
}

// === DELETE COMMENT (Admin or Owner only) ===
async function deleteComment(commentId, userId, userRole) {
    const comment = await prisma.galleryComment.findUnique({
        where: { id: commentId },
    });

    if (!comment) {
        throw new Error("Comment not found");
    }

    // hanya admin atau owner yang boleh hapus
    if (comment.userId !== userId && userRole !== "ADMIN") {
        throw new Error("You are not allowed to delete this comment");
    }

    // hapus semua replies & report terkait (cascade manual)
    await prisma.galleryCommentReport.deleteMany({
        where: { commentId },
    });
    await prisma.galleryComment.deleteMany({
        where: { parentId: commentId },
    });

    // hapus komentar utama
    return prisma.galleryComment.delete({
        where: { id: commentId },
    });
}

module.exports = {
    createGallery,
    getAllGalleries,
    getGalleryById,
    deleteGallery,
    toggleLike,
    addComment,
    reportComment,
    deleteComment
};
