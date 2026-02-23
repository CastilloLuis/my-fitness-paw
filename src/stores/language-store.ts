import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { getLocales } from 'expo-localization';

interface LanguageState {
  /** null = follow device language */
  language: 'en' | 'es' | null;
  setLanguage: (lang: 'en' | 'es' | null) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: null,
      setLanguage: (lang) => {
        set({ language: lang });
        const resolved =
          lang ?? (getLocales()[0]?.languageCode === 'es' ? 'es' : 'en');
        i18n.changeLanguage(resolved);
      },
    }),
    {
      name: '@myfitnesspaw:language',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const resolved =
          state.language ??
          (getLocales()[0]?.languageCode === 'es' ? 'es' : 'en');
        i18n.changeLanguage(resolved);
      },
    }
  )
);
