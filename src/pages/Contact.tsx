import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Scene3DSimple from "@/components/Scene3DSimple";

const contactInfo = [
  { icon: Mail, label: "Email", value: "khaankhattack321@gmail.com", href: "mailto:khaankhattack321@gmail.com" },
  { icon: Phone, label: "Phone", value: "+92 330-8696449", href: "tel:+923308696449" },
  { icon: MapPin, label: "Location", value: "Karachi, Pakistan", href: null },
];

const socials = [
  { icon: Github, label: "GitHub", value: "github.com/umerkhan-12", href: "https://github.com/umerkhan-12" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/umer-khan10", href: "https://linkedin.com/in/umer-khan10" },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Scene3DSimple />
      <Navbar />

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary mb-3 tracking-wider">// contact</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            I'm open to internship opportunities, freelance projects, and collaboration. 
            Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold mb-4">Contact Info</h2>
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card card-hover">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-foreground hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold mb-4">Profiles</h2>
            {socials.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card card-hover"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              </a>
            ))}

            <a
              href="mailto:khaankhattack321@gmail.com"
              className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
            >
              <Send size={16} />
              Send me an Email
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
