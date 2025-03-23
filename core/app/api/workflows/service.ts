import prisma from '@/app/lib/prisma';
import { Workflow, WorkflowNode, WorkflowEdge } from '@prisma/client';
import { CreateWorkflowInput, UpdateWorkflowInput } from './validation';

type WorkflowWithRelations = Workflow & {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export const workflowService = {
  // Create a new workflow with nodes and edges
  async createWorkflow(data: CreateWorkflowInput): Promise<WorkflowWithRelations> {
    return prisma.workflow.create({
      data: {
        name: data.name,
        description: data.description,
        zoom: data.zoom || 1,
        nodes: {
          create: data.nodes.map(node => ({
            type: node.type,
            positionX: node.positionX,
            positionY: node.positionY,
            data: node.data,
          })),
        },
        edges: {
          create: data.edges.map(edge => ({
            sourceNodeId: edge.sourceNodeId,
            targetNodeId: edge.targetNodeId,
          })),
        },
      },
      include: {
        nodes: true,
        edges: true,
      },
    });
  },

  // Get all workflows (without nodes and edges for performance)
  async getAllWorkflows(): Promise<Workflow[]> {
    return prisma.workflow.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  },

  // Get a workflow by ID with all nodes and edges
  async getWorkflowById(id: string): Promise<WorkflowWithRelations | null> {
    try {
      console.log(`Fetching workflow with ID: ${id}`);
      const workflow = await prisma.workflow.findUnique({
        where: { id },
        include: {
          nodes: true,
          edges: true,
        },
      });
      console.log(`Found workflow: ${workflow ? 'yes' : 'no'}`);
      if (workflow) {
        console.log(`Nodes count: ${workflow.nodes.length}, Edges count: ${workflow.edges.length}`);
      }
      return workflow;
    } catch (error) {
      console.error(`Error in getWorkflowById:`, error);
      throw error;
    }
  },

  // Update a workflow and its nodes and edges
  async updateWorkflow(id: string, data: UpdateWorkflowInput): Promise<WorkflowWithRelations> {
    // Start a transaction to ensure data consistency
    return prisma.$transaction(async (tx) => {
      // Update workflow basic info
      const workflow = await tx.workflow.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          zoom: data.zoom,
        },
      });

      // If nodes are provided, update them
      if (data.nodes) {
        // Delete existing nodes not in the update
        const existingNodeIds = data.nodes
          .filter(node => node.id)
          .map(node => node.id as string);
        
        // Delete nodes that aren't in the update list
        if (existingNodeIds.length > 0) {
          await tx.workflowNode.deleteMany({
            where: {
              workflowId: id,
              id: { notIn: existingNodeIds },
            },
          });
        } else {
          // Delete all nodes if no existing IDs were provided
          await tx.workflowNode.deleteMany({
            where: { workflowId: id },
          });
        }

        // Upsert each node
        for (const node of data.nodes) {
          if (node.id) {
            // Check if node exists before updating
            const existingNode = await tx.workflowNode.findUnique({
              where: { id: node.id }
            });
            
            if (existingNode) {
              // Update existing node
              console.log(`Updating node: ${{
                type: node.type,
                positionX: node.positionX,
                positionY: node.positionY,
                data: node.data,
              }}`);
              await tx.workflowNode.update({
                where: { id: node.id },
                data: {
                  type: node.type,
                  positionX: node.positionX,
                  positionY: node.positionY,
                  data: node.data,
                },
              });
            } else {
              // Node with provided ID not found, create a new one
              console.log(`Node with ID ${node.id} not found, creating new node`);
              await tx.workflowNode.create({
                data: {
                  workflowId: id,
                  type: node.type,
                  positionX: node.positionX,
                  positionY: node.positionY,
                  data: node.data,
                },
              });
            }
          } else {
            // Create new node
            await tx.workflowNode.create({
              data: {
                workflowId: id,
                type: node.type,
                positionX: node.positionX,
                positionY: node.positionY,
                data: node.data,
              },
            });
          }
        }
      }

      // If edges are provided, update them
      if (data.edges) {
        // Delete existing edges not in the update
        const existingEdgeIds = data.edges
          .filter(edge => edge.id)
          .map(edge => edge.id as string);
        
        // Delete edges that aren't in the update list
        if (existingEdgeIds.length > 0) {
          await tx.workflowEdge.deleteMany({
            where: {
              workflowId: id,
              id: { notIn: existingEdgeIds },
            },
          });
        } else {
          // Delete all edges if no existing IDs were provided
          await tx.workflowEdge.deleteMany({
            where: { workflowId: id },
          });
        }

        // Upsert each edge
        for (const edge of data.edges) {
          if (edge.id) {
            // Check if edge exists before updating
            const existingEdge = await tx.workflowEdge.findUnique({
              where: { id: edge.id }
            });
            
            if (existingEdge) {
              // Update existing edge
              await tx.workflowEdge.update({
                where: { id: edge.id },
                data: {
                  sourceNodeId: edge.sourceNodeId,
                  targetNodeId: edge.targetNodeId,
                },
              });
            } else {
              // Edge with provided ID not found, create a new one
              console.log(`Edge with ID ${edge.id} not found, creating new edge`);
              await tx.workflowEdge.create({
                data: {
                  workflowId: id,
                  sourceNodeId: edge.sourceNodeId,
                  targetNodeId: edge.targetNodeId,
                },
              });
            }
          } else {
            // Create new edge
            await tx.workflowEdge.create({
              data: {
                workflowId: id,
                sourceNodeId: edge.sourceNodeId,
                targetNodeId: edge.targetNodeId,
              },
            });
          }
        }
      }

      // Return the updated workflow with relationships
      return tx.workflow.findUniqueOrThrow({
        where: { id },
        include: {
          nodes: true,
          edges: true,
        },
      });
    });
  },

  // Delete a workflow (cascades to nodes and edges via Prisma schema)
  async deleteWorkflow(id: string): Promise<void> {
    await prisma.workflow.delete({
      where: { id },
    });
  },
};