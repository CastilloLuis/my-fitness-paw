import { useMemo } from 'react';
import { calculateStreak } from '@/src/utils/streak';
import type { PlaySession } from '@/src/supabase/types';

export function useStreak(sessions: PlaySession[] | undefined) {
  return useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const dates = sessions.map((s) => new Date(s.played_at));
    return calculateStreak(dates);
  }, [sessions]);
}
