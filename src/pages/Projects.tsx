import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SpotlightCard from "@/components/SpotlightCard";
import QueryPlan from "@/components/QueryPlan";
import { projects, type Project } from "@/data/profile";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <SpotlightCard className="group h-full overflow-hidden">
        {/* Flagship gets the only colored bar on the page */}
        <div className={project.flagship ? "ribbon h-1" : "h-1 bg-border-subtle"} />

        <div className="p-6 md:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="depth-1">
              {project.flagship && (
                <span className="mb-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                  Flagship
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {project.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-primary/80">{project.subtitle}</p>
            </div>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source on GitHub`}
              className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
            >
              <Github size={18} />
            </a>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

          <ul className="mt-4 space-y-2">
            {project.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {d}
              </li>
            ))}
          </ul>

          <QueryPlan rows={project.plan} />

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border-subtle bg-surface-2/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
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
              className="mt-5 inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
            >
              <ExternalLink className="h-4 w-4" />
              Watch demo
            </a>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <div id="main" className="relative min-h-screen overflow-hidden">
      <SEO 
        title="Projects" 
        description="CliniBot, a commercial WhatsApp booking SaaS; OMR.AI, an agentic AI assistant; the NADRA Citizen Services Portal; and more."
        keywords="Projects, Portfolio, Web Development, React, Next.js, Full-Stack, Python"
      />
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

        <div className="stage-3d grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
