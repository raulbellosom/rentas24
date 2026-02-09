import React from "react";

export const TextInput = ({ icon: Icon, className = "", ...props }) => {
  return (
    <div className={`r24-input-shell ${className}`}>
      {Icon ? <Icon className="h-4 w-4 shrink-0 text-brand-500" /> : null}
      <input {...props} className="r24-input-base" />
    </div>
  );
};

export default TextInput;
