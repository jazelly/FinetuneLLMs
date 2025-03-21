'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkflow } from '@/src/components/workflow/hooks/workflow.hooks';
import { WorkflowReactFlowProvider } from '@/src/components/workflow';
import { ReactFlow, Background } from 'reactflow';
import 'reactflow/dist/style.css';

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { loading, error, fetchWorkflow, deleteWorkflow } = useWorkflow();
  const [isLoading, setIsLoading] = useState(true);
  const [workflowData, setWorkflowData] = useState<any>(null);

  useEffect(() => {
    async function loadWorkflow() {
      setIsLoading(true);
      try {
        const data = await fetchWorkflow(params.id);
        if (data) {
          setWorkflowData(data);
        } else {
          // If workflow not found, redirect to workflows list
          router.push('/workflows');
        }
      } catch (err) {
        console.error('Error loading workflow:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkflow();
  }, [params.id, fetchWorkflow, router]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      const success = await deleteWorkflow(params.id);
      if (success) {
        router.push('/workflows');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/workflows')}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Back to Workflows
          </button>
        </div>
      </div>
    );
  }

  if (!workflowData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Workflow not found</p>
          <p>The requested workflow could not be found.</p>
          <button 
            onClick={() => router.push('/workflows')}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
          >
            Back to Workflows
          </button>
        </div>
      </div>
    );
  }

  // Transform Prisma data to the format expected by ReactFlow
  const reactFlowNodes = workflowData.nodes.map((node: any) => ({
    id: node.nodeId,
    type: 'custom',
    position: { x: node.positionX, y: node.positionY },
    data: { ...node.data, type: node.type },
  }));

  const reactFlowEdges = workflowData.edges.map((edge: any) => ({
    id: edge.id,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    type: 'custom',
  }));

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{workflowData.name}</h1>
          {workflowData.description && (
            <p className="text-sm text-gray-600 mt-1">{workflowData.description}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/workflows/${params.id}/edit`)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
          >
            Edit Workflow
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-50 border border-red-300 text-red-700 py-2 px-4 rounded-md hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex-grow">
        {/* Use React Flow's global context provider */}
        <WorkflowReactFlowProvider>
          <div className="h-full w-full">
            {/* Directly render ReactFlow instead of WorkflowContainer to avoid prop type issues */}
            <ReactFlow
              nodes={reactFlowNodes}
              edges={reactFlowEdges}
              defaultViewport={{ x: 0, y: 0, zoom: workflowData.zoom || 1 }}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
            >
              <Background gap={12} size={1} color="#f1f1f1" />
            </ReactFlow>
          </div>
        </WorkflowReactFlowProvider>
      </div>
    </div>
  );
} 