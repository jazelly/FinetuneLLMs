import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEdges } from 'reactflow';
import ChangeBlock from './change-block';
import { canRunBySingle } from '@/components/workflow/utils';
import {
  useNodesExtraData,
  useNodesInteractions,
  useNodesReadOnly,
} from '@/components/workflow/hooks/hooks';
import type { Node } from '@/components/workflow/types';
import { BlockEnum } from '@/components/workflow/types';
import React from 'react';
import { useNodesSyncDraft } from '@/components/workflow/hooks/use-nodes-sync-draft';
import { useNodeDataUpdate } from '@/components/workflow/hooks/use-node-crud';

type PanelOperatorPopupProps = {
  id: string;
  data: Node['data'];
  onClosePopup: () => void;
  showHelpLink?: boolean;
};
const PanelOperatorPopup = ({
  id,
  data,
  onClosePopup,
}: PanelOperatorPopupProps) => {
  const { t } = useTranslation();
  const edges = useEdges();
  const {
    handleNodeDelete,
    handleNodesDuplicate,
    handleNodeSelect,
    handleNodesCopy,
  } = useNodesInteractions();
  const { handleNodeDataUpdate } = useNodeDataUpdate();
  const { handleSyncWorkflowDraft } = useNodesSyncDraft();
  const { nodesReadOnly } = useNodesReadOnly();
  const nodesExtraData = useNodesExtraData();
  const edge = edges.find((edge) => edge.target === id);
  const author = useMemo(() => {
    return nodesExtraData[data.type].author;
  }, [data, nodesExtraData]);

  const about = useMemo(() => {
    return nodesExtraData[data.type].about;
  }, [data, nodesExtraData]);

  const showChangeBlock = data.type !== BlockEnum.Start && !nodesReadOnly;

  return (
    <div className="w-[240px] border-[0.5px] border-gray-200 rounded-lg shadow-xl bg-white">
      {(showChangeBlock || canRunBySingle(data.type)) && (
        <>
          <div className="p-1">
            {canRunBySingle(data.type) && (
              <div
                className={`
                      flex items-center px-3 h-8 text-sm text-gray-700 rounded-lg cursor-pointer
                      hover:bg-gray-50
                    `}
                onClick={() => {
                  handleNodeSelect(id);
                  handleNodeDataUpdate({ id, data: { _isSingleRun: true } });
                  handleSyncWorkflowDraft(true);
                  onClosePopup();
                }}
              >
                {t('workflow.panel.runThisStep')}
              </div>
            )}
            {showChangeBlock && (
              <ChangeBlock
                nodeId={id}
                nodeData={data}
                sourceHandle={edge?.sourceHandle || 'source'}
              />
            )}
          </div>
          <div className="h-[1px] bg-gray-100"></div>
        </>
      )}
      {data.type !== BlockEnum.Start && !nodesReadOnly && (
        <>
          <div className="p-1">
            <div
              className="flex items-center justify-between px-3 h-8 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => {
                onClosePopup();
                handleNodesCopy();
              }}
            >
              {t('workflow.common.copy')}
            </div>
            <div
              className="flex items-center justify-between px-3 h-8 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => {
                onClosePopup();
                handleNodesDuplicate();
              }}
            >
              {t('workflow.common.duplicate')}
            </div>
          </div>
          <div className="h-[1px] bg-gray-100"></div>
          <div className="p-1">
            <div
              className={`
                flex items-center justify-between px-3 h-8 text-sm text-gray-700 rounded-lg cursor-pointer
                hover:bg-rose-50 hover:text-red-500
                `}
              onClick={() => handleNodeDelete(id)}
            >
              {t('common.operation.delete')}
            </div>
          </div>
          <div className="h-[1px] bg-gray-100"></div>
        </>
      )}
      <div className="p-1">
        <div className="px-3 py-2 text-xs text-gray-500">
          <div className="flex items-center mb-1 h-[22px] font-medium">
            {t('workflow.panel.about').toLocaleUpperCase()}
          </div>
          <div className="mb-1 text-gray-700 leading-[18px]">{about}</div>
          <div className="leading-[18px]">
            {t('workflow.panel.createdBy')} {author}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PanelOperatorPopup);
