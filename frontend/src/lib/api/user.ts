import axiosInstance from "./axiosInstance";

// GET CURRENT USER
export async function getUserProfile(userId: number) {
    const res = await axiosInstance.get(`/user/${userId}`);
    return res.data;
}