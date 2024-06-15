import { API_BASE } from './constants';

export default {
  home: () => {
    return '/';
  },
  login: (noTry = false) => {
    return `/login${noTry ? '?nt=1' : ''}`;
  },
  onboarding: {
    home: () => {
      return '/onboarding';
    },
    survey: () => {
      return '/onboarding/survey';
    },
    llmPreference: () => {
      return '/onboarding/llm-preference';
    },
    embeddingPreference: () => {
      return '/onboarding/embedding-preference';
    },
    userSetup: () => {
      return '/onboarding/user-setup';
    },
    dataHandling: () => {
      return '/onboarding/data-handling';
    },
    createWorkspace: () => {
      return '/onboarding/create-workspace';
    },
  },
  github: () => {
    return 'https://github.com/jazelly/FinetuneLLMs';
  },
  uploadDatasets: () => {
    return '/upload';
  },
  discord: () => {
    return 'https://discord.com/invite/6UyHPeGZAC';
  },
  docs: () => {
    return 'https://docs.useanything.com';
  },
  hosting: () => {
    return 'https://my.mintplexlabs.com/aio-checkout?product=anythingllm';
  },
  workspace: {
    chat: (slug) => {
      return `/workspace/${slug}`;
    },
    settings: {
      generalAppearance: (slug) => {
        return `/workspace/${slug}/settings/general-appearance`;
      },
      chatSettings: (slug) => {
        return `/workspace/${slug}/settings/chat-settings`;
      },
      members: (slug) => {
        return `/workspace/${slug}/settings/members`;
      },
    },
    thread: (wsSlug, threadSlug) => {
      return `/workspace/${wsSlug}/t/${threadSlug}`;
    },
  },
  apiDocs: () => {
    return `${API_BASE}/docs`;
  },
  settings: {
    system: () => {
      return `/settings/system-preferences`;
    },
    users: () => {
      return `/settings/users`;
    },
    invites: () => {
      return `/settings/invites`;
    },
    workspaces: () => {
      return `/settings/workspaces`;
    },
    chats: () => {
      return '/settings/workspace-chats';
    },
    llmPreference: () => {
      return '/settings/llm-preference';
    },
    transcriptionPreference: () => {
      return '/settings/transcription-preference';
    },
    audioPreference: () => {
      return '/settings/audio-preference';
    },
    embedder: {
      modelPreference: () => '/settings/embedding-preference',
      chunkingPreference: () => '/settings/text-splitter-preference',
    },
    embeddingPreference: () => {
      return '/settings/embedding-preference';
    },
    security: () => {
      return '/settings/security';
    },
    appearance: () => {
      return '/settings/appearance';
    },
    apiKeys: () => {
      return '/settings/api-keys';
    },
    logs: () => {
      return '/settings/event-logs';
    },
    privacy: () => {
      return '/settings/privacy';
    },
    embedSetup: () => {
      return `/settings/embed-config`;
    },
    embedChats: () => {
      return `/settings/embed-chats`;
    },
  },
};
