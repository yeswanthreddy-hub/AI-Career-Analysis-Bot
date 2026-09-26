import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import { extractTextFromDocument } from './resumeParser.js';
import { analyzeResume, compareResumes, answerCareerQuestion } from './ai.js';
import { formatTelegramAnalysis, formatTelegramComparison } from './formatter.js';

dotenv.config();

const TOKEN = (process.env.TELEGRAM_BOT_TOKEN || '').trim();

/**
 * Splits text into safe chunks under Telegram's 4096 character limit.
 * Splits cleanly at section breaks, double newlines, single newlines, or spaces.
 */
function splitMessage(text = '', maxLength = 3500) {
  if (!text || typeof text !== 'string') return [];
  if (text.length <= maxLength) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    // Attempt clean break at markdown section line first
    let splitIdx = remaining.lastIndexOf('\n\n━━━━━━━━━━━━━━━━━━\n\n', maxLength);
    if (splitIdx === -1 || splitIdx < maxLength * 0.3) {
      splitIdx = remaining.lastIndexOf('\n\n', maxLength);
    }
    if (splitIdx === -1 || splitIdx < maxLength * 0.3) {
      splitIdx = remaining.lastIndexOf('\n', maxLength);
    }
    if (splitIdx === -1 || splitIdx < maxLength * 0.3) {
      splitIdx = remaining.lastIndexOf(' ', maxLength);
    }
    if (splitIdx === -1) {
      splitIdx = maxLength;
    }

    const chunk = remaining.slice(0, splitIdx).trim();
    if (chunk) chunks.push(chunk);
    remaining = remaining.slice(splitIdx).trim();
  }

  return chunks;
}

