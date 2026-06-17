import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, FileDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold font-heading tracking-tight">
          <span className="text-primary">{"<"}</span>
          <span className="text-foreground">Umer</span>
          <span className="text-primary">{" />"}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm transition-colors font-medium ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            <FileDown size={14} />
            Resume
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/Umer_Khan_Resume.pdf"
            download
            className="block px-6 py-3 text-sm text-primary"
          >
            Download Resume
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
