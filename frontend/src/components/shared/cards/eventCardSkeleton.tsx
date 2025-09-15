"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function EventCardSkeleton() {
    return (
        <div className="relative w-full h-108 aspect-video overflow-hidden shadow-md rounded-xl bg-gray-50/50">
            {/* Harga + Admin Action Placeholder */}
            <div className="absolute top-3 right-3 flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>

            {/* Info Overlay */}
            <div className="absolute bottom-4 w-full left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                <div className="flex justify-end w-[90%]">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="w-[90%] px-4 py-3 flex flex-col gap-2 backdrop-blur-[2px] border border-white/30 rounded-lg">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <div className="flex justify-between text-sm text-gray-100">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
