// lib/api/registration.ts
import axiosInstance from "./axiosInstance";

export async function registerForEvent(eventId: number, paymentProof?: File) {
    const formData = new FormData();
    if (paymentProof) {
        formData.append("paymentProof", paymentProof);
    }

    const res = await axiosInstance.post(`/registration/${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
}

export async function getRegistrationsByEvent(eventId: number) {
    const res = await axiosInstance.get(`/registration/event/${eventId}`);
    return res.data;
}

export async function updatePaymentStatus(registrationId: number, status: "PENDING" | "APPROVED" | "REJECTED") {
    const res = await axiosInstance.patch(`/registration/${registrationId}/payment-status`, { status });
    return res.data;
}

export async function checkUserRegistration(eventId: number) {
    const res = await axiosInstance.get(`/registration/${eventId}/check`);
    return res.data;
}
