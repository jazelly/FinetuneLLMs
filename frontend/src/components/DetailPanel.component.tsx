import { AllJobOptions } from "@/models/types/dashboard";
import React, { useState } from "react";
import JSONView from "react-json-view";

export interface DetailPanelProps {
  hyperparameters: AllJobOptions["hyperparameters"];
  handleHyperparametersChange: (a: AllJobOptions["hyperparameters"]) => void;
}

const DetailPanel = ({
  hyperparameters,
  handleHyperparametersChange,
}: DetailPanelProps) => {
  const [jsonError, setJsonError] = useState("");

  // We cannot do strict typing for event or this handler
  // See issue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508
  const handleHyperparametersStringChange = (event) => {
    let newHyper = hyperparameters;
    try {
      console.log("event.target.innerText", event.target.innerText);
      newHyper = JSON.parse(event.target.innerText);

      if (!!jsonError) setJsonError("");
      handleHyperparametersChange(newHyper);
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        setJsonError("Invalid json format");
      } else {
        console.error("An error occurred", error);
      }
    }
  };
  return (
    <div
      className={`flex flex-col item-start bg-white border-b-2 border-r-2 px-2 py-2 gap-y-4 h-full ${
        !!jsonError && "bg-red"
      }`}
    >
      <div className="text-lg font-semibold">Training Hyperparameters</div>
      <JSONView
        onEdit={handleHyperparametersStringChange}
        src={hyperparameters}
        name="hyperparameters"
      />
    </div>
  );
};

export default DetailPanel;
