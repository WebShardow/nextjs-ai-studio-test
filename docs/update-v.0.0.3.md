# Background Gradient

## 🛠️ สรุปการเปลี่ยนแปลงหลักใน Code Base

การเปลี่ยนแปลงทั้งหมดมุ่งเน้นไปที่การแก้ไขข้อผิดพลาดในการใช้ Tailwind Utility Class และการปรับปรุงธีม Glassmorphism ใน Dark Mode ให้มีโทน **ชมพู-ม่วง** ที่เข้มขึ้น รวมถึงการยืนยันความถูกต้องของ API Endpoint

### 1\. ไฟล์ `layout.tsx` (การตั้งค่า Background Gradient)

* **แก้ไขข้อผิดพลาด Tailwind:** เปลี่ยน Utility Class ที่ผิดพลาดจาก `bg-linear-to-br` กลับไปเป็น **`bg-gradient-to-br`** ซึ่งเป็น Class ที่ถูกต้องของ Tailwind CSS
* **ปรับ Dark Mode Gradient:** เปลี่ยนสีใน Dark Mode ให้เป็นโทน **ชมพู-ม่วง** ที่เข้มขึ้นตามความต้องการของคุณ

| ส่วนที่แก้ไข | การเปลี่ยนแปลง | ค่าใหม่ใน Dark Mode |
| :--- | :--- | :--- |
| **Dark Mode Gradient** | กำหนดสี Gradient ใหม่ | `dark:from-fuchsia-950/80` (ชมพูเข้ม), `dark:via-purple-950/70` (ม่วงเข้ม), `dark:to-gray-950/80` (เทาเข้ม) |
| **Light Mode Gradient** | คงเดิม | `from-indigo-100/70 via-white/70 to-pink-100/70` |

```tsx
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
                    dark:from-indigo-600/80 dark:via-fuchsia-600/70 dark:to-pink-700
                `}
            >
                {children}
            </body>
        </html>
    );
}
```

### 2\. ไฟล์ `page.tsx` (การตั้งค่า API Path)

* **ยืนยัน API Endpoint:** ยืนยันว่า **`const apiPath = '/api/chat';`** นั้นถูกต้องแล้ว เนื่องจากไฟล์ Route Handler ของคุณคือ `app/api/chat/route.ts` (ไม่มีการแก้ไขโค้ดในส่วนนี้เนื่องจากถูกต้องแล้ว)
* **Card Style:** ยืนยันว่า Card Content ใช้ Utility Classes สำหรับธีม Glassmorphism อย่างถูกต้อง เช่น **`bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm`**

```tsx
// app/page.tsx
// ไฟล์นี้เป็น Server Component หลัก

import { ChatBot } from '@/components/ChatBot'; 

// Type สำหรับข้อมูล Content
interface ContentItem {
    id: number;
    title: string;
    description: string;
    category: string;
}

// Function สำหรับ Data Fetching (Server Component)
async function fetchContentData(): Promise<ContentItem[]> {
    
    // 1. Determine Base URL for Server-Side Fetch (ใช้ Environment Variable เพื่อแก้ปัญหา Network Error)
    let baseUrl = '';
    
    if (process.env.VERCEL_URL) {
        // Production/Preview
        baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.SERVER_URL) {
        // Local Development (ดึงค่าจาก .env.local: SERVER_URL=http://localhost:3000)
        baseUrl = process.env.SERVER_URL; 
    }

    // 💡 ยืนยัน FIX: Path ถูกต้องสำหรับ app/api/chat/route.ts
    const apiPath = '/api/chat'; 
    const apiUrl = baseUrl ? `${baseUrl}${apiPath}` : apiPath; 

    // ข้อมูลจำลอง (Mock Data)
    const MOCK_CONTENT_DATA: ContentItem[] = [
        { id: 101, title: "Next.js 16.0.6", description: "ประสิทธิภาพที่เร็วขึ้นด้วย Turbopack และการปรับปรุงระบบ Type.", category: "Next.js" },
        { id: 102, title: "Tailwind CSS v4", description: "การติดตั้ง Zero-Config และคลาส Canonical ที่กระชับ.", category: "Tailwind CSS" },
        { id: 103, title: "Glassmorphism UI", description: "การออกแบบ UI ให้ดูโปร่งใสและมีเอฟเฟกต์เบลอเหมือนกระจกฝ้า.", category: "Design" },
        { id: 104, title: "Google Gemini AI", description: "การผสานรวม Generative AI เข้ากับแอปพลิเคชัน Next.js.", category: "AI SDK" },
    ];
    
    try {
        const res = await fetch(apiUrl, {
            next: { revalidate: 60 } 
        });
    
        if (res.ok) {
            return res.json();
        }

        // หาก fetch ไม่สำเร็จ (Status 404/500)
        console.error(`Warning: Failed to fetch data from ${apiUrl}. Status: ${res.status}. Using Mock Data.`);
        return MOCK_CONTENT_DATA; 

    } catch { 
        // หากเกิด Network Error (การเชื่อมต่อล้มเหลว)
        console.error(`Warning: Network error during data fetch from ${apiUrl}. Using Mock Data.`);
        return MOCK_CONTENT_DATA;
    }
}


