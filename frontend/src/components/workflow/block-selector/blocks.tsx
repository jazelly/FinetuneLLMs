import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { groupBy } from 'lodash-es';
import NodeIcon from '../nodes/icons';
import { BlockEnum } from '../types';
import { useNodesExtraData } from '../hooks/hooks';
import { BLOCK_CLASSIFICATIONS } from './constants';
import { useBlocks } from './hooks';
import type { ToolDefaultValue } from './types';
import Tooltip from '@/components/reusable/Tooltip.component';
import React from 'react';

type BlocksProps = {
  searchText: string;
  onSelect: (type: BlockEnum, tool?: ToolDefaultValue) => void;
  availableBlocksTypes?: BlockEnum[];
};
const Blocks = ({
  searchText,
  onSelect,
  availableBlocksTypes = [],
}: BlocksProps) => {
  const { t } = useTranslation();
  const nodesExtraData = useNodesExtraData();

  return (
    <div className="p-1">
      {
        <div className="flex items-center px-3 h-[22px] text-xs font-medium text-gray-500">
          {t('workflow.tabs.noResult')}
        </div>
      }
    </div>
  );
};

export default memo(Blocks);
