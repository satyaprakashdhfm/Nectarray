-- =============================================================================
--  Keep public.profiles in step with auth.users metadata
--
--  Two holes in 0001, both of which left a signed-in student with a null name:
--
--  1. The sign-in modal finishes by calling supabase.auth.updateUser(), which
--     writes to auth.users.raw_user_meta_data — NOT to public.profiles. The
--     dashboard reads profiles, so the name never arrived.
--  2. handle_new_user() only looked for 'first_name'. Google returns
--     given_name / family_name / full_name / name, so every Google sign-in
--     produced a profile with nothing in it.
--
--  Fixed by extracting the name once, and syncing on UPDATE as well as INSERT.
-- =============================================================================

-- Pull a first/last name out of whatever the provider actually sent.
create or replace function public.name_from_metadata(meta jsonb)
returns table (first_name text, last_name text)
language sql immutable as $$
  select
    coalesce(
      nullif(meta ->> 'first_name', ''),
      nullif(meta ->> 'given_name', ''),
      -- "Satya Prakash Reddy" → "Satya"
      nullif(split_part(coalesce(meta ->> 'full_name', meta ->> 'name', ''), ' ', 1), '')
    ),
    coalesce(
      nullif(meta ->> 'last_name', ''),
      nullif(meta ->> 'family_name', ''),
      -- everything after the first space, so middle names survive
      nullif(
        substr(
          coalesce(meta ->> 'full_name', meta ->> 'name', ''),
          strpos(coalesce(meta ->> 'full_name', meta ->> 'name', ' '), ' ') + 1
        ),
        ''
      )
    );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  parsed record;
begin
  select * into parsed from public.name_from_metadata(new.raw_user_meta_data);

  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    new.email,
    parsed.first_name,
    parsed.last_name,
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- The missing half: metadata written after signup must reach profiles too.
-- COALESCE so a later sign-in that carries less metadata cannot blank a name
-- the student already filled in.
create or replace function public.sync_profile_from_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  parsed record;
begin
  select * into parsed from public.name_from_metadata(new.raw_user_meta_data);

  update public.profiles set
    email      = coalesce(new.email, email),
    first_name = coalesce(parsed.first_name, first_name),
    last_name  = coalesce(parsed.last_name, last_name),
    phone      = coalesce(nullif(new.raw_user_meta_data ->> 'phone', ''), phone)
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.sync_profile_from_user();

-- Backfill anyone who signed up before this migration and got a blank profile.
update public.profiles p set
  first_name = coalesce(p.first_name, n.first_name),
  last_name  = coalesce(p.last_name,  n.last_name),
  phone      = coalesce(p.phone, nullif(u.raw_user_meta_data ->> 'phone', '')),
  email      = coalesce(p.email, u.email)
from auth.users u,
     lateral public.name_from_metadata(u.raw_user_meta_data) n
where p.id = u.id;
