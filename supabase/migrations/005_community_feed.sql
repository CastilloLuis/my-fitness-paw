-- ============================================================
-- Community Feed: feed_posts + purrs
-- ============================================================

-- 1. feed_posts — one row per play_session, auto-created by trigger
create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.play_sessions(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  cat_id uuid not null references public.cats(id) on delete cascade,
  purr_count int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_feed_posts_created_at on public.feed_posts (created_at desc);

-- RLS
alter table public.feed_posts enable row level security;

create policy "Authenticated users can read all feed posts"
  on public.feed_posts for select
  to authenticated
  using (true);

create policy "Owners can delete their own feed posts"
  on public.feed_posts for delete
  to authenticated
  using (owner_id = auth.uid());

-- Allow the trigger (runs as postgres) to insert
create policy "Service can insert feed posts"
  on public.feed_posts for insert
  to authenticated
  with check (owner_id = auth.uid());


-- 2. purrs — one per (post, user) pair
create table if not exists public.purrs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.feed_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index idx_purrs_post_id on public.purrs (post_id);

-- RLS
alter table public.purrs enable row level security;

create policy "Authenticated users can read purrs"
  on public.purrs for select
  to authenticated
  using (true);

create policy "Users can insert their own purrs"
  on public.purrs for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can delete their own purrs"
  on public.purrs for delete
  to authenticated
  using (user_id = auth.uid());


-- 3. Trigger: auto-create feed_post when a play_session is inserted
create or replace function public.on_play_session_created()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.feed_posts (session_id, owner_id, cat_id, created_at)
  values (new.id, new.owner_id, new.cat_id, new.played_at);
  return new;
end;
$$;

create trigger trg_play_session_feed
  after insert on public.play_sessions
  for each row
  execute function public.on_play_session_created();


-- 4. RPC: toggle_purr — atomic insert-or-delete + counter update
create or replace function public.toggle_purr(p_post_id uuid, p_user_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_existed boolean;
begin
  -- Try to delete first
  delete from public.purrs
    where post_id = p_post_id and user_id = p_user_id;

  if found then
    v_existed := true;
    update public.feed_posts
      set purr_count = greatest(purr_count - 1, 0)
      where id = p_post_id;
  else
    v_existed := false;
    insert into public.purrs (post_id, user_id)
      values (p_post_id, p_user_id);
    update public.feed_posts
      set purr_count = purr_count + 1
      where id = p_post_id;
  end if;

  return json_build_object(
    'purred', not v_existed,
    'purr_count', (select purr_count from public.feed_posts where id = p_post_id)
  );
end;
$$;
