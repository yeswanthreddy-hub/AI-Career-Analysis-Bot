import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { extractTextFromDocument } from './resumeParser.js';
import { analyzeResume, compareResumes, answerCareerQuestion } from './ai.js';
import { startTelegramBot } from './bot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer memory storage for file uploads (PDF, DOCX, DOC)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase();
    if (
      ext.endsWith('.pdf') ||
      ext.endsWith('.docx') ||
      ext.endsWith('.doc') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and DOC resume files are supported.'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Career Analysis Server running',
    xaiConfigured: Boolean(process.env.XAI_API_KEY && !process.env.XAI_API_KEY.includes('your_xai_api_key')),
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN.includes('your_telegram_bot_token'))
  });
});

/**
 * POST /api/analyze
 * Accepts:
 *  - multipart/form-data with file (PDF/DOCX/DOC) + jobDescription
 *  - application/json with resumeText + jobDescription
 */
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';
    const jobDescription = req.body.jobDescription || '';

    if (req.file) {
      // Document file upload (PDF or Word)
      const parsed = await extractTextFromDocument(req.file.buffer, req.file.originalname);
      resumeText = parsed.text;
    } else if (req.body.resumeText) {
      // Plain text paste
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ error: 'Please provide a PDF or Word resume, or paste resume text.' });
    }

    if (!resumeText || resumeText.trim().length < 40) {
      return res.status(400).json({
        error: 'Resume text is too short or could not be read. Please ensure your document contains selectable text.'
      });
    }

    const analysis = await analyzeResume(resumeText, jobDescription, req.file?.originalname || '');
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

/**
 * POST /api/compare
 * Accepts array of { name, text } or multiple files via multipart
 */
app.post('/api/compare', upload.array('resumes', 10), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription || '';
    const resumesList = [];

    // Check uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const parsed = await extractTextFromDocument(file.buffer, file.originalname);
        resumesList.push({
          id: file.originalname,
          name: file.originalname.replace(/\.[^/.]+$/, ''),
          text: parsed.text
        });
      }
    }

    // Check JSON payload resumes
    if (req.body.resumes && Array.isArray(req.body.resumes)) {
      for (const item of req.body.resumes) {
        resumesList.push({
          id: item.id || item.name,
          name: item.name || 'Candidate',
          text: item.text || ''
        });
      }
    }

    if (resumesList.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 resumes to compare.' });
    }

    // Benchmark strictly the latest 2 or latest 3 resumes
    const resumesToCompare = resumesList.slice(-3);
    const comparison = await compareResumes(resumesToCompare, jobDescription);
    res.json({ success: true, data: comparison });
  } catch (error) {
    console.error('Error in /api/compare:', error);
    res.status(500).json({ error: error.message || 'Failed to compare resumes' });
  }
});

/**
 * POST /api/chat
 * Answers general career / coding / interview questions
 */
app.post('/api/chat', async (req, res) => {
  try {
    const question = req.body.question || '';
    if (!question.trim()) {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }

    const answer = await answerCareerQuestion(question);
    res.json({ success: true, answer });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: error.message || 'Failed to answer career question' });
  }
});

// Start Express Server & Telegram Bot only when not running as a Vercel Serverless Function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✨ AI Career Analysis Server running at http://localhost:${PORT}`);
  });

  // Start Telegram Bot if token exists
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (TELEGRAM_TOKEN && TELEGRAM_TOKEN.trim() !== '' && !TELEGRAM_TOKEN.includes('your_telegram_bot_token')) {
    try {
      startTelegramBot(TELEGRAM_TOKEN);
      console.log('🤖 Telegram bot integrated and active in background.');
    } catch (err) {
      console.warn('Telegram bot initialization error:', err.message);
    }
  }
}

// Global exception guards to prevent process termination on transient socket drops (e.g. ECONNRESET)
process.on('uncaughtException', (err) => {
  if (err.code === 'EFATAL' || err.message?.includes('ECONNRESET')) {
    console.warn('[Network Notice] Transient connection reset caught, reconnecting...');
  } else {
    console.error('[Process uncaughtException]', err.message || err);
  }
});

process.on('unhandledRejection', (reason) => {
  console.warn('[Process unhandledRejection]', reason?.message || reason);
});

export default app;


