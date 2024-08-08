import { Node } from '@/components/workflow/types';
import React, { createContext, useState, ReactNode } from 'react';

export interface NodeDetailState {
  selectedNode: Node | undefined;
  setSelectedNode: (Node: Node | undefined) => void;
}

const initialState: NodeDetailState = {
  selectedNode: undefined,
  setSelectedNode: () => {},
};

export const NodeDetailContext = createContext<NodeDetailState>(initialState);

type NodeDetailStateProps = {
  children: ReactNode;
};

export const NodeDetailStateProvider: React.FC<NodeDetailStateProps> = ({
  children,
}) => {
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

  return (
    <NodeDetailContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </NodeDetailContext.Provider>
  );
};
