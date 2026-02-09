import React, { Children, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Carousel = ({ children }) => {
  const slides = useMemo(() => Children.toArray(children), [children]);
  const [index, setIndex] = useState(0);

  if (!slides.length) {
    return <div className="h-full w-full rounded-2xl bg-brand-100" />;
  }

  const prev = () => setIndex((cur) => (cur === 0 ? slides.length - 1 : cur - 1));
  const next = () => setIndex((cur) => (cur === slides.length - 1 ? 0 : cur + 1));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{ duration: 0.22 }}
          className="h-full w-full"
        >
          {slides[index]}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-950/60 p-1.5 text-white backdrop-blur transition hover:bg-brand-950/80"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-950/60 p-1.5 text-white backdrop-blur transition hover:bg-brand-950/80"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {slides.map((_, bullet) => (
              <span
                key={bullet}
                className={`h-1.5 w-5 rounded-full ${
                  bullet === index ? "bg-white" : "bg-white/45"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;
