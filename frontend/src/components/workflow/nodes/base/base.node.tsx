import type { FC, ReactElement } from 'react';
import { cloneElement, memo, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';
import type { NodeProps } from '../../types';
import { BlockEnum, NodeRunningStatus } from '../../types';
import { NodeSourceHandle, NodeTargetHandle } from './components/node-handle';
import NodeResizer from './components/node-resizer';
import NodeControl from './components/node-control';
import AddVariablePopupWithPosition from './components/add-variable-popup-with-position';
import { CheckCircle, Cube, SpinnerGap, Warning } from '@phosphor-icons/react';
import React from 'react';

type BaseNodeProps = {
  children: ReactElement;
} & NodeProps;

const BaseNode: FC<BaseNodeProps> = ({ id, data, children }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const showSelectedBorder =
    data.selected || data._isBundled || data._isEntering;
  const { showRunningBorder, showSuccessBorder, showFailedBorder } =
    useMemo(() => {
      return {
        showRunningBorder:
          data._runningStatus === NodeRunningStatus.Running &&
          !showSelectedBorder,
        showSuccessBorder:
          data._runningStatus === NodeRunningStatus.Succeeded &&
          !showSelectedBorder,
        showFailedBorder:
          data._runningStatus === NodeRunningStatus.Failed &&
          !showSelectedBorder,
      };
    }, [data._runningStatus, showSelectedBorder]);

  return (
    <div
      className={cn(
        'flex border-[2px] rounded-2xl',
        showSelectedBorder ? 'border-primary-600' : 'border-transparent'
      )}
      ref={nodeRef}
    >
      <div
        className={cn(
          'group relative pb-1 shadow-xs',
          'border border-transparent rounded-[15px]',
          'w-[240px] bg-[#fcfdff]',
          !data._runningStatus && 'hover:shadow-lg',
          showRunningBorder && '!border-primary-500',
          showSuccessBorder && '!border-[#12B76A]',
          showFailedBorder && '!border-[#F04438]',
          data._isBundled && '!shadow-lg'
        )}
      >
        {data._showAddVariablePopup && (
          <AddVariablePopupWithPosition nodeId={id} nodeData={data} />
        )}

        {!data._isCandidate && (
          <NodeTargetHandle
            id={id}
            data={data}
            handleClassName="!top-4 !-left-[9px] !translate-y-0"
            handleId="target"
          />
        )}
        {data.type !== BlockEnum.IfElse && (
          <NodeSourceHandle
            id={id}
            data={data}
            handleClassName="!top-4 !-right-[9px] !translate-y-0"
            handleId="source"
          />
        )}
        {!data._runningStatus && !data._isCandidate && (
          <NodeControl id={id} data={data} />
        )}
        <div
          className={cn(
            'flex items-center px-3 pt-3 pb-2 rounded-t-2xl',
            'bg-[rgba(250,252,255,0.9)]'
          )}
        >
          <Cube className="shrink-0 mr-2" size="md" />
          <div
            title={data.title}
            className="grow mr-1 text-[13px] font-semibold text-gray-700 truncate"
          >
            {data.title}
          </div>
          {data._iterationLength &&
            data._iterationIndex &&
            data._runningStatus === NodeRunningStatus.Running && (
              <div className="mr-1.5 text-xs font-medium text-primary-600">
                {data._iterationIndex}/{data._iterationLength}
              </div>
            )}
          {(data._runningStatus === NodeRunningStatus.Running ||
            data._singleRunningStatus === NodeRunningStatus.Running) && (
            <SpinnerGap className="w-3.5 h-3.5 text-primary-600 animate-spin" />
          )}
          {data._runningStatus === NodeRunningStatus.Succeeded && (
            <CheckCircle className="w-3.5 h-3.5 text-[#12B76A]" />
          )}
          {data._runningStatus === NodeRunningStatus.Failed && (
            <Warning className="w-3.5 h-3.5" color="#F04438" />
          )}
        </div>
        {cloneElement(children, { id, data })}

        <div className="px-3 pt-1 pb-2 text-xs leading-[18px] text-gray-500 whitespace-pre-line break-words">
          {data.desc}
        </div>
      </div>
    </div>
  );
};

export default memo(BaseNode);
