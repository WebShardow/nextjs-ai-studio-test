// app/api/chat/route.ts
// ใช้ Vercel AI SDK (ai) และ Google Provider (@ai-sdk/google)

import { streamText } from 'ai'; // สำหรับ Streaming
import { google } from '@ai-sdk/google'; // สำหรับเรียกใช้ Google Gemini
import { NextResponse } from 'next/server';

// 💡 กำหนดให้รันใน Edge Runtime เพื่อความเร็วสูงสุด (แนะนำ)
// export const runtime = 'edge'; 

export async function POST(req: Request) {
    const startTime = Date.now(); // 💡 เริ่มจับเวลาที่ Server
    
    // 1. ดึงข้อความจาก Request Body
    const { messages } = await req.json();

    try {
        // 2. เรียกใช้ Gemini API ผ่าน Vercel AI SDK
        const result = await streamText({
            model: google('gemini-2.5-flash'),
            messages: messages,
        });
        
        const endTime = Date.now(); 
        const duration = endTime - startTime;
        
        // 3. CONSOLE LOG: พิมพ์เวลาที่ใช้ในการเริ่มต้น Process (Server Console)
        console.log(`[AI Process Start Time] ${duration}ms`); 
        
        // 4. ส่ง Stream กลับไป
        return result.toTextStreamResponse();

    } catch (error) {
        console.error('Gemini API Error:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to communicate with AI' }), { status: 500 });
    }
}

// เพิ่ม GET handler เพื่อรองรับการดึงข้อมูลแบบ GET (กรณีหน้าเพจ server-side fetch)
export async function GET() {
    // ตัวอย่างข้อมูลคอนเทนต์เดียวกับ Mock Data ใน `app/page.tsx`
    const content = [
        { id: 101, title: 'Next.js 16.0.6', description: 'ประสิทธิภาพที่เร็วขึ้นด้วย Turbopack และการปรับปรุงระบบ Type.', category: 'Next.js' },
        { id: 102, title: 'Tailwind CSS v4', description: 'การติดตั้ง Zero-Config และคลาส Canonical ที่กระชับ.', category: 'Tailwind CSS' },
        { id: 103, title: 'Glassmorphism UI', description: 'การออกแบบ UI ให้ดูโปร่งใสและมีเอฟเฟกต์เบลอเหมือนกระจกฝ้า.', category: 'Design' },
        { id: 104, title: 'Google Gemini AI', description: 'การผสานรวม Generative AI เข้ากับแอปพลิเคชัน Next.js.', category: 'AI SDK' },
    ];

    try {
        return NextResponse.json(content, { status: 200 });
    } catch (err) {
        console.error('GET /api/chat Error:', err);
        return new NextResponse(JSON.stringify({ error: 'Failed to get content' }), { status: 500 });
    }
}