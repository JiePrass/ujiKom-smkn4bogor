"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { exportRegistrationCSV, getRegistrationsByEvent, updatePaymentStatus } from "@/lib/api/registration";
import { getAllEvents } from "@/lib/api/event";
import { ArrowUpDown, Download, Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ParticipantEventSelector } from "@/components/shared/participantEventSelector";

interface Event {
    id: number;
    title: string;
}

interface Registration {
    id: number;
    user: {
        fullName: string;
        email: string;
    };
    status: "PENDING" | "APPROVED" | "REJECTED";
    paymentProofUrl?: string | null;
}

type StatusType = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function AdminParticipantPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filterStatus, setFilterStatus] = useState<StatusType>("ALL");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await getAllEvents();
                setEvents(data);

                if (data.length > 0) {
                    setSelectedEvent(data[0].id);
                    fetchRegistrations(data[0].id);
                }
            } catch (err) {
                console.error("Gagal fetch events:", err);
            }
        }
        fetchEvents();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            fetchRegistrations(selectedEvent);
        }
    }, [selectedEvent]);

    async function fetchRegistrations(eventId: number) {
        try {
            const data = await getRegistrationsByEvent(eventId);
            setRegistrations(data);
            setCurrentPage(1);
        } catch (err) {
            console.error("Gagal fetch registrations:", err);
        }
    }

    async function handleStatusUpdate(id: number, status: "PENDING" | "APPROVED" | "REJECTED") {
        try {
            await updatePaymentStatus(id, status);
            if (selectedEvent) {
                fetchRegistrations(selectedEvent);
            }
        } catch (err) {
            console.error("Gagal update status:", err);
        }
    }

    // Filter & Sort
    const filteredAndSorted = registrations
        .filter((reg) => filterStatus === "ALL" || reg.status === filterStatus)
        .sort((a, b) => {
            const nameA = a.user.fullName?.trim().toLowerCase() || "";
            const nameB = b.user.fullName?.trim().toLowerCase() || "";
            return sortOrder === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        });

    // Pagination
    const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
    const paginatedData = filteredAndSorted.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    async function handleExportCSV() {
        if (!selectedEvent) return;
        try {
            const blob = await exportRegistrationCSV(selectedEvent);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `registrations-event-${selectedEvent}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Gagal export CSV:", err);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Pendaftaran Event</h2>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        className="border bg-white p-0 border-gray-100 aspect-square rounded-sm"
                        onClick={handleExportCSV}
                        disabled={!selectedEvent}
                    >
                        <Download width={20} />
                    </Button>

                    {/* Sort */}
                    <Button
                        variant="secondary"
                        className="border bg-white p-0 border-gray-100 aspect-square rounded-sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                        <ArrowUpDown width={20} />
                    </Button>

                    {/* Filter */}
                    <div className="relative">
                        <Button
                            variant="secondary"
                            className="border bg-white p-0 border-gray-100 aspect-square rounded-sm"
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        >
                            <Funnel width={20} />
                        </Button>

                        {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-10">
                                {(["ALL", "PENDING", "APPROVED", "REJECTED"] as StatusType[]).map((status) => (
                                    <div
                                        key={status}
                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${filterStatus === status ? "bg-gray-50 font-semibold" : ""}`}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setShowFilterDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Select Event */}
                    <ParticipantEventSelector
                        events={events}
                        selectedEvent={selectedEvent}
                        setSelectedEvent={setSelectedEvent}
                    />
                </div>
            </div>

            {/* Table */}
            {paginatedData.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[220px]">Nama Peserta</TableHead>
                            <TableHead className="w-[250px]">Email</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="w-[120px]">Bukti</TableHead>
                            <TableHead className="w-[160px] text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((reg) => (
                            <TableRow key={reg.id}>
                                <TableCell>{reg.user.fullName}</TableCell>
                                <TableCell>{reg.user.email}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            reg.status === "APPROVED"
                                                ? "default"
                                                : reg.status === "REJECTED"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {reg.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {reg.paymentProofUrl ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setProofPreview(reg.paymentProofUrl!)}
                                        >
                                            Lihat
                                        </Button>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>
                                <TableCell className="text-center space-x-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleStatusUpdate(reg.id, "APPROVED")}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleStatusUpdate(reg.id, "REJECTED")}
                                    >
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-gray-500">Belum ada peserta untuk event ini.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage((p) => Math.max(1, p - 1));
                                    }}
                                    className={`rounded-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                                />
                            </PaginationItem>


                            {Array.from({ length: totalPages }).map((_, i) => {
                                const page = i + 1;
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                            className={cn(
                                                "rounded-sm",
                                                currentPage === page && "bg-primary text-white hover:bg-primary/90"
                                            )}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                                    }}
                                    className={`rounded-sm ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Modal bukti pembayaran */}
            <Dialog open={!!proofPreview} onOpenChange={() => setProofPreview(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Bukti Pembayaran</DialogTitle>
                    </DialogHeader>
                    {proofPreview && (
                        <Image
                            src={
                                proofPreview.startsWith("http")
                                    ? proofPreview
                                    : `${process.env.NEXT_PUBLIC_API_URL}${proofPreview}`
                            }
                            alt="Bukti Pembayaran"
                            className="w-full rounded-lg"
                            width={500}
                            height={500}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
