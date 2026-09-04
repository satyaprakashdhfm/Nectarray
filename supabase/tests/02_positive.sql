\echo '-- Student CAN still edit their own name and phone (expect UPDATE 1):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  update public.profiles set first_name = 'Satya', phone = '+91 93815 02998'
    where id = '11111111-1111-1111-1111-111111111111';
commit;

\echo ''
\echo '-- Admin sees all profiles (expect 2) and all modules (expect 3):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
  select count(*) as profiles from public.profiles;
  select count(*) as modules  from public.modules;
  select public.is_admin() as admin_flag;
commit;

\echo ''
\echo '-- Admin promotes the student to enrolled (expect UPDATE 1):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';
  update public.enrolments set status = 'enrolled'
    where user_id = '11111111-1111-1111-1111-111111111111';
commit;

\echo ''
\echo '-- Now-enrolled student sees modules (expect 3):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  select public.is_enrolled() as enrolled_flag;
  select count(*) as modules_visible from public.modules;
commit;

\echo ''
\echo '-- Seed an assignment, then ATTACK 5: student self-scores 10/10 (expect DENIED):'
insert into public.lessons (module_id, day_label, title, position, is_published)
  select id, 'Day 1', 'Programming Fundamentals', 1, true from public.modules where slug='python';
insert into public.assignments (lesson_id, title, prompt_md, is_published)
  select id, 'Hello, world', 'Print it.', true from public.lessons limit 1;

begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  insert into public.submissions (assignment_id, user_id, code, score, verdict)
    select id, '11111111-1111-1111-1111-111111111111', 'print("hi")', 10, 'correct'
    from public.assignments limit 1;
commit;

\echo ''
\echo '-- CONTROL: ungraded submission (expect INSERT 1):'
begin;
  set local role authenticated;
  set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
  insert into public.submissions (assignment_id, user_id, code)
    select id, '11111111-1111-1111-1111-111111111111', 'print("hi")'
    from public.assignments limit 1;
commit;