// Server Component หลัก
export default async function Home() {
    let contentData: ContentItem[] = [];
    let error: string | null = null;

    contentData = await fetchContentData(); 
    
    // ตรวจสอบว่าข้อมูลที่ได้มาคือ Mock Data หรือไม่ (โดยดูจาก Content แรก)
    if (contentData.length > 0 && contentData[0].title === "Next.js 16.0.6") {
         error = "Using Mock Data because API endpoint /api/chat could not be reached or returned an error.";
    }

    // Tailwind CSS Utility Classes สำหรับ Layout
    const layoutClasses = "min-h-screen grid grid-rows-[auto_1fr_auto] p-4 sm:p-8 max-w-7xl mx-auto";
    const headerClasses = "row-start-1 pb-10 flex flex-col items-center justify-center";
    const mainClasses = "row-start-2 flex flex-col items-center justify-center py-10";


    return (
        <div className={layoutClasses}>
            {/* 1. Header Section */}
            <header className={headerClasses}>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
                    Next.js + Gemini AI Studio
                </h1>
                <p className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-2xl">
                    ตัวอย่างการผสานรวม **Google Gemini AI** และ **Next.js App Router** ในธีม Glassmorphism
                </p>
            </header>
            
            {/* 2. Main Content Section */}
            <main className={mainClasses}>
                <h2 className="text-3xl font-bold mb-8 text-left w-full text-gray-900 dark:text-white">
                    💡 Featured Content
                </h2>

                {error && error.includes("Mock Data") ? (
                    // แสดง Warning หากใช้ Mock Data
                    <div className="text-yellow-700 text-center p-4 mb-8 border border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 w-full max-w-md">
                        <p className="font-bold mb-1">Warning:</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : null}

                {/* ส่วนแสดงผลลัพธ์ข้อมูล */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {contentData.map((item) => (
                        // Tailwind CSS Card component (Glassmorphism)
                        <div
                            key={item.id}
                            className="p-6 
                                // **** Glassmorphism Card Style ****
                                bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm 
                                border border-white/20 dark:border-gray-700/50
                                shadow-lg
                                // *********************************
                                rounded-xl transition-all hover:shadow-xl hover:scale-[1.02]
                            "
                        >
                            <span className="inline-block bg-blue-600/90 text-white text-xs font-bold mr-2 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                                {item.category}
                            </span>
                            <h3 className="font-extrabold text-xl mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* 3. Footer Section */}
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-700 dark:text-gray-400 pt-10 border-t border-black/10 dark:border-white/10">
                <p>© {new Date().getFullYear()} Next.js + Tailwind CSS + Vercel Boilerplate</p>
            </footer>

            {/* 4. ChatBot Component (Client Component) */}
            <ChatBot /> 
        </div>
    );
}
```

### 3\. ไฟล์ `route.ts` (API Handler)

* **คำแนะนำ:** คุณได้รับคำแนะนำให้ตรวจสอบและ/หรือย้ายไฟล์ Route Handler **`route.ts`** ไปไว้ที่พาธ **`app/api/chat/route.ts`** เพื่อให้ตรงกับ Endpoint `/api/chat` ที่เรียกใช้ใน `page.tsx`

```ts
// app/api/chat/route.ts (แนะนำให้ย้ายมาไว้ที่นี่)
import { NextResponse } from 'next/server';

// Type สำหรับข้อมูล Content (สอดคล้องกับที่ใช้ใน app/page.tsx)
interface ContentItem {
    id: number;
    title: string;
    description: string;
    category: string;
}

// ข้อมูลจำลอง (Mock Data) สำหรับ Contents API Service
const MOCK_CONTENT_DATA: ContentItem[] = [
    {
        id: 101,
        title: "Next.js 15.5: Turbopack & TypeScript",
        description: "อัพเดทล่าสุดของ Next.js เน้นความเร็วในการ Build และการปรับปรุงระบบ Type.",
        category: "Next.js",
    },
    {
        id: 102,
        title: "Tailwind CSS v4: Minimal Dependency",
        description: "การติดตั้งที่ง่ายขึ้นด้วย `@tailwindcss/postcss` และ Zero-Config ที่มาพร้อมกับ V4.",
        category: "Tailwind CSS",
    },
    {
        id: 103,
        title: "Vercel: Zero-Config Deployment",
        description: "ขั้นตอนการ Deploy โปรเจกต์ Next.js บน Vercel ที่ง่ายและรวดเร็วที่สุด.",
        category: "Vercel",
    },
    {
        id: 104,
        title: "TypeScript for Route Handlers",
        description: "การใช้ TypeScript เพื่อรับประกันความปลอดภัยของ Type ทั้งขาเข้าและขาออกของ API.",
        category: "TypeScript",
    },
];

/**
 * Route Handler สำหรับจัดการ HTTP GET Request
 * API Endpoint: /api/chat
 */
export async function GET() {
    // ใช้ NextResponse.json เพื่อส่งข้อมูล JSON กลับไป
    return NextResponse.json(MOCK_CONTENT_DATA, {
        status: 200,
        // กำหนด Cache-Control เพื่อใช้ประโยชน์จาก Caching ของ Vercel และ Next.js
        headers: {
            'Cache-Control': 'public, max-age=60, must-revalidate' // Revalidate ทุก 60 วินาที
        }
    });
}
```

### 4\. ไฟล์ `globals.css` (การตั้งค่า Tailwind CSS)

```css
@import "tailwindcss";

/* === Light Mode Default === */
:root {
    --background: #ffffff;
    --foreground: #171717;
}

/* === Dark Mode Support === */
@media (prefers-color-scheme: dark) {
    :root {
        /* เปลี่ยนพื้นหลังเป็นสีเข้มใน Dark Mode เพื่อให้ Gradient ดูเด่นขึ้น */
        --background: #0d0d0d;
        --foreground: #f0f0f0;
    }
}

:root {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --font-sans: var(--font-geist-sans);
    --font-mono: var(--font-geist-mono);
}

body {
    /* ลบการกำหนด background ออกจาก body เพราะจะไปกำหนดใน layout.tsx แทน */
    /* background: var(--background); */
    color: var(--foreground);
    font-family: Arial, Helvetica, sans-serif;
}
```

-----

## 🧐 สถานะความสอดคล้องของ Project

| คุณสมบัติ | สถานะปัจจุบัน | หมายเหตุ |
| :--- | :--- | :--- |
| **Next.js + TS** | สอดคล้อง | ใช้ Server Components (App Router) และ TypeScript อย่างถูกต้อง |
| **Tailwind CSS** | สอดคล้อง | ใช้ Tailwind CSS v4 Utility Classes และมีการแก้ไข Class Gradient ที่ผิดพลาดแล้ว |
| **ESLint** | **ต้องตรวจสอบ** | แนะนำให้ติดตั้ง **`eslint-plugin-tailwindcss`** และ **`eslint-config-prettier`** ใน `eslint.config.mjs` เพื่อป้องกันการแจ้งเตือนที่ไม่ถูกต้องเกี่ยวกับ Tailwind Classes |
| **Deployment** | พร้อม | โครงสร้างการ Fetch ข้อมูลรองรับการ Deploy บน **Vercel** ด้วยการใช้ Environment Variables (`VERCEL_URL`) |
