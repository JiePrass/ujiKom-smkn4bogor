const userService = require('../services/user.service');
const cloudinary = require('cloudinary').v2;

// === Konfigurasi Cloudinary ===
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === Get user by ID ===
exports.getUserById = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// === Update Profile dengan Cloudinary Upload ===
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, address, education } = req.body;

        let profilePicture, bannerUrl;

        // === Upload Profile Picture ke Cloudinary ===
        if (req.files?.profilePicture?.[0]) {
            const file = req.files.profilePicture[0];
            try {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `simkas/users/${userId}/profile`,
                    use_filename: true,
                    unique_filename: true,
                    resource_type: "image",
                });
                profilePicture = uploadResult.secure_url;
            } catch (err) {
                console.error("Cloudinary upload (profilePicture) failed:", err);
                throw new Error("Gagal mengunggah foto profil.");
            }
        }

        // === Upload Banner Profile ke Cloudinary ===
        if (req.files?.bannerUrl?.[0]) {
            const file = req.files.bannerUrl[0];
            try {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `simkas/users/${userId}/banner`,
                    use_filename: true,
                    unique_filename: true,
                    resource_type: "image",
                });
                bannerUrl = uploadResult.secure_url;
            } catch (err) {
                console.error("Cloudinary upload (bannerUrl) failed:", err);
                throw new Error("Gagal mengunggah banner profil.");
            }
        }

        const updateData = {
            fullName,
            phone,
            address,
            education,
            ...(profilePicture && { profilePicture }),
            ...(bannerUrl && { bannerUrl }),
        };

        const response = await userService.updateProfile(userId, updateData);
        res.status(200).json(response);

    } catch (error) {
        console.error("❌ Update Profile Error:", error);
        res.status(400).json({ message: error.message });
    }
};
