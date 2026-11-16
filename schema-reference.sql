-- Money OS personal account schema (Supabase / PostgreSQL)
-- Each signed-in user owns one private JSON snapshot. RLS prevents cross-account access.
create table if not exists public.personal_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"budget":0,"income":0,"accounts":[],"transactions":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint personal_state_shape check (
    jsonb_typeof(state) = 'object'
    and jsonb_typeof(state->'accounts') = 'array'
    and jsonb_typeof(state->'transactions') = 'array'
  )
);

alter table public.personal_state enable row level security;

-- A user may only read their own row.
drop policy if exists "read own personal state" on public.personal_state;
create policy "read own personal state"
  on public.personal_state for select to authenticated
  using (user_id = auth.uid());

-- A user may only insert their own row.
drop policy if exists "insert own personal state" on public.personal_state;
create policy "insert own personal state"
  on public.personal_state for insert to authenticated
  with check (user_id = auth.uid());

-- A user may only update their own row.
drop policy if exists "update own personal state" on public.personal_state;
create policy "update own personal state"
  on public.personal_state for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update on public.personal_state to authenticated;
revoke all on public.personal_state from anon;
