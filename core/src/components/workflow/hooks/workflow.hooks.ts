"use client";

import { useCallback, useState } from 'react';
import { Workflow, WorkflowNode, WorkflowEdge } from '@prisma/client';

type WorkflowWithRelations = Workflow & {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export function useWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all workflows
  const fetchWorkflows = useCallback(async (): Promise<Workflow[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/workflows');
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single workflow by ID
  const fetchWorkflow = useCallback(async (id: string): Promise<WorkflowWithRelations | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/workflows/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch workflow: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new workflow
  const createWorkflow = async (data: any): Promise<WorkflowWithRelations | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workflow');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing workflow
  const updateWorkflow = async (id: string, data: any): Promise<WorkflowWithRelations | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update workflow');
      }
      
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a workflow
  const deleteWorkflow = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete workflow');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchWorkflows,
    fetchWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}