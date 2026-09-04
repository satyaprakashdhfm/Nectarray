\set STUDENT '''11111111-1111-1111-1111-111111111111'''
\set ADMIN   '''22222222-2222-2222-2222-222222222222'''

\echo '=== As STUDENT ==============================================='
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  \echo '-- profiles visible to student (expect 1, their own):'
  select count(*) from public.profiles;
  \echo '-- is_admin() (expect f):'
  select public.is_admin();
  \echo '-- is_enrolled() (expect f):'
  select public.is_enrolled();
commit;

\echo ''
\echo '-- ATTACK 1: grant myself an enrolled seat (expect DENIED):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  insert into public.enrolments (user_id, cohort_id, status)
  select :STUDENT::uuid, id, 'enrolled' from public.cohorts limit 1;
commit;

\echo ''
\echo '-- CONTROL: apply as applied (expect ALLOWED):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  insert into public.enrolments (user_id, cohort_id, status)
  select :STUDENT::uuid, id, 'applied' from public.cohorts limit 1;
commit;

\echo ''
\echo '-- ATTACK 2: promote my own application to enrolled (expect 0 rows):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  update public.enrolments set status = 'enrolled' where user_id = :STUDENT::uuid;
commit;

\echo ''
\echo '-- ATTACK 3: make myself an admin (expect 0 rows changed):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  update public.profiles set role = 'admin' where id = :STUDENT::uuid;
  select role as my_role_after from public.profiles where id = :STUDENT::uuid;
commit;

\echo ''
\echo '-- ATTACK 4: read lessons while not enrolled (expect 0):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  select count(*) as lessons_visible from public.lessons;
  select count(*) as modules_visible from public.modules;
commit;
