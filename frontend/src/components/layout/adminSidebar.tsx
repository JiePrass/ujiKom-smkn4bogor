import * as React from "react";
import {
    LayoutDashboard,
    Calendar,
    Newspaper,
    FileBadge
} from "lucide-react";

import { NavMain } from "@/components/shared/adminSidebar/navMain";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import Image from "next/image";

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
            title: "Artikel",
            url: "#",
            icon: Newspaper,
            items: [
                { title: "Manajemen Artikel", url: "/admin/articles" },
                { title: "Buat Artikel", url: "/admin/articles/create" },
            ]
        },
        {
            title: "Sertifikat",
            url: "/admin/certificate",
            icon: FileBadge,
        },
    ]

    return (
        <Sidebar collapsible="icon" {...props}>
            {/* Header logo */}
            <SidebarHeader>
                <div className="flex items-center gap-2 px-3 py-2">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="rounded"
                    />
                    <span className="font-semibold text-lg truncate">
                        Event Krabat
                    </span>
                </div>
            </SidebarHeader>

            {/* Main Navigation */}
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>

            {/* User Info */}
            <SidebarFooter>

            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
