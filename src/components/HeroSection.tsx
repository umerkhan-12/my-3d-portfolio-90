import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Scene3D from "./Scene3D";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Scene3D />

      <div className="relative z-10 text-center section-padding max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-6"
        >
          Creative Developer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8"
        >
          <span className="text-foreground">Hi, I'm </span>
          <span className="text-gradient">Your Name</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          I craft immersive digital experiences through clean code and thoughtful design.
          Full-stack developer passionate about building the future of the web.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-primary"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#about" className="text-muted-foreground hover:text-primary transition-colors animate-float">
          <ArrowDown size={24} />
        </a>
      </motion.div>
    </section>
  );
}
