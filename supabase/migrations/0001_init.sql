-- =============================================================================
--  NectArray Academy — initial schema
--  Run once in Supabase → SQL Editor → New query → Run.
--  Safe to re-run: every statement is guarded.
--
--  ORDER MATTERS. Tables come first, then the helper functions that query
--  them, then the policies that call those functions. A `language sql`
--  function body is parsed and validated at CREATE time, so defining
--  is_admin() before public.profiles exists fails outright.
-- =============================================================================

-- -----------------------------------------------------------------------------
--  1. Tables
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  first_name  text,
  last_name   text,
  phone       text,
  role        text not null default 'student' check (role in ('student', 'admin')),
  created_at  timestamptz not null default now()
);

create table if not exists public.cohorts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  starts_on  date,
  ends_on    date,
  seats      integer not null default 5,
  meet_url   text,                       -- the live-class Google Meet link
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enrolments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  cohort_id  uuid not null references public.cohorts on delete cascade,
  status     text not null default 'applied'
             check (status in ('applied', 'accepted', 'enrolled', 'completed', 'withdrawn')),
  note       text,
  created_at timestamptz not null default now(),
  unique (user_id, cohort_id)
);

create table if not exists public.modules (
  id       uuid primary key default gen_random_uuid(),
  slug     text unique not null,
  title    text not null,
  summary  text,
  position integer not null
);

create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references public.modules on delete cascade,
  day_label    text not null,             -- "Day 5–6"
  title        text not null,
  summary      text,
  body_md      text,                      -- the documentation itself
  position     integer not null,
  is_published boolean not null default false,
  updated_at   timestamptz not null default now()
);

create table if not exists public.assignments (
  id           uuid primary key default gen_random_uuid(),
  lesson_id    uuid not null references public.lessons on delete cascade,
  title        text not null,
  prompt_md    text not null,
  starter_code text,
  max_score    integer not null default 10,
  position     integer not null default 1,
  is_published boolean not null default false
);

create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments on delete cascade,
  user_id       uuid not null references auth.users on delete cascade,
  code          text not null,
  language      text not null default 'python',
  score         integer check (score between 0 and 10),
  verdict       text check (verdict in ('correct', 'partial', 'incorrect')),
  feedback_md   text,
  graded_at     timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists submissions_user_idx
  on public.submissions (user_id, created_at desc);

create table if not exists public.practice_questions (
  id              uuid primary key default gen_random_uuid(),
  track           text not null check (track in ('sql', 'python')),
  difficulty      text not null check (difficulty in ('easy', 'medium', 'hard')),
  position        integer not null,
  title           text not null,
  prompt_md       text not null,
  hint_md         text,
  solution_sql    text,
  expected_result jsonb,                  -- checked against the browser result
  leetcode_url    text,
  is_published    boolean not null default true
);

create table if not exists public.practice_progress (
  user_id     uuid references auth.users on delete cascade,
  question_id uuid references public.practice_questions on delete cascade,
  solved_at   timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- -----------------------------------------------------------------------------
--  2. Helper functions
--
--  SECURITY DEFINER on purpose: they read their tables with RLS bypassed.
--  Without that, a policy on `profiles` that itself queries `profiles` would
--  recurse infinitely and every query against the table would fail.
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_enrolled()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.enrolments
    where user_id = auth.uid() and status in ('enrolled', 'completed')
  );
$$;

-- Populate the profile when the auth user is created, so there is never a
-- signed-in user without one.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
--  3. Row-level security
--
--  Every table is deny-by-default. The anon key in the browser is therefore
--  harmless on its own: it can only ever see what a policy below allows.
-- =============================================================================

alter table public.profiles           enable row level security;
alter table public.cohorts            enable row level security;
alter table public.enrolments         enable row level security;
alter table public.modules            enable row level security;
alter table public.lessons            enable row level security;
alter table public.assignments        enable row level security;
alter table public.submissions        enable row level security;
alter table public.practice_questions enable row level security;
alter table public.practice_progress  enable row level security;

