import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Code2, Shield, Wrench, Brain, Users, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const skillCategories = [
  {
    icon: Code2,
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "C/C++", "SQL"],
  },
  {
    icon: Code2,
    title: "Frontend",
    items: ["React 19", "Next.js 16", "Tailwind CSS", "HTML5/CSS3", "Bootstrap"],
  },
  {
    icon: Wrench,
    title: "Backend",
    items: ["Node.js", "Express.js", "Next.js API", "Flask", "RESTful APIs", "JWT"],
  },
  {
    icon: Wrench,
    title: "Databases",
    items: ["MySQL 8", "MongoDB", "Prisma ORM"],
  },
  {
    icon: Shield,
    title: "Security",
    items: ["NextAuth.js", "bcrypt", "OTP Verification", "RBAC", "Rate Limiting", "CSRF"],
  },
  {
    icon: Brain,
    title: "Core CS",
    items: ["OOP", "Data Structures", "Algorithms", "DBMS", "Operating Systems"],
  },
];

const education = [
  {
    degree: "BS Computer Science",
    school: "FAST NUCES, Karachi",
    year: "2023 - 2027",
  },
  {
    degree: "Intermediate (Pre-Engineering)",
    school: "Adamjee Government Science College",
    year: "2021 - 2023",
    grade: "84%",
  },
];

const achievements = [
  "Developed Query Quest platform for PROCOM 2026 — a competitive SQL learning game used in the national computing olympiad",
  "Co-Head of Software Engineering Competition in Dev Day 2026",
  "Completed Full Web Development Course by CodeWithHarry (Udemy)",
  "Volunteered in tech workshops and coding contests (Coder's Cup)",
];

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <AnimatedSection className="mb-16">
          <p className="text-sm font-mono text-primary mb-3 tracking-wider">// about-me</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            About <span className="text-gradient">Me</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
            I'm a junior at FAST NUCES pursuing Computer Science with a strong foundation in full-stack development 
            and a passion for building scalable, user-centric applications. Currently expanding my skill set into 
            Machine Learning with focused study in Deep Learning. Eager to contribute technical skills and innovative 
            problem-solving abilities as a software engineering intern.
          </p>
        </AnimatedSection>

        {/* Education */}
        <AnimatedSection className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="text-primary" size={22} />
            <h2 className="text-2xl font-bold">Education</h2>
          </div>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.degree}
                className="p-5 rounded-lg border border-border bg-card card-hover"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono text-primary">{edu.year}</span>
                    {edu.grade && (
                      <p className="text-xs text-muted-foreground">{edu.grade}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Skills */}
        <AnimatedSection className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="text-primary" size={22} />
            <h2 className="text-2xl font-bold">Technical Skills</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map((cat) => (
              <div
                key={cat.title}
                className="p-5 rounded-lg border border-border bg-card card-hover"
              >
                <div className="flex items-center gap-2 mb-3">
                  <cat.icon size={16} className="text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs font-mono rounded-md bg-secondary text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Achievements */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-primary" size={22} />
            <h2 className="text-2xl font-bold">Achievements</h2>
          </div>
          <div className="space-y-3">
            {achievements.map((a, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 rounded-lg border border-border bg-card card-hover"
              >
                <span className="text-primary font-mono text-sm mt-0.5">▸</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <Footer />
    </div>
  );
}
