import { useEffect, useState } from 'react';

import { isMobile } from 'react-device-detect';
import FullScreenLoader from '@/components/reusable/Loaders.component';
import React from 'react';

export default function Privacy() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      setSettings(settings);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <div className=" flex">
      <div
        style={{ height: isMobile ? '100%' : 'calc(100% - 32px)' }}
        className="relative w-full h-full"
      >
        <div className="flex flex-col w-full">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                Privacy & Data-Handling
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              This is your configuration for how connected third party providers
              and FinetuneLLMs handle your data.
            </p>
          </div>
          {loading && (
            <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
              <div className="w-full h-full flex justify-center items-center">
                <FullScreenLoader />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
