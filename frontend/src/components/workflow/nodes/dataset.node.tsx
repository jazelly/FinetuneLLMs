import React from 'react';

const DatasetNode: React.FC<any> = ({ data }) => (
  <div className="bg-blue-100 p-4 rounded-lg text-workflow-gray shadow-md">
    <h3 className="text-lg font-semibold mb-2">Dataset</h3>
    <div>dataset name</div>
    <div>description</div>
  </div>
);

export default DatasetNode;
