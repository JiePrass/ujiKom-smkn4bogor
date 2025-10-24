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

export async function exportRegistrationCSV(eventId: number) {
    const res = await axiosInstance.get(`/registration/${eventId}/export`, {
        responseType: "blob",
    });
    return res.data; 
}

export async function downloadEventQR(eventId: number) {
    const res = await axiosInstance.get(`/registration/event/${eventId}/download-qrcode`, {
        responseType: "blob",
    });

    // Buat URL dari blob untuk diunduh
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `event_${eventId}_qr.png`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
