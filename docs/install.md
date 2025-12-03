# Installation Guide

To install the Gemini API SDK, follow the steps below based on your development environment.:
[vercel-ai-sdk-example](https://ai.google.dev/gemini-api/docs/vercel-ai-sdk-example?hl=th)

## Prerequisites 📝 ข้อกำหนดเบื้องต้นที่คุณต้องมีก่อนเริ่มต้น

ก่อนที่คุณจะเริ่มดำเนินการ ตรวจสอบให้แน่ใจว่าคุณมีข้อกำหนดเบื้องต้นต่อไปนี้ติดตั้งอยู่ในระบบของคุณ :

### ⚙️ เครื่องมือและบัญชีหลัก

* **Node.js** (เวอร์ชัน 14 หรือสูงกว่า)
* **npm** (Node Package Manager - ตัวจัดการแพ็กเกจของ Node)
* **An active Gemini API account** (บัญชี Gemini API ที่ใช้งานอยู่)
* **API key from your Gemini API account** (คีย์ API จากบัญชี Gemini API ของคุณ)
* **Internet connection** (การเชื่อมต่ออินเทอร์เน็ต)
* **code editor** (e.g., VSCode, Sublime Text) (โปรแกรมแก้ไขโค้ด เช่น VSCode, Sublime Text)

### 🧪 เครื่องมือเสริมและสำหรับการทดสอบ

* **Git** (optional, for version control) (กิต, ทางเลือก, สำหรับการควบคุมเวอร์ชัน)
* **Postman** (optional, for API testing) (โพสต์แมน, ทางเลือก, สำหรับการทดสอบ API)
* **cURL** (optional, for command-line API testing) (ซี-เคิร์ล, ทางเลือก, สำหรับการทดสอบ API ด้วยบรรทัดคำสั่ง)
* **A web browser** (e.g., Chrome, Firefox) (เว็บเบราว์เซอร์ เช่น Chrome, Firefox)
* **Access to terminal/command prompt** (สิทธิ์เข้าถึงเทอร์มินัล/พร้อมท์คำสั่ง)

### 🧠 ความรู้พื้นฐานที่จำเป็น

* **Basic knowledge of JavaScript and Node.js** (ความรู้พื้นฐานเกี่ยวกับ JavaScript และ Node.js)
* **Familiarity with RESTful APIs** (ความคุ้นเคยกับ RESTful API)
* **Basic understanding of JSON format** (ความเข้าใจพื้นฐานเกี่ยวกับรูปแบบ JSON)
* **Familiarity with npm package management** (ความคุ้นเคยกับการจัดการแพ็กเกจ npm)
* **Understanding of asynchronous programming in JavaScript** (ความเข้าใจเกี่ยวกับการเขียนโปรแกรมแบบอะซิงโครนัสใน JavaScript)
* **Basic knowledge of HTTP methods** (GET, POST, etc.) (ความรู้พื้นฐานเกี่ยวกับเมธอด HTTP เช่น GET, POST ฯลฯ)
* **Familiarity with environment variables for managing sensitive data** (ความคุ้นเคยกับตัวแปรสภาพแวดล้อมสำหรับการจัดการข้อมูลที่ละเอียดอ่อน)
* **Basic understanding of error handling in JavaScript** (ความเข้าใจพื้นฐานเกี่ยวกับการจัดการข้อผิดพลาดใน JavaScript)
* **Knowledge of using API documentation for reference** (ความรู้ในการใช้เอกสารประกอบ API สำหรับอ้างอิง)

## การติดตั้งขั้นตอนที่ 1: สร้างโปรเจ็กต์ Node.js ใหม่

เริ่มต้นด้วยการสร้างไดเร็กทอรีใหม่สำหรับโปรเจ็กต์ของคุณและเปลี่ยนไปยังไดเร็กทอรีนั้น :

* จากนั้นติดตั้ง AI SDK, ผู้ให้บริการ Generative AI ของ Google และการอ้างอิงอื่นๆ ที่จำเป็น โดยใช้คำสั่ง npm ต่อไปนี้ :

```bash
npm install ai @ai-sdk/google zod
npm install -D @types/node tsx typescript && npx tsc --init
```

* หากต้องการป้องกันข้อผิดพลาดของคอมไพเลอร์ TypeScript ให้แสดงความคิดเห็นในบรรทัดต่อไปนี้ใน `tsconfig.json` ที่สร้างขึ้น :

```json
//"verbatimModuleSyntax": true,
```

* แอปพลิเคชันนี้จะใช้แพ็กเกจของบุคคลที่สาม Puppeteer และ Chart.js ในการแสดงผลแผนภูมิและ สร้าง PDF ด้วย

```bash
npm install puppeteer chart.js
npm install -D @types/chart.js
```

* แพ็กเกจ puppeteer ต้องเรียกใช้สคริปต์เพื่อดาวน์โหลดเบราว์เซอร์ Chromium โปรแกรมจัดการแพ็กเกจอาจขออนุมัติ ดังนั้นโปรดอนุมัติสคริปต์เมื่อได้รับแจ้ง

## กำหนดค่าคีย์ API

ตั้งค่า `GOOGLE_GENERATIVE_AI_API_KEY` [ตัวแปรสภาพแวดล้อมด้วยคีย์ Gemini API(ai-env.md)] ผู้ให้บริการ Generative AI ของ Google จะค้นหาคีย์ API ในตัวแปรสภาพแวดล้อมนี้โดยอัตโนมัติ

ตั้งค่าไฟล์ `.env.local` ในไดเร็กทอรีรากของโครงการของคุณและเพิ่มคีย์ API ของคุณ :

```env
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key_here"
```

แทนที่ `your_gemini_api_key_here` ด้วยคีย์ Gemini API จริงของคุณ

## สร้างแอปพลิเคชัน

ตอนนี้เรามาสร้างไฟล์หลักสำหรับแอปพลิเคชันกัน สร้าง/แก้ไข ไฟล์ใหม่ชื่อ `page.tsx` ในไดเรกทอรีโปรเจ็กต์`/app`

เพิ่มโค้ดตัวอย่างต่อไปนี้ใน `page.tsx` เพื่อทดสอบการตั้งค่า Gemini API SDK :

```tsx
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
```

run สคริปต์ด้วยคำสั่งต่อไปนี้ :

```bash
npm run dev
```

หากตั้งค่าทุกอย่างถูกต้อง คุณจะเห็นคำตอบของ Gemini พิมพ์ลงใน คอนโซล

```ai
Plant-Based Milk Explanation:
**Plant-based milk** (also known as non-dairy milk, vegan milk, or plant milk) is a dairy-free beverage made from water and a variety of plant materials. It's designed to mimic the appearance, texture, and often the uses of traditional animal-derived milk (like cow's milk). Here's a breakdown of what it is: 1. **Source:** Instead of coming from animals, it's extracted from plants such as: * **Grains:** Oats, rice, quinoa * **Nuts:** Almonds, cashews, hazelnuts, macadamias * **Seeds:** Hemp seeds, flax seeds, sunflower seeds * **Legumes:** Soybeans, peas * **Fruits:** Coconuts 2. **Production Process (General):** * The raw plant material is typically soaked in water. * It's then blended with water until smooth. * The mixture is strained to separate the liquid from the pulp (fibrous solids). * Many commercial plant-based milks are fortified with vitamins and minerals (like calcium, vitamin D, and B12) to enhance their nutritional profile, as these are often naturally abundant in dairy milk. * Sweeteners, stabilizers, thickeners, and flavorings may also be added to achieve the desired taste and consistency. * Finally, it's pasteurized or UHT (Ultra-High Temperature) processed for shelf stability. 3. **Why People Choose It:** * **Lactose Intolerance:** A common digestive issue where the body can't properly digest lactose, a sugar found in dairy. * **Dairy Allergies:** An immune response to proteins in dairy. * **Vegan Diet:** As part of a plant-based lifestyle that avoids all animal products for ethical, environmental, or health reasons. * **Environmental Concerns:** Many people choose plant-based milks due to their lower environmental footprint (e.g., less water, land, and greenhouse gas emissions) compared to dairy milk. * **Health Reasons:** Some prefer plant-based milks for their lower saturated fat content, lack of cholesterol, or specific nutritional profiles. * **Taste Preference:** Some simply prefer the taste or enjoy the variety. 4. **Common Types:** * **Almond Milk:** One of the most popular, often light in flavor and texture. * **Soy Milk:** A long-standing staple, generally higher in protein, with a distinct flavor. * **Oat Milk:** Very popular recently, known for its creamy texture and mild, slightly sweet taste, making it great for coffee. * **Coconut Milk:** Ranges from rich, thick canned versions for cooking to lighter, thinner refrigerated versions for drinking. * **Rice Milk:** Hypoallergenic, but often lower in protein and has a thin consistency. * **Cashew Milk:** Creamier than almond milk, with a richer flavor. * **Hemp Milk:** Made from hemp seeds, often has an earthy flavor and good nutritional profile (omega-3s). * **Pea Milk (e.g., Ripple):** Made from yellow peas, known for its high protein content and creamy texture, often fortified well. In essence, plant-based milk offers a diverse range of alternatives to traditional dairy, catering to various dietary needs, ethical stances, and taste preferences.
```
