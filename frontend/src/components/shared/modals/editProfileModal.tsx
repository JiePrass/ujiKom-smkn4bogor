"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/lib/api/user";
import Image from "next/image";
import Swal from "sweetalert2";
import { Camera, PenSquare } from "lucide-react";

interface EditProfileModalProps {
    userId: number;
    profile: {
        fullName: string;
        phone?: string;
        address?: string;
        education?: string;
        profilePicture?: string | null;
        bannerUrl?: string | null;
    };
    onUpdated: () => void;
}

export default function EditProfileModal({
    userId,
    profile,
    onUpdated,
}: EditProfileModalProps) {
    const [open, setOpen] = useState(false);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [previewBanner, setPreviewBanner] = useState<string | null>(profile.bannerUrl || null);
    const [previewProfile, setPreviewProfile] = useState<string | null>(profile.profilePicture || null);

    const [formData, setFormData] = useState({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        education: profile.education || "",
        profilePicture: setProfileFile,
        bannerUrl: setBannerFile,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "profile") => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === "banner") {
                setBannerFile(file);
                setPreviewBanner(url);
            } else {
                setProfileFile(file);
                setPreviewProfile(url);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Siapkan form data untuk upload file
            const data = new FormData();
            data.append("fullName", formData.fullName);
            data.append("phone", formData.phone);
            data.append("address", formData.address);
            data.append("education", formData.education);
            if (bannerFile) data.append("bannerUrl", bannerFile);
            if (profileFile) data.append("profilePicture", profileFile);

            await updateUserProfile(userId, data);

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Profil berhasil diperbarui.",
                confirmButtonColor: "#2563eb",
            });

            setOpen(false);
            onUpdated();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat memperbarui profil.",
                confirmButtonColor: "#ef4444",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <PenSquare />
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Profil</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Banner */}
                    <div className="relative w-full h-40 bg-gray-800 rounded-md overflow-hidden">
                        {previewBanner ? (
                            <Image
                                src={
                                    previewBanner.startsWith("blob:")
                                        ? previewBanner
                                        : `${process.env.NEXT_PUBLIC_API_URL}${previewBanner}`
                                }
                                alt="Banner Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-700" />
                        )}

                        {/* Input Banner */}
                        <input
                            id="bannerInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "banner")}
                        />
                        <label
                            htmlFor="bannerInput"
                            className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 p-2 rounded-lg cursor-pointer"
                        >
                            <PenSquare className="w-5 h-5 text-white" />
                        </label>
                    </div>

                    {/* Profile */}
                    <div className="relative -mt-24 ml-4 w-32 h-32">
                        <div className="w-32 h-32 rounded-full bg-gray-600 overflow-hidden relative ring-4 ring-background">
                            {previewProfile ? (
                                <Image
                                    src={
                                        previewProfile.startsWith("blob:")
                                            ? previewProfile
                                            : `${process.env.NEXT_PUBLIC_API_URL}${previewProfile}`
                                    }
                                    alt="Profile Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-white font-bold text-2xl">
                                    {profile.fullName[0]}
                                </div>
                            )}
                        </div>

                        {/* Input Profile */}
                        <input
                            id="profileInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, "profile")}
                        />
                        <label
                            htmlFor="profileInput"
                            className="absolute bottom-0 right-0 bg-black/60 hover:bg-black/80 p-2 rounded-full cursor-pointer"
                        >
                            <Camera className="w-5 h-5 text-white" />
                        </label>
                    </div>


                    {/* Form Fields */}
                    <div className="space-y-3 mt-6">
                        <div className="flex gap-3 w-full justify-between">
                            <div className="w-2/3">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Nama lengkap"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Nomor telepon"
                                    type="tel"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="education">Education</Label>
                            <Input
                                id="education"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                placeholder="Pendidikan"
                            />
                        </div>

                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Alamat"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
