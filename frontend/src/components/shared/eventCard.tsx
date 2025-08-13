// src/components/event/EventCard.tsx
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/model";

export default function EventCard({ event }: { event: Event }) {
    return (
        <Card className="overflow-hidden flex flex-col">
            {/* Flyer */}
            {event.flyerUrl ? (
                <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${event.flyerUrl}`}
                    alt={event.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    Tidak ada flyer
                </div>
            )}

            <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {event.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto">
                <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString("id-ID")} • {event.time}
                </p>
                <p className="text-sm text-gray-500">{event.location}</p>

                <div className="mt-3 flex justify-between items-center">
                    <span className="font-semibold text-blue-600">
                        {event.price > 0
                            ? `Rp ${event.price.toLocaleString("id-ID")}`
                            : "Gratis"}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
