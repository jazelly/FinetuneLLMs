import { useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { debounce } from 'lodash-es';
import { WorkflowContext } from './context';

export const createWorkflowStore = () => {
  return createStore<Record<string, any>>((set) => ({
    workflowId: '',
    panelWidth: localStorage.getItem('workflow-node-panel-width')
      ? parseFloat(localStorage.getItem('workflow-node-panel-width')!)
      : 420,
    workflowRunningData: undefined,
    setWorkflowRunningData: (workflowRunningData) =>
      set(() => ({ workflowRunningData })),
    historyWorkflowData: undefined,
    setHistoryWorkflowData: (historyWorkflowData) =>
      set(() => ({ historyWorkflowData })),
    showRunHistory: false,
    setShowRunHistory: (showRunHistory) => set(() => ({ showRunHistory })),

    draftUpdatedAt: 0,
    setDraftUpdatedAt: (draftUpdatedAt) =>
      set(() => ({
        draftUpdatedAt: draftUpdatedAt ? draftUpdatedAt * 1000 : 0,
      })),
    publishedAt: 0,
    setPublishedAt: (publishedAt) =>
      set(() => ({ publishedAt: publishedAt ? publishedAt * 1000 : 0 })),
    showInputsPanel: false,
    setShowInputsPanel: (showInputsPanel) => set(() => ({ showInputsPanel })),
    inputs: {},
    setInputs: (inputs) => set(() => ({ inputs })),
    backupDraft: undefined,
    notInitialWorkflow: false,
    setNotInitialWorkflow: (notInitialWorkflow) =>
      set(() => ({ notInitialWorkflow })),
    nodesDefaultConfigs: {},
    setNodesDefaultConfigs: (nodesDefaultConfigs) =>
      set(() => ({ nodesDefaultConfigs })),
    nodeAnimation: false,
    setNodeAnimation: (nodeAnimation) => set(() => ({ nodeAnimation })),
    isRestoring: false,
    setIsRestoring: (isRestoring) => set(() => ({ isRestoring })),
    debouncedUpdateWorkflow: debounce((updateWorkflow) => {
      updateWorkflow();
    }, 5000),

    clipboardElements: [],
    setClipboardElements: (clipboardElements) =>
      set(() => ({ clipboardElements })),
    shortcutsDisabled: false,
    setShortcutsDisabled: (shortcutsDisabled) =>
      set(() => ({ shortcutsDisabled })),
    selection: null,
    setSelection: (selection) => set(() => ({ selection })),
    bundleNodeSize: null,
    setBundleNodeSize: (bundleNodeSize) => set(() => ({ bundleNodeSize })),
    controlMode:
      localStorage.getItem('workflow-operation-mode') === 'pointer'
        ? 'pointer'
        : 'hand',
    setControlMode: (controlMode) => {
      set(() => ({ controlMode }));
      localStorage.setItem('workflow-operation-mode', controlMode);
    },
    panelMenu: undefined,
    setPanelMenu: (panelMenu) => set(() => ({ panelMenu })),
    nodeMenu: undefined,
    setNodeMenu: (nodeMenu) => set(() => ({ nodeMenu })),

    mousePosition: { pageX: 0, pageY: 0, elementX: 0, elementY: 0 },
    setMousePosition: (mousePosition) => set(() => ({ mousePosition })),
    showConfirm: undefined,
    setShowConfirm: (showConfirm) => set(() => ({ showConfirm })),
    showAssignVariablePopup: undefined,
    setShowAssignVariablePopup: (showAssignVariablePopup) =>
      set(() => ({ showAssignVariablePopup })),
    hoveringAssignVariableGroupId: undefined,
    setHoveringAssignVariableGroupId: (hoveringAssignVariableGroupId) =>
      set(() => ({ hoveringAssignVariableGroupId })),
    connectingNodePayload: undefined,
    setConnectingNodePayload: (connectingNodePayload) =>
      set(() => ({ connectingNodePayload })),
    enteringNodePayload: undefined,
    setEnteringNodePayload: (enteringNodePayload) =>
      set(() => ({ enteringNodePayload })),
  }));
};

export function useStore<T>(selector: (state) => T): T {
  const store = useContext(WorkflowContext);
  if (!store) throw new Error('Missing WorkflowContext.Provider in the tree');

  return useZustandStore(store, selector);
}
