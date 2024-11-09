import React from 'react';
import { memo } from 'react';
import type { ConnectionLineComponentProps } from 'reactflow';
import { Position, getBezierPath } from 'reactflow';

const CustomConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) => {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: Position.Bottom,
    targetX: toX,
    targetY: toY,
    targetPosition: Position.Top,
    curvature: 0.16,
  });

  const markerEnd = {
    type: 'arrow',
    color: '#D0D5DD',
    width: 20,
    height: 20,
    markerUnits: 'strokeWidth',
  };

  return (
    <g>
      <defs>
        <marker
          id="custom-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth={markerEnd.width}
          markerHeight={markerEnd.height}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={markerEnd.color} />
        </marker>
      </defs>

      {/* The connection path with arrow marker */}
      <path
        fill="none"
        stroke="#D0D5DD"
        strokeWidth={2}
        d={edgePath}
        markerEnd="url(#custom-arrow)"
      />
    </g>
  );
};

export default memo(CustomConnectionLine);
