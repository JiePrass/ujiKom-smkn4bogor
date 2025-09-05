"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Event {
    id: number;
    title: string;
}

interface Props {
    events: Event[];
    selectedEvent: number | null;
    onChange: (id: number) => void;
}

export default function EventSelector({ events, selectedEvent, onChange }: Props) {
    return (
        <Select
            value={selectedEvent ? selectedEvent.toString() : ""}
            onValueChange={(val) => onChange(Number(val))}
        >
            <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Pilih Event" />
            </SelectTrigger>
            <SelectContent>
                {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
