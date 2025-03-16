import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/src/components/workflow/types';
import React from 'react';

export type AddVariablePopupProps = {
  availableVars: NodeOutPutVar[];
  onSelect: (value: ValueSelector, item: Var) => void;
};
export const AddVariablePopup = ({
  availableVars,
  onSelect,
}: AddVariablePopupProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-[240px] bg-white border-[0.5px] border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center px-4 h-[34px] text-[13px] font-semibold text-gray-700 border-b-[0.5px] border-b-gray-200">
        {t('workflow.nodes.variableAssigner.setAssignVariable')}
      </div>
    </div>
  );
};

export default memo(AddVariablePopup);
