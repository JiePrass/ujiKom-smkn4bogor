"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserType } from "@/types/model";
import { useAuth } from "@/context/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileDropdownProps {
    userData: UserType;
}

export default function ProfileDropdown({ userData }: ProfileDropdownProps) {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // Fungsi untuk ambil inisial nama
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 rounded-full cursor-pointer">
                    <AvatarImage
                        src={userData.profilePicture ? `${userData.profilePicture}` : undefined}
                        alt={userData.fullName}
                    />
                    <AvatarFallback className="font-semibold text-xs">
                        {getInitials(userData.fullName)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                    <Avatar className="h-12 w-12 rounded-full">
                        <AvatarImage
                            src={userData.profilePicture ? `${userData.profilePicture}` : undefined}
                            alt={userData.fullName}
                        />
                        <AvatarFallback className="rounded-full font-semibold text-lg">
                            {getInitials(userData.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{userData.fullName}</p>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" /> Lihat Profil
                    </Link>
                </DropdownMenuItem>

                {userData.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                            <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Panel
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-500"
                >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
