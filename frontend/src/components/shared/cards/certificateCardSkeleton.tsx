import { Skeleton } from "@/components/ui/skeleton";

export default function CertificateSkeleton() {
    return (
        <div className="relative w-full h-64 aspect-video rounded-xl overflow-hidden">
            <Skeleton className="absolute inset-0" />
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    );
}
