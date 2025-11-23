import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import Script from "next/script";

const sfPro = localFont({
  src: [
    { path: "../../public/fonts/SF-Pro-Display-Ultralight.otf", weight: "200", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Thin.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Semibold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Heavy.otf", weight: "800", style: "normal" },
    { path: "../../public/fonts/SF-Pro-Display-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-sfpro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIMKAS - Sistem Informasi Manajemen Kegiatan Akademi Sekolah",
  description: "Aplikasi untuk mengelola kegiatan dan pendaftaran peserta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sfPro.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* MIDTRANS SNAP.JS */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
