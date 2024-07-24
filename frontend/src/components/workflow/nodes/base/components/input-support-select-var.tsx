'use client';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import cn from 'classnames';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import type { Node, NodeOutPutVar } from '@/components/workflow/types';
import { BlockEnum } from '@/components/workflow/types';
import { TooltipPlus } from '@/components/reusable/TooltipPlus.component';
import { Champagne } from '@phosphor-icons/react';

type Props = {
  instanceId?: string;
  className?: string;
  placeholder?: string;
  placeholderClassName?: string;
  promptMinHeightClassName?: string;
  value: string;
  onChange: (value: string) => void;
  onFocusChange?: (value: boolean) => void;
  readOnly?: boolean;
  justVar?: boolean;
  nodesOutputVars?: NodeOutPutVar[];
  availableNodes?: Node[];
};

const Editor: FC<Props> = ({ className, onFocusChange }) => {
  const { t } = useTranslation();

  const [isFocus, { setTrue: setFocus, setFalse: setBlur }] = useBoolean(false);

  useEffect(() => {
    onFocusChange?.(isFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus]);

  return (
    <div className={cn(className, 'relative')}>
      <>
        {/* to patch Editor not support dynamic change editable status */}
        {<div className="absolute inset-0 z-10"></div>}
        {isFocus && (
          <div className="absolute z-10 top-[-9px] right-1">
            <TooltipPlus popupContent={`${t('workflow.common.insertVarTip')}`}>
              <div className="p-0.5 rounded-[5px] shadow-lg cursor-pointer bg-white hover:bg-gray-100 border-[0.5px] border-black/5">
                <Champagne weight="bold" color="gray" />
              </div>
            </TooltipPlus>
          </div>
        )}
      </>
    </div>
  );
};
export default React.memo(Editor);
