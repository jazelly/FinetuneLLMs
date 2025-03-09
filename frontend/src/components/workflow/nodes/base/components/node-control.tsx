import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNodesInteractions } from '../../../hooks/hooks';
import type { Node } from '../../../types';
import { canRunBySingle } from '../../../utils';
import PanelOperator from './panel-operator';
import { useNodeDataUpdate } from '@/components/workflow/hooks/use-node-crud';
import { useNodesSyncDraft } from '@/components/workflow/hooks/use-nodes-sync-draft';
import React from 'react';
import { Play, Stop } from '@phosphor-icons/react';
import { TooltipPlus } from '@/components/reusable/TooltipPlus.component';

type NodeControlProps = Pick<Node, 'id' | 'data'>;
const NodeControl: FC<NodeControlProps> = ({ id, data }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { handleNodeDataUpdate } = useNodeDataUpdate();
  const { handleNodeSelect } = useNodesInteractions();
  const { handleSyncWorkflowDraft } = useNodesSyncDraft();

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  return (
    <div
      className={`
      hidden group-hover:flex pb-1 absolute right-0 -top-7 h-7
      ${data.selected && '!flex'}
      ${open && '!flex'}
      `}
    >
      <div
        className="flex items-center px-0.5 h-6 bg-white rounded-lg border-[0.5px] border-gray-200 shadow-xs text-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        {canRunBySingle(data.type) && (
          <div
            className="flex items-center justify-center w-5 h-5 rounded-md cursor-pointer hover:bg-gray-100"
            onClick={() => {
              handleNodeSelect(id);
              handleSyncWorkflowDraft(true);
            }}
          >
            <TooltipPlus popupContent={t('workflow.panel.runThisStep')}>
              <Play className="w-3 h-3" />
            </TooltipPlus>
          </div>
        )}
        <PanelOperator
          id={id}
          data={data}
          offset={0}
          onOpenChange={handleOpenChange}
          triggerClassName="!w-5 !h-5"
        />
      </div>
    </div>
  );
};

export default memo(NodeControl);
