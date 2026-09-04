-- Minimal stand-ins for what Supabase provides, so the migration runs as-is.
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb default '{}'::jsonb
);
-- auth.uid() reads a request-scoped setting in Supabase; a GUC mimics it.
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
create role anon;
create role authenticated;
create role service_role;
