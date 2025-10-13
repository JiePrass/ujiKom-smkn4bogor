import axiosInstance from "./axiosInstance";
import {
    Gallery,
    UploadGalleryData,
    AddGalleryCommentData,
    GalleryComment,
    PaginatedGalleries,
} from "../../types/model";

/**
 * === GET ALL GALLERIES (Paginated) ===
 */

export async function getAllGalleries(
    page = 1,
    limit = 20
): Promise<PaginatedGalleries> {
    const res = await axiosInstance.get(`/galleries?page=${page}&limit=${limit}`);
    return res.data ?? res;
}


/**
 * === GET GALLERY DETAIL ===
 */
export async function getGalleryDetail(id: number): Promise<Gallery> {
    const res = await axiosInstance.get(`/galleries/${id}`);
    return res.data;
}

/**
 * === UPLOAD GALLERY (Admin only) ===
 */
export async function uploadGallery(data: UploadGalleryData): Promise<Gallery> {
    const formData = new FormData();
    formData.append("eventId", String(data.eventId));
    if (data.caption) formData.append("caption", data.caption);
    if (data.media?.length) {
        data.media.forEach((file) => formData.append("media", file));
    }

    const res = await axiosInstance.post(`/galleries`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

/**
 * === DELETE GALLERY (Admin only) ===
 */
export async function deleteGallery(galleryId: number): Promise<{ message: string }> {
    const res = await axiosInstance.delete(`/galleries/${galleryId}`);
    return res.data;
}

/**
 * === LIKE / UNLIKE GALLERY ===
 */
export async function toggleLikeGallery(
    galleryId: number
): Promise<{ liked: boolean }> {
    const res = await axiosInstance.post(`/galleries/${galleryId}/like`);
    return res.data;
}

/**
 * === ADD COMMENT ===
 */
export async function addGalleryComment(
    galleryId: number,
    data: AddGalleryCommentData
): Promise<GalleryComment> {
    const res = await axiosInstance.post(`/galleries/${galleryId}/comments`, data);
    return res.data;
}

/**
 * === REPORT COMMENT ===
 */
export async function reportGalleryComment(
    commentId: number,
    reason: string
): Promise<{ message: string }> {
    const res = await axiosInstance.post(`/galleries/comments/${commentId}/report`, {
        reason,
    });
    return res.data;
}

/**
 * === DELETE COMMENT (Admin or Owner) ===
 */
export async function deleteGalleryComment(
    commentId: number
): Promise<{ message: string }> {
    const res = await axiosInstance.delete(`/galleries/comments/${commentId}`);
    return res.data;
}
