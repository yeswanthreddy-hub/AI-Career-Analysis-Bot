# AI Career Analysis ChatBot 🚀

An AI-powered ATS resume evaluator and career advisory platform built with **Vite, React, Node.js, Express, Telegram Bot API, and Grok/xAI**.

---

## ✨ Features

1. **Resume ATS Scanner & Job Matcher**:
   - Compares candidate resumes against target Job Descriptions.
   - Calculates 6 key metrics: Overall Match (0-100%), Skills, Projects, Education, Experience, and ATS Readability.
   - Generates **5 specific actionable suggestions** for resume improvement.
   - Recommends **5 high-impact skills** with priority levels (High, Medium, Low) and rationales.
   - Recommends **exactly 3 verified courses/certifications** with authentic, working URLs (never hallucinated).

2. **Multiple Resume Comparison**:
   - Compares multiple candidates against the same Job Description.
   - Identifies candidate with the highest opportunity to land the job.
   - Highlights relative strengths and tailored action items for each candidate.

3. **AI Career & Technical Mentor**:
   - Answers questions on coding doubts, career roadmaps, interview preparation (STAR method, system design, LeetCode strategies), and resume best practices (Google XYZ bullet formula).

4. **Telegram Bot Integration**:
   - Send `/start` for an interactive welcome menu.
   - Send `/setjd <text>` to define the target Job Description.
   - Upload any `.pdf` resume file to automatically extract text, scan via AI, and receive a formatted markdown report.
   - Send `/compare` after uploading 2 or more resumes to generate a comparison ranking report.
   - Ask general technical and career questions in natural language.

5. **HR & Presentation Demo Mode**:
   - Includes **"Load Sample Demo"** button on the frontend for immediate 1-click presentation without needing external API tokens configured first.

---

## 🛠 Tech Stack

- **Frontend**: Vite, React 18, JavaScript, CSS (Dark futuristic glassmorphism, neon accents)
- **Backend**: Node.js 24, Express.js, Multer (PDF uploads), pdf-parse (text extraction), cors, dotenv
- **Chatbot**: Telegram Bot API (`node-telegram-bot-api`)
- **AI**: Grok / xAI API (`https://api.x.ai/v1/chat/completions`) with intelligent offline heuristic engine fallback

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the project root (or copy from `.env.example`):

```bash
# Grok / xAI API Key (from https://console.x.ai/)
XAI_API_KEY=your_xai_api_key

# Telegram Bot Token (from @BotFather on Telegram)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Express Server Port
PORT=5000
```

> **Note**: If `XAI_API_KEY` is not provided, the platform automatically runs its built-in intelligent career analysis engine so your demo will **never crash** during presentations or evaluations.

---

## 🚀 How to Run the Project

### 1. Install Dependencies
```bash
npm install
```
*(On Windows PowerShell, use `npm.cmd install`)*

### 2. Start the Frontend (Vite + React)
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 3. Start the Backend API (Express)
```bash
npm run server
```
Server runs at **http://localhost:5000**.

### 4. Start the Telegram Bot (Independent or Integrated)
```bash
npm run bot
```
*(If `TELEGRAM_BOT_TOKEN` is populated in `.env`, running `npm run server` automatically activates the Telegram bot as well).*

---

## 📱 Telegram Bot Testing Guide

1. Open Telegram and search for **@BotFather**.
2. Type `/newbot` and follow prompts to name your bot and obtain your HTTP API Token.
3. Paste the token into `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
   ```
4. Start the bot:
   ```bash
   npm run bot
   ```
5. In Telegram, search your bot username and send `/start`.
6. Send `/setjd Senior React and Node.js Developer with AWS and Docker`.
7. Upload your resume `.pdf`, `.docx`, or `.doc` document.
8. Type `/compare` to compare multiple candidates!

---

## 🌐 Deploying to Vercel

This project is pre-configured for **1-Click Vercel Deployment** (`vercel.json` + `/api/index.js` serverless handler):

1. Push the repository to GitHub (`https://github.com/yeswanthreddy-hub/AI-Career-Analysis-Bot`).
2. Go to [Vercel Dashboard](https://vercel.com/new) and import the `AI-Career-Analysis-Bot` repository.
3. Configure **Environment Variables** in Vercel Project Settings (optional for Demo Mode, recommended for live AI):
   - `XAI_API_KEY`: Your Groq / xAI API Key
   - `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token from `@BotFather`
4. Click **Deploy** — Vercel will automatically run `npm run build`, serve the Vite React app from `dist/`, and mount `/api/analyze`, `/api/compare`, `/api/chat`, and `/api/health` as Serverless Functions.

