import { createContext, useEffect, useState } from "react";
import FinetuneLLMs from "./media/logo/FinetuneLLMs_transparent.png";
import System from "./models/system";

export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState("");

  useEffect(() => {
    setLogo(FinetuneLLMs);
  }, []);

  return (
    <LogoContext.Provider value={{ logo, setLogo }}>
      {children}
    </LogoContext.Provider>
  );
}
