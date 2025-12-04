import { defineConfig, globalIgnores } from "eslint/config";
// 1. Next.js Base Configs (Vitals & TypeScript)
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// 2. Tailwind CSS Plugin (สำหรับรู้จัก Utility Classes)
import pluginTailwind from "eslint-plugin-tailwindcss";

// 3. Prettier Config (ต้องใส่เป็นตัวสุดท้ายเพื่อปิด Rules ที่ขัดแย้ง)
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
    // 1. Next.js Core Rules
    ...nextVitals,
    // 2. Next.js TypeScript Rules (ครอบคลุม @typescript-eslint)
    ...nextTs,

    // 3. Tailwind CSS Rules (เพื่อตรวจสอบความถูกต้องของ Utility Classes)
    pluginTailwind.configs["flat/recommended"],

    // 4. Prettier: ปิด Rules ทั้งหมดที่อาจขัดแย้งกับ Prettier
    prettier,

    // 5. Global Ignores (จาก Next.js Config)
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),

    // 6. Project-Specific Overrides (จากไฟล์ page.tsx และ package.json)
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            // ปิด Rule react/react-in-jsx-scope (สำหรับ New JSX Transform ใน React 17+/Next.js)
            "react/react-in-jsx-scope": "off",
            // ปิด Rule react/require-default-props (สำหรับ TypeScript ที่ใช้ Optional Props)
            "react/require-default-props": "off",
            // 💡 ปิด Rule ที่แนะนำชื่อ Class ที่ไม่ถูกต้องสำหรับ Tailwind v4 Core
            "tailwindcss/suggest-canonical-classes": "off",
        },
    },
]);

export default eslintConfig;