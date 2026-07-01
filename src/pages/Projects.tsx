import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github, ArrowRight, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Scene3DSimple from "@/components/Scene3DSimple";
import SEO from "@/components/SEO";

interface Project {
  title: string;
  description: string;
  details: string[];
  tags: string[];
  github: string;
  youtube?: string;
  demo?: string;
}

const projects: Project[] = [
  {
    title: "OMR.AI — Agentic AI Personal Assistant",
    description:
      "A fully agentic AI personal assistant built on n8n with a custom Python/Streamlit frontend. OMR.AI connects Gmail, Google Calendar, Google Docs, and job search APIs through intelligent multi-step workflows — designed as a real productivity tool, not a demo.",
    details: [
      "Multi-step agentic workflows orchestrated via n8n",
      "Claude API integration with tool-calling and memory",
      "Daily automated job-matching pipeline with AI-generated draft emails",
      "Gmail, Google Calendar & Google Docs connected through secure APIs",
      "Telegram notification system for real-time updates",
      "Custom Streamlit frontend for conversational user interface",
      "OpenRouter integration for model fallback management",
    ],
    tags: ["n8n", "Claude API", "Python", "Streamlit", "Gmail API", "Google Calendar", "Telegram", "OpenRouter"],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_ai-automation-n8n-ugcPost-7477780554365616128-55rC/",
  },
  {
    title: "NADRA Citizen Services Portal",
    description:
      "Enterprise-grade government service delivery platform that reduced processing time by 60% through intelligent ticket management and automated agent assignment.",
    details: [
      "Architected 12-table normalized database with Prisma ORM, complex relationships & cascade operations",
      "Optimized performance with 13 strategic indexes — reduced query time by 70%",
      "Multi-role authentication (USER/AGENT/ADMIN) with OTP verification & rate limiting",
      "Smart load-balancing algorithm for automatic agent assignment based on workload",
      "Payment system with idempotency protection & 4-stage delivery tracking with email notifications",
      "Bilingual AI chatbot (English/Urdu) powered by Flask + Hugging Face API",
    ],
    tags: ["Next.js", "React", "Prisma", "MySQL", "NextAuth", "Flask", "Hugging Face"],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_fullstackdeveloper-javascript-typescript-ugcPost-7407316108757733376-9lDM/",
  },
  {
    title: "Voice Assistant AI",
    description:
      "Intelligent voice-controlled assistant achieving 95% speech recognition accuracy for hands-free task automation with natural voice synthesis.",
    details: [
      "Integrated speech-to-text and text-to-speech with natural voice synthesis",
      "Built interactive Tkinter GUI with event-driven architecture for async inputs",
      "Supports 10+ commands: web search, time/date queries, and application launching",
    ],
    tags: ["Python", "SpeechRecognition", "Edge TTS", "Tkinter"],
    github: "https://github.com/umerkhan-12",
    youtube: "https://www.youtube.com/embed/MiIJ-227GgI?autoplay=1&mute=1&start=5&rel=0",
  },
  {
    title: "Spotify Clone",
    description:
      "Pixel-perfect Spotify UI replica built entirely with vanilla technologies — demonstrating advanced frontend skills without relying on frameworks.",
    details: [
      "Custom audio controls with progress bar and volume slider",
      "Dynamic playlist system with smooth CSS animations",
      "100% mobile responsive layout using CSS Grid/Flexbox and Audio API",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Audio API"],
    github: "https://github.com/umerkhan-12",
  },
  {
    title: "PassMag — Password Manager",
    description:
      "Secure local-first password management tool with full CRUD operations, real-time UI updates, and a polished responsive interface.",
    details: [
      "Complete CRUD system with real-time UI updates and toast notifications",
      "Password visibility toggle, search/filter, and copy-to-clipboard functionality",
      "Client-side persistence using Local Storage API — zero external dependencies",
    ],
    tags: ["React", "Express.js", "Tailwind CSS", "Local Storage API"],
    github: "https://github.com/umerkhan-12",
    youtube: "https://www.youtube.com/embed/gPom3ioTWRE?autoplay=1&mute=1&rel=0",
  },
  {
    title: "Query Quest — PROCOM 2026",
    description:
      "Competitive SQL learning game platform developed for a national computing olympiad — gamified challenges with real-time scoring and leaderboards.",
    details: [
      "Built for PROCOM 2026 national computing olympiad",
      "Interactive SQL query challenges with real-time feedback and scoring",
    ],
    tags: ["Web Development", "SQL", "Gamification"],
    github: "https://github.com/umerkhan-12",
  },
  {
    title: "Palindrome Checker",
    description:
      "Educational GUI tool for verifying palindrome strings using both recursive and iterative algorithms with visual feedback.",
    details: [
      "Case-insensitive checking with input validation and color-coded results",
      "Event-driven programming with an intuitive Tkinter interface",
    ],
    tags: ["Python", "Tkinter", "Algorithms"],
    github: "https://github.com/umerkhan-12",
  },
];

function getYoutubeId(url: string): string | null {
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [isHovered, setIsHovered] = useState(false);
  const youtubeId = project.youtube ? getYoutubeId(project.youtube) : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-lg border border-border bg-card/80 backdrop-blur-sm overflow-hidden card-hover group"
    >
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary to-accent" />

      {/* YouTube preview: thumbnail by default, iframe on hover */}
      {project.youtube && (
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          {youtubeId && (
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
              }}
              alt={`${project.title} thumbnail`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <AnimatePresence>
            {isHovered && (
              <motion.iframe
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={project.youtube}
                title={`${project.title} demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full z-10"
              />
            )}
          </AnimatePresence>
          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
                </div>
                <p className="text-xs font-mono text-white/90">Hover to preview demo</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors shrink-0 ml-4"
          >
            <Github size={18} />
          </a>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        <ul className="space-y-2 mb-5">
          {project.details.map((d, i) => (
            <li key={i} className="flex gap-2 text-xs text-muted-foreground">
              <ArrowRight size={12} className="text-primary shrink-0 mt-0.5" />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Play size={16} />
            Watch Demo
            <ExternalLink size={14} className="opacity-70" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO 
        title="Projects" 
        description="Explore my portfolio of production-ready web applications including NADRA Citizen Services Portal, Voice Assistant AI, PassMag Password Manager, and more."
        keywords="Projects, Portfolio, Web Development, React, Next.js, Full-Stack, Python"
      />
      <Scene3DSimple />
      <Navbar />

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary mb-3 tracking-wider">// projects</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Production-ready applications showcasing expertise in full-stack architecture, 
            database optimization, and scalable system design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
