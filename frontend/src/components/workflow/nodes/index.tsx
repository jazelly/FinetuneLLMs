import React from 'react';
import { memo } from 'react';
import type { NodeProps } from 'reactflow';
import { NodeComponentMap } from '../constants';
import BaseNode from './base/base.node';

const CustomNode = (props: NodeProps & { className: string }) => {
  const nodeData = props.data;
  const NodeComponent = NodeComponentMap[nodeData.type];
  console.log('nodeData', nodeData);

  return (
    <>
      <BaseNode {...props}>
        <NodeComponent />
      </BaseNode>
    </>
  );
};
CustomNode.displayName = 'CustomNode';

export default memo(CustomNode);
