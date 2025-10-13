"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { Event } from "@/types/model";
import { Calendar, Fullscreen, MapPin, Edit, Trash2 } from "lucide-react";
import ImageFullscreenModal from "../modals/imageFullScreenModal";
import EditEventModal from "../modals/editEventModal";
import { deleteEvent } from "@/lib/api/event";

interface EventCardProps {
    event: Event;
    isAdmin?: boolean;
    onEventUpdated?: () => void;
}

export default function EventCard({ event, isAdmin, onEventUpdated }: EventCardProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const router = useRouter();

    const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const handleViewDetail = () => {
        const slug = slugify(event.title);
        router.push(`/event/${slug}-${event.id}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Hapus event "${event.title}"?`)) {
            try {
                await deleteEvent(event.id);
                alert("Event berhasil dihapus.");
                onEventUpdated?.();
            } catch (error) {
                console.error("Gagal menghapus event:", error);
                alert("Gagal menghapus event.");
            }
        }
    };

    return (
        <>
            <div
                className="relative w-full h-108 aspect-video overflow-hidden shadow-md cursor-pointer group rounded-xl"
                onClick={handleViewDetail}
            >
                {/* Background Flyer */}
                {event.flyerUrl ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${event.flyerUrl}`}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        Tidak ada flyer
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.5) 100%)`,
                        }}
                    />
                </div>

                {/* Harga / Admin Action */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <span className="text-sm px-3 py-1 rounded-full backdrop-blur-[2px] border border-white/30 text-white">
                        {event.price && event.price > 0
                            ? `Rp. ${event.price.toLocaleString()}`
                            : "Gratis"}
                    </span>
                    {isAdmin && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEdit(true);
                                }}
                                className="p-2 rounded-full backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 rounded-full backdrop-blur-md border border-white/30 text-red-400 hover:bg-white/30"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-4 w-full left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                    <div className="flex justify-end w-[90%]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsFullscreen(true);
                            }}
                            className="p-2 rounded-full backdrop-blur-md border border-white/30 text-white hover:bg-white/30"
                        >
                            <Fullscreen size={16} />
                        </button>
                    </div>
                    <div
                        className="w-[90%] px-4 py-3 flex flex-col gap-2
                    backdrop-blur-[2px] border border-white/30 rounded-lg"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-semibold text-lg truncate">{event.title}</h3>
                        </div>

                        <div className="flex justify-between text-sm text-gray-100">
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} /> {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Fullscreen */}
            <ImageFullscreenModal
                isOpen={isFullscreen}
                imageUrl={`${process.env.NEXT_PUBLIC_API_URL}${event.flyerUrl}`}
                alt={event.title}
                onClose={() => setIsFullscreen(false)}
            />

            {showEdit && (
                <EditEventModal
                    event={event}
                    onClose={() => setShowEdit(false)}
                    onUpdated={onEventUpdated}
                />
            )}
        </>
    );
}
