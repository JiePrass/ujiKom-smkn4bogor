"use client"

import { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/api/event";
import { Event } from "@/types/model";
import Link from "next/link";
import EventCard from "../shared/cards/eventCard";
import EventCardSkeleton from "../shared/cards/eventCardSkeleton";

export default function EventSection() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
                setEvents(data);
            } catch (error) {
                console.error("Gagal mengambil data event:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <section className="container mx-auto px-6 md:px-0" aria-label="Event Terbaru">
            <div className="flex justify-between items-center">
                <h2 className="text-5xl font-bold mb-6">Ikuti Berbagai Event Menarik</h2>
                <Link href="/events" className="text-lg pr-4 underline font-medium">Lihat Semua</Link>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mt-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
                ) : events.length === 0 ? (
                    <p className="col-span-4 text-center py-6">Tidak ada event.</p>
                ) : (
                    events.slice(0, 4).map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </div>
        </section>
    )
}
