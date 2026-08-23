import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Code2, Briefcase, GraduationCap, Award, ExternalLink, Send, MapPin, Phone, Sparkles, Rocket, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Scene3DSimple from "@/components/Scene3DSimple";
import Atmosphere from "@/components/Atmosphere";
import MagneticButton from "@/components/MagneticButton";
import ScrambleText from "@/components/ScrambleText";
import ScrollCue from "@/components/ScrollCue";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SEO from "@/components/SEO";
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

const skills = {
  "Languages": ["JavaScript", "TypeScript", "Python", "C/C++", "SQL"],
  "Frontend": ["React 19", "Next.js 16", "Tailwind CSS", "Framer Motion", "Three.js"],
  "Backend": ["Node.js", "Express.js", "Flask", "REST APIs", "JWT"],
  "Database": ["MySQL 8", "MongoDB", "Prisma ORM"],
  "Security": ["NextAuth.js", "bcrypt", "OTP", "RBAC", "Rate Limiting"],
  "AI & Automation": ["LLM", "Gen AI", "Automation", "Agentic Workflow", "n8n", "Claude API"],
  "Tools": ["Git", "Docker", "Vite", "Postman", "VS Code"],
};

const projects = [
  {
    title: "OMR.AI — Agentic AI Personal Assistant",
    description: "A fully agentic AI personal assistant built on n8n with a custom Python/Streamlit frontend. Connects Gmail, Google Calendar, Google Docs, and job search APIs through intelligent multi-step workflows.",
    tags: ["n8n", "Claude API", "Python", "Streamlit", "OpenRouter"],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_ai-automation-n8n-ugcPost-7477780554365616128-55rC/",
    highlights: "Agentic AI • n8n workflows • Claude API • Streamlit UI"
  },
  {
    title: "NADRA Citizen Services Portal",
    description: "Enterprise-grade government platform that reduced processing time by 60% with intelligent ticket management, multi-role auth, and bilingual AI chatbot.",
    tags: ["Next.js", "Prisma", "MySQL", "Flask", "AI"],
    github: "https://github.com/umerkhan-12",
    demo: "https://www.linkedin.com/posts/umer-khan10_fullstackdeveloper-javascript-typescript-ugcPost-7407316108757733376-9lDM/",
    highlights: "60% faster processing • 12-table DB • Bilingual AI chatbot"
  },
  {
    title: "Voice Assistant AI",
    description: "Hands-free voice-controlled assistant achieving 95% speech recognition accuracy. Supports 10+ commands with natural voice synthesis.",
    tags: ["Python", "SpeechRecognition", "Edge TTS"],
    github: "https://github.com/umerkhan-12",
    highlights: "95% accuracy • 10+ commands • Natural voice synthesis"
  },
  {
    title: "PassMag — Password Manager",
    description: "Secure local-first password management tool with full CRUD, real-time updates, search/filter, and copy-to-clipboard — zero external dependencies.",
    tags: ["React", "Express.js", "Tailwind CSS"],
    github: "https://github.com/umerkhan-12",
    highlights: "Full CRUD • Local-first • Zero dependencies"
  },
  {
    title: "Spotify Clone",
    description: "Pixel-perfect Spotify replica with custom audio controls, dynamic playlists, and 100% mobile responsive design — built without frameworks.",
    tags: ["HTML", "CSS", "JavaScript", "Audio API"],
    github: "https://github.com/umerkhan-12",
    highlights: "Pixel-perfect UI • Custom audio • 100% responsive"
  },
];

const stats = [
  { icon: Code2, label: "Projects Built", value: "15+" },
  { icon: Award, label: "GitHub Contributions", value: "500+" },
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

  const roles = [
    "Full-Stack Developer",
    "Database Architect",
    "AI/ML Enthusiast",
    "Problem Solver"
  ];
  
  const [currentRole, setCurrentRole] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO 
        title="Home" 
        description="Umer Khan — Full-Stack Developer specializing in React, Next.js, Node.js, and AI/ML. Building production-ready applications with modern technologies."
        keywords="Umer Khan, Portfolio, Full-Stack Developer, React, Next.js, Python"
      />

      {/* Ambient atmosphere */}
      <Atmosphere />

      {/* Global 3D Background */}
      <Scene3DSimple />
      
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden">
        {/* Video - Top on mobile, Left on desktop */}
        <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-auto lg:min-h-screen lg:p-6 lg:pt-28">
          <div className="relative h-full w-full overflow-hidden bg-gradient-surface lg:rounded-3xl lg:shadow-lg">
            <div className="pointer-events-none absolute inset-0 z-20 lg:rounded-3xl gradient-border opacity-60" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover opacity-90"
              onError={(e) => console.error('Video failed to load:', e)}
            >
              <source src="/videos/video1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-transparent to-background/70" />
            <div
              className="absolute inset-0"
              style={{ boxShadow: "inset 0 0 90px hsl(var(--background) / 0.9)" }}
            />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="relative z-10 w-full lg:w-1/2 px-6 lg:px-12 xl:px-20 flex flex-col justify-center lg:text-left text-center py-12 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 self-center rounded-full border border-border-subtle bg-surface-2/70 px-4 py-1.5 text-xs font-mono text-muted-foreground backdrop-blur lg:self-start"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Available for opportunities
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-mono mb-8 mx-auto lg:mx-0"
            >
              <Sparkles className="w-4 h-4" />
              CS Student @ FAST NUCES
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
                  <div className="font-display text-xl font-bold text-foreground">{stat.value}</div>
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


      {/* Stats Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
                // about me
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Who I <span className="text-gradient">Am</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A driven computer science student building production-ready software
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeUp}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group">
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
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group">
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
            <motion.div variants={fadeUp} className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
                // tech stack
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Skills & <span className="text-gradient">Technologies</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The tools and technologies I leverage to build robust applications
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, items], index) => (
                <motion.div
                  key={category}
                  variants={fadeUp}
                  custom={index}
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-primary/10 hover:bg-primary/20 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" ref={projectsRef} className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
                // featured work
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Featured <span className="text-gradient">Projects</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A selection of projects demonstrating full-stack expertise and system design
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  variants={fadeUp}
                  custom={index}
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group">
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-primary/80">
                        {project.highlights}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          View Code
                        </a>
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Watch Demo
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center">
              <Link to="/projects">
                <Button size="lg" className="group">
                  View All Projects
                  <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
            <motion.div variants={fadeUp} className="text-center mb-12">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4">
                // get in touch
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Let's <span className="text-gradient">Connect</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Open to internship opportunities, freelance projects, and collaboration
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <motion.div variants={fadeUp}>
                <Card className="text-center border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group">
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
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="text-center border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group">
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
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="text-center border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group">
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
