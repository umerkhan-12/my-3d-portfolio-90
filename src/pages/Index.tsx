import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
      
      <footer className="text-center py-8 border-t border-border">
        <p className="text-sm text-muted-foreground font-mono">
          © 2026 · Built with passion
        </p>
      </footer>
    </div>
  );
};

export default Index;
