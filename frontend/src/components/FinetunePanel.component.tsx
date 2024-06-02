import React, { useState } from "react";
import Dropdown from "./Dropdown.component";
import { AllJobOptions, IDataset } from "@/models/types/dashboard";
import { CaretCircleDoubleRight } from "@phosphor-icons/react";

export interface FinetunePanelProps {
  jobOptions: AllJobOptions | undefined;
}

const FinetunePanel = ({ jobOptions }: FinetunePanelProps) => {
  const [submitHovered, setSubmitHovered] = useState(false);

  const handleSubmitJob = () => {
    // TODO: submit job to DB and trigger training event
    return;
  };

  return (
    <div className="flex flex-col item-start bg-white border-b-2 border-r-2 px-4 py-3 gap-y-4 h-full">
      <div className="flex justify-between">
        <div className="text-lg font-semibold text-main-title">
          Submit a finetuning job
        </div>
        <div
          onMouseEnter={() => {
            setSubmitHovered(true);
          }}
          onMouseLeave={() => {
            setSubmitHovered(false);
          }}
          className="flex items-center justify-center gap-x-2 w-32 lg:w-48 transition-all duration-300 p-2 rounded-lg shadow-sm border border-transparent cursor-pointer"
          aria-label="Upload your datasets"
          onClick={handleSubmitJob}
          style={{ backgroundColor: "#0aa8ff" }}
        >
          <span className={`text-white ${submitHovered && "font-bold"}`}>
            Submit
          </span>
          <CaretCircleDoubleRight
            weight={submitHovered ? "fill" : "bold"}
            size={24}
            color="#ffffff"
          />
        </div>
      </div>
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
