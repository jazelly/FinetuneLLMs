import type { FC } from 'react';
import React, { useEffect } from 'react';
import I18NContext from '@/contexts/i18n';
import type { Locale } from '@/i18n';
import { changeLanguage } from '@/i18n/i18next-config';

export type II18nProps = {
  locale: Locale;
  children: React.ReactNode;
};
const I18n: FC<II18nProps> = ({ locale, children }) => {
  useEffect(() => {
    changeLanguage(locale);
  }, [locale]);

  return (
    <I18NContext.Provider
      value={{
        locale,
        i18n: {},
      }}
    >
      {children}
    </I18NContext.Provider>
  );
};
export default React.memo(I18n);
