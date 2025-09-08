"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function ContactSection() {
    return (
        <section>
            <div className="container mx-auto grid md:grid-cols-2 gap-64">
                {/* Kiri - Info Kontak */}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                        Memiliki Pertanyaan Khusus? Jangan Ragu Menghubungi Kami!
                    </h2>
                    <p className="text-gray-600">
                        Punya pertanyaan, masukan, atau sekadar ingin menyapa? Isi form di samping
                        dan hubungi kami. Kami akan segera merespons!
                    </p>

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

                {/* Kanan - Form */}
                <Card className="shadow-md">
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-1 text-sm font-medium">
                                Name
                            </label>
                            <Input id="name" placeholder="Nama lengkap" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium">
                                Email
                            </label>
                            <Input id="email" type="email" placeholder="email@example.com" />
                        </div>

                        <div>
                            <label htmlFor="message" className="block mb-1 text-sm font-medium">
                                Pesan
                            </label>
                            <Textarea id="message" placeholder="Tuliskan pesanmu di sini..." className="h-42" />
                        </div>

                        <Button className="w-full rounded-md">Kirim</Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
