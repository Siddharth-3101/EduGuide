import { MarkerType } from '@xyflow/react';
import { BACKEND_DEVELOPER_ROADMAP } from './horizontalRoadmapData';

/**
 * Creates standardized Left-to-Right ReactFlow horizontal graphs for each role
 */

const makeEdge = (id, source, target, isAnimated = false, isVerified = true) => ({
  id,
  source,
  target,
  type: 'smoothstep',
  animated: isAnimated,
  style: {
    stroke: isAnimated ? '#3b82f6' : isVerified ? '#10b981' : 'rgba(150, 150, 150, 0.4)',
    strokeWidth: isAnimated ? 2.5 : 2,
    strokeDasharray: isVerified && !isAnimated ? undefined : isAnimated ? undefined : '4 4'
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: isAnimated ? '#3b82f6' : isVerified ? '#10b981' : 'rgba(150, 150, 150, 0.5)',
    width: 14,
    height: 14
  }
});

export const ROLE_ROADMAPS = {
  'backend-developer': BACKEND_DEVELOPER_ROADMAP,

  'data-analyst': {
    roleId: 'data-analyst',
    roleTitle: 'Data Analyst',
    targetSalary: '₹7,50,000 – ₹13,00,000 / yr',
    stats: {
      verifiedCount: 5,
      partialCount: 2,
      missingCount: 2,
      totalSkills: 9,
      coverage: 68
    },
    recommendedNextId: 'node-bi-tools',
    nodes: [
      {
        id: 'node-data-fundamentals',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'data-fundamentals',
          name: 'Data Fundamentals & Excel',
          category: 'Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 94,
          prerequisites: ['None (Foundational)'],
          evidence: ['Excel Modeling Certificate', 'CS101 Transcript'],
          whyNeeded: 'Pivot tables, VLOOKUP/XLOOKUP, and structured data handling.',
          resources: [{ title: 'Advanced Excel for Data Analysis', provider: 'Coursera', duration: '6 hours' }],
          assessmentId: 'asm-excel'
        }
      },
      {
        id: 'node-sql-data',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'sql',
          name: 'SQL & Relational DBs',
          category: 'Data Extraction',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['Data Fundamentals'],
          evidence: ['SQL Assessment (92%)', 'PostgreSQL Query Evidence'],
          whyNeeded: 'Window functions, CTEs, complex multi-table aggregations and joins.',
          resources: [{ title: 'Mode Analytics Advanced SQL Tutorial', provider: 'Mode', duration: '5 hours' }],
          assessmentId: 'asm-sql'
        }
      },
      {
        id: 'node-python-pandas',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 120 },
        data: {
          skillId: 'python-pandas',
          name: 'Python & Pandas',
          category: 'Data Wrangling',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['SQL & Relational DBs'],
          evidence: ['GitHub Python Repository', 'Python Assessment (88%)'],
          whyNeeded: 'DataFrame manipulation, automated data cleaning, and statistical scripting.',
          resources: [{ title: 'Python for Data Analysis', provider: "O'Reilly", duration: '8 hours' }],
          assessmentId: 'asm-python'
        }
      },
      {
        id: 'node-bi-tools',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 380 },
        data: {
          skillId: 'tableau-powerbi',
          name: 'Tableau & Power BI',
          category: 'Business Intelligence',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          score: 65,
          prerequisites: ['SQL & Relational DBs'],
          evidence: ['Completed Tableau Intro Project'],
          whyNeeded: 'Required by 82% of Data Analyst roles for executive dashboarding and KPIs.',
          resources: [{ title: 'Power BI Masterclass 2026', provider: 'Udemy', duration: '7 hours' }],
          assessmentId: 'asm-bi'
        }
      },
      {
        id: 'node-statistics',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 120 },
        data: {
          skillId: 'statistics',
          name: 'Applied Statistics & Probability',
          category: 'Quantitative Analysis',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Intermediate',
          score: 85,
          prerequisites: ['Python & Pandas'],
          evidence: ['University Mathematics Transcript', 'AgriSmart Analytics Module'],
          whyNeeded: 'Hypothesis testing, confidence intervals, p-values, and distribution modeling.',
          resources: [{ title: 'Practical Statistics for Data Scientists', provider: "O'Reilly", duration: '6 hours' }],
          assessmentId: 'asm-stats'
        }
      },
      {
        id: 'node-data-cleaning',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 380 },
        data: {
          skillId: 'data-cleaning',
          name: 'Data Cleaning & ETL Pipelines',
          category: 'Data Engineering',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Intermediate',
          requiredLevel: 'Intermediate',
          score: 70,
          prerequisites: ['Tableau & Power BI'],
          evidence: ['Data pipeline script in GitHub'],
          whyNeeded: 'Handling missing values, outlier detection, and data ingestion normalization.',
          resources: [{ title: 'Building Automated ETL Pipelines', provider: 'DataCamp', duration: '4 hours' }],
          assessmentId: 'asm-etl'
        }
      },
      {
        id: 'node-data-warehousing',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 120 },
        data: {
          skillId: 'data-warehousing',
          name: 'BigQuery & Snowflake',
          category: 'Cloud Warehouses',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Applied Statistics', 'Data Cleaning'],
          evidence: ['None - Assessment Required'],
          whyNeeded: 'Querying terabyte-scale enterprise analytics data in columnar cloud warehouses.',
          resources: [{ title: 'Google Cloud BigQuery Developer Guide', provider: 'Google Cloud', duration: '5 hours' }],
          assessmentId: 'asm-bigquery'
        }
      },
      {
        id: 'node-ab-testing',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 380 },
        data: {
          skillId: 'ab-testing',
          name: 'A/B Testing & Experimentation',
          category: 'Product Analytics',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Data Cleaning'],
          evidence: ['None'],
          whyNeeded: 'Designing randomized controlled trials and statistical significance measurement.',
          resources: [{ title: 'Trustworthy Online Controlled Experiments', provider: 'Cambridge Press', duration: '6 hours' }],
          assessmentId: 'asm-ab'
        }
      },
      {
        id: 'node-target-data-analyst',
        type: 'targetCareerNode',
        position: { x: 1540, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'Senior Data Analyst',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 5,
          totalSkillsCount: 9,
          coveragePercentage: 68,
          averageSalary: '₹7,50,000 – ₹13,00,000 / yr',
          topHiringCompanies: ['Fractal Analytics', 'Deloitte', 'Amazon', 'Mu Sigma']
        }
      }
    ],
    edges: [
      makeEdge('e-df-sql', 'node-data-fundamentals', 'node-sql-data', false, true),
      makeEdge('e-sql-py', 'node-sql-data', 'node-python-pandas', false, true),
      makeEdge('e-sql-bi', 'node-sql-data', 'node-bi-tools', true, false),
      makeEdge('e-py-stats', 'node-python-pandas', 'node-statistics', false, true),
      makeEdge('e-bi-clean', 'node-bi-tools', 'node-data-cleaning', false, false),
      makeEdge('e-stats-wh', 'node-statistics', 'node-data-warehousing', false, false),
      makeEdge('e-clean-ab', 'node-data-cleaning', 'node-ab-testing', false, false),
      makeEdge('e-wh-target', 'node-data-warehousing', 'node-target-data-analyst', false, false),
      makeEdge('e-ab-target', 'node-ab-testing', 'node-target-data-analyst', false, false)
    ]
  },

  'ai-engineer': {
    roleId: 'ai-engineer',
    roleTitle: 'AI & Machine Learning Engineer',
    targetSalary: '₹12,00,000 – ₹22,00,000 / yr',
    stats: {
      verifiedCount: 4,
      partialCount: 2,
      missingCount: 3,
      totalSkills: 9,
      coverage: 58
    },
    recommendedNextId: 'node-deep-learning',
    nodes: [
      {
        id: 'node-python-math',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'python-math',
          name: 'Python & Linear Algebra',
          category: 'Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['None (Foundational)'],
          evidence: ['Math Assessment (92%)', 'Python Repositories'],
          whyNeeded: 'Vector operations, matrix dot products, gradients, and Python scientific stack.',
          resources: [{ title: 'Mathematics for Machine Learning', provider: 'Coursera / Imperial', duration: '10 hours' }],
          assessmentId: 'asm-math'
        }
      },
      {
        id: 'node-numpy-pandas',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'numpy-pandas',
          name: 'NumPy, Pandas & Wrangling',
          category: 'Data Science',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 89,
          prerequisites: ['Python & Linear Algebra'],
          evidence: ['Data Wrangling Assessment Pass (89%)'],
          whyNeeded: 'Efficient tensor broadcasting, data preprocessing, and feature engineering.',
          resources: [{ title: 'Python Data Science Handbook', provider: "O'Reilly", duration: '8 hours' }],
          assessmentId: 'asm-numpy'
        }
      },
      {
        id: 'node-scikit-learn',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 120 },
        data: {
          skillId: 'scikit-learn',
          name: 'Scikit-Learn & Classical ML',
          category: 'Machine Learning',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 86,
          prerequisites: ['NumPy, Pandas & Wrangling'],
          evidence: ['ML Classification Project on GitHub'],
          whyNeeded: 'Random Forests, XGBoost, cross-validation, and ROC-AUC evaluation metrics.',
          resources: [{ title: 'Hands-On Machine Learning with Scikit-Learn', provider: "O'Reilly", duration: '12 hours' }],
          assessmentId: 'asm-sklearn'
        }
      },
      {
        id: 'node-deep-learning',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 380 },
        data: {
          skillId: 'pytorch',
          name: 'PyTorch & Deep Neural Nets',
          category: 'Deep Learning',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 64,
          prerequisites: ['NumPy, Pandas & Wrangling'],
          evidence: ['PyTorch Model Training Notebook'],
          whyNeeded: 'Building CNNs, autograd backprop, GPU batch acceleration, and loss optimization.',
          resources: [{ title: 'Deep Learning with PyTorch', provider: 'PyTorch.org', duration: '10 hours' }],
          assessmentId: 'asm-pytorch'
        }
      },
      {
        id: 'node-transformers',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 120 },
        data: {
          skillId: 'transformers',
          name: 'Transformers & Hugging Face',
          category: 'NLP & LLMs',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          score: 58,
          prerequisites: ['PyTorch & Deep Neural Nets'],
          evidence: ['Hugging Face pipeline usage in project'],
          whyNeeded: 'Self-attention, BERT embeddings, tokenizers, and LLM fine-tuning (LoRA/PEFT).',
          resources: [{ title: 'Hugging Face NLP Course', provider: 'Hugging Face', duration: '8 hours' }],
          assessmentId: 'asm-hf'
        }
      },
      {
        id: 'node-rag-llm',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 380 },
        data: {
          skillId: 'rag-llm',
          name: 'RAG, LangChain & Vector DBs',
          category: 'GenAI Applications',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['PyTorch & Deep Neural Nets'],
          evidence: ['None - Verification Required'],
          whyNeeded: 'Building retrieval-augmented generation systems with ChromaDB, Pinecone, and agent chains.',
          resources: [{ title: 'Building Applications with LLMs & LangChain', provider: 'DeepLearning.AI', duration: '5 hours' }],
          assessmentId: 'asm-rag'
        }
      },
      {
        id: 'node-mlops',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'mlops',
          name: 'MLOps, Docker & FastAPI Serving',
          category: 'Model Deployment',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Transformers & Hugging Face', 'RAG, LangChain & Vector DBs'],
          evidence: ['None'],
          whyNeeded: 'Productionizing AI endpoints, ONNX runtime, Triton server, and model latency profiling.',
          resources: [{ title: 'Production Machine Learning Systems', provider: 'Coursera', duration: '6 hours' }],
          assessmentId: 'asm-mlops'
        }
      },
      {
        id: 'node-target-ai',
        type: 'targetCareerNode',
        position: { x: 1540, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'AI & ML Engineer',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 4,
          totalSkillsCount: 9,
          coveragePercentage: 58,
          averageSalary: '₹12,00,000 – ₹22,00,000 / yr',
          topHiringCompanies: ['Google', 'OpenAI', 'NVIDIA', 'Microsoft', 'Anthropic']
        }
      }
    ],
    edges: [
      makeEdge('e-ai-math-np', 'node-python-math', 'node-numpy-pandas', false, true),
      makeEdge('e-ai-np-sk', 'node-numpy-pandas', 'node-scikit-learn', false, true),
      makeEdge('e-ai-np-dl', 'node-numpy-pandas', 'node-deep-learning', true, false),
      makeEdge('e-ai-dl-tf', 'node-deep-learning', 'node-transformers', false, false),
      makeEdge('e-ai-dl-rag', 'node-deep-learning', 'node-rag-llm', false, false),
      makeEdge('e-ai-tf-mlops', 'node-transformers', 'node-mlops', false, false),
      makeEdge('e-ai-rag-mlops', 'node-rag-llm', 'node-mlops', false, false),
      makeEdge('e-ai-mlops-target', 'node-mlops', 'node-target-ai', false, false)
    ]
  },

  'frontend-developer': {
    roleId: 'frontend-developer',
    roleTitle: 'Frontend Developer',
    targetSalary: '₹8,00,000 – ₹14,00,000 / yr',
    stats: {
      verifiedCount: 6,
      partialCount: 2,
      missingCount: 2,
      totalSkills: 10,
      coverage: 72
    },
    recommendedNextId: 'node-nextjs-fe',
    nodes: [
      {
        id: 'node-html-css',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'html-css',
          name: 'HTML5 & Modern CSS3',
          category: 'Web Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 95,
          prerequisites: ['None (Foundational)'],
          evidence: ['W3C Standards Test (95%)', 'Portfolio Projects'],
          whyNeeded: 'Semantic layouts, Flexbox/Grid, accessibility (WCAG), and responsive design.',
          resources: [{ title: 'CSS Grid & Flexbox Mastery', provider: 'Frontend Masters', duration: '6 hours' }],
          assessmentId: 'asm-html-css'
        }
      },
      {
        id: 'node-js-ts',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'javascript-ts',
          name: 'JavaScript ES6+ & TypeScript',
          category: 'Core Language',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 91,
          prerequisites: ['HTML5 & Modern CSS3'],
          evidence: ['TypeScript Project Evidence', 'JS Test (91%)'],
          whyNeeded: 'Event loop, async/await, closures, generics, and strict type safety.',
          resources: [{ title: 'Total TypeScript', provider: 'Matt Pocock', duration: '8 hours' }],
          assessmentId: 'asm-ts'
        }
      },
      {
        id: 'node-react-core',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 120 },
        data: {
          skillId: 'react',
          name: 'React.js & State Management',
          category: 'Frontend Framework',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 94,
          prerequisites: ['JavaScript ES6+ & TypeScript'],
          evidence: ['React Assessment Score (94%)', 'SkillSync Web App'],
          whyNeeded: 'Component lifecycle, custom hooks, React 19 features, and context/zustand store.',
          resources: [{ title: 'Epic React', provider: 'Kent C. Dodds', duration: '12 hours' }],
          assessmentId: 'asm-react'
        }
      },
      {
        id: 'node-tailwind-ui',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 380 },
        data: {
          skillId: 'tailwind',
          name: 'Tailwind CSS & Component UI',
          category: 'Styling & Design',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['JavaScript ES6+ & TypeScript'],
          evidence: ['SkillSync Theme Tokens Integration'],
          whyNeeded: 'Design tokens, dark mode themes, shadcn/ui patterns, and atomic styling.',
          resources: [{ title: 'Tailwind CSS in Practice', provider: 'Tailwind Labs', duration: '4 hours' }],
          assessmentId: 'asm-tailwind'
        }
      },
      {
        id: 'node-nextjs-fe',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 120 },
        data: {
          skillId: 'nextjs',
          name: 'Next.js App Router & SSR',
          category: 'Modern Fullstack UI',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 70,
          prerequisites: ['React.js & State Management'],
          evidence: ['Next.js project repository'],
          whyNeeded: 'Server Components, dynamic routing, streaming, and SEO optimization.',
          resources: [{ title: 'Next.js 15 Deep Dive', provider: 'Vercel', duration: '6 hours' }],
          assessmentId: 'asm-nextjs'
        }
      },
      {
        id: 'node-web-perf',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 380 },
        data: {
          skillId: 'web-perf',
          name: 'Web Performance & Core Vitals',
          category: 'Optimization',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          score: 60,
          prerequisites: ['Tailwind CSS & Component UI'],
          evidence: ['Lighthouse 95+ score on portfolio'],
          whyNeeded: 'LCP, INP, CLS optimization, bundle splitting, and lazy loading.',
          resources: [{ title: 'Web Vitals & Performance', provider: 'web.dev', duration: '4 hours' }],
          assessmentId: 'asm-perf'
        }
      },
      {
        id: 'node-testing-fe',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'testing-fe',
          name: 'Vitest & Playwright E2E',
          category: 'Quality Assurance',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Next.js App Router & SSR', 'Web Performance & Core Vitals'],
          evidence: ['None'],
          whyNeeded: 'Deterministic end-to-end browser tests and component unit testing.',
          resources: [{ title: 'Modern Frontend Testing', provider: 'TestingJavaScript.com', duration: '5 hours' }],
          assessmentId: 'asm-test'
        }
      },
      {
        id: 'node-target-frontend',
        type: 'targetCareerNode',
        position: { x: 1540, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'Senior Frontend Developer',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 6,
          totalSkillsCount: 10,
          coveragePercentage: 72,
          averageSalary: '₹8,00,000 – ₹14,00,000 / yr',
          topHiringCompanies: ['Vercel', 'Meta', 'Airbnb', 'Spotify', 'Razorpay']
        }
      }
    ],
    edges: [
      makeEdge('e-fe-html-js', 'node-html-css', 'node-js-ts', false, true),
      makeEdge('e-fe-js-react', 'node-js-ts', 'node-react-core', false, true),
      makeEdge('e-fe-js-tw', 'node-js-ts', 'node-tailwind-ui', false, true),
      makeEdge('e-fe-react-next', 'node-react-core', 'node-nextjs-fe', true, false),
      makeEdge('e-fe-tw-perf', 'node-tailwind-ui', 'node-web-perf', false, false),
      makeEdge('e-fe-next-test', 'node-nextjs-fe', 'node-testing-fe', false, false),
      makeEdge('e-fe-perf-test', 'node-web-perf', 'node-testing-fe', false, false),
      makeEdge('e-fe-test-target', 'node-testing-fe', 'node-target-frontend', false, false)
    ]
  },

  'devops-engineer': {
    roleId: 'devops-engineer',
    roleTitle: 'DevOps & Cloud Engineer',
    targetSalary: '₹11,00,000 – ₹19,00,000 / yr',
    stats: {
      verifiedCount: 4,
      partialCount: 2,
      missingCount: 3,
      totalSkills: 9,
      coverage: 52
    },
    recommendedNextId: 'node-docker-devops',
    nodes: [
      {
        id: 'node-linux-devops',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'linux-bash',
          name: 'Linux & Shell Scripting',
          category: 'OS Fundamentals',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['None (Foundational)'],
          evidence: ['Linux Admin Assessment (92%)'],
          whyNeeded: 'Systemd, bash automation, permissions, network tools (curl, netstat, iptables).',
          resources: [{ title: 'Linux Command Line and Shell Scripting Bible', provider: 'Wiley', duration: '8 hours' }],
          assessmentId: 'asm-linux'
        }
      },
      {
        id: 'node-git-cicd-devops',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'git-cicd',
          name: 'Git & GitHub Actions CI/CD',
          category: 'Automation',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['Linux & Shell Scripting'],
          evidence: ['Automated CI pipelines in AgriSmart & SkillSync'],
          whyNeeded: 'Automated test execution, matrix builds, release packaging and linting on push.',
          resources: [{ title: 'GitHub Actions for DevOps', provider: 'GitHub', duration: '5 hours' }],
          assessmentId: 'asm-cicd'
        }
      },
      {
        id: 'node-docker-devops',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 260 },
        data: {
          skillId: 'docker',
          name: 'Docker & Containerization',
          category: 'Containers',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 62,
          prerequisites: ['Git & GitHub Actions CI/CD'],
          evidence: ['Multi-stage Dockerfile in project'],
          whyNeeded: 'Lightweight reproducible containers, multi-stage builds, rootless security.',
          resources: [{ title: 'Docker Deep Dive', provider: 'Nigel Poulton', duration: '6 hours' }],
          assessmentId: 'docker'
        }
      },
      {
        id: 'node-k8s',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 120 },
        data: {
          skillId: 'kubernetes',
          name: 'Kubernetes & Helm Charts',
          category: 'Orchestration',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Docker & Containerization'],
          evidence: ['None - Verification Required'],
          whyNeeded: 'Deployments, StatefulSets, Ingress controllers, and Helm package management.',
          resources: [{ title: 'Certified Kubernetes Administrator (CKA)', provider: 'Linux Foundation', duration: '15 hours' }],
          assessmentId: 'asm-k8s'
        }
      },
      {
        id: 'node-terraform',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 380 },
        data: {
          skillId: 'terraform',
          name: 'Terraform & IaC',
          category: 'Infrastructure as Code',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Docker & Containerization'],
          evidence: ['None'],
          whyNeeded: 'Declarative cloud resource provisioning across AWS, GCP, and Azure.',
          resources: [{ title: 'Terraform Up & Running', provider: "O'Reilly", duration: '7 hours' }],
          assessmentId: 'asm-tf'
        }
      },
      {
        id: 'node-observability',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'observability',
          name: 'Prometheus, Grafana & Logs',
          category: 'Monitoring',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Kubernetes & Helm Charts', 'Terraform & IaC'],
          evidence: ['None'],
          whyNeeded: 'Metrics scraping, SLO/SLA alerting, distributed tracing (OpenTelemetry).',
          resources: [{ title: 'Observability Engineering', provider: "O'Reilly", duration: '6 hours' }],
          assessmentId: 'asm-obs'
        }
      },
      {
        id: 'node-target-devops',
        type: 'targetCareerNode',
        position: { x: 1540, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'DevOps & Cloud Engineer',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 4,
          totalSkillsCount: 9,
          coveragePercentage: 52,
          averageSalary: '₹11,00,000 – ₹19,00,000 / yr',
          topHiringCompanies: ['CloudScale', 'Red Hat', 'GitLab', 'Datadog', 'Infosys']
        }
      }
    ],
    edges: [
      makeEdge('e-do-lin-git', 'node-linux-devops', 'node-git-cicd-devops', false, true),
      makeEdge('e-do-git-doc', 'node-git-cicd-devops', 'node-docker-devops', true, false),
      makeEdge('e-do-doc-k8s', 'node-docker-devops', 'node-k8s', false, false),
      makeEdge('e-do-doc-tf', 'node-docker-devops', 'node-terraform', false, false),
      makeEdge('e-do-k8s-obs', 'node-k8s', 'node-observability', false, false),
      makeEdge('e-do-tf-obs', 'node-terraform', 'node-observability', false, false),
      makeEdge('e-do-obs-target', 'node-observability', 'node-target-devops', false, false)
    ]
  },

  'cloud-engineer': {
    roleId: 'cloud-engineer',
    roleTitle: 'AWS Cloud Engineer',
    targetSalary: '₹10,50,000 – ₹17,50,000 / yr',
    stats: {
      verifiedCount: 4,
      partialCount: 2,
      missingCount: 3,
      totalSkills: 9,
      coverage: 48
    },
    recommendedNextId: 'node-aws-iam',
    nodes: [
      {
        id: 'node-cld-linux',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'linux-net',
          name: 'Linux & Cloud Networking',
          category: 'Infrastructure Basics',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 90,
          prerequisites: ['None'],
          evidence: ['Linux Assessment (90%)'],
          whyNeeded: 'CIDR blocks, subnets, SSH tunneling, and routing tables.',
          resources: [{ title: 'Cloud Networking Fundamentals', provider: 'AWS', duration: '5 hours' }],
          assessmentId: 'asm-linux'
        }
      },
      {
        id: 'node-aws-iam',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'aws-iam',
          name: 'AWS IAM, EC2 & Security',
          category: 'AWS Compute & Auth',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 65,
          prerequisites: ['Linux & Cloud Networking'],
          evidence: ['AWS Developer Associate coursework'],
          whyNeeded: 'Role assumption, least-privilege policies, and auto-scaling EC2 instances.',
          resources: [{ title: 'AWS Certified Solutions Architect', provider: 'Stephane Maarek', duration: '14 hours' }],
          assessmentId: 'asm-aws-iam'
        }
      },
      {
        id: 'node-aws-vpc',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 120 },
        data: {
          skillId: 'aws-vpc',
          name: 'AWS VPC, NAT & Route53',
          category: 'AWS Networking',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['AWS IAM, EC2 & Security'],
          evidence: ['None - Verification Required'],
          whyNeeded: 'Isolated private/public subnets, internet gateways, and DNS routing.',
          resources: [{ title: 'AWS VPC Masterclass', provider: 'AWS Documentation', duration: '6 hours' }],
          assessmentId: 'asm-vpc'
        }
      },
      {
        id: 'node-aws-storage',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 380 },
        data: {
          skillId: 'aws-storage',
          name: 'S3, RDS & DynamoDB',
          category: 'AWS Persistence',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          score: 58,
          prerequisites: ['AWS IAM, EC2 & Security'],
          evidence: ['S3 bucket integration in AgriSmart'],
          whyNeeded: 'Object storage lifecycles, managed PostgreSQL RDS, and NoSQL key-value scaling.',
          resources: [{ title: 'AWS Databases in Depth', provider: 'A Cloud Guru', duration: '6 hours' }],
          assessmentId: 'asm-aws-db'
        }
      },
      {
        id: 'node-serverless-cld',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 260 },
        data: {
          skillId: 'serverless',
          name: 'AWS Lambda & API Gateway',
          category: 'Serverless',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['AWS VPC, NAT & Route53', 'S3, RDS & DynamoDB'],
          evidence: ['None'],
          whyNeeded: 'Event-driven serverless architectures, concurrency limits, and cold start tuning.',
          resources: [{ title: 'Serverless Architectures on AWS', provider: 'Manning', duration: '7 hours' }],
          assessmentId: 'asm-lambda'
        }
      },
      {
        id: 'node-target-cloud',
        type: 'targetCareerNode',
        position: { x: 1240, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'AWS Solutions Architect',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 4,
          totalSkillsCount: 9,
          coveragePercentage: 48,
          averageSalary: '₹10,50,000 – ₹17,50,000 / yr',
          topHiringCompanies: ['Amazon', 'Accenture', 'TCS', 'Wipro', 'Cognizant']
        }
      }
    ],
    edges: [
      makeEdge('e-cld-lin-iam', 'node-cld-linux', 'node-aws-iam', true, false),
      makeEdge('e-cld-iam-vpc', 'node-aws-iam', 'node-aws-vpc', false, false),
      makeEdge('e-cld-iam-stg', 'node-aws-iam', 'node-aws-storage', false, false),
      makeEdge('e-cld-vpc-srv', 'node-aws-vpc', 'node-serverless-cld', false, false),
      makeEdge('e-cld-stg-srv', 'node-aws-storage', 'node-serverless-cld', false, false),
      makeEdge('e-cld-srv-target', 'node-serverless-cld', 'node-target-cloud', false, false)
    ]
  },

  'cybersecurity-analyst': {
    roleId: 'cybersecurity-analyst',
    roleTitle: 'Cyber Security Analyst',
    targetSalary: '₹9,00,000 – ₹16,00,000 / yr',
    stats: {
      verifiedCount: 4,
      partialCount: 2,
      missingCount: 3,
      totalSkills: 9,
      coverage: 50
    },
    recommendedNextId: 'node-siem-tools',
    nodes: [
      {
        id: 'node-sec-net',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'sec-net',
          name: 'Network Protocols & Wireshark',
          category: 'Security Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 91,
          prerequisites: ['None (Foundational)'],
          evidence: ['Network Security Assessment Pass (91%)'],
          whyNeeded: 'TCP/IP handshake, packet capture analysis, DNS poisoning, and firewall rules.',
          resources: [{ title: 'Wireshark Network Analysis', provider: 'Wireshark University', duration: '6 hours' }],
          assessmentId: 'asm-wireshark'
        }
      },
      {
        id: 'node-linux-sec',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'linux-sec',
          name: 'Linux Hardening & OS Security',
          category: 'System Defense',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['Network Protocols & Wireshark'],
          evidence: ['Linux Hardening Project on GitHub'],
          whyNeeded: 'SELinux, file permissions, auditd logging, and SSH key management.',
          resources: [{ title: 'Practical Linux Security Cookbook', provider: 'Packt', duration: '5 hours' }],
          assessmentId: 'asm-linux'
        }
      },
      {
        id: 'node-siem-tools',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 120 },
        data: {
          skillId: 'siem',
          name: 'SIEM & SOC Log Analysis (Splunk)',
          category: 'Security Operations',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 62,
          prerequisites: ['Linux Hardening & OS Security'],
          evidence: ['Splunk Fundamentals Certificate'],
          whyNeeded: 'Querying event logs, correlating attack vectors, and triggering automated alerts.',
          resources: [{ title: 'Splunk Core Certified Power User', provider: 'Splunk', duration: '8 hours' }],
          assessmentId: 'asm-splunk'
        }
      },
      {
        id: 'node-vuln-scan',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 380 },
        data: {
          skillId: 'vuln-scan',
          name: 'Vulnerability Assessment (Nmap/Nessus)',
          category: 'Vulnerability Management',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Linux Hardening & OS Security'],
          evidence: ['None - Verification Required'],
          whyNeeded: 'CVE identification, CVSS score scoring, and remediation patch planning.',
          resources: [{ title: 'Vulnerability Management Essentials', provider: 'SANS', duration: '6 hours' }],
          assessmentId: 'asm-nessus'
        }
      },
      {
        id: 'node-incident-resp',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 260 },
        data: {
          skillId: 'incident-resp',
          name: 'Incident Response & Threat Hunting',
          category: 'Threat Defense',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['SIEM & SOC Log Analysis (Splunk)', 'Vulnerability Assessment'],
          evidence: ['None'],
          whyNeeded: 'MITRE ATT&CK framework mapping, containment strategies, and post-mortem analysis.',
          resources: [{ title: 'Blue Team Handbook: Incident Response Edition', provider: 'Don Murdoch', duration: '8 hours' }],
          assessmentId: 'asm-ir'
        }
      },
      {
        id: 'node-target-cybersec',
        type: 'targetCareerNode',
        position: { x: 1240, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'Cyber Security Analyst',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 4,
          totalSkillsCount: 9,
          coveragePercentage: 50,
          averageSalary: '₹9,00,000 – ₹16,00,000 / yr',
          topHiringCompanies: ['Palo Alto Networks', 'CrowdStrike', 'Cisco', 'KPMG', 'TCS']
        }
      }
    ],
    edges: [
      makeEdge('e-sec-net-lin', 'node-sec-net', 'node-linux-sec', false, true),
      makeEdge('e-sec-lin-siem', 'node-linux-sec', 'node-siem-tools', true, false),
      makeEdge('e-sec-lin-vuln', 'node-linux-sec', 'node-vuln-scan', false, false),
      makeEdge('e-sec-siem-ir', 'node-siem-tools', 'node-incident-resp', false, false),
      makeEdge('e-sec-vuln-ir', 'node-vuln-scan', 'node-incident-resp', false, false),
      makeEdge('e-sec-ir-target', 'node-incident-resp', 'node-target-cybersec', false, false)
    ]
  },

  'ios-developer': {
    roleId: 'ios-developer',
    roleTitle: 'iOS Developer',
    targetSalary: '₹9,00,000 – ₹16,50,000 / yr',
    stats: {
      verifiedCount: 4,
      partialCount: 2,
      missingCount: 3,
      totalSkills: 9,
      coverage: 52
    },
    recommendedNextId: 'node-swiftui-core',
    nodes: [
      {
        id: 'node-swift-basics',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'swift',
          name: 'Swift Syntax & Language Core',
          category: 'Language Core',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 90,
          prerequisites: ['None (Foundational)'],
          evidence: ['Swift Assessment Score: 90%'],
          whyNeeded: 'Optionials, closures, structs vs classes, protocols, and ARC memory management.',
          resources: [{ title: 'The Swift Programming Language', provider: 'Apple Docs', duration: '8 hours' }],
          assessmentId: 'asm-swift'
        }
      },
      {
        id: 'node-swiftui-core',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'swiftui',
          name: 'SwiftUI & Declarative Architecture',
          category: 'UI Framework',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 68,
          prerequisites: ['Swift Syntax & Language Core'],
          evidence: ['iOS Sample App repository on GitHub'],
          whyNeeded: '@State, @Binding, @Observable, ViewBuilder, and fluid mobile animations.',
          resources: [{ title: '100 Days of SwiftUI', provider: 'Paul Hudson (Hacking with Swift)', duration: '20 hours' }],
          assessmentId: 'asm-swiftui'
        }
      },
      {
        id: 'node-swift-concurrency',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 120 },
        data: {
          skillId: 'swift-concurrency',
          name: 'Modern Swift Concurrency (async/await)',
          category: 'Concurrency',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['SwiftUI & Declarative Architecture'],
          evidence: ['None - Verification Required'],
          whyNeeded: 'Actors, MainActor UI dispatching, Task groups, and structured concurrency.',
          resources: [{ title: 'Swift Concurrency by Tutorials', provider: 'Kodeco', duration: '6 hours' }],
          assessmentId: 'asm-concurrency'
        }
      },
      {
        id: 'node-swiftdata',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 380 },
        data: {
          skillId: 'swiftdata',
          name: 'SwiftData & Persistence',
          category: 'Mobile Storage',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['SwiftUI & Declarative Architecture'],
          evidence: ['None'],
          whyNeeded: 'Schema modeling, predicates, CloudKit sync, and offline persistence.',
          resources: [{ title: 'Working with SwiftData', provider: 'Apple Developer', duration: '5 hours' }],
          assessmentId: 'asm-swiftdata'
        }
      },
      {
        id: 'node-target-ios',
        type: 'targetCareerNode',
        position: { x: 940, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'Senior iOS Developer',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 4,
          totalSkillsCount: 9,
          coveragePercentage: 52,
          averageSalary: '₹9,00,000 – ₹16,50,000 / yr',
          topHiringCompanies: ['Apple', 'Zomato', 'CRED', 'Uber', 'Paytm']
        }
      }
    ],
    edges: [
      makeEdge('e-ios-sw-ui', 'node-swift-basics', 'node-swiftui-core', true, false),
      makeEdge('e-ios-ui-async', 'node-swiftui-core', 'node-swift-concurrency', false, false),
      makeEdge('e-ios-ui-data', 'node-swiftui-core', 'node-swiftdata', false, false),
      makeEdge('e-ios-async-target', 'node-swift-concurrency', 'node-target-ios', false, false),
      makeEdge('e-ios-data-target', 'node-swiftdata', 'node-target-ios', false, false)
    ]
  },

  'blockchain-developer': {
    roleId: 'blockchain-developer',
    roleTitle: 'Blockchain Developer',
    targetSalary: '₹11,00,000 – ₹20,00,000 / yr',
    stats: {
      verifiedCount: 3,
      partialCount: 2,
      missingCount: 4,
      totalSkills: 9,
      coverage: 46
    },
    recommendedNextId: 'node-solidity-core',
    nodes: [
      {
        id: 'node-crypto-basics',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'crypto-basics',
          name: 'Cryptography & Consensus',
          category: 'Web3 Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['None (Foundational)'],
          evidence: ['Cryptography University Pass (88%)'],
          whyNeeded: 'Elliptic curve signatures (ECDSA), SHA256/Keccak, and Proof-of-Stake consensus.',
          resources: [{ title: 'Mastering Bitcoin & Ethereum', provider: "O'Reilly", duration: '10 hours' }],
          assessmentId: 'asm-crypto'
        }
      },
      {
        id: 'node-solidity-core',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'solidity',
          name: 'Solidity & EVM Smart Contracts',
          category: 'Smart Contracts',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 64,
          prerequisites: ['Cryptography & Consensus'],
          evidence: ['ERC-20 token contract on Sepolia testnet'],
          whyNeeded: 'Gas optimization, reentrancy guards, memory vs storage, and OpenZeppelin contracts.',
          resources: [{ title: 'Cyfrin Updraft Solidity Masterclass', provider: 'Patrick Collins', duration: '15 hours' }],
          assessmentId: 'asm-solidity'
        }
      },
      {
        id: 'node-foundry',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 120 },
        data: {
          skillId: 'foundry',
          name: 'Foundry & Hardhat Testing',
          category: 'Development Suite',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Solidity & EVM Smart Contracts'],
          evidence: ['None - Verification Required'],
          whyNeeded: 'Fuzz testing, invariant tests, contract deployment scripts, and gas profiling.',
          resources: [{ title: 'Foundry Book & Testing Guide', provider: 'Paradigm', duration: '6 hours' }],
          assessmentId: 'asm-foundry'
        }
      },
      {
        id: 'node-web3-frontend',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 380 },
        data: {
          skillId: 'ethers-viem',
          name: 'Viem, Wagmi & DApp Frontends',
          category: 'DApp Integration',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          score: 58,
          prerequisites: ['Solidity & EVM Smart Contracts'],
          evidence: ['WalletConnect integration in GitHub repo'],
          whyNeeded: 'EIP-1193 wallet providers, transaction signing, and contract event subscriptions.',
          resources: [{ title: 'Building Fullstack Web3 DApps', provider: 'Scaffold-ETH 2', duration: '6 hours' }],
          assessmentId: 'asm-web3'
        }
      },
      {
        id: 'node-target-blockchain',
        type: 'targetCareerNode',
        position: { x: 940, y: 240 },
        data: {
          skillId: 'target-career',
          title: 'Senior Web3 & Smart Contract Developer',
          subtitle: 'Target Career Goal',
          verifiedSkillsCount: 3,
          totalSkillsCount: 9,
          coveragePercentage: 46,
          averageSalary: '₹11,00,000 – ₹20,00,000 / yr',
          topHiringCompanies: ['Polygon', 'ConsenSys', 'Coinbase', 'Binance', 'Chainlink']
        }
      }
    ],
    edges: [
      makeEdge('e-bc-cr-sol', 'node-crypto-basics', 'node-solidity-core', true, false),
      makeEdge('e-bc-sol-fd', 'node-solidity-core', 'node-foundry', false, false),
      makeEdge('e-bc-sol-w3', 'node-solidity-core', 'node-web3-frontend', false, false),
      makeEdge('e-bc-fd-target', 'node-foundry', 'node-target-blockchain', false, false),
      makeEdge('e-bc-w3-target', 'node-web3-frontend', 'node-target-blockchain', false, false)
    ]
  }
};
