# การสร้าง AI Chatbot ด้วย Gemini API ใน Next.js

ในรูปแบบหน้าต่างลอยเป็นวิธีที่ยอดเยี่ยมในการเพิ่มประสบการณ์ผู้ใช้ (UX) และการเข้าถึงความช่วยเหลือ

เราจะใช้ **Next.js Route Handler** สำหรับ Logic การสนทนาฝั่งเซิร์ฟเวอร์ และใช้ **React Client Component** ร่วมกับ **`useChat`** Hook จาก AI SDK เพื่อจัดการ UI และสถานะการสนทนาอย่างลื่นไหล

## 🛠️ ขั้นตอนที่ 1 : สร้าง Route Handler สำหรับ Chat API

เราจะสร้าง API Endpoint ที่ `app/api/chat/route.ts` เพื่อจัดการการเชื่อมต่อกับ Gemini และรองรับ **Streaming** (การพิมพ์ข้อความแบบเรียลไทม์) ซึ่งเป็นมาตรฐานสำหรับการสร้าง Chatbot ที่ดี

### 📄 ไฟล์: `app/api/chat/route.ts`

สร้างโฟลเดอร์ `api/chat` ภายใต้ `app` และสร้างไฟล์ `route.ts` ดังนี้:

```typescript
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
```

---

## 🎨 ขั้นตอนที่ 2: สร้าง Client Component ChatBot UI

เนื่องจาก Chatbot ต้องมีการจัดการสถานะ (เช่น ข้อความ, การเปิด/ปิดหน้าต่าง) เราจึงต้องสร้างเป็น **Client Component** และใช้ Hook ที่ชื่อว่า **`useChat`**

### 📄 ไฟล์: `components/ChatBot.tsx`

สร้างโฟลเดอร์ `components` และสร้างไฟล์ `ChatBot.tsx`

