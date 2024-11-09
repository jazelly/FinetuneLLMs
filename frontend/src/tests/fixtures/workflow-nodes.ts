import { BlockEnum, Edge, Node } from '@/components/workflow/types';
import { v4 } from 'uuid';

interface WorkflowNode {
  id: string;
  children: string[];
  type: BlockEnum;
}

const ids = Array.from({ length: 4 }, () => v4());
export const mockNodes: Record<string, WorkflowNode> = {
  [ids[0]]: {
    id: ids[0],
    type: BlockEnum.Start,
    children: [ids[1]],
  },
  [ids[1]]: {
    id: ids[1],
    type: BlockEnum.Model,
    children: [ids[2]],
  },
  [ids[2]]: {
    id: ids[2],
    type: BlockEnum.Dataset,
    children: [ids[3]],
  },
  [ids[3]]: {
    id: ids[3],
    type: BlockEnum.Train,
    children: [],
  },
};

export const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 250, y: 5 },
    width: 240,
    height: 60,
    data: { id: '1', title: 'Start', desc: '', type: BlockEnum.Start },
  },
  {
    id: '2',
    position: { x: 250, y: 200 },
    width: 240,
    height: 100,
    data: {
      id: '2',
      title: 'Dataset',
      desc: '',
      type: BlockEnum.Dataset,
      datasetName: 'soulhq-ai/insuranceQA-v2',
    },
  },
  {
    id: '3',
    position: { x: 250, y: 400 },
    width: 240,
    height: 100,
    data: {
      id: '3',
      title: 'Model',
      desc: '',
      type: BlockEnum.Model,
      modelName: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
    },
  },
  {
    id: '4',
    position: { x: 250, y: 800 },
    width: 240,
    height: 140,
    data: {
      id: '4',
      title: 'Train',
      desc: '',
      type: BlockEnum.Train,
      trainingMethod: 'sft',
    },
  },
];

// Initial edges
export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    data: {
      _hovering: false,
      _connectedNodeIsHovering: false,
      _connectedNodeIsSelected: false,
      _runned: false,
      _isBundled: false,
      sourceType: BlockEnum.Start,
      targetType: BlockEnum.Dataset,
    },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    data: {
      _hovering: false,
      _connectedNodeIsHovering: false,
      _connectedNodeIsSelected: false,
      _runned: false,
      _isBundled: false,
      sourceType: BlockEnum.Dataset,
      targetType: BlockEnum.Model,
    },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    data: {
      _hovering: false,
      _connectedNodeIsHovering: false,
      _connectedNodeIsSelected: false,
      _runned: false,
      _isBundled: false,
      sourceType: BlockEnum.Model,
      targetType: BlockEnum.Train,
    },
  },
];
