import { useEffect, useState } from 'react';

import { isMobile } from 'react-device-detect';
import showToast from '@/utils/toast';

import FullScreenLoader from '@/components/reusable/Loaders.component';
import {
  EMBEDDING_ENGINE_PRIVACY,
  LLM_SELECTION_PRIVACY,
  VECTOR_DB_PRIVACY,
} from '@/pages/OnboardingFlow/Steps/DataHandling';
import React from 'react';

export default function Privacy() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const settings = await System.keys();
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
          {loading ? (
            <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
              <div className="w-full h-full flex justify-center items-center">
                <FullScreenLoader />
              </div>
            </div>
          ) : (
            <>
              <ThirdParty settings={settings} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ThirdParty({ settings }) {
  const llmChoice = settings?.LLMProvider || 'openai';
  const embeddingEngine = settings?.EmbeddingEngine || 'openai';

  return (
    <div className="py-8 w-full flex items-start justify-center flex-col gap-y-6 border-b-2 border-white/10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">LLM Selection</div>
          <div className="flex items-center gap-2.5">
            <img
              src={LLM_SELECTION_PRIVACY[llmChoice].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {LLM_SELECTION_PRIVACY[llmChoice].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {LLM_SELECTION_PRIVACY[llmChoice].description.map((desc) => (
              <li className="text-white/90 text-sm">{desc}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">
            Embedding Preference
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={EMBEDDING_ENGINE_PRIVACY[embeddingEngine].logo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">
              {EMBEDDING_ENGINE_PRIVACY[embeddingEngine].name}
            </p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {EMBEDDING_ENGINE_PRIVACY[embeddingEngine].description.map(
              (desc) => (
                <li className="text-white/90 text-sm">{desc}</li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
