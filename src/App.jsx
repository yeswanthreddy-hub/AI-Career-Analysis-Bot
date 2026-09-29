import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ResumeComparison from './components/ResumeComparison';
import CareerChat from './components/CareerChat';
import { Send, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingTop: '12px' }}>
        {activeTab === 'analyze' && <ResumeAnalyzer />}
        {activeTab === 'compare' && <ResumeComparison />}
        {activeTab === 'chat' && <CareerChat />}
      </main>

      {/* Footer / Presentation Info Strip */}
      <footer style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(9, 13, 22, 0.85)', padding: '20px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
              AI Career Analysis ChatBot
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Built with Vite • React • Node.js • Telegram Bot API • Grok/xAI • PDF Parsing
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--neon-cyan)" />
              Zero Hardcoded Keys
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Send size={14} color="#38bdf8" />
              Telegram /start Enabled
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
