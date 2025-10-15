// middlewares/uploadLocal.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/zips"); // folder lokal sementara
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});

const uploadLocal = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/zip" && file.mimetype !== "application/x-zip-compressed") {
        return cb(new Error("Hanya file ZIP yang diperbolehkan"));
        }
        cb(null, true);
    },
});

module.exports = uploadLocal;
