import { getConciseGeminiResponse, getGeminiChatResponse } from '../utils/geminiClient.js';

// Controller for general concise text generation
export const generateConciseText = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt text is required in the request body.' });
  }

  try {
    const text = await getConciseGeminiResponse(prompt);
    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error in generateConciseText controller:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
export const handleChat = async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required for chat.' });
  }

  if (history && !Array.isArray(history)) {
    return res.status(400).json({ error: 'History must be an array.' });
  }

  try {
    const reply = await getGeminiChatResponse(history || [], message);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("🔴 Error in handleChat controller:");
    console.error("▶ message:", error.message);
    console.error("▶ stack:", error.stack);
    if (error.cause) console.error("▶ cause:", error.cause);
    console.error("▶ input:", JSON.stringify(req.body, null, 2));

    res.status(500).json({
      error: error.message || 'Internal Server Error',
    });
  }
};