// Safe message sender: splits long messages (>3500 chars) and catches Markdown V1 formatting issues
async function safeSendMessage(bot, chatId, text, options = {}) {
  if (!text) return null;

  const rawItems = Array.isArray(text) ? text : [text];
  let lastMessage = null;

  for (const item of rawItems) {
    const chunks = splitMessage(item, 3500);

    for (const chunk of chunks) {
      try {
        lastMessage = await bot.sendMessage(chatId, chunk, options);
      } catch (err) {
        console.warn('[Telegram Send Warning]', err.message);
        // If error is message too long or markdown parse error, fallback to unformatted smaller sub-chunks
        const cleanChunk = chunk.replace(/[*_`]/g, '');
        const subChunks = splitMessage(cleanChunk, 3000);
        for (const sub of subChunks) {
          try {
            lastMessage = await bot.sendMessage(chatId, sub, { ...options, parse_mode: undefined });
          } catch (innerErr) {
            console.error('[Telegram Send Fallback Error]', innerErr.message);
          }
        }
      }
    }
  }

  return lastMessage;
}

let activeBotInstance = null;

export function startTelegramBot(botToken) {
  if (activeBotInstance) {
    console.log('[Telegram Bot] Bot is already running.');
    return activeBotInstance;
  }

  if (!botToken || botToken.includes('your_telegram_bot_token')) {
    console.log('[Telegram Bot] Cannot start: TELEGRAM_BOT_TOKEN is missing or placeholder.');
    return null;
  }

  const bot = new TelegramBot(botToken, { polling: true });
  activeBotInstance = bot;

  // In-memory session store by chat ID
  const sessions = new Map();

  function getSession(chatId) {
    if (!sessions.has(chatId)) {
      sessions.set(chatId, {
        activeJobDescription: '',
        awaitingJD: false,
        uploadedResumes: []
      });
    }
    return sessions.get(chatId);
  }

  console.log('🚀 [Telegram Bot] Service started! Listening for incoming Telegram messages...');

  // /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    session.awaitingJD = false;

    const welcome = `👋 *Welcome to AI Career Resume Assistant!*

I am your intelligent career co-pilot and ATS analyzer.

*What I do:*
📊 *Resume Score & Improvements* (7-factor weighted formula, Required vs. Preferred skills)
🎯 *5 High-Impact Skills to Learn* (Prioritized with rationales)
🎓 *3 Verified Course/Certificate Suggestions* (With direct links)
⚖️ *Multiple Candidate Comparison* (Benchmark latest 2 or 3 resumes against a JD)

*Supported File Formats:*
📄 *PDF* (\`.pdf\`)
📝 *Word Documents* (\`.docx\`, \`.doc\`)

*📌 Core Workflow:*
1️⃣ Send \`/setjd\` to target a specific job
2️⃣ Upload your *Resume file (.pdf, .docx, .doc)* for comprehensive AI analysis
3️⃣ Send \`/jd\` at any time to review your active Job Description
4️⃣ Upload multiple resumes and send \`/compare\` to compare the latest 2 or 3 candidates
5️⃣ Or ask any coding, roadmap, or interview question directly!`;

    safeSendMessage(bot, chatId, welcome, { parse_mode: 'Markdown' });
  });

  // /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const help = `💡 *How to use AI Career Assistant:*

1. *Set target job:*
   Send \`/setjd\` and then paste your job description.

2. *Check active job:*
   Send \`/jd\` to review your currently saved Job Description.

3. *Send a Resume:*
   Attach and upload a *.pdf*, *.docx*, or *.doc* resume directly in this chat.

4. *Multi-Resume Comparison:*
   Upload 2 or more resumes, then send \`/compare\` to benchmark the latest 2 or 3 resumes!

5. *Ask Questions:*
   Ask anything like "What is Java?", "Give me a roadmap for Full-Stack Developer", or "How to prepare for system design?"`;

    safeSendMessage(bot, chatId, help, { parse_mode: 'Markdown' });
  });

  // /setjd command (uses [\s\S]+ so multi-line Job Descriptions are captured in full!)
  bot.onText(/\/setjd(?:\s+([\s\S]+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    const inlineJD = match[1]?.trim();

    if (inlineJD) {
      if (session.uploadedResumes && session.uploadedResumes.length > 0) {
        session.previousResumes = session.uploadedResumes.map(r => ({ ...r, analysis: null }));
      }
      session.activeJobDescription = inlineJD;
      session.awaitingJD = false;
      session.uploadedResumes = [];

      return safeSendMessage(
        bot,
        chatId,
        `✅ *New Job Description saved!* (${inlineJD.split(/\s+/).length} words)\n_Session resume list has been refreshed for this new role._\n\nNow upload your Resume(s) as PDF or Word documents (*.pdf*, *.docx*, *.doc*) for analysis.`,
        { parse_mode: 'Markdown' }
      );
    }

    // Set state waiting for next text message
    session.awaitingJD = true;
    safeSendMessage(
      bot,
      chatId,
      `📋 Please paste the full Job Description you want to target.`
    );
  });

  // /jd command: checks if a Job Description is currently saved
  bot.onText(/\/jd/, (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);

    if (session.activeJobDescription && session.activeJobDescription.trim()) {
      const preview = session.activeJobDescription.length > 600
        ? session.activeJobDescription.slice(0, 600) + '...'
        : session.activeJobDescription;

      const reply = `📋 *Current Job Description:*\n\n"${preview}"\n\n📂 *Resumes uploaded for this JD:* ${session.uploadedResumes.length}\nSend your Resume (.pdf, .docx, .doc) for analysis, or send /setjd to set a new Job Description.`;
      safeSendMessage(bot, chatId, reply, { parse_mode: 'Markdown' });
    } else {
      safeSendMessage(
        bot,
        chatId,
        `⚠️ No Job Description currently saved.\n\nPlease set a Job Description first using /setjd.`
      );
    }
  });

  // /clear command
  bot.onText(/\/clear/, (msg) => {
    const chatId = msg.chat.id;
    sessions.set(chatId, { activeJobDescription: '', awaitingJD: false, uploadedResumes: [], previousResumes: [] });
    safeSendMessage(bot, chatId, '🧹 Session cleared. Send /setjd to start fresh with a new Job Description.');
  });

  // /compare command: strictly evaluates ONLY the latest 2 or latest 3 uploaded resumes against the active JD
  bot.onText(/\/compare/, async (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);

    if (!session.activeJobDescription || !session.activeJobDescription.trim()) {
      return safeSendMessage(bot, chatId, '⚠️ Please set a Job Description first using /setjd.');
    }

    // Use resumes uploaded for the current JD; if user just changed JD and hasn't uploaded new ones yet, allow re-comparing previous resumes against the new JD
    const activePool = session.uploadedResumes.length >= 2
      ? session.uploadedResumes
      : (session.uploadedResumes.length === 0 && session.previousResumes?.length >= 2 ? session.previousResumes : session.uploadedResumes);

    if (activePool.length < 2) {
      return safeSendMessage(
        bot,
        chatId,
        `⚠️ You have uploaded *${activePool.length}* resume(s) for the current Job Description. Please upload at least *2 resumes* to run a comparison report.`,
        { parse_mode: 'Markdown' }
      );
    }

    // Compare strictly the latest 2 or latest 3 uploaded resumes
    const resumesToCompare = activePool.slice(-3);
    const totalCount = activePool.length;

    let notice = `⚖️ *Comparing ${resumesToCompare.length} candidates against the active Job Description... Please wait.*\n`;
    if (totalCount > 3) {
      notice += `_(Evaluating latest 3 resumes: ${resumesToCompare.map(r => r.name).join(', ')}. Older resumes are excluded from this comparison.)_\n`;
    }

    await safeSendMessage(bot, chatId, notice, { parse_mode: 'Markdown' });

    try {
      const comparison = await compareResumes(resumesToCompare, session.activeJobDescription);
      const formatted = formatTelegramComparison(comparison);
      await safeSendMessage(bot, chatId, formatted, { parse_mode: 'Markdown' });
    } catch (err) {
      safeSendMessage(bot, chatId, `❌ Error comparing resumes: ${err.message}`);
    }
  });

  // Handle Document (PDF, DOCX, DOC) Uploads
  bot.on('document', async (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    const doc = msg.document;
    const fileName = doc.file_name || 'resume.pdf';
    const lowerName = fileName.toLowerCase();

    // 1. Verify supported file formats
    const isDoc = lowerName.endsWith('.pdf') ||
                  lowerName.endsWith('.docx') ||
                  lowerName.endsWith('.doc') ||
                  doc.mime_type === 'application/pdf' ||
                  doc.mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                  doc.mime_type === 'application/msword';

    if (!isDoc) {
      return safeSendMessage(bot, chatId, '⚠️ Please upload a valid resume file (*.pdf*, *.docx*, or *.doc*).', { parse_mode: 'Markdown' });
    }

    // 2. Check that Job Description exists first
    if (!session.activeJobDescription || !session.activeJobDescription.trim()) {
      return safeSendMessage(
        bot,
        chatId,
        '⚠️ Please set a Job Description first using /setjd before uploading a resume.'
      );
    }

    // 3. Notify user that analysis is in progress
    const statusMsg = await safeSendMessage(bot, chatId, '⏳ Analyzing your resume against the active Job Description...');

    try {
      // 4. Download document in-memory via Telegram file link
      const fileLink = await bot.getFileLink(doc.file_id);
      const fileResponse = await fetch(fileLink);
      if (!fileResponse.ok) {
        throw new Error(`Telegram download failed with status ${fileResponse.status}`);
      }
      const arrayBuffer = await fileResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        return safeSendMessage(bot, chatId, '⚠️ The uploaded file is empty. Please upload a valid resume.');
      }

      // 5. Extract text from PDF / Word document
      const parsed = await extractTextFromDocument(buffer, fileName);
      if (!parsed.text || parsed.text.trim().length < 40) {
        return safeSendMessage(
          bot,
          chatId,
          '⚠️ Could not extract readable text from this file. Please ensure it is not an image-only scan without selectable text.'
        );
      }

      // 6. Run AI analysis against active Job Description (passing fileName for fallback name resolution)
      const analysis = await analyzeResume(parsed.text, session.activeJobDescription, fileName);

      // Determine candidate name: prioritize extracted name, fallback to clean file name (without extension)
      const candidateName = analysis.candidateName && analysis.candidateName !== 'Candidate Name Not Found'
        ? analysis.candidateName
        : fileName.replace(/\.[^/.]+$/, '');

      // Ensure analysis object carries the resolved candidate name for display
      analysis.candidateName = candidateName;

      // Save candidate details in session for the active JD
      session.uploadedResumes.push({
        id: doc.file_id,
        name: candidateName,
        fileName,
        text: parsed.text,
        analysis,
        analyzedForJD: session.activeJobDescription.trim(),
        timestamp: Date.now()
      });

      // 7. Format clean Telegram message
      const formatted = formatTelegramAnalysis(analysis);

      // Delete status message if possible
      try {
        if (statusMsg && statusMsg.message_id) {
          await bot.deleteMessage(chatId, statusMsg.message_id);
        }
      } catch (e) {
        // Ignore deletion error
      }

      // 8. Send result back to user
      await safeSendMessage(bot, chatId, formatted, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      });

      if (session.uploadedResumes.length > 1) {
        const count = session.uploadedResumes.length;
        const willCompare = Math.min(count, 3);
        await safeSendMessage(
          bot,
          chatId,
          `💡 *Tip:* You have uploaded ${count} resumes for this Job Description. Send \`/compare\` to benchmark the latest ${willCompare} candidates!`,
          { parse_mode: 'Markdown' }
        );
      }
    } catch (err) {
      console.error('Telegram bot error processing document:', err);
      safeSendMessage(bot, chatId, `❌ Failed to analyze resume: ${err.message || 'Unknown error'}`);
    }
  });

  // Handle general text messages (Job Description input or Career Q&A)
  bot.on('message', async (msg) => {
    // Skip if command or document
    if (!msg.text || msg.text.startsWith('/') || msg.document) return;

    const chatId = msg.chat.id;
    const session = getSession(chatId);

    // If bot was waiting for Job Description
    if (session.awaitingJD) {
      const text = msg.text.trim();
      if (text.length < 15) {
        return safeSendMessage(
          bot,
          chatId,
          '⚠️ The Job Description seems too brief. Please paste the full requirements or job details.'
        );
      }

      if (session.uploadedResumes && session.uploadedResumes.length > 0) {
        session.previousResumes = session.uploadedResumes.map(r => ({ ...r, analysis: null }));
      }
      session.activeJobDescription = text;
      session.awaitingJD = false;
      session.uploadedResumes = [];

      return safeSendMessage(
        bot,
        chatId,
        `✅ *New Job Description saved!* (${text.split(/\s+/).length} words)\n_Session resume list has been refreshed for this new role._\n\nNow send your Resume(s) as PDF or Word documents (*.pdf*, *.docx*, *.doc*) for analysis.`,
        { parse_mode: 'Markdown' }
      );
    }

    // Otherwise, treat as Career & Technical Question
    bot.sendChatAction(chatId, 'typing');

    try {
      const answer = await answerCareerQuestion(msg.text);
      await safeSendMessage(bot, chatId, answer, { parse_mode: 'Markdown' });
    } catch (err) {
      safeSendMessage(bot, chatId, '💡 Please ask any career, interview, or coding question!');
    }
  });

  // Error listeners
  bot.on('error', (error) => {
    console.warn('[Telegram Bot Error]', error.message || error);
  });

  bot.on('polling_error', (error) => {
    // Gracefully ignore transient network resets and keep polling alive
    if (!error.message.includes('EFATAL') && !error.message.includes('ETELEGRAM: 409') && !error.message.includes('ECONNRESET')) {
      console.warn('[Telegram Polling Warning]', error.message || error);
    }
  });

  return bot;
}

// Check if run directly via `node backend/bot.js`
const currentFile = fileURLToPath(import.meta.url);
const executedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (executedFile === currentFile) {
  if (TOKEN && !TOKEN.includes('your_telegram_bot_token')) {
    startTelegramBot(TOKEN);
  } else {
    console.log('[Telegram Bot] Please set TELEGRAM_BOT_TOKEN in .env to run.');
  }
}
