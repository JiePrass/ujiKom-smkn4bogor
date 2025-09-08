"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/model";
import { Button } from "../ui/button";
import { Calendar, Edit, Fullscreen, MapPin, Trash2 } from "lucide-react";
import ImageFullscreenModal from "./imageFullScreenModal";
import { deleteEvent } from "@/lib/api/event";
import EditEventModal from "./editEventModal";
import { AnimatePresence, motion } from "framer-motion";

interface EventCardProps {
    event: Event;
    isAdmin?: boolean;
    onEventUpdated?: () => void;
}

export default function EventCard({ event, isAdmin, onEventUpdated }: EventCardProps) {
    const [showEdit, setShowEdit] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const handleViewDetail = () => {
        const slug = slugify(event.title);
        router.push(`/event/${slug}-${event.id}`);
    };

    const handleDelete = async () => {
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
            <Card className="flex flex-col pt-[16px] px-[16px] pb-[24px] h-full rounded-[12px] gap-[20px]">
                <div className="flex w-full bg-gray-100 rounded-[4px] relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    {event.flyerUrl ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${event.flyerUrl}`}
                            alt={event.title}
                            width={400}
                            height={250}
                            className="w-full h-56 object-contain mx-auto"
                        />
                    ) : (
                        <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                            Tidak ada flyer
                        </div>
                    )}

                    <div className="absolute top-2 right-2 flex items-center">
                        <AnimatePresence mode="wait">
                            {(!isHovered || !isAdmin) && (
                                <motion.span
                                    key="price-label"
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-full text-sm px-3 py-1 font-medium shadow"
                                >
                                    {event.price && event.price > 0
                                        ? `Rp ${event.price.toLocaleString()}`
                                        : "Free"}
                                </motion.span>
                            )}

                            {isHovered && isAdmin && (
                                <motion.div
                                    key="admin-buttons"
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex gap-2"
                                >
                                    <Button
                                        onClick={() => setShowEdit(true)}
                                        className="rounded-full w-8 h-8 bg-white text-black hover:bg-gray-200"
                                    >
                                        <Edit size={16} />
                                    </Button>
                                    <Button
                                        onClick={handleDelete}
                                        className="rounded-full w-8 h-8 bg-white text-red-500 hover:bg-gray-200"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute bottom-2 right-2 rounded-full w-8 h-8 bg-white text-black hover:bg-gray-200"
                    >
                        <Fullscreen size={16} />
                    </Button>
                </div>

                <CardHeader className="flex flex-col gap-1 p-0">
                    <CardTitle className="text-[24px]">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                        {event.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-0 flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={16} /> {event.location}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={16} /> {formattedDate}
                    </span>
                </CardContent>
                <Button className="w-full rounded-full" onClick={handleViewDetail}>Lihat Detail</Button>
            </Card>

            {/* Pakai Modal Modular */}
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
