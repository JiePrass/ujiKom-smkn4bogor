"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateEvent } from "@/lib/api/event";
import { Event } from "@/types/model";
import { X } from "lucide-react";

interface EditEventModalProps {
    event: Event;
    onClose: () => void;
    onUpdated?: () => void;
}

export default function EditEventModal({ event, onClose, onUpdated }: EditEventModalProps) {
    const [form, setForm] = useState({
        title: event.title,
        description: event.description || "",
        location: event.location,
        date: event.date.split("T")[0],
        time: event.time || "",
        price: event.price || 0,
        flyer: null as File | null,
    });
    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<HTMLFormElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setForm(prev => ({ ...prev, flyer: file }));
            setFlyerPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setForm(prev => ({ ...prev, flyer: null }));
        setFlyerPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateEvent(event.id, {
                title: form.title,
                description: form.description,
                location: form.location,
                date: form.date,
                time: form.time,
                price: form.price,
                flyer: form.flyer || undefined,
            });
            alert("Event berhasil diperbarui.");
            onUpdated?.();
            onClose();
        } catch (error) {
            console.error("Gagal update event:", error);
            alert("Gagal update event.");
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <form
                ref={modalRef}
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-xl font-bold">Edit Event</h2>

                <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Judul Event"
                />

                <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Deskripsi Event"
                />

                <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Lokasi"
                />

                <div className="flex gap-2">
                    <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    <Input
                        type="time"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                </div>

                <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="Harga"
                />

                <div>
                    <Input
                        id="flyer"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {flyerPreview && (
                        <div className="relative mt-3 w-48 h-48 border rounded overflow-hidden bg-gray-100">
                            <Image
                                src={flyerPreview}
                                alt="Preview flyer"
                                fill
                                className="object-contain w-full"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
