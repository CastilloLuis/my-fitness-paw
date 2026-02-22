import { useEffect, useRef } from 'react';
import { useCats } from './use-cats';
import { scheduleDailyReminders } from '@/src/utils/notifications';

export function useNotificationScheduler() {
  const { data: cats } = useCats();
  const hasScheduled = useRef(false);

  useEffect(() => {
    if (!cats || cats.length === 0 || hasScheduled.current) return;

    hasScheduled.current = true;
    scheduleDailyReminders(cats);
  }, [cats]);
}
