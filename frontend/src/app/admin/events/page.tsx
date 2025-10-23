// app/admin/events/page.tsx
'use client';

import { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/api/event";
import { Event } from "@/types/model";
import EventCard from "@/components/shared/cards/eventCard";
import LoadingScreen from "@/components/layout/loadingScreen";

export default function EventManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) {
        return <LoadingScreen show={loading} text="Memuat data dashboard..." />
    }

    if (events.length === 0) return <p className="text-center py-6">Tidak ada event.</p>;

    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Manajemen Event</h2>
            <div className="grid md:grid-cols-4 gap-8">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} isAdmin onEventUpdated={fetchEvents} />
                ))}
            </div>
        </>
    );
}
