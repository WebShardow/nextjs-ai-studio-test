// app/page.tsx
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// 1. สร้าง Component สำหรับหน้าหลัก (Default Export)
export default async function Home() {
    let resultText = "Loading..."; // ข้อความเริ่มต้น

    try {
        // 2. เรียกใช้ API ภายใน Component
        const { text } = await generateText({
            // คีย์จะถูกโหลดอัตโนมัติจาก .env.local
            model: google("gemini-2.5-flash"), 
            prompt: "What is plant-based milk?",
        });
        resultText = text; // เก็บผลลัพธ์
    } catch (error) {
        // 3. จัดการข้อผิดพลาด (เช่น ถ้าคีย์หายไป)
        console.error("AI Generation Error:", error);
        resultText = "Error: Failed to generate text. Check API Key and server logs.";
    }
    
    // 4. Component ต้อง Return JSX (UI)
    return (
        <main style={{ padding: '20px' }}>
            <h1>Plant-Based Milk Explanation:</h1>
            <p>{resultText}</p>
        </main>
    );
}

// ลบบรรทัด home().catch(console.error); ออก