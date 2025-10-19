const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

// === GALLERY UPLOAD (multi image → multi row) ===
exports.createGallery = async (eventId, userId, mediaUrls, caption) => {
    const gallery = await prisma.gallery.create({
        data: { eventId, userId, caption },
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
};

// === GET ALL GALLERIES ===
exports.getAllGalleries = async (page = 1, limit = 20) => {
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
        prisma.gallery.count(),
    ]);

    return {
        items: galleries,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
    };
};

// === GET GALLERY DETAIL ===
exports.getGalleryById = async (id) => {
    return prisma.gallery.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, fullName: true, profilePicture: true },
            },
            event: { select: { id: true, title: true } },
            media: true,
            likes: {
                include: {
                    user: {
                        select: { id: true, fullName: true, profilePicture: true },
                    },
                },
            },
            comments: {
                where: { parentId: null },
                include: {
                    user: {
                        select: { id: true, fullName: true, profilePicture: true },
                    },
                    replies: {
                        include: {
                            user: {
                                select: { id: true, fullName: true, profilePicture: true },
                            },
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });
};

// === DELETE GALLERY (Admin only) ===
exports.deleteGallery = async (galleryId, userRole) => {
    const id = parseInt(galleryId);

    const gallery = await prisma.gallery.findUnique({
        where: { id },
        include: { media: true },
    });

    if (!gallery) throw new Error("Gallery tidak ditemukan.");
    if (userRole !== "ADMIN") throw new Error("Tidak memiliki izin untuk menghapus gallery ini.");

    // Hapus file media
    for (const media of gallery.media) {
        if (media.mediaUrl) {
            const fileName = path.basename(media.mediaUrl);
            const filePath = path.resolve(process.cwd(), "uploads", "gallery", fileName);

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            else console.log("⚠️ File tidak ditemukan:", filePath);
        }
    }

    // Hapus semua relasi terkait
    await prisma.galleryCommentReport.deleteMany({
        where: { comment: { galleryId: id } },
    });
    await prisma.galleryComment.deleteMany({ where: { galleryId: id } });
    await prisma.galleryLike.deleteMany({ where: { galleryId: id } });
    await prisma.galleryMedia.deleteMany({ where: { galleryId: id } });

    await prisma.gallery.delete({ where: { id } });

    return { message: "Gallery berhasil dihapus" };
};

// === LIKE / UNLIKE ===
exports.toggleLike = async (galleryId, userId) => {
    const existing = await prisma.galleryLike.findUnique({
        where: { galleryId_userId: { galleryId, userId } },
    });

    if (existing) {
        await prisma.galleryLike.delete({ where: { id: existing.id } });
        return { liked: false };
    }

    await prisma.galleryLike.create({ data: { galleryId, userId } });
    return { liked: true };
};

// === COMMENT (Nested) ===
exports.addComment = async (galleryId, userId, content, parentId = null) => {
    return prisma.galleryComment.create({
        data: { galleryId, userId, content, parentId },
        include: {
            user: {
                select: { id: true, fullName: true, profilePicture: true },
            },
            parent: { select: { id: true, content: true } },
        },
    });
};

// === REPORT COMMENT ===
exports.reportComment = async (commentId, userId, reason) => {
    if (!reason || reason.trim() === "") throw new Error("Reason is required");

    const comment = await prisma.galleryComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Comment not found");

    const existing = await prisma.galleryCommentReport.findUnique({
        where: { commentId_userId: { commentId, userId } },
    });
    if (existing) throw new Error("You already reported this comment");

    return prisma.galleryCommentReport.create({
        data: { commentId, userId, reason },
    });
};

// === GET ALL REPORTED COMMENTS (Admin only) ===
exports.getAllReportedComments = async () => {
    return await prisma.galleryCommentReport.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            comment: {
                include: {
                    user: { select: { id: true, fullName: true, email: true } },
                    gallery: { select: { id: true } },
                },
            },
            user: { // reporter
                select: { id: true, fullName: true, email: true },
            },
        },
    });
};

// === REJECT REPORT (Admin only) ===
exports.rejectReport = async (reportId) => {
    const existingReport = await prisma.galleryCommentReport.findUnique({
        where: { id: reportId },
    });

    if (!existingReport) {
        return null;
    }

    // Hapus report tanpa menghapus komentar
    const deleted = await prisma.galleryCommentReport.delete({
        where: { id: reportId },
    });

    return deleted;
}


// === DELETE COMMENT (Admin or Owner only) ===
exports.deleteComment = async (commentId, userId, userRole) => {
    const comment = await prisma.galleryComment.findUnique({
        where: { id: commentId },
    });

    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== userId && userRole !== "ADMIN")
        throw new Error("You are not allowed to delete this comment");

    await prisma.galleryCommentReport.deleteMany({ where: { commentId } });
    await prisma.galleryComment.deleteMany({ where: { parentId: commentId } });

    return prisma.galleryComment.delete({ where: { id: commentId } });
};
