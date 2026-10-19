/**
 * One complete sample website, written only in palette variables, so the
 * Colours tab can show three colours on almost every kind of component at
 * once: announcement bar, header, hero, logos, stats, features, steps, team
 * cards, pricing, FAQs, reviews, a form with alerts, blog cards with
 * pagination, buttons, tabs and toggles, a call to action and the footer.
 *
 * Each colour has one job (see ROLES in lib/palette):
 *   primary   the main interactive colour: main buttons, links, the active
 *             menu item, selected tabs, pagination, toggles, focus rings,
 *             progress, the featured plan. Light tint for selected
 *             backgrounds, dark shade for hover.
 *   secondary supporting emphasis: second buttons, the featured mentor and
 *             testimonial, notifications. The full colour is kept for one
 *             component, the closing call to action.
 *   tertiary  occasional highlights: stars, the achievement statistic, the
 *             selected step, the selected bar in a chart, premium badges.
 *             Used as a fill under its own text colour, never for long text.
 *
 * Section backgrounds alternate between white and a pale tint of one of the
 * three colours, so all three show at page scale without any one taking
 * over. The tints are the palette's own --p-light, --s-light and --t-light,
 * so they follow whatever palette is picked:
 *   dark primary   announcement bar, footer
 *   white          hero, course overview, mentors, FAQ, controls
 *   primary tint   statistics, the enquiry form
 *   secondary tint pricing, testimonials
 *   tertiary tint  how it works, blog
 *   full secondary the closing call to action, and nothing else
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
      <nav class="hidden h-full items-center gap-7 text-sm text-zinc-600 md:flex">
        <a href="#" class="flex h-full items-center border-b-2 border-(--p) font-semibold text-(--p-dark)">Courses</a>
        <a href="#" class="hover:text-(--p-dark)">Mentors</a>
        <a href="#" class="hover:text-(--p-dark)">Pricing</a>
        <a href="#" class="hover:text-(--p-dark)">Blog</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="#" class="hidden text-sm font-semibold text-zinc-700 hover:text-(--p-dark) sm:inline">Sign in</a>
        <a href="#" class="rounded-lg bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Apply</a>
      </div>
    </div>
  </header>

  <section class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
    <div>
      <span class="inline-block rounded-full bg-(--t) px-3 py-1 text-xs font-semibold text-(--t-on)">New batch starts 4 January</span>
      <h1 class="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Learn data analytics with a mentor <span class="text-(--p)">who has done the job</span></h1>
      <p class="mt-5 max-w-[46ch] text-base leading-relaxed text-zinc-600">Sixteen weekends of SQL, Python and dashboards, built on real company data with every project reviewed.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Get started</a>
        <a href="#" class="rounded-lg border border-(--s-dark) px-5 py-3 text-sm font-semibold text-(--s-dark) hover:bg-(--s-light)">Book a free class</a>
      </div>
    </div>
    <div class="relative">
      <img src="https://picsum.photos/seed/brightleaf-class/900/720" alt="" class="aspect-[5/4] w-full rounded-2xl object-cover" />
      <div class="absolute -bottom-5 left-4 flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg ring-1 ring-zinc-200 md:-left-6">
        <span class="grid size-10 place-items-center rounded-full bg-(--t) text-lg text-(--t-on)">✓</span>
        <div><p class="text-xs text-zinc-500">Placed last year</p><p class="text-2xl font-semibold">82%</p></div>
      </div>
    </div>
  </section>

  <section class="border-t border-zinc-200">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 py-6 text-zinc-400">
      <span class="text-xs font-medium text-zinc-500">Students now work at</span>
      <span class="text-lg font-bold tracking-tight">Sri Balaji Logistics</span>
      <span class="text-lg font-semibold italic">Ganga Retail</span>
      <span class="text-lg font-bold tracking-[0.2em] uppercase">Medplus+</span>
      <span class="text-lg font-semibold">Hari Fintech</span>
    </div>
  </section>

  <section class="bg-(--p-light)">
    <dl class="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-12 md:grid-cols-4">
      <div class="rounded-2xl bg-white p-6"><dt class="text-sm text-zinc-600">Weeks</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-(--p-dark)">16</dd></div>
      <div class="rounded-2xl bg-white p-6"><dt class="text-sm text-zinc-600">Projects</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-(--p-dark)">6</dd></div>
      <div class="rounded-2xl bg-white p-6"><dt class="text-sm text-zinc-600">Google rating</dt><dd class="mt-1 flex items-baseline gap-2"><span class="text-3xl font-semibold tracking-tight text-(--p-dark)">4.8</span><span class="text-lg text-(--t) [-webkit-text-stroke:0.6px_var(--t-dark)]">★★★★★</span></dd></div>
      <div class="rounded-2xl bg-(--t) p-6 text-(--t-on)"><dt class="text-sm font-medium opacity-80">Placed last year</dt><dd class="mt-1 text-3xl font-semibold tracking-tight">82% <span class="text-xl">★</span></dd></div>
    </dl>
  </section>

  <section class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="max-w-[24ch] text-3xl font-semibold tracking-tight">What the course covers</h2>
    <div class="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
      <article class="rounded-2xl bg-(--p-light) p-6 ring-1 ring-(--p)/25 md:col-span-2 md:row-span-2 md:p-8">
        <span class="rounded-full bg-(--p) px-2.5 py-0.5 text-xs font-semibold text-(--p-on)">Weeks 1 to 6</span>
        <h3 class="mt-4 text-xl font-semibold text-(--p-dark)">SQL on a sales database with two million rows</h3>
        <p class="mt-2 max-w-[44ch] text-sm leading-relaxed text-zinc-700">Joins, grouping and window functions, practised on questions a manager would really ask.</p>
        <div class="mt-6 flex h-28 items-end gap-2">
          <div class="h-[40%] flex-1 rounded-t-md bg-(--p)/30"></div>
          <div class="h-[55%] flex-1 rounded-t-md bg-(--p)/30"></div>
          <div class="h-[48%] flex-1 rounded-t-md bg-(--p)/30"></div>
          <div class="h-[72%] flex-1 rounded-t-md bg-(--p)/30"></div>
          <div class="h-[66%] flex-1 rounded-t-md bg-(--p)/30"></div>
          <div class="h-[90%] flex-1 rounded-t-md bg-(--t) ring-1 ring-(--t-dark)/40 ring-inset"></div>
        </div>
      </article>
      <article class="rounded-2xl border border-zinc-200 p-6">
        <span class="grid size-9 place-items-center rounded-lg bg-(--p-light) text-sm font-bold text-(--p-dark)">Py</span>
        <h3 class="mt-4 font-semibold">Python for the messy parts</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">pandas for missing values, odd date formats and duplicate customers.</p>
      </article>
      <article class="rounded-2xl border border-zinc-200 p-6">
        <span class="grid size-9 place-items-center rounded-lg bg-(--p-light) text-sm font-bold text-(--p-dark)">BI</span>
        <h3 class="mt-4 font-semibold">Dashboards a manager can read</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Power BI reports with the numbers that matter on top.</p>
      </article>
    </div>
  </section>

  <section class="bg-(--t-light)">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <h2 class="text-3xl font-semibold tracking-tight">How it works</h2>
      <ol class="mt-10 grid gap-4 md:grid-cols-4">
        <li class="rounded-2xl bg-white p-5"><span class="grid size-9 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on)">1</span><h3 class="mt-4 font-semibold">Free class</h3><p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Sit in on a Saturday before you decide.</p></li>
        <li class="rounded-2xl bg-white p-5"><span class="grid size-9 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on)">2</span><h3 class="mt-4 font-semibold">Learn</h3><p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Live weekend classes, recordings the same evening.</p></li>
        <li class="rounded-2xl bg-white p-5"><span class="grid size-9 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on)">3</span><h3 class="mt-4 font-semibold">Build</h3><p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Six projects, each reviewed one to one.</p></li>
        <li class="rounded-2xl bg-(--t) p-5 text-(--t-on) ring-1 ring-(--t-dark)/30"><span class="grid size-9 place-items-center rounded-full bg-white text-sm font-bold text-zinc-900">★</span><h3 class="mt-4 font-semibold">Get hired</h3><p class="mt-1.5 text-sm leading-relaxed opacity-85">Mock interviews and a rewritten resume.</p></li>
      </ol>
      <div class="mt-10 max-w-md">
        <div class="flex justify-between text-xs font-medium text-zinc-700"><span>A typical student, week 11</span><span class="text-(--p-dark)">68%</span></div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-white"><div class="h-full w-[68%] rounded-full bg-(--p)"></div></div>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-3xl font-semibold tracking-tight">Your mentors</h2>
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <article class="overflow-hidden rounded-2xl bg-(--s-light) ring-2 ring-(--s)">
        <div class="relative"><img src="https://picsum.photos/seed/brightleaf-mentor-1/600/420" alt="" class="aspect-[10/7] w-full object-cover" /><span class="absolute top-3 left-3 rounded-full bg-(--t) px-2.5 py-0.5 text-xs font-semibold text-(--t-on)">★ Top rated</span></div>
        <div class="p-5"><div class="flex items-center justify-between gap-2"><h3 class="font-semibold">Lead data mentor</h3><span class="rounded-full bg-(--s) px-2 py-0.5 text-[0.6875rem] font-semibold text-(--s-on)">Featured</span></div><p class="text-sm text-(--s-dark)">8 years in fintech analytics</p><div class="mt-3 flex flex-wrap gap-1.5"><span class="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-700">SQL</span><span class="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-700">Power BI</span></div></div>
      </article>
      <article class="overflow-hidden rounded-2xl ring-1 ring-zinc-200">
        <img src="https://picsum.photos/seed/brightleaf-mentor-2/600/420" alt="" class="aspect-[10/7] w-full object-cover" />
        <div class="p-5"><h3 class="font-semibold">Machine learning mentor</h3><p class="text-sm text-zinc-600">6 years in retail forecasting</p><div class="mt-3 flex flex-wrap gap-1.5"><span class="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">Python</span><span class="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">Forecasting</span></div></div>
      </article>
      <article class="overflow-hidden rounded-2xl ring-1 ring-zinc-200">
        <img src="https://picsum.photos/seed/brightleaf-mentor-3/600/420" alt="" class="aspect-[10/7] w-full object-cover" />
        <div class="p-5"><h3 class="font-semibold">Placement coach</h3><p class="text-sm text-zinc-600">Former campus recruiter</p><div class="mt-3 flex flex-wrap gap-1.5"><span class="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">Interviews</span><span class="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">Resumes</span></div></div>
      </article>
    </div>
  </section>

  <section class="bg-(--s-light)">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <h2 class="text-center text-3xl font-semibold tracking-tight">Fees</h2>
      <p class="mx-auto mt-2 max-w-[44ch] text-center text-sm text-zinc-700">Pay in three instalments, a month apart, with no interest.</p>
      <div class="mt-10 grid items-start gap-5 md:grid-cols-3">
        <article class="rounded-2xl bg-white p-6 ring-1 ring-zinc-200"><h3 class="font-semibold">Self-paced</h3><p class="mt-4"><span class="text-4xl font-semibold">₹9,900</span></p><ul class="mt-5 space-y-2 text-sm text-zinc-700"><li>All recordings</li><li>Practice questions</li><li>Community group</li></ul><a href="#" class="mt-7 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-800 hover:border-(--p) hover:text-(--p-dark)">Choose</a></article>
        <article class="relative rounded-2xl bg-(--p) p-6 text-(--p-on) shadow-lg md:-mt-4 md:pb-10"><span class="absolute -top-3 left-6 rounded-full bg-(--t) px-3 py-0.5 text-xs font-semibold text-(--t-on) ring-2 ring-white">★ Most popular</span><h3 class="font-semibold">Mentored</h3><p class="mt-4"><span class="text-4xl font-semibold">₹45,000</span></p><ul class="mt-5 space-y-2 text-sm opacity-90"><li>Live classes</li><li>6 reviewed projects</li><li>Mock interviews</li><li>Placement help</li></ul><a href="#" class="mt-7 block rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-zinc-900 hover:bg-(--p-light)">Reserve a seat</a></article>
        <article class="rounded-2xl bg-white p-6 ring-1 ring-zinc-200"><div class="flex items-center justify-between gap-2"><h3 class="font-semibold">Teams</h3><span class="rounded-full bg-(--t) px-2 py-0.5 text-[0.6875rem] font-semibold text-(--t-on)">Premium</span></div><p class="mt-4"><span class="text-4xl font-semibold">Custom</span></p><ul class="mt-5 space-y-2 text-sm text-zinc-700"><li>For 5 or more staff</li><li>Your company's data</li><li>Progress reports</li></ul><a href="#" class="mt-7 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-800 hover:border-(--p) hover:text-(--p-dark)">Ask us</a></article>
      </div>
    </div>
  </section>

  <section class="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_2fr]">
    <h2 class="text-3xl font-semibold tracking-tight">Questions people ask</h2>
    <div class="divide-y divide-zinc-200 border-y border-zinc-200">
      <details class="group py-4" open><summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Do I need a coding background?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-zinc-600">No. The first two weeks start from Excel and simple SQL.</p></details>
      <details class="group py-4"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">What if I miss a class?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-zinc-600">Every class is recorded and up the same evening.</p></details>
      <details class="group py-4"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">Can I pay in instalments?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-zinc-600">Yes, three instalments a month apart, with no interest. <a href="#" class="font-semibold text-(--p-dark) underline underline-offset-2">See the fees</a></p></details>
    </div>
  </section>

  <section class="bg-(--s-light)">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <div class="flex flex-wrap items-end justify-between gap-4"><h2 class="text-3xl font-semibold tracking-tight">What students say</h2><p class="text-sm text-zinc-700"><span class="font-semibold text-zinc-900">4.8</span> from 312 Google reviews</p></div>
      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <figure class="rounded-2xl bg-white p-5"><p class="text-(--t) [-webkit-text-stroke:0.6px_var(--t-dark)]">★★★★★</p><blockquote class="mt-3 text-sm leading-relaxed text-zinc-700">“The project reviews were the best part. Every comment made my SQL cleaner.”</blockquote><figcaption class="mt-4 text-xs font-semibold">Data analyst, logistics firm</figcaption></figure>
        <figure class="rounded-2xl bg-white p-5 shadow-md ring-2 ring-(--s)"><div class="flex items-center justify-between gap-2"><p class="text-(--t) [-webkit-text-stroke:0.6px_var(--t-dark)]">★★★★★</p><span class="rounded-full bg-(--s) px-2 py-0.5 text-[0.6875rem] font-semibold text-(--s-on)">Featured</span></div><blockquote class="mt-3 text-sm leading-relaxed text-zinc-800">“I had a job and two kids. Weekend classes and recordings made it possible.”</blockquote><figcaption class="mt-4 text-xs font-semibold text-(--s-dark)">MIS executive, moved from accounts</figcaption></figure>
        <figure class="rounded-2xl bg-white p-5"><p class="text-(--t) [-webkit-text-stroke:0.6px_var(--t-dark)]">★★★★<span class="text-zinc-300 [-webkit-text-stroke:0]">★</span></p><blockquote class="mt-3 text-sm leading-relaxed text-zinc-700">“Mock interviews were tougher than the real one. That was the point.”</blockquote><figcaption class="mt-4 text-xs font-semibold">Final-year B.Tech, placed on campus</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="bg-(--p-light)">
    <div class="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.3fr]">
      <div>
        <h2 class="text-3xl font-semibold tracking-tight">Ask a question</h2>
        <p class="mt-3 max-w-[38ch] leading-relaxed text-zinc-700">A mentor replies within a day, usually on WhatsApp.</p>
        <div class="mt-6 space-y-3">
          <div class="rounded-xl border-l-4 border-(--s) bg-white p-4"><p class="text-sm font-semibold text-(--s-dark)">Enquiry sent</p><p class="mt-0.5 text-sm text-zinc-700">We will message you before 6 pm.</p></div>
          <div class="rounded-xl bg-white p-4"><p class="flex items-center gap-2 text-sm font-semibold"><span class="rounded-full bg-(--t) px-2 py-0.5 text-[0.6875rem] text-(--t-on)">Offer</span>Only 9 seats left</p><p class="mt-1 text-sm text-zinc-700">The January batch closes on 20 December.</p></div>
        </div>
      </div>
      <form class="grid gap-5 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2 md:p-8">
        <div class="grid gap-1.5"><label class="text-sm font-medium text-zinc-800" for="ss-name">Name</label><input id="ss-name" class="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" /></div>
        <div class="grid gap-1.5"><label class="text-sm font-medium text-zinc-800" for="ss-phone">WhatsApp number</label><input id="ss-phone" value="98480" class="rounded-lg border border-red-500 px-3 py-2.5 text-sm focus:outline-none" /><p class="text-xs text-red-700">Enter all 10 digits</p></div>
        <div class="grid gap-1.5 sm:col-span-2"><label class="text-sm font-medium text-zinc-800" for="ss-course">Course</label><select id="ss-course" class="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-(--p) focus:outline-none"><option>Data analytics, weekends</option><option>Data analytics, evenings</option></select></div>
        <div class="grid gap-1.5 sm:col-span-2"><label class="text-sm font-medium text-zinc-800" for="ss-msg">Your question</label><textarea id="ss-msg" rows="3" class="rounded-lg border-2 border-(--p) px-3 py-2.5 text-sm ring-4 ring-(--p-light) focus:outline-none">Is there an evening batch?</textarea></div>
        <div class="flex flex-wrap items-center justify-between gap-3 sm:col-span-2"><label class="flex items-center gap-2 text-sm text-zinc-600"><input type="checkbox" checked class="size-4 accent-(--p)" /> Reply on WhatsApp</label><button type="submit" class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Send</button></div>
      </form>
    </div>
  </section>

  <section class="bg-(--t-light)">
    <div class="mx-auto max-w-6xl px-5 py-16">
      <h2 class="text-3xl font-semibold tracking-tight">From the blog</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <a href="#" class="group block"><img src="https://picsum.photos/seed/brightleaf-blog-1/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" /><p class="mt-4 text-xs font-semibold text-(--p-dark)">SQL</p><h3 class="mt-1 font-semibold group-hover:text-(--p-dark) group-hover:underline">Window functions with a cricket scorecard</h3></a>
        <a href="#" class="group block"><img src="https://picsum.photos/seed/brightleaf-blog-2/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" /><p class="mt-4 text-xs font-semibold text-(--p-dark)">Careers</p><h3 class="mt-1 font-semibold group-hover:text-(--p-dark) group-hover:underline">The one-page resume that got four calls</h3></a>
        <a href="#" class="group block"><img src="https://picsum.photos/seed/brightleaf-blog-3/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" /><p class="mt-4 flex items-center gap-2 text-xs font-semibold text-(--p-dark)">Power BI <span class="rounded-full bg-(--t) px-2 py-0.5 text-[0.6875rem] text-(--t-on)">Editor's pick</span></p><h3 class="mt-1 font-semibold group-hover:text-(--p-dark) group-hover:underline">A dashboard a manager reads in a minute</h3></a>
      </div>
      <nav class="mt-10 flex items-center justify-center gap-1.5 text-sm font-semibold" aria-label="Pages">
        <a href="#" class="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-white hover:text-(--p-dark)">Previous</a>
        <a href="#" class="grid size-9 place-items-center rounded-lg bg-(--p) text-(--p-on)" aria-current="page">1</a>
        <a href="#" class="grid size-9 place-items-center rounded-lg bg-white text-zinc-700 hover:bg-(--p-light) hover:text-(--p-dark)">2</a>
        <a href="#" class="grid size-9 place-items-center rounded-lg bg-white text-zinc-700 hover:bg-(--p-light) hover:text-(--p-dark)">3</a>
        <a href="#" class="rounded-lg px-3 py-1.5 text-(--p-dark) hover:bg-white">Next</a>
      </nav>
    </div>
  </section>

  <section class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-xl font-semibold tracking-tight">Buttons, badges and controls</h2>
    <div class="mt-6 grid gap-6 md:grid-cols-3">
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Primary · act</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <a href="#" class="rounded-lg bg-(--p) px-4 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Book now</a>
          <a href="#" class="rounded-lg border border-(--p-dark) px-4 py-2.5 text-sm font-semibold text-(--p-dark) hover:bg-(--p-light)">Outline</a>
          <span class="rounded-full bg-(--p-light) px-2.5 py-1 text-xs font-semibold text-(--p-dark)">Selected</span>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Secondary · support</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <a href="#" class="rounded-lg bg-(--s) px-4 py-2.5 text-sm font-semibold text-(--s-on) hover:bg-(--s-dark) hover:text-white">Download brochure</a>
          <span class="rounded-full bg-(--s) px-2.5 py-1 text-xs font-semibold text-(--s-on)">New</span>
          <span class="rounded-full bg-(--s-light) px-2.5 py-1 text-xs font-semibold text-(--s-dark)">Featured</span>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Tertiary · highlight</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-(--t) px-2.5 py-1 text-xs font-semibold text-(--t-on)">★ Premium</span>
          <span class="rounded-full bg-(--t-light) px-2.5 py-1 text-xs font-semibold text-(--t-dark) ring-1 ring-(--t) ring-inset">Limited offer</span>
          <span class="text-lg text-(--t) [-webkit-text-stroke:0.6px_var(--t-dark)]">★★★★★</span>
        </div>
      </div>
    </div>
    <div class="mt-10 grid gap-8 md:grid-cols-2">
      <div>
        <div class="flex gap-6 border-b border-zinc-200 text-sm font-semibold">
          <a href="#" class="-mb-px border-b-2 border-(--p) pb-2.5 text-(--p-dark)">Syllabus</a>
          <a href="#" class="pb-2.5 text-zinc-500 hover:text-(--p-dark)">Projects</a>
          <a href="#" class="pb-2.5 text-zinc-500 hover:text-(--p-dark)">Schedule</a>
        </div>
        <div class="mt-5 inline-flex rounded-lg bg-zinc-100 p-1 text-sm font-semibold">
          <a href="#" class="rounded-md bg-white px-3 py-1.5 text-(--p-dark) shadow-sm ring-1 ring-zinc-200">Weekends</a>
          <a href="#" class="rounded-md px-3 py-1.5 text-zinc-500 hover:text-(--p-dark)">Evenings</a>
        </div>
      </div>
      <div class="space-y-4 text-sm text-zinc-700">
        <div class="flex items-center justify-between gap-4"><span>Class reminders on WhatsApp</span><span class="flex h-6 w-11 items-center rounded-full bg-(--p) p-0.5"><span class="ml-auto size-5 rounded-full bg-white shadow"></span></span></div>
        <div class="flex items-center justify-between gap-4"><span>Weekly progress email</span><span class="flex h-6 w-11 items-center rounded-full bg-zinc-300 p-0.5"><span class="size-5 rounded-full bg-white shadow"></span></span></div>
        <div class="flex items-center gap-3"><span class="grid size-5 place-items-center rounded-full border-2 border-(--p)"><span class="size-2 rounded-full bg-(--p)"></span></span>Weekend batch<span class="ml-4 size-5 rounded-full border-2 border-zinc-300"></span>Evening batch</div>
      </div>
    </div>
  </section>

  <section class="px-5 pb-16">
    <div class="mx-auto grid max-w-6xl items-center gap-6 rounded-3xl bg-(--s) p-8 text-(--s-on) md:grid-cols-[1fr_auto] md:p-12">
      <div><h2 class="text-3xl font-semibold tracking-tight">Not sure it is for you?</h2><p class="mt-2 max-w-[48ch] opacity-85">Sit in on a live class this Saturday. No fee, and you keep the notes.</p></div>
      <a href="#" class="justify-self-start rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100">Join a free class</a>
    </div>
  </section>

  <footer class="bg-(--p-dark) text-white/70">
    <div class="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 text-sm md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div class="col-span-2 md:col-span-1"><p class="flex items-center gap-2 text-base font-semibold text-white"><span class="size-4 rounded bg-(--t)"></span>Brightleaf</p><p class="mt-3 max-w-[32ch] leading-relaxed">Small batches, real projects, mentors who review every one.</p></div>
      <div><p class="font-semibold text-white">Courses</p><ul class="mt-3 space-y-2"><li>Data analytics</li><li>Data science</li><li>Python basics</li></ul></div>
      <div><p class="font-semibold text-white">Company</p><ul class="mt-3 space-y-2"><li>About</li><li>Mentors</li><li>Careers</li></ul></div>
      <div class="col-span-2 md:col-span-1"><p class="font-semibold text-white">Contact</p><p class="mt-3">hello@brightleaf.example</p><p class="mt-1.5 text-(--t-light)">Madhapur, Hyderabad</p></div>
    </div>
    <div class="border-t border-white/15"><p class="mx-auto max-w-6xl px-5 py-5 text-xs">© 2026 Brightleaf Learning</p></div>
  </footer>
</div>
`;
