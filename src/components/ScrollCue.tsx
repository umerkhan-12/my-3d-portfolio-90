import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollCue() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 240], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      aria-hidden
    >
      <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary/30 p-2">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-primary"
        />
      </div>
    </motion.div>
  );
}
