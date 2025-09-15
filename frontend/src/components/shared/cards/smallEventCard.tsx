"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { Event } from "@/types/model";
import { Calendar, MapPin, FileImage } from "lucide-react";
import ImageFullscreenModal from "../modals/imageFullScreenModal";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
    event: Event;
}

export default function MinimalEventCard({ event }: EventCardProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
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

    return (
        <>
            <Card className="w-full rounded-2xl border border-gray-100 shadow-sm p-5 bg-white flex flex-col gap-4">
                {/* Judul + Deskripsi */}
                <CardHeader className="p-0">
                    <div className="flex justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            {event.title}
                        </CardTitle>
                        <Badge
                            variant="outline"
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                        >
                            {event.price && event.price > 0
                                ? `Rp ${event.price.toLocaleString()}`
                                : "Gratis"}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </CardHeader>

                {/* Info Tambahan */}
                <CardContent className="p-0 text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} /> {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} /> {formattedDate}
                        </div>
                    </div>
                </CardContent>

                {/* Tombol Aksi */}
                <CardFooter className="flex gap-2 items-center p-0 pt-2">
                    <Button
                        size="sm"
                        onClick={handleViewDetail}
                        className="rounded-md"
                    >
                        Lihat Detail
                    </Button>

                    {event.flyerUrl && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsFullscreen(true)}
                            className="rounded-md"
                        >
                            <FileImage />
                            Flyer
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {/* Modal Flyer */}
            {event.flyerUrl && (
                <ImageFullscreenModal
                    isOpen={isFullscreen}
                    imageUrl={`${process.env.NEXT_PUBLIC_API_URL}${event.flyerUrl}`}
                    alt={event.title}
                    onClose={() => setIsFullscreen(false)}
                />
            )}
        </>
    );
}
