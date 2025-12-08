// logout.js (Netlify Function)

exports.handler = async (event, context) => {
    // 1. رابط التوجيه بعد إتمام عملية تسجيل الخروج
    const LOGOUT_REDIRECT = '/login.html'; 

    // 2. تعيين تاريخ انتهاء صلاحية في الماضي (Date: 0)
    // هذا يضمن أن المتصفح سيحذف الكوكيز فوراً
    const expiredDate = new Date(0).toUTCString();

    // 3. بناء مصفوفة أوامر حذف الكوكيز
    // ملاحظة: يجب أن تتطابق خصائص الكوكي (مثل HttpOnly و Path) مع الخصائص التي تم استخدامها عند تعيينها.
    const cookies = [
        // حذف كوكي Access Token الآمن (مهم جداً: HttpOnly; Secure)
        `discord_access_token=; HttpOnly; Secure; Expires=${expiredDate}; Path=/; SameSite=Lax`,
        
        // حذف كوكيز بيانات المستخدم (للعرض في الواجهة الأمامية: Secure)
        `discord_user_id=; Secure; Expires=${expiredDate}; Path=/; SameSite=Lax`,
        `discord_username=; Secure; Expires=${expiredDate}; Path=/; SameSite=Lax`,
        `discord_avatar_hash=; Secure; Expires=${expiredDate}; Path=/; SameSite=Lax`,
    ];

    // 4. إرجاع استجابة التوجيه (302) وإرسال أوامر حذف الكوكيز في الهيدر
    return {
        statusCode: 302,
        headers: {
            Location: LOGOUT_REDIRECT, // توجيه إلى صفحة تسجيل الدخول
            'Set-Cookie': cookies,     // أمر حذف جميع الكوكيز
        },
    };
};