import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './en.json';
import es from './es.json';
import { useLanguageStore } from '@/src/stores/language-store';

const deviceLang = getLocales()[0]?.languageCode ?? 'en';
const storedLang = useLanguageStore.getState().language;

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: storedLang ?? (deviceLang === 'es' ? 'es' : 'en'),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
