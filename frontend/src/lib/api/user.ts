import axiosInstance from "./axiosInstance";

// GET CURRENT USER
export async function getUserProfile(userId: number) {
    const res = await axiosInstance.get(`/user/${userId}`);
    return res.data;
}

// UPDATE USER PROFILE
export async function updateUserProfile(userId: number, data: FormData) {
    const res = await axiosInstance.patch(`/user/edit/${userId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}