const chatbot = document.getElementById('chatbot');
const toggleBtn = document.getElementById('chatbot-toggle');
const closeBtn = document.getElementById('close-chatbot');
const body = document.getElementById('chatbot-body');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// فتح/إغلاق الـ Chatbot
toggleBtn.addEventListener('click', () => {
    chatbot.style.display = 'flex';
    welcomeMessage();
});

closeBtn.addEventListener('click', () => {
    chatbot.style.display = 'none';
});

// رسالة الترحيب التلقائية
function welcomeMessage() {
    const msg = document.createElement('div');
    msg.classList.add('message', 'ai-message');
    msg.innerText = 'أهلاً بك! كيف أستطيع مساعدتك اليوم؟';
    body.prepend(msg);
}

// ارسال رسالة المستخدم
function sendMessage() {
    const text = input.value.trim();
    if(!text) return;

    const userMsg = document.createElement('div');
    userMsg.classList.add('message', 'user-message');
    userMsg.innerText = text;
    body.prepend(userMsg);

    input.value = '';
    sendBtn.disabled = true;

    typingIndicator.style.display = 'flex';

    setTimeout(() => {
        typingIndicator.style.display = 'none';
        const aiMsg = document.createElement('div');
        aiMsg.classList.add('message', 'ai-message');
        aiMsg.innerText = generateAIReply(text);
        body.prepend(aiMsg);
        sendBtn.disabled = false;
    }, 1500);
}

function sendQuickMessage(text) {
    input.value = text;
    sendMessage();
}

sendBtn.addEventListener('click', sendMessage);

input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') sendMessage();
});

function generateAIReply(text) {
    text = text.toLowerCase();
    if(text.includes('آخر الأخبار')) return 'اليوم لدينا تحديثات جديدة في الموقع!';
    if(text.includes('عضوية vip')) return 'لشراء العضوية VIP، يمكنك الذهاب إلى صفحة المتجر واختيار VIP.';
    return 'أنا هنا لأساعدك، ما الذي ترغب بمعرفته؟';
}
