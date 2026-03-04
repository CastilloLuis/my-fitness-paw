-- Fix: feed_posts.owner_id must FK to profiles (not auth.users)
-- so PostgREST can resolve the join for display_name
alter table public.feed_posts
  drop constraint feed_posts_owner_id_fkey;

alter table public.feed_posts
  add constraint feed_posts_owner_id_fkey
  foreign key (owner_id) references public.profiles(id) on delete cascade;

-- Backfill: create feed_posts for any play_sessions that exist
-- but don't yet have a corresponding feed_post
insert into public.feed_posts (session_id, owner_id, cat_id, created_at)
select ps.id, ps.owner_id, ps.cat_id, ps.played_at
from public.play_sessions ps
where not exists (
  select 1 from public.feed_posts fp where fp.session_id = ps.id
);
