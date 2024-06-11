import { AllJobOptions } from "@/models/types/dashboard";
import React, { useState } from "react";
import JSONView from "react-json-view";

export interface MetaPanelProps {
  hyperparameters: AllJobOptions["hyperparameters"];
  handleHyperparametersChange: (a: AllJobOptions["hyperparameters"]) => void;
}

const MetaPanel = ({
  hyperparameters,
  handleHyperparametersChange,
}: MetaPanelProps) => {
  const [jsonError, setJsonError] = useState("");

  // We cannot do strict typing for event or this handler
  // See issue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508
  const handleHyperparametersStringChange = (event) => {
    console.log("event", event);
    const newHyper = event.updated_src;
    handleHyperparametersChange(newHyper);
  };

  return (
    <div
      className={`flex flex-col item-start bg-white border-b-2 border-r-2 px-2 py-2 gap-y-4 h-full ${
        !!jsonError && "bg-red"
      }`}
    >
      <div className="text-lg font-semibold text-main-title">
        Training Hyperparameters
      </div>
      <JSONView
        onEdit={handleHyperparametersStringChange}
        src={hyperparameters}
        name="hyperparameters"
        enableClipboard={true}
      />
    </div>
  );
};

export default MetaPanel;
