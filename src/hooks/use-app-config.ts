import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/constants/query-keys';
import { fetchAppConfig } from '@/src/supabase/queries/app-config';

export function useAppConfig() {
  return useQuery({
    queryKey: queryKeys.appConfig.all,
    queryFn: fetchAppConfig,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
