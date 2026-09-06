-- =============================================================================
--  Academy enquiries, and what the assistant told each one
--
--  The enrolment form at the foot of /academy emailed the answers and said
--  "thanks". The person on the other end had described their background and
--  their goal and got nothing back about whether the programme actually
--  suits them, and we kept no record of what people are asking for.
--
--  Both are fixed by writing the enquiry here. The reply is stored beside
--  the answers, so the admin sees exactly what the applicant was told rather
--  than guessing — an assistant whose output nobody reviews is a liability.
--
--  The logged questions are the more valuable half over time: they are a
--  direct read on what people want that the programme does not yet cover.
-- =============================================================================

create table if not exists public.academy_enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- what they told us
  name        text not null,
  email       text not null,
  phone       text,
  background  text,
  experience  text,
  goal        text,
  timeline    text,
  message     text,

  -- what the assistant told them back
  fit         text check (fit in ('strong', 'partial', 'elsewhere', 'unknown')),
  reply       text,
  model       text,

  -- so an admin can work the list rather than only read it
  handled     boolean not null default false,
  note        text
);

create index if not exists academy_enquiries_created_idx
  on public.academy_enquiries (created_at desc);

alter table public.academy_enquiries enable row level security;

-- Admins read and work the list. Nobody else sees it at all: these rows
-- carry a name, an email and a phone number for someone who has not signed
-- up, so there is no "own row" case to grant — the enquirer has no account.
drop policy if exists academy_enquiries_admin_all on public.academy_enquiries;
create policy academy_enquiries_admin_all on public.academy_enquiries
  for all using (public.is_admin()) with check (public.is_admin());

-- No insert policy on purpose.
--
-- The form is public, so an insert policy for `anon` would be an open write
-- endpoint on a table holding contact details — anyone could fill it with
-- anything at any volume. The route inserts with the service role instead,
-- after it has validated the fields and produced the reply, which also means
-- `fit`, `reply` and `model` can only ever be written by the thing that
-- generated them.
