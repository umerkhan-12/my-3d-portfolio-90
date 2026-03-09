import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@example.com" },
];

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="section-padding max-w-4xl mx-auto text-center" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-4">Contact</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Let's work <span className="text-gradient">together</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
          Have a project in mind? I'd love to hear about it. Let's create something extraordinary together.
        </p>

        <motion.a
          href="mailto:hello@example.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-opacity mb-16"
        >
          Say Hello
        </motion.a>

        <div className="flex justify-center gap-6">
          {socials.map(({ icon: Icon, label, href }) => (
            <motion.a
              key={label}
              href={href}
              whileHover={{ y: -4, scale: 1.1 }}
              className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
              aria-label={label}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
