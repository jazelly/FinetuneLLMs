import { NextRequest, NextResponse } from 'next/server';
import { workflowService } from '../service';
import { updateWorkflowSchema } from '../validation';

// GET /api/workflows/[id] - Get a workflow by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = await workflowService.getWorkflowById(params.id);
    
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(workflow);
  } catch (error) {
    console.error(`Error fetching workflow:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
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