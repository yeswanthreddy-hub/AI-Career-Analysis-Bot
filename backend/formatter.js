/**
 * Sanitizes dynamic text so stray *, _, `, or [ characters do not break Telegram Markdown V1 parsing.
 */
function cleanMd(str = '') {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[*_`[\]]/g, '');
}

/**
 * Formats full structured analysis for Telegram chat.
 * Strictly adheres to the required layout:
 * 📊 ATS RESUME MATCH ANALYSIS
 * 👤 Candidate: [Candidate Name]
 * 🎯 Overall Match: XX/100
 * ...
 * 📌 SCORE BREAKDOWN (7 Factors with Weights)
 * ...
 * 📋 REQUIREMENT BREAKDOWN (Matched, Missing, Partially Matched)
 * ...
 * 📝 IMPROVEMENT SUGGESTIONS (5 Categorized Suggestions)
 * ...
 * 🎯 SKILLS TO LEARN (5 Prioritized Skills)
 * ...
 * 🎓 RECOMMENDED COURSES / CERTIFICATIONS (3 Verified Resources)
 */
export function formatTelegramAnalysis(analysis) {
  const candidateName = cleanMd(analysis.candidateName || 'Candidate Name Not Found');
  const overall = analysis.overallScore ?? analysis.scores?.overall ?? 75;
  const reqSkills = analysis.scores?.requiredSkills ?? analysis.scores?.skills ?? 75;
  const experience = analysis.scores?.experience ?? analysis.experienceScore ?? 75;
  const projects = analysis.scores?.projects ?? analysis.projectsScore ?? 70;
  const education = analysis.scores?.education ?? analysis.educationScore ?? 80;
  const techKeywords = analysis.scores?.technicalKeywords ?? 75;
  const ats = analysis.scores?.ats ?? analysis.scores?.atsReadability ?? analysis.atsScore ?? 80;
  const prefSkills = analysis.scores?.preferredSkills ?? 70;

  const summary = cleanMd(
    analysis.summary || `Calculated match of ${overall}/100 reflects alignment between your verified qualifications and target job criteria.`
  );
  const matched = analysis.matchedRequirements || [];
  const missing = analysis.missingRequirements || [];
  const partial = analysis.partiallyMatchedRequirements || [];
  const suggestions = analysis.suggestions || [];
  const skillsToLearn = analysis.skillsToLearn || [];
  const courses = analysis.courses || analysis.coursesAndCertifications || [];

  let msg = `📊 *ATS RESUME MATCH ANALYSIS*\n\n`;
  msg += `👤 *Candidate:* *${candidateName}*\n`;
  msg += `🎯 *Overall Match:* ${overall}/100\n`;
  msg += `_${summary}_\n\n`;

  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📌 *SCORE BREAKDOWN (Methodology)*\n\n`;
  msg += `💡 *Required Skills:* ${reqSkills}/100 _(Weight: 30%)_\n`;
  msg += `💼 *Experience Match:* ${experience}/100 _(Weight: 20%)_\n`;
  msg += `🚀 *Projects Match:* ${projects}/100 _(Weight: 15%)_\n`;
  msg += `🎓 *Education Match:* ${education}/100 _(Weight: 10%)_\n`;
  msg += `🔑 *Technical Keywords:* ${techKeywords}/100 _(Weight: 10%)_\n`;
  msg += `🤖 *ATS Readability:* ${ats}/100 _(Weight: 10%)_\n`;
  msg += `⭐ *Preferred Skills:* ${prefSkills}/100 _(Weight: 5%)_\n\n`;

  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📋 *REQUIREMENT BREAKDOWN*\n\n`;
  if (matched.length > 0) {
    msg += `✅ *Matched Requirements:*\n${matched.map(m => `• ${cleanMd(m)}`).join('\n')}\n\n`;
  } else {
    msg += `✅ *Matched Requirements:* None verified\n\n`;
  }

  if (missing.length > 0) {
    msg += `❌ *Missing Required Requirements:*\n${missing.map(m => `• ${cleanMd(m)}`).join('\n')}\n\n`;
  } else {
    msg += `❌ *Missing Required Requirements:* None\n\n`;
  }

  if (partial.length > 0) {
    msg += `⚠️ *Partially Matched Requirements:*\n${partial.map(p => `• ${cleanMd(p)}`).join('\n')}\n\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📝 *IMPROVEMENT SUGGESTIONS*\n\n`;
  suggestions.slice(0, 5).forEach((rawSug, i) => {
    const sug = cleanMd(rawSug);
    msg += `${sug.startsWith(`${i + 1}.`) ? sug : `${i + 1}. ${sug}`}\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🎯 *SKILLS TO LEARN*\n\n`;
  skillsToLearn.slice(0, 5).forEach((item, i) => {
    const name = cleanMd(item.skill || item.name || 'Core Technology');
    const priority = cleanMd((item.priority || 'Medium').toUpperCase());
    const reason = cleanMd(item.reason || item.why || 'Critical requirement for target role.');
    msg += `${i + 1}. 🎯 *Skill:* ${name}\n`;
    msg += `   *Priority:* ${priority}\n`;
    msg += `   *Why:* ${reason}\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🎓 *RECOMMENDED COURSES / CERTIFICATIONS*\n\n`;
  courses.slice(0, 3).forEach((item, i) => {
    const name = cleanMd(item.name || 'Professional Certification');
    const platform = cleanMd(item.platform || 'Verified Platform');
    const reason = cleanMd(item.reason || item.why || 'Strengthens alignment with the Job Description.');
    const url = item.url || '';

    msg += `${i + 1}. 🎓 *Course/Certification:* ${name}\n`;
    msg += `   *Platform:* ${platform}\n`;
    msg += `   *Why it is relevant:* ${reason}\n`;
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      msg += `   *URL:* ${url}\n\n`;
    } else {
      msg += `   *URL:* Search on official platform\n\n`;
    }
  });

  return msg.trim();
}

/**
 * Formats multiple resume comparison for Telegram chat.
 * Evaluates strictly the latest 2 or latest 3 resumes.
 * Displays candidate cards, requirement comparison matrix, evidence summary, and improvement areas.
 */
export function formatTelegramComparison(comparison) {
  const jobTarget = cleanMd(comparison.jobTarget || 'Target Job Description');
  const candidates = comparison.candidates || [];
  const matrix = comparison.matrix || [];

  let msg = `⚖️ *MULTI-RESUME BENCHMARK REPORT*\n\n`;
  msg += `🎯 *Target Role:* *${jobTarget}*\n`;
  msg += `👥 *Candidates Evaluated:* ${candidates.length} _(Latest ${candidates.length} uploaded)_\n\n`;

  // 1. Candidate Summary Cards
  candidates.forEach((cand, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    const cName = cleanMd(cand.name || `Candidate ${index + 1}`);
    const overall = cand.overallScore ?? cand.scores?.overall ?? 70;
    const reqSkills = cand.scores?.requiredSkills ?? cand.scores?.skills ?? 75;
    const exp = cand.scores?.experience ?? 75;
    const proj = cand.scores?.projects ?? 70;
    const ats = cand.scores?.ats ?? cand.scores?.atsReadability ?? 80;

    const strengths = (cand.strengths || cand.keyStrengths || ['Foundational programming skills']).map(cleanMd);
    const missing = (cand.missing || cand.missingRequirements || ['Cloud deployment']).map(cleanMd);

    msg += `━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `${medal} 👤 *Candidate:* *${cName}*\n`;
    msg += `🎯 *Overall Match:* ${overall}/100\n`;
    msg += `💡 *Required Skills:* ${reqSkills}/100 | 💼 *Experience:* ${exp}/100\n`;
    msg += `🚀 *Projects:* ${proj}/100 | 🤖 *ATS Readability:* ${ats}/100\n`;
    msg += `✅ *Key Strengths:* ${strengths.slice(0, 4).join(', ')}\n`;
    msg += `⚠️ *Missing Requirements:* ${missing.slice(0, 3).join(', ')}\n\n`;
  });

  // 2. Requirement Comparison Matrix
  if (matrix && matrix.length > 0) {
    msg += `━━━━━━━━━━━━━━━━━━\n\n`;
    msg += `📊 *REQUIREMENT COMPARISON MATRIX*\n\n`;
    msg += `*Legend of Evaluated Candidates:*\n`;
    candidates.forEach((c, idx) => {
      msg += `• *C${idx + 1}:* ${cleanMd(c.name)} (${c.overallScore}/100)\n`;
    });
    msg += `\n\`\`\`\n`;

    // Monospace Matrix Header
    const colHeaders = candidates.map((_, idx) => ` C${idx + 1} `).join('|');
    msg += `Requirement          |${colHeaders}\n`;
    msg += `---------------------|` + candidates.map(() => `----`).join('|') + `\n`;

    matrix.forEach(row => {
      const rawReq = cleanMd(row.requirement || '').toUpperCase();
      const reqName = rawReq.slice(0, 20).padEnd(20);
      const cols = candidates.map((_, idx) => {
        const val = row[`cand${idx + 1}`] || '❌';
        return ` ${val} `;
      }).join('|');
      msg += `${reqName} |${cols}\n`;
    });

    msg += `\`\`\`\n`;
    msg += `_(Legend: ✅ = Evidenced | ⚠️ = Partial | ❌ = Missing)_\n\n`;
  }

  // 3. Evidence-Based Comparison Summary
  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `⚖️ *COMPARISON SUMMARY*\n\n`;
  msg += `${cleanMd(comparison.comparisonSummary || comparison.summary || 'Comparison based on demonstrated alignment with the Job Description.')}\n\n`;

  // 4. Improvement Areas per Candidate (3 each)
  msg += `━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🛠️ *IMPROVEMENT AREAS PER CANDIDATE*\n\n`;
  candidates.forEach((cand, idx) => {
    msg += `📌 *${cleanMd(cand.name || `Candidate ${idx + 1}`)}:*\n`;
    const improvements = (cand.improvements || cand.whatToImprove || []).slice(0, 3);
    if (improvements.length > 0) {
      improvements.forEach((imp, i) => {
        msg += `${i + 1}. ${cleanMd(imp)}\n`;
      });
    } else {
      msg += `1. Add quantifiable metrics to project outcomes.\n2. Incorporate missing required skills from the Job Description.\n3. Reorganize resume sections for ATS keyword parsing.\n`;
    }
    msg += `\n`;
  });

  return msg.trim();
}
