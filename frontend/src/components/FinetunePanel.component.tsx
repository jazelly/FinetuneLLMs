import React from "react";
import Dropdown from "./Dropdown.component";
import { AllJobOptions, IDataset } from "@/models/types/dashboard";

export interface FinetunePanelProps {
  jobOptions: AllJobOptions | undefined;
}

const FinetunePanel = ({ jobOptions }: FinetunePanelProps) => {
  console.log("jobOptions", jobOptions);
  return (
    <div className="flex flex-col item-start bg-white border-b-2 border-r-2 px-2 py-2 gap-y-4 h-full">
      <Dropdown<string>
        placeholder="Base model"
        options={jobOptions?.baseModels ?? []}
        label="Base model"
        disabled={!jobOptions}
      />
      <Dropdown<string>
        placeholder="Training method"
        options={jobOptions?.trainingMethods ?? []}
        label="Training method"
        disabled={!jobOptions}
      />
      <Dropdown<IDataset["name"]>
        placeholder="Dataset"
        options={jobOptions?.datasets.map((d) => d.name) ?? []}
        label="Dataset"
        disabled={!jobOptions}
      />
    </div>
  );
};

export default FinetunePanel;
