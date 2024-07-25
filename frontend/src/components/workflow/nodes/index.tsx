import { memo } from 'react';
import type { NodeProps } from 'reactflow';
import type { Node } from '../types';
import { NodeComponentMap } from '../constants';
import BaseNode from './base/base.node';
import React from 'react';

const CustomNode = (props: NodeProps) => {
  const nodeData = props.data;
  const NodeComponent = NodeComponentMap[nodeData.type];

  return (
    <>
      <BaseNode {...props}>
        <NodeComponent />
      </BaseNode>
    </>
  );
};

export default memo(CustomNode);
