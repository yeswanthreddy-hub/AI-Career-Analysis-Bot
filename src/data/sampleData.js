export const SAMPLE_JOB_DESCRIPTION = `Senior Full-Stack Engineer (React, Node.js, Cloud)

About the Role:
We are seeking an experienced Full-Stack Engineer to architect and scale mission-critical web applications. You will collaborate with cross-functional teams to design high-throughput APIs, build responsive modern frontends, and deploy microservices to the cloud.

Key Requirements:
- 3+ years experience with React, Modern JavaScript (ES6+), and responsive CSS.
- Strong proficiency in Node.js, Express.js, and RESTful API architecture.
- Experience with Relational Databases (PostgreSQL) and NoSQL (MongoDB).
- Hands-on experience with Docker, CI/CD pipelines, and Cloud platforms (AWS or GCP).
- Familiarity with automated testing (Jest, Cypress) and Git version control.
- Excellent communication and problem-solving abilities.`;

export const SAMPLE_RESUME_TEXT = `ALEX CHEN
San Francisco, CA | alex.chen@example.com | github.com/alexchen | linkedin.com/in/alexchen

PROFESSIONAL SUMMARY
Dynamic Full-Stack Software Engineer with 3+ years of experience designing and implementing performant web applications using React, Node.js, and PostgreSQL. Proven track record in reducing API latency by 35% and building accessible user interfaces.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, HTML5, CSS3, SQL
- Frontend: React, Redux, Tailwind CSS, Vite, Next.js
- Backend: Node.js, Express.js, REST APIs, GraphQL, PostgreSQL, MongoDB
- Tools & DevOps: Git, Docker, Linux, Jest, AWS (S3, EC2)

PROFESSIONAL EXPERIENCE
Software Engineer | Nexa Technologies | 2022 - Present
- Architected and deployed a customer analytics dashboard using React and Node.js serving 50,000+ daily active users.
- Optimized database queries and indexed PostgreSQL schemas, reducing query response times by 40%.
- Integrated third-party payment gateways and webhook notification listeners with 99.9% uptime.
- Spearheaded team transition from legacy bundlers to Vite, speeding up CI build pipeline by 2.5x.

Junior Web Developer | Innovate Labs | 2021 - 2022
- Developed responsive React frontend components complying with WCAG 2.1 AA accessibility guidelines.
- Created automated unit and integration tests using Jest and React Testing Library, increasing test coverage to 85%.
- Collaborated in an Agile Scrum environment across 2-week sprint cycles.

EDUCATION
Bachelor of Science in Computer Science | University of California, Davis | 2017 - 2021`;

export const SAMPLE_CANDIDATE_2_TEXT = `JORDAN SMITH
Austin, TX | jordan.smith@example.com | github.com/jordansmith

SUMMARY
Frontend Developer passionate about crafting responsive, animated user experiences with React and modern CSS. Eager to expand into backend cloud services.

SKILLS
React, JavaScript, HTML/CSS, Tailwind CSS, Redux, Git, Basic Node.js, Express, Figma

EXPERIENCE
Frontend Developer | PixelCraft Studio | 2022 - Present
- Built landing pages and client dashboards using React and Tailwind CSS.
- Improved mobile responsiveness and lighthouse performance scores from 65 to 92.
- Created reusable UI component library used across 4 internal projects.

EDUCATION
Bachelor of Arts in Interactive Media | Texas State University | 2018 - 2022`;

