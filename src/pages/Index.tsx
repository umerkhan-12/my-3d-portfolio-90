import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Github, Linkedin, Mail, Code2, GraduationCap, Award, ExternalLink,
  Send, MapPin, Phone, Sparkles, Rocket, Target, Users, Server, Database,
  Terminal, ShieldCheck, Wrench, type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";
import ScrollCue from "@/components/ScrollCue";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SEO from "@/components/SEO";
import SectionHeader from "@/components/SectionHeader";
import SpotlightCard from "@/components/SpotlightCard";
import QueryPlan from "@/components/QueryPlan";
import Marquee from "@/components/Marquee";
import CountUp from "@/components/CountUp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Bento cells. `span` drives the grid weighting, so the section reads as
 * composed rather than as a uniform loop.
 */
const skills = [
  {
    category: "AI & Automation",
    icon: Sparkles,
    span: "md:col-span-2 lg:col-span-2 lg:row-span-2",
    items: ["LLM", "Gen AI", "Automation", "Agentic Workflow", "n8n", "Claude API"],
  },
  {
    category: "Backend",
    icon: Server,
    span: "md:col-span-2 lg:col-span-2",
    items: ["Node.js", "Express.js", "Flask", "REST APIs", "JWT"],
  },
  {
    category: "Frontend",
    icon: Code2,
    span: "md:col-span-2 lg:col-span-2",
    items: ["React 19", "Next.js 16", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  {
    category: "Database",
    icon: Database,
    span: "md:col-span-1 lg:col-span-2",
    items: ["MySQL 8", "MongoDB", "Prisma ORM"],
  },
  {
    category: "Languages",
    icon: Terminal,
    span: "md:col-span-1 lg:col-span-1",
    items: ["JavaScript", "TypeScript", "Python", "C/C++", "SQL"],
  },
  {
    category: "Security",
    icon: ShieldCheck,
    span: "md:col-span-1 lg:col-span-1",
    items: ["NextAuth.js", "bcrypt", "OTP", "RBAC", "Rate Limiting"],
  },
  {
    category: "Tools",
    icon: Wrench,
    span: "md:col-span-1 lg:col-span-2",
    items: ["Git", "Docker", "Vite", "Postman", "VS Code"],
  },
];

const roles = [
  "Full-Stack Developer",
  "Database Architect",
  "AI/ML Enthusiast",
  "Problem Solver",
];

/** Flat list for the ticker — no technology that is not already listed above. */
const allTech = Array.from(new Set(skills.flatMap((group) => group.items)));

const projects = [
  {
    title: "OMR.AI — Agentic AI Personal Assistant",
    description: "A fully agentic AI personal assistant built on n8n with a custom Python/Streamlit frontend. Connects Gmail, Google Calendar, Google Docs, and job search APIs through intelligent multi-step workflows.",
    tags: ["n8n", "Claude API", "Python", "Streamlit", "OpenRouter"],
    plan: [
      { label: "services chained", value: "4" },
      { label: "orchestration", value: "n8n" },
    ],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_ai-automation-n8n-ugcPost-7477780554365616128-55rC/",
    highlights: "Agentic AI • n8n workflows • Claude API • Streamlit UI"
  },
  {
    title: "NADRA Citizen Services Portal",
    description: "Enterprise-grade government platform that reduced processing time by 60% with intelligent ticket management, multi-role auth, and bilingual AI chatbot.",
    tags: ["Next.js", "Prisma", "MySQL", "Flask", "AI"],
    plan: [
      { label: "processing time", value: "-60%" },
      { label: "normalized tables", value: "12" },
      { label: "chatbot languages", value: "2" },
    ],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_fullstackdeveloper-javascript-typescript-ugcPost-7407316108757733376-9lDM/",
    highlights: "60% faster processing • 12-table DB • Bilingual AI chatbot"
  },
  {
    title: "Voice Assistant AI",
    description: "Hands-free voice-controlled assistant achieving 95% speech recognition accuracy. Supports 10+ commands with natural voice synthesis.",
    tags: ["Python", "SpeechRecognition", "Edge TTS"],
    plan: [
      { label: "recognition accuracy", value: "95%" },
      { label: "supported commands", value: "10+" },
    ],
    github: "https://github.com/umerkhan-12",
    highlights: "95% accuracy • 10+ commands • Natural voice synthesis"
  },
  {
    title: "PassMag — Password Manager",
    description: "Secure local-first password management tool with full CRUD, real-time updates, search/filter, and copy-to-clipboard — zero external dependencies.",
    tags: ["React", "Express.js", "Tailwind CSS"],
    plan: [
      { label: "storage", value: "local-first" },
      { label: "external deps", value: "0" },
    ],
    github: "https://github.com/umerkhan-12",
    highlights: "Full CRUD • Local-first • Zero dependencies"
  },
  {
    title: "Spotify Clone",
    description: "Pixel-perfect Spotify replica with custom audio controls, dynamic playlists, and 100% mobile responsive design — built without frameworks.",
    tags: ["HTML", "CSS", "JavaScript", "Audio API"],
    plan: [
      { label: "mobile responsive", value: "100%" },
      { label: "frameworks used", value: "0" },
    ],
    github: "https://github.com/umerkhan-12",
    highlights: "Pixel-perfect UI • Custom audio • 100% responsive"
  },
];

const stats: {
  icon: LucideIcon;
  label: string;
  value: string;
  count?: number;
  suffix?: string;
}[] = [
  { icon: Code2, label: "Projects Built", value: "15+", count: 15, suffix: "+" },
  { icon: Award, label: "GitHub Contributions", value: "500+", count: 500, suffix: "+" },
  { icon: Users, label: "Open Source", value: "Active" },
  { icon: Rocket, label: "Learning", value: "Always" },
];

export default function Index() {
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const skillsInView = useInView(skillsRef, { once: true, margin: "-100px" });
  const projectsInView = useInView(projectsRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });

  const [currentRole, setCurrentRole] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="main" className="relative min-h-screen overflow-x-hidden">
      <SEO 
        title="Home" 
        description="Umer Khan — Full-Stack Developer specializing in React, Next.js, Node.js, and AI/ML. Building production-ready applications with modern technologies."
        keywords="Umer Khan, Portfolio, Full-Stack Developer, React, Next.js, Python"
      />

      {/* Ambient atmosphere */}

      {/* Global 3D Background */}
      
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden">
        {/* Video - Top on mobile, Left on desktop */}
        <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-auto lg:min-h-screen lg:p-6 lg:pt-28">
          <div className="relative h-full w-full overflow-hidden bg-gradient-surface lg:rounded-3xl lg:shadow-lg">
            {/* Brand-gradient placeholder so the panel is never blank while the video decodes */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(120% 90% at 30% 20%, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(100% 80% at 80% 90%, hsl(var(--accent) / 0.14), transparent 60%)",
              }}
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => console.error('Video failed to load:', e)}
            >
              <source src="/videos/video1.mp4" type="video/mp4" />
            </video>
            {/* Single directional mask, only where the video meets the text column */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 lg:bg-gradient-to-r" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 lg:rounded-3xl"
              style={{ boxShadow: "inset 0 0 40px hsl(var(--background) / 0.5)" }}
            />
            <div className="pointer-events-none absolute inset-0 z-20 lg:rounded-3xl gradient-border opacity-60" />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="relative z-10 w-full lg:w-1/2 px-6 lg:px-12 xl:px-20 flex flex-col justify-center lg:text-left text-center py-12 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3 self-center rounded-full border border-border-subtle bg-surface-2/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur lg:self-start"
            >
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Available for opportunities
              </span>
              <span aria-hidden className="h-3 w-px bg-border-strong" />
              <span className="text-primary">CS Student @ FAST NUCES</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display-xl text-balance mb-4 relative"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 rounded-full opacity-40 blur-3xl"
                style={{ background: "radial-gradient(50% 60% at 40% 50%, hsl(var(--primary) / 0.25), transparent 70%)" }}
              />
              <span className="text-foreground">Umer </span>
              <span className="text-gradient-aurora">Khan</span>
            </motion.h1>

            {/* Rotating role text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 flex h-12 items-center justify-center font-mono text-xl font-semibold text-primary md:text-2xl lg:justify-start"
            >
              <ScrambleText key={currentRole} text={roles[currentRole]} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed lg:mx-0 mx-auto text-balance"
            >
              Engineering production-ready web applications with scalable architectures, 
              optimized databases, and intelligent automation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center"
            >
              <MagneticButton>
                <Link
                  to="/projects"
                  className="sheen flex items-center gap-2 rounded-lg bg-gradient-brand px-8 py-3 font-semibold text-primary-foreground shadow-glow"
                >
                  View Projects
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>
              <Link
                to="/contact"
                className="gradient-border rounded-lg border border-border-strong px-8 py-3 font-medium text-foreground transition-colors hover:text-primary"
              >
                Get in Touch
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex lg:justify-start justify-center gap-5"
            >
              {[
                { icon: Github, href: "https://github.com/umerkhan-12" },
                { icon: Linkedin, href: "https://linkedin.com/in/umer-khan10" },
                { icon: Mail, href: "mailto:khaankhattack321@gmail.com" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-border-subtle bg-surface-2/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:scale-110"
                >
                  <Icon size={20} />
                </a>
              ))}
            </motion.div>

            {/* Stat strip — anchors the lower half of the column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle/60 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="bg-surface-1/80 px-4 py-4 backdrop-blur">
                  <div className="font-display text-xl font-bold text-foreground">
                    {stat.count !== undefined ? (
                      <CountUp value={stat.count} suffix={stat.suffix} />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        {/* Scroll Indicator */}
        <ScrollCue />
      </section>


      {/* Tech ticker — the stats already live in the hero strip */}
      <section aria-label="Technologies" className="relative z-10 border-y border-border-subtle/60 py-6">
        <Marquee items={allTech} />
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader
                eyebrow="// about me"
                title="Who I"
                accent="Am"
                description="A driven computer science student building production-ready software"
              />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeUp}>
                <SpotlightCard className="h-full">
                <Card className="h-full border-none bg-transparent shadow-none group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Academic foundation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">BS Computer Science</h4>
                        <p className="text-sm text-muted-foreground">FAST NUCES, Karachi — 6 semesters completed</p>
                        <p className="text-xs text-primary mt-1">2023 – 2027</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Coursework in Data Structures, Algorithms, DBMS, OOP, and Operating Systems 
                        — with hands-on experience building production-ready applications.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                </SpotlightCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <SpotlightCard className="h-full">
                <Card className="h-full border-none bg-transparent shadow-none group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>What I Do</CardTitle>
                    <CardDescription>Core competencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Full-stack development with Next.js, React & Node.js",
                        "Database architecture, optimization & indexing strategies",
                        "Enterprise authentication & security implementation",
                        "AI/ML integration into web applications",
                        "Clean architecture & scalable system design"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                </SpotlightCard>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Link to="/about">
                <Button variant="outline" className="group border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
                  Learn More About Me
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={skillsRef} className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={skillsInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader
                eyebrow="// tech stack"
                title="Skills &"
                accent="Technologies"
                description="The tools and technologies I leverage to build robust applications"
              />
            </motion.div>

            <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {skills.map((group) => (
                <motion.div key={group.category} variants={fadeUp} className={group.span}>
                  <SpotlightCard className="group relative h-full overflow-hidden p-6">
                    <group.icon
                      aria-hidden
                      className="bento-glyph h-28 w-28 text-primary"
                      strokeWidth={1}
                    />
                    <div className="relative flex items-center gap-2">
                      <group.icon className="h-4 w-4 text-primary" />
                      <h3 className="font-display text-base font-semibold">{group.category}</h3>
                    </div>
                    <div className="relative mt-4 flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="border border-border-subtle bg-surface-2/60 font-mono text-[11px] font-normal text-muted-foreground transition-colors group-hover:text-foreground"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section — the schema spine */}
      <section id="projects" ref={projectsRef} className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader
                eyebrow="// featured work"
                title="Featured"
                accent="Projects"
                description="A selection of projects demonstrating full-stack expertise and system design"
              />
            </motion.div>

            {/* The spine runs behind the nodes on desktop only */}
            <div className="relative md:pl-12">
              <motion.div
                aria-hidden
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1 top-2 hidden h-[calc(100%-2rem)] w-px origin-top bg-gradient-to-b from-primary/60 via-primary/25 to-transparent md:block"
              />

              <div className="space-y-6">
                {projects.map((project) => (
                  <motion.div key={project.title} variants={fadeUp} className="md:node-dot">
                    <SpotlightCard className="group overflow-hidden">
                      {/* Table-header bar */}
                      <div className="flex items-center gap-2 border-b border-border-subtle bg-surface-2/50 px-5 py-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                        <span className="font-mono text-xs text-muted-foreground">
                          {project.title}
                        </span>
                      </div>

                      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-start">
                        <div>
                          <p className="font-mono text-xs text-primary/80">{project.highlights}</p>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {project.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-border-strong font-mono text-[11px] font-normal"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-5 flex flex-wrap gap-4">
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                              <Github className="h-4 w-4" />
                              View Code
                            </a>
                            {project.demo && (
                              <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Watch Demo
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="md:w-52">
                          <QueryPlan rows={project.plan} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div variants={fadeUp} className="mt-12 text-center">
              <Link to="/projects">
                <Button size="lg" className="group">
                  View All Projects
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp}>
              <SectionHeader
                eyebrow="// get in touch"
                title="Let's"
                accent="Connect"
                description="Open to internship opportunities, freelance projects, and collaboration"
              />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div variants={fadeUp}>
                <SpotlightCard className="h-full">
                <Card className="h-full border-none bg-transparent text-center shadow-none">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a
                      href="mailto:khaankhattack321@gmail.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                    >
                      khaankhattack321@gmail.com
                    </a>
                  </CardContent>
                </Card>
                </SpotlightCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <SpotlightCard className="h-full">
                <Card className="h-full border-none bg-transparent text-center shadow-none">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <a
                      href="tel:+923308696449"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      +92 330-8696449
                    </a>
                  </CardContent>
                </Card>
                </SpotlightCard>
              </motion.div>

              <motion.div variants={fadeUp}>
                <SpotlightCard className="h-full">
                <Card className="h-full border-none bg-transparent text-center shadow-none">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      Karachi, Pakistan
                    </p>
                  </CardContent>
                </Card>
                </SpotlightCard>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="text-center">
              <Link to="/contact">
                <Button size="lg" className="group">
                  <Send className="mr-2 w-4 h-4" />
                  Send Message
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
