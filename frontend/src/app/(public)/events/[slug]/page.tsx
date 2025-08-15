"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getEventById } from "@/lib/api/event";
import { registerForEvent } from "@/lib/api/registration";
import { useAuth } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkUserRegistration } from "@/lib/api/registration";
import RegistrationModal from "@/components/shared/registrationModal";

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
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [hasRegistered, setHasRegistered] = useState(false);

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
                // 1️⃣ Ambil detail event
                const data = await getEventById(id);
                setEvent(data);

                // 2️⃣ Cek status pendaftaran user (kalau sudah login)
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
            alert("Silakan login terlebih dahulu untuk mendaftar.");
            router.push("/login");
        } else {
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async () => {
        if (!event) return;
        if (event.price > 0 && !paymentProof) {
            alert("Bukti pembayaran wajib diunggah untuk event berbayar.");
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
            alert("Gagal mendaftar event");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Flyer */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-6">
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${event.flyerUrl}`}
                    alt={event.title}
                    width={1200}
                    height={700}
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* Info Event */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-3xl">{event.title}</CardTitle>
                    <CardDescription>
                        Diselenggarakan oleh <span className="font-medium">{event.createdBy.fullName}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h2 className="font-semibold mb-1">📅 Tanggal & Waktu</h2>
                        <p>{eventDate}</p>
                        <p>Pukul {event.time} WIB</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h2 className="font-semibold mb-1">📍 Lokasi</h2>
                        <p>{event.location}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h2 className="font-semibold mb-1">💰 Harga</h2>
                        <p>{event.price > 0 ? `Rp ${event.price.toLocaleString("id-ID")}` : "Gratis"}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <h2 className="font-semibold mb-1">👥 Peserta Terdaftar</h2>
                        <p>{event.participantCount} orang</p>
                    </div>
                </CardContent>
            </Card>

            {/* Deskripsi */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>📝 Deskripsi</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{event.description}</p>
                </CardContent>
            </Card>

            {/* Tombol Daftar */}
            <Button
                className="w-full rounded-full"
                onClick={handleRegisterClick}
                disabled={hasRegistered}
            >
                {hasRegistered ? "Sudah Mendaftar Event Ini" : "Daftar Sekarang"}
            </Button>

            {/* Modal Registrasi */}
            <RegistrationModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setPaymentProof={setPaymentProof} handleSubmit={handleSubmit} submitting={submitting} event={event}/>
        </div>
    );
}
