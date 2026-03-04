# Community Feed — Architecture & How It Works

This document covers the full community feed system: database schema, publish flow, feed display, purrs (likes), comments with threaded replies, and the caching/refresh strategy.

---

## Database Schema

### Tables

#### `feed_posts`
Auto-created by a trigger whenever a `play_session` is inserted. Holds denormalized counters for purrs and comments.

```sql
CREATE TABLE public.feed_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL UNIQUE REFERENCES play_sessions(id) ON DELETE CASCADE,
  owner_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cat_id        uuid NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  purr_count    int  NOT NULL DEFAULT 0,
  comment_count int  NOT NULL DEFAULT 0,
  published     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

Key points:
- `published` defaults to `false`. Posts only appear in the feed after the user explicitly shares.
- `purr_count` and `comment_count` are denormalized counters updated by RPCs (never directly by the client).
- `session_id` is UNIQUE — one feed post per play session.

#### `purrs`
One row per (post, user) pair. Like a "like" but cat-themed.

```sql
CREATE TABLE public.purrs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
```

#### `comments`
Threaded comments with one level of nesting (replies). `parent_id` is NULL for top-level comments, or references another comment for replies.

```sql
CREATE TABLE public.comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id  uuid REFERENCES comments(id) ON DELETE CASCADE,
  text       text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Key points:
