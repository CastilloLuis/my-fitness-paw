import { useEffect, useState } from 'react';
import { supabase } from '@/src/supabase/client';
import { useUIStore } from '@/src/stores/ui-store';
import type { Session } from '@supabase/supabase-js';

export function useAuth() {
  const session = useUIStore((s) => s.session);
  const setSession = useUIStore((s) => s.setSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession]);

  return {
    session,
    user: session?.user ?? null,
    userId: session?.user?.id ?? null,
    loading,
    isAuthenticated: !!session,
  };
}
