import React from "react";

export const Label = ({ htmlFor, children, value, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-brand-800 ${className}`}
    >
      {children || value}
    </label>
  );
};

export default Label;
