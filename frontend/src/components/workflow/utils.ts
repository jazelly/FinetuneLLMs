import { Position, getConnectedEdges, getOutgoers } from 'reactflow';
import dagre from '@dagrejs/dagre';
import { v4 as uuid4 } from 'uuid';
import { cloneDeep, uniqBy } from 'lodash-es';
import type {
  Edge,
  InputVar,
  Node,
  ToolNodeType,
  ToolParameter,
  ToolWithProvider,
} from './types';
import { BlockEnum, CollectionType } from './types';
import {
  ITERATION_NODE_Z_INDEX,
  NODE_WIDTH_X_OFFSET,
  START_INITIAL_POSITION,
} from './constants';

const WHITE = 'WHITE';
const GRAY = 'GRAY';
const BLACK = 'BLACK';

const toType = (type: string) => {
  switch (type) {
    case 'string':
      return 'text-input';
    case 'number':
      return 'number-input';
    default:
      return type;
  }
};
export const toolParametersToFormSchemas = (parameters: ToolParameter[]) => {
  if (!parameters) return [];

  const formSchemas = parameters.map((parameter) => {
    return {
      ...parameter,
      variable: parameter.name,
      type: toType(parameter.type),
      _type: parameter.type,
      show_on: [],
      options: parameter.options?.map((option) => {
        return {
          ...option,
          show_on: [],
        };
      }),
      tooltip: parameter.human_description,
    };
  });
  return formSchemas;
};

const isCyclicUtil = (
  nodeId: string,
  color: Record<string, string>,
  adjaList: Record<string, string[]>,
  stack: string[]
) => {
  color[nodeId] = GRAY;
  stack.push(nodeId);

  for (let i = 0; i < adjaList[nodeId].length; ++i) {
    const childId = adjaList[nodeId][i];

    if (color[childId] === GRAY) {
      stack.push(childId);
      return true;
    }
    if (
      color[childId] === WHITE &&
      isCyclicUtil(childId, color, adjaList, stack)
    )
      return true;
  }
  color[nodeId] = BLACK;
  if (stack.length > 0 && stack[stack.length - 1] === nodeId) stack.pop();
  return false;
};

const getCycleEdges = (nodes: Node[], edges: Edge[]) => {
  const adjaList: Record<string, string[]> = {};
  const color: Record<string, string> = {};
  const stack: string[] = [];

  for (const node of nodes) {
    color[node.id] = WHITE;
    adjaList[node.id] = [];
  }

  for (const edge of edges) adjaList[edge.source]?.push(edge.target);

  for (let i = 0; i < nodes.length; i++) {
    if (color[nodes[i].id] === WHITE)
      isCyclicUtil(nodes[i].id, color, adjaList, stack);
  }

  const cycleEdges: Edge[] = [];
  if (stack.length > 0) {
    const cycleNodes = new Set(stack);
    for (const edge of edges) {
      if (cycleNodes.has(edge.source) && cycleNodes.has(edge.target))
        cycleEdges.push(edge);
    }
  }

  return cycleEdges;
};

