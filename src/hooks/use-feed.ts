import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/src/constants/query-keys';
import { getFeedPosts, togglePurr, publishFeedPost, getComments, addComment } from '@/src/supabase/queries/feed';
import { useAuth } from './use-auth';
import type { FeedPostWithDetails } from '@/src/supabase/types';

export function useFeed() {
  const { userId } = useAuth();

  return useInfiniteQuery({
    queryKey: queryKeys.feed.all,
    queryFn: ({ pageParam }) => getFeedPosts(userId!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
    refetchInterval: 60_000,
  });
}

export function useTogglePurr() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePurr(postId, userId!),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.feed.all });

      const previous = queryClient.getQueryData(queryKeys.feed.all);

      queryClient.setQueryData(queryKeys.feed.all, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: FeedPostWithDetails) =>
              post.id === postId
                ? {
                    ...post,
                    has_purred: !post.has_purred,
                    purr_count: post.has_purred
                      ? Math.max(post.purr_count - 1, 0)
                      : post.purr_count + 1,
                  }
                : post
            ),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _postId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.feed.all, context.previous);
      }
    },
  });
}

export function usePublishFeedPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => publishFeedPost(sessionId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.feed.all });
    },
  });
}

export function useComments(postId: string | null) {
  return useQuery({
    queryKey: queryKeys.feed.comments(postId!),
    queryFn: () => getComments(postId!),
    enabled: !!postId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, text, parentId }: { postId: string; text: string; parentId?: string | null }) =>
      addComment(postId, text, parentId),
    onSuccess: (_data, variables) => {
      // Optimistically bump comment_count in feed
      queryClient.setQueryData(queryKeys.feed.all, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: FeedPostWithDetails) =>
              post.id === variables.postId
                ? { ...post, comment_count: post.comment_count + 1 }
                : post
            ),
          })),
        };
      });
    },
  });
}
