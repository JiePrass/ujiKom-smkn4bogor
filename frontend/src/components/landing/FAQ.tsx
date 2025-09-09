"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Script from "next/script"

const faqs = [
    {
        question: "Bagaimana cara membuat akun di SIMKAS?",
        answer:
            "Peserta dapat membuat akun dengan mengisi data diri, kemudian melakukan verifikasi melalui kode OTP yang dikirim ke email.",
    },
    {
        question: "Bagaimana cara mendaftar ke sebuah event?",
        answer:
            "Setelah login, peserta dapat memilih event yang tersedia lalu melakukan pendaftaran sesuai instruksi yang ditampilkan.",
    },
    {
        question: "Apakah saya bisa mengikuti lebih dari satu event?",
        answer:
            "Ya, peserta bisa mendaftar ke lebih dari satu event selama pendaftaran masih dibuka.",
    },
    {
        question: "Bagaimana cara melakukan presensi saat event berlangsung?",
        answer:
            "Peserta dapat melakukan presensi dengan memasukkan token yang diberikan panitia atau dengan scan QR Code di lokasi acara.",
    },
    {
        question: "Bagaimana cara mendapatkan sertifikat?",
        answer:
            "Setelah peserta dinyatakan hadir oleh panitia, sertifikat akan diunggah oleh admin dan dapat diunduh langsung melalui akun peserta.",
    },
    {
        question: "Apakah ada biaya untuk mengikuti event?",
        answer:
            "Tergantung event yang dipilih. Beberapa event gratis, sedangkan event berbayar akan meminta verifikasi pembayaran oleh panitia.",
    },
    {
        question: "Bagaimana jika saya lupa password akun SIMKAS?",
        answer:
            "Gunakan fitur 'Lupa Password' di halaman login. Anda akan menerima link reset password melalui email yang terdaftar.",
    },
]

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        setActiveIndex((prev) => (prev === index ? null : index))
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    }

    return (
        <section aria-label="Pertanyaan yang Sering Diajukan" className="container mx-auto px-6 md:px-0">
            {/* Structured Data JSON-LD */}
            <Script
                id="faq-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="container mx-auto px-6 md:px-0  max-w-3xl">
                <div className="flex flex-col text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold">
                        Berbagai Pertanyaan yang sering ditanyakan seputar kami
                    </h2>
                    <p className="font-light px-48">Cari dan temukan jawabanmu dari berbagai pertanyaan seputar SIMKAS disini!</p>
                </div>

                <div className="space-y-4 mx-auto">
                    {faqs.map((faq, index) => {
                        const isOpen = index === activeIndex
                        const answerId = `faq-answer-${index}`

                        return (
                            <div
                                key={index}
                                className="border-b border-gray-500 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left text-lg font-medium cursor-pointer transition"
                                    aria-expanded={isOpen}
                                    aria-controls={answerId}
                                >
                                    {faq.question}
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5" />
                                    )}
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={answerId}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-5 pb-4 pt-0 text-gray-600 text-base">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
