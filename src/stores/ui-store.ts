import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

interface UIStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
  addCatSheetOpen: boolean;
  setAddCatSheetOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  addCatSheetOpen: false,
  setAddCatSheetOpen: (open) => set({ addCatSheetOpen: open }),
}));
