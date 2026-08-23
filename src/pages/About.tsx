import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Code2, Trophy, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import {
  profile, experience, education, skills, achievements,
} from "@/data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

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
    <div id="main" className="relative min-h-screen overflow-hidden">
      <SEO 
        title="About Me" 
        description="Computer Science student at FAST NUCES with hands-on experience building production-ready full-stack applications. Expertise in React, Next.js, Node.js, and AI/ML."
        keywords="About Umer Khan, Skills, Education, Experience, Computer Science"
      />
      <Navbar />

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <AnimatedSection className="mb-16">
          <p className="text-sm font-mono text-primary mb-3 tracking-wider">// about-me</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            About <span className="text-gradient">Me</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
            Computer Science student at FAST NUCES with hands-on experience building production-ready 
            full-stack applications. Proven ability to design scalable databases, implement enterprise 
            authentication, and deliver responsive UIs. Currently expanding into Machine Learning with 
            focused study in Deep Learning. Seeking a software engineering internship to contribute to 
            impactful projects using Next.js, React, and modern databases.
          </p>
        </AnimatedSection>

        {/* Experience */}
        <AnimatedSection className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <Briefcase className="text-primary" size={22} />
            <h2 className="text-2xl font-bold">Experience</h2>
          </div>
          <div className="space-y-4">
            {experience.map((job) => (
              <div
                key={job.company}
                className="rounded-lg border border-border bg-card/80 p-5 backdrop-blur-sm card-hover"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{job.role}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.company} · {job.parent}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-sm text-primary">{job.period}</span>
                    <p className="font-mono text-xs text-muted-foreground">{job.mode}</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
                className="p-5 rounded-lg border border-border bg-card/80 backdrop-blur-sm card-hover"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.school}</p>
                    {edu.detail && <p className="text-xs text-muted-foreground mt-1">{edu.detail}</p>}
                    {edu.coursework.length > 0 && (
                      <p className="mt-2 max-w-md font-mono text-[11px] leading-relaxed text-muted-foreground/70">
                        {edu.coursework.join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono text-primary">{edu.year}</span>
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
            {skills.map((cat) => (
              <div
                key={cat.category}
                className="p-5 rounded-lg border border-border bg-card/80 backdrop-blur-sm card-hover"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Code2 size={16} className="text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">{cat.category}</h3>
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

        <AnimatedSection>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-primary" size={22} />
            <h2 className="text-2xl font-bold">Achievements & Involvement</h2>
          </div>
          <div className="space-y-3">
            {achievements.map((a) => (
              <div
                key={a.title}
                className="flex gap-3 p-4 rounded-lg border border-border bg-card/80 backdrop-blur-sm card-hover"
              >
                <span className="text-primary font-mono text-sm mt-0.5">▸</span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {a.title}
                    <span className="ml-2 font-mono text-xs font-normal text-primary/80">{a.context}</span>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <Footer />
    </div>
  );
}
