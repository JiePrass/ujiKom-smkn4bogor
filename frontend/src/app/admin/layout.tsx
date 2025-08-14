"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/adminSidebar";
import DashboardHeader from "@/components/layout/dashboardHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn) {
                router.replace("/login");
            } else if (user?.role && user.role !== "ADMIN") {
                router.replace("/");
            }
        }
    }, [isLoggedIn, user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!isLoggedIn || (user?.role && user.role !== "ADMIN")) {
        return null;
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <DashboardHeader />
                <main className="flex-1 p-4 pt-0">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
