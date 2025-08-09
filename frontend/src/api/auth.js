// src/api/auth.js
import axiosInstance from "./axiosInstance";

// REGISTER
export const registerUser = async (data) => {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
};

// VERIFY EMAIL
export const verifyEmail = async (data) => {
    const res = await axiosInstance.post("/auth/verify-email", data);
    return res.data;
};

// LOGIN
export const loginUser = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
    const res = await axiosInstance.post("/auth/forgot-password", data);
    return res.data;
};

// RESET PASSWORD
export const resetPassword = async (data) => {
    const res = await axiosInstance.post("/auth/reset-password", data);
    return res.data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
};