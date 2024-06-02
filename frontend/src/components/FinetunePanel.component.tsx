import React from "react";
import Dropdown from "./Dropdown.component";

const FinetunePanel = () => {
  const options = [1, 2, 3];

  return (
    <div className="flex flex-col item-start bg-white border-b-2 border-r-2 px-2 py-2 gap-y-4 h-full">
      <Dropdown placeholder="Base model" options={options} label="Base model" />
      <Dropdown
        placeholder="Training method"
        options={options}
        label="Training method"
      />
      <Dropdown placeholder="Dataset" options={options} label="Dataset" />
      <Dropdown placeholder="Dataset" options={options} label="Dataset" />
      <Dropdown placeholder="Dataset" options={options} label="Dataset" />
      <Dropdown placeholder="Dataset" options={options} label="Dataset" />
      <Dropdown placeholder="Dataset" options={options} label="Dataset" />
    </div>
  );
};

export default FinetunePanel;
