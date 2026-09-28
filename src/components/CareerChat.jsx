import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Code, Compass, HelpCircle, FileText } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  { icon: Compass, text: 'What is the recommended 2026 roadmap for Full-Stack Developers?' },
  { icon: Code, text: 'How should I structure coding practice for technical interviews?' },
  { icon: FileText, text: 'Explain the Google XYZ formula for writing impactful resume bullets.' },
  { icon: HelpCircle, text: 'How do I answer behavioral questions using the STAR technique?' }
];

export default function CareerChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `👋 **Welcome to your AI Career & Technical Mentor!**\n\nI can assist you with:\n* 💻 **Coding Doubts & Architecture**\n* 🗺️ **Personalized Career Roadmaps**\n* 🎯 **Interview Strategy & LeetCode prep**\n* 📄 **ATS Optimization & Resume Advice**\n\nPick a quick topic below or type your question!`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend) => {
    const question = (textToSend || input).trim();
    if (!question) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      let aiText = '';
      if (res.ok) {
        const data = await res.json();
        aiText = data.answer;
      } else {
        aiText = getLocalCareerAnswer(question);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: getLocalCareerAnswer(question),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getLocalCareerAnswer = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('roadmap')) {
      return `### 🚀 2026 Modern Full-Stack Roadmap
1. **Frontend**: Master TypeScript, React 19, Tailwind CSS, and Server Components (Next.js).
2. **Backend**: Build robust REST & GraphQL APIs using Node.js/Express, Go, or Python FastAPI.
3. **Database Layer**: Combine PostgreSQL (relational) with Redis (caching) and vector embeddings.
4. **DevOps & Infrastructure**: Docker containerization, GitHub Actions CI/CD, and AWS deployment.
5. **System Design**: Focus on horizontal scaling, load balancers, rate limiters, and microservice decoupling.`;
    }
    if (lower.includes('interview') || lower.includes('leetcode')) {
      return `### 🎯 High-Performance Interview Strategy
1. **Coding Patterns**: Focus on 14 core patterns (Sliding Window, Two Pointers, Fast & Slow Pointers, BFS/DFS, Top K Elements).
2. **Think Out Loud**: Walk the interviewer through your approach, complexity ($O(N)$ time / $O(1)$ space), and edge cases before typing code.
3. **Mock Interviews**: Practice under timed conditions on platforms like Pramp or interviewing.io.
4. **STAR Method**: For behavioral questions, prepare 4 solid stories: Leadership, Failure/Conflict, Ambiguity, and Technical Achievement.`;
    }
    if (lower.includes('xyz') || lower.includes('resume')) {
      return `### 📄 Google XYZ Resume Formula
*Formula:* **"Accomplished [X], as measured by [Y], by doing [Z]"**

*Before:* "Responsible for improving database queries."
*After (XYZ):* **"Reduced API response latency by 45% (measured by Datadog APM) by indexing PostgreSQL schemas and implementing Redis in-memory caching."**

Always quantify outcomes with percentages, user volume, or dollar savings!`;
    }
    return `### 💡 AI Career Recommendation
- **Target Job Focus**: Keep practicing hands-on problem solving and align your portfolio with current tech stack requirements.
- **Continuous Learning**: Leverage top-tier platforms like Harvard CS50, Coursera Meta certifications, and freeCodeCamp.
- **Live Resume Scan**: Try uploading your resume in the **Resume ATS Scanner** tab to receive personalized score metrics!`;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={24} color="var(--neon-cyan)" />
          <span>AI Career & Technical Mentor</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
          Real-time advice on roadmaps, coding doubts, interview preparation, and technical resume tips.
        </p>

        {/* Quick prompt chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          {SUGGESTED_QUESTIONS.map((q, idx) => {
            const Icon = q.icon;
            return (
              <button
                key={idx}
                onClick={() => sendMessage(q.text)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} color="var(--neon-cyan)" />
                <span>{q.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-card" style={{ padding: '24px', minHeight: '450px', maxHeight: '550px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '16px' }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {m.sender === 'ai' && (
              <div style={{ background: 'linear-gradient(135deg, #00f5d4, #7928ca)', width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={18} color="#090d16" />
              </div>
            )}

            <div style={{
              background: m.sender === 'user' ? 'linear-gradient(135deg, rgba(0, 245, 212, 0.2), rgba(0, 180, 216, 0.2))' : 'rgba(9, 13, 22, 0.75)',
              border: m.sender === 'user' ? '1px solid rgba(0, 245, 212, 0.4)' : '1px solid var(--border-color)',
              padding: '14px 18px',
              borderRadius: '14px',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {m.text}
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'right', marginTop: '6px' }}>
                {m.time}
              </div>
            </div>

            {m.sender === 'user' && (
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="#ffffff" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--neon-cyan)', fontSize: '0.85rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #00f5d4, #7928ca)', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#090d16" />
            </div>
            <span>AI Mentor is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="glass-card" style={{ padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a coding doubt, roadmap question, or interview advice..."
          style={{ background: 'transparent', border: 'none', padding: '10px 14px' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{ padding: '10px 18px' }}
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </div>

    </div>
  );
}
