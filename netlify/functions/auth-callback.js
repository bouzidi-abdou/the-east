// لاستخدام واجهة fetch API لإجراء طلبات HTTP (متوفرة في بيئة Netlify الحديثة)
const fetch = require('node-fetch');

// معلومات التفويض من متغيرات البيئة
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';

// رابط التوجيه عند النجاح والفشل
const SUCCESS_REDIRECT = '/index.html';
const FAILURE_REDIRECT = '/login.html?error=auth_failed';

exports.handler = async (event, context) => {
    // 1. استلام الكود من رابط Discord
    const code = event.queryStringParameters.code;

    // 2. التحقق من وجود الكود
    if (!code) {
        // إذا لم يكن هناك كود (مثلاً قام المستخدم بإلغاء التفويض)، وجهه لصفحة الدخول
        return { statusCode: 302, headers: { Location: FAILURE_REDIRECT } };
    }

    // 3. بناء بيانات طلب تبديل الكود بالتوكن (Token Exchange Request)
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', REDIRECT_URI);
    data.append('scope', 'identify guilds'); // تأكد من مطابقتها للصلاحيات المطلوبة

    try {
        // 4. إرسال الطلب إلى Discord API
        const response = await fetch(DISCORD_TOKEN_URL, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // 5. تحليل الرد
        const tokenData = await response.json();

        // 6. التحقق من نجاح عملية تبديل التوكن
        if (!response.ok || tokenData.error) {
            console.error('Discord API Error:', tokenData.error_description || tokenData.error);
            return { statusCode: 302, headers: { Location: FAILURE_REDIRECT } };
        }

        // 7. استخلاص Access Token
        const accessToken = tokenData.access_token;

        // 8. التوجيه النهائي وتعيين ملف تعريف الارتباط (Cookie)
        // **هذه هي أهم خطوة أمنية:** نستخدم ملف تعريف ارتباط HTTP-Only لمنع JavaScript من قراءة التوكن مباشرة
        const cookie = `discord_access_token=${accessToken}; HttpOnly; Secure; Max-Age=${tokenData.expires_in}; Path=/; SameSite=Lax`;

        return {
            statusCode: 302,
            headers: {
                Location: SUCCESS_REDIRECT, // توجيه إلى index.html
                'Set-Cookie': cookie, // تعيين ملف تعريف الارتباط الآمن
            },
        };

    } catch (error) {
        console.error('Exchange Process Failed:', error);
        return {
            statusCode: 302,
            headers: { Location: FAILURE_REDIRECT },
        };
    }
};