import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface StoriesState {
  viewedIds: string[];
  lastResetDate: string;
  markViewed: (id: string) => void;
  isViewed: (id: string) => boolean;
}

export const useStoriesStore = create<StoriesState>()(
  persist(
    (set, get) => ({
      viewedIds: [],
      lastResetDate: todayStr(),
      markViewed: (id) => {
        const state = get();
        if (!state.viewedIds.includes(id)) {
          set({ viewedIds: [...state.viewedIds, id] });
        }
      },
      isViewed: (id) => get().viewedIds.includes(id),
    }),
    {
      name: '@myfitnesspaw:stories',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.lastResetDate !== todayStr()) {
          state.viewedIds = [];
          state.lastResetDate = todayStr();
        }
      },
    }
  )
);
