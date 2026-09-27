import React from 'react';
import { Bot, FileText, Users, MessageSquare, Sparkles, Send } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="glass-card" style={{ margin: '16px 24px', padding: '14px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00f5d4 0%, #7928ca 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 245, 212, 0.35)'
          }}>
            <Bot size={24} color="#090d16" strokeWidth={2.5} />
          </div>

          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #00f5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI Career Analysis
              </h1>
              <span style={{
                background: 'rgba(0, 245, 212, 0.1)',
                border: '1px solid rgba(0, 245, 212, 0.3)',
                color: 'var(--neon-cyan)',
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '2px 7px',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)'
              }}>
                MVP v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Next-Gen ATS Scanner & Telegram Career Co-Pilot
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(9, 13, 22, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`btn-tab ${activeTab === 'analyze' ? 'active' : ''}`}
          >
            <FileText size={16} />
            <span>Resume ATS Scanner</span>
          </button>
          
          <button
            onClick={() => setActiveTab('compare')}
            className={`btn-tab ${activeTab === 'compare' ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Candidate Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`btn-tab ${activeTab === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare size={16} />
            <span>Career Advisor</span>
          </button>
        </nav>

        {/* Live Status & Telegram Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 8px #00f5d4' }} />
            <span>ENGINE ONLINE</span>
          </div>

          <a
            href="https://t.me/ai_career_chatbot"
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={14} />
            <span>Telegram Bot</span>
          </a>
        </div>

      </div>
    </header>
  );
}
