"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { attendEvent, getEventById } from "@/lib/api/event";
import { registerForEvent, checkUserRegistration } from "@/lib/api/registration";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RegistrationModal from "@/components/shared/registrationModal";
import OtpModal from "@/components/shared/otpModal";

interface EventType {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price: number;
    flyerUrl: string;
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
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [hasRegistered, setHasRegistered] = useState(false);
    const [hasAttended, setHasAttended] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const slugStr = Array.isArray(slug) ? slug[0] : slug;
        const slugParts = slugStr.split("-");
        const id = Number(slugParts[slugParts.length - 1]);
        if (isNaN(id)) {
            router.replace("/404");
            return;
        }

        const fetchEvent = async () => {
            try {
                const data = await getEventById(id);
                setEvent(data);

                if (isLoggedIn) {
                    try {
                        const res = await checkUserRegistration(id);
                        setHasRegistered(res.isRegistered);
                    } catch (err) {
                        console.error("Gagal cek status registrasi:", err);
                    }
                }
            } catch (err) {
                console.error(err);
                router.replace("/404");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [slug, router, isLoggedIn]);

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

    if (loading || authLoading) return <p>Loading...</p>;
    if (!event) return <p>Event tidak ditemukan</p>;

    const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

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

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Section - Flyer & Info */}
                <div className="md:col-span-1">
                    <Card className="overflow-hidden shadow-md p-0 mb-6">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${event.flyerUrl}`}
                            alt={event.title}
                            width={600}
                            height={800}
                            className="w-full h-auto object-contain"
                        />
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">📌 Info Event</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-semibold">📅 Tanggal & Waktu</p>
                                <p>{eventDate}</p>
                                <p>Pukul {event.time} WIB</p>
                            </div>
                            <div>
                                <p className="font-semibold">📍 Lokasi</p>
                                <p>{event.location}</p>
                            </div>
                            <div>
                                <p className="font-semibold">💰 Harga</p>
                                <p>{event.price > 0 ? `Rp ${event.price.toLocaleString("id-ID")}` : "Gratis"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">👥 Peserta</p>
                                <p>{event.participantCount} orang</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Section - Title, Actions, Description */}
                <div className="md:col-span-2 flex flex-col space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{event.title}</CardTitle>
                            <CardDescription>
                                Diselenggarakan oleh <span className="font-medium">{event.createdBy.fullName}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Buttons */}
                            {!hasRegistered ? (
                                <Button className="w-full md:w-auto rounded-full" onClick={handleRegisterClick}>
                                    Daftar Sekarang
                                </Button>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-3">
                                    <Button className="w-full md:w-auto rounded-full" disabled>
                                        ✅ Sudah Mendaftar
                                    </Button>

                                    {!hasAttended && (
                                        <Button
                                            className="w-full md:w-auto rounded-full bg-green-600 hover:bg-green-700"
                                            onClick={() => setIsOtpOpen(true)}
                                        >
                                            Hadir Sekarang
                                        </Button>
                                    )}

                                    {hasAttended && (
                                        <Button className="w-full md:w-auto rounded-full bg-gray-400" disabled>
                                            ✅ Kehadiran Tercatat
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>📝 Deskripsi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed text-gray-700">{event.description}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal Registrasi */}
            <RegistrationModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setPaymentProof={setPaymentProof}
                handleSubmit={handleSubmit}
                submitting={submitting}
                event={event}
            />

            {/* Modal OTP untuk presensi */}
            {isOtpOpen && (
                <OtpModal onClose={() => setIsOtpOpen(false)} onSubmit={handleVerifyOtp} length={undefined} />
            )}
        </div>
    );
}
