import * as React from "react";
import {
    LayoutDashboard,
    Calendar,
    Camera,
    FileBadge,
    Megaphone
} from "lucide-react";

import { NavMain } from "@/components/shared/adminSidebar/navMain";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import Image from "next/image";
import { NavFooter } from "../shared/adminSidebar/navFooter";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    // Menu navigasi khusus admin
    const navMain = [
        {
            title: "Dashboard",
            url: "/admin",
            icon: LayoutDashboard,
        },
        {
            title: "Event",
            url: "#",
            icon: Calendar,
            items: [
                { title: "Manajemen Event", url: "/admin/events" },
                { title: "Buat Event", url: "/admin/events/create" },
                { title: "Pendaftaran Event", url: "/admin/events/participant" },
            ]
        },
        {
            title: "Galeri",
            url: "#",
            icon: Camera,
            items: [
                { title: "Manajemen Galeri", url: "/admin/gallery" },
                { title: "Buat Galeri", url: "/admin/gallery/create" },
            ]
        },
        {
            title: "Sertifikat",
            url: "/admin/certificate",
            icon: FileBadge,
        },
        {
            title: "Laporan Komentar",
            url: "/admin/reports-comments",
            icon: Megaphone,
        },
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
            {/* Header logo */}
            <SidebarHeader>
                <div className="flex items-center gap-2 px-3 py-2">
                    <Image
                        src="/icons/simkas-logo.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                    />
                    <span className="font-semibold text-primary text-lg truncate">
                        SIMKAS
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
