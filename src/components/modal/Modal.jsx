import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ children, toggle, active }) => {
  if (typeof document === "undefined") return null;
  const host = document.getElementById("portal") || document.body;

  return createPortal(
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-brand-950/55 p-4"
          onClick={toggle}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-brand-200 bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={toggle}
              className="absolute right-3 top-3 rounded-lg p-1 text-rose-500 transition hover:bg-rose-50"
            >
              <X size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    host
  );
};

export default Modal;
