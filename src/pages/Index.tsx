import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Code2, Briefcase, GraduationCap, Award, ExternalLink, Send, MapPin, Phone, Sparkles, Rocket, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Scene3D from "@/components/Scene3D";
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
  "Tools": ["Git", "Docker", "Vite", "Postman", "VS Code"],
};

const projects = [
  {
    title: "NADRA Citizen Services Portal",
    description: "Automated government service delivery platform reducing processing time by 60%. Multi-role authentication with intelligent ticket management and bilingual AI chatbot.",
    tags: ["Next.js", "React", "Prisma", "MySQL", "Flask", "AI"],
    github: "https://github.com/umerkhan-12",
    highlights: "60% faster processing • 12-table normalized DB • Bilingual AI chatbot"
  },
  {
    title: "Voice Assistant AI",
    description: "Hands-free voice-controlled assistant with 95% speech recognition accuracy. Supports 10+ commands including web search, time/date, and app launching.",
    tags: ["Python", "SpeechRecognition", "Edge TTS", "Tkinter"],
    github: "https://github.com/umerkhan-12",
    highlights: "95% accuracy • 10+ voice commands • Natural voice synthesis"
  },
  {
    title: "Spotify Clone",
    description: "Pixel-perfect Spotify UI replica with custom audio controls, dynamic playlists, and 100% mobile responsive design using vanilla JavaScript.",
    tags: ["HTML", "CSS", "JavaScript", "Audio API"],
    github: "https://github.com/umerkhan-12",
    highlights: "Pixel-perfect UI • Custom audio controls • 100% responsive"
  },
  {
    title: "Query Quest — PROCOM 2026",
    description: "Competitive SQL learning game platform for national computing olympiad. Gamified challenges with real-time scoring and leaderboards.",
    tags: ["React", "Node.js", "SQL", "Game Design"],
    github: "https://github.com/umerkhan-12",
    highlights: "National olympiad platform • Gamified learning • Real-time scoring"
  },
];

const stats = [
  { icon: Code2, label: "Projects Completed", value: "15+" },
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

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Rotating text effect
  const roles = [
    "Full-Stack Developer",
    "Database Specialist",
    "AI/ML Enthusiast",
    "DevOps Engineer",
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO 
        title="Home" 
        description="Full-Stack Developer specializing in React, Next.js, Node.js, DevOps, and AI/Machine Learning. Building scalable solutions with modern technologies."
        keywords="Umer Khan, Portfolio, Full-Stack Developer, React Developer, Next.js, AI/ML"
      />
      <Navbar />

      {/* Hero Section - Green Theme */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-black">
        {/* Green radial glow effect */}
        <div className="absolute inset-0 bg-gradient-radial from-emerald-950/30 via-black to-black z-0" />
        
        {/* 3D Character Scene - Temporarily Commented */}
        {/* <Scene3D /> */}
        
        {/* Video Background - Left Side */}
        <div className="absolute left-0 top-0 w-full lg:w-1/2 h-full z-[1]">
          <div className="relative w-full h-full overflow-hidden bg-gray-900">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              onError={(e) => console.error('Video failed to load:', e)}
            >
              <source src="/videos/video1.mp4" type="video/mp4" />
            </video>
            {/* Subtle green tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-emerald-900/10 to-black/40" />
          </div>
        </div>
        
        {/* Text Content - Right Side */}
        <div className="relative z-10 w-full lg:w-1/2 ml-auto px-6 lg:px-12 xl:px-24 flex flex-col justify-center lg:text-left text-center min-h-screen py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-mono mb-8 lg:self-start self-center"
          >
            <Sparkles className="w-4 h-4" />
            CS Student @ FAST NUCES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-white">Umer </span>
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">Khan</span>
          </motion.h1>

          {/* Rotating role text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 h-12 lg:h-14 flex items-center lg:justify-start justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-emerald-400 inline-block"
              >
                {roles[currentRole]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl lg:max-w-xl mb-10 leading-relaxed lg:mx-0 mx-auto"
          >
            Building scalable web solutions with modern technologies. Passionate about creating innovative applications that make a difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center mb-12"
          >
            <Link
              to="/projects"
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
            >
              View Projects
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:border-primary/40 transition-colors"
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
                className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:scale-110"
              >
                <Icon size={20} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-8 lg:left-1/4 z-10"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-card/30 backdrop-blur-sm border-y border-border/50">
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
      <section id="about" ref={aboutRef} className="py-24 px-6">
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
                A passionate computer science student crafting digital experiences
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
                    <CardDescription>Building a strong foundation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">BS Computer Science</h4>
                        <p className="text-sm text-muted-foreground">FAST NUCES, Karachi</p>
                        <p className="text-xs text-primary mt-1">2023 - 2027</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Studying core CS concepts including Data Structures, Algorithms, DBMS, 
                        OOP, and Operating Systems while building real-world projects.
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
                    <CardTitle>Focus Areas</CardTitle>
                    <CardDescription>What drives me forward</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Full-stack web development with modern frameworks",
                        "Building scalable and secure applications",
                        "3D web experiences with Three.js",
                        "Clean code architecture & best practices",
                        "Open source contribution & collaboration"
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
                <Button variant="outline" className="group">
                  Learn More About Me
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={skillsRef} className="py-24 px-6 bg-card/30 backdrop-blur-sm">
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
                Tools and technologies I use to bring ideas to life
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
      <section id="projects" ref={projectsRef} className="py-24 px-6">
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
                A selection of projects showcasing my skills and passion for development
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

                      <div className="flex gap-3 pt-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          View Code
                        </a>
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
      <section id="contact" ref={contactRef} className="py-24 px-6 bg-card/30 backdrop-blur-sm">
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
