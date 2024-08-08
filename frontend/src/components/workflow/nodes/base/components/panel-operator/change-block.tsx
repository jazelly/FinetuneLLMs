import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { intersection } from 'lodash-es';
import BlockSelector from '@/components/workflow/block-selector';
import {
  useAvailableBlocks,
  useNodesInteractions,
} from '@/components/workflow/hooks/hooks';
import type { Node, OnSelectBlock } from '@/components/workflow/types';
import React from 'react';

type ChangeBlockProps = {
  nodeId: string;
  nodeData: Node['data'];
  sourceHandle: string;
};
const ChangeBlock = ({ nodeId, nodeData, sourceHandle }: ChangeBlockProps) => {
  const { t } = useTranslation();
  const { handleNodeChange } = useNodesInteractions();
  const { availablePrevBlocks, availableNextBlocks } = useAvailableBlocks(
    nodeData.type
  );

  const availableNodes = useMemo(() => {
    if (availablePrevBlocks.length && availableNextBlocks.length)
      return intersection(availablePrevBlocks, availableNextBlocks);
    else if (availablePrevBlocks.length) return availablePrevBlocks;
    else return availableNextBlocks;
  }, [availablePrevBlocks, availableNextBlocks]);

  const handleSelect = useCallback<OnSelectBlock>(
    (type, toolDefaultValue) => {
      handleNodeChange(nodeId, type, sourceHandle, toolDefaultValue);
    },
    [handleNodeChange, nodeId, sourceHandle]
  );

  const renderTrigger = useCallback(() => {
    return (
      <div className="flex items-center px-3 w-[232px] h-8 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50">
        {t('workflow.panel.changeBlock')}
      </div>
    );
  }, [t]);

  return (
    <BlockSelector
      placement="bottom-end"
      offset={{
        mainAxis: -36,
        crossAxis: 4,
      }}
      onSelect={handleSelect}
      trigger={renderTrigger}
      popupClassName="min-w-[240px]"
      availableBlocksTypes={availableNodes}
    />
  );
};

export default memo(ChangeBlock);
