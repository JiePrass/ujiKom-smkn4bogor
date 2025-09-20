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
    date: string; // ISO date
    time: string;
    location: string;
    flyerUrl?: string | null;
    eventBannerUrl?: string | null;
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
