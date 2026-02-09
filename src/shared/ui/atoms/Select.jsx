import React from "react";

export const Select = ({ className = "", children, ...props }) => {
  return (
    <select
      {...props}
      className={`r24-select-base ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
