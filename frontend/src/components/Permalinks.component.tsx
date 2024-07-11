import { PermalinksContext } from '@/contexts/Permalinks.context';
import { CaretRight } from '@phosphor-icons/react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function Permalinks() {
  const navigate = useNavigate();
  const { permalinks } = useContext(PermalinksContext);

  return (
    <div className="flex flex-start items-center pt-1 px-2 text-2xl h-full">
      {permalinks.map((link, index) => {
        return (
          <React.Fragment key={index}>
            <div
              onClick={() => {
                // the last element is unclickable
                if (index < permalinks.length - 1) navigate(link.url);
              }}
              className={`text-base font-semibold ${index < permalinks.length - 1 ? 'text-main-blue cursor-pointer' : 'text-main-gray'}`}
            >
              {link.name}
            </div>
            {index < permalinks.length - 1 && (
              <div className="ml-3 mr-3">
                <CaretRight size={20} color="#d6dee7" weight="bold" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Permalinks;
