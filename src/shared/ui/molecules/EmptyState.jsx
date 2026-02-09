import React from "react";
import { motion } from "framer-motion";
import { Inbox, SearchX } from "lucide-react";

export const EmptyState = ({
  title = "Sin resultados",
  message = "No encontramos información para mostrar.",
  mode = "empty",
  action,
}) => {
  const Icon = mode === "search" ? SearchX : Inbox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-brand-200 bg-white p-8 text-center shadow-sm"
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mb-3 inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700"
      >
        <Icon size={24} />
      </motion.div>
      <h3 className="text-lg font-semibold text-brand-950">{title}</h3>
      <p className="mt-1 text-sm text-brand-600">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </motion.div>
  );
};

export default EmptyState;
