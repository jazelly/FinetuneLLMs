import { useEffect, useState } from 'react';

// Providers which cannot use this feature for workspace<>model selection
export const DISABLED_PROVIDERS = [
  'azure',
  'lmstudio',
  'native',
  'textgenwebui',
];
const PROVIDER_DEFAULT_MODELS = {
  openai: [],
  gemini: ['gemini-pro', 'gemini-1.5-pro-latest'],
  anthropic: [
    'claude-instant-1.2',
    'claude-2.0',
    'claude-2.1',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  azure: [],
  lmstudio: [],
  localai: [],
  ollama: [],
  togetherai: [],
  groq: [
    'mixtral-8x7b-32768',
    'llama3-8b-8192',
    'llama3-70b-8192',
    'gemma-7b-it',
  ],
  native: [],
  cohere: [
    'command-r',
    'command-r-plus',
    'command',
    'command-light',
    'command-nightly',
    'command-light-nightly',
  ],
  textgenwebui: [],
};

// For togetherAi, which has a large model list - we subgroup the options
// by their creator organization (eg: Meta, Mistral, etc)
// which makes selection easier to read.
function groupModels(models) {
  return models.reduce((acc, model) => {
    acc[model.organization] = acc[model.organization] || [];
    acc[model.organization].push(model);
    return acc;
  }, {});
}

const groupedProviders = ['togetherai', 'openai', 'openrouter'];
export default function useGetProviderModels(provider = null) {
  const [defaultModels, setDefaultModels] = useState([]);
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviderModels() {
      if (!provider) return;
      const { models = [] } = await System.customModels(provider);
      if (
        PROVIDER_DEFAULT_MODELS.hasOwnProperty(provider) &&
        !groupedProviders.includes(provider)
      ) {
        setDefaultModels(PROVIDER_DEFAULT_MODELS[provider]);
      } else {
        setDefaultModels([]);
      }

      groupedProviders.includes(provider)
        ? setCustomModels(groupModels(models))
        : setCustomModels(models);
      setLoading(false);
    }
    fetchProviderModels();
  }, [provider]);

  return { defaultModels, customModels, loading };
}