- Max 500 characters per comment.
- `ON DELETE CASCADE` on `parent_id` — deleting a parent removes all its replies.
- Only one level of nesting is supported in the UI (replies can't have replies).

### Trigger

When a `play_session` is inserted, a trigger automatically creates a `feed_post`:

```sql
CREATE FUNCTION public.on_play_session_created()
RETURNS trigger AS $$
BEGIN
  INSERT INTO feed_posts (session_id, owner_id, cat_id, created_at)
  VALUES (new.id, new.owner_id, new.cat_id, new.played_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_play_session_feed
  AFTER INSERT ON play_sessions
  FOR EACH ROW EXECUTE FUNCTION on_play_session_created();
```

The post is created with `published = false`. It won't appear in anyone's feed until the user publishes it.

### RPCs

All counter mutations go through RPCs (SECURITY DEFINER) to keep counts consistent:

| RPC | What it does |
|-----|-------------|
| `publish_feed_post(p_session_id)` | Sets `published = true` for the post matching the session. Returns the post ID. Only works for the post owner (`auth.uid()`). |
| `toggle_purr(p_post_id, p_user_id)` | If the user already purred → deletes the purr and decrements `purr_count`. Otherwise → inserts a purr and increments. Returns `{ purred: boolean, purr_count: number }`. |
| `add_comment(p_post_id, p_text, p_parent_id?)` | Inserts a comment (with optional parent for replies) and increments `comment_count`. Returns `{ id: uuid }`. |
| `delete_comment(p_comment_id)` | Deletes the comment (only if owned by `auth.uid()`) and decrements `comment_count`. |

### RLS Policies

| Table | SELECT | INSERT | DELETE |
|-------|--------|--------|--------|
| `feed_posts` | All authenticated | Owner only | Owner only |
| `purrs` | All authenticated | Own user_id | Own user_id |
| `comments` | All authenticated | Own user_id | Own user_id |

### Migrations (run in order)

1. `005_community_feed.sql` — feed_posts, purrs, trigger, toggle_purr RPC
2. `006_fix_feed_posts_fk.sql` — FK fix
3. `007_feed_published.sql` — adds `published` column, backfills existing posts, publish_feed_post RPC
4. `008_cat_extra_images.sql` — adds `image_base64_2`, `image_base64_3` to cats
5. `009_comments.sql` — comments table, comment_count column, add_comment/delete_comment RPCs

---

## Publish Flow

When a user saves a play session (manual or live), they get a native `Alert.alert` prompt:

```
┌─────────────────────────────────┐
│  Share to Community?            │
│                                 │
│  Your play session with Mochi   │
│  will appear in the community   │
│  feed.                          │
│                                 │
│  [Not now]          [Share]     │
└─────────────────────────────────┘
```

- **"Share"** → calls `publishFeedPost(session.id)` RPC → sets `published = true` → refetches the feed
- **"Not now"** → navigates back, post stays unpublished (invisible in feed)

### Code flow

1. `createSession.mutateAsync(...)` saves the play session → trigger creates a `feed_post` with `published = false`
2. On success, show Alert
3. If user taps "Share", call `publishPost.mutate(session.id)` → RPC sets `published = true`
4. `usePublishFeedPost` hook calls `refetchQueries` on success to update the feed

Files: `app/session/manual.tsx`, `app/session/live.tsx`

---

## Feed Display

### Query (`getFeedPosts`)

```
src/supabase/queries/feed.ts
```

Fetches published posts with cursor-based pagination:

```typescript
supabase
  .from('feed_posts')
  .select(`
    id, session_id, owner_id, cat_id, purr_count, comment_count, created_at,
    play_sessions (activity_type, duration_minutes, notes, played_at),
    cats (name, emoji, image_base64),
    profiles (display_name),
    purrs (id)
  `)
  .eq('published', true)
  .eq('purrs.user_id', userId)   // filters purrs join to check if current user purred
  .order('created_at', { ascending: false })
  .limit(5)
```

Key details:
- **PAGE_SIZE = 5** — loads 5 cards at a time for smooth infinite scroll
- **Cursor**: uses `created_at` of the last post. Next page fetches `.lt('created_at', cursor)`.
- **`purrs` join** is filtered to the current user to determine `has_purred` (boolean check on array length)
- **Cat image** comes from `cats.image_base64` via the join

### Hook (`useFeed`)

```
src/hooks/use-feed.ts
```

- Uses `useInfiniteQuery` with `getNextPageParam` returning the cursor
- **Auto-refresh**: `refetchInterval: 60_000` (every 60 seconds)
- The community screen's `FlatList` calls `fetchNextPage()` via `onEndReached`

### Feed Card Layout

```
┌─────────────────────────────────────────┐
│  [CatEmoji]  Owner Name        2h ago   │  ← header
│              with CatName               │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │  Cat photo or activity icon     │    │  ← hero banner (120px)
│  └─────────────────────────────────┘    │
│  Wand / Feather                         │  ← activity name
│  15 min session                         │  ← duration
│  "She was energetic today!"             │  ← notes (if any)
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  🐾 12          💬 3                    │  ← purr + comment buttons
└─────────────────────────────────────────┘
```

- Hero shows cat photo (base64) if available, otherwise activity-colored gradient with activity icon
- Animation: `FadeIn` (opacity only, no vertical translation)
- Comment button opens the comments sheet

---

## Purrs (Likes)

### How it works
- Tap 🐾 → optimistic toggle in the UI cache (instant ++ or --)
- Mutation fires `toggle_purr` RPC in the background
- On error, rolls back to previous cache state
- No refetch on success — the 60s auto-refresh keeps it in sync

### Optimistic update logic

```typescript
// In onMutate (before the API call):
post.has_purred = !post.has_purred
post.purr_count = post.has_purred
  ? post.purr_count - 1   // was purred, now un-purring
  : post.purr_count + 1   // wasn't purred, now purring
```

---

## Comments

### Fetching comments (`getComments`)

Comments are fetched in two steps because there's no direct FK from `comments` to `profiles`:

1. Fetch comments from `comments` table filtered by `post_id`
2. Batch-fetch profiles using the unique `user_id`s from step 1
3. Merge display names into comment objects

```typescript
const rows = await supabase.from('comments').select('...').eq('post_id', postId);
const userIds = [...new Set(rows.map(r => r.user_id))];
const profiles = await supabase.from('profiles').select('id, display_name').in('id', userIds);
// merge into CommentWithProfile[]
```

### Adding comments (`useAddComment`)

1. **Optimistic local insert**: Comment is immediately added to local state in the sheet component (temp ID like `local-1709...`)
2. **Mutation**: Calls `add_comment` RPC which inserts the row and increments `comment_count`
3. **Feed card count**: `onSuccess` optimistically bumps `comment_count` in the feed cache
4. **No refetch**: Server data refreshes when the sheet is reopened (fresh mount = fresh query) or via the 60s auto-refresh

### Threading model

Comments have a single level of nesting:

```
Top-level comment (parent_id = NULL)
  └── Reply 1 (parent_id = top-level.id)
  └── Reply 2 (parent_id = top-level.id)
Top-level comment
  └── Reply
```

**UI rules:**
- Top-level comments can be swiped left to reply (reveals arrow-undo icon on right side)
- Replies are rendered indented (40px left padding) with smaller avatars (28px vs 32px)
- Replies CANNOT be swiped — no nested replies
- Reply indicator bar appears above the input when replying, with cancel button

### Swipe-to-reply gesture

Uses `react-native-gesture-handler` Pan gesture + Reanimated:

- **Direction**: Swipe LEFT (negative X translation)
- **Threshold**: 50px to trigger
- **Icon**: Ionicons `arrow-undo` in a primary-colored circle, revealed on the right side
- **Animation**: `withTiming(200ms)` snap-back. Icon scales from 0.5→1 using `interpolate` with `CLAMP`
- **Haptic**: Medium impact feedback on trigger

### Comments sheet

Opened as a `Modal` with `presentationStyle="pageSheet"` (iOS page sheet animation). Only mounted when `commentsPostId` is set — unmounting clears the query cache and local state, so every open is a fresh fetch.

---

## Caching & Refresh Strategy

| Action | Strategy |
|--------|----------|
| Feed list | `useInfiniteQuery`, auto-refetch every 60s, pull-to-refresh |
| Purr toggle | Optimistic cache update, rollback on error, no refetch |
| Publish post | Immediate `refetchQueries` |
| Add comment | Optimistic local insert in sheet + count bump in feed cache, no refetch |
| Open comments | Fresh mount → fresh query (sheet unmounts on close) |

---

## File Map

| File | Purpose |
|------|---------|
| `supabase/migrations/005_community_feed.sql` | feed_posts, purrs, trigger, toggle_purr |
| `supabase/migrations/007_feed_published.sql` | published column + publish RPC |
| `supabase/migrations/009_comments.sql` | comments table + RPCs |
| `src/supabase/types.ts` | `FeedPostWithDetails`, `CommentWithProfile`, `TogglePurrResult` |
| `src/supabase/queries/feed.ts` | `getFeedPosts`, `togglePurr`, `publishFeedPost`, `getComments`, `addComment` |
| `src/constants/query-keys.ts` | `feed.all`, `feed.comments(postId)` |
| `src/hooks/use-feed.ts` | `useFeed`, `useTogglePurr`, `usePublishFeedPost`, `useComments`, `useAddComment` |
| `src/components/feed/feed-card.tsx` | Card component with hero banner, purr + comment buttons |
| `src/components/feed/purr-button.tsx` | Animated purr button with scale + haptics |
| `src/components/feed/comments-sheet.tsx` | Comments modal with swipe-to-reply + optimistic insert |
| `src/components/feed/feed-skeleton.tsx` | Loading skeleton matching card layout |
| `app/(tabs)/community.tsx` | Feed screen with FlatList, infinite scroll, comments sheet |
| `app/session/manual.tsx` | Manual session → publish alert |
| `app/session/live.tsx` | Live session → publish alert |
