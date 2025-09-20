// src/lib/api/eventApi.ts
import axiosInstance from "@/lib/api/axiosInstance";

/* =====================================================
    GET semua event
===================================================== */
export const getAllEvents = async () => {
    const res = await axiosInstance.get("/events");
    return res.data;
};

/* =====================================================
    GET detail event
===================================================== */
export const getEventById = async (id: number) => {
    const res = await axiosInstance.get(`/events/${id}`);
    return res.data;
};

/* =====================================================
    CREATE event (ADMIN)
===================================================== */
export const createEvent = async (data: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price?: number;
    flyer: File;
    eventBanner: File;
    eventType: string;
}) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("time", data.time);
    formData.append("location", data.location);
    formData.append("eventType", data.eventType);
    formData.append("price", String(data.price ?? 0));

    if (data.flyer) {
        formData.append("flyer", data.flyer);
    }
    if (data.eventBanner) {
        formData.append("eventBanner", data.eventBanner);
    }

    const res = await axiosInstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/* =====================================================
    UPDATE event
===================================================== */
export const updateEvent = async (
    id: number,
    data: {
        title?: string;
        description?: string;
        date?: string;
        time?: string;
        location?: string;
        price?: number;
        flyer?: File;
        eventBanner?: File;
    }
) => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.date) formData.append("date", data.date);
    if (data.time) formData.append("time", data.time);
    if (data.location) formData.append("location", data.location);
    if (data.price !== undefined) {
        formData.append("price", String(data.price));
    }
    if (data.flyer) formData.append("flyer", data.flyer);
    if (data.eventBanner) formData.append("eventBanner", data.eventBanner)

    const res = await axiosInstance.patch(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/* =====================================================
    DELETE event
===================================================== */
export const deleteEvent = async (id: number) => {
    const res = await axiosInstance.delete(`/events/${id}`);
    return res.data;
};

/* =====================================================
    PRESENSI peserta
===================================================== */
export const attendEvent = async (eventId: number, otp: string) => {
    const res = await axiosInstance.post(`/events/${eventId}/attend`, {
        token: otp,
    });
    return res.data;
};

