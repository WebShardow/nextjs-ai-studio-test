// global.d.ts

// ประกาศโมดูลสำหรับไฟล์ CSS ทุกไฟล์ (*.css)
// แก้ไข: ใช้ Record<string, never> แทน any เพื่อหลีกเลี่ยง ESLint Error
declare module '*.css' {
    // Record<string, never> หมายถึง Object ที่ไม่ควรมี Properties ใดๆ
    const content: Record<string, never>; 
    export default content;
}

// ประกาศโมดูลสำหรับไฟล์ SCSS/SASS ทุกไฟล์ (*.scss, *.sass)
declare module '*.scss' {
    const content: Record<string, never>;
    export default content;
}

declare module '*.sass' {
    const content: Record<string, never>;
    export default content;
}