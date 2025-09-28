const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const requireLogin = require('../middlewares/requireLogin');
const requireRole = require('../middlewares/requireRole');
const upload = require('../middlewares/upload');

router.get("/", galleryController.getAllGalleries);
router.get("/:id", galleryController.getGalleryDetail);
router.post(
    "/",
    requireLogin,
    requireRole("ADMIN"),
    upload.array("media", 10),
    galleryController.uploadGallery
);
router.delete("/:galleryId", requireLogin, requireRole("ADMIN"), galleryController.deleteGallery);
router.post("/:galleryId/like", requireLogin, galleryController.likeGallery);
router.post("/:galleryId/comments", requireLogin, galleryController.addComment);
router.post("/comments/:commentId/report", requireLogin, galleryController.reportComment);
router.delete("/comments/:commentId", requireLogin, galleryController.deleteComment);

module.exports = router;
