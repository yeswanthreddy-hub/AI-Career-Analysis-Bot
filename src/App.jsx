import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ResumeComparison from './components/ResumeComparison';
import CareerChat from './components/CareerChat';
import TelegramBotGuide from './components/TelegramBotGuide';
import { Send, FileText, CheckCircle, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [guideStep, setGuideStep] = useState(1);

  const openGuideAtStep = (step) => {
    setGuideStep(step);
    setActiveTab('telegram');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Featured Telegram Bot Main Callout Bar (shown on Analyzer / Compare / Chat tabs) */}
      {activeTab !== 'telegram' && (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px 8px' }}>
          <div
            className="glass-card"
            style={{
              padding: '14px 20px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'linear-gradient(90deg, rgba(14, 28, 54, 0.9) 0%, rgba(9, 15, 28, 0.92) 60%, rgba(0, 245, 212, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => openGuideAtStep(1)}
                className="btn-telegram-main"
              >
                <Send size={16} strokeWidth={2.5} />
                <span>Telegram Bot — How to Use (4 Steps)</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#e2e8f0' }}>
                <span
                  onClick={() => openGuideAtStep(1)}
                  style={{ cursor: 'pointer', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 10px', borderRadius: '6px' }}
                >
                  <strong style={{ color: '#38bdf8' }}>1.</strong> Click Telegram Bot
                </span>
                <span
                  onClick={() => openGuideAtStep(2)}
                  style={{ cursor: 'pointer', background: 'rgba(0, 245, 212, 0.1)', border: '1px solid rgba(0, 245, 212, 0.28)', padding: '4px 10px', borderRadius: '6px' }}
                >
                  <strong style={{ color: 'var(--neon-cyan)' }}>2.</strong> How to Use?
                </span>
                <span
                  onClick={() => openGuideAtStep(3)}
                  style={{ cursor: 'pointer', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '4px 10px', borderRadius: '6px' }}
                >
                  <strong style={{ color: '#c084fc' }}>3.</strong> Set JD &amp; Resume
                </span>
                <span
                  onClick={() => openGuideAtStep(4)}
                  style={{ cursor: 'pointer', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '6px' }}
                >
                  <strong style={{ color: '#fbbf24' }}>4.</strong> Compare Multiple Resumes
                </span>
              </div>
            </div>

            <a
              href="https://t.me/ai_career_chatbot"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#38bdf8',
                fontWeight: '700',
                fontSize: '0.82rem',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <span>Open @ai_career_chatbot</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingTop: '12px' }}>
        {activeTab === 'analyze' && <ResumeAnalyzer />}
        {activeTab === 'compare' && <ResumeComparison />}
        {activeTab === 'chat' && <CareerChat />}
        {activeTab === 'telegram' && <TelegramBotGuide initialStep={guideStep} />}
      </main>

      {/* Footer / Presentation Info Strip */}
      <footer style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(9, 13, 22, 0.85)', padding: '20px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
              AI Career Analysis ChatBot
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Built with Vite • React • Node.js • Telegram Bot API • Grok/xAI • PDF &amp; Word Parsing
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--neon-cyan)" />
              Zero Hardcoded Keys
            </span>
            <span
              onClick={() => setActiveTab('telegram')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#38bdf8', fontWeight: '600' }}
            >
              <Send size={14} color="#38bdf8" />
              Telegram /start Enabled
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

