import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StartNodeType } from './types';
import type { NodeProps } from '@/components/workflow/types';
import { Champagne, TestTube } from '@phosphor-icons/react';
const i18nPrefix = 'workflow.nodes.start';

const StartNode: FC<NodeProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-1 px-3 py-1">
      <div className="space-y-0.5">
        {/* {data.variables.map((variable) => (
          <div
            key={variable.variable}
            className="flex items-center h-6 justify-between bg-gray-100 rounded-md  px-1 space-x-1 text-xs font-normal text-gray-700"
          >
            <div className="w-0 grow flex items-center space-x-1">
              <Champagne className="shrink-0 w-3.5 h-3.5 text-primary-500" />
              <span className="w-0 grow truncate text-xs font-normal text-gray-700">
                {variable.variable}
              </span>
            </div>

            <div className="ml-1 flex items-center space-x-1">
              {variable.required && (
                <span className="text-xs font-normal text-gray-500 uppercase">
                  {t(`${i18nPrefix}.required`)}
                </span>
              )}
              <TestTube
                type={variable.type}
                className="w-3 h-3 text-gray-500"
              />
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default React.memo(StartNode);
