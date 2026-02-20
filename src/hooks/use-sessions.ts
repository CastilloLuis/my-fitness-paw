import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/constants/query-keys';
import {
  getSessions,
  getSessionsByCat,
  getTodaySessions,
  getWeeklySessions,
  createSession,
  deleteSession,
} from '@/src/supabase/queries/sessions';
import { useAuth } from './use-auth';
import type { SessionInsert } from '@/src/supabase/types';

export function useSessions() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.sessions.all,
    queryFn: () => getSessions(userId!),
    enabled: !!userId,
  });
}

export function useSessionsByCat(catId: string | null) {
  return useQuery({
    queryKey: queryKeys.sessions.byCat(catId!),
    queryFn: () => getSessionsByCat(catId!),
    enabled: !!catId,
  });
}

export function useTodaySessions() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.sessions.today(userId!),
    queryFn: () => getTodaySessions(userId!),
    enabled: !!userId,
  });
}

export function useWeeklySessions() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.sessions.weekly(userId!),
    queryFn: () => getWeeklySessions(userId!),
    enabled: !!userId,
  });
}

export function useCreateSession() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: SessionInsert) => createSession(userId!, session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.today(userId!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.weekly(userId!) });
    },
  });
}

export function useDeleteSession() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.today(userId!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.weekly(userId!) });
    },
  });
}
