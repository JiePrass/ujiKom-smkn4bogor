const fs = require("fs");
const path = require("path");

function ensureFolders() {
    const folders = [
        path.join(__dirname, "..", "uploads"),
        path.join(__dirname, "..", "uploads", "zips"),
        path.join(__dirname, "..", "uploads", "temp"),
    ];

    folders.forEach((folder) => {
        if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log("📁 Created folder:", folder);
        }
    });
}

module.exports = ensureFolders;
