/**
 * Single source of truth for everything the site says about Umer.
 *
 * Every field here is transcribed from the résumé (Umer_Khan_Elevance.pdf).
 * Pages read from this file — when the résumé changes, change it here only.
 */

export const profile = {
  name: "Umer Khan",
  firstName: "Umer",
  lastName: "Khan",
  location: "Karachi, PK",
  email: "khaankhattack321@gmail.com",
  phone: "+92 330-8696449",
  github: "https://github.com/umerkhan-12",
  linkedin: "https://linkedin.com/in/umer-khan10",
  status: "Data Annotation Intern @ Vidizmo.AI",
  tagline: "Full-Stack Developer & AI Engineer",
  summary:
    "Full-stack developer and AI engineer with a product-first, MVP mindset — currently shipping CliniBot, a commercial WhatsApp SaaS for dental clinics, while interning at Vidizmo.AI.",
  longSummary:
    "I take digital transformation ideas from zero to one for small and medium businesses: designing architecture, building production-grade backends with NestJS, Node.js and PostgreSQL, integrating AI and third-party APIs, and deploying to live environments. I work the full startup cycle — rapid prototyping, scalable design, and hands-on ownership with minimal guidance.",
};

export const roles = [
  "Full-Stack Developer",
  "AI Engineer",
  "Backend Architect",
  "Product Builder",
];

export const experience = [
  {
    role: "Data Annotation Intern",
    company: "Vidizmo.AI",
    parent: "Softech Worldwide",
    period: "Aug 2026 — Present",
    mode: "Remote",
    current: true,
    points: [
      "Annotating video and image datasets using CVAT for AI model training pipelines.",
      "Object detection, segmentation, and classification labeling supporting computer vision and NLP tasks.",
    ],
    stack: ["CVAT", "Computer Vision", "NLP", "Data Annotation"],
  },
];

export const education = [
  {
    degree: "BS Computer Science",
    school: "FAST NUCES, Karachi",
    year: "2023 — 2027 (Expected)",
    detail: "7th Semester",
    coursework: [
      "Data Structures & Algorithms",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "OOP",
      "Deep Learning",
      "FSPM (Agile/Scrum)",
    ],
  },
  {
    degree: "Intermediate — Pre-Engineering",
    school: "Adamjee Govt. Science College",
    year: "2021 — 2023",
    detail: "84%",
    coursework: [],
  },
];

/** `span` drives the bento grid weighting on the home page. */
export const skills = [
  {
    category: "AI & Automation",
    span: "md:col-span-2 lg:col-span-2 lg:row-span-2",
    items: [
      "Claude API",
      "n8n (Agentic Workflows)",
      "LangChain",
      "LangGraph",
      "RAG",
      "Prompt Engineering",
      "Hugging Face API",
      "OpenRouter",
      "CVAT",
    ],
  },
  {
    category: "Backend",
    span: "md:col-span-2 lg:col-span-2",
    items: ["Node.js", "Express.js", "NestJS", "Flask", "RESTful APIs", "JWT", "NextAuth"],
  },
  {
    category: "Databases",
    span: "md:col-span-2 lg:col-span-2",
    items: [
      "PostgreSQL",
      "MySQL 8",
      "MongoDB",
      "Prisma ORM",
      "Query Optimization",
      "Indexing",
      "Transactions",
    ],
  },
  {
    category: "Frontend",
    span: "md:col-span-2 lg:col-span-2",
    items: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "Responsive Design"],
  },
  {
    category: "Languages",
    span: "md:col-span-1 lg:col-span-1",
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "C/C++", "SQL"],
  },
  {
    category: "Tools & Infra",
    span: "md:col-span-1 lg:col-span-3",
    items: [
      "Git/GitHub",
      "DigitalOcean",
      "Vercel",
      "Heroku",
      "PM2",
      "Docker",
      "Postman",
      "Streamlit",
      "Nodemailer",
    ],
  },
];

export const allTech = Array.from(new Set(skills.flatMap((g) => g.items)));

