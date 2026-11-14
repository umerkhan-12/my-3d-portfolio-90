import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Menu, X, FileDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/classic" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-aurora"
      />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3"
      >
        <motion.div
          animate={{
            marginTop: scrolled ? 12 : 0,
            width: scrolled ? "min(64rem, 100%)" : "min(72rem, 100%)",
            borderRadius: scrolled ? 999 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className={`transition-colors duration-300 ${
            scrolled
              ? "border border-border-subtle/80 bg-surface-1/70 shadow-md backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-3 md:px-6">
            <Link to="/" className="font-display text-lg font-bold tracking-tight">
              <span className="text-primary">{"<"}</span>
              <span className="text-foreground">Umer</span>
              <span className="text-primary">{" />"}</span>
            </Link>

            {/* Desktop */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full border border-primary/25 bg-primary/10"
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
              <a
                href="/Umer_Khan_Resume.pdf"
                download
                className="ml-2 flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
              >
                <FileDown size={18} />
                Resume
              </a>
            </div>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="text-foreground md:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex flex-col bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-display text-lg font-bold">
                <span className="text-primary">{"<"}</span>
                <span className="text-foreground">Umer</span>
                <span className="text-primary">{" />"}</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-foreground">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-2 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : 0.08 * i + 0.05, duration: 0.35 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-border-subtle/60 py-5 font-display text-3xl font-semibold tracking-tight ${
                      location.pathname === link.path ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="/Umer_Khan_Resume.pdf"
                download
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.4, duration: 0.35 }}
                className="mt-8 flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 py-4 text-base font-medium text-primary"
              >
                <FileDown size={18} />
                Download Resume
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
