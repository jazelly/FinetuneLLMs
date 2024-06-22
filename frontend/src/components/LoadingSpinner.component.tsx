import { Cube } from '@phosphor-icons/react';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Cube color="darkorchid" weight="duotone">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="4s"
          repeatCount="indefinite"
        ></animate>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="5s"
          from="0 0 0"
          to="360 0 0"
          repeatCount="indefinite"
        ></animateTransform>
      </Cube>
    </div>
  );
};

export default LoadingSpinner;
