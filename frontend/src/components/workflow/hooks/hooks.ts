import produce from 'immer';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockEnum, WorkflowRunningStatus } from '../types';
import {
  ITERATION_CHILDREN_Z_INDEX,
  ITERATION_PADDING,
  NODE_WIDTH_X_OFFSET,
  NODES_EXTRA_DATA,
  NODES_INITIAL_DATA,
  SUPPORT_OUTPUT_VARS_NODE,
  X_OFFSET,
  Y_OFFSET,
} from '../constants';
import { useStore, useWorkflowStore } from '../store';
import {
  Connection,
  Edge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  NodeDragHandler,
  NodeMouseHandler,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  ResizeParamsWithDirection,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import type {
  CommonNodeType,
  Node,
  OnNodeAdd,
  ToolDefaultValue,
  ValueSelector,
} from '../types';
import { useNodeIterationInteractions } from './use-interactions';
import {
  generateNewNode,
  genNewNodeTitleFromOld,
  getLayoutByDagre,
  getNodesConnectedSourceOrTargetHandleIdsMap,
  getTopLeftNodePosition,
} from '../utils';
import { uniqBy } from 'lodash-es';
import { useI18N } from '../context';
import { useNodesSyncDraft } from './use-nodes-sync-draft';
import dayjs from 'dayjs';

export const useNodesExtraData = () => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      produce(NODES_EXTRA_DATA, (draft) => {
        Object.keys(draft).forEach((key) => {
          draft[key as BlockEnum].about = t(`workflow.blocksAbout.${key}`);
          draft[key as BlockEnum].availablePrevNodes =
            draft[key as BlockEnum].getAvailablePrevNodes();
          draft[key as BlockEnum].availableNextNodes =
            draft[key as BlockEnum].getAvailableNextNodes();
        });
      }),
    [t]
  );
};

export const useNodesReadOnly = () => {
  const workflowStore = useWorkflowStore();
  const workflowRunningData = useStore((s) => s.workflowRunningData);
  const historyWorkflowData = useStore((s) => s.historyWorkflowData);
  const isRestoring = useStore((s) => s.isRestoring);

  const getNodesReadOnly = useCallback(() => {
    const { workflowRunningData, historyWorkflowData, isRestoring } =
      workflowStore.getState();

    return (
      workflowRunningData?.result.status === WorkflowRunningStatus.Running ||
      historyWorkflowData ||
      isRestoring
    );
  }, [workflowStore]);

  return {
    nodesReadOnly: !!(
      workflowRunningData?.result.status === WorkflowRunningStatus.Running ||
      historyWorkflowData ||
      isRestoring
    ),
    getNodesReadOnly,
  };
};

export const usePanelInteractions = () => {
  const workflowStore = useWorkflowStore();

  const handlePaneContextMenu = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>) => {
      e.preventDefault();
      const container = document.querySelector('#workflow-container');
      const { x, y } = container!.getBoundingClientRect();
      workflowStore.setState({
        panelMenu: {
          top: e.clientY - y,
          left: e.clientX - x,
        },
      });
    },
    [workflowStore]
  );

  const handlePaneContextmenuCancel = useCallback(() => {
    workflowStore.setState({
      panelMenu: undefined,
    });
  }, [workflowStore]);

  const handleNodeContextmenuCancel = useCallback(() => {
    workflowStore.setState({
      nodeMenu: undefined,
    });
  }, [workflowStore]);

  return {
    handlePaneContextMenu,
    handlePaneContextmenuCancel,
    handleNodeContextmenuCancel,
  };
};

