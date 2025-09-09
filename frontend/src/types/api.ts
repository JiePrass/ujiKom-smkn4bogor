import { User, Event, Registration, Certificate, Notification } from './model'

// Auth
export interface RegisterResponse {
    message: string;
}

export interface VerifyEmailResponse {
    message: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
    user: User;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export type GetCurrentUserResponse = User;

// Event API
export interface GetEventsResponse {
    events: Event[];
}

export interface GetEventDetailResponse extends Event {
    registrations?: Registration[];
}

export interface EventDetail extends Omit<Event, "createdBy"> {
    createdBy: {
        id: number;
        fullName: string;
        email: string;
    };
}


export type CreateEventResponse = Event;
export type UpdateEventResponse = Event;
export interface DeleteEventResponse {
    message: string;
}

// Registration API
export type RegisterForEventResponse = Registration;
export interface VerifyAttendanceResponse {
    message: string;
}

export interface UploadPaymentProofResponse {
    message: string;
    paymentProofUrl: string;
}

// Certificate API
export type UploadCertificateResponse = Certificate;
export interface DownloadCertificateResponse {
    url: string;
}

// Notification API
export interface GetNotificationsResponse {
    unreadCount: number;
    notifications: Notification[];
}
export interface MarkNotificationReadResponse {
    message: string;
}
