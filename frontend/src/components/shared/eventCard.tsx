"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/model";
import { Button } from "../ui/button";
import { Calendar, Fullscreen, MapPin } from "lucide-react";
import ImageFullscreenModal from "./imageFullScreenModal";

export default function EventCard({ event }: { event: Event }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const router = useRouter();

    const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const handleViewDetail = () => {
        const slug = slugify(event.title);
        router.push(`/events/${slug}-${event.id}`);
    };

    return (
        <>
            <Card className="flex flex-col pt-[16px] px-[16px] pb-[24px] h-full rounded-[12px] gap-[20px]">
                <div className="flex w-full bg-gray-100 rounded-[4px] relative">
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

                    <span className="absolute top-2 bg-white rounded-full right-2 text-sm px-3 py-1 font-medium">
                        {event.price && event.price > 0 ? `Rp ${event.price.toLocaleString()}` : "Free"}
                    </span>
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
        </>
    );
}