export type Project = {
  title: string;
  subtitle: string;
  flagship?: boolean;
  description: string;
  details: string[];
  tags: string[];
  plan: { label: string; value: string }[];
  github: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    title: "CliniBot",
    subtitle: "WhatsApp Appointment Booking SaaS — MVP → Commercial",
    flagship: true,
    description:
      "Built from scratch for the dental clinic SMB market. Patients book appointments over WhatsApp autonomously in Roman Urdu or English — a full digital transformation of a manual process. Now in commercial pilot with clinics across Karachi.",
    details: [
      "Multi-tenant NestJS backend with PostgreSQL and Prisma ORM",
      "WAHA for WhatsApp Business automation",
      "Google Calendar API for live slot management",
      "Next.js receptionist dashboard — owned end to end",
    ],
    tags: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "n8n", "WAHA", "Next.js", "DigitalOcean"],
    plan: [
      { label: "stage", value: "commercial pilot" },
      { label: "market", value: "dental SMB" },
      { label: "languages", value: "Urdu / English" },
    ],
    github: "https://github.com/umerkhan-12",
  },
  {
    title: "OMR.AI",
    subtitle: "Agentic AI Personal Assistant",
    description:
      "An AI assistant connecting Gmail, Calendar, and job APIs through n8n multi-step tool-calling workflows. Built to solve a real personal productivity problem — from ideation to deployed product.",
    details: [
      "Multi-step tool-calling workflows orchestrated in n8n",
      "Gmail, Google Calendar, and Telegram integrations",
      "Streamlit front end over OpenRouter and Claude API",
    ],
    tags: ["n8n", "Claude API", "Gmail API", "Google Calendar", "Telegram", "Streamlit", "OpenRouter"],
    plan: [
      { label: "services chained", value: "4" },
      { label: "orchestration", value: "n8n" },
    ],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_ai-automation-n8n-ugcPost-7477780554365616128-55rC/",
  },
  {
    title: "NADRA Citizen Services Portal",
    subtitle: "Government-scale digital transformation",
    description:
      "A government service delivery platform that cut processing time by 60% through intelligent ticket management, multi-role authentication, and a bilingual AI chatbot for citizen support.",
    details: [
      "Multi-role auth — JWT, OTP verification, and RBAC",
      "Smart agent load-balancing for automatic assignment",
      "Payment system with idempotency protection",
      "Bilingual AI chatbot (English/Urdu) via Flask + Hugging Face",
    ],
    tags: ["Next.js", "React", "Node.js", "Prisma ORM", "MySQL", "Flask", "Hugging Face API"],
    plan: [
      { label: "processing time", value: "-60%" },
      { label: "auth roles", value: "3" },
      { label: "chatbot languages", value: "2" },
    ],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_fullstackdeveloper-javascript-typescript-ugcPost-7407316108757733376-9lDM/",
  },
  {
    title: "Voice Assistant AI",
    subtitle: "Desktop automation assistant",
    description:
      "A hands-free voice-controlled assistant for task automation, with real-time text-to-speech output and natural voice synthesis.",
    details: [
      "95% speech recognition accuracy",
      "10+ voice commands including web search and app launching",
      "Interactive Tkinter GUI with event-driven architecture",
    ],
    tags: ["Python", "SpeechRecognition", "Edge TTS", "Tkinter"],
    plan: [
      { label: "recognition accuracy", value: "95%" },
      { label: "voice commands", value: "10+" },
    ],
    github: "https://github.com/umerkhan-12",
  },
];

export const achievements = [
  {
    title: "Co-Head, Software Engineering Competition",
    context: "Dev Day 2026",
    detail:
      "Ran technical evaluation for 100+ participants across 4 competition modules with external API integrations.",
  },
  {
    title: "Query Quest — PROCOM 2026",
    context: "National computing olympiad",
    detail:
      "Built a competitive SQL-learning platform used by 200+ participants, on React, Node.js, MySQL and RapidAPI.",
  },
];

/** Headline numbers for the hero strip — each traceable to a line in the résumé. */
export const stats: {
  label: string;
  value: string;
  count?: number;
  suffix?: string;
}[] = [
  { label: "Processing time cut", value: "60%", count: 60, suffix: "%" },
  { label: "Competition users", value: "200+", count: 200, suffix: "+" },
  { label: "Speech accuracy", value: "95%", count: 95, suffix: "%" },
  { label: "CliniBot", value: "In pilot" },
];
