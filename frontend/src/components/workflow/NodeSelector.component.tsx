import {
  Database,
  HouseLine,
  MathOperations,
  PlusCircle,
  Question,
} from '@phosphor-icons/react';
import cn from 'classnames';
import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { TooltipPlus } from '../reusable/TooltipPlus.component';
import { AnimatedDropdown } from '../reusable/AnimatedDropdown.component';
import { DragPreviewImage, useDrag, useDragLayer } from 'react-dnd';
import CustomNode from './nodes';
import { BlockEnum } from './types';
import styled from 'styled-components';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';

const DraggableNode = ({ type, children, className }) => {
  const ref = useRef(null);
  const previewRef = useRef();
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const x = monitor.getSourceClientOffset()?.x;
        const y = monitor.getSourceClientOffset()?.y;
        console.log('x, y', x, y);
      }
    },
    options: {
      dropEffect: 'move',
      previewOptions: {
        anchorX: 0.5,
        anchorY: 0.5,
        component: DragPreview,
      },
    },
  }));

  useEffect(() => {
    if (ref.current) {
      preview(ref.current);
    }
  }, [preview]);

  return (
    <div ref={drag} className={cn(isDragging ? 'cursor-move' : '', className)}>
      {children}
    </div>
  );
};

const DragLayer = ({ type }) => {
  const { isDragging, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  const { x, y } = currentOffset;

  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
    transform: `translate(${x}px, ${y}px)`,
  };

  return (
    <div style={layerStyles}>
      <DragPreview type={type} />
    </div>
  );
};

const DragPreview = ({ type }) => {
  // return <CustomNode data={{ type }} />
  return <div className="h2 text-white">NMSL</div>;
};

export const NodeSelector = () => {
  return (
    <AnimatedDropdown size={30} color="#E5E7EB">
      <div className="flex flex-col items-center pb-2 px-1 w-32 bg-white rounded-md text-black">
        <TooltipPlus
          position="right"
          offset={4}
          hideArrow
          popupClassName="!p-0 !bg-gray-25"
          popupContent={
            <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-black/5">
              Use the Dataset node to specify your input data
            </div>
          }
        >
          <DraggableNode
            type={BlockEnum.Dataset}
            className="mt-2 flex items-center justify-between w-full cursor-pointer"
          >
            <div className="flex items-center">
              <Database size={22} color="#9B7280" weight="fill" />
              <span className="ml-1 text-sm">Dataset</span>
            </div>
            <Question size={18} color={'#1b1b1f'} />
          </DraggableNode>
        </TooltipPlus>

        <TooltipPlus
          position="right"
          offset={4}
          hideArrow
          popupClassName="!p-0 !bg-gray-25"
          popupContent={
            <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-black/5">
              Use the Train node to specify a model training job
            </div>
          }
        >
          <DraggableNode
            type={BlockEnum.Train}
            className="mt-2 flex items-center justify-between w-full cursor-pointer"
          >
            <div className="flex items-center">
              <MathOperations
                size={22}
                color="#6B7280"
                weight="fill"
                className="cursor-pointer"
              />
              <span className="ml-1 text-sm">Train</span>
            </div>
            <Question size={18} />
          </DraggableNode>
        </TooltipPlus>
      </div>
    </AnimatedDropdown>
  );
};
