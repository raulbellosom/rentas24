import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Home, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "../../router/paths";

const codeMap = {
  404: {
    title: "Page not found",
    message: "This route does not exist or was moved.",
  },
  500: {
    title: "Unexpected error",
    message: "Something failed while rendering the app.",
  },
};

const AppErrorView = ({
  code = 500,
  title,
  message,
  showBack = true,
  onRetry,
}) => {
  const preset = codeMap[code] || codeMap[500];
  const heading = title || preset.title;
  const copy = message || preset.message;

  return (
    <div className="relative isolate flex min-h-[70vh] w-full items-center justify-center overflow-hidden rounded-3xl border border-brand-200/50 bg-brand-50 px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-16 top-8 h-44 w-44 rounded-full bg-brand-300/35 blur-3xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-accent-300/35 blur-3xl"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center rounded-2xl border border-brand-200/70 bg-white/90 p-8 text-center shadow-xl backdrop-blur"
      >
        <motion.div
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-4 rounded-2xl bg-brand-950 p-3 text-brand-50 shadow-lg"
        >
          <AlertTriangle size={26} />
        </motion.div>

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
          Error {code}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-950">{heading}</h1>
        <p className="mt-2 max-w-xl text-sm text-brand-700">{copy}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={routes.home}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            <Home size={16} />
            Safe Home
          </Link>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-300 px-4 py-2 text-sm font-semibold text-brand-900 transition hover:border-brand-500 hover:bg-brand-100"
            >
              <RotateCcw size={16} />
              Retry
            </button>
          )}
          {showBack && (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AppErrorView;
