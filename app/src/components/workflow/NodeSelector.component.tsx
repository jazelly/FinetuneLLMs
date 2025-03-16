import {
  Database,
  HouseLine,
  MathOperations,
  PlusCircle,
  Question,
} from '@phosphor-icons/react';
import cn from 'classnames';
import { t } from 'i18next';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TooltipPlus } from '../reusable/TooltipPlus.component';
import { AnimatedDropdown } from '../reusable/AnimatedDropdown.component';
import { DragPreviewImage, useDrag, useDragLayer } from 'react-dnd';
import { BlockEnum } from './types';
import { WorkflowContext } from './context';

// Simplified DraggableNode component that uses HTML5 drag and drop API
const DraggableNode = ({ type, children, className }) => {
  // Handle drag start event
  const handleDragStart = (e) => {
    // Set the data that will be used when dropping
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'move';
    
    // Get the icon element from the children
    const iconElement = e.currentTarget.querySelector('svg');
    const iconHTML = iconElement ? iconElement.outerHTML : '';
    const nodeLabel = e.currentTarget.querySelector('span')?.textContent || type;
    
    // Create a ghost image for dragging
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('flex', 'items-center', 'gap-2', 'bg-indigo-100', 'p-2', 'rounded', 'border', 'border-indigo-300');
    ghostElement.innerHTML = `
      <div class="flex items-center">
        ${iconHTML}
        <span class="ml-2 text-sm font-medium">New ${nodeLabel} Node</span>
      </div>
    `;
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    document.body.appendChild(ghostElement);
    
    e.dataTransfer.setDragImage(ghostElement, 20, 20);
    
    // Remove the ghost element after a short delay
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 100);
  };

  return (
    <div 
      className={cn(
        'cursor-grab active:cursor-grabbing', 
        className,
        'transition-all duration-200'
      )}
      draggable="true"
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  );
};

export const NodeSelector = () => {
  return (
    <AnimatedDropdown size={30} color="#6B7280">
      <div className="flex flex-col items-center pb-2 px-1 w-32 bg-white rounded-md text-gray-800 shadow-md border border-gray-200">
        <TooltipPlus
          position="right"
          offset={4}
          hideArrow
          popupClassName="!p-0 !bg-white"
          popupContent={
            <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-gray-200">
              Use the Dataset node to specify your input data
            </div>
          }
        >
          <DraggableNode
            type={BlockEnum.Dataset}
            className="mt-2 flex items-center justify-between w-full cursor-pointer hover:bg-gray-100 p-1 rounded-md"
          >
            <div className="flex items-center">
              <Database size={22} color="#9B7280" weight="fill" />
              <span className="ml-1 text-sm">Dataset</span>
            </div>
            <Question size={18} color={'#6B7280'} />
          </DraggableNode>
        </TooltipPlus>

        <TooltipPlus
          position="right"
          offset={4}
          hideArrow
          popupClassName="!p-0 !bg-white"
          popupContent={
            <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-gray-200">
              Use the Train node to specify a model training job
            </div>
          }
        >
          <DraggableNode
            type={BlockEnum.Train}
            className="mt-2 flex items-center justify-between w-full cursor-pointer hover:bg-gray-100 p-1 rounded-md"
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
            <Question size={18} color={'#6B7280'} />
          </DraggableNode>
        </TooltipPlus>
        
        {/* Model Node */}
        <TooltipPlus
          position="right"
          offset={4}
          hideArrow
          popupClassName="!p-0 !bg-white"
          popupContent={
            <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-gray-200">
              Use the Model node to specify which model to use
            </div>
          }
        >
          <DraggableNode
            type={BlockEnum.Model}
            className="mt-2 flex items-center justify-between w-full cursor-pointer hover:bg-gray-100 p-1 rounded-md"
          >
            <div className="flex items-center">
              <PlusCircle
                size={22}
                color="#6B7280"
                weight="fill"
                className="cursor-pointer"
              />
              <span className="ml-1 text-sm">Model</span>
            </div>
            <Question size={18} color={'#6B7280'} />
          </DraggableNode>
        </TooltipPlus>
        
        {/* Prompt Node */}
        <TooltipPlus
          position="right"
          offset={4}
          hideArrow
          popupClassName="!p-0 !bg-white"
          popupContent={
            <div className="flex items-center gap-1 px-2 h-6 text-xs font-medium text-gray-700 rounded-lg border-[0.5px] border-gray-200">
              Use the Prompt node to create prompts for your model
            </div>
          }
        >
          <DraggableNode
            type={BlockEnum.Prompt}
            className="mt-2 flex items-center justify-between w-full cursor-pointer hover:bg-gray-100 p-1 rounded-md"
          >
            <div className="flex items-center">
              <HouseLine
                size={22}
                color="#6B7280"
                weight="fill"
                className="cursor-pointer"
              />
              <span className="ml-1 text-sm">Prompt</span>
            </div>
            <Question size={18} color={'#6B7280'} />
          </DraggableNode>
        </TooltipPlus>
      </div>
    </AnimatedDropdown>
  );
};
