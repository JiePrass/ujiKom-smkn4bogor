"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import SearchBar from "@/components/shared/searchBar";
import NotificationDropdown from "@/components/shared/notificationDropdown";
import ProfileDropdown from "@/components/shared/profileDropdown";
import { useAuth } from "@/context/authContext";

export default function DashboardHeader() {
    const pathname = usePathname();
    const { user } = useAuth();

    const segments = pathname
        .split("/")
        .filter((segment) => segment && segment !== "admin");

    return (
        <header className="flex h-16 shrink-0 items-center justify-between px-4 gap-4">
            {/* KIRI */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-4" />

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/admin">
                                Admin Panel
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {segments.map((segment, index) => {
                            const href = `/admin/${segments.slice(0, index + 1).join("/")}`;
                            const isLast = index === segments.length - 1;

                            return (
                                <span key={index} className="flex items-center">
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>
                                                {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href}>
                                                {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </span>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* KANAN */}
            <div className="flex items-center gap-4">
                <SearchBar value={""} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                    throw new Error("Function not implemented.");
                } } />
                <NotificationDropdown notifications={[]} visible={false} toggle={function (): void {
                    throw new Error("Function not implemented.");
                } } />
                {user && <ProfileDropdown userData={user} />}
            </div>
        </header>
    );
}
