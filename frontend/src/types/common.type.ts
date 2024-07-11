import type { Dispatch, SetStateAction } from 'react';

export interface Permalink {
  name: string;
  url: string;
}

export interface IPermalinksContext {
  permalinks: Permalink[];
  setPermalinks: Dispatch<SetStateAction<Permalink[]>>;
}

export interface IChatMessage {
  message: string;
  role: 'ai' | 'user';
  id: string;
}
