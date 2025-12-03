# ธีม Glassmorphism

## 📄 1. `app/layout.tsx` (เพิ่มพื้นหลัง Gradient)

ไฟล์นี้กำหนดโครงสร้าง HTML หลักและเพิ่มพื้นหลัง Gradient เพื่อให้เอฟเฟกต์ Glassmorphism ทำงานได้อย่างสวยงาม

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
```

-----

## 📄 2. `app/page.tsx` (Glassmorphism Card และ Layout)

ไฟล์นี้ทำ Data Fetching และแสดงผล Card Content ในรูปแบบ Glassmorphism และรวม `ChatBot` เข้าไปใน Layout

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

    // 💡 FIX: ใช้ Path ที่ถูกต้องสำหรับ API Content คือ /api/chat (ตามที่คุณแจ้ง)
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

-----

## 📄 3. `components/ChatBot.tsx` (Glassmorphism Chat)

ไฟล์นี้คือส่วนของ ChatBot ที่ถูกแก้ไขให้ใช้ธีมแก้วและแก้ไขปัญหาฟอร์มล้นขอบทั้งหมด

```tsx
// components/ChatBot.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

// ประกาศ Type และ Custom useChat Hook
type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

// Custom Hook สำหรับ Chat Logic
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
        
        // 1. เตรียม State และจับเวลา
        const requestStartTime = Date.now(); // 💡 เริ่มจับเวลาที่ Client
        const messagesToSend = [...messages, userMessage]; 

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messagesToSend }),
            });

            if (!res.ok || !res.body) {
                throw new Error(`API returned status ${res.status}`);
            }

            // 2. จัดการ Streaming Response
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let aiContent = '';
            
            // เพิ่มข้อความ AI เปล่าๆ เข้าไปใน State ก่อนเพื่อเริ่มอัปเดต
            const aiMessageId = String(Date.now() + 1);
            setMessages((prev) => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

            // 3. อ่าน Stream และอัปเดต UI
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                aiContent += chunk;

                // อัปเดตข้อความ Assistant แบบ Real-time
                setMessages((prev) => 
                    prev.map(msg => 
                        msg.id === aiMessageId ? { ...msg, content: aiContent } : msg
                    )
                );
            }
            
            const requestEndTime = Date.now();
            const totalDuration = requestEndTime - requestStartTime;

            // 💡 CONSOLE LOG: พิมพ์เวลาที่ใช้ไปทั้งหมด (Client Console)
            console.log(`%c[Client Chat Duration] ${totalDuration}ms`, 'color: green; font-weight: bold;');


        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [...prev, {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: "เกิดข้อผิดพลาดในการตอบกลับ กรุณาลองอีกครั้ง",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, input, handleInputChange, handleSubmit, isLoading };
}


// Component หลัก
export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat', 
        initialMessages: [{ id: '1', role: 'assistant', content: 'สวัสดีครับ มีอะไรให้ช่วยไหมครับ?' }]
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (isOpen) {
            // ใช้ setTimeout เพื่อให้แน่ใจว่า DOM ถูก Render เรียบร้อยแล้วก่อน Scroll
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [messages, isOpen]); 

    return (
        <>
            {/* 1. Chat Container (Glassmorphism Effect) */}
            <div
                className={`
                    fixed bottom-20 right-4 w-full max-w-sm h-[85vh] md:h-[600px] 
                    bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl 
                    border border-white/20 dark:border-gray-700/50
                    rounded-2xl shadow-2xl transition-all duration-300 z-50
                    flex flex-col
                    ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
                `}
            >
                {/* 1.1 Chat Header (ปรับ Border เพื่อให้เข้ากับธีมแก้ว) */}
                <header className="p-4 border-b border-white/20 dark:border-gray-700/50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant 🤖</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-gray-900/80 dark:text-white/80 hover:bg-white/10 dark:hover:bg-gray-700/20 rounded-full"
                        aria-label="Close Chat"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                {/* 1.2 Message Area (ใช้ 'grow' และ overflow-y-auto) */}
                <div className="grow overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`
                                    max-w-[80%] p-3 rounded-lg shadow-sm whitespace-pre-wrap
                                    ${message.role === 'user'
                                        ? 'bg-blue-600/90 text-white rounded-br-none' 
                                        : 'bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-tl-none' 
                                    }
                                `}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* 1.3 Input Form (ใช้ 'grow' แทน 'flex-grow') */}
                <div className="p-4 border-t border-white/20 dark:border-gray-700/50">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder={isLoading ? "กำลังคิด..." : "พิมพ์ข้อความที่นี่..."}
                            disabled={isLoading}
                            // ใช้ 'grow' และพื้นหลังโปร่งใส
                            className="grow p-3 border border-white/40 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                            aria-label="Send Message"
                        >
                            {isLoading ? (
                                <div className="animate-spin w-5 h-5 border-2 border-t-2 border-white/80 border-t-white rounded-full"></div>
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
                    </form>
                </div>
            </div>

            {/* 2. ปุ่มเปิด/ปิด Chat */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 fixed right-4 bottom-4 z-50"
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12.766L4.5 9.45v5.52l-2.25 3.316ZM12 4.5l-7.886 11.583a.75.75 0 0 0 .515 1.167h15.742a.75.75 0 0 0 .515-1.167L12 4.5Z"
                        />
                    </svg>
                )}
            </button>
        </>
    );
}
```
