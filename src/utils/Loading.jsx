import React from "react";
import { motion } from "framer-motion";
import IconWhite from "../assets/icon.svg";

const Loading = ({
  title = "Cargando sesion",
  message = "Estamos abriendo el módulo que solicitaste.",
}) => {
  return (
    <div className="fixed inset-0 z-[120] flex r24-h-dvh w-screen items-center justify-center bg-gradient-to-b from-brand-950 to-brand-900">
      {/* Subtle background glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(66,212,234,0.08)_0%,transparent_60%)]"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Spinner and logo */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Circular spinner */}
          <div className="relative h-32 w-32">
            {/* Outer spinning ring */}
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(66, 212, 234, 0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#42D4EA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="290"
                strokeDashoffset="290"
                animate={{
                  strokeDashoffset: [290, 50, 290],
                  rotate: [0, 360],
                }}
                transition={{
                  strokeDashoffset: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                  rotate: {
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  },
                }}
              />
            </svg>

            {/* Logo container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-800/60 backdrop-blur-sm"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(66, 212, 234, 0.2)",
                    "0 0 30px rgba(66, 212, 234, 0.4)",
                    "0 0 20px rgba(66, 212, 234, 0.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <img src={IconWhite} alt="" className="h-10 w-10" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Brand name */}
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-accent-400">
            RENTAS24
          </p>

          {/* Title */}
          <h1 className="mb-3 text-2xl font-semibold text-white">{title}</h1>

          {/* Message */}
          <p className="max-w-xs text-sm leading-relaxed text-brand-200/70">
            {message}
          </p>

          {/* Animated dots */}
          <div className="mt-8 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-accent-400"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;
