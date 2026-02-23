import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/constants/query-keys';
import { fetchActiveStories } from '@/src/supabase/queries/stories';

export function useStories() {
  return useQuery({
    queryKey: queryKeys.stories.active,
    queryFn: fetchActiveStories,
    staleTime: 30 * 60 * 1000, // 30 minutes — admin content changes rarely
  });
}
