import Image from "next/image";
import { Button } from "../ui/button";
import {
    CalendarDaysIcon,
    MapPinIcon,
    CurrencyDollarIcon,
    ClockIcon,
} from "@heroicons/react/24/solid";

interface EventType {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price: number;
    flyerUrl: string;
    eventBannerUrl?: string;
    backgroundUrl?: string;
    participantCount: number;
    createdBy: {
        id: number;
        fullName: string;
        email: string;
    };
}

function formatEventDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function EventDetailHero({
    event,
    hasRegistered,
    hasAttended,
    onRegister,
    onOpenOtp,
    isWithinAttendWindow,
}: {
    event: EventType;
    hasRegistered: boolean;
    hasAttended: boolean;
    onRegister: () => void;
    onOpenOtp: () => void;
    isWithinAttendWindow: boolean;
}) {
    const heroSrc = event.eventBannerUrl ?? event.flyerUrl;

    return (
        <section className="relative w-full min-h-[500px]">
            {/* Background image + overlay */}
            <div className="relative w-full h-[360px] md:h-[420px] lg:h-[500px]">
                <Image
                    src={`${heroSrc}`}
                    alt={event.title}
                    fill
                    className="object-cover object-center filter grayscale contrast-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            <div className="mx-auto container -mt-24 md:-mt-88 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Flyer */}
                    <div className="md:col-span-1 flex justify-center md:justify-start">
                        <div className="w-40 md:w-52 lg:w-80 -mt-6 md:-mt-12 shadow-lg">
                            <Image
                                src={`${event.flyerUrl}`}
                                alt={`${event.title} flyer`}
                                width={400}
                                height={600}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2 text-white flex flex-col justify-between">
                        <h1 className="text-2xl md:text-5xl font-extrabold leading-tight">
                            {event.title}
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-gray-200">
                            Diselenggarakan oleh{" "}
                            <span className="font-semibold text-white">
                                {event.createdBy.fullName}
                            </span>
                        </p>

                        <div className="mt-8 flex gap-12 text-sm md:text-sm text-gray-200">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDaysIcon className="w-5 h-5 text-white" />
                                    <span>{formatEventDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="w-5 h-5 text-white" />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-5 h-5 text-white" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CurrencyDollarIcon className="w-5 h-5 text-white" />
                                    <span>
                                        {event.price > 0
                                            ? `Rp ${event.price.toLocaleString("id-ID")}`
                                            : "Gratis"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            {!hasRegistered ? (
                                <Button
                                    onClick={onRegister}
                                    className="rounded-full px-6 py-2 text-sm"
                                >
                                    Daftar Sekarang
                                </Button>
                            ) : (
                                <>
                                    <Button disabled className="rounded-full px-5 py-2 text-sm">
                                        ✅ Sudah Mendaftar
                                    </Button>

                                    {!hasAttended && isWithinAttendWindow && (
                                        <Button
                                            onClick={onOpenOtp}
                                            className="rounded-full px-5 py-2 text-sm bg-green-600 hover:bg-green-700"
                                        >
                                            Hadir Sekarang
                                        </Button>
                                    )}

                                    {hasAttended && (
                                        <Button
                                            disabled
                                            className="rounded-full px-5 py-2 text-sm bg-gray-400"
                                        >
                                            ✅ Kehadiran Tercatat
                                        </Button>
                                    )}
                                </>
                            )}

                            <Button
                                variant="ghost"
                                className="rounded-full px-5 py-2 text-sm"
                            >
                                Detail Event
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
