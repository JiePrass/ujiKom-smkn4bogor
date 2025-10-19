'use client';

import { useEffect, useState, useMemo } from "react";
import { getAllReportedGalleryComments, deleteGalleryComment, rejectGalleryCommentReport } from "@/lib/api/gallery";
import { ArrowUpDown, Funnel, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReportsCommentTable from "@/components/shared/tables/reportCommentTable";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const MySwal = withReactContent(Swal);

const REPORT_REASONS = [
    "Semua",
    "Spam",
    "Ujaran Kebencian",
    "Informasi Palsu",
    "Mengandung Konten Seksual",
    "Mengandung Kekerasan",
    "Lainnya",
];

export default function ReportsComments() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
    const [filterReason, setFilterReason] = useState("Semua");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    async function fetchReports() {
        try {
            const res = await getAllReportedGalleryComments();
            setReports(res.data || []);
        } catch (error) {
            console.error("Failed to fetch reported comments:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReports();
    }, []);

    // === HAPUS KOMENTAR ===
    async function handleDeleteComment(commentId: number) {
        const result = await MySwal.fire({
            title: "Hapus Komentar?",
            text: "Komentar yang dihapus tidak bisa dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await deleteGalleryComment(commentId);
                    await fetchReports();
                } catch (err) {
                    console.error(err);
                    MySwal.showValidationMessage("Gagal menghapus komentar.");
                }
            },
            allowOutsideClick: () => !MySwal.isLoading(),
        });

        if (result.isConfirmed) {
            await MySwal.fire("Berhasil!", "Komentar telah dihapus.", "success");
        }
    }

    // === TOLAK REPORT ===
    async function handleRejectReport(reportId: number) {
        const result = await MySwal.fire({
            title: "Tolak Report?",
            text: "Report ini akan dihapus dari daftar.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Tolak",
            cancelButtonText: "Batal",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await rejectGalleryCommentReport(reportId);
                    await fetchReports();
                } catch (err) {
                    console.error(err);
                    MySwal.showValidationMessage("Gagal menolak report.");
                }
            },
            allowOutsideClick: () => !MySwal.isLoading(),
        });

        if (result.isConfirmed) {
            await MySwal.fire("Berhasil!", "Report telah dihapus.", "success");
        }
    }

    // === FILTER & SORT ===
    const filteredAndSortedReports = useMemo(() => {
        let data = [...reports];
        if (filterReason !== "Semua") {
            data = data.filter((r) => r.reason === filterReason);
        }
        data.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return sortOrder === "latest" ? timeB - timeA : timeA - timeB;
        });
        return data;
    }, [reports, filterReason, sortOrder]);

    // === PAGINATION ===
    const totalPages = Math.ceil(filteredAndSortedReports.length / pageSize);
    const paginatedData = filteredAndSortedReports.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Laporan Komentar</h2>

                <div className="flex items-center gap-2 relative">
                    {/* Sort */}
                    <Button
                        variant="secondary"
                        className="border bg-white p-0 border-gray-100 aspect-square rounded-sm"
                        onClick={() =>
                            setSortOrder(sortOrder === "latest" ? "oldest" : "latest")
                        }
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
                            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-md z-10">
                                {REPORT_REASONS.map((reason) => (
                                    <div
                                        key={reason}
                                        className={cn(
                                            "px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm",
                                            filterReason === reason && "bg-gray-50 font-semibold"
                                        )}
                                        onClick={() => {
                                            setFilterReason(reason);
                                            setShowFilterDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {reason}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                </div>
            ) : filteredAndSortedReports.length === 0 ? (
                <p className="text-center text-gray-500 py-6">
                    Tidak ada report komentar.
                </p>
            ) : (
                <ReportsCommentTable
                    reports={paginatedData}
                    onDelete={handleDeleteComment}
                    onReject={handleRejectReport}
                />
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
                                    className={cn(
                                        "rounded-sm",
                                        currentPage === 1 && "pointer-events-none opacity-50"
                                    )}
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
                                                currentPage === page &&
                                                "bg-primary text-white hover:bg-primary/90"
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
                                    className={cn(
                                        "rounded-sm",
                                        currentPage === totalPages &&
                                        "pointer-events-none opacity-50"
                                    )}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
