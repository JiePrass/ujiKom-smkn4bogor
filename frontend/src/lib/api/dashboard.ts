import axiosInstance from "./axiosInstance";

export const getDataSummary = async () => {
    const res = await axiosInstance.get("/dashboard/summary");
    return res.data;
};

export const getDataEventsperMonth = async () => {
    const res = await axiosInstance.get("/dashboard/events-per-month");
    return res.data;
}

export const getDataAttendeesperMonth = async () => {
    const res = await axiosInstance.get("/dashboard/attendees-per-month");
    return res.data;
}

export const getDataTopEvents = async () => {
    const res = await axiosInstance.get("/dashboard/top-events");
    return res.data;
}