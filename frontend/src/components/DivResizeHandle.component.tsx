import { ArrowLineLeft, ArrowLineRight } from "@phosphor-icons/react";
import React, { MouseEventHandler, TouchEventHandler, useState } from "react";
import type { ResizableBox, ResizeHandle } from "react-resizable";

interface ResizeHandleProps {
  innerRef: any;
  isHoldingHandle: boolean;
  setIsHoldingHandle: Function;
  handleMouseUp: (e, cb) => void;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
  onMouseUp?: MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: TouchEventHandler<HTMLDivElement>;
  className: any;
}

const DivResizeHandle = React.forwardRef<ResizableBox, ResizeHandleProps>(
  (props, ref) => {
    const {
      innerRef,
      isHoldingHandle,
      setIsHoldingHandle,
      handleMouseUp,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      className: classNameOuter,
    } = props;
    const [isHolding, setIsHolding] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = (e) => {
      setIsHovered(true);
    };

    const handleMouseLeave = (e) => {
      setIsHovered(false);
    };

    const handleMouseDown = (e) => {
      setIsHoldingHandle(true);
      onMouseDown!(e);
    };

    const handleMouseUpCallback = () => {
      setIsHoldingHandle(false);
    };

    return (
      <div
        id="div-line-lr"
        ref={innerRef}
        className={`${classNameOuter} ${
          isHoldingHandle
            ? "div-handle-highlight"
            : isHovered
            ? "div-handle-highlight-weak"
            : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={(e) => handleMouseUp(e, onMouseUp)}
        onTouchEnd={onTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></div>
    );
  }
);

export default DivResizeHandle;
