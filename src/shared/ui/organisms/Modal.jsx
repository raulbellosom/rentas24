import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "4xl": "max-w-5xl",
};

const Header = ({ children, className = "" }) => (
  <div
    className={`flex items-center justify-between border-b border-brand-200 px-5 py-4 text-base font-semibold text-brand-950 ${className}`}
  >
    {children}
  </div>
);

const Body = ({ children, className = "" }) => (
  <div className={`overflow-y-auto px-5 py-4 ${className}`}>{children}</div>
);

const ModalRoot = ({ show, onClose, size = "lg", children }) => {
  if (typeof document === "undefined") return null;
  const host = document.getElementById("portal") || document.body;

  return createPortal(
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-950/55 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-2xl ${sizeMap[size] || sizeMap.lg}`}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-lg p-1 text-brand-500 transition hover:bg-brand-100 hover:text-brand-900"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    host
  );
};

export const Modal = Object.assign(ModalRoot, { Header, Body });

export default Modal;
