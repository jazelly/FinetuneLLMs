import { createContext, useEffect, useState } from 'react';
import FinetuneLLMs from '@/media/logo/fllms-transparent.png';

export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState('');

  useEffect(() => {
    setLogo(FinetuneLLMs);
  }, []);

  return (
    <LogoContext.Provider value={{ logo, setLogo }}>
      {children}
    </LogoContext.Provider>
  );
}
