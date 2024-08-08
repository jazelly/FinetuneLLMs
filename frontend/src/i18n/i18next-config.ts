import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './en/index';
import translationZH from './zh/index';

const resources = {
  en: {
    translation: translationEN,
  },
  zh: {
    translation: translationZH,
  },
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: resources,
});

export const changeLanguage = i18n.changeLanguage;
export default i18n;
