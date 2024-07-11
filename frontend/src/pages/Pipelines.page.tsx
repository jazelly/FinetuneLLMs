import StatusIcon from '@/components/reusable/StatusIcon.component';
import { JobDetail } from '@/types/dashboard.type';
import React from 'react';

interface Pipeline extends JobDetail {
  name: string;
  duration: string;
}

const Pipelines = () => {
  const pipelines: Partial<Pipeline>[] = [
    // Add your pipeline data here
    {
      id: 20009,
      name: 'cleanup: remove upsert logic when update workflow with forms',
      status: 'paused',
      createdAt: new Date(),
      duration: '2m 51s',
    },
    {
      id: 20008,
      name: 'cleanup: remove upsert logic when update workflow with forms',
      status: 'paused',
      createdAt: new Date(),
      duration: '1m 59s',
    },
    {
      id: 20007,
      name: 'Merged in WOR-5300-always-add-form (pull request #1969)',
      status: 'finished',
      createdAt: new Date(),
      duration: '1m 4s',
    },
    {
      id: 20006,
      name: '3.206.0',
      status: 'finished',
      createdAt: new Date(),
      duration: '51s',
    },
    {
      id: 20005,
      name: 'Merged in WOR-5300-always-add-form (pull request #1969)',
      status: 'running',
      createdAt: new Date(),
      duration: '1m 10s',
    },
  ];

  return (
    <div className="min-h-screen bg-main-workspace text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pipelines</h1>
          <div className="space-x-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Run pipeline
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Schedules
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Caches
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Usage
            </button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Pipeline
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Started
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((pipeline) => (
                <tr key={pipeline.id} className="border-b border-gray-700">
                  <td className="py-4 px-6 flex items-center space-x-2">
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {pipeline.name}
                      </p>
                      <p className="text-xs text-gray-400">{pipeline.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusIcon
                      size={30}
                      weight="bold"
                      status={pipeline.status as any}
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">
                    {pipeline.createdAt!.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">
                    {pipeline.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pipelines;
