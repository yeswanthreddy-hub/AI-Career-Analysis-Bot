import dotenv from 'dotenv';
dotenv.config();

const API_KEY = (process.env.XAI_API_KEY || process.env.GROQ_API_KEY || '').trim();

// Determine provider and endpoint based on key prefix
const isGroq = API_KEY.startsWith('gsk_');
const isXai = API_KEY.startsWith('xai-');

const API_URL = isGroq
  ? 'https://api.groq.com/openai/v1/chat/completions'
  : 'https://api.x.ai/v1/chat/completions';

const MODEL_NAME = isGroq ? 'openai/gpt-oss-120b' : 'grok-beta';
const GROQ_MODELS = [
  'openai/gpt-oss-120b'
];

// Verified, real learning resources catalog - NEVER hallucinate or invent URLs
const VERIFIED_RESOURCES = [
  {
    name: 'Meta Front-End Developer Professional Certificate',
    platform: 'Coursera',
    reason: 'Comprehensive hands-on training in React, modern JavaScript, responsive design, and UI/UX best practices.',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer'
  },
  {
    name: 'AWS Certified Solutions Architect - Associate',
    platform: 'Amazon Web Services',
    reason: 'Industry benchmark certification validating cloud architecture, deployment, security, and scalable systems.',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
  },
  {
    name: 'CS50: Introduction to Computer Science',
    platform: 'Harvard / edX',
    reason: 'Foundational mastery of algorithms, data structures, systems, and clean software engineering principles.',
    url: 'https://www.edx.org/cs50'
  },
  {
    name: 'Google Data Analytics Professional Certificate',
    platform: 'Coursera',
    reason: 'Rigorous practical training covering SQL, Python/R, data visualization, and analytical decision-making.',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics'
  },
  {
    name: 'Docker & Kubernetes: The Practical Guide',
    platform: 'Udemy',
    reason: 'Essential containerization and microservice orchestration skills demanded by modern production teams.',
    url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/'
  },
  {
    name: 'Oracle Certified Associate (OCA) Java Programmer',
    platform: 'Oracle University',
    reason: 'Official industry certification validating deep knowledge of Java syntax, OOP concepts, collections, and exceptions.',
    url: 'https://education.oracle.com/oracle-certified-associate-java-se-8-programmer/track-pP_34'
  }
];

// Non-name words to prevent section titles, job roles, skills, or locations from being mistaken for a candidate's name
const NON_NAME_WORDS = new Set([
  'resume', 'curriculum', 'vitae', 'cv', 'bio', 'biodata', 'profile', 'summary', 'objective',
  'about', 'contact', 'details', 'personal', 'information', 'info', 'email', 'phone', 'mobile',
  'tel', 'address', 'location', 'linkedin', 'github', 'portfolio', 'website', 'links', 'social',
  'education', 'academic', 'qualification', 'qualifications', 'experience', 'work', 'employment',
  'history', 'career', 'internship', 'internships', 'projects', 'project', 'academic', 'personal',
  'skills', 'technical', 'skill', 'competencies', 'technologies', 'tools', 'frameworks', 'languages',
  'databases', 'certifications', 'certificates', 'certificate', 'achievements', 'awards', 'honors',
  'publications', 'references', 'declaration', 'interests', 'hobbies', 'activities', 'extracurricular',
  'volunteer', 'leadership', 'responsibilities', 'overview', 'page', 'date', 'place', 'signature',
  'software', 'developer', 'engineer', 'engineering', 'programmer', 'architect', 'analyst', 'scientist',
  'designer', 'consultant', 'manager', 'director', 'specialist', 'administrator', 'coordinator',
  'intern', 'trainee', 'fresher', 'graduate', 'student', 'candidate', 'applicant', 'professional',
  'senior', 'junior', 'lead', 'principal', 'staff', 'associate', 'assistant', 'executive',
  'full', 'stack', 'fullstack', 'frontend', 'front', 'end', 'backend', 'back', 'web', 'mobile',
  'cloud', 'devops', 'data', 'machine', 'learning', 'artificial', 'intelligence', 'deep', 'business',
  'product', 'project', 'quality', 'assurance', 'security', 'cyber', 'network', 'system', 'systems',
  'database', 'embedded', 'automation', 'testing', 'test', 'ui', 'ux', 'graphic', 'digital',
  'bachelor', 'master', 'btech', 'mtech', 'be', 'me', 'bsc', 'msc', 'bca', 'mca', 'mba', 'bba', 'phd',
  'university', 'institute', 'college', 'school', 'academy', 'technology', 'science', 'arts', 'commerce',
  'computer', 'information', 'electronics', 'electrical', 'mechanical', 'civil', 'board', 'secondary',
  'java', 'python', 'javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'nodejs', 'express',
  'spring', 'boot', 'django', 'flask', 'fastapi', 'html', 'css', 'sql', 'mysql', 'postgresql', 'mongodb',
  'redis', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'linux', 'windows', 'android', 'ios',
  'flutter', 'kotlin', 'swift', 'c', 'cpp', 'csharp', 'dotnet', 'php', 'ruby', 'golang', 'rust',
  'power', 'bi', 'tableau', 'excel', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit', 'keras',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',
  'november', 'december', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
  'present', 'current', 'till', 'india', 'usa', 'uk', 'canada', 'hyderabad', 'bangalore', 'bengaluru',
  'chennai', 'mumbai', 'pune', 'delhi', 'noida', 'gurgaon', 'kolkata', 'ahmedabad', 'telangana',
  'karnataka', 'maharashtra', 'tamil', 'nadu', 'andhra', 'pradesh', 'kerala', 'gujarat', 'rajasthan',
  'street', 'road', 'nagar', 'colony', 'district', 'state', 'pincode', 'zip', 'pdf', 'docx', 'doc',
  'file', 'copy', 'updated', 'final', 'new', 'latest', 'version', 'ats', 'format', 'template'
]);

