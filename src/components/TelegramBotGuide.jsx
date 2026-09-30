import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Users,
  Terminal,
  ExternalLink,
  HelpCircle,
  Upload,
  Layers,
  Award,
  ArrowRight,
  MessageSquare,
  Zap
} from 'lucide-react';

const BOT_USERNAME = '@ai_career_chatbot';
const BOT_URL = 'https://t.me/ai_career_chatbot';

const STEP_PREVIEWS = {
  1: {
    title: 'Step 1: Open & Start the Bot',
    messages: [
      { sender: 'user', text: '/start' },
      {
        sender: 'bot',
        text: `👋 Welcome to AI Career Resume Assistant!\n\nI am your intelligent career co-pilot and ATS analyzer.\n\n📌 Core Workflow:\n1️⃣ Send /setjd to target a specific job\n2️⃣ Upload your Resume (.pdf, .docx, .doc)\n3️⃣ Send /compare to rank 2–3 resumes\n4️⃣ Or ask any coding & interview question!`
      }
    ]
  },
  2: {
    title: 'Step 2: Commands & Career Q&A',
    messages: [
      { sender: 'user', text: '/help' },
      {
        sender: 'bot',
        text: `💡 Available Commands:\n• /start - Welcome menu\n• /setjd - Set target Job Description\n• /jd - View active Job Description\n• /compare - Compare latest 2–3 resumes\n• /clear - Reset session`
      },
      { sender: 'user', text: 'How do I prepare for a Full-Stack Developer interview?' },
      {
        sender: 'bot',
        text: `🎯 Full-Stack Interview Roadmap:\n1. Core JS/TS & React state patterns\n2. REST API design, Auth & SQL/NoSQL indexing\n3. System Design & STAR behavioral stories`
      }
    ]
  },
  3: {
    title: 'Step 3: Set JD & Upload Resume (.pdf / .docx)',
    messages: [
      { sender: 'user', text: '/setjd' },
      { sender: 'bot', text: '📋 Please paste the full Job Description you want to target.' },
      {
        sender: 'user',
        text: ' Full-Stack Engineer requiring React, Node.js, REST APIs, PostgreSQL, Docker, and AWS.'
      },
      {
        sender: 'bot',
        text: '✅ New Job Description saved!\nNow upload your Resume as a PDF or Word (.pdf, .docx, .doc) document.'
      },
      { sender: 'user', text: '📎 Yeswanth_Reddy_Resume.pdf (Uploaded)' },
      {
        sender: 'bot',
        text: `📊 ATS RESUME ANALYSIS\n👤 Candidate: Yeswanth Reddy\n🏆 Overall Match Score: 84/100\n• Required Skills (30%): 88%\n• Experience (20%): 80%\n• Projects (15%): 85%\n✅ Matched: React, Node.js, REST APIs, Docker\n❌ Missing: PostgreSQL, AWS`
      }
    ]
  },
  4: {
    title: 'Step 4: Compare Multiple Resumes (/compare)',
    messages: [
      { sender: 'user', text: '📎 Candidate_1_Resume.pdf (Uploaded)' },
      { sender: 'user', text: '📎 Candidate_2_Resume.docx (Uploaded)' },
      { sender: 'user', text: '/compare' },
      {
        sender: 'bot',
        text: `⚖️ MULTIPLE RESUME COMPARISON (2 Candidates)\n\n🥇 #1 Yeswanth Reddy — 84/100\n   ✅ Matched: React, Node.js, Docker, REST APIs\n\n🥈 #2 Priya Sharma — 68/100\n   ⚠️ Missing: Docker, AWS, Node.js\n\n🏆 Best Candidate to Hire: Yeswanth Reddy (+16 pts advantage in Required Skills & Projects)`
      }
    ]
  }
};

