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