-- 0007 — what the admin panel needs to actually run a cohort.
--
--   * money: what a student paid, when, and against which reference
--   * a class room that exists without anyone having to create one
--   * screenshot-backed proof for Python problems, checked by the grader
--
-- Written to be safely re-runnable.

-- ---------------------------------------------------------------------------
-- Payments
--
-- On the enrolment rather than the profile: someone can enrol twice (a repeat
-- cohort, a deferred seat) and each seat is paid for separately.
-- ---------------------------------------------------------------------------
alter table public.enrolments
  add column if not exists amount_paid  numeric(10, 2),
  add column if not exists paid_on      date,
  add column if not exists payment_ref  text;

comment on column public.enrolments.amount_paid is
  'What the student actually paid for this seat, in rupees. Null means not recorded.';
comment on column public.enrolments.payment_ref is
  'UPI reference, bank narration or receipt number — whatever ties it to a statement.';

-- A negative fee is always a typo, and it would quietly skew every total.
alter table public.enrolments
  drop constraint if exists enrolments_amount_paid_check;
alter table public.enrolments
  add constraint enrolments_amount_paid_check
  check (amount_paid is null or amount_paid >= 0);

-- ---------------------------------------------------------------------------
-- The class room
--
-- Google Meet has no way to mint a link that behaves like a room from a
-- personal account: meet.google.com/new makes a *new* meeting every time, and
-- the stable ones come from a Calendar event (OAuth, a consent screen, a
-- stored refresh token) or a Workspace nickname. Neither is worth standing up
-- to start a class.
--
-- So every cohort gets a deterministic room of its own the moment it exists.
-- The URL is the room: whoever opens it first starts the call, everyone after
-- that joins it, and it is the same address every day. If the admin would
-- rather use Google Meet, they paste a Calendar link into meet_url and that
-- wins — this is the floor, not a ceiling.
-- ---------------------------------------------------------------------------
alter table public.cohorts
  add column if not exists room_slug text;

comment on column public.cohorts.room_slug is
  'Room name for the always-on fallback class link. meet_url overrides it.';

update public.cohorts
set room_slug = 'nectarray-' || regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')
                || '-' || substr(replace(id::text, '-', ''), 1, 8)
where room_slug is null;

alter table public.cohorts
  alter column room_slug set default null;

-- ---------------------------------------------------------------------------
-- Screenshot-backed Python attempts
--
-- A LeetCode problem cannot be checked in the browser the way a SQL query can:
-- there is no public API that serves the test cases, and running arbitrary
-- Python client-side is not the same thing as running it against them. So the
-- evidence is the student's own accepted submission, and the grader reads it.
-- ---------------------------------------------------------------------------
create table if not exists public.practice_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.practice_questions (id) on delete cascade,
  image_path  text not null,
  status      text not null default 'pending'
                check (status in ('pending', 'accepted', 'rejected', 'error')),
  feedback    text,
  model       text,
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists practice_attempts_user_idx
  on public.practice_attempts (user_id, question_id, created_at desc);

alter table public.practice_attempts enable row level security;

drop policy if exists attempts_select_own on public.practice_attempts;
create policy attempts_select_own on public.practice_attempts
  for select using (user_id = auth.uid() or public.is_admin());

-- A student may lodge an attempt, never judge one. The verdict columns must
-- arrive empty; only the grading route, holding the service role, fills them.
drop policy if exists attempts_insert_own on public.practice_attempts;
create policy attempts_insert_own on public.practice_attempts
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and feedback is null
    and model is null
    and reviewed_at is null
  );

drop policy if exists attempts_admin_all on public.practice_attempts;
create policy attempts_admin_all on public.practice_attempts
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Progress: SQL ticks itself, Python must be earned
--
-- The old policy let a student write any progress row for themselves, which
-- was fine while every tick was a checkbox. Now that a Python tick means "an
-- accepted submission was read and believed", it cannot be self-served — so
-- inserts are narrowed to the SQL track, where correctness is proved in the
-- browser by running the query. Python rows are written by the grading route.
-- ---------------------------------------------------------------------------
drop policy if exists progress_own on public.practice_progress;

drop policy if exists progress_select on public.practice_progress;
create policy progress_select on public.practice_progress
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists progress_insert_sql on public.practice_progress;
create policy progress_insert_sql on public.practice_progress
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.practice_questions q
      where q.id = question_id and q.track = 'sql'
    )
  );

drop policy if exists progress_delete_sql on public.practice_progress;
create policy progress_delete_sql on public.practice_progress
  for delete to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.practice_questions q
      where q.id = question_id and q.track = 'sql'
    )
  );

drop policy if exists progress_admin_all on public.practice_progress;
create policy progress_admin_all on public.practice_progress
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage for those screenshots
--
-- Private bucket. A student writes only into their own folder and can read
-- only their own files; the admin sees everything.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submissions', 'submissions', false, 5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists submissions_insert_own on storage.objects;
create policy submissions_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists submissions_select_own on storage.objects;
create policy submissions_select_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'submissions'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
