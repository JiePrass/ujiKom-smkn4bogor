'use client';

import { useState, useEffect } from "react";
import { getAllEvents } from "@/lib/api/event";
import { Event } from "@/types/model";
import EventCard from "@/components/shared/eventCard";


export default function Home() {
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

  if (loading) {
    return <p className="text-center py-6">Loading...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center py-6">Tidak ada event.</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Event Terbaru</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {events.slice(0, 6).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}
