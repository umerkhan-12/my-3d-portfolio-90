import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * One header treatment for every section: mono eyebrow, a rule that draws in
 * from the left, then the display heading.
 */
export default function SectionHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-14",
        centered ? "text-center" : "text-left",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          centered && "justify-center"
        )}
      >
        <span className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-px w-16 origin-left bg-gradient-to-r from-primary to-transparent"
        />
      </div>

      <h2 className="display-lg text-balance mt-4">
        {title}
        {accent && <span className="text-gradient-aurora"> {accent}</span>}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-4 text-lg text-muted-foreground text-balance",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
