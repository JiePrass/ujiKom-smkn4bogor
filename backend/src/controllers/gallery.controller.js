const galleryService = require("../services/gallery.service");

async function uploadGallery(req, res) {
    try {
        const eventId = Number(req.body.eventId);
        const { caption } = req.body;
        const userId = req.user.id;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No media uploaded" });
        }

        // setiap file = 1 row di Gallery
        const mediaUrls = req.files.map((file) => `/uploads/gallery/${file.filename}`);
        const galleries = await galleryService.createGallery(eventId, userId, mediaUrls, caption);

        return res.json({ message: "Gallery uploaded successfully", galleries });
    } catch (err) {
        return res.status(500).json({ error: "Failed to upload gallery", details: err.message });
    }
}

async function getAllGalleries(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await galleryService.getAllGalleries(page, limit);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch galleries" });
    }
}


async function getGalleryDetail(req, res) {
    try {
        const { id } = req.params;
        const gallery = await galleryService.getGalleryById(Number(id));
        if (!gallery) return res.status(404).json({ error: "Gallery not found" });
        return res.json(gallery);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch gallery detail" });
    }
}

async function deleteGallery(req, res) {
    try {
        const { galleryId } = req.params;
        const userRole = req.user.role;

        const result = await galleryService.deleteGallery(Number(galleryId), userRole);
        res.json({ message: "Gallery deleted successfully", result });
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
}

async function likeGallery(req, res) {
    try {
        const { galleryId } = req.params;
        const userId = req.user.id;
        const result = await galleryService.toggleLike(Number(galleryId), userId);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ error: "Failed to toggle like" });
    }
}

async function addComment(req, res) {
    try {
        const { galleryId } = req.params;
        const { content, parentId } = req.body;
        const userId = req.user.id;
        const comment = await galleryService.addComment(Number(galleryId), userId, content, parentId);
        return res.json(comment);
    } catch (err) {
        return res.status(500).json({ error: "Failed to add comment" });
    }
}

async function reportComment(req, res) {
    try {
        const { commentId } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;
        const report = await galleryService.reportComment(Number(commentId), userId, reason);
        return res.json({ message: "Report submitted", report });
    } catch (err) {
        return res.status(500).json({ error: "Failed to report comment" });
    }
}

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const result = await galleryService.deleteComment(Number(commentId), userId, userRole);
        res.json({ message: "Comment deleted successfully", result });
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
}

module.exports = {
    uploadGallery,
    getAllGalleries,
    getGalleryDetail,
    deleteGallery,
    likeGallery,
    addComment,
    reportComment,
    deleteComment
};
