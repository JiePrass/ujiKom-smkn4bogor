"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getRegistrationsByEvent, updatePaymentStatus } from "@/lib/api/registration";
import { getAllEvents } from "@/lib/api/event";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Event {
    id: number;
    title: string;
}

interface Registration {
    id: number;
    user: {
        fullName: string;
        email: string;
    };
    status: "PENDING" | "APPROVED" | "REJECTED";
    paymentProofUrl?: string | null;
}

export default function AdminParticipantPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

    // Ambil daftar event
    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await getAllEvents();
                setEvents(data);

                // 🚀 Set default event pertama
                if (data.length > 0) {
                    setSelectedEvent(data[0].id);
                    fetchRegistrations(data[0].id);
                }
            } catch (err) {
                console.error("Gagal fetch events:", err);
            }
        }
        fetchEvents();
    }, []);

    // Ambil daftar registrasi kalau event berubah
    useEffect(() => {
        if (selectedEvent) {
            fetchRegistrations(selectedEvent);
        }
    }, [selectedEvent]);

    async function fetchRegistrations(eventId: number) {
        try {
            const data = await getRegistrationsByEvent(eventId);
            setRegistrations(data);
        } catch (err) {
            console.error("Gagal fetch registrations:", err);
        }
    }

    async function handleStatusUpdate(id: number, status: "PENDING" | "APPROVED" | "REJECTED") {
        try {
            await updatePaymentStatus(id, status);
            if (selectedEvent) {
                fetchRegistrations(selectedEvent);
            }
        } catch (err) {
            console.error("Gagal update status:", err);
        }
    }

    console.log("regis: ", registrations)

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Pendaftaran Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Dropdown pilih event */}
                    <Select
                        value={selectedEvent ? selectedEvent.toString() : undefined}
                        onValueChange={(val) => setSelectedEvent(Number(val))}
                    >
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Pilih Event" />
                        </SelectTrigger>
                        <SelectContent>
                            {events.map((event) => (
                                <SelectItem key={event.id} value={event.id.toString()}>
                                    {event.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Tabel daftar peserta */}
                    {registrations.length > 0 ? (
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Nama Peserta</th>
                                        <th className="p-2 text-left">Email</th>
                                        <th className="p-2 text-left">Status</th>
                                        <th className="p-2 text-left">Bukti</th>
                                        <th className="p-2 text-left">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map((reg) => (
                                        <tr key={reg.id} className="border-b">
                                            <td className="p-2">{reg.user.fullName}</td>
                                            <td className="p-2">{reg.user.email}</td>
                                            <td className="p-2">
                                                <Badge
                                                    variant={
                                                        reg.status === "APPROVED"
                                                            ? "default"
                                                            : reg.status === "REJECTED"
                                                                ? "destructive"
                                                                : "secondary"
                                                    }
                                                >
                                                    {reg.status}
                                                </Badge>
                                            </td>
                                            <td className="p-2">
                                                {reg.paymentProofUrl ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setProofPreview(reg.paymentProofUrl!)}
                                                    >
                                                        Lihat
                                                    </Button>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="p-2 space-x-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusUpdate(reg.id, "APPROVED")}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleStatusUpdate(reg.id, "REJECTED")}
                                                >
                                                    Reject
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Belum ada peserta untuk event ini.</p>
                    )}
                </CardContent>
            </Card>

            {/* Modal preview bukti pembayaran */}
            <Dialog open={!!proofPreview} onOpenChange={() => setProofPreview(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Bukti Pembayaran</DialogTitle>
                    </DialogHeader>
                    {proofPreview && (
                        <Image
                            src={proofPreview.startsWith("http") ? proofPreview : `${process.env.NEXT_PUBLIC_API_URL}${proofPreview}`}
                            alt="Bukti Pembayaran"
                            className="w-full rounded-lg"
                            width={500}
                            height={500}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