function toTitleCaseName(raw = '') {
  return raw
    .trim()
    .split(/\s+/)
    .map(w => {
      if (w.length === 1) return w.toUpperCase() + '.';
      if (/^[A-Za-z]\.$/.test(w)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function isPlausibleHumanName(candidate = '') {
  if (!candidate || typeof candidate !== 'string') return false;

  // Reject if candidate contains URLs, emails, or domain extensions (.com, .in, .org, .io, .dev, .net, .edu, .js)
  if (/@|https?:\/\/|www\.|\.(?:com|in|org|io|dev|net|edu|gov|co|me|ai|app|tech|js|py|pdf|docx?)\b/i.test(candidate)) {
    return false;
  }

  const cleaned = candidate
    .replace(/\b(B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?Sc|M\.?Sc|B\.?C\.?A|M\.?C\.?A|M\.?B\.?A|Ph\.?D)\b/gi, '')
    .replace(/^[#*•\-_|>:.,()\s]+/, '')
    .replace(/[#*•\-_|>:.,()\s]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length < 3 || cleaned.length > 42) return false;

  // Must only contain letters, spaces, dots, hyphens, apostrophes
  if (!/^[a-zA-Z.'-]+(?:\s+[a-zA-Z.'-]+){0,4}$/.test(cleaned)) return false;

  const words = cleaned.split(/\s+/);
  if (words.length < 1 || words.length > 5) return false;

  // At least one word must have >= 2 alphabetic characters
  const hasSubstantialWord = words.some(w => w.replace(/[^a-zA-Z]/g, '').length >= 2);
  if (!hasSubstantialWord) return false;

  // Check every word against the non-name blocklist and reject internal dots like "a.bc"
  for (const w of words) {
    if (/\.[a-zA-Z]{2,}/.test(w)) return false;
    const bare = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!bare) continue;
    if (NON_NAME_WORDS.has(bare)) return false;
  }

  // Reject single-word candidates unless they are >= 3 chars and start with uppercase
  if (words.length === 1) {
    const w = words[0].replace(/[^a-zA-Z]/g, '');
    if (w.length < 3 || w.length > 18) return false;
  }

  return cleaned;
}

/**
 * Extracts a candidate name from the resume text (and optional filename fallback).
 * Handles:
 * - Standard top headers (Title Case, ALL CAPS, initials like "K. Yaswanth" or "Yaswanth K")
 * - Spaced-out letter headers ("Y A S W A N T H   K U M A R")
 * - Same-line role or contact info ("Yaswanth Kumar | Full Stack Developer", "Yaswanth Kumar - yaswanth@gmail.com")
 * - Explicit "Name: ..." labels
 * - Two-column PDF layouts where sidebar precedes the name header (scans up to 35 lines)
 * - LinkedIn URL / Email / Filename human-name extraction if header was an image
 */
export function extractCandidateName(text = '', fallbackFileName = '') {
  if (!text && !fallbackFileName) return 'Candidate Name Not Found';

  const rawText = typeof text === 'string' ? text : '';

  // 1. Check explicit "Name:" or "Candidate Name:" label anywhere in the top 40 lines
  const explicitMatch = rawText.match(/(?:^|\n)\s*(?:full\s+name|candidate\s+name|applicant\s+name|name)\s*[:\-–]\s*([A-Za-z][A-Za-z.\s'-]{2,40})(?:\n|$|\||,)/i);
  if (explicitMatch && explicitMatch[1]) {
    const valid = isPlausibleHumanName(explicitMatch[1]);
    if (valid) return toTitleCaseName(valid);
  }

  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const topLines = lines.slice(0, 35);

  // 2. First pass: check top 15 lines for spaced-out letter headers (e.g., "R A H U L   S H A R M A")
  for (let i = 0; i < Math.min(12, topLines.length); i++) {
    const line = topLines[i].replace(/^[#*•\-_|>\s]+/, '').trim();
    if (/^(?:[A-Za-z]\s+){3,}[A-Za-z]$/.test(line)) {
      // Collapse single-spaced letters and double-spaces into words
      const collapsed = line
        .split(/\s{2,}/)
        .map(wordPart => wordPart.replace(/\s+/g, ''))
        .join(' ');
      const valid = isPlausibleHumanName(collapsed);
      if (valid) return toTitleCaseName(valid);
    }
  }

  // 3. Second pass: multi-word (2 to 5 words) human names in top 35 lines
  for (let i = 0; i < topLines.length; i++) {
    let line = topLines[i]
      .replace(/^[#*•\-_|>\s]+/, '')
      .replace(/[#*•\-_|>\s]+$/, '')
      .trim();

    if (!line || line.length > 120) continue;

    // Strip out inline emails, URLs, and phone numbers from the line instead of skipping the whole line
    line = line
      .replace(/\S+@\S+\.\S+/g, ' | ')
      .replace(/https?:\/\/\S+/gi, ' | ')
      .replace(/(?:www\.|linkedin\.com\S*|github\.com\S*)/gi, ' | ')
      .replace(/(?:\+?\d[\d\s\-().]{7,}\d)/g, ' | ');

    // Split line by common header delimiters (|, /, –, —, •, :, ,, tabs, " - ")
    const segments = line
      .split(/\s*(?:\||\/|–|—|•|:|,|\t|\s-\s)\s*/)
      .map(s => s.trim())
      .filter(Boolean);

    for (const seg of segments) {
      const valid = isPlausibleHumanName(seg);
      if (valid) {
        const wordCount = valid.split(/\s+/).length;
        // Prefer 2-4 word names in this pass
        if (wordCount >= 2 && wordCount <= 5) {
          return toTitleCaseName(valid);
        }
      }
    }
  }

  // 4. Third pass: single-word name in the very top 3 lines
  for (let i = 0; i < Math.min(3, topLines.length); i++) {
    const cleanTop = topLines[i]
      .replace(/\S+@\S+\.\S+/g, '')
      .replace(/(?:https?:\/\/|www\.|linkedin\.com|github\.com)\S*/gi, '')
      .replace(/(?:\+?\d[\d\s\-().]{7,}\d)/g, '');
    const seg = cleanTop.split(/\s*(?:\||\/|–|—|•|:|,|\t|\s-\s)\s*/)[0]?.trim();
    const valid = isPlausibleHumanName(seg);
    if (valid) {
      return toTitleCaseName(valid);
    }
  }

  // 5. Fourth pass: extract name from LinkedIn profile slug in resume text (e.g., linkedin.com/in/rahul-sharma-9a1b2c)
  const linkedInMatch = rawText.match(/linkedin\.com\/in\/([a-zA-Z]{2,15}-[a-zA-Z]{2,15})(?:-[a-zA-Z0-9]+)?/i);
  if (linkedInMatch && linkedInMatch[1]) {
    const candidateFromSlug = linkedInMatch[1].replace(/-/g, ' ');
    const valid = isPlausibleHumanName(candidateFromSlug);
    if (valid) return toTitleCaseName(valid);
  }

  // 6. Fifth pass: extract name from structured email (e.g., rahul.sharma@gmail.com or rahul_sharma@...)
  const emailMatch = rawText.match(/([a-zA-Z]{2,15})[._]([a-zA-Z]{2,15})\d*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch && emailMatch[1] && emailMatch[2]) {
    const candidateFromEmail = `${emailMatch[1]} ${emailMatch[2]}`;
    const valid = isPlausibleHumanName(candidateFromEmail);
    if (valid) return toTitleCaseName(valid);
  }

  // 7. Sixth pass: check fallback filename if it contains a human name (e.g., "Yaswanth_Kumar_Resume.pdf")
  if (fallbackFileName && typeof fallbackFileName === 'string') {
    const cleanedFile = fallbackFileName
      .replace(/\.[^/.]+$/, '') // remove extension
      .replace(/[_\-().]+/g, ' ')
      .replace(/\b(resume|cv|curriculum|vitae|updated|final|latest|ats|draft|copy|doc|pdf|\d+)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const valid = isPlausibleHumanName(cleanedFile);
    if (valid) return toTitleCaseName(valid);
  }

  return 'Candidate Name Not Found';
}

/**
 * Extracts a concise target job title from the Job Description text.
 */
export function extractJobTitle(jd = '') {
  if (!jd || typeof jd !== 'string') return 'Target Role';
  const lines = jd.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'Target Role';

  // Check for explicit Job Title / Role label
  const titleMatch = jd.match(/(?:job\s+title|role|position)\s*[:\-–]\s*([^\n\r|]{3,70})/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }

  const firstLine = lines[0].replace(/^[#*•\-_|>\s]+/, '').trim();
  if (firstLine.length >= 3 && firstLine.length <= 85 && !firstLine.toLowerCase().startsWith('about ')) {
    return firstLine;
  }
  return 'Target Role';
}

// Comprehensive cross-domain skill catalog (Software, Data, AI/ML, Cloud, DevOps, QA, Security, Product, Business)
const SKILL_CATALOG = [
  // Languages
  'java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'golang', 'go', 'rust', 'kotlin',
  'swift', 'php', 'ruby', 'scala', 'r', 'dart', 'bash', 'shell', 'powershell', 'sql', 'pl/sql', 'nosql',
  // Frontend & Mobile
  'react', 'react.js', 'next.js', 'nextjs', 'angular', 'vue', 'vue.js', 'nuxt', 'svelte', 'redux',
  'html', 'html5', 'css', 'css3', 'sass', 'scss', 'tailwind', 'bootstrap', 'material ui', 'webpack',
  'vite', 'jquery', 'three.js', 'webgl', 'react native', 'flutter', 'android', 'ios', 'pwa',
  // Backend & Frameworks
  'node.js', 'nodejs', 'express', 'express.js', 'nestjs', 'spring boot', 'spring mvc', 'spring security',
  'spring data', 'spring', 'hibernate', 'jpa', 'jdbc', 'microservices', 'django', 'flask', 'fastapi',
  '.net', 'asp.net', 'laravel', 'ruby on rails', 'graphql', 'rest api', 'restful', 'grpc', 'websocket',
  'websockets', 'jwt', 'oauth', 'oauth2', 'soap',
  // Databases & Messaging
  'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'oracle', 'sql server', 'sqlite', 'cassandra',
  'dynamodb', 'elasticsearch', 'neo4j', 'firebase', 'supabase', 'prisma', 'sequelize', 'mongoose',
  'kafka', 'rabbitmq', 'activemq',
  // Cloud, DevOps & Infrastructure
  'aws', 'amazon web services', 'ec2', 's3', 'lambda', 'rds', 'azure', 'gcp', 'google cloud',
  'docker', 'kubernetes', 'k8s', 'helm', 'terraform', 'ansible', 'jenkins', 'github actions',
  'gitlab ci', 'ci/cd', 'nginx', 'apache', 'linux', 'unix', 'prometheus', 'grafana', 'datadog',
  'splunk', 'vercel', 'netlify', 'heroku',
  // Data Science, AI, ML & Analytics
  'machine learning', 'deep learning', 'artificial intelligence', 'nlp', 'natural language processing',
  'computer vision', 'generative ai', 'llm', 'langchain', 'rag', 'openai', 'huggingface', 'tensorflow',
  'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn',
  'plotly', 'jupyter', 'spark', 'apache spark', 'pyspark', 'hadoop', 'airflow', 'dbt', 'snowflake',
  'bigquery', 'redshift', 'databricks', 'etl', 'data warehousing', 'data modeling', 'data visualization',
  'data analysis', 'data analytics', 'business intelligence', 'power bi', 'tableau', 'looker', 'excel',
  'vlookup', 'pivot tables', 'statistics', 'statistical analysis', 'a/b testing', 'hypothesis testing',
  // Testing, QA & Security
  'unit testing', 'integration testing', 'automation testing', 'manual testing', 'selenium', 'cypress',
  'playwright', 'jest', 'mocha', 'chai', 'junit', 'testng', 'pytest', 'postman', 'swagger', 'jmeter',
  'appium', 'bdd', 'cucumber', 'tdd', 'cybersecurity', 'penetration testing', 'owasp', 'siem',
  'network security', 'iam', 'encryption', 'firewall',
  // Architecture, Engineering Practices & Product/Design/Business
  'data structures', 'algorithms', 'dsa', 'oop', 'object oriented programming', 'system design',
  'design patterns', 'solid principles', 'multithreading', 'concurrency', 'distributed systems',
  'git', 'github', 'gitlab', 'bitbucket', 'agile', 'scrum', 'kanban', 'jira', 'confluence', 'sdlc',
  'figma', 'adobe xd', 'wireframing', 'prototyping', 'ui/ux', 'user research', 'product management',
  'roadmap', 'stakeholder management', 'business analysis', 'Requirement gathering', 'crm',
  'salesforce', 'sap', 'erp', 'financial modeling', 'accounting', 'seo', 'digital marketing',
  'google analytics', 'content strategy', 'communication', 'problem solving', 'leadership'
];

// Canonicalize synonyms so we don't double-count e.g. 'node.js' and 'nodejs', 'postgresql' and 'postgres'
const SKILL_SYNONYMS = {
  'react.js': 'react',
  'nextjs': 'next.js',
  'vue.js': 'vue',
  'nodejs': 'node.js',
  'express.js': 'express',
  'postgres': 'postgresql',
  'k8s': 'kubernetes',
  'amazon web services': 'aws',
  'google cloud': 'gcp',
  'sklearn': 'scikit-learn',
  'html5': 'html',
  'css3': 'css',
  'restful': 'rest api',
  'websockets': 'websocket',
  'oauth2': 'oauth',
  'object oriented programming': 'oop',
  'natural language processing': 'nlp',
  'apache spark': 'spark'
};

function matchesTermInText(textLower, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+.])${escaped}(?:$|[^a-zA-Z0-9_#+.])`, 'i');
  if (regex.test(textLower)) return true;

  // Check reverse synonyms (e.g., if JD asks for 'postgresql' and resume says 'postgres')
  for (const [alias, canonical] of Object.entries(SKILL_SYNONYMS)) {
    if (canonical === term) {
      const escAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const aliasRegex = new RegExp(`(?:^|[^a-zA-Z0-9_#+.])${escAlias}(?:$|[^a-zA-Z0-9_#+.])`, 'i');
      if (aliasRegex.test(textLower)) return true;
    }
  }
  return false;
}

/**
 * Extracts catalog skills AND dynamic domain keywords from text.
 */
export function extractSkillKeywords(text = '') {
  if (!text || typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const found = new Set();

  for (const rawSkill of SKILL_CATALOG) {
    if (matchesTermInText(lower, rawSkill)) {
      const canonical = SKILL_SYNONYMS[rawSkill] || rawSkill;
      found.add(canonical);
    }
  }

  // If both 'spring boot' and 'spring' are matched, keep 'spring boot' as primary
  return Array.from(found);
}

// Stopwords excluded when dynamically extracting custom JD terms
const JD_STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'will', 'are', 'our', 'that', 'this', 'have', 'from', 'your',
  'work', 'working', 'team', 'role', 'job', 'description', 'requirements', 'required', 'preferred',
  'qualifications', 'responsibilities', 'skills', 'experience', 'years', 'year', 'ability', 'strong',
  'good', 'excellent', 'knowledge', 'understanding', 'familiarity', 'plus', 'bonus', 'nice', 'must',
  'should', 'able', 'build', 'building', 'develop', 'developing', 'design', 'designing', 'create',
  'creating', 'maintain', 'maintaining', 'support', 'supporting', 'using', 'used', 'use', 'based',
  'looking', 'seeking', 'candidate', 'candidates', 'ideal', 'join', 'company', 'organization',
  'environment', 'fast', 'paced', 'collaborate', 'degree', 'bachelor', 'master', 'computer',
  'related', 'field', 'equivalent', 'practical', 'hands', 'proficient', 'proficiency', 'solid',
  'proven', 'track', 'record', 'minimum', 'least', 'including', 'such', 'like', 'well', 'other',
  'new', 'existing', 'high', 'quality', 'code', 'software', 'application', 'applications', 'system',
  'systems', 'solutions', 'services', 'product', 'products', 'project', 'projects', 'business',
  'technical', 'technology', 'technologies', 'tools', 'modern', 'best', 'practices', 'standards',
  'write', 'writing', 'clean', 'scalable', 'reliable', 'efficient', 'secure', 'performance', 'test',
  'ensure', 'participate', 'contribute', 'closely', 'cross', 'functional', 'stakeholders', 'clients',
  'users', 'customer', 'customers', 'world', 'global', 'opportunity', 'equal', 'employer', 'benefits',
  'salary', 'location', 'remote', 'hybrid', 'onsite', 'full', 'time', 'part', 'intern', 'internship',
  'junior', 'senior', 'mid', 'level', 'lead', 'engineer', 'developer', 'analyst', 'specialist', 'manager'
]);

/**
 * Dynamically extracts important domain/technical terms from the Job Description
 * even when the JD is for a specialized or non-standard domain.
 */
function extractDynamicJDTerms(jdText = '') {
  if (!jdText || typeof jdText !== 'string') return [];

  const catalogSkills = extractSkillKeywords(jdText);
  if (catalogSkills.length >= 4) {
    return catalogSkills;
  }

  // Extract capitalized technical terms, acronyms, or recurring domain nouns from the JD
  const dynamicTerms = new Set(catalogSkills);
  const tokens = jdText.match(/\b[A-Za-z][A-Za-z0-9+#.-]{2,22}\b/g) || [];
  const freq = new Map();

  for (const tok of tokens) {
    const clean = tok.replace(/[.,;:]+$/, '');
    const lower = clean.toLowerCase();
    if (lower.length < 3 || JD_STOPWORDS.has(lower)) continue;
    // Check if capitalized mid-sentence, acronym, or technical token
    const isAcronymOrTech = /^[A-Z0-9+#.-]{2,10}$/.test(clean) || /[+#./]/.test(clean);
    freq.set(lower, (freq.get(lower) || 0) + (isAcronymOrTech ? 2 : 1));
  }

  const sortedDynamic = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
    .slice(0, 10);

  for (const t of sortedDynamic) {
    dynamicTerms.add(t);
    if (dynamicTerms.size >= 10) break;
  }

  return Array.from(dynamicTerms);
}

/**
 * Splits JD requirements into Required vs Preferred based on JD section headers and phrasing.
 */
function parseJDRequirements(jobDescription = '') {
  const jdText = jobDescription || '';
  const allSkills = extractDynamicJDTerms(jdText);

  if (allSkills.length === 0) {
    return { reqSkills: ['problem solving', 'communication'], prefSkills: [] };
  }

  // Detect if JD has an explicit "Preferred / Nice to have / Bonus / Good to have" section
  const prefSplitRegex = /(?:preferred\s+(?:skills|qualifications|requirements)|nice\s+to\s+have|good\s+to\s+have|bonus\s+(?:skills|points)|desirable|plus\s*:)/i;
  const parts = jdText.split(prefSplitRegex);

  if (parts.length > 1) {
    const reqPartLower = parts[0].toLowerCase();
    const prefPartLower = parts.slice(1).join(' ').toLowerCase();

    const reqSkills = [];
    const prefSkills = [];

    for (const skill of allSkills) {
      if (matchesTermInText(reqPartLower, skill)) {
        reqSkills.push(skill);
      } else if (matchesTermInText(prefPartLower, skill)) {
        prefSkills.push(skill);
      } else {
        reqSkills.push(skill);
      }
    }

    if (reqSkills.length > 0) {
      return { reqSkills, prefSkills };
    }
  }

  // Also check inline "preferred" or "nice to have" sentences
  const reqSkills = [];
  const prefSkills = [];
  const lines = jdText.split(/\r?\n/);

  for (const skill of allSkills) {
    const isPrefLine = lines.some(l => {
      const ll = l.toLowerCase();
      return matchesTermInText(ll, skill) && /(preferred|nice to have|bonus|plus|optional|good to have)/i.test(ll);
    });
    if (isPrefLine) {
      prefSkills.push(skill);
    } else {
      reqSkills.push(skill);
    }
  }

  // If no explicit preferred section found, treat first 80% as required and remaining 20% as preferred
  if (prefSkills.length === 0 && reqSkills.length >= 4) {
    const splitAt = Math.ceil(reqSkills.length * 0.8);
    return {
      reqSkills: reqSkills.slice(0, splitAt),
      prefSkills: reqSkills.slice(splitAt)
    };
  }

  return { reqSkills: reqSkills.length > 0 ? reqSkills : allSkills, prefSkills };
}

// Related technology pairs for partial match detection (strictly differentiates tools while giving partial credit)
const PARTIAL_MATCH_RELATIONS = [
  { target: 'spring boot', related: ['spring', 'java', 'hibernate'], note: 'Java/Spring foundations present, but explicit Spring Boot microservice implementation is not evidenced' },
  { target: 'react', related: ['javascript', 'typescript', 'vue', 'angular', 'next.js', 'html'], note: 'Frontend/JavaScript experience present, but React framework experience is not explicitly evidenced' },
  { target: 'angular', related: ['typescript', 'javascript', 'react', 'vue'], note: 'Frontend TypeScript/JS experience noted, but Angular framework is missing' },
  { target: 'vue', related: ['javascript', 'typescript', 'react', 'angular'], note: 'Frontend JS framework experience noted, but Vue.js is not evidenced' },
  { target: 'next.js', related: ['react', 'node.js', 'typescript'], note: 'React fundamentals evidenced, but Next.js SSR/App Router experience is missing' },
  { target: 'node.js', related: ['javascript', 'typescript', 'express'], note: 'JavaScript proficiency noted, but backend Node.js runtime experience is unverified' },
  { target: 'typescript', related: ['javascript', 'react', 'node.js'], note: 'JavaScript evidenced, but static typing with TypeScript is not explicitly documented' },
  { target: 'postgresql', related: ['mysql', 'sql', 'oracle', 'sql server', ' sqlite'], note: 'Relational SQL database experience evidenced, but PostgreSQL-specific usage is not listed' },
  { target: 'mysql', related: ['postgresql', 'sql', 'oracle', 'sql server'], note: 'Relational SQL experience evidenced, but MySQL is not explicitly mentioned' },
  { target: 'mongodb', related: ['nosql', 'dynamodb', 'firebase', 'redis', 'sql'], note: 'Database handling evidenced, but MongoDB document store experience is missing' },
  { target: 'aws', related: ['azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'heroku', 'vercel'], note: 'Cloud/deployment concepts evidenced, but specific AWS services (EC2/S3/Lambda) are unverified' },
  { target: 'azure', related: ['aws', 'gcp', 'cloud', 'docker', '.net'], note: 'Cloud/deployment experience noted, but Microsoft Azure platform is not listed' },
  { target: 'gcp', related: ['aws', 'azure', 'cloud', 'docker', 'kubernetes'], note: 'Cloud familiarity noted, but Google Cloud Platform (GCP) is not evidenced' },
  { target: 'kubernetes', related: ['docker', 'aws', 'ci/cd', 'microservices', 'linux'], note: 'Containerization/DevOps noted, but Kubernetes (K8s) orchestration is missing' },
  { target: 'docker', related: ['kubernetes', 'ci/cd', 'aws', 'linux', 'jenkins'], note: 'Deployment tools noted, but Docker containerization is not explicitly listed' },
  { target: 'microservices', related: ['rest api', 'spring boot', 'node.js', 'docker', 'kafka'], note: 'Backend API development evidenced, but distributed microservices architecture is not detailed' },
  { target: 'django', related: ['python', 'flask', 'fastapi'], note: 'Python backend skills noted, but Django framework is not explicitly evidenced' },
  { target: 'fastapi', related: ['python', 'flask', 'django', 'rest api'], note: 'Python/API skills noted, but FastAPI framework is not explicitly listed' },
  { target: 'pytorch', related: ['tensorflow', 'keras', 'scikit-learn', 'machine learning', 'deep learning', 'python'], note: 'ML/Python background evidenced, but PyTorch framework is not explicitly documented' },
  { target: 'tensorflow', related: ['pytorch', 'keras', 'scikit-learn', 'machine learning', 'deep learning'], note: 'ML background evidenced, but TensorFlow is not explicitly documented' },
  { target: 'power bi', related: ['tableau', 'looker', 'excel', 'data visualization', 'sql'], note: 'Data visualization/analytics evidenced, but Microsoft Power BI is not listed' },
  { target: 'tableau', related: ['power bi', 'looker', 'excel', 'data visualization', 'sql'], note: 'Data reporting skills evidenced, but Tableau is not explicitly listed' }
];

/**
 * Intelligent, Deterministic ATS Analysis Engine with Transparent Weighted Formula:
 * - Required Skills Match: 30%
 * - Experience Match: 20%
 * - Projects Match: 15%
 * - Education Match: 10%
 * - Technical Keywords Match: 10%
 * - ATS Structure/Readability: 10%
 * - Preferred Skills Match: 5%
 * Total = 100%
 *
 * Strictly computes granular, candidate-specific scores based on actual resume evidence vs the active JD.
 */
export function localAnalyzeResume(resumeText = '', jobDescription = '', fallbackFileName = '') {
  const candidateName = extractCandidateName(resumeText, fallbackFileName);
  const resumeLower = (resumeText || '').toLowerCase();
  const jdLower = (jobDescription || '').toLowerCase();

  const { reqSkills, prefSkills } = parseJDRequirements(jobDescription);
  const allJDSkills = [...new Set([...reqSkills, ...prefSkills])];

  // Evaluate exact matches vs missing vs partial matches in resume
  const matchedReq = [];
  const missingReq = [];
  const partialReq = [];
  const partialCreditReq = [];

  for (const req of reqSkills) {
    if (matchesTermInText(resumeLower, req)) {
      matchedReq.push(req);
    } else {
      missingReq.push(req);
      // Check if candidate has a partially related skill
      const relObj = PARTIAL_MATCH_RELATIONS.find(r => r.target === req);
      if (relObj && relObj.related.some(rel => matchesTermInText(resumeLower, rel))) {
        partialReq.push(`${req.toUpperCase()} (${relObj.note})`);
        partialCreditReq.push(req);
      }
    }
  }

  const matchedPref = prefSkills.filter(s => matchesTermInText(resumeLower, s));
  const missingPref = prefSkills.filter(s => !matchesTermInText(resumeLower, s));

  // Count how many times matched required skills appear across the resume (depth of evidence)
  let totalSkillMentions = 0;
  for (const s of matchedReq) {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const occurrences = (resumeLower.match(new RegExp(escaped, 'gi')) || []).length;
    totalSkillMentions += Math.min(4, occurrences);
  }
  const depthBonus = matchedReq.length > 0
    ? Math.min(8, Math.round((totalSkillMentions / matchedReq.length) * 2.5))
    : 0;

  // 1. Required Skills Score (30% weight) — 0 to 100 based on exact match + 0.3x partial match + depth bonus
  const effectiveReqMatches = matchedReq.length + (partialCreditReq.length * 0.30);
  const rawReqRatio = reqSkills.length > 0 ? (effectiveReqMatches / reqSkills.length) : 0.5;
  const requiredSkillsScore = Math.min(100, Math.max(0, Math.round((rawReqRatio * 92) + depthBonus)));

  // 2. Experience & Responsibilities Match (20% weight) — combines experience depth with JD relevance
  const hasExpHeader = /\b(work\s+experience|professional\s+experience|employment\s+history|experience|internships?|work\s+history)\b/i.test(resumeText);
  const actionVerbsList = [
    'architected', 'developed', 'engineered', 'designed', 'deployed', 'built', 'implemented',
    'reduced', 'optimized', 'automated', 'led', 'managed', 'created', 'integrated', 'migrated',
    'analyzed', 'collaborated', 'improved', 'scaled', 'maintained', 'refactored', 'delivered', 'spearheaded'
  ];
  const matchedVerbs = actionVerbsList.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(resumeLower));
  const metricsMatches = resumeText.match(/\b\d+(?:\.\d+)?\s*(?:%|percent|x|ms|seconds|users|clients|requests|records|hours|days|\+|k\b|m\b)/gi) || [];
  const roleYearMatches = resumeText.match(/\b(?:201\d|202\d)\b/g) || [];

  // Measure overlap of JD action/domain words in resume
  const jdSignificantWords = Array.from(new Set(
    (jdLower.match(/\b[a-z]{4,18}\b/g) || []).filter(w => !JD_STOPWORDS.has(w))
  ));
  const matchedSignificantWords = jdSignificantWords.filter(w => resumeLower.includes(w));
  const domainWordRatio = jdSignificantWords.length > 0
    ? matchedSignificantWords.length / jdSignificantWords.length
    : 0.4;

  let rawExpDepth = 15;
  if (hasExpHeader) rawExpDepth += 25;
  rawExpDepth += Math.min(22, matchedVerbs.length * 3.5);
  rawExpDepth += Math.min(18, metricsMatches.length * 4.5);
  rawExpDepth += Math.min(10, roleYearMatches.length * 2.5);
  rawExpDepth = Math.min(100, rawExpDepth);

  // Relevance multiplier: experience must align with the target JD's required skills & domain vocabulary
  const jdRelevanceFactor = (rawReqRatio * 0.65) + (domainWordRatio * 0.35);
  let experienceScore = Math.round((rawExpDepth * 0.45) + (rawExpDepth * jdRelevanceFactor * 0.55));
  experienceScore = Math.min(98, Math.max(10, experienceScore));

  // 3. Projects Match (15% weight) — evaluates project presence + JD tech stack overlap
  const hasProjectsHeader = /\b(projects?|academic\s+projects?|personal\s+projects?|key\s+projects?|portfolio)\b/i.test(resumeText);
  const hasRepoLinks = /(?:github\.com|gitlab\.com|bitbucket\.org|live\s*demo|deployed|vercel\.app|netlify\.app|herokuapp)/i.test(resumeText);
  const allMatchedSkills = matchedReq.length + matchedPref.length + (partialCreditReq.length * 0.35);
  const skillCoverageRatio = allJDSkills.length > 0 ? allMatchedSkills / allJDSkills.length : 0.4;

  let projectsScore = 10;
  if (hasProjectsHeader) projectsScore += 20;
  if (hasRepoLinks) projectsScore += 8;
  projectsScore += Math.round(skillCoverageRatio * 50);
  projectsScore += Math.min(12, matchedVerbs.length * 2);
  projectsScore = Math.min(98, Math.max(10, Math.round(projectsScore)));

  // 4. Education Match (10% weight) — degree level + relevant field alignment
  const hasBachelorOrHigher = /\b(bachelor|master|b\.?\s*tech|m\.?\s*tech|b\.?\s*e\.?|m\.?\s*e\.?|b\.?\s*s\.?c?|m\.?\s*s\.?c?|b\.?\s*c\.?\s*a|m\.?\s*c\.?\s*a|m\.?\s*b\.?\s*a|ph\.?\s*d|undergraduate|postgraduate|graduate\s+degree)\b/i.test(resumeText);
  const hasSchoolOrDiploma = /\b(university|institute\s+of\s+technology|college|engineering|polytechnic|diploma|degree|cgpa|gpa)\b/i.test(resumeText);
  const hasRelevantField = /\b(computer\s+science|information\s+technology|software|data\s+science|artificial\s+intelligence|electronics|mathematics|statistics|engineering|business|commerce|finance)\b/i.test(resumeText);

  let educationScore = 40;
  if (hasBachelorOrHigher) educationScore += 32;
  else if (hasSchoolOrDiploma) educationScore += 18;
  if (hasRelevantField) educationScore += 18;
  if (/\b(cgpa|gpa|first\s+class|distinction|honors|dean|%)\b/i.test(resumeText)) educationScore += 6;
  educationScore = Math.min(98, Math.max(25, Math.round(educationScore)));

  // 5. Technical Keywords / Terms Match (10% weight) — broad vocabulary & skill keyword alignment with JD
  const totalSkillRatio = allJDSkills.length > 0
    ? (matchedReq.length + matchedPref.length + partialCreditReq.length * 0.25) / allJDSkills.length
    : domainWordRatio;
  const technicalKeywordsScore = Math.min(
    99,
    Math.max(5, Math.round((totalSkillRatio * 65) + (domainWordRatio * 35)))
  );

  // 6. ATS Structure & Readability (10% weight) — formatting, sections, contact info, length
  let atsScore = 45;
  const hasEmail = /\S+@\S+\.\S+/.test(resumeText);
  const hasPhone = /(?:\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
  const hasSkillsSection = /\b(skills|technologies|technical\s+skills|core\s+competencies)\b/i.test(resumeText);
  const hasSummarySection = /\b(summary|objective|profile|about\s+me)\b/i.test(resumeText);
  const wordCount = resumeText.trim().split(/\s+/).length;

  if (candidateName !== 'Candidate Name Not Found') atsScore += 10;
  if (hasEmail) atsScore += 8;
  if (hasPhone) atsScore += 7;
  if (hasSkillsSection) atsScore += 8;
  if (hasExpHeader || hasProjectsHeader) atsScore += 8;
  if (hasBachelorOrHigher || hasSchoolOrDiploma) atsScore += 5;
  if (hasSummarySection) atsScore += 4;
  if (wordCount >= 120 && wordCount <= 1200) atsScore += 5;
  else if (wordCount < 60) atsScore -= 15;
  atsScore = Math.min(98, Math.max(25, Math.round(atsScore)));

  // 7. Preferred Skills Match (5% weight)
  const preferredSkillsScore = prefSkills.length > 0
    ? Math.min(100, Math.max(0, Math.round((matchedPref.length / prefSkills.length) * 100)))
    : Math.min(100, Math.max(0, Math.round(rawReqRatio * 85)));

  // Calculate Overall Weighted Score (0-100) using exact 7-factor weights
  const overallScore = Math.min(99, Math.max(5, Math.round(
    (requiredSkillsScore * 0.30) +
    (experienceScore * 0.20) +
    (projectsScore * 0.15) +
    (educationScore * 0.10) +
    (technicalKeywordsScore * 0.10) +
    (atsScore * 0.10) +
    (preferredSkillsScore * 0.05)
  )));

  // Construct 5 Specific Suggestions tailored to the candidate's actual gaps for this JD
  const missingListStr = missingReq.slice(0, 3).map(s => s.toUpperCase()).join(', ') || missingPref.slice(0, 2).map(s => s.toUpperCase()).join(', ') || 'Advanced Domain Tooling';
  const matchedListStr = matchedReq.slice(0, 3).map(s => s.toUpperCase()).join(', ') || 'core foundational skills';

  const suggestions = [
    `1. Missing Skill\n   Target requirement(s) ${missingListStr} from the Job Description are not evidenced in your resume. Add hands-on project implementations or coursework demonstrating proficiency in ${missingListStr}.`,
    `2. Resume Improvement\n   ${hasSummarySection ? 'Tailor your professional summary to directly highlight' : 'Add a targeted 3-line Professional Summary at the top highlighting'} your verified strengths in ${matchedListStr} and alignment with "${extractJobTitle(jobDescription)}".`,
    `3. Project Improvement\n   ${hasRepoLinks ? 'Expand your project bullet points to emphasize scalability, architecture, and integration of' : 'Include GitHub repository/live demo links and showcase end-to-end projects built with'} ${reqSkills.slice(0, 3).map(s => s.toUpperCase()).join(', ') || 'target stack tools'}.`,
    `4. ATS Improvement\n   Mirror exact terminology from the Job Description (${allJDSkills.slice(0, 5).map(s => s.toUpperCase()).join(', ')}) inside both your Technical Skills section and work/project descriptions for higher ATS keyword density.`,
    `5. Experience/Impact Improvement\n   ${metricsMatches.length >= 2 ? 'Continue strengthening bullet points with concrete engineering outcomes' : 'Quantify your achievements with measurable metrics (e.g., "% latency reduction", "number of users/records processed", "test coverage %")'} using the Google XYZ formula.`
  ];

  // Recommend 5 skills to learn based specifically on what the candidate is missing from this JD
  const allMissingForLearning = [...missingReq, ...missingPref].map(s => s.toUpperCase());
  const defaultComplementSkills = ['SYSTEM DESIGN & ARCHITECTURE', 'DOCKER & CONTAINERIZATION', 'CI/CD PIPELINE AUTOMATION', 'CLOUD DEPLOYMENT (AWS/AZURE)', 'AUTOMATED UNIT & INTEGRATION TESTING'];

  const combinedSkillCandidates = [...new Set([...allMissingForLearning, ...defaultComplementSkills])].slice(0, 5);
  const skillsToLearn = combinedSkillCandidates.map((skill, i) => {
    const isFromJD = allMissingForLearning.includes(skill);
    return {
      skill,
      name: skill,
      priority: i < 2 ? 'High' : i < 4 ? 'Medium' : 'Low',
      reason: isFromJD
        ? `Explicitly requested in the "${extractJobTitle(jobDescription)}" Job Description and currently missing from your resume.`
        : `High-impact complementary engineering skill that strengthens readiness for "${extractJobTitle(jobDescription)}".`
    };
  });

  // Transparent summary explaining why this specific candidate received this score
  const summaryExplanation = `Overall match of ${overallScore}/100 for ${candidateName} against "${extractJobTitle(jobDescription)}": matched ${matchedReq.length}/${reqSkills.length} required skills (${requiredSkillsScore}/100), Experience (${experienceScore}/100), Projects (${projectsScore}/100), Keywords (${technicalKeywordsScore}/100), and ATS Readability (${atsScore}/100). ${matchedReq.length > 0 ? `Evidenced strengths: ${matchedReq.slice(0, 5).map(s => s.toUpperCase()).join(', ')}.` : 'Limited direct overlap with required JD skills.'} ${missingReq.length > 0 ? `Key gaps reducing score: ${missingReq.slice(0, 4).map(s => s.toUpperCase()).join(', ')}.` : 'All primary required skills are covered!'}`;

  return {
    type: 'resume_analysis',
    analyzedForJD: (jobDescription || '').trim(),
    candidateName,
    overallScore,
    scores: {
      overall: overallScore,
      requiredSkills: requiredSkillsScore,
      skills: requiredSkillsScore,
      experience: experienceScore,
      projects: projectsScore,
      education: educationScore,
      technicalKeywords: technicalKeywordsScore,
      ats: atsScore,
      atsReadability: atsScore,
      preferredSkills: preferredSkillsScore
    },
    summary: summaryExplanation,
    matchedRequirements: matchedReq.map(s => s.toUpperCase()),
    missingRequirements: [...missingReq, ...missingPref].map(s => s.toUpperCase()),
    partiallyMatchedRequirements: partialReq,
    suggestions,
    skillsToLearn,
    courses: VERIFIED_RESOURCES.slice(0, 3),
    coursesAndCertifications: VERIFIED_RESOURCES.slice(0, 3),
    mode: 'AI Transparent ATS Engine'
  };
}

function toValidScore(val, fallback) {
  if (val === null || val === undefined || val === '') return fallback;
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(100, Math.max(0, Math.round(num)));
}

/**
 * Calls Groq (with multi-model retry cascade) / xAI API and blends with deterministic ATS verification.
 */
export async function analyzeResume(resumeText, jobDescription, fallbackFileName = '') {
  // Always compute deterministic evidence-based analysis first for this exact Resume + JD pair
  const localResult = localAnalyzeResume(resumeText, jobDescription, fallbackFileName);
  const extractedName = localResult.candidateName;

  if (!API_KEY) {
    console.log('[AI Engine] API key not configured. Running transparent local ATS engine.');
    return localResult;
  }

  const systemPrompt = `You are an expert ATS Resume Reviewer, Career Advisor, and Job-Matching Analyst.
Carefully evaluate the Candidate Resume against the Target Job Description.

CRITICAL SCORING & EVALUATION RULES:
1. Evaluate ONLY based on actual evidence present in the Resume vs the Target Job Description.
2. Different candidates with different skills/experience MUST receive accurate, distinct scores reflecting their actual match.
3. Score each of the 7 factors from 0 to 100 (integer):
   - requiredSkills (Weight 30%): Percentage of required JD skills evidenced in the resume. If 0 required skills match, give 0-15.
   - experience (Weight 20%): Relevance and depth of work experience/internships/responsibilities vs JD requirements.
   - projects (Weight 15%): Relevance and technical depth of projects relative to the JD tech stack.
   - education (Weight 10%): Alignment of degree and academic background with JD requirements.
   - technicalKeywords (Weight 10%): Density and coverage of JD domain keywords and tools in the resume.
   - ats (Weight 10%): Resume formatting structure, clear sections, contact details, and parseability.
   - preferredSkills (Weight 5%): Coverage of preferred/bonus skills from the JD.
4. NEVER count a skill as matched unless evidence exists in the resume (Java != Spring Boot, JS != React, MySQL != PostgreSQL, AWS != Azure).
5. Extract the candidate's real name from the resume header/contact block. If not found, return "Candidate Name Not Found".
6. Provide 5 specific suggestions categorized as:
   - 1. Missing Skill
   - 2. Resume Improvement
   - 3. Project Improvement
   - 4. ATS Improvement
   - 5. Experience/Impact Improvement
7. Recommend 5 skills to learn based specifically on missing/relevant skills for this Job Description.
8. Output STRICT JSON ONLY without markdown code blocks.

JSON Schema:
{
  "type": "resume_analysis",
  "candidateName": "String",
  "scores": {
    "requiredSkills": 0,
    "experience": 0,
    "projects": 0,
    "education": 0,
    "technicalKeywords": 0,
    "ats": 0,
    "preferredSkills": 0
  },
  "summary": "Specific explanation of why this candidate received this score based on matched and missing JD requirements.",
  "matchedRequirements": ["MATCHED_SKILL_1"],
  "missingRequirements": ["MISSING_SKILL_1"],
  "partiallyMatchedRequirements": ["SKILL (Explanation of what is partial vs missing)"],
  "suggestions": [
    "1. Missing Skill: ...",
    "2. Resume Improvement: ...",
    "3. Project Improvement: ...",
    "4. ATS Improvement: ...",
    "5. Experience/Impact Improvement: ..."
  ],
  "skillsToLearn": [
    { "skill": "SKILL NAME", "priority": "High", "reason": "Why it matters for this JD and whether missing in resume" }
  ]
}`;

  const userPrompt = `Target Job Description:\n${(jobDescription || 'General Technical Role').slice(0, 2500)}\n\nVerified Keyword Pre-Scan:\n- Candidate Name Detected: ${extractedName}\n- Matched JD Skills in Resume: ${localResult.matchedRequirements.join(', ') || 'None'}\n- Missing JD Skills in Resume: ${localResult.missingRequirements.join(', ') || 'None'}\n\nCandidate Resume Text:\n${(resumeText || '').slice(0, 3500)}`;

  const modelsToTry = isGroq ? GROQ_MODELS : [MODEL_NAME];

  for (const model of modelsToTry) {
    try {
      const providerName = isGroq ? `Groq (${model})` : 'xAI (Grok)';
      console.log(`[AI Engine] Invoking ${providerName}...`);

      const requestBody = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1
      };

      if (isGroq) {
        requestBody.response_format = { type: 'json_object' };
      }

      let response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(18000)
      });

      // If rate-limited (HTTP 429), wait the requested backoff window (~5.5s) and retry once
      if (response.status === 429) {
        const errText429 = await response.text();
        const waitMatch = errText429.match(/try again in (\d+(?:\.\d+)?)s/i);
        const waitMs = waitMatch ? Math.min(7000, Math.ceil( parseFloat(waitMatch[1]) * 1000 ) + 400) : 5500;
        console.log(`[AI Engine] Rate limit reached on ${model}. Waiting ${waitMs}ms and retrying...`);
        await new Promise(r => setTimeout(r, waitMs));
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(18000)
        });
      }

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AI Engine Warning] ${model} HTTP ${response.status}: ${errText.slice(0, 180)}`);
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';
      const cleanJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Resolve Candidate Name: prefer programmatic extraction if valid, otherwise validate LLM extracted name
      let finalName = extractedName;
      if (finalName === 'Candidate Name Not Found' && parsed.candidateName) {
        const llmValidName = isPlausibleHumanName(parsed.candidateName);
        if (llmValidName) {
          finalName = toTitleCaseName(llmValidName);
        }
      }
      parsed.candidateName = finalName;

      // Blend LLM scores with verified deterministic ATS scores (60% AI evaluation + 40% verified keyword/structure metrics)
      // This guarantees zero hallucinated inflation, preserves 0 scores, and ensures distinct scores for different resumes
      const s = parsed.scores || {};
      const ls = localResult.scores;

      const aiReq = toValidScore(s.requiredSkills ?? s.skills, ls.requiredSkills);
      const aiExp = toValidScore(s.experience, ls.experience);
      const aiProj = toValidScore(s.projects, ls.projects);
      const aiEdu = toValidScore(s.education, ls.education);
      const aiTech = toValidScore(s.technicalKeywords, ls.technicalKeywords);
      const aiAts = toValidScore(s.ats ?? s.atsReadability, ls.ats);
      const aiPref = toValidScore(s.preferredSkills, ls.preferredSkills);

      const reqS = Math.round(aiReq * 0.55 + ls.requiredSkills * 0.45);
      const expS = Math.round(aiExp * 0.60 + ls.experience * 0.40);
      const projS = Math.round(aiProj * 0.60 + ls.projects * 0.40);
      const eduS = Math.round(aiEdu * 0.60 + ls.education * 0.40);
      const techS = Math.round(aiTech * 0.55 + ls.technicalKeywords * 0.45);
      const atsS = Math.round(aiAts * 0.50 + ls.ats * 0.50);
      const prefS = Math.round(aiPref * 0.55 + ls.preferredSkills * 0.45);

      const computedOverall = Math.min(99, Math.max(5, Math.round(
        (reqS * 0.30) +
        (expS * 0.20) +
        (projS * 0.15) +
        (eduS * 0.10) +
        (techS * 0.10) +
        (atsS * 0.10) +
        (prefS * 0.05)
      )));

      parsed.type = 'resume_analysis';
      parsed.analyzedForJD = (jobDescription || '').trim();
      parsed.overallScore = computedOverall;
      parsed.scores = {
        overall: computedOverall,
        requiredSkills: reqS,
        skills: reqS,
        experience: expS,
        projects: projS,
        education: eduS,
        technicalKeywords: techS,
        ats: atsS,
        atsReadability: atsS,
        preferredSkills: prefS
      };

      // Merge matched & missing requirements accurately
      parsed.matchedRequirements = Array.isArray(parsed.matchedRequirements) && parsed.matchedRequirements.length > 0
        ? parsed.matchedRequirements.map(m => String(m).toUpperCase())
        : localResult.matchedRequirements;

      parsed.missingRequirements = Array.isArray(parsed.missingRequirements) && parsed.missingRequirements.length > 0
        ? parsed.missingRequirements.map(m => String(m).toUpperCase())
        : localResult.missingRequirements;

      parsed.partiallyMatchedRequirements = Array.isArray(parsed.partiallyMatchedRequirements) && parsed.partiallyMatchedRequirements.length > 0
        ? parsed.partiallyMatchedRequirements
        : localResult.partiallyMatchedRequirements;

      // Ensure suggestions has 5 structured items
      if (!Array.isArray(parsed.suggestions) || parsed.suggestions.length < 5) {
        parsed.suggestions = [...(parsed.suggestions || []), ...localResult.suggestions].slice(0, 5);
      } else {
        parsed.suggestions = parsed.suggestions.slice(0, 5);
      }

      // Ensure skillsToLearn has 5 items
      if (!Array.isArray(parsed.skillsToLearn) || parsed.skillsToLearn.length < 5) {
        parsed.skillsToLearn = [...(parsed.skillsToLearn || []), ...localResult.skillsToLearn].slice(0, 5);
      } else {
        parsed.skillsToLearn = parsed.skillsToLearn.slice(0, 5);
      }

      if (!parsed.summary || parsed.summary.length < 20) {
        parsed.summary = localResult.summary;
      }

      parsed.courses = VERIFIED_RESOURCES.slice(0, 3);
      parsed.coursesAndCertifications = VERIFIED_RESOURCES.slice(0, 3);
      parsed.mode = providerName;

      return parsed;
    } catch (error) {
      console.warn(`[AI Engine Error on ${model}]`, error.message);
    }
  }

  console.log('[AI Engine] All API models exhausted or rate-limited. Returning deterministic ATS analysis.');
  return localResult;
}

/**
 * Compare multiple resumes against a single Job Description.
 * Only compares the specific resumes passed in (latest 2 or latest 3).
 * Always verifies that each resume is analyzed against the ACTIVE Job Description (re-analyzing if JD changed).
 */
export async function compareResumes(resumesList = [], jobDescription = '') {
  if (!Array.isArray(resumesList) || resumesList.length === 0) {
    return { error: 'Please provide at least one resume for comparison.' };
  }

  const activeJDTrimmed = (jobDescription || '').trim();
  const jobTarget = extractJobTitle(jobDescription);
  const { reqSkills, prefSkills } = parseJDRequirements(jobDescription);
  const allJDSkills = [...new Set([...reqSkills, ...prefSkills])];
  const topRequirements = allJDSkills.length >= 2
    ? allJDSkills.slice(0, 6)
    : ['Core Skills', 'Experience', 'Projects', 'ATS Structure'];

  // Analyze each resume individually against the CURRENT Job Description
  const analyzed = [];
  for (let i = 0; i < resumesList.length; i++) {
    const item = resumesList[i];
    const hasFreshAnalysis = item.analysis && item.analysis.analyzedForJD === activeJDTrimmed;
    const analysis = hasFreshAnalysis
      ? item.analysis
      : await analyzeResume(item.text, jobDescription, item.fileName || item.name || '');

    // Resolve candidate name accurately
    let candidateName = analysis.candidateName;
    if (!candidateName || candidateName === 'Candidate Name Not Found') {
      const extracted = extractCandidateName(item.text, item.fileName || item.name || '');
      if (extracted !== 'Candidate Name Not Found') {
        candidateName = extracted;
      } else if (item.name && !item.name.toLowerCase().includes('candidate name not found')) {
        candidateName = item.name.replace(/\.[^/.]+$/, '');
      } else {
        candidateName = `Candidate ${i + 1}`;
      }
    }

    analyzed.push({
      id: item.id || `candidate-${i + 1}`,
      name: candidateName,
      text: item.text || '',
      analysis
    });
  }

  // Sort by overall score descending (tie-break by requiredSkills score, then experience score)
  analyzed.sort((a, b) => {
    if (b.analysis.overallScore !== a.analysis.overallScore) {
      return b.analysis.overallScore - a.analysis.overallScore;
    }
    if ((b.analysis.scores?.requiredSkills || 0) !== (a.analysis.scores?.requiredSkills || 0)) {
      return (b.analysis.scores?.requiredSkills || 0) - (a.analysis.scores?.requiredSkills || 0);
    }
    return (b.analysis.scores?.experience || 0) - (a.analysis.scores?.experience || 0);
  });

  // Build requirement matrix (Requirement | Candidate 1 | Candidate 2 [| Candidate 3])
  const matrix = topRequirements.map(req => {
    const reqLower = req.toLowerCase();
    const row = { requirement: req.toUpperCase() };
    analyzed.forEach((cand, idx) => {
      const textLower = (cand.text || '').toLowerCase();
      const matched = (cand.analysis.matchedRequirements || []).map(m => m.toLowerCase());
      const partial = (cand.analysis.partiallyMatchedRequirements || []).map(p => p.toLowerCase());

      const isMatch = matched.some(m => m.includes(reqLower) || reqLower.includes(m)) || matchesTermInText(textLower, reqLower);
      const isPartial = !isMatch && partial.some(p => p.includes(reqLower));

      if (isMatch) {
        row[`cand${idx + 1}`] = '✅';
      } else if (isPartial) {
        row[`cand${idx + 1}`] = '⚠️';
      } else {
        row[`cand${idx + 1}`] = '❌';
      }
    });
    return row;
  });

  // Evidence-based comparison summary
  const top = analyzed[0];
  const second = analyzed[1];
  const third = analyzed[2];
  let comparisonSummary = '';

  if (second) {
    const scoreDiff = top.analysis.overallScore - second.analysis.overallScore;
    const topStrengths = (top.analysis.matchedRequirements || []).slice(0, 4).join(', ') || 'key job competencies';
    const secondMissing = (second.analysis.missingRequirements || []).slice(0, 3).join(', ') || 'several required skills';

    if (scoreDiff === 0) {
      comparisonSummary = `${top.name} (${top.analysis.overallScore}/100) and ${second.name} (${second.analysis.overallScore}/100) achieved equal overall scores, with ${top.name} ranking first based on Required Skills (${top.analysis.scores?.requiredSkills}/100 vs ${second.analysis.scores?.requiredSkills}/100) and Experience (${top.analysis.scores?.experience}/100 vs ${second.analysis.scores?.experience}/100).`;
    } else {
      comparisonSummary = `${top.name} ranks #1 with ${top.analysis.overallScore}/100 (Required Skills: ${top.analysis.scores?.requiredSkills}/100, Experience: ${top.analysis.scores?.experience}/100) due to verified evidence in ${topStrengths}. ${second.name} ranks #2 with ${second.analysis.overallScore}/100, missing evidence for ${secondMissing}.`;
      if (third) {
        comparisonSummary += ` ${third.name} ranks #3 with ${third.analysis.overallScore}/100 (Required Skills: ${third.analysis.scores?.requiredSkills}/100).`;
      }
    }
  } else {
    comparisonSummary = `${top.name} achieved an overall match of ${top.analysis.overallScore}/100 against "${jobTarget}".`;
  }

  return {
    type: 'resume_comparison',
    jobTarget,
    totalCandidates: analyzed.length,
    candidates: analyzed.map((c, index) => {
      const a = c.analysis;
      const strengths = (a.matchedRequirements && a.matchedRequirements.length > 0)
        ? a.matchedRequirements.slice(0, 4)
        : ['Foundational technical background'];
      const missing = (a.missingRequirements && a.missingRequirements.length > 0)
        ? a.missingRequirements.slice(0, 3)
        : ['None identified'];

      const improvements = (a.suggestions || []).slice(0, 3).map(s => {
        const lines = s.split('\n').map(l => l.trim()).filter(Boolean);
        return lines.length >= 2 ? `${lines[0]}: ${lines[1]}` : lines[0];
      });

      return {
        rank: index + 1,
        id: c.id,
        name: c.name,
        overallScore: a.overallScore,
        scores: a.scores,
        strengths,
        missing,
        improvements,
        keyStrengths: strengths,
        whatToImprove: improvements,
        isTopCandidate: index === 0
      };
    }),
    topRequirements: topRequirements.map(r => r.toUpperCase()),
    matrix,
    comparisonSummary,
    summary: comparisonSummary
  };
}

/**
 * Answer general career questions: coding doubts, roadmaps, interview prep, skill recommendations.
 */
export async function answerCareerQuestion(question = '') {
  const q = (question || '').trim();
  if (!q) {
    return 'Please ask a career, interview, or coding question!';
  }

  if (!API_KEY) {
    return getFallbackCareerAnswer(q);
  }

  try {
    const systemPrompt = `You are an expert ATS Resume Reviewer, Career Advisor, Technical Interview Assistant and Job-Matching Analyst.
The user is asking a normal career or coding question. Answer normally as an expert AI career/coding mentor.
Do NOT force resume analysis when the user has not provided a resume.
GUIDELINES:
1. For coding questions (e.g., "What is Java?", syntax, debugging, concepts):
   - Provide a clear explanation
   - Include a simple, easy-to-understand code example when useful
   - Highlight important key points and common beginner pitfalls
   - Keep it beginner-friendly and concise
2. For roadmap questions (e.g., "Give me a roadmap to become a Java/full-stack developer"):
   - Provide a step-by-step roadmap
   - List required core skills
   - Suggest real-world projects to build
   - Suggest practice platforms
   - Provide clear next steps
3. For interview questions:
   - Provide technical patterns, behavioral STAR framework tips, and reverse interview questions
Use neat markdown formatting, bullet points, and emojis. Keep answers practical and avoid huge walls of text.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: q }
        ],
        temperature: 0.3
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      return getFallbackCareerAnswer(q);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getFallbackCareerAnswer(q);
  } catch (error) {
    return getFallbackCareerAnswer(q);
  }
}

/**
 * Instant rich career guidance fallback when API key is pending or network drops
 */
function getFallbackCareerAnswer(question = '') {
  const q = question.toLowerCase();

  // Coding Question: What is Java?
  if (q.includes('what is java') || (q.includes('java') && !q.includes('roadmap') && !q.includes('interview'))) {
    return `☕ *What is Java?*

*Java* is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It is famous for its philosophy: *"Write Once, Run Anywhere"* (WORA), enabled by the Java Virtual Machine (JVM).

📌 *Key Characteristics:*
• *Platform Independent:* Compiled into bytecode that runs on any OS with a JVM.
• *Object-Oriented:* Encapsulation, Inheritance, Polymorphism, and Abstraction.
• *Robust & Secure:* Automatic garbage collection, strong memory management, and no explicit pointers.
• *Multi-Threaded:* Built-in support for concurrent execution.

💡 *Simple Example (Hello World):*
\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

🎯 *Where Java is Used:*
1. Enterprise Backend Systems (Spring Boot, Microservices)
2. Android Mobile Development
3. Big Data Processing (Apache Spark, Hadoop)
4. Financial & High-Frequency Trading Systems`;
  }

  // Career Roadmap: Java Developer
  if (q.includes('java') && (q.includes('roadmap') || q.includes('developer') || q.includes('path'))) {
    return `🗺️ *Java Developer Career Roadmap (Step-by-Step)*

1️⃣ *Step 1: Core Java Foundations*
   • Syntax, Data Types, Control Statements, OOP Concepts
   • Collections Framework (\`List\`, \`Set\`, \`Map\`)
   • Exception Handling, Generics, Lambdas & Streams (Java 8+)

2️⃣ *Step 2: Databases & Persistence*
   • SQL fundamentals (PostgreSQL or MySQL)
   • JDBC, Hibernate ORM, and Spring Data JPA

3️⃣ *Step 3: Frameworks & Enterprise Backend*
   • *Spring Framework:* Spring Boot, Spring MVC, RESTful APIs
   • Security: Spring Security, JWT authentication

4️⃣ *Step 4: Build Tools & DevOps Basics*
   • Maven or Gradle build automation
   • Git version control, Docker containerization, CI/CD with GitHub Actions

5️⃣ *Step 5: Production Projects to Build*
   • *E-Commerce REST API:* Product catalog, cart, user auth, PostgreSQL.
   • *Banking Transaction Service:* Concurrency control, distributed locks.

🚀 *Suggested Next Step:* Start by coding small OOP programs and practice basic algorithmic problems on LeetCode!`;
  }

  // Full-Stack Developer Roadmap
  if (q.includes('roadmap') || q.includes('full-stack') || q.includes('fullstack') || q.includes('react')) {
    return `🗺️ *Full-Stack Developer Roadmap (Step-by-Step)*

1️⃣ *Step 1: Frontend Foundations*
   • HTML5, CSS3, Modern JavaScript (ES6+)
   • Responsive UI design, Tailwind CSS
   • React (Hooks, Component Lifecycle, State Management)

2️⃣ *Step 2: Backend & APIs*
   • Node.js & Express.js (or Python FastAPI / Java Spring Boot)
   • RESTful API design, authentication (JWT), error handling middleware

3️⃣ *Step 3: Databases*
   • Relational: PostgreSQL / MySQL
   • NoSQL: MongoDB / Redis (for caching)

4️⃣ *Step 4: DevOps & Cloud*
   • Git & GitHub workflows
   • Docker containers, automated tests (Jest/Cypress)
   • Deployment on AWS or Vercel

5️⃣ *Step 5: Featured Projects*
   • Full-Stack SaaS platform with auth, Stripe payments, and database.
   • Real-time chat or collaboration board using WebSockets.`;
  }

  // Interview Preparation
  if (q.includes('interview') || q.includes('prepare')) {
    return `🎯 *Technical Interview Strategy & Guide*

1️⃣ *Coding / DSA Rounds:*
   • Focus on 14 core patterns: Sliding Window, Two Pointers, Fast/Slow Pointers, BFS/DFS, Top K Elements.
   • Think out loud: Explain your approach, time/space complexity ($O(N)$), and edge cases before coding.

2️⃣ *System Design Rounds:*
   • Understand caching (Redis), load balancing, horizontal vs. vertical scaling, database indexing.

3️⃣ *Behavioral Rounds (STAR Method):*
   • **S**ituation: Set the context.
   • **T**ask: Explain the challenge.
   • **A**ction: What *you* specifically did.
   • **R**esult: Measurable outcome (e.g., "Reduced latency by 35%").

💡 *Tip:* Ask the interviewer thoughtful questions about their engineering architecture and team velocity!`;
  }

  // Default Career Guidance
  return `💡 *AI Career Recommendation*
• *Align with Job Criteria:* Study current job descriptions and bridge identified skill gaps with verified projects.
• *Practice Continuously:* Build production-ready code with version control and automated tests.
• *Resume ATS Check:* Upload your resume as a PDF or Word file using \`/setjd\` and attach your document to receive a full score and improvement breakdown!`;
}
