import type { Permalink, IPermalinksContext } from '@/types/common.type';
import React, { createContext, useState } from 'react';

export const PermalinksContext = createContext<IPermalinksContext>({
  permalinks: [],
  setPermalinks: () => {},
});

export const PermalinksProvider = ({ children }) => {
  const [permalinks, setPermalinks] = useState<Permalink[]>([]);

  return (
    <PermalinksContext.Provider value={{ permalinks, setPermalinks }}>
      {children}
    </PermalinksContext.Provider>
  );
};
