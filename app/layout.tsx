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
                    ${geistSans.variable} ${geistMono.variable} 
                    antialiased min-h-screen
                    
                    // **** Glassmorphism Background (Corrected) ****
                    bg-gray-100 dark:bg-gray-900 
                    
                    // 💡 FIX: ต้องใช้ 'bg-gradient-to-br' เท่านั้น
                    bg-gradient-to-br 
                    
                    // Light Mode Gradient: โปร่งแสง (Glass)
                    from-indigo-100/70 via-white/70 to-pink-100/70 
                    
                    // 💡 NEW Dark Mode: ชมพู-ม่วง เข้มขึ้น (Dark Fuchsia/Purple)
                    dark:from-blue-600/80 dark:via-teal-600/70 dark:to-green-700
                `}
            >
                {children}
            </body>
        </html>
    );
}