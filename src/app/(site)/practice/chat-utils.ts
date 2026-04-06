export type ChatMessageRole = 'ai' | 'user';
export type ChatMessageType = 'text' | 'math';

export type ChatMessage = {
    id: string;
    role: ChatMessageRole;
    type: ChatMessageType;
    text: string;
    title?: string;
    hint?: string;
};

function createMessageId() {
    return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Khởi tạo tin nhắn ban đầu
const defaultMessages: ChatMessage[] = [
    {
        id: createMessageId(),
        role: 'ai',
        type: 'text',
        title: 'AI Tutor',
        text: "Great! Let's break this down together. To solve a quadratic equation of the form ax² + bx + c = 0, we often start by factoring.",
        hint: 'Step 1: Factor the equation',
    },
    {
        id: createMessageId(),
        role: 'user',
        type: 'text',
        text: '-2 and -3?',
    },
];

const responseTemplates = [
    {
        keywords: ['factor', 'phân tích', 'phân tích'],
        text: 'Đúng rồi, ta cố gắng tìm hai số nhân với 6 và cộng lại thành -5. Hãy thử các cặp số nào?',
        hint: 'Tìm số a và b sao cho a × b = 6 và a + b = -5.',
    },
    {
        keywords: ['ở đâu', 'tại sao', 'why', 'vì sao', 'lý do'],
        text: 'Bởi vì với phương trình bậc hai, nếu ta viết nó thành tích của hai nhị thức bậc nhất thì dễ giải hơn. Ta cần tìm hai số phù hợp để chuyển về dạng đó.',
        hint: 'Hãy kiểm tra hai số -2 và -3: chúng nhân với nhau ra 6 và cộng lại thành -5.',
    },
    {
        keywords: ['xuống', 'how', 'giải', 'solve'],
        text: 'Ta sẽ viết x² - 5x + 6 thành (x - 2)(x - 3). Khi đó, nghiệm là x = 2 hoặc x = 3.',
        hint: 'Lấy từng nhân tử bằng 0 để tìm nghiệm.',
    },
];

// const fallbackResponse: ChatMessage = {
//     id: createMessageId(),
//     role: 'ai',
//     title: 'AI Tutor',
//     text: 'Hãy cho mình biết bạn muốn hỏi gì về phương trình này. Mình sẽ giải thích từng bước cho bạn.',
//     hint: 'Bạn có thể hỏi: Làm sao để phân tích? hoặc Tại sao nghiệm là 2 và 3?',
// };

export function getDefaultMessages(): ChatMessage[] {
    return defaultMessages.map((message) => ({ ...message }));
}

export function getAiResponse(userInput: string, type: ChatMessageType = 'text'): ChatMessage {
    const normalized = userInput.trim().toLowerCase();

    for (const template of responseTemplates) {
        if (template.keywords.some((keyword) => normalized.includes(keyword))) {
            return {
                id: createMessageId(),
                role: 'ai',
                type,
                title: 'AI Tutor',
                text: template.text,
                hint: template.hint,
            };
        }
    }

    return {
        id: createMessageId(),
        role: 'ai',
        type,
        title: 'AI Tutor',
        text: 'Mình đã nhận được câu hỏi của bạn. Hãy cùng qua từng bước để giải phương trình này nhé.',
        hint: 'Bắt đầu bằng cách tìm hai số nhân bằng 6 và tổng bằng -5.',
    };
}
