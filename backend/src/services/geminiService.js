const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateRecoveryMessage(customerName = 'Customer') {
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
    });

    const prompt = `
Write a short high-converting WhatsApp re-engagement message for an inactive customer.

Business type: salon
Customer name: {name}
Tone: warm, premium, persuasive
Max 35 words
Include emoji
Include urgency
Include call to action
`;

    const result = await model.generateContent(prompt);

    return result.response.text().trim();
}

module.exports = {
    generateRecoveryMessage,
};