export const initialNodes = (originNodes: Node[], originEdges: Edge[]) => {
  const nodes = cloneDeep(originNodes);
  const edges = cloneDeep(originEdges);
  const firstNode = nodes[0];

  if (!firstNode?.position) {
    nodes.forEach((node, index) => {
      node.position = {
        x: START_INITIAL_POSITION.x + index * NODE_WIDTH_X_OFFSET,
        y: START_INITIAL_POSITION.y,
      };
    });
  }

  const iterationNodeMap = nodes.reduce(
    (acc, node) => {
      if (node.parentId) {
        if (acc[node.parentId]) acc[node.parentId].push(node.id);
        else acc[node.parentId] = [node.id];
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  return nodes.map((node) => {
    node.type = 'custom';

    const connectedEdges = getConnectedEdges([node], edges);
    node.data._connectedSourceHandleIds = connectedEdges
      .filter((edge) => edge.source === node.id)
      .map((edge) => edge.sourceHandle || 'source');
    node.data._connectedTargetHandleIds = connectedEdges
      .filter((edge) => edge.target === node.id)
      .map((edge) => edge.targetHandle || 'target');

    if (node.data.type === BlockEnum.IfElse) {
      node.data._targetBranches = [
        {
          id: 'true',
          name: 'IS TRUE',
        },
        {
          id: 'false',
          name: 'IS FALSE',
        },
      ];
    }

    return node;
  });
};

export const initialEdges = (originEdges: Edge[], originNodes: Node[]) => {
  const nodes = cloneDeep(originNodes);
  const edges = cloneDeep(originEdges);
  let selectedNode: Node | null = null;
  const nodesMap = nodes.reduce(
    (acc, node) => {
      acc[node.id] = node;

      if (node.data?.selected) selectedNode = node;

      return acc;
    },
    {} as Record<string, Node>
  );

  const cycleEdges = getCycleEdges(nodes, edges);
  return edges
    .filter((edge) => {
      return !cycleEdges.find(
        (cycEdge) =>
          cycEdge.source === edge.source && cycEdge.target === edge.target
      );
    })
    .map((edge) => {
      edge.type = 'custom';

      if (!edge.sourceHandle) edge.sourceHandle = 'source';

      if (!edge.targetHandle) edge.targetHandle = 'target';

      if (!edge.data?.sourceType && edge.source && nodesMap[edge.source]) {
        edge.data = {
          ...edge.data,
          sourceType: nodesMap[edge.source].data.type!,
        } as any;
      }

      if (!edge.data?.targetType && edge.target && nodesMap[edge.target]) {
        edge.data = {
          ...edge.data,
          targetType: nodesMap[edge.target].data.type!,
        } as any;
      }

      if (selectedNode) {
        edge.data = {
          ...edge.data,
          _connectedNodeIsSelected:
            edge.source === selectedNode.id || edge.target === selectedNode.id,
        } as any;
      }
      return edge;
    });
};

export const getLayoutByDagre = (originNodes: Node[], originEdges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodes = cloneDeep(originNodes).filter((node) => !node.parentId);
  const edges = cloneDeep(originEdges).filter(
    (edge) => !edge.data?.isInIteration
  );
  dagreGraph.setGraph({
    rankdir: 'LR',
    align: 'UL',
    nodesep: 40,
    ranksep: 60,
    ranker: 'tight-tree',
    marginx: 30,
    marginy: 200,
  });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width!,
      height: node.height!,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return dagreGraph;
};

export const canRunBySingle = (nodeType: BlockEnum) => {
  return false;
};

type ConnectedSourceOrTargetNodesChange = {
  type: string;
  edge: Edge;
}[];
export const getNodesConnectedSourceOrTargetHandleIdsMap = (
  changes: ConnectedSourceOrTargetNodesChange,
  nodes: Node[]
) => {
  const nodesConnectedSourceOrTargetHandleIdsMap = {} as Record<string, any>;

  changes.forEach((change) => {
    const { edge, type } = change;
    const sourceNode = nodes.find((node) => node.id === edge.source)!;
    if (sourceNode) {
      nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id] =
        nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id] || {
          _connectedSourceHandleIds: [
            ...(sourceNode?.data._connectedSourceHandleIds || []),
          ],
          _connectedTargetHandleIds: [
            ...(sourceNode?.data._connectedTargetHandleIds || []),
          ],
        };
    }

    const targetNode = nodes.find((node) => node.id === edge.target)!;
    if (targetNode) {
      nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id] =
        nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id] || {
          _connectedSourceHandleIds: [
            ...(targetNode?.data._connectedSourceHandleIds || []),
          ],
          _connectedTargetHandleIds: [
            ...(targetNode?.data._connectedTargetHandleIds || []),
          ],
        };
    }

    if (sourceNode) {
      if (type === 'remove') {
        const index = nodesConnectedSourceOrTargetHandleIdsMap[
          sourceNode.id
        ]._connectedSourceHandleIds.findIndex(
          (handleId: string) => handleId === edge.sourceHandle
        );
        nodesConnectedSourceOrTargetHandleIdsMap[
          sourceNode.id
        ]._connectedSourceHandleIds.splice(index, 1);
      }

      if (type === 'add')
        nodesConnectedSourceOrTargetHandleIdsMap[
          sourceNode.id
        ]._connectedSourceHandleIds.push(edge.sourceHandle || 'source');
    }

    if (targetNode) {
      if (type === 'remove') {
        const index = nodesConnectedSourceOrTargetHandleIdsMap[
          targetNode.id
        ]._connectedTargetHandleIds.findIndex(
          (handleId: string) => handleId === edge.targetHandle
        );
        nodesConnectedSourceOrTargetHandleIdsMap[
          targetNode.id
        ]._connectedTargetHandleIds.splice(index, 1);
      }

      if (type === 'add')
        nodesConnectedSourceOrTargetHandleIdsMap[
          targetNode.id
        ]._connectedTargetHandleIds.push(edge.targetHandle || 'target');
    }
  });

  return nodesConnectedSourceOrTargetHandleIdsMap;
};

