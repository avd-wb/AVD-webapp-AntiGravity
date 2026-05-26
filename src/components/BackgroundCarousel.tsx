import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  images: string[];
  interval?: number;
}

export function BackgroundCarousel({ images, interval = 8000 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images?.length) return null;

  return (
    <div className="absolute inset-0 z-0 bg-slate-950 pointer-events-none">
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 0.55, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 3, ease: "easeInOut" },
            scale: { duration: interval / 1000 + 3, ease: "linear" }
          }}
        />
      </AnimatePresence>
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
    </div>
  );
}
