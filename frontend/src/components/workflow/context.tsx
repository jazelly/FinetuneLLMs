import React, { createContext, useContext, useRef } from 'react';
import { createWorkflowStore } from './store';
import { Locale } from '@/i18n';
import { getLanguage } from '@/i18n/language';

type WorkflowStore = ReturnType<typeof createWorkflowStore>;
export const WorkflowContext = createContext<WorkflowStore | null>(null);

type WorkflowProviderProps = {
  children: React.ReactNode;
};
export const WorkflowContextProvider = ({
  children,
}: WorkflowProviderProps) => {
  const storeRef = useRef<WorkflowStore>();

  if (!storeRef.current) storeRef.current = createWorkflowStore();

  return (
    <WorkflowContext.Provider value={storeRef.current}>
      {children}
    </WorkflowContext.Provider>
  );
};

type II18NContext = {
  locale: Locale;
  i18n: Record<string, any>;
  setLocaleOnClient: (_lang: Locale, _reloadPage?: boolean) => void;
};

const I18NContext = createContext<II18NContext>({
  locale: 'en-US',
  i18n: {},
  setLocaleOnClient: (_lang: Locale, _reloadPage?: boolean) => {},
});

export const useI18N = () => useContext(I18NContext);
export const useGetLanguage = () => {
  const { locale } = useI18N();

  return getLanguage(locale);
};

export default I18NContext;
