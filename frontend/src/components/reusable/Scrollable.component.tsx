import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const Scrollable = ({ children }) => {
  return (
    <Scrollbars
      className={`w-full h-full`}
      autoHide
      renderThumbVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
          }}
          className={`rounded-md bg-pipeline-highlight bg-opacity-50`}
        />
      )}
    >
      {children}
    </Scrollbars>
  );
};

export default Scrollable;
