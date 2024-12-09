import React, { TouchEventHandler, useCallback, useState } from 'react';
import type { ResizableBox, ResizeHandle } from 'react-resizable';

interface ResizeHandleProps {
  innerRef: any;
  className: any;
}

const DivResizeHandle = React.forwardRef<ResizableBox, ResizeHandleProps>(
  (props) => {
    const { innerRef, className: classNameOuter } = props;
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // const handleMouseDown = useCallback(() => {
    //   setIsDragging(true);
    //   console.log('123');
    //   const handleMouseUp = () => {
    //     setIsDragging(false);
    //     document.removeEventListener('mouseup', handleMouseUp);
    //   };
    //   document.addEventListener('mouseup', handleMouseUp);
    // }, []);

    const handleMouseEnter = (e) => {
      setIsHovered(true);
    };

    const handleMouseLeave = (e) => {
      setIsHovered(false);
    };

    return (
      <div
        id="div-line-lr"
        ref={innerRef}
        className={`${classNameOuter} ${
          isDragging || isHovered ? 'div-handle-highlight' : ''
        }`}
        // onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></div>
    );
  }
);

DivResizeHandle.displayName = 'DivResizeHandle';

export default DivResizeHandle;