export default function TelegramBotGuide({ initialStep = 1 }) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [copiedCmd, setCopiedCmd] = useState('');

  React.useEffect(() => {
    if (initialStep) setActiveStep(initialStep);
  }, [initialStep]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(''), 1800);
  };

  const commands = [
    { cmd: '/start', desc: 'Launch the bot and display the interactive welcome menu' },
    { cmd: '/setjd', desc: 'Set or update the target Job Description for ATS evaluation' },
    { cmd: '/jd', desc: 'Check the currently saved Job Description & resume count' },
    { cmd: '/compare', desc: 'Compare the latest 2 or 3 uploaded resumes side-by-side' },
    { cmd: '/clear', desc: 'Clear saved Job Description and uploaded resumes to start fresh' },
    { cmd: '/help', desc: 'Display quick command instructions inside Telegram' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 24px 48px' }}>
      
      {/* HERO BANNER WITH UNIQUE MAIN TELEGRAM BOT BUTTON */}
      <div
        className="glass-card telegram-hero-card"
        style={{
          padding: '32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          background: 'linear-gradient(135deg, rgba(14, 28, 54, 0.92) 0%, rgba(9, 16, 32, 0.95) 60%, rgba(0, 136, 204, 0.18) 100%)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: CTA & Bot Identity */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 245, 212, 0.12)', border: '1px solid rgba(0, 245, 212, 0.35)', borderRadius: '999px', padding: '5px 14px', marginBottom: '16px' }}>
              <span className="telegram-pulse-dot" />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                OFFICIAL TELEGRAM AI CAREER BOT • LIVE 24/7
              </span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '12px', color: '#ffffff' }}>
              Analyze & Compare Resumes Directly in{' '}
              <span style={{ background: 'linear-gradient(90deg, #38bdf8, #00f5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Telegram
              </span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', marginBottom: '24px', maxWidth: '580px', lineHeight: 1.6 }}>
              Use our dedicated Telegram Bot (<strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{BOT_USERNAME}</strong>) to set Job Descriptions, upload <strong>PDF or Word (.docx/.doc)</strong> resumes, get 7-factor ATS scores, and compare multiple candidates on the go.
            </p>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
              <a
                href={BOT_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-telegram-hero"
              >
                <Send size={20} />
                <span>Click to Open Telegram Bot</span>
                <ExternalLink size={16} style={{ opacity: 0.85 }} />
              </a>

              <button
                type="button"
                onClick={() => handleCopy(BOT_USERNAME)}
                className="btn-secondary"
                style={{
                  borderColor: 'rgba(56, 189, 248, 0.35)',
                  background: 'rgba(15, 23, 42, 0.75)',
                  padding: '12px 18px'
                }}
              >
                {copiedCmd === BOT_USERNAME ? (
                  <>
                    <Check size={16} color="var(--neon-green)" />
                    <span style={{ color: 'var(--neon-green)' }}>Copied {BOT_USERNAME}!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} color="#38bdf8" />
                    <span>Copy {BOT_USERNAME}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Quick Highlights Box */}
          <div
            style={{
              background: 'rgba(9, 13, 22, 0.78)',
              border: '1px solid rgba(56, 189, 248, 0.28)',
              borderRadius: '16px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}
          >
            <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.07)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.18)' }}>
              <div style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                01. CLICK BOT
              </div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: '600' }}>
                Instant Launch via Link or {BOT_USERNAME}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(0, 245, 212, 0.07)', borderRadius: '12px', border: '1px solid rgba(0, 245, 212, 0.18)' }}>
              <div style={{ color: 'var(--neon-cyan)', fontWeight: '800', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                02. HOW TO USE
              </div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: '600' }}>
                Simple Slash Commands & Natural Chat
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.22)' }}>
              <div style={{ color: '#c084fc', fontWeight: '800', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                03. JD + RESUME
              </div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: '600' }}>
                Send /setjd & Upload PDF / DOCX / DOC
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.22)' }}>
              <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                04. COMPARE
              </div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', fontWeight: '600' }}>
                Upload 2–3 Resumes & Run /compare
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION HEADER: 4 COMPLETE STEP-BY-STEP INSTRUCTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="var(--neon-cyan)" />
            <span>How the Telegram Bot Works — 4 Easy Steps</span>
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Click any instruction card below to preview the live Telegram conversation flow on the right.
          </p>
        </div>

        <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 12px', borderRadius: '8px' }}>
          Supports .PDF • .DOCX • .DOC
        </span>
      </div>

      {/* MAIN GRID: 4 INSTRUCTION CARDS (LEFT) + LIVE CHAT SIMULATOR (RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: 4 DETAILED INSTRUCTION CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. CLICK THE TELEGRAM BOT */}
          <div
            onClick={() => setActiveStep(1)}
            className={`glass-card instruction-step-card ${activeStep === 1 ? 'active-step-card' : ''}`}
            style={{ padding: '22px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div className="step-number-badge" style={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)' }}>
                1
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#ffffff' }}>
                    1. Click the Telegram Bot
                  </h4>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    STEP 1
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.55 }}>
                  Click the <strong>"Click to Open Telegram Bot"</strong> button above or below to launch <strong>{BOT_USERNAME}</strong> directly in your Telegram Desktop or Mobile app.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                  <a
                    href={BOT_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(56, 189, 248, 0.18)',
                      border: '1px solid rgba(56, 189, 248, 0.5)',
                      color: '#38bdf8',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <Send size={14} />
                    <span>Launch {BOT_USERNAME}</span>
                    <ExternalLink size={13} />
                  </a>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Then press <code style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>/start</code> in chat
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. HOW TO USE ? */}
          <div
            onClick={() => setActiveStep(2)}
            className={`glass-card instruction-step-card ${activeStep === 2 ? 'active-step-card' : ''}`}
            style={{ padding: '22px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div className="step-number-badge" style={{ background: 'linear-gradient(135deg, #00f5d4, #0d9488)', color: '#04131a' }}>
                2
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#ffffff' }}>
                    2. How to Use?
                  </h4>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', background: 'rgba(0, 245, 212, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                    COMMANDS & CHAT
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.55 }}>
                  The bot works in <strong>two modes</strong>: you can ask any <strong>career, coding, roadmap, or interview question</strong> in plain English, or control ATS resume scanning with slash commands:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
                  {commands.map((item) => (
                    <div
                      key={item.cmd}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.cmd);
                      }}
                      title="Click to copy command"
                      style={{
                        background: 'rgba(9, 13, 22, 0.7)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <code style={{ color: 'var(--neon-cyan)', fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                          {item.cmd}
                        </code>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {item.desc}
                        </div>
                      </div>
                      {copiedCmd === item.cmd ? (
                        <Check size={14} color="var(--neon-green)" />
                      ) : (
                        <Copy size={13} color="var(--text-dim)" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. HOW TO SET A JD AND RESUME IN THE BOT ? */}
          <div
            onClick={() => setActiveStep(3)}
            className={`glass-card instruction-step-card ${activeStep === 3 ? 'active-step-card' : ''}`}
            style={{ padding: '22px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div className="step-number-badge" style={{ background: 'linear-gradient(135deg, #a855f7, #7e22ce)' }}>
                3
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#ffffff' }}>
                    3. How to Set a JD and Resume in the Bot?
                  </h4>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#c084fc', background: 'rgba(168, 85, 247, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    ATS SCAN FLOW
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} color="#c084fc" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <strong>Step A — Set the Job Description:</strong> Send{' '}
                      <code style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', background: 'rgba(0,245,212,0.1)', padding: '2px 6px', borderRadius: '4px' }}>/setjd</code>{' '}
                      and paste the target Job Description text in your next message (or send <code style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>/setjd &lt;JD text&gt;</code> in one message).
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} color="#c084fc" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <strong>Step B — Upload Your Resume File:</strong> Tap the <strong>Attachment icon (📎)</strong> in Telegram and send your resume as a <strong>PDF (<code>.pdf</code>)</strong> or <strong>Word Document (<code>.docx</code> / <code>.doc</code>)</strong>.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} color="#c084fc" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <strong>Step C — Receive Full ATS Report:</strong> The bot automatically extracts your candidate name, calculates your <strong>7-Factor Weighted ATS Score (0–100%)</strong>, lists <strong>Matched vs. Missing Required Skills</strong>, <strong>5 Resume Improvements</strong>, <strong>5 Skills to Learn</strong>, and <strong>3 Verified Courses</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. HOW TO COMPARE THE MULTIPLE RESUMES ? */}
          <div
            onClick={() => setActiveStep(4)}
            className={`glass-card instruction-step-card ${activeStep === 4 ? 'active-step-card' : ''}`}
            style={{ padding: '22px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div className="step-number-badge" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#090d16' }}>
                4
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.08rem', fontWeight: '800', color: '#ffffff' }}>
                    4. How to Compare Multiple Resumes?
                  </h4>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    MULTI-CANDIDATE RANKING
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} color="#fbbf24" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <strong>Step A — Ensure a Job Description is Active:</strong> Confirm your target role is saved with <code style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>/setjd</code> (you can verify anytime with <code style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>/jd</code>).
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} color="#fbbf24" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <strong>Step B — Upload 2 or 3 Resumes:</strong> Send 2 or more candidate resume files (<code>.pdf</code>, <code>.docx</code>, or <code>.doc</code>) one after another in the Telegram chat.
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <CheckCircle2 size={16} color="#fbbf24" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <strong>Step C — Send <code style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', background: 'rgba(0,245,212,0.1)', padding: '2px 6px', borderRadius: '4px' }}>/compare</code>:</strong> The bot benchmarks the <strong>latest 2 or 3 resumes</strong> side-by-side, ranks each candidate by their real ATS match score, highlights key skill differences, and declares the <strong>🏆 Best Candidate to Hire</strong>!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE TELEGRAM BOT CONVERSATION PREVIEW */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            position: 'sticky',
            top: '20px'
          }}
        >
          {/* Mockup Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
              marginBottom: '16px',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0088cc, #00f5d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 14px rgba(56, 189, 248, 0.4)'
                }}
              >
                <Send size={18} color="#090d16" />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#ffffff' }}>
                  AI Career ChatBot
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {BOT_USERNAME} • bot online
                </div>
              </div>
            </div>

            {/* Step Selector Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setActiveStep(num)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    border: activeStep === num ? '1px solid var(--neon-cyan)' : '1px solid var(--border-color)',
                    background: activeStep === num ? 'rgba(0, 245, 212, 0.18)' : 'rgba(15, 23, 42, 0.7)',
                    color: activeStep === num ? 'var(--neon-cyan)' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Active Preview Title */}
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {STEP_PREVIEWS[activeStep].title}
          </div>

          {/* Simulated Telegram Chat Window */}
          <div
            style={{
              background: 'rgba(7, 11, 20, 0.9)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '320px'
            }}
          >
            {STEP_PREVIEWS[activeStep].messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background:
                    m.sender === 'user'
                      ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                      : 'rgba(24, 34, 60, 0.95)',
                  border:
                    m.sender === 'user'
                      ? '1px solid rgba(56, 189, 248, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius:
                    m.sender === 'user'
                      ? '14px 14px 2px 14px'
                      : '14px 14px 14px 2px',
                  fontSize: '0.82rem',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Bottom Direct Launch CTA */}
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-telegram-hero"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Send size={18} />
              <span>Open {BOT_USERNAME} on Telegram Now</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
