"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

type EventSummary = {
    id: number;
    title: string;
    qrCodeUrl?: string;
};

export function RegisterEventSelector({ events, selectedEvent, setSelectedEvent, onEventChange, }: {
    events: EventSummary[];
    selectedEvent: EventSummary | null;
    setSelectedEvent: (val: EventSummary | null) => void;
    onEventChange?: (eventId: number) => void;
}) {
    const [open, setOpen] = React.useState(false);

    const selected = selectedEvent;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between rounded-sm"
                >
                    {selected ? selected.title : "Pilih Event..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Cari event..." />
                    <CommandList>
                        <CommandEmpty>Event tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {events.map((event) => (
                                <CommandItem
                                    key={event.id}
                                    value={event.title}
                                    onSelect={() => {
                                        setSelectedEvent(event);
                                        onEventChange?.(event.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedEvent?.id === event.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {event.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