-- profiles ---------------------------------------------------------------
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Column privileges, not RLS, are what stop a student writing their own role.
--
-- The policy above lets a user update their own row, and an UPDATE policy's
-- WITH CHECK sees only the NEW row — it cannot compare against the OLD one,
-- so it cannot express "every column but this one". Without the revoke below,
-- `update profiles set role = 'admin' where id = auth.uid()` succeeds and the
-- student owns the whole course. Verified: it did.
--
-- Role changes are therefore a service-role operation (the SQL editor, or a
-- server route using SUPABASE_SERVICE_ROLE_KEY), never something the browser
-- can perform with the anon key.
revoke update on public.profiles from anon, authenticated;
grant update (first_name, last_name, phone) on public.profiles to authenticated;

-- cohorts ----------------------------------------------------------------
drop policy if exists cohorts_read on public.cohorts;
create policy cohorts_read on public.cohorts
  for select to authenticated using (true);

drop policy if exists cohorts_admin_write on public.cohorts;
create policy cohorts_admin_write on public.cohorts
  for all using (public.is_admin()) with check (public.is_admin());

-- enrolments -------------------------------------------------------------
drop policy if exists enrolments_select_own on public.enrolments;
create policy enrolments_select_own on public.enrolments
  for select using (user_id = auth.uid() or public.is_admin());

-- A student may apply for themselves, and only ever as 'applied'. Promotion
-- to accepted/enrolled is an admin action — otherwise anyone could grant
-- themselves the course.
drop policy if exists enrolments_apply_self on public.enrolments;
create policy enrolments_apply_self on public.enrolments
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'applied');

drop policy if exists enrolments_admin_write on public.enrolments;
create policy enrolments_admin_write on public.enrolments
  for all using (public.is_admin()) with check (public.is_admin());

-- course content — published rows, visible to enrolled students and admins
drop policy if exists modules_read on public.modules;
create policy modules_read on public.modules
  for select to authenticated using (public.is_enrolled() or public.is_admin());

drop policy if exists modules_admin_write on public.modules;
create policy modules_admin_write on public.modules
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists lessons_read on public.lessons;
create policy lessons_read on public.lessons
  for select to authenticated
  using (is_published and (public.is_enrolled() or public.is_admin()));

drop policy if exists lessons_admin_write on public.lessons;
create policy lessons_admin_write on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists assignments_read on public.assignments;
create policy assignments_read on public.assignments
  for select to authenticated
  using (is_published and (public.is_enrolled() or public.is_admin()));

drop policy if exists assignments_admin_write on public.assignments;
create policy assignments_admin_write on public.assignments
  for all using (public.is_admin()) with check (public.is_admin());

-- submissions ------------------------------------------------------------
drop policy if exists submissions_select_own on public.submissions;
create policy submissions_select_own on public.submissions
  for select using (user_id = auth.uid() or public.is_admin());

-- A student submits their own work, and cannot write their own mark: score,
-- verdict and feedback are set server-side by the grader using the service
-- role, which bypasses RLS.
drop policy if exists submissions_insert_own on public.submissions;
create policy submissions_insert_own on public.submissions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and score is null and verdict is null and feedback_md is null
  );

drop policy if exists submissions_admin_write on public.submissions;
create policy submissions_admin_write on public.submissions
  for all using (public.is_admin()) with check (public.is_admin());

-- practice ---------------------------------------------------------------
-- Deliberately readable by any signed-in user, enrolled or not: the practice
-- sheets double as the free sample of what the programme is like.
drop policy if exists practice_read on public.practice_questions;
create policy practice_read on public.practice_questions
  for select to authenticated using (is_published or public.is_admin());

drop policy if exists practice_admin_write on public.practice_questions;
create policy practice_admin_write on public.practice_questions
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists progress_own on public.practice_progress;
create policy progress_own on public.practice_progress
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- =============================================================================
--  4. Seed — the three modules and the first cohort
-- =============================================================================

insert into public.modules (slug, title, summary, position) values
  ('python',    'Python Core & Advanced',
   'From what a program even is, through to threads, async and a capstone.', 1),
  ('sql',       'SQL & Relational Databases',
   'Taught in MySQL 8. Every query in the notes was executed before it was written down.', 2),
  ('placement', 'Placement Readiness & Career Strategy',
   'The part that turns the previous 40 days into an offer.', 3)
on conflict (slug) do nothing;

insert into public.cohorts (name, seats, is_active)
select 'Cohort 01', 5, true
where not exists (select 1 from public.cohorts where name = 'Cohort 01');
