import { Router } from 'express';
import { generateConciseText, handleChat } from '../controller/askAIController.js';

const router = Router();

// Route for concise text generation
router.post('/concise-text', generateConciseText);

// Route for chat conversations
router.post('/chat', handleChat);

export default router;