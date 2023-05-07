import React, { useState } from "react";
import RadioButton from "./RadioButton";

function RadioGroup(props) {
  const [value, setValue] = useState(props.defaultValue);

  const handleChange = (value) => {
    setValue(value);
    props.onChange(value);
  };

  const handleDeselect = (value) => {
    if (value === props.defaultValue) {
      return;
    }
    setValue(props.defaultValue);
    props.onDeselect(value);
  };

  return (
    <div className="flex gap-4 flex-wrap ">
      {props.options.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          value={option.value}
          onChange={handleChange}
          onDeselect={handleDeselect}
          checked={option.value === value}
        />
      ))}
    </div>
  );
}

export default RadioGroup;
