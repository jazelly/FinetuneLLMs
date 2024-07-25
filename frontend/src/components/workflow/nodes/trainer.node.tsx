import React from 'react';

const TrainerNode: React.FC<any> = ({ data }) => (
  <div className="bg-gray-100 text-workflow-gray p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2">Trainer</h3>
    <div>Training method</div>
    <div>base model</div>
  </div>
);

export default TrainerNode;
