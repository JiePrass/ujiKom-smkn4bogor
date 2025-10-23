"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getAllEvents } from "@/lib/api/event";
import { Event } from "@/types/model";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/shared/cards/eventCard";
import EventCardSkeleton from "@/components/shared/cards/eventCardSkeleton";
import SearchBar from "@/components/shared/searchBar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CalendarDaysIcon,
    ClockIcon,
    CurrencyDollarIcon,
    MapPinIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, SortAsc } from "lucide-react";

function stripHtml(html: string) {
    return html
        .replace(/<\/(p|div|br|li|h[1-6])>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [heroEvents, setHeroEvents] = useState<Event[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("date-asc");
    const [page, setPage] = useState(1);

    const itemsPerPage = 12;
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await getAllEvents();
                const today = new Date();

                const upcoming = (res || []).filter(
                    (e: Event) => new Date(e.date).getTime() >= today.getTime()
                );

                const sorted = upcoming.sort(
                    (a: Event, b: Event) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                setEvents(res || []);
                setHeroEvents(sorted.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Auto slide hero carousel
    useEffect(() => {
        if (!heroEvents.length) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroEvents.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroEvents]);

    const eventTypes = Array.from(new Set(events.map((e) => e.eventType)));

    // Filter & Search
    let filteredEvents = events.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
    );
    if (filterType !== "all") {
        filteredEvents = filteredEvents.filter((e) => e.eventType === filterType);
    }

    // Sort
    filteredEvents = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case "date-asc":
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case "date-desc":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const paginatedEvents = filteredEvents.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleViewDetail = () => {
        const currentEvent = heroEvents[currentIndex];
        if (!currentEvent) return;

        const slug = slugify(currentEvent.title);
        router.push(`/event/${slug}-${currentEvent.id}`);
    };

    return (
        <>
            {/* Hero Section */}
            <div className="relative mb-12 overflow-hidden">
                {loading ? (
                    <div className="flex justify-between gap-6 items-center h-[400px] md:h-[500px] p-8">
                        <div className="flex flex-col gap-4 w-full max-w-lg">
                            <Skeleton className="h-9 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex gap-12 w-full">
                                <div className="flex flex-col gap-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                        <Skeleton className="aspect-[1/1.4142] h-full w-fit" />
                    </div>
                ) : heroEvents.length > 0 ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={heroEvents[currentIndex]?.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative flex flex-col md:flex-row items-center"
                        >
                            {/* Background Banner */}
                            <Image
                                src={
                                    heroEvents[currentIndex]?.eventBannerUrl
                                        ? `${heroEvents[currentIndex].eventBannerUrl}`
                                        : "/images/placeholder-banner.png"
                                }
                                alt="Banner"
                                fill
                                className="object-cover absolute inset-0 saturate-0 z-0"
                            />
                            <div className="absolute inset-0 bg-black/30 z-10" />
                            {/* Content */}
                            <div className="relative z-20 grid py-24 grid-cols-1 md:grid-cols-2 w-full p-6 gap-6 items-center">
                                <div className="text-white order-2 md:order-1">
                                    <h2 className="text-4xl font-bold mb-6">
                                        {heroEvents[currentIndex]?.title}
                                    </h2>
                                    <p className="text-gray-200 mb-4 line-clamp-2 max-w-lg">
                                        {stripHtml(heroEvents[currentIndex]?.description || "")}
                                    </p>
                                    <div className="mt-4 flex gap-12 text-sm md:text-base text-gray-200">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarDaysIcon className="w-5 h-5 text-white" />
                                                <span>
                                                    {new Date(
                                                        heroEvents[currentIndex]?.date
                                                    ).toLocaleDateString("id-ID")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon className="w-5 h-5 text-white" />
                                                <span>{heroEvents[currentIndex]?.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="w-5 h-5 text-white" />
                                                <span>{heroEvents[currentIndex]?.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CurrencyDollarIcon className="w-5 h-5 text-white" />
                                                <span>
                                                    {heroEvents[currentIndex]?.price > 0
                                                        ? `Rp ${heroEvents[
                                                            currentIndex
                                                        ]?.price.toLocaleString("id-ID")}`
                                                        : "Gratis"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <Button onClick={handleViewDetail}>Lihat Detail</Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleViewDetail}
                                            className="text-white"
                                        >
                                            Daftar Sekarang
                                        </Button>
                                    </div>
                                </div>

                                {/* Flyer */}
                                <div className="flex justify-center order-1 md:order-1 md:justify-end items-center">
                                    <div className="w-40 md:w-52 lg:w-80">
                                        <Image
                                            src={`${heroEvents[currentIndex]?.flyerUrl}`}
                                            alt={`${heroEvents[currentIndex]?.title} flyer`}
                                            width={400}
                                            height={600}
                                            className="w-full h-auto aspect-[1/1.4142] object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <p className="text-gray-500 p-8">Tidak ada event mendatang.</p>
                )}

                {/* Carousel Dots */}
                {!loading && heroEvents.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
                        {heroEvents.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition ${idx === currentIndex ? "bg-white" : "bg-gray-500"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* List Section */}
            <div className="flex flex-col container mx-auto px-6 mb-20">
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 md:items-center">
                    <h2 className="text-3xl font-semibold">
                        Hari ini mau ikut event apa?
                    </h2>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <SearchBar
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari event..."
                            className="w-full md:w-64"
                        />

                        {/* Filter (icon only) */}
                        <Select value={filterType} onValueChange={(val) => setFilterType(val)}>
                            <SelectTrigger className="px-2">
                                <Filter /> Filter
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                {eventTypes.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort (icon only) */}
                        <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                            <SelectTrigger className="px-2">
                                <SortAsc /> Sort
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-asc">Tanggal Terdekat</SelectItem>
                                <SelectItem value="date-desc">Tanggal Terjauh</SelectItem>
                                <SelectItem value="price-asc">Harga Termurah</SelectItem>
                                <SelectItem value="price-desc">Harga Termahal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Event Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading ? (
                        Array.from({ length: itemsPerPage }).map((_, idx) => (
                            <EventCardSkeleton key={idx} />
                        ))
                    ) : paginatedEvents.length > 0 ? (
                        paginatedEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p className="text-gray-500">Tidak ada event ditemukan.</p>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={page === i + 1}
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </>
    );
}
