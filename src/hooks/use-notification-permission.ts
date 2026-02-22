import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { getNotificationPermissionStatus } from '@/src/utils/notifications';

/**
 * Checks notification permission status on mount and when the app
 * returns from background (user may have toggled it in system settings).
 * Returns { enabled, recheck } so callers can trigger a re-check after requesting permission.
 */
export function useNotificationPermission() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  const check = useCallback(async () => {
    const granted = await getNotificationPermissionStatus();
    setEnabled(granted);
  }, []);

  useEffect(() => {
    check();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => sub.remove();
  }, [check]);

  return { enabled, recheck: check };
}