export const useWorkflow = () => {
  const { locale } = useI18N();
  const store = useStoreApi();
  const reactflow = useReactFlow();
  const workflowStore = useWorkflowStore();
  const nodesExtraData = useNodesExtraData();
  const { handleSyncWorkflowDraft } = useNodesSyncDraft();

  const setPanelWidth = useCallback(
    (width: number) => {
      localStorage.setItem('workflow-node-panel-width', `${width}`);
      workflowStore.setState({ panelWidth: width });
    },
    [workflowStore]
  );

  const handleLayout = useCallback(async () => {
    workflowStore.setState({ nodeAnimation: true });
    const { getNodes, edges, setNodes } = store.getState();
    const { setViewport } = reactflow;
    const nodes = getNodes();
    const layout = getLayoutByDagre(nodes, edges);
    const rankMap = {} as Record<string, Node>;

    nodes.forEach((node) => {
      if (!node.parentId) {
        const rank = layout.node(node.id).rank!;

        if (!rankMap[rank]) {
          rankMap[rank] = node;
        } else {
          if (rankMap[rank].position.y > node.position.y) rankMap[rank] = node;
        }
      }
    });

    const newNodes = produce(nodes, (draft) => {
      draft.forEach((node) => {
        if (!node.parentId) {
          const nodeWithPosition = layout.node(node.id);

          node.position = {
            x: nodeWithPosition.x - node.width! / 2,
            y:
              nodeWithPosition.y -
              node.height! / 2 +
              rankMap[nodeWithPosition.rank!].height! / 2,
          };
        }
      });
    });
    setNodes(newNodes);
    const zoom = 0.7;
    setViewport({
      x: 0,
      y: 0,
      zoom,
    });
    setTimeout(() => {
      handleSyncWorkflowDraft();
    });
  }, [store, reactflow, handleSyncWorkflowDraft, workflowStore]);

  const getTreeLeafNodes = useCallback(
    (nodeId: string) => {
      const { getNodes, edges } = store.getState();
      const nodes = getNodes();
      let startNode = nodes.find((node) => node.data.type === BlockEnum.Start);
      const currentNode = nodes.find((node) => node.id === nodeId);

      if (currentNode?.parentId)
        startNode = nodes.find(
          (node) =>
            node.parentId === currentNode.parentId && node.data.isIterationStart
        );

      if (!startNode) return [];

      const list: Node[] = [];
      const preOrder = (root: Node, callback: (node: Node) => void) => {
        if (root.id === nodeId) return;
        const outgoers = getOutgoers(root, nodes, edges);

        if (outgoers.length) {
          outgoers.forEach((outgoer) => {
            preOrder(outgoer, callback);
          });
        } else {
          if (root.id !== nodeId) callback(root);
        }
      };
      preOrder(startNode, (node) => {
        list.push(node);
      });

      const incomers = getIncomers({ id: nodeId } as Node, nodes, edges);

      list.push(...incomers);

      return uniqBy(list, 'id').filter((item) => {
        return SUPPORT_OUTPUT_VARS_NODE.includes(item.data.type);
      });
    },
    [store]
  );

  const getBeforeNodesInSameBranch = useCallback(
    (nodeId: string, newNodes?: Node[], newEdges?: Edge[]) => {
      const { getNodes, edges } = store.getState();
      const nodes = newNodes || getNodes();
      const currentNode = nodes.find((node) => node.id === nodeId);

      const list: Node[] = [];

      if (!currentNode) return list;

      if (currentNode.parentId) {
        const parentNode = nodes.find(
          (node) => node.id === currentNode.parentId
        );
        if (parentNode) {
          const parentList = getBeforeNodesInSameBranch(parentNode.id);

          list.push(...parentList);
        }
      }

      const traverse = (root: Node, callback: (node: Node) => void) => {
        if (root) {
          const incomers = getIncomers(root, nodes, newEdges || edges);

          if (incomers.length) {
            incomers.forEach((node) => {
              if (!list.find((n) => node.id === n.id)) {
                callback(node);
                traverse(node, callback);
              }
            });
          }
        }
      };
      traverse(currentNode, (node) => {
        list.push(node);
      });

      const length = list.length;
      if (length) {
        return uniqBy(list, 'id')
          .reverse()
          .filter((item) => {
            return SUPPORT_OUTPUT_VARS_NODE.includes(item.data.type);
          });
      }

      return [];
    },
    [store]
  );

  const getBeforeNodesInSameBranchIncludeParent = useCallback(
    (nodeId: string, newNodes?: Node[], newEdges?: Edge[]) => {
      const nodes = getBeforeNodesInSameBranch(nodeId, newNodes, newEdges);
      const { getNodes } = store.getState();
      const allNodes = getNodes();
      const node = allNodes.find((n) => n.id === nodeId);
      const parentNodeId = node?.parentId;
      const parentNode = allNodes.find((n) => n.id === parentNodeId);
      if (parentNode) nodes.push(parentNode);

      return nodes;
    },
    [getBeforeNodesInSameBranch, store]
  );

  const getAfterNodesInSameBranch = useCallback(
    (nodeId: string) => {
      const { getNodes, edges } = store.getState();
      const nodes = getNodes();
      const currentNode = nodes.find((node) => node.id === nodeId)!;

      if (!currentNode) return [];
      const list: Node[] = [currentNode];

      const traverse = (root: Node, callback: (node: Node) => void) => {
        if (root) {
          const outgoers = getOutgoers(root, nodes, edges);

          if (outgoers.length) {
            outgoers.forEach((node) => {
              callback(node);
              traverse(node, callback);
            });
          }
        }
      };
      traverse(currentNode, (node) => {
        list.push(node);
      });

      return uniqBy(list, 'id');
    },
    [store]
  );

  const getBeforeNodeById = useCallback(
    (nodeId: string) => {
      const { getNodes, edges } = store.getState();
      const nodes = getNodes();
      const node = nodes.find((node) => node.id === nodeId)!;

      return getIncomers(node, nodes, edges);
    },
    [store]
  );

  const getIterationNodeChildren = useCallback(
    (nodeId: string) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();

      return nodes.filter((node) => node.parentId === nodeId);
    },
    [store]
  );

  const isValidConnection = useCallback(
    ({ source, target }: Connection) => {
      const { edges, getNodes } = store.getState();
      const nodes = getNodes();
      const sourceNode: Node = nodes.find((node) => node.id === source)!;
      const targetNode: Node = nodes.find((node) => node.id === target)!;

      if (sourceNode && targetNode) {
        const sourceNodeAvailableNextNodes =
          nodesExtraData[sourceNode.data.type].availableNextNodes;
        const targetNodeAvailablePrevNodes = [
          ...nodesExtraData[targetNode.data.type].availablePrevNodes,
          BlockEnum.Start,
        ];

        if (!sourceNodeAvailableNextNodes.includes(targetNode.data.type))
          return false;

        if (!targetNodeAvailablePrevNodes.includes(sourceNode.data.type))
          return false;
      }

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      return !hasCycle(targetNode);
    },
    [store, nodesExtraData]
  );

  const formatTimeFromNow = useCallback(
    (time: number) => {
      return dayjs(time)
        .locale(locale === 'zh-Hans' ? 'zh-cn' : locale)
        .fromNow();
    },
    [locale]
  );

  const getNode = useCallback(
    (nodeId?: string) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();

      return (
        nodes.find((node) => node.id === nodeId) ||
        nodes.find((node) => node.data.type === BlockEnum.Start)
      );
    },
    [store]
  );

  const enableShortcuts = useCallback(() => {
    const { setShortcutsDisabled } = workflowStore.getState();
    setShortcutsDisabled(false);
  }, [workflowStore]);

  const disableShortcuts = useCallback(() => {
    const { setShortcutsDisabled } = workflowStore.getState();
    setShortcutsDisabled(true);
  }, [workflowStore]);

  return {
    setPanelWidth,
    handleLayout,
    getTreeLeafNodes,
    getBeforeNodesInSameBranch,
    getBeforeNodesInSameBranchIncludeParent,
    getAfterNodesInSameBranch,
    isValidConnection,
    formatTimeFromNow,
    getNode,
    getBeforeNodeById,
    getIterationNodeChildren,
    enableShortcuts,
    disableShortcuts,
  };
};

