/**
 * A small but complete landing page, written only in palette variables, so
 * the Colours tab can show what three colours look like on a real page:
 * header, hero, proof strip, cards, call to action and footer.
 *
 * Primary leads (header button, headline accent, main buttons), secondary
 * carries the supporting blocks, and tertiary is used sparingly for tags
 * and highlights. Swapping the roles on the Colours tab shows the same page
 * with the colours in different jobs.
 */
export const SAMPLE_SITE = `
<div class="bg-white font-sans text-zinc-900">
  <header class="border-b border-zinc-200">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
      <a href="#" class="flex items-center gap-2.5">
        <span class="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">B</span>
        <span class="text-[1.0625rem] font-semibold tracking-tight">Brightleaf</span>
      </a>
      <nav class="hidden items-center gap-7 text-sm text-zinc-600 md:flex">
        <a href="#" class="hover:text-(--p-dark)">Courses</a>
        <a href="#" class="hover:text-(--p-dark)">Mentors</a>
        <a href="#" class="hover:text-(--p-dark)">Pricing</a>
        <a href="#" class="hover:text-(--p-dark)">Stories</a>
      </nav>
      <a href="#" class="rounded-lg bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Book a call</a>
    </div>
  </header>

  <section class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
    <div>
      <span class="inline-block rounded-full bg-(--t-light) px-3 py-1 text-xs font-semibold text-(--t-dark)">New batch starts 4 November</span>
      <h1 class="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Learn data analytics with a mentor <span class="text-(--p-dark)">who has done the job</span></h1>
      <p class="mt-5 max-w-[46ch] text-base leading-relaxed text-zinc-600">Twelve weeks of SQL, Python and dashboards, built around real company data and weekly reviews.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">See the syllabus</a>
        <a href="#" class="rounded-lg border border-(--s-dark) px-5 py-3 text-sm font-semibold text-(--s-dark) hover:bg-(--s-light)">Talk to us</a>
      </div>
    </div>
    <div class="relative rounded-2xl bg-(--s-light) p-6">
      <div class="rounded-xl bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold">Week 6 progress</p>
          <span class="rounded-full bg-(--s) px-2.5 py-0.5 text-xs font-semibold text-(--s-on)">On track</span>
        </div>
        <div class="mt-5 flex h-32 items-end gap-3">
          <div class="h-[40%] flex-1 rounded-t-md bg-(--p-light)"></div>
          <div class="h-[55%] flex-1 rounded-t-md bg-(--p-light)"></div>
          <div class="h-[48%] flex-1 rounded-t-md bg-(--p-light)"></div>
          <div class="h-[72%] flex-1 rounded-t-md bg-(--p)"></div>
          <div class="h-[66%] flex-1 rounded-t-md bg-(--p-light)"></div>
          <div class="h-[88%] flex-1 rounded-t-md bg-(--t)"></div>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-4 text-center">
          <div><p class="text-lg font-semibold text-(--p-dark)">18</p><p class="text-xs text-zinc-500">lessons</p></div>
          <div><p class="text-lg font-semibold text-(--s-dark)">7</p><p class="text-xs text-zinc-500">projects</p></div>
          <div><p class="text-lg font-semibold text-(--t-dark)">3</p><p class="text-xs text-zinc-500">reviews</p></div>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-(--p-dark) text-white">
    <div class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
      <div><p class="text-3xl font-semibold">12 weeks</p><p class="mt-1 text-sm text-white/70">from basics to portfolio</p></div>
      <div><p class="text-3xl font-semibold">1 to 1</p><p class="mt-1 text-sm text-white/70">weekly mentor review</p></div>
      <div><p class="text-3xl font-semibold">6</p><p class="mt-1 text-sm text-white/70">projects on real data</p></div>
      <div><p class="text-3xl font-semibold">Evenings</p><p class="mt-1 text-sm text-white/70">fits around a job</p></div>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-6 py-16">
    <h2 class="text-3xl font-semibold tracking-tight">What the course covers</h2>
    <div class="mt-8 grid gap-5 md:grid-cols-3">
      <article class="rounded-xl border border-zinc-200 p-6">
        <span class="grid size-10 place-items-center rounded-lg bg-(--p-light) text-sm font-bold text-(--p-dark)">SQL</span>
        <h3 class="mt-4 font-semibold">Ask the data questions</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Joins, grouping and window functions on a sales database with two million rows.</p>
      </article>
      <article class="rounded-xl border border-zinc-200 p-6">
        <span class="grid size-10 place-items-center rounded-lg bg-(--s-light) text-sm font-bold text-(--s-dark)">Py</span>
        <h3 class="mt-4 font-semibold">Clean it with Python</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">pandas for the messy parts: missing values, dates in five formats, duplicate customers.</p>
      </article>
      <article class="rounded-xl border border-zinc-200 p-6">
        <span class="grid size-10 place-items-center rounded-lg bg-(--t-light) text-sm font-bold text-(--t-dark)">BI</span>
        <h3 class="mt-4 font-semibold">Show it on a dashboard</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Power BI reports a manager can read in a minute, with the numbers that matter on top.</p>
      </article>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-6 pb-16">
    <div class="grid items-center gap-6 rounded-2xl bg-(--s) p-8 text-(--s-on) md:grid-cols-[1fr_auto] md:p-10">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Not sure it is for you?</h2>
        <p class="mt-2 max-w-[52ch] text-sm leading-relaxed opacity-85">Sit in on a live class this Saturday. No sign-up fee, and you keep the notes.</p>
      </div>
      <a href="#" class="justify-self-start rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-(--t-light)">Join a free class</a>
    </div>
  </section>

  <footer class="bg-zinc-900 text-zinc-400">
    <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 text-sm md:grid-cols-4">
      <div class="col-span-2 md:col-span-1">
        <p class="flex items-center gap-2 font-semibold text-white"><span class="size-3 rounded-sm bg-(--p)"></span>Brightleaf</p>
        <p class="mt-3 leading-relaxed">Small batches, real projects, mentors who review every one.</p>
      </div>
      <div><p class="font-semibold text-white">Courses</p><p class="mt-3">Data analytics</p><p class="mt-1.5">Data science</p><p class="mt-1.5">Python basics</p></div>
      <div><p class="font-semibold text-white">Company</p><p class="mt-3">About</p><p class="mt-1.5">Mentors</p><p class="mt-1.5">Careers</p></div>
      <div class="col-span-2 md:col-span-1"><p class="font-semibold text-white">Contact</p><p class="mt-3">hello@brightleaf.example</p><p class="mt-1.5 text-(--t)">Hyderabad</p></div>
    </div>
  </footer>
</div>
`;
