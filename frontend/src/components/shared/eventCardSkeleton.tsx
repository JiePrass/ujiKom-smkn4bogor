"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EventCardSkeleton() {
    return (
        <Card className="flex flex-col pt-[16px] px-[16px] pb-[24px] h-full rounded-[12px] gap-[20px] animate-pulse">
            <div className="w-full h-56 bg-gray-200 rounded-[4px]" />

            <CardHeader className="flex flex-col gap-2 p-0">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
            </CardHeader>

            <CardContent className="p-0 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
            </CardContent>

            <div className="h-10 bg-gray-200 rounded-full w-full" />
        </Card>
    );
}
