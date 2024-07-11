import { useState } from 'react';
import { formatDate, middleTruncate } from '@/utils/directories';
import { BracketsCurly, File, ImageSquare } from '@phosphor-icons/react';
import debounce from 'lodash.debounce';
import React from 'react';

export default function DatasetRow({ file, selected, toggleSelection }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShowTooltip = () => {
    setShowTooltip(true);
  };

  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  const handleMouseEnter = debounce(handleShowTooltip, 500);
  const handleMouseLeave = debounce(handleHideTooltip, 500);
  console.log('file.extension', file.extension);
  return (
    <tr
      onClick={() => toggleSelection(file)}
      className={`text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 hover:bg-sky-500/20 cursor-pointer file-row ${
        selected ? 'selected' : ''
      }`}
    >
      <div className="pl-2 col-span-6 flex gap-x-[4px] items-center">
        {file.extension === '.json' ? (
          <BracketsCurly
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="bold"
          />
        ) : ['.png', '.jpg', 'jpeg'].includes(file.extension) ? (
          <ImageSquare
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="bold"
          />
        ) : (
          <File
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="bold"
          />
        )}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p className="whitespace-nowrap overflow-hidden max-w-[165px] text-ellipsis">
            {middleTruncate(file.name, 17)}
          </p>
          {showTooltip && (
            <div className="absolute left-0 bg-white text-black p-1.5 rounded shadow-lg whitespace-nowrap">
              {file.name}
            </div>
          )}
        </div>
      </div>
      <p className="col-span-3 pl-3.5 whitespace-nowrap">
        {formatDate(file.lastUpdatedAt)}
      </p>
      <p className="col-span-2 pl-2 uppercase overflow-x-hidden">
        {file.extension}
      </p>
    </tr>
  );
}
