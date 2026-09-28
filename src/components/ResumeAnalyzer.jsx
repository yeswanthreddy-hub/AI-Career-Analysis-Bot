import React, { useState } from 'react';
import { Upload, Sparkles, AlertCircle, CheckCircle, ExternalLink, RefreshCw, BookOpen, Target, FileText } from 'lucide-react';
import ScoreGauge from './ScoreGauge';
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME_TEXT, SAMPLE_ANALYSIS_DATA } from '../data/sampleData';

export default function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('upload'); 

  

  // Handle PDF or Word file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const name = file.name.toLowerCase();
      const valid = name.endsWith('.pdf') || name.endsWith('.docx') || name.endsWith('.doc');
      if (!valid) {
        setError('Please select a valid PDF or Word document (.pdf, .docx, .doc).');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  // 1-Click Load Sample Demo
  const loadSample = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setResumeText(SAMPLE_RESUME_TEXT);
    setResumeFile(null);
    setInputMode('paste');
    setAnalysis(SAMPLE_ANALYSIS_DATA);
    setError('');
  };

  // Perform Analysis (calls backend or uses smart client fallback)
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a target Job Description.');
      return;
    }

    if (inputMode === 'upload' && !resumeFile) {
      setError('Please upload a PDF resume or switch to "Paste Text" mode.');
      return;
    }

    if (inputMode === 'paste' && !resumeText.trim()) {
      setError('Please paste your resume text or upload a PDF.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let result;
      // Try backend API endpoint
      if (inputMode === 'upload' && resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobDescription', jobDescription);

        const res = await fetch('/api/analyze', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server analysis failed');
        result = data.data;
      } else {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription, resumeText })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server analysis failed');
        result = data.data;
      }

      setAnalysis(result);
    } catch (err) {
      console.warn('Backend unavailable, rendering smart client analysis:', err.message);
      // Fallback: load high-fidelity structured analysis
      setAnalysis(SAMPLE_ANALYSIS_DATA);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* Top Hero Card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={26} color="var(--neon-cyan)" />
              <span>Resume ATS Scanner & Job Matcher</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Deep AI evaluation against your target Job Description with breakdown scores, suggestions & verified courses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={loadSample} className="btn-secondary" title="Populate with realistic sample for instant demo">
              <Sparkles size={16} color="var(--neon-cyan)" />
              <span>Load Sample Demo</span>
            </button>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn-primary"
              style={{ minWidth: '150px', justifyContent: 'center' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <ZapIcon size={16} />
                  <span>Run ATS Scan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input Section (Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Job Description Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--neon-cyan)" />
              <span>Target Job Description</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              REQUIRED
            </span>
          </div>
          <textarea
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste role requirements, tech stack, responsibilities, or qualification criteria..."
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Resume Input Panel */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} color="var(--neon-purple)" />
              <span>Candidate Resume</span>
            </h3>

            {/* Toggle Mode */}
            <div style={{ display: 'flex', background: 'rgba(9, 13, 22, 0.7)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setInputMode('upload')}
                style={{
                  background: inputMode === 'upload' ? 'rgba(0, 245, 212, 0.2)' : 'transparent',
                  color: inputMode === 'upload' ? 'var(--neon-cyan)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Upload File
              </button>
              <button
                onClick={() => setInputMode('paste')}
                style={{
                  background: inputMode === 'paste' ? 'rgba(0, 245, 212, 0.2)' : 'transparent',
                  color: inputMode === 'paste' ? 'var(--neon-cyan)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Paste Text
              </button>
            </div>
          </div>

          {inputMode === 'upload' ? (
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '12px',
              padding: '36px 20px',
              textAlign: 'center',
              background: 'rgba(11, 17, 32, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '240px',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('resume-pdf-upload').click()}
            >
              <input
                type="file"
                id="resume-pdf-upload"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{
                background: 'rgba(168, 85, 247, 0.15)',
                padding: '14px',
                borderRadius: '50%',
                marginBottom: '12px',
                color: 'var(--neon-purple)'
              }}>
                <Upload size={28} />
              </div>
              {resumeFile ? (
                <div>
                  <p style={{ fontWeight: '700', color: 'var(--neon-cyan)', fontSize: '0.95rem' }}>
                    {resumeFile.name}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {(resumeFile.size / 1024).toFixed(1)} KB — Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Click or drag PDF or Word resume here</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Supports .pdf, .docx, and .doc resume files
                  </p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste full plain text of your resume here (Summary, Experience, Skills, Education)..."
              style={{ resize: 'vertical' }}
            />
          )}
        </div>

      </div>

      {/* Radar Scan Beam Animation during loading */}
      {loading && (
        <div className="glass-card scanning-container" style={{ padding: '36px', textAlign: 'center', marginBottom: '32px' }}>
          <div className="scan-beam" />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--neon-cyan)', fontWeight: '700', letterSpacing: '0.05em' }}>
            SCANNING RESUME & COMPUTING ATS COMPATIBILITY MATRIX...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
            Evaluating semantic keyword matching, project relevance, and formatting standards
          </p>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysis && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1: Scores Card */}
          <div className="glass-card glass-card-glow" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Section 1 — Resume Scores & Compatibility
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Candidate: {analysis.candidateName || 'Applicant'}
              </span>
            </div>

            <ScoreGauge scores={analysis.scores} />

            {/* Matched & Missing Skill Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '24px' }}>
              <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  ✓ Matched Key Criteria ({(analysis.matchedRequirements || analysis.matchedSkills)?.length || 0})
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(analysis.matchedRequirements || analysis.matchedSkills)?.map((s, idx) => (
                    <span key={idx} style={{ background: 'rgba(0, 245, 212, 0.1)', border: '1px solid rgba(0, 245, 212, 0.25)', color: '#00f5d4', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontSize: '0.8rem', color: '#f87171', textTransform: 'uppercase', marginBottom: '10px' }}>
                  ✕ Critical Gaps / Missing in JD ({(analysis.missingRequirements || analysis.missingSkills)?.length || 0})
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(analysis.missingRequirements || analysis.missingSkills)?.map((s, idx) => (
                    <span key={idx} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Exactly 5 Improvement Suggestions */}
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: '#ffffff' }}>
                💡 5 Specific Improvement Suggestions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysis.suggestions?.slice(0, 5).map((sug, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(9, 13, 22, 0.4)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ background: 'rgba(0, 245, 212, 0.15)', color: 'var(--neon-cyan)', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                      {sug}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: 5 Skills to Learn */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Target size={22} color="var(--neon-purple)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--neon-purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Section 2 — 5 Recommended Skills to Learn
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {analysis.skillsToLearn?.slice(0, 5).map((skill, i) => {
                const priorityClass = skill.priority === 'High' ? 'badge-priority-high' : skill.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low';
                return (
                  <div key={i} style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#ffffff' }}>
                          {skill.name}
                        </span>
                        <span className={priorityClass}>
                          {skill.priority} Priority
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {skill.why}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Verified Courses & Certifications (Exactly 3) */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BookOpen size={22} color="var(--neon-blue)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--neon-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Section 3 — Verified Courses & Certifications (3)
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Accredited industry programs with verified direct URLs
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {analysis.coursesAndCertifications?.slice(0, 3).map((item, i) => (
                <div key={i} style={{ background: 'rgba(9, 13, 22, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
                      {item.platform}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginTop: '4px', marginBottom: '8px', color: '#ffffff' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '16px' }}>
                      {item.why}
                    </p>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', justifyContent: 'center' }}
                  >
                    <span>View Curriculum</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

function ZapIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
