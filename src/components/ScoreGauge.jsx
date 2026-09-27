import React from 'react';
import { Award, Zap, Briefcase, GraduationCap, Clock, FileCheck } from 'lucide-react';

export default function ScoreGauge({ scores }) {
  if (!scores) return null;

  const { overall, skills, projects, education, experience, atsReadability } = scores;

  // Determine tier and color
  let tierLabel = 'Needs Improvement';
  let tierColor = '#ef4444'; // Red
  if (overall >= 80) {
    tierLabel = 'Strong Fit / High Match';
    tierColor = '#00f5d4'; // Cyan
  } else if (overall >= 60) {
    tierLabel = 'Moderate Fit';
    tierColor = '#f59e0b'; // Amber
  }

  const subScores = [
    { label: 'Skills Match', val: skills, icon: Zap, color: '#00f5d4' },
    { label: 'Projects Relevance', val: projects, icon: Briefcase, color: '#38bdf8' },
    { label: 'Experience Depth', val: experience, icon: Clock, color: '#a855f7' },
    { label: 'ATS Readability', val: atsReadability, icon: FileCheck, color: '#10b981' },
    { label: 'Education Alignment', val: education, icon: GraduationCap, color: '#f59e0b' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) 1fr', gap: '24px', alignItems: 'center' }}>
      
      {/* Big Circular / Radial Overall Score Card */}
      <div style={{
        background: 'rgba(9, 13, 22, 0.7)',
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${tierColor}40`,
        boxShadow: `0 0 24px ${tierColor}20`,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          border: `6px solid ${tierColor}`,
          boxShadow: `0 0 20px ${tierColor}60`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
            {overall}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Out of 100
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: tierColor, fontWeight: '700', fontSize: '0.95rem' }}>
          <Award size={18} />
          <span>{tierLabel}</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Automated Role Compatibility Index
        </p>
      </div>

      {/* Breakdown Score Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Category Breakdown Scores
        </h4>

        {subScores.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} style={{ background: 'rgba(9, 13, 22, 0.5)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                  <Icon size={16} color={item.color} />
                  <span>{item.label}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.9rem', color: item.color }}>
                  {item.val}%
                </span>
              </div>

              {/* Progress Track */}
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${item.val}%`,
                  background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                  borderRadius: '3px',
                  boxShadow: `0 0 8px ${item.color}`,
                  transition: 'width 0.8s ease-in-out'
                }} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
