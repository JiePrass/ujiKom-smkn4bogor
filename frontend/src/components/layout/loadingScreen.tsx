"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface LoadingScreenProps {
    show: boolean;
    text?: string;
    fullScreen?: boolean; // opsional: untuk mode fullscreen bila dibutuhkan
}

export default function LoadingScreen({
    show,
    text = "Memuat data...",
    fullScreen = false,
}: LoadingScreenProps) {
    const [displayText, setDisplayText] = useState(text);

    const loadingTexts = useMemo(
        () => [
            "Mengambil data...",
            "Menyiapkan tampilan...",
            "Mengoptimalkan performa...",
            "Memuat komponen...",
            "Hampir selesai...",
        ],
        []
    );

    useEffect(() => {
        if (!show) return;

        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % loadingTexts.length;
            setDisplayText(loadingTexts[index]);
        }, 2200);

        return () => clearInterval(interval);
    }, [show, loadingTexts]);

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    key="loading-overlay"
                    className={`absolute inset-0 flex flex-col items-center justify-center ${fullScreen
                            ? "fixed bg-background/90 backdrop-blur-md z-50"
                            : "bg-background/70 backdrop-blur-sm rounded-xl"
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {/* Spinner luar */}
                    <motion.div
                        className="relative w-16 h-16 mb-5"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                    >
                        <div className="absolute inset-0 border-8 border-primary/50 border-t-transparent rounded-full animate-spin-slow" />
                        <div className="absolute inset-[4px] border-8 border-primary/20 rounded-full blur-sm" />
                    </motion.div>

                    {/* Text animasi */}
                    <motion.p
                        key={displayText}
                        className="mt-16 text-sm text-muted-foreground text-center select-none"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.4 }}
                    >
                        {displayText}
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
