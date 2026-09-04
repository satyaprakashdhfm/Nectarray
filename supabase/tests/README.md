# Policy tests

The row-level security policies in `../migrations/0001_init.sql` are the only
thing standing between a signed-in student and the whole course, so they are
tested rather than assumed. These run against a throwaway local Postgres —
no Supabase project needed.

```bash
export PATH=/usr/lib/postgresql/16/bin:$PATH
mkdir -p /tmp/pgtest && chown postgres /tmp/pgtest
su postgres -c "initdb -D /tmp/pgtest -A trust -U postgres"
su postgres -c "pg_ctl -D /tmp/pgtest -o '-k /tmp -p 5433 -c listen_addresses=' start"

psql -h /tmp -p 5433 -U postgres -c 'create database fresh;'
psql -h /tmp -p 5433 -U postgres -d fresh -f 00_auth_stub.sql
psql -h /tmp -p 5433 -U postgres -d fresh -f ../migrations/0001_init.sql
psql -h /tmp -p 5433 -U postgres -d fresh -f 01_attacks.sql
psql -h /tmp -p 5433 -U postgres -d fresh -f 02_positive.sql
```

`00_auth_stub.sql` fakes the two things Supabase provides and a bare Postgres
does not: the `auth.users` table and `auth.uid()`. The stub reads a GUC, so a
test can act as any user with `set local "request.jwt.claim.sub"`.

## What must stay true

| # | Attack | Expected |
| - | ------ | -------- |
| 1 | Student inserts their own enrolment as `enrolled` | RLS violation |
| 2 | Student updates their application to `enrolled` | `UPDATE 0` |
| 3 | Student sets `profiles.role = 'admin'` | permission denied |
| 4 | Non-enrolled student reads lessons/modules | 0 rows |
| 5 | Student submits work pre-scored 10/10 | RLS violation |

Attack 3 is the one that actually got through the first time, and it is worth
understanding why. The `profiles_update_own` policy lets a user update their
own row, and an UPDATE policy's `WITH CHECK` sees only the NEW row — it cannot
compare against the OLD one, so it cannot say "any column but this one".
`update profiles set role='admin' where id=auth.uid()` succeeded, and from
there every other policy fell over, because they all trust `is_admin()`.

The fix is column-level privilege, not policy: `revoke update on profiles`,
then grant update on `(first_name, last_name, phone)` only. Role changes are
a service-role operation — the SQL editor, or a server route holding
`SUPABASE_SERVICE_ROLE_KEY` — never something the browser can do.
