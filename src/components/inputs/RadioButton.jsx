import React, { useState } from "react";

export default function RadioButton(props) {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked(!checked);
    props.onChange(props.value);
  };

  const handleDeselect = (event) => {
    event.preventDefault();
    event.stopPropagation(); // evitar que el evento se propague a la etiqueta padre
    props.onDeselect(props.value);
  };

  return (
    <label
      className={`flex items-center gap-2 cursor-pointer p-2 px-4 ${
        checked ? "bg-primary-600 text-white" : "bg-primary-200"
      } ${props.className}`}
    >
      <input
        className="form-radio"
        name={props.name}
        value={props.value}
        type="radio"
        checked={checked}
        onChange={handleChange}
      />
      {props.label}
      {checked && (
        <button
          className="text-red-500 hover:text-red-700"
          onClick={handleDeselect}
        >
          x
        </button>
      )}
    </label>
  );
}
