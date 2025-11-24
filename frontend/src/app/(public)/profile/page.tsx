"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, FileText, Filter, Inbox } from "lucide-react";
import { getUserProfile } from "@/lib/api/user";
import { useAuth } from "@/context/authContext";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/shared/searchBar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EventCardSkeleton from "@/components/shared/cards/eventCardSkeleton";
import EventCard from "@/components/shared/cards/eventCard";
import CertificateSkeleton from "@/components/shared/cards/certificateCardSkeleton";
import CertificateCard from "@/components/shared/cards/certificateCard";
import { Event } from "@/types/model";
import EditProfileModal from "@/components/shared/modals/editProfileModal";

interface Certificate {
    id: number;
    eventTitle: string;
    eventDate: string;
    issuedAt: string;
    url: string;
}

interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    education: string;
    profilePicture: string | null;
    bannerUrl: string | null;
    certificates: Certificate[];
    events: Event[];
    isVerified: boolean
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

export default function ProfilePage() {
    const { user: authUser, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // search & filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"newest" | "oldest">("newest");

    useEffect(() => {
        async function fetchProfile() {
            if (!authUser?.id) return;
            try {
                const data = await getUserProfile(authUser.id);
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setLoading(false);
            }
        }
        if (!authLoading) fetchProfile();
    }, [authUser, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="animate-pulse">
                {/* Banner */}
                <div className="h-40 sm:h-56 md:h-72 w-full bg-gray-300" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="-mt-20 sm:-mt-24 flex flex-col sm:flex-row gap-6 items-start sm:items-end">

                        {/* Profile Picture */}
                        <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gray-300 rounded-md" />

                        <div className="flex flex-col sm:flex-row justify-between w-full mb-8 sm:mb-12 gap-4 sm:gap-0">

                            {/* User Info */}
                            <div className="flex flex-col gap-4 w-full max-w-[380px]">
                                <div className="h-6 w-40 bg-gray-300 rounded" />
                                <div className="h-4 w-52 bg-gray-300 rounded" />
                                <div className="h-4 w-32 bg-gray-300 rounded" />
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-8 sm:gap-12">
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 w-20 bg-gray-300 rounded" />
                                    <div className="h-6 w-10 bg-gray-300 rounded" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 w-24 bg-gray-300 rounded" />
                                    <div className="h-6 w-10 bg-gray-300 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.log({ profile })

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">User profile not found.</p>
            </div>
        );
    }

    // filtering logic
    const filterList = <T,>(
        list: T[],
        getTitle: (item: T) => string,
        getDate: (item: T) => string
    ): T[] => {
        let result = list.filter((item) =>
            getTitle(item).toLowerCase().includes(searchQuery.toLowerCase())
        );

        result = result.sort((a, b) => {
            const da = new Date(getDate(a)).getTime();
            const db = new Date(getDate(b)).getTime();
            return filterType === "newest" ? db - da : da - db;
        });

        return result;
    };

    const filteredCertificates = filterList(
        profile.certificates,
        (c) => c.eventTitle ?? "",
        (c) => c.eventDate ?? c.issuedAt
    );

    const filteredEvents = filterList(
        profile.events,
        (e) => e.title ?? "",
        (e) => e.date
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <Icon className="w-16 h-16 mb-4 text-gray-400" />
            <p>{message}</p>
        </div>
    );

    return (
        <div>
            {/* Banner */}
            <div className="relative -z-10 h-40 sm:h-56 md:h-72 w-full">
                {profile.bannerUrl ? (
                    <Image
                        src={`${profile.bannerUrl}`}
                        alt="Banner"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800" />
                )}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="-mt-20 sm:-mt-24 flex flex-col sm:flex-row gap-6 items-start sm:items-end">

                    {/* Profile Picture */}
                    {profile.profilePicture ? (
                        <Image
                            src={`${profile.profilePicture}`}
                            alt={profile.fullName}
                            width={160}
                            height={160}
                            className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded-md shadow"
                        />
                    ) : (
                        <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 flex items-center justify-center bg-gray-700 text-white text-xl sm:text-2xl md:text-3xl font-semibold rounded-md shadow">
                            {getInitials(profile.fullName)}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between w-full mb-8 sm:mb-12 gap-4 sm:gap-0">
                        {/* User Info */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4 flex-wrap">
                                <h2 className="text-2xl sm:text-3xl font-semibold">{profile.fullName}</h2>
                                <EditProfileModal
                                    userId={profile.id}
                                    profile={profile}
                                    onUpdated={() => {
                                        if (authUser?.id) getUserProfile(authUser.id).then(setProfile);
                                    }}
                                />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-gray-600">{profile.email}</p>

                                    {!profile?.isVerified && (
                                        <div className="flex items-center gap-1 text-red-600 text-sm">
                                            <span>Belum diverifikasi</span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-blue-600 underline p-0"
                                                onClick={() =>
                                                    (window.location.href = `/verify-email?email=${profile.email}`)
                                                }
                                            >
                                                Verifikasi sekarang
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600">{profile.education}</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 sm:gap-12">
                            <div className="flex flex-col gap-2 text-center sm:text-left">
                                <p className="text-gray-500">Total Event</p>
                                <div className="flex items-center gap-1 justify-center sm:justify-start">
                                    <Calendar className="text-gray-600" />
                                    <p className="font-bold text-xl sm:text-2xl">{profile.events.length}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-center sm:text-left">
                                <p className="text-gray-500">Total Sertifikat</p>
                                <div className="flex items-center gap-1 justify-center sm:justify-start">
                                    <FileText className="text-gray-600" />
                                    <p className="font-bold text-xl sm:text-2xl">
                                        {profile.certificates.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="certificates" className="my-10">
                    <div className="flex flex-wrap justify-between items-center border-b gap-3 pb-2">
                        <TabsList className="bg-transparent p-0 border-none flex flex-wrap">
                            <TabsTrigger
                                value="certificates"
                                className="rounded-none px-3 py-2 text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
                            >
                                Sertifikat
                            </TabsTrigger>
                            <TabsTrigger
                                value="events"
                                className="rounded-none px-3 py-2 text-gray-500 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black"
                            >
                                Event
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 flex-wrap">
                            <SearchBar
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari..."
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 p-0 aspect-square w-9 h-9 rounded-md"
                                    >
                                        <Filter size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setFilterType("newest")}>Terbaru</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType("oldest")}>Terlama</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Certificates */}
                    <TabsContent value="certificates" className="mt-6">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <CertificateSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredCertificates.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredCertificates.map((cert) => (
                                    <CertificateCard key={cert.id} certificate={cert} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon={FileText} message="Belum ada sertifikat yang tersedia." />
                        )}
                    </TabsContent>

                    {/* Events */}
                    <TabsContent value="events" className="mt-6">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <EventCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState icon={Inbox} message="Belum ada event yang diikuti." />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
