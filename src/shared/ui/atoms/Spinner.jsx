import React from "react";

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-10 w-10 border-4",
};

export const Spinner = ({ size = "md", className = "", ariaLabel = "Loading" }) => {
  return (
    <span
      aria-label={ariaLabel}
      role="status"
      className={`inline-block animate-spin rounded-full border-brand-200 border-t-brand-600 ${sizeMap[size] || sizeMap.md} ${className}`}
    />
  );
};

export default Spinner;
