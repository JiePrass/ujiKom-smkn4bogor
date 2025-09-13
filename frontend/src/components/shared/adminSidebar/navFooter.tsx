"use client"

import { LogOut, Home } from "lucide-react"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"

export function NavFooter() {
    const router = useRouter()

    const { logout } = useAuth()

    function handleLogout() {
        logout()
        router.push("/login")
    }

    return (
        <SidebarGroup>
            <SidebarMenu>
                {/* Kembali ke Home */}
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Home">
                        <Link href="/">
                            <Home />
                            <span>Beranda</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Logout */}
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Logout" onClick={handleLogout} className="text-red-600 hover:cursor-pointer hover:text-red-600">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
