"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { RegisterForm } from "@/components/shared/forms/registerForm"
import Link from "next/link"

const slides = [
    {
        bg: "/images/feature-1.png",
        logo: "/icons/simkas-main-white.svg",
        title: "Lorem Ipsum Dolor",
        desc: "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit.",
    },
    {
        bg: "/images/feature-2.png",
        logo: "/icons/simkas-main-white.svg",
        title: "Aksi Nyata untuk Bumi Hijau",
        desc: "Matikan lampu saat tidak digunakan dan kurangi jejak karbon mulai dari rumah.",
    },
    {
        bg: "/images/feature-3.png",
        logo: "/icons/simkas-main-white.svg",
        title: "Lorem Ipsum Dolor",
        desc: "Lorem Ipsum Dolor Sit Amet Consectetur Adipisicing Elit.",
    },
]

export default function RegisterPage() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid min-h-svh lg:grid-cols-12">
            <div className="relative hidden lg:block lg:col-span-5 overflow-hidden">
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={slides[current].bg}
                            alt="Background"
                            fill
                            className="object-cover dark:brightness-[0.4]"
                            priority
                        />

                        {/* Overlay Content */}
                        <div className="relative z-10 flex flex-col items-center justify-end text-center px-8 h-full text-white pb-24">
                            <div className="absolute inset-0 bg-black/40" />
                            <motion.div
                                key={current + "-content"}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="flex flex-col items-center gap-4 max-w-xs"
                            >
                                <Image
                                    src={slides[current].logo}
                                    alt="Logo"
                                    width={48}
                                    height={48}
                                />
                                <div className="z-10">
                                    <h2 className="text-2xl font-semibold leading-snug max-w-xs">
                                        {slides[current].title}
                                    </h2>
                                    <p className="text-sm text-gray-200 max-w-sm">
                                        {slides[current].desc}
                                    </p>
                                </div>
                            </motion.div>

                            <div className="flex gap-2 mt-6 z-10">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${current === i
                                            ? "bg-primary"
                                            : "bg-white"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex flex-col gap-4 p-6 md:p-8 lg:col-span-7">
                <div className="flex justify-center md:justify-start">
                    <Link href="/">
                        <Image
                            src="/icons/simkas-main.svg"
                            alt="Main Logo"
                            width={128}
                            height={128}
                        />
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
