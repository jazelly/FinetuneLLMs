import React, { memo, useCallback, useState } from 'react';
import cn from 'classnames';
import { intersection } from 'lodash-es';
import type { EdgeProps } from 'reactflow';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useNodes,
} from 'reactflow';
import { useAvailableBlocks, useNodesInteractions } from './hooks/hooks';
import BlockSelector from './block-selector';
import type { Edge, OnSelectBlock } from './types';

const CustomEdge = ({
  id,
  data,
  source,
  sourceHandleId,
  target,
  targetHandleId,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}: EdgeProps) => {
  const nodes = useNodes();

  console.log('source', source);
  console.log('target', target);
  const sourceNode = nodes.find((node) => node.id === source);
  const targetNode = nodes.find((node) => node.id === target);
  console.log('sourceNode', sourceNode);
  console.log('targetNode', targetNode);
  const sourceNodeHeight = sourceNode?.height || 240;
  const targetNodeHeight = targetNode?.height || 240;

  console.log(sourceY, sourceNodeHeight, targetY, targetNodeHeight);

  // Adjust sourceY and targetY based on node heights
  const adjustedSourceY = sourceY + sourceNodeHeight / 2;
  const adjustedTargetY = targetY - 20;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sourceX,
    sourceY: adjustedSourceY,
    sourcePosition: Position.Bottom,
    targetX: targetX + 128,
    targetY: adjustedTargetY,
    targetPosition: Position.Top,
    curvature: 0.16,
  });
  const [open, setOpen] = useState(false);
  const { handleNodeAdd } = useNodesInteractions();
  const { availablePrevBlocks } = useAvailableBlocks(
    (data as Edge['data'])!.targetType
  );
  const { availableNextBlocks } = useAvailableBlocks(
    (data as Edge['data'])!.sourceType
  );

  const handleOpenChange = useCallback((v: boolean) => {
    setOpen(v);
  }, []);

  const handleInsert = useCallback<OnSelectBlock>(
    (nodeType, toolDefaultValue) => {
      handleNodeAdd(
        {
          nodeType,
          toolDefaultValue,
        },
        {
          prevNodeId: source,
          prevNodeSourceHandle: sourceHandleId || 'source',
          nextNodeId: target,
          nextNodeTargetHandle: targetHandleId || 'target',
        }
      );
    },
    [handleNodeAdd, source, sourceHandleId, target, targetHandleId]
  );

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke:
            selected || data?._connectedNodeIsHovering || data?._runned
              ? '#2970FF'
              : '#D0D5DD',
          strokeWidth: 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className={cn(
            'nopan nodrag hover:scale-125',
            data?._hovering ? 'block' : 'hidden',
            open && '!block'
          )}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <BlockSelector
            open={open}
            onOpenChange={handleOpenChange}
            asChild
            onSelect={handleInsert}
            availableBlocksTypes={intersection(
              availablePrevBlocks,
              availableNextBlocks
            )}
            triggerClassName={() => 'hover:scale-150 transition-all'}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(CustomEdge);
