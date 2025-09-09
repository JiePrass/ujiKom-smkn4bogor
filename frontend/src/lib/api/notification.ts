import axiosInstance from "./axiosInstance";

import {
    GetNotificationsResponse,
    MarkNotificationReadResponse,
} from "@/types/api";

// Get all notifications for current user
export async function getNotifications() {
    const res = await axiosInstance.get<GetNotificationsResponse>("/notifications");
    return res.data;
}

// Mark one notification as read
export async function markNotificationAsRead(id: number) {
    const res = await axiosInstance.patch<MarkNotificationReadResponse>(`/notifications/${id}/read`);
    return res.data;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
    const res = await axiosInstance.patch<MarkNotificationReadResponse>("/notifications/read-all");
    return res.data;
}

// Delete a notification
export async function deleteNotification(id: number) {
    const res = await axiosInstance.delete<MarkNotificationReadResponse>(`/notifications/${id}`);
    return res.data;
}
