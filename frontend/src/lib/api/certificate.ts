// lib/api/certificate.ts
import axios from "@/lib/api/axiosInstance";

export const bulkUploadCertificates = async (eventId: number, file: File) => {
    const formData = new FormData();
    formData.append("zipFile", file);
    const { data } = await axios.post(`/certificates/bulk/${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const getUnmatchedFiles = async (eventId: number) => {
    const { data } = await axios.get(`/certificates/unmatched/${eventId}`);
    return data.unmatched;
};

// ⬇️ kirim eventId di path
export const mapCertificates = async (eventId: number, mappings: Array<{ filename: string; registrationId: number; }>) => {
    const { data } = await axios.post(`/certificates/map/${eventId}`, mappings);
    return data;
};

export async function getCertificatesByEvent(eventId: number) {
    const res = await axios.get(`/certificates/${eventId}`);
    return res.data;
}
