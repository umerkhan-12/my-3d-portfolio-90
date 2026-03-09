import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Palette, Zap, Globe } from "lucide-react";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const skills = [
  { icon: Code2, title: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
  { icon: Zap, title: "Backend", items: ["Node.js", "Python", "PostgreSQL", "REST APIs"] },
  { icon: Palette, title: "Design", items: ["Figma", "UI/UX", "3D Graphics", "Motion Design"] },
  { icon: Globe, title: "DevOps", items: ["Docker", "AWS", "CI/CD", "Git"] },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-4">About Me</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Building digital <span className="text-gradient">experiences</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mb-16">
          I'm a passionate full-stack developer with a keen eye for design and a love for creating 
          seamless user experiences. With years of experience across modern web technologies, 
          I bring ideas to life through clean, efficient code and thoughtful interfaces.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <AnimatedSection key={skill.title}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors group"
            >
              <skill.icon className="w-8 h-8 text-primary mb-4 group-hover:drop-shadow-[0_0_8px_hsl(185,80%,55%)] transition-all" />
              <h3 className="text-lg font-semibold mb-3 text-foreground">{skill.title}</h3>
              <ul className="space-y-2">
                {skill.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground font-mono">{item}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
