import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/constants/query-keys';
import { getCats, createCat, updateCat, deleteCat } from '@/src/supabase/queries/cats';
import { useAuth } from './use-auth';
import type { CatInsert } from '@/src/supabase/types';

export function useCats() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: queryKeys.cats.byOwner(userId!),
    queryFn: () => getCats(userId!),
    enabled: !!userId,
  });
}

export function useCreateCat() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cat: CatInsert) => createCat(userId!, cat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.byOwner(userId!) });
    },
  });
}

export function useUpdateCat() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ catId, updates }: { catId: string; updates: Partial<CatInsert> }) =>
      updateCat(catId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.byOwner(userId!) });
    },
  });
}

export function useDeleteCat() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (catId: string) => deleteCat(catId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cats.byOwner(userId!) });
    },
  });
}
