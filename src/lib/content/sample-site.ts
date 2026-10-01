/**
 * One complete sample website, written only in palette variables, so the
 * Colours tab can show three colours on almost every kind of component at
 * once: announcement bar, header, hero, logos, stats, features, steps, team
 * cards, pricing, reviews, a form with alerts, FAQs, blog cards, buttons and
 * tags, a call to action and the footer.
 *
 * Primary leads (main buttons, links, the headline accent), secondary carries
 * the supporting blocks, and tertiary is kept for highlights and tags.
 * Swapping the order on the Colours tab shows the same page with the colours
 * in different jobs.
 */
export const SAMPLE_SITE = `
<div class="bg-white font-sans text-zinc-900">
  <div class="bg-(--p-dark) px-5 py-2 text-center text-sm text-white">
    January batch: 9 seats left. <a href="#" class="font-semibold text-(--t-light) underline underline-offset-2">Reserve one</a>
  </div>

  <header class="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
      <a href="#" class="flex items-center gap-2.5">
        <span class="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">B</span>
        <span class="text-[1.0625rem] font-semibold tracking-tight">Brightleaf</span>
      </a>
      <nav class="hidden items-center gap-7 text-sm text-zinc-600 md:flex">
        <a href="#" class="font-semibold text-(--p-dark)">Courses</a>
        <a href="#" class="hover:text-zinc-900">Mentors</a>
        <a href="#" class="hover:text-zinc-900">Pricing</a>
        <a href="#" class="hover:text-zinc-900">Blog</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="#" class="hidden text-sm font-semibold text-zinc-700 hover:text-zinc-900 sm:inline">Sign in</a>
        <a href="#" class="rounded-lg bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Apply</a>
      </div>
    </div>
  </header>

  <section class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
    <div>
      <span class="inline-block rounded-full bg-(--t-light) px-3 py-1 text-xs font-semibold text-(--t-dark)">New batch starts 4 January</span>
      <h1 class="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Learn data analytics with a mentor <span class="text-(--p-dark)">who has done the job</span></h1>
      <p class="mt-5 max-w-[46ch] text-base leading-relaxed text-zinc-600">Sixteen weekends of SQL, Python and dashboards, built on real company data with every project reviewed.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">See the syllabus</a>
        <a href="#" class="rounded-lg border border-(--s-dark) px-5 py-3 text-sm font-semibold text-(--s-dark) hover:bg-(--s-light)">Talk to us</a>
      </div>
    </div>
    <div class="relative">
      <img src="https://picsum.photos/seed/brightleaf-class/900/720" alt="" class="aspect-[5/4] w-full rounded-2xl object-cover" />
      <div class="absolute -bottom-5 left-4 rounded-xl bg-white p-4 shadow-lg ring-1 ring-zinc-200 md:-left-6">
        <p class="text-xs text-zinc-500">Placed last year</p>
        <p class="text-2xl font-semibold text-(--s-dark)">82%</p>
      </div>
    </div>
  </section>

  <section class="border-y border-zinc-100 bg-zinc-50">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-6 text-zinc-400">
      <span class="text-xs font-medium text-zinc-500">Students now work at</span>
      <span class="text-lg font-bold tracking-tight">Sri Balaji Logistics</span>
      <span class="text-lg font-semibold italic">Ganga Retail</span>
      <span class="text-lg font-bold tracking-[0.2em] uppercase">Medplus+</span>
      <span class="text-lg font-semibold">Hari Fintech</span>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-5 py-14">
    <dl class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-zinc-200 md:grid-cols-4">
      <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Weeks</dt><dd class="mt-1 text-3xl font-semibold tracking-tight">16</dd></div>
      <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Projects</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-(--p-dark)">6</dd></div>
      <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Mentor reviews</dt><dd class="mt-1 text-3xl font-semibold tracking-tight">Weekly</dd></div>
      <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Google rating</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-(--t-dark)">4.8</dd></div>
    </dl>
  </section>

  <section class="mx-auto max-w-6xl px-5 pb-16">
    <h2 class="max-w-[24ch] text-3xl font-semibold tracking-tight">What the course covers</h2>
    <div class="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
      <article class="rounded-2xl bg-(--p-dark) p-6 text-white md:col-span-2 md:row-span-2 md:p-8">
        <span class="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">Weeks 1 to 6</span>
        <h3 class="mt-4 text-xl font-semibold">SQL on a sales database with two million rows</h3>
        <p class="mt-2 max-w-[44ch] text-sm leading-relaxed text-white/75">Joins, grouping and window functions, practised on questions a manager would really ask.</p>
        <div class="mt-6 flex h-28 items-end gap-2">
          <div class="h-[40%] flex-1 rounded-t-md bg-white/25"></div>
          <div class="h-[55%] flex-1 rounded-t-md bg-white/25"></div>
          <div class="h-[48%] flex-1 rounded-t-md bg-white/25"></div>
          <div class="h-[72%] flex-1 rounded-t-md bg-(--p-light)"></div>
          <div class="h-[66%] flex-1 rounded-t-md bg-white/25"></div>
          <div class="h-[90%] flex-1 rounded-t-md bg-(--t)"></div>
        </div>
      </article>
      <article class="rounded-2xl bg-(--s-light) p-6">
        <h3 class="font-semibold text-(--s-dark)">Python for the messy parts</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-700">pandas for missing values, odd date formats and duplicate customers.</p>
      </article>
      <article class="rounded-2xl border border-zinc-200 p-6">
        <h3 class="font-semibold">Dashboards a manager can read</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Power BI reports with the numbers that matter on top.</p>
      </article>
    </div>
  </section>

  <section class="bg-zinc-50">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <h2 class="text-3xl font-semibold tracking-tight">How it works</h2>
      <ol class="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
        <li><span class="grid size-9 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on)">1</span><h3 class="mt-4 font-semibold">Free class</h3><p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Sit in on a Saturday before you decide.</p></li>
        <li><span class="grid size-9 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on)">2</span><h3 class="mt-4 font-semibold">Learn</h3><p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Live weekend classes, recordings the same evening.</p></li>
        <li><span class="grid size-9 place-items-center rounded-full bg-(--s) text-sm font-bold text-(--s-on)">3</span><h3 class="mt-4 font-semibold">Build</h3><p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Six projects, each reviewed one to one.</p></li>
        <li><span class="grid size-9 place-items-center rounded-full bg-(--t) text-sm font-bold text-(--t-on)">4</span><h3 class="mt-4 font-semibold">Get hired</h3><p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Mock interviews and a rewritten resume.</p></li>
      </ol>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-3xl font-semibold tracking-tight">Your mentors</h2>
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <article class="overflow-hidden rounded-2xl ring-1 ring-zinc-200">
        <img src="https://picsum.photos/seed/brightleaf-mentor-1/600/420" alt="" class="aspect-[10/7] w-full object-cover" />
        <div class="p-5"><h3 class="font-semibold">Lead data mentor</h3><p class="text-sm text-(--p-dark)">8 years in fintech analytics</p><div class="mt-3 flex flex-wrap gap-1.5"><span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">SQL</span><span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">Power BI</span></div></div>
      </article>
      <article class="overflow-hidden rounded-2xl ring-1 ring-zinc-200">
        <img src="https://picsum.photos/seed/brightleaf-mentor-2/600/420" alt="" class="aspect-[10/7] w-full object-cover" />
        <div class="p-5"><h3 class="font-semibold">Machine learning mentor</h3><p class="text-sm text-(--s-dark)">6 years in retail forecasting</p><div class="mt-3 flex flex-wrap gap-1.5"><span class="rounded-full bg-(--s-light) px-2.5 py-0.5 text-xs font-medium text-(--s-dark)">Python</span><span class="rounded-full bg-(--s-light) px-2.5 py-0.5 text-xs font-medium text-(--s-dark)">Forecasting</span></div></div>
      </article>
      <article class="overflow-hidden rounded-2xl ring-1 ring-zinc-200">
        <img src="https://picsum.photos/seed/brightleaf-mentor-3/600/420" alt="" class="aspect-[10/7] w-full object-cover" />
        <div class="p-5"><h3 class="font-semibold">Placement coach</h3><p class="text-sm text-(--t-dark)">Former campus recruiter</p><div class="mt-3 flex flex-wrap gap-1.5"><span class="rounded-full bg-(--t-light) px-2.5 py-0.5 text-xs font-medium text-(--t-dark)">Interviews</span><span class="rounded-full bg-(--t-light) px-2.5 py-0.5 text-xs font-medium text-(--t-dark)">Resumes</span></div></div>
      </article>
    </div>
  </section>

  <section class="bg-(--p-light)">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <h2 class="text-center text-3xl font-semibold tracking-tight">Fees</h2>
      <div class="mt-10 grid items-start gap-5 md:grid-cols-3">
        <article class="rounded-2xl bg-white p-6 ring-1 ring-zinc-200"><h3 class="font-semibold">Self-paced</h3><p class="mt-4"><span class="text-4xl font-semibold">₹9,900</span></p><ul class="mt-5 space-y-2 text-sm text-zinc-700"><li>All recordings</li><li>Practice questions</li><li>Community group</li></ul><a href="#" class="mt-7 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-800 hover:border-zinc-900">Choose</a></article>
        <article class="relative rounded-2xl bg-white p-6 shadow-lg ring-2 ring-(--p) md:-mt-4 md:pb-10"><span class="absolute -top-3 left-6 rounded-full bg-(--p) px-3 py-0.5 text-xs font-semibold text-(--p-on)">Most students pick this</span><h3 class="font-semibold">Mentored</h3><p class="mt-4"><span class="text-4xl font-semibold">₹45,000</span></p><ul class="mt-5 space-y-2 text-sm text-zinc-700"><li>Live classes</li><li>6 reviewed projects</li><li>Mock interviews</li><li>Placement help</li></ul><a href="#" class="mt-7 block rounded-lg bg-(--p) py-2.5 text-center text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Reserve a seat</a></article>
        <article class="rounded-2xl bg-white p-6 ring-1 ring-zinc-200"><h3 class="font-semibold">Teams</h3><p class="mt-4"><span class="text-4xl font-semibold">Custom</span></p><ul class="mt-5 space-y-2 text-sm text-zinc-700"><li>For 5 or more staff</li><li>Your company's data</li><li>Progress reports</li></ul><a href="#" class="mt-7 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-800 hover:border-zinc-900">Ask us</a></article>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-5 py-16">
    <div class="flex flex-wrap items-end justify-between gap-4"><h2 class="text-3xl font-semibold tracking-tight">What students say</h2><p class="text-sm text-zinc-600"><span class="font-semibold text-zinc-900">4.8</span> from 312 Google reviews</p></div>
    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <figure class="rounded-2xl bg-zinc-50 p-5"><p class="text-(--t)">★★★★★</p><blockquote class="mt-3 text-sm leading-relaxed text-zinc-700">“The project reviews were the best part. Every comment made my SQL cleaner.”</blockquote><figcaption class="mt-4 text-xs font-semibold">Data analyst, logistics firm</figcaption></figure>
      <figure class="rounded-2xl bg-(--s) p-5 text-(--s-on)"><p>★★★★★</p><blockquote class="mt-3 text-sm leading-relaxed">“I had a job and two kids. Weekend classes and recordings made it possible.”</blockquote><figcaption class="mt-4 text-xs font-semibold opacity-85">MIS executive, moved from accounts</figcaption></figure>
      <figure class="rounded-2xl bg-zinc-50 p-5"><p class="text-(--t)">★★★★☆</p><blockquote class="mt-3 text-sm leading-relaxed text-zinc-700">“Mock interviews were tougher than the real one. That was the point.”</blockquote><figcaption class="mt-4 text-xs font-semibold">Final-year B.Tech, placed on campus</figcaption></figure>
    </div>
  </section>

  <section class="bg-zinc-50">
    <div class="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.3fr]">
      <div>
        <h2 class="text-3xl font-semibold tracking-tight">Ask a question</h2>
        <p class="mt-3 max-w-[38ch] leading-relaxed text-zinc-600">A mentor replies within a day, usually on WhatsApp.</p>
        <div class="mt-6 space-y-3">
          <div class="rounded-xl border-l-4 border-(--s) bg-(--s-light) p-4"><p class="text-sm font-semibold text-(--s-dark)">Enquiry sent</p><p class="mt-0.5 text-sm text-zinc-700">We will message you before 6 pm.</p></div>
          <div class="rounded-xl border-l-4 border-(--t) bg-(--t-light) p-4"><p class="text-sm font-semibold text-(--t-dark)">Only 9 seats left</p><p class="mt-0.5 text-sm text-zinc-700">The January batch closes on 20 December.</p></div>
        </div>
      </div>
      <form class="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-zinc-200 sm:grid-cols-2 md:p-8">
        <div class="grid gap-1.5"><label class="text-sm font-medium text-zinc-800" for="ss-name">Name</label><input id="ss-name" class="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" /></div>
        <div class="grid gap-1.5"><label class="text-sm font-medium text-zinc-800" for="ss-phone">WhatsApp number</label><input id="ss-phone" value="98480" class="rounded-lg border border-red-500 px-3 py-2.5 text-sm focus:outline-none" /><p class="text-xs text-red-700">Enter all 10 digits</p></div>
        <div class="grid gap-1.5 sm:col-span-2"><label class="text-sm font-medium text-zinc-800" for="ss-course">Course</label><select id="ss-course" class="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-(--p) focus:outline-none"><option>Data analytics, weekends</option><option>Data analytics, evenings</option></select></div>
        <div class="grid gap-1.5 sm:col-span-2"><label class="text-sm font-medium text-zinc-800" for="ss-msg">Your question</label><textarea id="ss-msg" rows="3" class="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none"></textarea></div>
        <div class="flex flex-wrap items-center justify-between gap-3 sm:col-span-2"><label class="flex items-center gap-2 text-sm text-zinc-600"><input type="checkbox" checked class="size-4 accent-(--p)" /> Reply on WhatsApp</label><button type="submit" class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Send</button></div>
      </form>
    </div>
  </section>

  <section class="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_2fr]">
    <h2 class="text-3xl font-semibold tracking-tight">Questions people ask</h2>
    <div class="divide-y divide-zinc-200 border-y border-zinc-200">
      <details class="group py-4" open><summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Do I need a coding background?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-zinc-600">No. The first two weeks start from Excel and simple SQL.</p></details>
      <details class="group py-4"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">What if I miss a class?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-zinc-600">Every class is recorded and up the same evening.</p></details>
      <details class="group py-4"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Can I pay in instalments?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-zinc-600">Yes, three instalments a month apart, with no interest.</p></details>
    </div>
  </section>

  <section class="bg-zinc-50">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <h2 class="text-3xl font-semibold tracking-tight">From the blog</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <a href="#" class="group block"><img src="https://picsum.photos/seed/brightleaf-blog-1/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" /><p class="mt-4 text-xs font-semibold text-(--p-dark)">SQL</p><h3 class="mt-1 font-semibold group-hover:underline">Window functions with a cricket scorecard</h3></a>
        <a href="#" class="group block"><img src="https://picsum.photos/seed/brightleaf-blog-2/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" /><p class="mt-4 text-xs font-semibold text-(--s-dark)">Careers</p><h3 class="mt-1 font-semibold group-hover:underline">The one-page resume that got four calls</h3></a>
        <a href="#" class="group block"><img src="https://picsum.photos/seed/brightleaf-blog-3/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" /><p class="mt-4 text-xs font-semibold text-(--t-dark)">Power BI</p><h3 class="mt-1 font-semibold group-hover:underline">A dashboard a manager reads in a minute</h3></a>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-xl font-semibold tracking-tight">Buttons and tags</h2>
    <div class="mt-5 flex flex-wrap items-center gap-3">
      <a href="#" class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on)">Primary</a>
      <a href="#" class="rounded-lg bg-(--s) px-5 py-2.5 text-sm font-semibold text-(--s-on)">Secondary</a>
      <a href="#" class="rounded-lg bg-(--t) px-5 py-2.5 text-sm font-semibold text-(--t-on)">Tertiary</a>
      <a href="#" class="rounded-lg border border-(--p-dark) px-5 py-2.5 text-sm font-semibold text-(--p-dark)">Outline</a>
      <a href="#" class="rounded-lg bg-(--p-dark) px-5 py-2.5 text-sm font-semibold text-white">Dark</a>
      <span class="rounded-full bg-(--p-light) px-2.5 py-1 text-xs font-semibold text-(--p-dark)">Primary tag</span>
      <span class="rounded-full bg-(--s-light) px-2.5 py-1 text-xs font-semibold text-(--s-dark)">Secondary tag</span>
      <span class="rounded-full bg-(--t-light) px-2.5 py-1 text-xs font-semibold text-(--t-dark)">Tertiary tag</span>
    </div>
  </section>

  <section class="px-5 pb-16">
    <div class="mx-auto grid max-w-6xl items-center gap-6 rounded-3xl bg-(--s) p-8 text-(--s-on) md:grid-cols-[1fr_auto] md:p-12">
      <div><h2 class="text-3xl font-semibold tracking-tight">Not sure it is for you?</h2><p class="mt-2 max-w-[48ch] opacity-85">Sit in on a live class this Saturday. No fee, and you keep the notes.</p></div>
      <a href="#" class="justify-self-start rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-(--t-light)">Join a free class</a>
    </div>
  </section>

  <footer class="bg-zinc-950 text-zinc-400">
    <div class="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 text-sm md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div class="col-span-2 md:col-span-1"><p class="flex items-center gap-2 text-base font-semibold text-white"><span class="size-4 rounded bg-(--p)"></span>Brightleaf</p><p class="mt-3 max-w-[32ch] leading-relaxed">Small batches, real projects, mentors who review every one.</p></div>
      <div><p class="font-semibold text-white">Courses</p><ul class="mt-3 space-y-2"><li>Data analytics</li><li>Data science</li><li>Python basics</li></ul></div>
      <div><p class="font-semibold text-white">Company</p><ul class="mt-3 space-y-2"><li>About</li><li>Mentors</li><li>Careers</li></ul></div>
      <div class="col-span-2 md:col-span-1"><p class="font-semibold text-white">Contact</p><p class="mt-3">hello@brightleaf.example</p><p class="mt-1.5 text-(--t)">Madhapur, Hyderabad</p></div>
    </div>
    <div class="border-t border-white/10"><p class="mx-auto max-w-6xl px-5 py-5 text-xs">© 2026 Brightleaf Learning</p></div>
  </footer>
</div>
`;
