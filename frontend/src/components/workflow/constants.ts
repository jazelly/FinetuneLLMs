import type { Var } from './types';
import { BlockEnum, VarType } from './types';
import StartNodeDefault from './nodes/start/default';
import IfElseDefault from './nodes/if-else/default';
import { ComponentType } from 'react';
import StartNode from './nodes/start';
import IfElseNode from './nodes/if-else';
import DatasetNode, { DatasetDefault } from './nodes/Dataset';
import ModelNode, { ModelDefault } from './nodes/Model';
import TrainNode, { TrainDefault } from './nodes/Train';

type NodesExtraData = {
  author: string;
  about: string;
  availablePrevNodes: BlockEnum[];
  availableNextNodes: BlockEnum[];
  getAvailablePrevNodes: () => BlockEnum[];
  getAvailableNextNodes: () => BlockEnum[];
  checkValid: any;
};
export const NodeComponentMap: Record<string, ComponentType<any>> = {
  [BlockEnum.Start]: StartNode,
  [BlockEnum.IfElse]: IfElseNode,
  [BlockEnum.Dataset]: DatasetNode,
  [BlockEnum.Model]: ModelNode,
  [BlockEnum.Train]: TrainNode,
};

export const NODES_EXTRA_DATA: Record<BlockEnum, NodesExtraData> = {
  [BlockEnum.Start]: {
    author: 'Vertile',
    about: '',
    availablePrevNodes: [],
    availableNextNodes: [],
    getAvailablePrevNodes: StartNodeDefault.getAvailablePrevNodes,
    getAvailableNextNodes: StartNodeDefault.getAvailableNextNodes,
    checkValid: StartNodeDefault.checkValid,
  },
  [BlockEnum.IfElse]: {
    author: 'Vertile',
    about: '',
    availablePrevNodes: [],
    availableNextNodes: [],
    getAvailablePrevNodes: IfElseDefault.getAvailablePrevNodes,
    getAvailableNextNodes: IfElseDefault.getAvailableNextNodes,
    checkValid: IfElseDefault.checkValid,
  },
  [BlockEnum.Dataset]: {
    author: 'Vertile',
    about: '',
    availablePrevNodes: [],
    availableNextNodes: [],
    getAvailablePrevNodes: DatasetDefault.getAvailablePrevNodes,
    getAvailableNextNodes: DatasetDefault.getAvailableNextNodes,
    checkValid: DatasetDefault.checkValid,
  },
  [BlockEnum.Model]: {
    author: 'Vertile',
    about: '',
    availablePrevNodes: [],
    availableNextNodes: [],
    getAvailablePrevNodes: ModelDefault.getAvailablePrevNodes,
    getAvailableNextNodes: ModelDefault.getAvailableNextNodes,
    checkValid: ModelDefault.checkValid,
  },
  [BlockEnum.Train]: {
    author: 'Vertile',
    about: '',
    availablePrevNodes: [],
    availableNextNodes: [],
    getAvailablePrevNodes: TrainDefault.getAvailablePrevNodes,
    getAvailableNextNodes: TrainDefault.getAvailableNextNodes,
    checkValid: TrainDefault.checkValid,
  },
};

export const ALL_CHAT_AVAILABLE_BLOCKS = Object.keys(NODES_EXTRA_DATA).filter(
  (key) => key !== BlockEnum.Start
) as BlockEnum[];
export const ALL_COMPLETION_AVAILABLE_BLOCKS = Object.keys(
  NODES_EXTRA_DATA
).filter((key) => key !== BlockEnum.Start) as BlockEnum[];

export const NODES_INITIAL_DATA = {
  [BlockEnum.Start]: {
    type: BlockEnum.Start,
    title: '',
    desc: '',
    ...StartNodeDefault.defaultValue,
  },
  [BlockEnum.IfElse]: {
    type: BlockEnum.IfElse,
    title: 'If Else',
    desc: '',
    ...IfElseDefault.defaultValue,
  },
  [BlockEnum.Dataset]: {
    type: BlockEnum.Dataset,
    title: 'Dataset',
    desc: '',
    ...DatasetDefault.defaultValue,
  },
  [BlockEnum.Train]: {
    type: BlockEnum.Train,
    title: 'Training Node',
    desc: '',
    ...TrainDefault.defaultValue,
  },
};

export const NODE_WIDTH = 240;
export const X_OFFSET = 60;
export const NODE_WIDTH_X_OFFSET = NODE_WIDTH + X_OFFSET;
export const Y_OFFSET = 39;
export const MAX_TREE_DEEPTH = 50;
export const START_INITIAL_POSITION = { x: 80, y: 282 };
export const AUTO_LAYOUT_OFFSET = {
  x: -42,
  y: 243,
};
export const ITERATION_NODE_Z_INDEX = 1;
export const ITERATION_CHILDREN_Z_INDEX = 1002;
export const ITERATION_PADDING = {
  top: 85,
  right: 16,
  bottom: 20,
  left: 16,
};

export const RETRIEVAL_OUTPUT_STRUCT = `{
  "content": "",
  "title": "",
  "url": "",
  "icon": "",
  "metadata": {
    "dataset_id": "",
    "dataset_name": "",
    "document_id": [],
    "document_name": "",
    "document_data_source_type": "",
    "segment_id": "",
    "segment_position": "",
    "segment_word_count": "",
    "segment_hit_count": "",
    "segment_index_node_hash": "",
    "score": ""
  }
}`;

export const SUPPORT_OUTPUT_VARS_NODE = [BlockEnum.Start];

export const LLM_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'text',
    type: VarType.string,
  },
];

export const KNOWLEDGE_RETRIEVAL_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'result',
    type: VarType.arrayObject,
  },
];

export const TEMPLATE_TRANSFORM_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'output',
    type: VarType.string,
  },
];

export const QUESTION_CLASSIFIER_OUTPUT_STRUCT = [
  {
    variable: 'class_name',
    type: VarType.string,
  },
];

export const HTTP_REQUEST_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'body',
    type: VarType.string,
  },
  {
    variable: 'status_code',
    type: VarType.number,
  },
  {
    variable: 'headers',
    type: VarType.string,
  },
  {
    variable: 'files',
    type: VarType.arrayFile,
  },
];

export const TOOL_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'text',
    type: VarType.string,
  },
  {
    variable: 'files',
    type: VarType.arrayFile,
  },
];

export const PARAMETER_EXTRACTOR_COMMON_STRUCT: Var[] = [
  {
    variable: '__is_success',
    type: VarType.number,
  },
  {
    variable: '__reason',
    type: VarType.string,
  },
];

export const WORKFLOW_DATA_UPDATE = 'WORKFLOW_DATA_UPDATE';
