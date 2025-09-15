"use client";

import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SmallEventCardSkeleton() {
    return (
        <Card className="w-full rounded-2xl border border-gray-100 shadow-sm p-5 bg-white flex flex-col gap-4">
            {/* Header */}
            <CardHeader className="p-0 flex flex-col gap-2">
                <div className="flex justify-between w-full">
                    <Skeleton className="h-5 w-2/3 rounded-md" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </CardHeader>

            {/* Info Tambahan */}
            <CardContent className="p-0 gap-2 flex flex-col">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <div className="flex gap-6 mt-2">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                </div>
            </CardContent>

            {/* Tombol */}
            <CardFooter className="flex gap-2 items-center p-0 pt-2">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
            </CardFooter>
        </Card>
    );
}
