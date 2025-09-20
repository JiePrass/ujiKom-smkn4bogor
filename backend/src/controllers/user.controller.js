const userService = require('../services/user.service');

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

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, address, education } = req.body;

        let profilePicture, bannerUrl;

        if (req.files?.profilePicture) {
        profilePicture = `/uploads/profile-pictures/${req.files.profilePicture[0].filename}`;
        }

        if (req.files?.bannerUrl) {
        bannerUrl = `/uploads/banner-profiles/${req.files.bannerUrl[0].filename}`;
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
        res.status(400).json({ message: error.message });
    }
};

