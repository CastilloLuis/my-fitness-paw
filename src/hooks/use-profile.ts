import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/constants/query-keys';
import { getProfile } from '@/src/supabase/queries/profiles';
import { useAuth } from './use-auth';

export function useProfile() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
}
