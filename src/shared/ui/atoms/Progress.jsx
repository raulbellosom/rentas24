import React from "react";

export const Progress = ({ progress = 0, className = "" }) => {
  const value = Math.max(0, Math.min(100, Number(progress) || 0));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-brand-100 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-[width] duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;
