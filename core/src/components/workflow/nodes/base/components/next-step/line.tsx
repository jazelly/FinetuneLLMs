import React from 'react';
import { memo } from 'react';

type LineProps = {
  linesNumber: number;
};
const Line = ({ linesNumber }: LineProps) => {
  const svgHeight = linesNumber * 36 + (linesNumber - 1) * 12;

  return (
    <svg className="shrink-0 w-6" style={{ height: svgHeight }}>
      {Array(linesNumber)
        .fill(0)
        .map((_, index) => (
          <g key={index}>
            {index === 0 && (
              <>
                <rect x={0} y={16} width={1} height={4} fill="#98A2B3" />
                <path
                  d="M0,18 L24,18"
                  strokeWidth={1}
                  stroke="#D0D5DD"
                  fill="none"
                />
              </>
            )}
            {index > 0 && (
              <path
                d={`M0,18 Q12,18 12,28 L12,${index * 48 + 18 - 10} Q12,${index * 48 + 18} 24,${index * 48 + 18}`}
                strokeWidth={1}
                stroke="#D0D5DD"
                fill="none"
              />
            )}
            <rect
              x={23}
              y={index * 48 + 18 - 2}
              width={1}
              height={4}
              fill="#98A2B3"
            />
          </g>
        ))}
    </svg>
  );
};

export default memo(Line);
