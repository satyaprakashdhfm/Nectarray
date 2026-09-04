-- A day appears once per module. Nothing enforced this, so an import that ran
-- twice would have quietly produced two "Day 1"s; it also gives the notes
-- importers a conflict target, so re-running one updates rather than appends.
create unique index if not exists lessons_module_day_key
  on public.lessons (module_id, day_label);