export const SAMPLE_ANALYSIS_DATA = {
  candidateName: 'Alex Chen',
  scores: {
    overall: 88,
    skills: 92,
    projects: 86,
    education: 85,
    experience: 89,
    atsReadability: 91
  },
  matchedSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Jest', 'REST API'],
  missingSkills: ['Kubernetes', 'CI/CD Pipelines', 'System Design at Scale'],
  suggestions: [
    'Incorporate specific CI/CD pipeline tools (e.g., GitHub Actions, Jenkins) into your DevOps experience section.',
    'Highlight container orchestration experience with Kubernetes to further match senior cloud infrastructure criteria.',
    'Detail production metrics and budget/cost efficiency achieved when managing AWS S3 and EC2 instances.',
    'Include a dedicated System Architecture bullet detailing how high throughput (50k+ DAU) was scaled.',
    'Quantify the team size or mentorship contributions made during your tenure as Software Engineer at Nexa.'
  ],
  skillsToLearn: [
    {
      name: 'KUBERNETES & CONTAINER ORCHESTRATION',
      priority: 'High',
      why: 'Crucial for scaling microservice architectures requested in senior full-stack roles.'
    },
    {
      name: 'CI/CD AUTOMATION (GITHUB ACTIONS)',
      priority: 'High',
      why: 'Accelerates automated testing, linting, and deployment pipelines demanded by modern teams.'
    },
    {
      name: 'SYSTEM DESIGN & DISTRIBUTED CACHING (REDIS)',
      priority: 'Medium',
      why: 'Enables ultra-fast data retrieval and prevents database bottlenecks in high-throughput apps.'
    },
    {
      name: 'TYPESCRIPT IN PRODUCTION APIS',
      priority: 'Medium',
      why: 'Enhances code maintainability, type safety, and minimizes runtime exceptions in enterprise backends.'
    },
    {
      name: 'OBSERVABILITY & MONITORING (PROMETHEUS/GRAFANA)',
      priority: 'Low',
      why: 'Demonstrates end-to-end production ownership, tracing, and health alert monitoring.'
    }
  ],
  coursesAndCertifications: [
    {
      name: 'Meta Front-End Developer Professional Certificate',
      platform: 'Coursera',
      why: 'Comprehensive hands-on training in React, modern JavaScript, responsive design, and UI/UX best practices.',
      url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer'
    },
    {
      name: 'AWS Certified Solutions Architect - Associate',
      platform: 'Amazon Web Services',
      why: 'Industry benchmark certification validating cloud architecture, deployment, security, and scalable systems.',
      url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
    },
    {
      name: 'CS50: Introduction to Computer Science',
      platform: 'Harvard / edX',
      why: 'Foundational mastery of algorithms, data structures, systems, and clean software engineering principles.',
      url: 'https://www.edx.org/cs50'
    }
  ],
  mode: 'Interactive Showcase'
};

export const SAMPLE_COMPARISON_DATA = {
  jobDescriptionSummary: 'Senior Full-Stack Engineer (React, Node.js, Cloud, Databases)',
  totalCandidates: 2,
  topCandidate: 'Alex Chen',
  candidates: [
    {
      rank: 1,
      id: 'alex-chen',
      name: 'Alex Chen',
      overallScore: 88,
      scores: {
        overall: 88,
        skills: 92,
        projects: 86,
        education: 85,
        experience: 89,
        atsReadability: 91
      },
      keyStrengths: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      whatToImprove: [
        'Add deeper cloud orchestration details with Kubernetes.',
        'Emphasize end-to-end CI/CD automation pipeline setups.'
      ],
      isTopCandidate: true
    },
    {
      rank: 2,
      id: 'jordan-smith',
      name: 'Jordan Smith',
      overallScore: 68,
      scores: {
        overall: 68,
        skills: 70,
        projects: 72,
        education: 74,
        experience: 65,
        atsReadability: 82
      },
      keyStrengths: ['React', 'Tailwind CSS', 'UI Component Library', 'Web Performance'],
      whatToImprove: [
        'Demonstrate full-stack backend depth (Node.js, Express, SQL/NoSQL databases).',
        'Add cloud deployment, containerization (Docker), and automated testing experience.'
      ],
      isTopCandidate: false
    }
  ],
  summary: 'Alex Chen demonstrates significantly higher alignment (88/100) for the Senior Full-Stack role with production experience spanning both React and Node.js backend databases. Jordan Smith has strong frontend capabilities but needs backend and cloud depth to qualify for this senior position.'
};
