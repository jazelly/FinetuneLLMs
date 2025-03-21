import { NextRequest, NextResponse } from 'next/server';
import { workflowService } from './workflow.service';
import { createWorkflowSchema, updateWorkflowSchema } from './workflow.validation';

// GET /api/workflows - Get all workflows
export async function GET() {
  try {
    const workflows = await workflowService.getAllWorkflows();
    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = createWorkflowSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const workflow = await workflowService.createWorkflow(result.data);
    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}

// PUT /api/workflows/[id] - Update a workflow
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = updateWorkflowSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const workflow = await workflowService.updateWorkflow(params.id, result.data);
    return NextResponse.json(workflow);
  } catch (error) {
    console.error(`Error updating workflow:`, error);
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    );
  }
}

// DELETE /api/workflows/[id] - Delete a workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await workflowService.deleteWorkflow(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting workflow:`, error);
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    );
  }
}