export const generateNewNode = ({
  data,
  position,
  id,
  zIndex,
  ...rest
}: Omit<Node, 'id'> & { id?: string }) => {
  return {
    id: id || `${Date.now()}`,
    type: 'custom',
    data,
    position,
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    zIndex,
    ...rest,
  } as Node;
};

export const genNewNodeTitleFromOld = (oldTitle: string) => {
  const regex = /^(.+?)\s*\((\d+)\)\s*$/;
  const match = oldTitle.match(regex);

  if (match) {
    const title = match[1];
    const num = parseInt(match[2], 10);
    return `${title} (${num + 1})`;
  } else {
    return `${oldTitle} (1)`;
  }
};

export const getValidTreeNodes = (nodes: Node[], edges: Edge[]) => {
  const startNode = nodes.find((node) => node.data.type === BlockEnum.Start);

  if (!startNode) {
    return {
      validNodes: [],
      maxDepth: 0,
    };
  }

  const list: Node[] = [startNode];
  let maxDepth = 1;

  const traverse = (root: Node, depth: number) => {
    if (depth > maxDepth) maxDepth = depth;

    const outgoers = getOutgoers(root, nodes, edges);

    if (outgoers.length) {
      outgoers.forEach((outgoer) => {
        list.push(outgoer);
        traverse(outgoer, depth + 1);
      });
    } else {
      list.push(root);
    }
  };

  traverse(startNode, maxDepth);

  return {
    validNodes: uniqBy(list, 'id'),
    maxDepth,
  };
};

export const getToolCheckParams = (
  toolData: ToolNodeType,
  buildInTools: ToolWithProvider[],
  customTools: ToolWithProvider[],
  workflowTools: ToolWithProvider[],
  language: string
) => {
  const { provider_id, provider_type, tool_name } = toolData;
  const isBuiltIn = provider_type === CollectionType.builtIn;
  const currentTools =
    provider_type === CollectionType.builtIn
      ? buildInTools
      : provider_type === CollectionType.custom
        ? customTools
        : workflowTools;
  const currCollection = currentTools.find((item) => item.id === provider_id);
  const currTool = currCollection?.tools.find(
    (tool) => tool.name === tool_name
  );
  const formSchemas = currTool
    ? toolParametersToFormSchemas(currTool.parameters)
    : [];
  const toolInputVarSchema = formSchemas.filter(
    (item: any) => item.form === 'llm'
  );
  const toolSettingSchema = formSchemas.filter(
    (item: any) => item.form !== 'llm'
  );

  return {
    toolInputsSchema: (() => {
      const formInputs: InputVar[] = [];
      toolInputVarSchema.forEach((item: any) => {
        formInputs.push({
          label: item.label[language] || item.label.en_US,
          variable: item.variable,
          type: item.type,
          required: item.required,
        });
      });
      return formInputs;
    })(),
    notAuthed: isBuiltIn && toolSettingSchema,
    language,
  };
};

export const changeNodesAndEdgesId = (nodes: Node[], edges: Edge[]) => {
  const idMap = nodes.reduce(
    (acc, node) => {
      acc[node.id] = uuid4();

      return acc;
    },
    {} as Record<string, string>
  );

  const newNodes = nodes.map((node) => {
    return {
      ...node,
      id: idMap[node.id],
    };
  });

  const newEdges = edges.map((edge) => {
    return {
      ...edge,
      source: idMap[edge.source],
      target: idMap[edge.target],
    };
  });

  return [newNodes, newEdges] as [Node[], Edge[]];
};

export const isMac = () => {
  return navigator.userAgent.toUpperCase().includes('MAC');
};

const specialKeysNameMap: Record<string, string | undefined> = {
  ctrl: '⌘',
  alt: '⌥',
};

export const getKeyboardKeyNameBySystem = (key: string) => {
  if (isMac()) return specialKeysNameMap[key] || key;

  return key;
};

const specialKeysCodeMap: Record<string, string | undefined> = {
  ctrl: 'meta',
};

export const getKeyboardKeyCodeBySystem = (key: string) => {
  if (isMac()) return specialKeysCodeMap[key] || key;

  return key;
};

export const getTopLeftNodePosition = (nodes: Node[]) => {
  let minX = Infinity;
  let minY = Infinity;

  nodes.forEach((node) => {
    if (node.position.x < minX) minX = node.position.x;

    if (node.position.y < minY) minY = node.position.y;
  });

  return {
    x: minX,
    y: minY,
  };
};

export const isEventTargetInputArea = (target: HTMLElement) => {
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return true;

  if (target.contentEditable === 'true') return true;
};
