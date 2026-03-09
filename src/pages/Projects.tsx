import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Scene3DSimple from "@/components/Scene3DSimple";
import SEO from "@/components/SEO";

const projects = [
  {
    title: "NADRA Citizen Services Portal",
    description:
      "Automated government service delivery platform reducing processing time by 60% through intelligent ticket management. Designed 12-table normalized database with 13 strategic indexes reducing query time by 70%.",
    details: [
      "Multi-role authentication (USER/AGENT/ADMIN) with OTP verification & rate limiting",
      "Smart load-balancing algorithm for automatic agent assignment",
      "Payment system with idempotency protection & 4-stage delivery tracking",
      "Bilingual AI chatbot (English/Urdu) using Flask + Hugging Face API",
    ],
    tags: ["Next.js", "React", "Prisma", "MySQL", "Flask", "Hugging Face"],
    github: "https://github.com/umerkhan-12",
  },
  {
    title: "Voice Assistant AI",
    description:
      "Hands-free voice-controlled assistant for task automation with 95% speech recognition accuracy. Integrates speech-to-text and text-to-speech with natural voice synthesis.",
    details: [
      "Built with Python, SpeechRecognition, and Edge TTS",
      "Interactive Tkinter GUI with event-driven architecture",
      "Supports 10+ commands: web search, time/date, app launching",
    ],
    tags: ["Python", "SpeechRecognition", "Edge TTS", "Tkinter"],
    github: "https://github.com/umerkhan-12",
  },
  {
    title: "Spotify Clone",
    description:
      "Pixel-perfect Spotify UI replica demonstrating advanced frontend skills without frameworks. 100% mobile responsive with DOM manipulation and Audio API.",
    details: [
      "Custom audio controls, progress bar, and volume slider",
      "Dynamic playlist system with smooth animations",
      "CSS Grid/Flexbox responsive layout",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Audio API"],
    github: "https://github.com/umerkhan-12",
  },
  {
    title: "Query Quest — PROCOM 2026",
    description:
      "Competitive SQL learning game platform developed for the national computing olympiad. Gamified SQL challenges for students to practice and compete.",
    details: [
      "Built for PROCOM 2026 national computing olympiad",
      "Interactive SQL query challenges with real-time feedback",
    ],
    tags: ["Web Development", "SQL", "Gamification"],
    github: "https://github.com/umerkhan-12",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-lg border border-border bg-card overflow-hidden card-hover group"
    >
      {/* Top accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-primary to-accent" />

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

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO 
        title="Projects" 
        description="Explore my portfolio of web development projects including NADRA Citizen Services Portal, Voice Assistant AI, Spotify Clone, and more. Built with React, Next.js, Node.js, and AI/ML technologies."
        keywords="Projects, Portfolio, Web Development, React Projects, Next.js Projects, Full-Stack Projects"
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
            A selection of projects showcasing my expertise in full-stack development, 
            database design, and building scalable applications.
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
