const galleryService = require("../services/gallery.service");

// === UPLOAD GALLERY ===
exports.uploadGallery = async (req, res) => {
    try {
        const eventId = Number(req.body.eventId);
        const { caption } = req.body;
        const userId = req.user.id;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No media uploaded" });
        }

        const mediaUrls = req.files.map((file) => file.path);

        const galleries = await galleryService.createGallery(
            eventId,
            userId,
            mediaUrls,
            caption
        );

        return res.json({
            message: "Gallery uploaded successfully",
            galleries,
        });
    } catch (err) {
        console.error("🔥 Upload gallery error:", err);
        return res.status(500).json({
            error: "Failed to upload gallery",
            details: err.message,
        });
    }
};

// === GET ALL GALLERIES ===
exports.getAllGalleries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await galleryService.getAllGalleries(page, limit);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch galleries" });
    }
};

// === GET GALLERY DETAIL ===
exports.getGalleryDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await galleryService.getGalleryById(Number(id));
        if (!gallery) {
            return res.status(404).json({ error: "Gallery not found" });
        }
        return res.json(gallery);
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch gallery detail" });
    }
};

// === DELETE GALLERY (Admin only) ===
exports.deleteGallery = async (req, res) => {
    try {
        const { galleryId } = req.params;
        const userRole = req.user.role;

        const result = await galleryService.deleteGallery(
            Number(galleryId),
            userRole
        );
        return res.json({
            message: "Gallery deleted successfully",
            result,
        });
    } catch (err) {
        return res.status(403).json({ error: err.message });
    }
};

// === LIKE / UNLIKE GALLERY ===
exports.likeGallery = async (req, res) => {
    try {
        const { galleryId } = req.params;
        const userId = req.user.id;
        const result = await galleryService.toggleLike(Number(galleryId), userId);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to toggle like" });
    }
};

// === ADD COMMENT ===
exports.addComment = async (req, res) => {
    try {
        const { galleryId } = req.params;
        const { content, parentId } = req.body;
        const userId = req.user.id;

        const comment = await galleryService.addComment(
            Number(galleryId),
            userId,
            content,
            parentId
        );

        return res.json(comment);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add comment" });
    }
};

// === REPORT COMMENT ===
exports.reportComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;

        const report = await galleryService.reportComment(
            Number(commentId),
            userId,
            reason
        );

        return res.json({
            message: "Report submitted successfully",
            report,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || "Failed to report comment" });
    }
};


// === GET ALL REPORTED COMMENTS (Admin only) ===
exports.getAllReportedComments = async (req, res) => {
    try {
        const reports = await galleryService.getAllReportedComments();
        return res.status(200).json({
            message: "Data report comment gallery berhasil diambil.",
            data: reports,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Terjadi kesalahan saat mengambil data report comment.",
        });
    }
};

// === REJECT REPORT (Admin only) ===
exports.rejectReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const result = await galleryService.rejectReport(Number(reportId));

        if (!result) {
            return res.status(404).json({ error: "Report tidak ditemukan." });
        }

        res.status(200).json({
            message: "Report berhasil dihapus (ditolak).",
            data: result,
        });
    } catch (error) {
        console.error("🔥 Error reject report:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat menolak report." });
    }
};

// === DELETE COMMENT (Admin or Owner only) ===
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const result = await galleryService.deleteComment(
            Number(commentId),
            userId,
            userRole
        );

        return res.json({
            message: "Comment deleted successfully",
            result,
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ error: err.message });
    }
};
