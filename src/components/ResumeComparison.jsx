import React, { useState } from 'react';
import { Users, Trophy, Award, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_COMPARISON_DATA, SAMPLE_RESUME_TEXT, SAMPLE_CANDIDATE_2_TEXT } from '../data/sampleData';

export default function ResumeComparison() {
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION);
  const [candidate1Name, setCandidate1Name] = useState('Alex Chen (Senior Full Stack)');
  const [candidate1Text, setCandidate1Text] = useState(SAMPLE_RESUME_TEXT);
  const [candidate2Name, setCandidate2Name] = useState('Jordan Smith (Junior Frontend)');
  const [candidate2Text, setCandidate2Text] = useState(SAMPLE_CANDIDATE_2_TEXT);
  const [comparison, setComparison] = useState(SAMPLE_COMPARISON_DATA);
  const [loading, setLoading] = useState(false);

  const handleRunComparison = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumes: [
            { id: '1', name: candidate1Name, text: candidate1Text },
            { id: '2', name: candidate2Name, text: candidate2Text }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setComparison(data.data);
      } else {
        // Fallback to pre-calculated comparison
        setComparison(SAMPLE_COMPARISON_DATA);
      }
    } catch (e) {
      setComparison(SAMPLE_COMPARISON_DATA);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={26} color="var(--neon-cyan)" />
              <span>Multiple Candidate ATS Comparison</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Benchmark 2 or more candidate profiles against the same Job Description to uncover relative strengths and hireability.
            </p>
          </div>

          <button onClick={handleRunComparison} disabled={loading} className="btn-primary">
            <Sparkles size={16} />
            <span>{loading ? 'Comparing...' : 'Recalculate Comparison'}</span>
          </button>
        </div>
      </div>

      {/* Input Collapsible / Edit Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--neon-cyan)', marginBottom: '8px', display: 'block' }}>
            Target Job Description
          </label>
          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={{ fontSize: '0.82rem' }}
          />
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>
              Candidate #1
            </label>
            <input
              type="text"
              value={candidate1Name}
              onChange={(e) => setCandidate1Name(e.target.value)}
              style={{ width: '180px', padding: '4px 8px', fontSize: '0.78rem' }}
            />
          </div>
          <textarea
            rows={5}
            value={candidate1Text}
            onChange={(e) => setCandidate1Text(e.target.value)}
            style={{ fontSize: '0.82rem' }}
          />
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--neon-purple)' }}>
              Candidate #2
            </label>
            <input
              type="text"
              value={candidate2Name}
              onChange={(e) => setCandidate2Name(e.target.value)}
              style={{ width: '180px', padding: '4px 8px', fontSize: '0.78rem' }}
            />
          </div>
          <textarea
            rows={5}
            value={candidate2Text}
            onChange={(e) => setCandidate2Text(e.target.value)}
            style={{ fontSize: '0.82rem' }}
          />
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Winner Spotlight Banner */}
          <div className="glass-card glass-card-glow" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.08) 0%, rgba(121, 40, 202, 0.12) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(0, 245, 212, 0.2)', padding: '16px', borderRadius: '16px', color: 'var(--neon-cyan)' }}>
                <Trophy size={36} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#00f5d4', color: '#090d16', fontWeight: '800', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                    HIGHEST OPPORTUNITY TO GET JOB
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '4px' }}>
                  {comparison.topCandidate}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                  {comparison.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Side by Side Candidate Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {comparison.candidates.map((cand) => (
              <div
                key={cand.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderTop: cand.isTopCandidate ? '4px solid var(--neon-cyan)' : '4px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                {/* Rank Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: cand.isTopCandidate ? 'rgba(0, 245, 212, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: cand.isTopCandidate ? 'var(--neon-cyan)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}>
                      Rank #{cand.rank}
                    </span>
                    {cand.isTopCandidate && (
                      <span style={{ color: 'var(--neon-cyan)', fontSize: '0.8rem', fontWeight: '700' }}>
                        ★ Top Choice
                      </span>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: cand.isTopCandidate ? 'var(--neon-cyan)' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      {cand.overallScore}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/100</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
                  {cand.name}
                </h4>

                {/* Score breakdown metrics */}
                <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '14px', borderRadius: '10px', marginBottom: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Skills</span>
                      <p style={{ fontWeight: '700', color: '#00f5d4', fontFamily: 'var(--font-mono)' }}>
                        {cand.scores?.skills || cand.overallScore}%
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Experience</span>
                      <p style={{ fontWeight: '700', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        {cand.scores?.experience || cand.overallScore - 5}%
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>ATS Score</span>
                      <p style={{ fontWeight: '700', color: '#a855f7', fontFamily: 'var(--font-mono)' }}>
                        {cand.scores?.atsReadability || 85}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Strengths */}
                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} />
                    <span>Key Strengths</span>
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {cand.keyStrengths?.map((str, idx) => (
                      <span key={idx} style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                        {str}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What to Improve */}
                <div>
                  <h5 style={{ fontSize: '0.8rem', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} />
                    <span>What to Improve</span>
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cand.whatToImprove?.map((imp, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '8px 10px', borderRadius: '6px' }}>
                        • {imp}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
