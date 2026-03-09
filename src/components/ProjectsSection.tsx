import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution with real-time inventory, AI-powered recommendations, and seamless checkout.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    color: "from-primary/20 to-accent/20",
  },
  {
    title: "AI Dashboard",
    description: "Analytics dashboard with machine learning insights, interactive data visualization, and predictive modeling.",
    tags: ["Next.js", "Python", "TensorFlow", "D3.js"],
    color: "from-accent/20 to-primary/20",
  },
  {
    title: "Social App",
    description: "Real-time social platform with messaging, content sharing, and community features built for scale.",
    tags: ["React Native", "Firebase", "WebSocket", "Redis"],
    color: "from-primary/20 to-accent/20",
  },
  {
    title: "Creative Portfolio",
    description: "Immersive 3D portfolio experience with WebGL animations, scroll-driven storytelling, and interactive elements.",
    tags: ["Three.js", "GSAP", "WebGL", "Blender"],
    color: "from-accent/20 to-primary/20",
  },
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="section-padding max-w-6xl mx-auto" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-4">Work</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-16">
          Featured <span className="text-gradient">Projects</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -6 }}
            className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex gap-3 text-muted-foreground">
                  <Github size={18} className="hover:text-primary transition-colors cursor-pointer" />
                  <ExternalLink size={18} className="hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-mono rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
