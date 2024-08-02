import { HouseLine, MathOperations, PlusCircle } from '@phosphor-icons/react';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { TooltipPlus } from '../reusable/TooltipPlus.component';
import { AnimatedDropdown } from '../reusable/AnimatedDropdown.component';

export const NodeSelector = () => {
  return (
    <AnimatedDropdown size={30} color="#E5E7EB">
      <div className="flex flex-col items-center pb-2 px-1 w-full">
        <div className="mt-2">
          <TooltipPlus
            position="right"
            offset={4}
            hideArrow
            popupClassName="!p-0 !bg-gray-25"
            popupContent={
              <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-black/5">
                {t('workflow.blocks.start')}
              </div>
            }
          >
            <HouseLine
              size={22}
              color="#6B7280"
              weight="fill"
              className="cursor-pointer"
            />
          </TooltipPlus>
        </div>
        <div className="mt-2">
          <TooltipPlus
            position="right"
            offset={4}
            hideArrow
            popupClassName="!p-0 !bg-gray-25"
            popupContent={
              <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-black/5">
                {t('workflow.blocks.train')}
              </div>
            }
          >
            <MathOperations
              size={22}
              color="#6B7280"
              weight="fill"
              className="cursor-pointer"
            />
          </TooltipPlus>
        </div>
      </div>
    </AnimatedDropdown>
  );
};
