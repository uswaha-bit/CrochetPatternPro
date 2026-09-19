import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in the .env file.');
  process.exit(1); // Exit if API key is missing
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Function to get a concise response from Gemini
export const getConciseGeminiResponse = async (promptText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use gemini-2.5-flash for efficiency

    // IMPORTANT: Engineering the prompt for a shorter reply
    const concisePrompt = `Please provide a very short and concise answer (max 2-3 sentences or a brief bullet list if applicable) to the following: "${promptText}"`;

    const result = await model.generateContent(concisePrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};


export const getGeminiChatResponse = async (chatHistory, newMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Static system prompt for context awareness
    const systemPrompt = {
      role: 'user',
      parts: [
        {
          text: `
You are an AI assistant integrated into an app called Crochet Pattern Pro.

This app allows users to:
- Create and edit crochet patterns visually
- See graphical visualizations
- Export patterns as images
- Share posts and engage with the community
- Learn new skills and improve crochet techniques

If the user asks anything outside this scope, such as internal app data or settings you don’t know about, politely respond with:
"I'm not sure about that — please contact support for more help regarding this feature."
        `.trim()
        }
      ]
    };

    const fullHistory = [systemPrompt, ...chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))];

    const chat = model.startChat({ history: fullHistory });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Error in Gemini chat:", error);
    throw new Error("Failed to get chat response from Gemini API.");
  }
};
