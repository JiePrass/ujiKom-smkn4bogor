"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllEvents } from "@/lib/api/event";
import { uploadGallery } from "@/lib/api/gallery";
import { Event } from "@/types/model";
import { EventSelector } from "@/components/shared/eventSelector";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function CreateGalleryPage() {
    const router = useRouter();

    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
                setEvents(data);
            } catch (error) {
                console.error("Gagal mengambil data event:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setMedia((prev) => [...prev, ...files]);
        setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    };

    const handleRemoveImage = (index: number) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEvent) {
            Swal.fire("Peringatan", "Silakan pilih event terlebih dahulu.", "warning");
            return;
        }

        if (media.length === 0) {
            Swal.fire("Peringatan", "Silakan unggah minimal satu gambar.", "warning");
            return;
        }

        try {
            setLoading(true);
            await uploadGallery({
                eventId: selectedEvent,
                caption,
                media,
            });

            Swal.fire({
                title: "Berhasil!",
                text: "Galeri berhasil ditambahkan.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            router.push("/admin/gallery");
        } catch (error) {
            console.error(error);
            Swal.fire("Gagal", "Terjadi kesalahan saat mengunggah galeri.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Manajemen Galeri</h1>

                    <div className="mt-2">
                        <EventSelector
                            events={events.map((e) => ({
                                id: e.id,
                                title: e.title,
                            }))}
                            selectedEvent={selectedEvent}
                            setSelectedEvent={setSelectedEvent}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-6">
                    {/* Upload Section */}
                    <div className="flex flex-wrap gap-4">
                        {/* Image Previews */}
                        {previews.map((url, idx) => (
                            <div
                                key={idx}
                                className="relative w-60 aspect-square border rounded-md overflow-hidden bg-gray-50"
                            >
                                <Image
                                    src={url}
                                    alt={`Preview ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}

                        {/* Upload Button */}
                        <div className="w-60">
                            <label
                                htmlFor="media"
                                className="relative mt-2 w-full aspect-square border rounded-md flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                <span className="text-sm text-gray-500 text-center px-3">
                                    Klik untuk pilih gambar
                                </span>
                                <input
                                    id="media"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                </div>

                {/* Caption Section */}
                <div className="flex-1 min-w-[300px]">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                        id="caption"
                        placeholder="Tulis caption untuk galeri..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="min-h-[140px] mt-2"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-sm"
                    >
                        {loading ? "Mengunggah..." : "Simpan Galeri"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
