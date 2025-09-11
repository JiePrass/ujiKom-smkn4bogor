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

export function EventSelector({ events, selectedEvent, setSelectedEvent }: {
    events: { id: number; title: string }[];
    selectedEvent: number | null;
    setSelectedEvent: (val: number | null) => void;
}) {
    const [open, setOpen] = React.useState(false);

    const selected = events.find((e) => e.id === selectedEvent);

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
                                        setSelectedEvent(event.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedEvent === event.id ? "opacity-100" : "opacity-0"
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
