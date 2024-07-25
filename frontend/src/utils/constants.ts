import { IChatMessage } from '@/types/common.type';

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const LOCALE_COOKIE_NAME = 'locale';

export const TRAINER_WS_URL_BASE =
  import.meta.env.TRAINER_WS_URL_BASE || 'ws://localhost:8000/';
export const TRAINER_API_BASE =
  import.meta.env.TRAINER_API_BASE || 'http://localhost:8000/';

export const USER_BACKGROUND_COLOR = 'bg-historical-msg-user';
export const AI_BACKGROUND_COLOR = 'bg-historical-msg-system';

export const HF_DATASET_LINK_BASE = 'https://huggingface.co/datasets/';

export const BOTTOM_GAP = 0;
export const HEADER_HEIGHT = 64;
export const SIDEBAR_WIDTH = 64;
export const RIGHT_GAP = 0;

export const PERMALINK_FINETUNE = {
  url: '/',
  name: 'Finetune',
};

export const PERMALINK_JOBS = {
  url: '/jobs',
  name: 'Jobs',
};

export const DEFAULT_CHAT_MESSAGES: IChatMessage[] = [
  {
    message:
      'Welcome to FinetuneLLMs, FinetuneLLMs is an open-source AI tool that simplify your AI training requirements.',
    role: 'ai',
    id: 'system',
  },
  {
    message: 'How do I get started?!',
    role: 'user',
    id: 'anon',
  },
  {
    message:
      "It's simple. You just need to choose model, method and dataset. You can upload a dataset or use the existing HuggingFace ones. Once all set, you can start training your AI by submitting a job.",
    role: 'ai',
    id: 'system',
  },
  {
    message: 'Start creating your first finetuning job',
    role: 'ai',
    id: 'system',
  },
];
