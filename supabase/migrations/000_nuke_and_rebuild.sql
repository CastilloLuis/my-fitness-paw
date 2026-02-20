-- SINGLE QUERY: paste this entire thing into Supabase SQL Editor and hit Run.
-- It drops everything and rebuilds from scratch. No trigger.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
drop policy if exists "Users own their profile" on profiles;
drop policy if exists "Users own their cats" on cats;
drop policy if exists "Users own their sessions" on play_sessions;
drop table if exists play_sessions;
drop table if exists cats;
drop table if exists profiles;

-- Also clean up any auth users (go to Authentication > Users and delete them manually)

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  created_at timestamptz default now()
);

create table cats (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  breed text,
  age_years int,
  weight_kg numeric(4,2),
  energy_level text check (energy_level in ('couch_potato', 'balanced', 'wild_hunter')) default 'balanced',
  emoji text default '🐱',
  created_at timestamptz default now()
);

create table play_sessions (
  id uuid default gen_random_uuid() primary key,
  cat_id uuid references cats(id) on delete cascade not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  activity_type text not null,
  duration_minutes int not null,
  notes text,
  played_at timestamptz default now()
);

alter table profiles enable row level security;
alter table cats enable row level security;
alter table play_sessions enable row level security;

create policy "Users own their profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users own their cats" on cats
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users own their sessions" on play_sessions
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
