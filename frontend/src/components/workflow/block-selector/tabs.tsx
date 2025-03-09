import type { FC } from 'react';
import { memo, useState } from 'react';
import cn from 'classnames';
import type { BlockEnum } from '../types';
import { useTabs } from './hooks';
import type { ToolDefaultValue } from './types';
import { TabsEnum } from './types';
import Blocks from './blocks';
import React from 'react';

export type TabsProps = {
  searchText: string;
  onSelect: (type: BlockEnum, tool?: ToolDefaultValue) => void;
  availableBlocksTypes?: BlockEnum[];
  noBlocks?: boolean;
};
const Tabs: FC<TabsProps> = ({
  searchText,
  onSelect,
  availableBlocksTypes,
  noBlocks,
}) => {
  const tabs = useTabs();
  const [activeTab, setActiveTab] = useState(
    noBlocks ? TabsEnum.Tools : TabsEnum.Blocks
  );

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {!noBlocks && (
        <div className="flex items-center px-3 border-b-[0.5px] border-b-gray-200">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={cn(
                'relative mr-4 h-[34px] leading-[34px] text-[13px] font-medium cursor-pointer',
                activeTab === tab.key
                  ? 'text-gray-800 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-600'
                  : 'text-gray-500'
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </div>
          ))}
        </div>
      )}
      {activeTab === TabsEnum.Blocks && !noBlocks && (
        <Blocks
          searchText={searchText}
          onSelect={onSelect}
          availableBlocksTypes={availableBlocksTypes}
        />
      )}
    </div>
  );
};

export default memo(Tabs);
