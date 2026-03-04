import { supabase } from '../client';
import type { FeedPostWithDetails, TogglePurrResult, CommentWithProfile } from '../types';

const PAGE_SIZE = 5;


export async function getFeedPosts(
  userId: string,
  cursor?: string
): Promise<{ posts: FeedPostWithDetails[]; nextCursor: string | null }> {
  let query = supabase
    .from('feed_posts')
    .select(
      `
      id,
      session_id,
      owner_id,
      cat_id,
      purr_count,
      comment_count,
      created_at,
      play_sessions (activity_type, duration_minutes, notes, played_at),
      cats (name, emoji, image_base64),
      profiles (display_name),
      purrs (id)
      `
    )
    .eq('published', true)
    .eq('purrs.user_id', userId)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw error;

  const posts: FeedPostWithDetails[] = (data ?? []).map((row: any) => ({
    id: row.id,
    session_id: row.session_id,
    owner_id: row.owner_id,
    cat_id: row.cat_id,
    purr_count: row.purr_count,
    created_at: row.created_at,
    activity_type: row.play_sessions.activity_type,
    duration_minutes: row.play_sessions.duration_minutes,
    notes: row.play_sessions.notes,
    played_at: row.play_sessions.played_at,
    cat_name: row.cats.name,
    cat_emoji: row.cats.emoji,
    cat_image_base64: row.cats.image_base64 ?? null,
    owner_name: row.profiles?.display_name ?? null,
    has_purred: Array.isArray(row.purrs) && row.purrs.length > 0,
    comment_count: row.comment_count ?? 0,
  }));

  const nextCursor =
    posts.length === PAGE_SIZE ? posts[posts.length - 1].created_at : null;

  return { posts, nextCursor };
}

export async function togglePurr(
  postId: string,
  userId: string
): Promise<TogglePurrResult> {
  const { data, error } = await supabase.rpc('toggle_purr', {
    p_post_id: postId,
    p_user_id: userId,
  });
  if (error) throw error;
  return data as TogglePurrResult;
}

export async function publishFeedPost(sessionId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('publish_feed_post', {
    p_session_id: sessionId,
  });
  if (error) throw error;
  return data as string | null;
}

export async function getComments(postId: string): Promise<CommentWithProfile[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, user_id, parent_id, text, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  const rows = data ?? [];
  if (rows.length === 0) return [];

  // Fetch display names separately (no direct FK from comments → profiles)
  const userIds = [...new Set(rows.map((r: any) => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds);

  const nameMap = new Map(
    (profiles ?? []).map((p: any) => [p.id, p.display_name])
  );

  return rows.map((row: any) => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    parent_id: row.parent_id,
    text: row.text,
    created_at: row.created_at,
    display_name: nameMap.get(row.user_id) ?? null,
  }));
}

export async function addComment(
  postId: string,
  text: string,
  parentId?: string | null
): Promise<{ id: string }> {
  const { data, error } = await supabase.rpc('add_comment', {
    p_post_id: postId,
    p_text: text,
    p_parent_id: parentId ?? null,
  });
  if (error) throw error;
  return data as { id: string };
}
