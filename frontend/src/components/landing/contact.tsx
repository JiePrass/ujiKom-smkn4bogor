"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

export default function ContactSection() {
    return (
        <section className="container mx-auto grid md:grid-cols-2 gap-20 py-16">
            {/* Kiri - Info Kontak */}
            <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                    Memiliki Pertanyaan Khusus? Jangan Ragu Menghubungi Kami!
                </h2>
                <p className="text-gray-600 max-w-lg">
                    Punya pertanyaan, masukan, atau sekadar ingin menyapa? Isi form di samping
                    dan hubungi kami. Kami akan segera merespons!
                </p>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-gray-700" />
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-gray-600">example@email.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-gray-700" />
                        <div>
                            <p className="font-medium">Nomor Telepon</p>
                            <p className="text-gray-600">+123 - 456 - 789</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanan - Form */}
            <form className="space-y-8 w-full">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                        Nama
                    </label>
                    <Input
                        id="name"
                        placeholder="Nama lengkap"
                        className="border-0 border-b border-gray-300 rounded-none focus:ring-0"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="border-0 border-b border-gray-300 rounded-none focus:ring-0"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                        Pesan
                    </label>
                    <Textarea
                        id="message"
                        placeholder="Tuliskan pesanmu di sini..."
                        className="h-32 border-0 border-b border-gray-300 rounded-none focus:ring-0"
                    />
                </div>

                <Button
                    type="submit"
                    variant="ghost"
                    className="px-6 py-2 border border-gray-300 bg-primary text-white rounded-none hover:bg-primary/90 hover:text-white"
                >
                    Kirim Pesan
                </Button>
            </form>
        </section>
    );
}
