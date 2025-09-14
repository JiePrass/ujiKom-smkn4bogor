"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/api/event";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";
import Tiptap from "@/components/shared/tiptap";

interface ApiError {
    error: string;
}

export default function CreateEventPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: undefined as Date | undefined,
        time: "",
        location: "",
        price: "",
        flyer: null as File | null,
    });
    const [loading, setLoading] = useState(false);
    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setForm((prev) => ({ ...prev, flyer: file }));
            setFlyerPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setForm((prev) => ({ ...prev, flyer: null }));
        setFlyerPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.flyer) {
            toast.error("Flyer wajib diupload");
            return;
        }
        if (!form.date) {
            toast.error("Tanggal wajib dipilih");
            return;
        }

        try {
            setLoading(true);
            const priceNum = form.price === "" ? undefined : Number(form.price);

            await createEvent({
                title: form.title,
                description: form.description,
                date: format(form.date, "yyyy-MM-dd"),
                time: form.time,
                location: form.location,
                price: priceNum,
                flyer: form.flyer!,
            });
            toast.success("Event berhasil dibuat");
            router.push("/admin/events");
        } catch (err: unknown) {
            toast.error(
                axios.isAxiosError<ApiError>(err)
                    ? err.response?.data.error || "Gagal membuat event"
                    : "Gagal membuat event"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Grid utama: Flyer kiri, input kanan */}
                <div className="flex gap-6">
                    {/* Flyer upload area */}
                    <div className="flex w-2xs flex-col">
                        <Label htmlFor="flyer">Flyer</Label>
                        <label
                            htmlFor="flyer"
                            className="relative mt-2 w-full h-auto aspect-[1/1.4142] border rounded-md flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                            {flyerPreview ? (
                                <>
                                    <Image
                                        src={flyerPreview}
                                        alt="Preview flyer"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <span className="text-sm text-gray-500">Klik untuk upload flyer</span>
                            )}
                            <input
                                id="flyer"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                required={!flyerPreview}
                            />
                        </label>
                    </div>

                    {/* Input kanan */}
                    <div className="space-y-4 w-full">
                        <div>
                            <Label htmlFor="title">Judul Event</Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date">Tanggal</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !form.date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {form.date ? format(form.date, "PPP") : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={form.date}
                                            onSelect={(date) => setForm((prev) => ({ ...prev, date }))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label htmlFor="time">Waktu</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="location">Lokasi</Label>
                            <Input
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="price">Harga</Label>
                            <Input
                                id="price"
                                type="number"
                                inputMode="decimal"
                                placeholder="0"
                                name="price"
                                value={form.price}
                                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Deskripsi */}
                <div className="min-h-48">
                    <Tiptap
                        value={form.description}
                        onChange={(val) => setForm({ ...form, description: val })}
                    />
                </div>

                {/* Submit */}
                <div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Menyimpan..." : "Buat Event"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