export const useNodesInteractions = () => {
  const { t } = useTranslation();
  const store = useStoreApi();
  const workflowStore = useWorkflowStore();
  const reactflow = useReactFlow();
  const { handleSyncWorkflowDraft } = useNodesSyncDraft();
  const { getAfterNodesInSameBranch } = useWorkflow();
  const { getNodesReadOnly } = useNodesReadOnly();
  const { handleNodeIterationChildDrag, handleNodeIterationChildrenCopy } =
    useNodeIterationInteractions();
  const dragNodeStartPosition = useRef({ x: 0, y: 0 } as {
    x: number;
    y: number;
  });

  const handleNodeDragStart = useCallback<NodeDragHandler>(
    (_, node) => {
      workflowStore.setState({ nodeAnimation: false });

      if (getNodesReadOnly()) return;

      if (node.data.isIterationStart) return;

      dragNodeStartPosition.current = {
        x: node.position.x,
        y: node.position.y,
      };
    },
    [workflowStore, getNodesReadOnly]
  );

  const handleNodeDrag = useCallback<NodeDragHandler>(
    (e, node: Node) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes } = store.getState();
      e.stopPropagation();

      const nodes = getNodes();

      const { restrictPosition } = handleNodeIterationChildDrag(node);

      const newNodes = produce(nodes, (draft) => {
        const currentNode = draft.find((n) => n.id === node.id)!;

        if (restrictPosition.x !== undefined)
          currentNode.position.x = restrictPosition.x;
        else currentNode.position.x = node.position.x;

        if (restrictPosition.y !== undefined)
          currentNode.position.y = restrictPosition.y;
        else currentNode.position.y = node.position.y;
      });

      setNodes(newNodes);
    },
    [store, getNodesReadOnly, handleNodeIterationChildDrag]
  );

  const handleNodeDragStop = useCallback<NodeDragHandler>(
    (_, node) => {
      if (getNodesReadOnly()) return;

      const { x, y } = dragNodeStartPosition.current;
      if (!(x === node.position.x && y === node.position.y)) {
        handleSyncWorkflowDraft();
      }
    },
    [handleSyncWorkflowDraft, workflowStore, getNodesReadOnly]
  );

  const handleNodeEnter = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const nodes = getNodes();
      const { connectingNodePayload, setEnteringNodePayload } =
        workflowStore.getState();

      if (connectingNodePayload) {
        if (connectingNodePayload.nodeId === node.id) return;
        const connectingNode: Node = nodes.find(
          (n) => n.id === connectingNodePayload.nodeId
        )!;
      }
      const newEdges = produce(edges, (draft) => {
        const connectedEdges = getConnectedEdges([node], edges);

        connectedEdges.forEach((edge) => {
          const currentEdge = draft.find((e) => e.id === edge.id);
          if (currentEdge) currentEdge.data._connectedNodeIsHovering = true;
        });
      });
      setEdges(newEdges);
    },
    [store, workflowStore, getNodesReadOnly]
  );

  const handleNodeLeave = useCallback<NodeMouseHandler>(() => {
    if (getNodesReadOnly()) return;

    const { setEnteringNodePayload } = workflowStore.getState();
    setEnteringNodePayload(undefined);
    const { getNodes, setNodes, edges, setEdges } = store.getState();
    const newNodes = produce(getNodes(), (draft) => {
      draft.forEach((node) => {
        node.data._isEntering = false;
      });
    });
    setNodes(newNodes);
    const newEdges = produce(edges, (draft) => {
      draft.forEach((edge) => {
        edge.data._connectedNodeIsHovering = false;
      });
    });
    setEdges(newEdges);
  }, [store, workflowStore, getNodesReadOnly]);

  const handleNodeSelect = useCallback(
    (nodeId: string, cancelSelection?: boolean) => {
      const { getNodes, setNodes, edges, setEdges } = store.getState();

      const nodes = getNodes();
      const selectedNode = nodes.find((node) => node.data.selected);

      if (!cancelSelection && selectedNode?.id === nodeId) return;

      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          if (node.id === nodeId) node.data.selected = !cancelSelection;
          else node.data.selected = false;
        });
      });
      setNodes(newNodes);

      const connectedEdges = getConnectedEdges(
        [{ id: nodeId } as Node],
        edges
      ).map((edge) => edge.id);
      const newEdges = produce(edges, (draft) => {
        draft.forEach((edge) => {
          if (connectedEdges.includes(edge.id)) {
            edge.data = {
              ...edge.data,
              _connectedNodeIsSelected: !cancelSelection,
            };
          } else {
            edge.data = {
              ...edge.data,
              _connectedNodeIsSelected: false,
            };
          }
        });
      });
      setEdges(newEdges);

      handleSyncWorkflowDraft();
    },
    [store, handleSyncWorkflowDraft]
  );

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      handleNodeSelect(node.id);
    },
    [handleNodeSelect]
  );

  const handleNodeConnect = useCallback<OnConnect>(
    ({ source, sourceHandle, target, targetHandle }) => {
      if (source === target) return;
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const nodes = getNodes();
      const targetNode = nodes.find((node) => node.id === target!);
      const sourceNode = nodes.find((node) => node.id === source!);

      if (targetNode?.parentId !== sourceNode?.parentId) return;

      if (targetNode?.data.isIterationStart) return;

      const needDeleteEdges = edges.filter((edge) => {
        if (
          (edge.source === source && edge.sourceHandle === sourceHandle) ||
          (edge.target === target && edge.targetHandle === targetHandle)
        )
          return true;

        return false;
      });
      const needDeleteEdgesIds = needDeleteEdges.map((edge) => edge.id);
      const newEdge = {
        id: `${source}-${sourceHandle}-${target}-${targetHandle}`,
        type: 'custom',
        source: source!,
        target: target!,
        sourceHandle,
        targetHandle,
        data: {
          sourceType: nodes.find((node) => node.id === source)!.data.type,
          targetType: nodes.find((node) => node.id === target)!.data.type,
          isInIteration: !!targetNode?.parentId,
          iteration_id: targetNode?.parentId,
        },
        zIndex: targetNode?.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
      };
      const nodesConnectedSourceOrTargetHandleIdsMap =
        getNodesConnectedSourceOrTargetHandleIdsMap(
          [
            ...needDeleteEdges.map((edge) => ({ type: 'remove', edge })),
            { type: 'add', edge: newEdge },
          ],
          nodes
        );
      const newNodes = produce(nodes, (draft: Node[]) => {
        draft.forEach((node) => {
          if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            };
          }
        });
      });
      setNodes(newNodes);
      const newEdges = produce(edges, (draft) => {
        const filtered = draft.filter(
          (edge) => !needDeleteEdgesIds.includes(edge.id)
        );

        filtered.push(newEdge);

        return filtered;
      });
      setEdges(newEdges);
      handleSyncWorkflowDraft();
    },
    [store, handleSyncWorkflowDraft, getNodesReadOnly]
  );

  const handleNodeConnectStart = useCallback<OnConnectStart>(
    (_, { nodeId, handleType, handleId }) => {
      if (getNodesReadOnly()) return;

      if (nodeId && handleType) {
        const { setConnectingNodePayload } = workflowStore.getState();
        const { getNodes } = store.getState();
        const node = getNodes().find((n) => n.id === nodeId)!;

        if (!node.data.isIterationStart) {
          setConnectingNodePayload({
            nodeId,
            nodeType: node.data.type,
            handleType,
            handleId,
          });
        }
      }
    },
    [store, workflowStore, getNodesReadOnly]
  );

  const handleNodeConnectEnd = useCallback<OnConnectEnd>(
    (e: any) => {
      if (getNodesReadOnly()) return;

      const {
        connectingNodePayload,
        setConnectingNodePayload,
        enteringNodePayload,
        setEnteringNodePayload,
      } = workflowStore.getState();
      if (connectingNodePayload && enteringNodePayload) {
        const { setShowAssignVariablePopup, hoveringAssignVariableGroupId } =
          workflowStore.getState();
        const { screenToFlowPosition } = reactflow;
        const { getNodes, setNodes } = store.getState();
        const nodes = getNodes();
        const fromHandleType = connectingNodePayload.handleType;
        const fromHandleId = connectingNodePayload.handleId;
        const fromNode = nodes.find(
          (n) => n.id === connectingNodePayload.nodeId
        )!;
        const toNode = nodes.find((n) => n.id === enteringNodePayload.nodeId)!;
        const toParentNode = nodes.find((n) => n.id === toNode.parentId);

        if (fromNode.parentId !== toNode.parentId) return;

        const { x, y } = screenToFlowPosition({ x: e.x, y: e.y });

        if (fromHandleType === 'source') {
          const groupEnabled = toNode.data.advanced_settings?.group_enabled;
          const firstGroupId = toNode.data.advanced_settings?.groups[0].groupId;
          let handleId = 'target';

          if (groupEnabled) {
            if (hoveringAssignVariableGroupId)
              handleId = hoveringAssignVariableGroupId;
            else handleId = firstGroupId;
          }
          const newNodes = produce(nodes, (draft) => {
            draft.forEach((node) => {
              if (node.id === toNode.id) {
                node.data._showAddVariablePopup = true;
                node.data._holdAddVariablePopup = true;
              }
            });
          });
          setNodes(newNodes);
          setShowAssignVariablePopup({
            nodeId: fromNode.id,
            nodeData: fromNode.data,
            variableAssignerNodeId: toNode.id,
            variableAssignerNodeData: toNode.data as any,
            variableAssignerNodeHandleId: handleId,
            parentNode: toParentNode,
            x: x - toNode.positionAbsolute!.x,
            y: y - toNode.positionAbsolute!.y,
          });
          handleNodeConnect({
            source: fromNode.id,
            sourceHandle: fromHandleId,
            target: toNode.id,
            targetHandle: 'target',
          });
        }
      }
      setConnectingNodePayload(undefined);
      setEnteringNodePayload(undefined);
    },
    [store, handleNodeConnect, getNodesReadOnly, workflowStore, reactflow]
  );

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();

      const nodes = getNodes();
      const currentNodeIndex = nodes.findIndex((node) => node.id === nodeId);
      const currentNode = nodes[currentNodeIndex];

      if (!currentNode) return;

      if (currentNode.data.type === BlockEnum.Start) return;

      const connectedEdges = getConnectedEdges([{ id: nodeId } as Node], edges);
      const nodesConnectedSourceOrTargetHandleIdsMap =
        getNodesConnectedSourceOrTargetHandleIdsMap(
          connectedEdges.map((edge) => ({ type: 'remove', edge })),
          nodes
        );
      const newNodes = produce(nodes, (draft: Node[]) => {
        draft.forEach((node) => {
          if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            };
          }
        });
        draft.splice(currentNodeIndex, 1);
      });
      setNodes(newNodes);
      const newEdges = produce(edges, (draft) => {
        return draft.filter(
          (edge) =>
            !connectedEdges.find(
              (connectedEdge) => connectedEdge.id === edge.id
            )
        );
      });
      setEdges(newEdges);
      handleSyncWorkflowDraft();
    },
    [store, handleSyncWorkflowDraft, getNodesReadOnly, workflowStore, t]
  );

  const handleNodeAdd = useCallback<OnNodeAdd>(
    (
      {
        nodeType,
        sourceHandle = 'source',
        targetHandle = 'target',
        toolDefaultValue,
      },
      { prevNodeId, prevNodeSourceHandle, nextNodeId, nextNodeTargetHandle }
    ) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const nodes = getNodes();
      const nodesWithSameType = nodes.filter(
        (node) => node.data.type === nodeType
      );
      const newNode = generateNewNode({
        data: {
          ...NODES_INITIAL_DATA[nodeType],
          title:
            nodesWithSameType.length > 0
              ? `${t(`workflow.blocks.${nodeType}`)} ${nodesWithSameType.length + 1}`
              : t(`workflow.blocks.${nodeType}`),
          ...(toolDefaultValue || {}),
          selected: true,
          _showAddVariablePopup: !!prevNodeId,
          _holdAddVariablePopup: false,
        } as any,
        position: {
          x: 0,
          y: 0,
        },
      });
      if (prevNodeId && !nextNodeId) {
        const prevNodeIndex = nodes.findIndex((node) => node.id === prevNodeId);
        const prevNode = nodes[prevNodeIndex];
        const outgoers = getOutgoers(prevNode, nodes, edges).sort(
          (a, b) => a.position.y - b.position.y
        );
        const lastOutgoer = outgoers[outgoers.length - 1];

        newNode.data._connectedTargetHandleIds = [targetHandle];
        newNode.data._connectedSourceHandleIds = [];
        newNode.position = {
          x: lastOutgoer
            ? lastOutgoer.position.x
            : prevNode.position.x + prevNode.width! + X_OFFSET,
          y: lastOutgoer
            ? lastOutgoer.position.y + lastOutgoer.height! + Y_OFFSET
            : prevNode.position.y,
        };
        newNode.parentId = prevNode.parentId;
        newNode.extent = prevNode.extent;
        if (prevNode.parentId) {
          newNode.data.iteration_id = prevNode.parentId;
          newNode.zIndex = ITERATION_CHILDREN_Z_INDEX;
        }

        const newEdge: Edge = {
          id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
          type: 'custom',
          source: prevNodeId,
          sourceHandle: prevNodeSourceHandle,
          target: newNode.id,
          targetHandle,
          data: {
            sourceType: prevNode.data.type,
            targetType: newNode.data.type,
            isInIteration: !!prevNode.parentId,
            iteration_id: prevNode.parentId,
            _connectedNodeIsSelected: true,
          },
          zIndex: prevNode.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
        };
        const nodesConnectedSourceOrTargetHandleIdsMap =
          getNodesConnectedSourceOrTargetHandleIdsMap(
            [{ type: 'add', edge: newEdge }],
            nodes
          );
        const newNodes = produce(nodes, (draft: Node[]) => {
          draft.forEach((node) => {
            node.data.selected = false;

            if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
              node.data = {
                ...node.data,
                ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
              };
            }

            if (prevNode.parentId === node.id)
              node.data._children?.push(newNode.id);
          });
          draft.push(newNode);
        });
        setNodes(newNodes);

        const newEdges = produce(edges, (draft) => {
          draft.forEach((item) => {
            item.data = {
              ...item.data,
              _connectedNodeIsSelected: false,
            };
          });
          draft.push(newEdge);
        });
        setEdges(newEdges);
      }
      if (!prevNodeId && nextNodeId) {
        const nextNodeIndex = nodes.findIndex((node) => node.id === nextNodeId);
        const nextNode = nodes[nextNodeIndex]!;

        if (nextNode.parentId) {
          newNode.data.iteration_id = nextNode.parentId;
          newNode.zIndex = ITERATION_CHILDREN_Z_INDEX;
        }

        let newEdge;

        if (nodeType !== BlockEnum.IfElse) {
          newEdge = {
            id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
            type: 'custom',
            source: newNode.id,
            sourceHandle,
            target: nextNodeId,
            targetHandle: nextNodeTargetHandle,
            data: {
              sourceType: newNode.data.type,
              targetType: nextNode.data.type,
              isInIteration: !!nextNode.parentId,
              iteration_id: nextNode.parentId,
              _connectedNodeIsSelected: true,
            },
            zIndex: nextNode.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
          };
        }

        let nodesConnectedSourceOrTargetHandleIdsMap: Record<string, any>;
        if (newEdge) {
          nodesConnectedSourceOrTargetHandleIdsMap =
            getNodesConnectedSourceOrTargetHandleIdsMap(
              [{ type: 'add', edge: newEdge }],
              nodes
            );
        }

        const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!);
        const afterNodesInSameBranchIds = afterNodesInSameBranch.map(
          (node) => node.id
        );
        const newNodes = produce(nodes, (draft) => {
          draft.forEach((node) => {
            node.data.selected = false;

            if (afterNodesInSameBranchIds.includes(node.id))
              node.position.x += NODE_WIDTH_X_OFFSET;

            if (nodesConnectedSourceOrTargetHandleIdsMap?.[node.id]) {
              node.data = {
                ...node.data,
                ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
              };
            }

            if (node.id === nextNodeId && node.data.isIterationStart)
              node.data.isIterationStart = false;
          });
          draft.push(newNode);
        });
        setNodes(newNodes);
        if (newEdge) {
          const newEdges = produce(edges, (draft) => {
            draft.forEach((item) => {
              item.data = {
                ...item.data,
                _connectedNodeIsSelected: false,
              };
            });
            draft.push(newEdge);
          });
          setEdges(newEdges);
        }
      }
      if (prevNodeId && nextNodeId) {
        const prevNode = nodes.find((node) => node.id === prevNodeId)!;
        const nextNode = nodes.find((node) => node.id === nextNodeId)!;

        newNode.data._connectedTargetHandleIds = [targetHandle];
        newNode.data._connectedSourceHandleIds = [sourceHandle];
        newNode.position = {
          x: nextNode.position.x,
          y: nextNode.position.y,
        };
        newNode.parentId = prevNode.parentId;
        newNode.extent = prevNode.extent;
        if (prevNode.parentId) {
          newNode.data.iteration_id = prevNode.parentId;
          newNode.zIndex = ITERATION_CHILDREN_Z_INDEX;
        }

        const currentEdgeIndex = edges.findIndex(
          (edge) => edge.source === prevNodeId && edge.target === nextNodeId
        );
        const newPrevEdge = {
          id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
          type: 'custom',
          source: prevNodeId,
          sourceHandle: prevNodeSourceHandle,
          target: newNode.id,
          targetHandle,
          data: {
            sourceType: prevNode.data.type,
            targetType: newNode.data.type,
            isInIteration: !!prevNode.parentId,
            iteration_id: prevNode.parentId,
            _connectedNodeIsSelected: true,
          },
          zIndex: prevNode.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
        };
        let newNextEdge: Edge | null = null;

        const nodesConnectedSourceOrTargetHandleIdsMap =
          getNodesConnectedSourceOrTargetHandleIdsMap(
            [
              { type: 'remove', edge: edges[currentEdgeIndex] },
              { type: 'add', edge: newPrevEdge },
              ...(newNextEdge ? [{ type: 'add', edge: newNextEdge }] : []),
            ],
            [...nodes, newNode]
          );

        const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!);
        const afterNodesInSameBranchIds = afterNodesInSameBranch.map(
          (node) => node.id
        );
        const newNodes = produce(nodes, (draft) => {
          draft.forEach((node) => {
            node.data.selected = false;

            if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
              node.data = {
                ...node.data,
                ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
              };
            }
            if (afterNodesInSameBranchIds.includes(node.id))
              node.position.x += NODE_WIDTH_X_OFFSET;
          });
          draft.push(newNode);
        });
        setNodes(newNodes);

        const newEdges = produce(edges, (draft) => {
          draft.splice(currentEdgeIndex, 1);
          draft.forEach((item) => {
            item.data = {
              ...item.data,
              _connectedNodeIsSelected: false,
            };
          });
          draft.push(newPrevEdge);

          if (newNextEdge) draft.push(newNextEdge);
        });
        setEdges(newEdges);
      }
      handleSyncWorkflowDraft();
    },
    [
      store,
      workflowStore,
      handleSyncWorkflowDraft,
      getAfterNodesInSameBranch,
      getNodesReadOnly,
      t,
    ]
  );

  const handleNodeChange = useCallback(
    (
      currentNodeId: string,
      nodeType: BlockEnum,
      sourceHandle: string,
      toolDefaultValue?: ToolDefaultValue
    ) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const nodes = getNodes();
      const currentNode = nodes.find((node) => node.id === currentNodeId)!;
      const connectedEdges = getConnectedEdges([currentNode], edges);
      const nodesWithSameType = nodes.filter(
        (node) => node.data.type === nodeType
      );
      const newCurrentNode = generateNewNode({
        data: {
          ...NODES_INITIAL_DATA[nodeType],
          title:
            nodesWithSameType.length > 0
              ? `${t(`workflow.blocks.${nodeType}`)} ${nodesWithSameType.length + 1}`
              : t(`workflow.blocks.${nodeType}`),
          ...(toolDefaultValue || {}),
          _connectedSourceHandleIds: [],
          _connectedTargetHandleIds: [],
          selected: currentNode.data.selected,
          iteration_id: currentNode.data.iteration_id,
        } as any,
        position: {
          x: currentNode.position.x,
          y: currentNode.position.y,
        },
        parentId: currentNode.parentId,
        extent: currentNode.extent,
        zIndex: currentNode.zIndex,
      });
      const nodesConnectedSourceOrTargetHandleIdsMap =
        getNodesConnectedSourceOrTargetHandleIdsMap(
          [...connectedEdges.map((edge) => ({ type: 'remove', edge }))],
          nodes
        );
      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          node.data.selected = false;

          if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            };
          }
          if (
            node.id === currentNode.parentId &&
            currentNode.data.isIterationStart
          ) {
            node.data._children = [
              newCurrentNode.id,
              ...(node.data._children || []),
            ].filter((child) => child !== currentNodeId);
            node.data.start_node_id = newCurrentNode.id;
            node.data.startNodeType = newCurrentNode.data.type;
          }
        });
        const index = draft.findIndex((node) => node.id === currentNodeId);

        draft.splice(index, 1, newCurrentNode);
      });
      setNodes(newNodes);
      const newEdges = produce(edges, (draft) => {
        const filtered = draft.filter(
          (edge) =>
            !connectedEdges.find(
              (connectedEdge) => connectedEdge.id === edge.id
            )
        );

        return filtered;
      });
      setEdges(newEdges);
      handleSyncWorkflowDraft();
    },
    [store, handleSyncWorkflowDraft, getNodesReadOnly, t]
  );

  const handleNodeCancelRunningStatus = useCallback(() => {
    const { getNodes, setNodes } = store.getState();

    const nodes = getNodes();
    const newNodes = produce(nodes, (draft) => {
      draft.forEach((node) => {
        node.data._runningStatus = undefined;
      });
    });
    setNodes(newNodes);
  }, [store]);

  const handleNodesCancelSelected = useCallback(() => {
    const { getNodes, setNodes } = store.getState();

    const nodes = getNodes();
    const newNodes = produce(nodes, (draft) => {
      draft.forEach((node) => {
        node.data.selected = false;
      });
    });
    setNodes(newNodes);
  }, [store]);

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const container = document.querySelector('#workflow-container');
      const { x, y } = container!.getBoundingClientRect();
      workflowStore.setState({
        nodeMenu: {
          top: event.clientY - y,
          left: event.clientX - x,
          nodeId: node.id,
        },
      });
      handleNodeSelect(node.id);
    },
    [workflowStore, handleNodeSelect]
  );

  const handleNodesCopy = useCallback(() => {
    if (getNodesReadOnly()) return;

    const { setClipboardElements, shortcutsDisabled, showFeaturesPanel } =
      workflowStore.getState();

    if (shortcutsDisabled || showFeaturesPanel) return;

    const { getNodes } = store.getState();

    const nodes = getNodes();
    const bundledNodes = nodes.filter(
      (node) =>
        node.data._isBundled &&
        node.data.type !== BlockEnum.Start &&
        !node.data.isInIteration
    );

    if (bundledNodes.length) {
      setClipboardElements(bundledNodes);
      return;
    }

    const selectedNode = nodes.find(
      (node) => node.data.selected && node.data.type !== BlockEnum.Start
    );

    if (selectedNode) setClipboardElements([selectedNode]);
  }, [getNodesReadOnly, store, workflowStore]);

  const handleNodesPaste = useCallback(() => {
    if (getNodesReadOnly()) return;

    const {
      clipboardElements,
      shortcutsDisabled,
      showFeaturesPanel,
      mousePosition,
    } = workflowStore.getState();

    if (shortcutsDisabled || showFeaturesPanel) return;

    const { getNodes, setNodes } = store.getState();

    const nodesToPaste: Node[] = [];
    const nodes = getNodes();

    if (clipboardElements.length) {
      const { x, y } = getTopLeftNodePosition(clipboardElements);
      const { screenToFlowPosition } = reactflow;
      const currentPosition = screenToFlowPosition({
        x: mousePosition.pageX,
        y: mousePosition.pageY,
      });
      const offsetX = currentPosition.x - x;
      const offsetY = currentPosition.y - y;
      clipboardElements.forEach((nodeToPaste, index) => {
        const nodeType = nodeToPaste.data.type;

        const newNode = generateNewNode({
          data: {
            ...NODES_INITIAL_DATA[nodeType],
            ...nodeToPaste.data,
            selected: false,
            _isBundled: false,
            _connectedSourceHandleIds: [],
            _connectedTargetHandleIds: [],
            title: genNewNodeTitleFromOld(nodeToPaste.data.title),
          },
          position: {
            x: nodeToPaste.position.x + offsetX,
            y: nodeToPaste.position.y + offsetY,
          },
          extent: nodeToPaste.extent,
          zIndex: nodeToPaste.zIndex,
        });
        newNode.id = newNode.id + index;

        let newChildren: Node[] = [];

        nodesToPaste.push(newNode);

        if (newChildren.length) nodesToPaste.push(...newChildren);
      });

      setNodes([...nodes, ...nodesToPaste]);
      handleSyncWorkflowDraft();
    }
  }, [
    getNodesReadOnly,
    store,
    workflowStore,
    handleSyncWorkflowDraft,
    reactflow,
    handleNodeIterationChildrenCopy,
  ]);

  const handleNodesDuplicate = useCallback(() => {
    if (getNodesReadOnly()) return;

    handleNodesCopy();
    handleNodesPaste();
  }, [getNodesReadOnly, handleNodesCopy, handleNodesPaste]);

  const handleNodesDelete = useCallback(() => {
    if (getNodesReadOnly()) return;

    const { shortcutsDisabled, showFeaturesPanel } = workflowStore.getState();

    if (shortcutsDisabled || showFeaturesPanel) return;

    const { getNodes, edges } = store.getState();

    const nodes = getNodes();
    const bundledNodes = nodes.filter(
      (node) => node.data._isBundled && node.data.type !== BlockEnum.Start
    );

    if (bundledNodes.length) {
      bundledNodes.forEach((node) => handleNodeDelete(node.id));

      return;
    }

    const edgeSelected = edges.some((edge) => edge.selected);
    if (edgeSelected) return;

    const selectedNode = nodes.find(
      (node) => node.data.selected && node.data.type !== BlockEnum.Start
    );

    if (selectedNode) handleNodeDelete(selectedNode.id);
  }, [store, workflowStore, getNodesReadOnly, handleNodeDelete]);

  const handleNodeResize = useCallback(
    (nodeId: string, params: ResizeParamsWithDirection) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes } = store.getState();
      const { x, y, width, height } = params;

      const nodes = getNodes();
      const currentNode = nodes.find((n) => n.id === nodeId)!;
      const childrenNodes = nodes.filter((n) =>
        currentNode.data._children?.includes(n.id)
      );
      let rightNode: Node;
      let bottomNode: Node;

      childrenNodes.forEach((n) => {
        if (rightNode) {
          if (n.position.x + n.width! > rightNode.position.x + rightNode.width!)
            rightNode = n;
        } else {
          rightNode = n;
        }
        if (bottomNode) {
          if (
            n.position.y + n.height! >
            bottomNode.position.y + bottomNode.height!
          )
            bottomNode = n;
        } else {
          bottomNode = n;
        }
      });

      if (rightNode! && bottomNode!) {
        if (
          width <
          rightNode!.position.x + rightNode.width! + ITERATION_PADDING.right
        )
          return;
        if (
          height <
          bottomNode.position.y + bottomNode.height! + ITERATION_PADDING.bottom
        )
          return;
      }
      const newNodes = produce(nodes, (draft) => {
        draft.forEach((n) => {
          if (n.id === nodeId) {
            n.data.width = width;
            n.data.height = height;
            n.width = width;
            n.height = height;
            n.position.x = x;
            n.position.y = y;
          }
        });
      });
      setNodes(newNodes);
      handleSyncWorkflowDraft();
    },
    [store, getNodesReadOnly, handleSyncWorkflowDraft]
  );

  return {
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
    handleNodeEnter,
    handleNodeLeave,
    handleNodeSelect,
    handleNodeClick,
    handleNodeConnect,
    handleNodeConnectStart,
    handleNodeConnectEnd,
    handleNodeDelete,
    handleNodeChange,
    handleNodeAdd,
    handleNodeCancelRunningStatus,
    handleNodesCancelSelected,
    handleNodeContextMenu,
    handleNodesCopy,
    handleNodesPaste,
    handleNodesDuplicate,
    handleNodesDelete,
    handleNodeResize,
  };
};

export const useAvailableBlocks = (nodeType?: BlockEnum) => {
  const nodesExtraData = useNodesExtraData();
  const availablePrevBlocks = useMemo(() => {
    if (!nodeType) return [];
    return nodesExtraData[nodeType].availablePrevNodes || [];
  }, [nodeType, nodesExtraData]);

  const availableNextBlocks = useMemo(() => {
    if (!nodeType) return [];
    return nodesExtraData[nodeType].availableNextNodes || [];
  }, [nodeType, nodesExtraData]);

  return useMemo(() => {
    return {
      availablePrevBlocks: availablePrevBlocks,
      availableNextBlocks: availableNextBlocks,
    };
  }, [availablePrevBlocks, availableNextBlocks]);
};
