"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { attendEvent, getEventById, getAllEvents } from "@/lib/api/event";
import { registerForEvent, checkUserRegistration } from "@/lib/api/registration";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import RegistrationModal from "@/components/shared/modals/registrationModal";
import OtpModal from "@/components/shared/modals/otpModal";
import EventDetailHero from "@/components/shared/eventDetailHero";
import { Event } from "@/types/model";
import { SmallEventCardSkeleton } from "@/components/shared/cards/smallEventCardSkeleton";
import SmallEventCard from "@/components/shared/cards/smallEventCard";

interface EventType {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price: number;
    flyerUrl: string;
    eventBannerUrl?: string;
    participantCount: number;
    createdBy: {
        id: number;
        fullName: string;
        email: string;
    };
}

export default function EventDetailPage() {
    const router = useRouter();
    const { slug } = useParams();
    const { isLoggedIn, loading: authLoading } = useAuth();

    const [event, setEvent] = useState<EventType | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRecom, setLoadingRecom] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [hasRegistered, setHasRegistered] = useState(false);
    const [hasAttended, setHasAttended] = useState(false);
    const [isWithinAttendWindow, setIsWithinAttendWindow] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const slugStr = Array.isArray(slug) ? slug[0] : slug;
        const parts = slugStr.split("-");
        const id = Number(parts[parts.length - 1]);
        if (isNaN(id)) {
            router.replace("/404");
            return;
        }

        const fetch = async () => {
            try {
                const data = await getEventById(id);
                setEvent(data);

                try {
                    setLoadingRecom(true);
                    const all = await getAllEvents();
                    const filtered = all.filter((e: EventType) => e.id !== id);
                    setEvents(filtered);
                } catch (err) {
                    console.error("Gagal fetch rekomendasi:", err);
                } finally {
                    setLoadingRecom(false);
                }

                if (isLoggedIn) {
                    try {
                        const res = await checkUserRegistration(id);
                        setHasRegistered(res.isRegistered);
                        if (res.isAttended) setHasAttended(true);
                    } catch (err) {
                        console.error("Gagal cek registrasi:", err);
                    }
                }
            } catch (err) {
                console.error(err);
                router.replace("/404");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [slug, isLoggedIn, router]);

    useEffect(() => {
        if (!event) return;

        const updateWindow = () => {
            // Ambil tanggal dari event.date
            const datePart = new Date(event.date).toISOString().split("T")[0]; // "2025-10-24"

            // Ambil jam dari event.time
            const [hours, minutes] = event.time.split(":").map(Number);

            // Gabungkan tanggal dan waktu (anggap waktu lokal WIB)
            const start = new Date(datePart);
            start.setHours(hours, minutes, 0, 0);

            const now = new Date();
            const diffMinutes = (now.getTime() - start.getTime()) / (1000 * 60);
            setIsWithinAttendWindow(diffMinutes >= 0 && diffMinutes <= 120);
        };

        updateWindow();
        const t = setInterval(updateWindow, 30 * 1000);
        return () => clearInterval(t);
    }, [event]);

    const handleVerifyOtp = async (otp: string) => {
        if (!event) return false;
        try {
            await attendEvent(event.id, otp);
            setHasAttended(true);
            toast.success("Kehadiran berhasil dicatat!");
            setIsOtpOpen(false);
            return true;
        } catch (err) {
            console.error(err);
            toast.error("Token salah atau sudah dipakai.");
            return false;
        }
    };

    const handleRegisterClick = () => {
        if (!isLoggedIn) {
            toast.error("Silakan login terlebih dahulu untuk mendaftar.");
            router.push("/login");
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async () => {
        if (!event) return;
        if (event.price > 0 && !paymentProof) {
            toast.error("Bukti pembayaran wajib diunggah untuk event berbayar.");
            return;
        }
        try {
            setSubmitting(true);
            await registerForEvent(event.id, paymentProof || undefined);
            setIsModalOpen(false);
            setHasRegistered(true);
            toast.success("Berhasil mendaftar ke event!");
        } catch (err) {
            console.error(err);
            toast.error("Gagal mendaftar event");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return <p className="text-center py-20">Loading...</p>;
    if (!event) return <p className="text-center py-20">Event tidak ditemukan</p>;

    return (
        <main>
            <EventDetailHero
                event={event}
                hasRegistered={hasRegistered}
                hasAttended={hasAttended}
                onRegister={handleRegisterClick}
                onOpenOtp={() => setIsOtpOpen(true)}
                isWithinAttendWindow={isWithinAttendWindow}
            />

            <section className="container mx-auto pt-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-0">
                <div className="flex flex-col gap-4 order-2 md:order-1">
                    <h2 className="text-2xl font-semibold">Rekomendasi Event</h2>
                    <div className="flex flex-col gap-6">
                        {loadingRecom ? (
                            Array.from({ length: 4 }).map((_, i) => <SmallEventCardSkeleton key={i} />)
                        ) : events.length === 0 ? (
                            <p className="col-span-4 text-center py-6">Tidak ada event.</p>
                        ) : (
                            events.slice(0, 4).map((ev) => <SmallEventCard key={ev.id} event={ev} />)
                        )}
                    </div>
                </div>

                {/* Event Details */}
                <div
                    className="tiptap w-full col-span-2 order-1 md:order-2"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                />

            </section>

            <RegistrationModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setPaymentProof={setPaymentProof}
                handleSubmit={handleSubmit}
                submitting={submitting}
                event={event}
            />

            {isOtpOpen && (
                <OtpModal
                    onClose={() => setIsOtpOpen(false)}
                    onSubmit={handleVerifyOtp}
                    length={undefined}
                />
            )}
        </main>
    );
}
