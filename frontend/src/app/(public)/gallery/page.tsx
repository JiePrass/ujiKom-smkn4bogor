"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllGalleries, getGalleryDetail } from "@/lib/api/gallery";
import { Gallery } from "@/types/model";
import GalleryCard from "@/components/shared/cards/galleryCard";
import GalleryModal from "@/components/shared/modals/galleryModal";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryPage() {
    const { user, isLoggedIn } = useAuth();
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<Gallery | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const limit = 24;

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

    return (
        <section className="w-full">
            {/* ===== Banner Section ===== */}
            <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden">
                <Image
                    src="/images/placeholder-banner.png"
                    alt="Banner Galeri"
                    fill
                    className="object-cover saturate-0"
                    priority
                />
                <div className="absolute z-10 container mx-auto px-4 inset-0 flex flex-col items-center justify-center text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Galeri SIMKAS</h1>
                    <p className="text-lg md:text-xl max-w-2xl">
                        Dokumentasi kegiatan dan momen berharga dalam sistem manajemen kegiatan SIMKAS.
                    </p>
                </div>
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* ===== Gallery List Section ===== */}
            <div className="container mx-auto px-4 py-12">
                {/* Loading Skeleton */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                        {Array.from({ length: limit }).map((_, i) => (
                            <div key={i}>
                                <Skeleton className="w-full aspect-square" />
                            </div>
                        ))}
                    </div>
                ) : galleries.length === 0 ? (
                    <p className="text-center text-gray-500">Belum ada galeri tersedia.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                        {galleries.map((gallery) => (
                            <GalleryCard
                                key={gallery.id}
                                gallery={gallery}
                                onClick={() => setSelectedId(gallery.id)}
                            />
                        ))}
                    </div>
                )}

                {/* ===== Pagination Controls ===== */}
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
            </div>

            {/* ===== Modal ===== */}
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
