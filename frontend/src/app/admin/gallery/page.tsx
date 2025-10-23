"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GalleryCard from "@/components/shared/cards/galleryCard";
import GalleryModal from "@/components/shared/modals/galleryModal";
import { getAllGalleries, getGalleryDetail, deleteGallery } from "@/lib/api/gallery";
import { Gallery } from "@/types/model";
import { useAuth } from "@/context/authContext";
import LoadingScreen from "@/components/layout/loadingScreen";

export default function AdminGalleryPage() {
    const { user, isLoggedIn } = useAuth();
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<Gallery | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 16;

    // === Fetch all galleries ===
    const fetchGalleries = async (page: number) => {
        try {
            setLoading(true);
            const data = await getAllGalleries(page, limit);
            if (data && "items" in data) {
                setGalleries(data.items);
                setTotalPages(data.totalPages || 1);
            } else {
                setGalleries(Array.isArray(data) ? data : []);
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Failed to load galleries:", err);
            setGalleries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleries(page);
    }, [page]);

    // === Fetch gallery detail when selected ===
    useEffect(() => {
        if (!selectedId) return;
        (async () => {
            try {
                const data = await getGalleryDetail(selectedId);
                setSelectedDetail(data);
            } catch (err) {
                console.error("Failed to load gallery detail:", err);
            }
        })();
    }, [selectedId]);

    // === Delete handler ===
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Hapus Galeri?",
            text: "Apakah Anda yakin ingin menghapus galeri ini? Tindakan ini tidak dapat dibatalkan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
        });

        if (result.isConfirmed) {
            try {
                await deleteGallery(id);
                setGalleries((prev) => prev.filter((g) => g.id !== id));
                Swal.fire("Berhasil!", "Galeri telah dihapus.", "success");
            } catch (err) {
                console.error("Failed to delete gallery:", err);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus galeri.", "error");
            }
        }
    };

    if (loading) {
        return <LoadingScreen show={loading} text="Memuat data Galeri..." />
    }

    return (
        <section className="w-full">
            {/* ===== Header ===== */}
            <h1 className="text-2xl font-semibold mb-6">Manajemen Galeri</h1>

            {/* ===== Gallery Grid ===== */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                    {Array.from({ length: limit }).map((_, i) => (
                        <Skeleton key={i} className="w-full aspect-square" />
                    ))}
                </div>
            ) : galleries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full w-20 h-20" />
                        <div className="relative flex items-center justify-center w-20 h-20 bg-primary/15 rounded-full">
                            <Camera className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-700 mb-1">
                        Belum Ada Galeri
                    </h2>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Tidak ada galeri yang tersedia saat ini. Tambahkan galeri baru untuk mulai menampilkan karya Anda.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                    {galleries.map((gallery) => (
                        <div key={gallery.id} className="relative group">
                            <GalleryCard
                                gallery={gallery}
                                onClick={() => setSelectedId(gallery.id)}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(gallery.id);
                                }}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                title="Hapus galeri"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ===== Pagination ===== */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center mt-10 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                    >
                        Sebelumnya
                    </Button>
                    <span className="text-sm text-gray-600">
                        Halaman {page} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Selanjutnya
                    </Button>
                </div>
            )}

            {/* ===== Gallery Modal ===== */}
            {selectedId && selectedDetail && (
                <GalleryModal
                    gallery={selectedDetail}
                    currentUser={isLoggedIn && user ? user : null}
                    onClose={() => {
                        setSelectedId(null);
                        setSelectedDetail(null);
                    }}
                    onGalleryUpdate={(updated) => {
                        setSelectedDetail((prev) => (prev ? { ...prev, ...updated } : prev));
                        setGalleries((prev) =>
                            prev.map((g) =>
                                g.id === selectedDetail.id ? { ...g, ...updated } : g
                            )
                        );
                    }}
                />
            )}
        </section>
    );
}