```tsx
// components/ChatBot.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

// ประกาศ Type และ Custom useChat Hook (Non-Streaming)
type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

function useChat(options: { api: string; initialMessages?: Message[] }) {
    const { api, initialMessages = [] } = options;
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage: Message = {
            id: String(Date.now()),
            role: 'user',
            content: trimmed,
        };

        // *สำคัญ*: สร้างอาเรย์ข้อความทั้งหมดเพื่อส่งไปให้ API
        const messagesToSend = [...messages, userMessage]; 

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // *** การแก้ไข: ส่งอาเรย์ messages ทั้งหมดไปให้ API ***
                body: JSON.stringify({ messages: messagesToSend }), 
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // Custom hook คาดหวัง JSON response ที่มี property 'reply' หรือ 'message'
            let replyText = '';
            if (typeof data === 'string') replyText = data;
            else if (typeof data === 'object' && data !== null) {
                // Client คาดหวัง 'reply' หรือ 'message'
                replyText = data.reply ?? data.message ?? data.output ?? JSON.stringify(data);
            } else {
                replyText = String(data);
            }

            const assistantMessage: Message = {
                id: String(Date.now()) + '_a',
                role: 'assistant',
                content: replyText,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage: Message = {
                id: String(Date.now()) + '_err',
                role: 'assistant',
                content: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
    };
}

// ไอคอน Chat 💬 (ย้ายออกนอก Component หลักเพื่อแก้ไข ESLint Error)
const ChatIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h.008v.008H8.625V9.75Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h.008v.008H16.125V9.75ZM3.182 12.072A10.021 10.021 0 0 0 12 21.072c2.162 0 4.248-.598 6.075-1.745l2.43 1.215a.75.75 0 0 0 1.05-1.05l-1.215-2.43c1.147-1.827 1.745-3.913 1.745-6.075 0-5.523-4.477-10.021-10.021-10.021S2.072 6.549 2.072 12.072Z" />
    </svg>
);


// --- 2. Chatbot Component หลัก ---
export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);

    // ใช้ Custom useChat hook
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: 'สวัสดีครับ! ผมคือ Gemini Assistant ยินดีให้คำแนะนำการใช้งานเว็บไซต์นี้ คุณมีคำถามอะไรไหมครับ?',
            },
        ],
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll ไปยังข้อความล่าสุดเมื่อมีการอัปเดต
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Tailwind classes สำหรับ Input Field
    const inputClasses = "grow p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-60";


    return (
        // Container หลัก (หน้าต่างลอยอยู่ขวาล่าง)
        <div className="fixed bottom-6 right-6 z-50">

            {/* หน้าต่าง Chat */}
            <div
                className={`bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-black/10 dark:border-white/20 w-80 sm:w-96 overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4 pointer-events-none'
                    }`}
                style={{ height: '500px' }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md">
                    <h3 className="text-lg font-bold">Gemini Assistant</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                        aria-label="Close Chatbot"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Chat Body (ข้อความ) */}
                <div className="flex flex-col h-[calc(100%-110px)] p-4 overflow-y-auto space-y-3">
                    {messages.map((m: Message) => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-md ${m.role === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
                                    }`}
                            >
                                {/* ใช้ 'whitespace-pre-wrap' เพื่อแสดงผล Text ที่มี Line Break (เช่นจาก Gemini) */}
                                <p className="whitespace-pre-wrap">{m.content}</p>
                            </div>
                        </div>
                    ))}
                    {/* Reference สำหรับ Scroll */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-black/10 dark:border-white/10">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder={isLoading ? 'กำลังตอบ...' : 'พิมพ์คำถามของคุณ...'}
                            className={inputClasses}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || input.trim() === ''}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            aria-label="Send Message"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-t-2 border-white border-opacity-30 rounded-full animate-spin"></div>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5 transform rotate-90"
                                >
                                    <path d="M10.894 2.555a1.5 1.5 0 0 0-1.788 0l-7.5 8.75a1.5 1.5 0 0 0 1.077 2.479h12.5a1.5 1.5 0 0 0 1.076-2.48l-7.5-8.75Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ปุ่มเปิด/ปิด Chat */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 absolute right-0 bottom-0 z-10"
                aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
            >
                {isOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <ChatIcon />
                )}
            </button>
        </div>
    );
}
```

---

## 📥 ขั้นตอนที่ 3: นำเข้าและใช้งานใน Layout

เพื่อให้ Chatbot ปรากฏในทุกหน้าของเว็บไซต์ เราจะเพิ่ม `ChatBot` Component เข้าไปใน `app/layout.tsx` ของคุณ

### 📄 ไฟล์: `app/layout.tsx` (ปรับปรุง)

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-expect-error // *** การแก้ไข: เปลี่ยน @ts-ignore เป็น @ts-expect-error ***
import "./globals.css";
// *** การแก้ไข 2.1: ย้ายการประกาศตัวแปร Font มาไว้ด้านบน ***

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

// *** เพิ่มการนำเข้า ChatBot ที่ถูกแก้ไขแล้ว ***
import { ChatBot } from "@/components/ChatBot";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`} // *** ใช้ตัวแปรที่ประกาศแล้ว ***
            >
                {children}
                <ChatBot />
            </body>
        </html>
    );
}
```

### 🏁 สรุปผล

ตอนนี้คุณได้ติดตั้ง **AI Chatbot** ที่ทำงานร่วมกับ **Gemini API** แล้ว

1. **Server Side (`app/api/chat/route.ts`)**: จัดการการเชื่อมต่อ AI อย่างปลอดภัยและส่งข้อมูลแบบ Stream
2. **Client Side (`components/ChatBot.tsx`)**: จัดการ UI, การจัดการสถานะ, และการโต้ตอบกับผู้ใช้ด้วย Tailwind CSS และ `useChat` Hook
3. **Universal Placement (`app/layout.tsx`)**: Chatbot จะปรากฏเป็นหน้าต่างลอยที่มุมขวาล่างของทุกหน้า

อย่าลืมรันโปรเจกต์ด้วย `npm run dev` และตรวจสอบให้แน่ใจว่าคุณได้ตั้งค่าคีย์ **`GOOGLE_GENERATIVE_AI_API_KEY`** ในไฟล์ `.env.local` เรียบร้อยแล้วครับ\!
