import React, { useState } from "react";

const LabelSelect = ({ item }) => {
  return <div className="flex flex-col gap-4">{item.label}</div>;
};

export default LabelSelect;
