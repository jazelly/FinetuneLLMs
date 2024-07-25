import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LanguagesSupported } from './language';

const loadLangResources = async (lang: string) => {
  const resources = {
    translation: {
      common: (await import(`./${lang}/common`)).default,
      layout: (await import(`./${lang}/layout`)).default,
      login: (await import(`./${lang}/login`)).default,
      register: (await import(`./${lang}/register`)).default,
      app: (await import(`./${lang}/app`)).default,
      appOverview: (await import(`./${lang}/app-overview`)).default,
      appDebug: (await import(`./${lang}/app-debug`)).default,
      appApi: (await import(`./${lang}/app-api`)).default,
      appLog: (await import(`./${lang}/app-log`)).default,
      appAnnotation: (await import(`./${lang}/app-annotation`)).default,
      share: (await import(`./${lang}/share-app`)).default,
      dataset: (await import(`./${lang}/dataset`)).default,
      datasetDocuments: (await import(`./${lang}/dataset-documents`)).default,
      datasetHitTesting: (await import(`./${lang}/dataset-hit-testing`))
        .default,
      datasetSettings: (await import(`./${lang}/dataset-settings`)).default,
      datasetCreation: (await import(`./${lang}/dataset-creation`)).default,
      explore: (await import(`./${lang}/explore`)).default,
      billing: (await import(`./${lang}/billing`)).default,
      custom: (await import(`./${lang}/custom`)).default,
      tools: (await import(`./${lang}/tools`)).default,
      workflow: (await import(`./${lang}/workflow`)).default,
      runLog: (await import(`./${lang}/run-log`)).default,
    },
  };
  return resources;
};

// Automatically generate the resources object
const loadResources = async () => {
  const resources = {};
  for (const lang of LanguagesSupported) {
    resources[lang] = await loadLangResources(lang);
  }
  return resources;
};

const resources = await loadResources();

i18n.use(initReactI18next).init({
  lng: undefined,
  fallbackLng: 'en-US',
  resources,
});

export const changeLanguage = i18n.changeLanguage;
export default i18n;
