import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIMKAS - Sistem Informasi Manajemen Kegiatan Akademi Sekolah",
  description: "Aplikasi untuk mengelola kegiatan dan pendaftaran peserta",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.variable} antialiased`}>
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
