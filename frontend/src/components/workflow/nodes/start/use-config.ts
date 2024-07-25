import { useCallback, useState } from 'react';
import produce from 'immer';
import { useBoolean } from 'ahooks';
import type { StartNodeType } from './types';
import type {
  InputVar,
  MoreInfo,
  ValueSelector,
} from '@/components/workflow/types';
import { useNodeCrud } from '@/components/workflow/hooks/use-node-crud';
import { useNodesReadOnly } from '@/components/workflow/hooks/hooks';

const useConfig = (id: string, payload: StartNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly();

  const { inputs, setInputs } = useNodeCrud<StartNodeType>(id, payload);

  const [
    isShowAddVarModal,
    { setTrue: showAddVarModal, setFalse: hideAddVarModal },
  ] = useBoolean(false);

  const [
    isShowRemoveVarConfirm,
    { setTrue: showRemoveVarConfirm, setFalse: hideRemoveVarConfirm },
  ] = useBoolean(false);
  const [removedVar, setRemovedVar] = useState<ValueSelector>([]);
  const [removedIndex, setRemoveIndex] = useState(0);
  const handleVarListChange = useCallback(
    (newList: InputVar[], moreInfo?: { index: number; payload: MoreInfo }) => {
      const newInputs = produce(inputs, (draft: any) => {
        draft.variables = newList;
      });
      setInputs(newInputs);
    },
    [id, inputs, setInputs, showRemoveVarConfirm]
  );

  const removeVarInNode = useCallback(() => {
    const newInputs = produce(inputs, (draft) => {
      draft.variables.splice(removedIndex, 1);
    });
    setInputs(newInputs);

    hideRemoveVarConfirm();
  }, [hideRemoveVarConfirm, inputs, removedIndex, removedVar, setInputs]);

  const handleAddVariable = useCallback(
    (payload: InputVar) => {
      const newInputs = produce(inputs, (draft: StartNodeType) => {
        draft.variables.push(payload);
      });
      setInputs(newInputs);
    },
    [inputs, setInputs]
  );
  return {
    readOnly,
    inputs,
    isShowAddVarModal,
    showAddVarModal,
    hideAddVarModal,
    handleVarListChange,
    handleAddVariable,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm: removeVarInNode,
  };
};

export default useConfig;
