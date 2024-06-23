import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface ScrollableProps {
  children: any;
  color?: string;
}

const Scrollable = ({ children, color }: ScrollableProps) => {
  const scrollColor = color ?? 'rgba(69, 81, 102, 0.5)';

  return (
    <Scrollbars
      className={`w-full h-full`}
      autoHide
      renderThumbVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: scrollColor,
          }}
          className={`rounded-md`}
        />
      )}
    >
      {children}
    </Scrollbars>
  );
};

export default Scrollable;
