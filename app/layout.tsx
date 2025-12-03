// app/layout.tsx

import type { Metadata } from "next";
// Assuming you are using Geist fonts, adjust if necessary
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Next.js + Gemini AI Studio (Glassmorphism Theme)",
    description: "ตัวอย่าง Next.js App Router + Tailwind CSS v4 + Gemini AI SDK ในธีม Glassmorphism",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          min-h-screen
          // **** Glassmorphism Background ****
          bg-gray-100 dark:bg-gray-900 
          bg-linear-to-br from-indigo-100/70 via-white/70 to-pink-100/70 
          dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
        `}
            >
                {children}
            </body>
        </html>
    );
}