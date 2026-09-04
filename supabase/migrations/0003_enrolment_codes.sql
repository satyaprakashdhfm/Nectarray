-- =============================================================================
--  Enrolment codes
--
--  Payment happens off-platform for now: the student talks to us, pays, and
--  is given a code. Redeeming it is what turns their account into a seat.
--
--  A student cannot write their own enrolment status — 0001 makes sure of
--  that — so redemption runs inside a SECURITY DEFINER function. The browser
--  submits a string; the database decides whether it means anything.
-- =============================================================================

create table if not exists public.enrolment_codes (
  code        text primary key,
  cohort_id   uuid not null references public.cohorts on delete cascade,
  note        text,                    -- who it is for, payment reference
  created_by  uuid references auth.users,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz,
  redeemed_by uuid references auth.users,
  redeemed_at timestamptz
);

create index if not exists enrolment_codes_cohort_idx
  on public.enrolment_codes (cohort_id, redeemed_at);

alter table public.enrolment_codes enable row level security;

-- Admins only. Students never read this table at all: they redeem through
-- the function below, which is the only thing that ever sees a code row.
drop policy if exists codes_admin_all on public.enrolment_codes;
create policy codes_admin_all on public.enrolment_codes
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
--  Generating a code
--
--  The alphabet omits I, O, 0 and 1 on purpose. These get read out over the
--  phone and typed into WhatsApp, and those four are where transcription
--  errors come from.
-- -----------------------------------------------------------------------------

create or replace function public.generate_enrolment_code(
  p_cohort_id  uuid,
  p_note       text default null,
  p_expires_at timestamptz default null
)
returns text language plpgsql security definer set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
  i integer;
begin
  if not public.is_admin() then
    raise exception 'Not authorised';
  end if;

  loop
    v_code := 'NECT-';
    for i in 1..8 loop
      if i = 5 then v_code := v_code || '-'; end if;
      v_code := v_code || substr(
        alphabet,
        1 + floor(random() * length(alphabet))::int,
        1
      );
    end loop;
    exit when not exists (
      select 1 from public.enrolment_codes where code = v_code
    );
  end loop;

  insert into public.enrolment_codes (code, cohort_id, note, created_by, expires_at)
  values (v_code, p_cohort_id, nullif(p_note, ''), auth.uid(), p_expires_at);

  return v_code;
end;
$$;

-- -----------------------------------------------------------------------------
--  Redeeming a code
--
--  Returns a jsonb result rather than raising, so the UI can show the reason
--  without parsing an exception string. Never says whether a code exists —
--  "not valid, or already used" covers both, so the endpoint cannot be used
--  to enumerate live codes.
-- -----------------------------------------------------------------------------

create or replace function public.redeem_enrolment_code(p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_row   public.enrolment_codes%rowtype;
  v_seats integer;
  v_taken integer;
begin
  if v_user is null then
    return jsonb_build_object('ok', false, 'error', 'Sign in first.');
  end if;

  -- Accept what a human actually types: any case, spaces anywhere.
  p_code := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  if p_code = '' then
    return jsonb_build_object('ok', false, 'error', 'Enter a code.');
  end if;

  -- Claim it in one statement. Two students racing the same code cannot both
  -- win: the second UPDATE matches no row, because redeemed_by is no longer
  -- null by the time it runs.
  update public.enrolment_codes
     set redeemed_by = v_user, redeemed_at = now()
   where code = p_code
     and redeemed_by is null
     and (expires_at is null or expires_at > now())
  returning * into v_row;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'error', 'That code is not valid, or has already been used.'
    );
  end if;

  select seats into v_seats from public.cohorts where id = v_row.cohort_id;
  select count(*) into v_taken
    from public.enrolments
   where cohort_id = v_row.cohort_id
     and status in ('enrolled', 'completed')
     and user_id <> v_user;

  if v_taken >= coalesce(v_seats, 0) then
    -- Hand the code back rather than burning it on a full cohort.
    update public.enrolment_codes
       set redeemed_by = null, redeemed_at = null
     where code = p_code;
    return jsonb_build_object('ok', false, 'error', 'That cohort is full.');
  end if;

  insert into public.enrolments (user_id, cohort_id, status)
  values (v_user, v_row.cohort_id, 'enrolled')
  on conflict (user_id, cohort_id)
    do update set status = 'enrolled';

  return jsonb_build_object('ok', true);
end;
$$;

-- Execute rights are granted, not inherited. A SECURITY DEFINER function is
-- executable by PUBLIC unless told otherwise, and neither of these should be
-- reachable by an anonymous visitor.
revoke all on function public.generate_enrolment_code(uuid, text, timestamptz) from public, anon;
revoke all on function public.redeem_enrolment_code(text) from public, anon;
grant execute on function public.generate_enrolment_code(uuid, text, timestamptz) to authenticated;
grant execute on function public.redeem_enrolment_code(text) to authenticated;
