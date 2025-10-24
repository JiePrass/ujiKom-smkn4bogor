// Enums
export type Role = "ADMIN" | "PARTICIPANT";
export type TokenType = "VERIFICATION" | "RESET";

// User
export interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    education: string;
    profilePicture?: string | null;
    role: Role;
    isVerified: boolean;
    createdAt: string;
}

// EmailToken
export interface EmailToken {
    id: number;
    userId: number;
    otp: string;
    type: TokenType;
    expiresAt: string;
    createdAt: string;
}

// Event
export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    flyerUrl?: string | null;
    eventBannerUrl?: string | null;
    qrCodeUrl?: string | null;
    eventType: string;
    createdBy: number;
    price: number;
    createdAt: string;
}

// Registration
export interface Registration {
    id: number;
    userId: number;
    eventId: number;
    token?: string | null;
    registeredAt: string;
    paymentProofUrl?: string | null;
    status?: string | null;
    attendance?: Attendance | null;
    certificate?: Certificate | null;
}

// Attendance
export interface Attendance {
    id: number;
    registrationId: number;
    attendedAt: string;
}

// Certificate
export interface Certificate {
    id: number;
    registrationId: number;
    url: string;
    issuedAt: string;
}

// Notification
export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

// === GALLERY RELATED TYPES ===

// Media dalam satu galeri
export interface GalleryMedia {
    id: number;
    galleryId: number;
    mediaUrl: string;
}

// Komentar galeri (bisa nested)
export interface GalleryComment {
    id: number;
    galleryId: number;
    userId: number;
    content: string;
    parentId?: number | null;
    createdAt: string;
    user: {
        id: number;
        fullName: string;
        profilePicture?: string | null;
    };
    replies?: GalleryComment[];
}

// Like galeri
export interface GalleryLike {
    id: number;
    galleryId: number;
    userId: number;
    user?: {
        id: number;
        fullName: string;
        profilePicture?: string | null;
    };
}

// Gallery utama
export interface Gallery {
    id: number;
    eventId: number;
    userId: number;
    caption?: string | null;
    createdAt: string;

    // Relasi
    user?: {
        id: number;
        fullName: string;
        profilePicture?: string | null;
    };
    event?: {
        id: number;
        title: string;
    };
    media?: GalleryMedia[];
    likes?: GalleryLike[];
    comments?: GalleryComment[];

    // Count
    _count?: {
        likes: number;
        comments: number;
    };
}

// === REQUEST PAYLOAD TYPES ===

// Upload galeri baru (admin)
export interface UploadGalleryData {
    eventId: number;
    caption?: string;
    media: File[];
}

// Tambah komentar baru
export interface AddGalleryCommentData {
    content: string;
    parentId?: number | null;
}

// Tambahkan di samping tipe Gallery yang sudah ada
export interface PaginatedGalleries {
    items: Gallery[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

