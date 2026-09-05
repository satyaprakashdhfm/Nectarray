-- =============================================================================
--  Let PostgREST see that an enrolment belongs to a profile
--
--  The admin students page reads:
--
--      supabase.from("profiles").select("*, enrolments(...)")
--
--  and it was returning nothing at all, so the page rendered "Nobody has
--  signed up yet" while three accounts and two enrolments sat in the table.
--
--  Nothing was wrong with the data or the policies. As the admin,
--  is_admin() is true and both tables are fully visible. The problem is that
--  PostgREST will only embed one table inside another when a foreign key
--  joins *those two tables*, and there was not one.
--
--  0001 declared `enrolments.user_id references auth.users`, which is the
--  right constraint for integrity — the identity lives in auth. But it says
--  nothing about public.profiles, so from PostgREST's point of view the two
--  tables are unrelated and the embed fails with PGRST200 rather than
--  returning rows. The Supabase client surfaces that as `data: null`, the
--  page does `profiles ?? []`, and an error becomes an empty state.
--
--  A second foreign key to profiles is the standard fix, and it is additive:
--  the auth.users constraint stays, and both hold. Every profile row exists
--  by the time an enrolment can be created — handle_new_user() writes it on
--  the auth.users insert — so nothing legitimate is excluded. Verified zero
--  orphans before applying.
--
--  Safe to re-run.
-- =============================================================================

alter table public.enrolments
  drop constraint if exists enrolments_user_id_profiles_fkey;

alter table public.enrolments
  add constraint enrolments_user_id_profiles_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

comment on constraint enrolments_user_id_profiles_fkey on public.enrolments is
  'Not for integrity — auth.users already covers that. This is what lets '
  'PostgREST embed enrolments inside a profiles select, which the admin '
  'students page depends on.';
