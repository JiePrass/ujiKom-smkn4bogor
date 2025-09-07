"use client";

import { useEffect, useState } from "react";
import {
    bulkUploadCertificates,
    mapCertificates,
    getCertificatesByEvent,
} from "@/lib/api/certificate";
import { getAllEvents } from "@/lib/api/event";
import { getRegistrationsByEvent } from "@/lib/api/registration";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

import CertificatesTable from "@/components/shared/table/certificateTable";
import UnmatchedTable from "@/components/shared/table/unmatchedTable";
import EventSelector from "@/components/shared/eventSelector";

// 🔹 Types
interface Event {
    id: number;
    title: string;
}

interface Certificate {
    id: number;
    url: string;
    registration: {
        id: number;
        user: { fullName: string; email: string };
    };
}

interface Registration {
    id: number;
    user: { fullName: string; email: string };
    status: "PENDING" | "APPROVED" | "REJECTED";
}

interface UnmatchedFile {
    filename: string;
    previewUrl: string;
}

export default function AdminCertificatesPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [unmatchedFiles, setUnmatchedFiles] = useState<UnmatchedFile[]>([]);
    const [mappings, setMappings] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [result, setResult] = useState<{ matched: number; unmatched: UnmatchedFile[] } | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // 🔹 auto clear message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // 🔹 Fetch events
    useEffect(() => {
        getAllEvents().then(setEvents).catch(console.error);
    }, []);

    // 🔹 Reset saat ganti event
    useEffect(() => {
        if (!selectedEvent) return;

        setCertificates([]);
        setRegistrations([]);
        setUnmatchedFiles([]);
        setMappings({});
        setResult(null);
        setMessage(null);

        (async () => {
            try {
                const [regs, certs] = await Promise.all([
                    getRegistrationsByEvent(selectedEvent),
                    getCertificatesByEvent(selectedEvent),
                ]);
                setRegistrations(regs.filter((r: Registration) => r.status === "APPROVED"));
                setCertificates(certs);
            } catch {
                setMessage({ type: "error", text: "Gagal memuat data event." });
            }
        })();
    }, [selectedEvent]);

    // 🔹 Upload ZIP
    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!selectedEvent || !e.target.files?.[0]) return;
        setLoading(true);
        try {
            const res = await bulkUploadCertificates(selectedEvent, e.target.files[0]);
            setResult(res);
            setUnmatchedFiles(res.unmatched || []);
            setMessage({ type: "success", text: "Upload berhasil diproses." });
        } catch {
            setMessage({ type: "error", text: "Upload gagal. Silakan coba lagi." });
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Save mapping
    async function handleSaveMapping() {
        if (!selectedEvent) return;
        const payload = Object.entries(mappings).map(([filename, registrationId]) => ({
            filename,
            registrationId,
        }));

        try {
            await mapCertificates(selectedEvent, payload);
            setMessage({ type: "success", text: "Mapping berhasil disimpan." });
            setUnmatchedFiles([]);
            setMappings({});
            // refresh certificates
            const certs = await getCertificatesByEvent(selectedEvent);
            setCertificates(certs);
        } catch {
            setMessage({ type: "error", text: "Gagal menyimpan mapping." });
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manajemen Sertifikat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 🔹 Event Selector */}
                    <EventSelector
                        events={events}
                        selectedEvent={selectedEvent}
                        onChange={setSelectedEvent}
                    />

                    {/* 🔹 Messages */}
                    {message && (
                        <Alert
                            variant={message.type === "error" ? "destructive" : "default"}
                            className="mt-2"
                        >
                            <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                    )}

                    {/* 🔹 Upload ZIP */}
                    {selectedEvent && (
                        <>
                            <div>
                                <label className="text-sm font-medium">Upload Sertifikat (ZIP)</label>
                                <Input
                                    type="file"
                                    accept=".zip"
                                    onChange={handleUpload}
                                    disabled={loading}
                                />
                                {loading && (
                                    <p className="flex items-center text-sm text-gray-500 mt-1">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sedang memproses...
                                    </p>
                                )}
                            </div>

                            {/* 🔹 Certificates Table */}
                            <h3 className="font-semibold">Sertifikat yang sudah ada</h3>
                            <CertificatesTable certificates={certificates} />

                            {/* 🔹 Unmatched Files */}
                            <UnmatchedTable
                                unmatchedFiles={unmatchedFiles}
                                registrations={registrations}
                                mappings={mappings}
                                setMappings={setMappings}
                                onSave={handleSaveMapping}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
