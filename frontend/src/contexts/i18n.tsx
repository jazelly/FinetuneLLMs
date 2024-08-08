import { createContext, useContext } from 'use-context-selector';
import type { Locale } from '@/i18n';

type II18NContext = {
  locale: Locale;
  i18n: Record<string, any>;
};

const I18NContext = createContext<II18NContext>({
  locale: 'en',
  i18n: {},
});

export const useI18N = () => useContext(I18NContext);

export default I18NContext;
