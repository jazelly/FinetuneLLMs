'use client';
import type { FC } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import cn from 'classnames';
import { Clipboard, ClipboardText } from '@phosphor-icons/react';

type Props = {
  className?: string;
  title: JSX.Element | string;
  headerRight?: JSX.Element;
  children: JSX.Element;
  minHeight?: number;
  value: string;
  isFocus: boolean;
  isInNode?: boolean;
};

const Base: FC<Props> = ({
  className,
  title,
  headerRight,
  children,
  minHeight = 120,
  value,
  isFocus,
  isInNode,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const editorContentMinHeight = minHeight - 28;
  const [editorContentHeight, setEditorContentHeight] = useState(
    editorContentMinHeight
  );

  const [isCopied, setIsCopied] = React.useState(false);
  const handleCopy = useCallback(() => {
    copy(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [value]);

  return (
    <div className={className ?? ''}>
      <div
        ref={ref}
        className={cn(
          className,
          'rounded-lg border',
          isFocus
            ? 'bg-white border-gray-200'
            : 'bg-gray-100 border-gray-100 overflow-hidden'
        )}
      >
        <div className="flex justify-between items-center h-7 pt-1 pl-3 pr-2">
          <div className="text-xs font-semibold text-gray-700">{title}</div>
          <div
            className="flex items-center"
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              e.stopPropagation();
            }}
          >
            {headerRight}
            {!isCopied ? (
              <Clipboard onClick={handleCopy} />
            ) : (
              <ClipboardText className="mx-1 w-3.5 h-3.5 text-gray-500" />
            )}
          </div>
        </div>

        <div className="h-full pb-2">{children}</div>
      </div>
    </div>
  );
};
export default React.memo(Base);
