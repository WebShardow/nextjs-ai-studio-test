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