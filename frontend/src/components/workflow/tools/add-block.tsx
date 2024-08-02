import { memo, useCallback, useContext, useState } from 'react';
import cn from 'classnames';
import { useStoreApi } from 'reactflow';
import { useTranslation } from 'react-i18next';
import type { OffsetOptions } from '@floating-ui/react';
import { generateNewNode } from '../utils';
import {
  useNodesExtraData,
  useNodesReadOnly,
  usePanelInteractions,
} from '../hooks/hooks';
import { NODES_INITIAL_DATA } from '../constants';
import TipPopup from './tip-popup';
import BlockSelector from '@/components/workflow/block-selector';
import type { OnSelectBlock } from '@/components/workflow/types';
import { BlockEnum } from '@/components/workflow/types';
import React from 'react';
import { PlusCircle } from '@phosphor-icons/react';
import { WorkflowContext } from '../context';

type AddBlockProps = {
  renderTrigger?: (open: boolean) => React.ReactNode;
  offset?: OffsetOptions;
};
const AddBlock = ({ renderTrigger, offset }: AddBlockProps) => {
  const { t } = useTranslation();
  const store = useStoreApi();
  const workflowStore = useContext(WorkflowContext)!;
  const nodesExtraData = useNodesExtraData();
  const { nodesReadOnly } = useNodesReadOnly();
  const { handlePaneContextmenuCancel } = usePanelInteractions();
  const [open, setOpen] = useState(false);
  const availableNextNodes = nodesExtraData[BlockEnum.Start].availableNextNodes;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) handlePaneContextmenuCancel();
    },
    [handlePaneContextmenuCancel]
  );

  const handleSelect = useCallback<OnSelectBlock>(
    (type, toolDefaultValue) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();
      const nodesWithSameType = nodes.filter((node) => node.data.type === type);
      const newNode = generateNewNode({
        data: {
          ...NODES_INITIAL_DATA[type],
          title:
            nodesWithSameType.length > 0
              ? `${t(`workflow.blocks.${type}`)} ${nodesWithSameType.length + 1}`
              : t(`workflow.blocks.${type}`),
          ...(toolDefaultValue || {}),
          _isCandidate: true,
        } as any,
        position: {
          x: 0,
          y: 0,
        },
      });
      workflowStore.setState({
        candidateNode: newNode,
      });
    },
    [store, workflowStore, t]
  );

  const renderTriggerElement = (open: boolean) => {
    return (
      <TipPopup title={t('workflow.common.addBlock')}>
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg hover:bg-black/5 hover:text-gray-700 cursor-pointer',
            `${nodesReadOnly && '!cursor-not-allowed opacity-50'}`,
            open && '!bg-black/5'
          )}
        >
          <PlusCircle size={20} />
        </div>
      </TipPopup>
    );
  };

  return (
    <BlockSelector
      open={open}
      onOpenChange={handleOpenChange}
      disabled={nodesReadOnly}
      onSelect={handleSelect}
      placement="top-start"
      offset={
        offset ?? {
          mainAxis: 4,
          crossAxis: -8,
        }
      }
      trigger={renderTrigger || renderTriggerElement}
      popupClassName="!min-w-[256px]"
      availableBlocksTypes={availableNextNodes}
    />
  );
};

export default memo(AddBlock);
