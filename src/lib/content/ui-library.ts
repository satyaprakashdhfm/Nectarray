/**
 * The Elements tab: a library of website components to reuse.
 *
 * Each one is plain HTML with Tailwind classes, written for this library
 * (not copied from a paid kit), and coloured only through the palette
 * variables from the Colours tab:
 *
 *   --p, --p-light, --p-dark, --p-on   primary (and the text colour on it)
 *   --s, --s-light, --s-dark, --s-on   secondary
 *   --t, --t-light, --t-dark, --t-on   tertiary
 *
 * Copy a component with "Copy as CSS" from the Colours tab and it renders the
 * same in any Tailwind v4 project. Images are picsum.photos placeholders, to
 * be swapped for real ones.
 *
 * The class strings live here in a .ts file under src/, which is what makes
 * Tailwind generate them: it scans the source for class names.
 */

export type UiCategory = {
  id: string;
  label: string;
  blurb: string;
};

export type UiComponent = {
  id: string;
  category: string;
  name: string;
  /** When to reach for it, in a sentence. */
  note: string;
  html: string;
};

export const UI_CATEGORIES: UiCategory[] = [
  {
    id: "headers",
    label: "Headers",
    blurb: "The bar at the top: logo, links, one button.",
  },
  {
    id: "heroes",
    label: "Heroes",
    blurb: "The first screen: headline, one sentence, one button, a visual.",
  },
  {
    id: "features",
    label: "Feature sections",
    blurb: "What you do, laid out so the page does not repeat itself.",
  },
  {
    id: "profile-cards",
    label: "Profile cards",
    blurb: "Team members, mentors, trainers and speakers.",
  },
  {
    id: "forms",
    label: "Forms",
    blurb: "Labels above fields, errors under them, one clear button.",
  },
  {
    id: "pricing",
    label: "Pricing",
    blurb: "Plans side by side with the recommended one marked.",
  },
  {
    id: "testimonials",
    label: "Testimonials",
    blurb: "Short quotes with who said them and why it matters.",
  },
  {
    id: "stats",
    label: "Stats",
    blurb: "A few numbers that prove the point.",
  },
  {
    id: "ctas",
    label: "Call to action",
    blurb: "The block that asks for the click, near the end of a page.",
  },
  {
    id: "faqs",
    label: "FAQs",
    blurb: "Questions that open on click, without any script.",
  },
  {
    id: "blog-cards",
    label: "Blog and content cards",
    blurb: "Articles, case studies and resources in a grid.",
  },
  {
    id: "footers",
    label: "Footers",
    blurb: "Link columns, contact details and the small print.",
  },
  {
    id: "buttons",
    label: "Buttons and badges",
    blurb: "Every button and tag style in one place.",
  },
  {
    id: "feedback",
    label: "Alerts and empty states",
    blurb: "Success, warning and error messages, and screens with no data yet.",
  },
  {
    id: "sketch",
    label: "Sketch diagrams",
    blurb: "Hand-drawn style diagrams to fill an image slot.",
  },
];

export const UI_COMPONENTS: UiComponent[] = [
  // -------------------------------------------------------------------------
  //  Headers
  // -------------------------------------------------------------------------
  {
    id: "header-classic",
    category: "headers",
    name: "Logo, links and one button",
    note: "The default for most sites. Links hide on a phone.",
    html: `<header class="border-b border-zinc-200 bg-white">
  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
    <a href="#" class="flex items-center gap-2.5">
      <span class="grid size-8 place-items-center rounded-lg bg-(--p) text-sm font-bold text-(--p-on)">K</span>
      <span class="text-[1.0625rem] font-semibold tracking-tight text-zinc-900">Kalyan Interiors</span>
    </a>
    <nav class="hidden items-center gap-7 text-sm text-zinc-600 md:flex">
      <a href="#" class="font-semibold text-(--p-dark)">Home</a>
      <a href="#" class="hover:text-zinc-900">Projects</a>
      <a href="#" class="hover:text-zinc-900">Services</a>
      <a href="#" class="hover:text-zinc-900">About</a>
    </nav>
    <a href="#" class="rounded-lg bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Get a quote</a>
  </div>
</header>`,
  },
  {
    id: "header-announcement",
    category: "headers",
    name: "With an announcement bar",
    note: "For a launch, an offer or a new batch date.",
    html: `<div>
  <div class="bg-(--p-dark) px-5 py-2 text-center text-sm text-white">
    Admissions open for the January batch. <a href="#" class="font-semibold underline underline-offset-2">See dates</a>
  </div>
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
      <a href="#" class="text-lg font-bold tracking-tight text-zinc-900">north<span class="text-(--p)">desk</span></a>
      <nav class="hidden items-center gap-7 text-sm text-zinc-600 lg:flex">
        <a href="#" class="hover:text-zinc-900">Courses</a>
        <a href="#" class="hover:text-zinc-900">Placements</a>
        <a href="#" class="hover:text-zinc-900">Fees</a>
        <a href="#" class="hover:text-zinc-900">Campus</a>
        <a href="#" class="hover:text-zinc-900">Contact</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="#" class="hidden text-sm font-semibold text-zinc-700 hover:text-zinc-900 sm:inline">Sign in</a>
        <a href="#" class="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-(--p-dark)">Apply now</a>
      </div>
    </div>
  </header>
</div>`,
  },
  {
    id: "header-centered",
    category: "headers",
    name: "Centred logo, split links",
    note: "Restaurants, salons, boutiques: a brand that leads with its name.",
    html: `<header class="border-b border-zinc-200 bg-(--s-light)">
  <div class="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6">
    <nav class="hidden gap-6 text-sm text-(--s-dark) md:flex">
      <a href="#" class="hover:underline">Menu</a>
      <a href="#" class="hover:underline">Private dining</a>
      <a href="#" class="hover:underline">Gift cards</a>
    </nav>
    <a href="#" class="md:col-start-2 md:text-center">
      <span class="block text-lg font-bold tracking-[0.2em] text-(--s-dark) uppercase md:text-xl">Tamarind</span>
      <span class="block text-[0.6875rem] tracking-[0.3em] text-(--s-dark)/70 uppercase">Kitchen and bar</span>
    </a>
    <div class="flex justify-end md:col-start-3">
      <a href="#" class="rounded-full border border-(--s-dark) px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-(--s-dark) hover:bg-(--s-dark) hover:text-white md:px-4">Book a table</a>
    </div>
  </div>
</header>`,
  },
  {
    id: "header-floating",
    category: "headers",
    name: "Floating pill",
    note: "Modern product sites. Sits over the hero with a gap around it.",
    html: `<div class="bg-(--p-light) px-4 py-4">
  <header class="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-zinc-200 bg-white/90 py-2 pr-2 pl-5 shadow-sm backdrop-blur">
    <a href="#" class="flex items-center gap-2 font-semibold text-zinc-900">
      <span class="size-5 rounded-md bg-(--p)"></span>Ledgerly
    </a>
    <nav class="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
      <a href="#" class="hover:text-zinc-900">Product</a>
      <a href="#" class="hover:text-zinc-900">GST billing</a>
      <a href="#" class="hover:text-zinc-900">Pricing</a>
      <a href="#" class="hover:text-zinc-900">Help</a>
    </nav>
    <a href="#" class="rounded-full bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Start free</a>
  </header>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Heroes
  // -------------------------------------------------------------------------
  {
    id: "hero-split-image",
    category: "heroes",
    name: "Split: text left, photo right",
    note: "The safest hero. Uses the width on a laptop, stacks on a phone.",
    html: `<section class="bg-white">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
    <div>
      <h1 class="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 md:text-5xl">Modular kitchens built in <span class="text-(--p-dark)">45 days</span>, fitted by our own team</h1>
      <p class="mt-5 max-w-[46ch] text-base leading-relaxed text-zinc-600">Free site measurement, a 3D design before you pay, and a 10-year warranty on every cabinet.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Book a free visit</a>
        <a href="#" class="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-800 hover:border-zinc-900">See our work</a>
      </div>
    </div>
    <img src="https://picsum.photos/seed/kitchen-hero/960/760" alt="A finished modular kitchen" class="aspect-[6/5] w-full rounded-2xl object-cover" />
  </div>
</section>`,
  },
  {
    id: "hero-image-background",
    category: "heroes",
    name: "Full-width photo with a dark overlay",
    note: "Travel, hospitality and events, where the photo sells it.",
    html: `<section class="relative isolate overflow-hidden">
  <img src="https://picsum.photos/seed/hills-retreat/1600/900" alt="" class="absolute inset-0 -z-10 size-full object-cover" />
  <div class="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950/85 via-zinc-950/60 to-transparent"></div>
  <div class="mx-auto max-w-6xl px-5 py-24 md:py-32">
    <h1 class="max-w-[18ch] text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">Three quiet days in the Coorg hills</h1>
    <p class="mt-5 max-w-[44ch] text-base leading-relaxed text-white/80">A coffee estate stay with guided treks, home-cooked Kodava food and no phone signal.</p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a href="#" class="rounded-lg bg-(--t) px-5 py-3 text-sm font-semibold text-(--t-on) hover:bg-(--t-light)">Check dates</a>
      <a href="#" class="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">View the itinerary</a>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-form",
    category: "heroes",
    name: "With a lead form beside it",
    note: "Courses, clinics, real estate: when the goal is an enquiry.",
    html: `<section class="bg-(--p-light)">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
    <div>
      <span class="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--p-dark)">Weekend batch, 12 seats</span>
      <h1 class="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 md:text-5xl">Become a data analyst in 16 weekends</h1>
      <p class="mt-5 max-w-[44ch] text-base leading-relaxed text-zinc-700">SQL, Excel, Power BI and Python, taught on real company data with a mentor reviewing every project.</p>
    </div>
    <form class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 md:p-8">
      <p class="text-lg font-semibold text-zinc-900">Get the syllabus</p>
      <p class="mt-1 text-sm text-zinc-600">We send it on WhatsApp within the hour.</p>
      <label class="mt-5 block text-sm font-medium text-zinc-800" for="hf-name">Full name</label>
      <input id="hf-name" type="text" class="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" />
      <label class="mt-4 block text-sm font-medium text-zinc-800" for="hf-phone">WhatsApp number</label>
      <input id="hf-phone" type="tel" class="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" />
      <button type="submit" class="mt-6 w-full rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Send me the syllabus</button>
    </form>
  </div>
</section>`,
  },
  {
    id: "hero-centered-proof",
    category: "heroes",
    name: "Centred with logos below",
    note: "Launches and announcements, where the sentence is the design.",
    html: `<section class="bg-white">
  <div class="mx-auto max-w-4xl px-5 pt-20 pb-12 text-center md:pt-24">
    <h1 class="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 md:text-6xl">GST invoices in under a minute</h1>
    <p class="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-zinc-600">Billing, stock and payment reminders for shops with one counter or twenty.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="#" class="rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Start free</a>
      <a href="#" class="rounded-lg px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100">Watch a 2 minute demo</a>
    </div>
  </div>
  <div class="mx-auto max-w-5xl border-t border-zinc-100 px-5 py-8">
    <p class="text-center text-xs font-medium text-zinc-500">Used by 4,000 shops across Telangana and Andhra Pradesh</p>
    <div class="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-zinc-400">
      <span class="text-lg font-bold tracking-tight">Sri Balaji Stores</span>
      <span class="text-lg font-semibold italic">Ganga Textiles</span>
      <span class="text-lg font-bold tracking-[0.2em] uppercase">Medplus+</span>
      <span class="text-lg font-semibold">Hari Electricals</span>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-sketch",
    category: "heroes",
    name: "With a sketch diagram",
    note: "Services that are hard to photograph: consulting, software, AI.",
    html: `<section class="bg-white">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
    <div>
      <h1 class="text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 md:text-5xl">AI agents that answer your customers on WhatsApp</h1>
      <p class="mt-5 max-w-[44ch] text-base leading-relaxed text-zinc-600">Trained on your catalogue and policies, handing over to a person when it is not sure.</p>
      <a href="#" class="mt-8 inline-block rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">See it working</a>
    </div>
    <svg viewBox="0 0 480 360" class="w-full" role="img" aria-label="Customer message goes to the agent, which answers or hands over to a person">
      <defs><filter id="rough-hero"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="3.5" /></filter></defs>
      <g filter="url(#rough-hero)" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive">
        <rect x="20" y="40" width="130" height="80" rx="14" class="fill-(--s-light) stroke-(--s-dark)" />
        <text x="85" y="88" text-anchor="middle" font-size="17" class="fill-(--s-dark)" stroke="none">Customer</text>
        <rect x="175" y="140" width="130" height="80" rx="14" class="fill-(--p-light) stroke-(--p-dark)" />
        <text x="240" y="187" text-anchor="middle" font-size="17" class="fill-(--p-dark)" stroke="none">AI agent</text>
        <rect x="330" y="40" width="130" height="80" rx="14" class="fill-(--t-light) stroke-(--t-dark)" />
        <text x="395" y="88" text-anchor="middle" font-size="17" class="fill-(--t-dark)" stroke="none">Answer</text>
        <rect x="330" y="250" width="130" height="80" rx="14" class="fill-white stroke-zinc-500" />
        <text x="395" y="297" text-anchor="middle" font-size="17" class="fill-zinc-700" stroke="none">Your team</text>
        <path d="M110 122 C 130 160, 150 175, 172 178" class="stroke-zinc-600" />
        <path d="M162 170 L 173 178 L 160 185" class="stroke-zinc-600" />
        <path d="M308 168 C 330 150, 350 135, 380 124" class="stroke-zinc-600" />
        <path d="M368 120 L 381 123 L 372 133" class="stroke-zinc-600" />
        <path d="M290 222 C 310 250, 320 270, 328 285" stroke-dasharray="6 7" class="stroke-zinc-600" />
        <text x="250" y="270" font-size="14" class="fill-zinc-600" stroke="none">not sure?</text>
      </g>
    </svg>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Feature sections
  // -------------------------------------------------------------------------
  {
    id: "features-bento",
    category: "features",
    name: "Bento grid",
    note: "Four or five features of different weight. Cells match the content.",
    html: `<section class="bg-white">
  <div class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="max-w-[24ch] text-3xl font-semibold tracking-tight text-zinc-900">Everything a clinic needs at the front desk</h2>
    <div class="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
      <article class="rounded-2xl bg-(--p-dark) p-6 text-white md:col-span-2 md:row-span-2 md:p-8">
        <h3 class="text-xl font-semibold">Appointments that fill themselves</h3>
        <p class="mt-2 max-w-[40ch] text-sm leading-relaxed text-white/75">Patients book from Google, WhatsApp or your website. Cancelled slots are offered to the waiting list automatically.</p>
        <img src="https://picsum.photos/seed/clinic-calendar/900/420" alt="" class="mt-6 aspect-[2/1] w-full rounded-xl object-cover" />
      </article>
      <article class="rounded-2xl bg-(--s-light) p-6">
        <h3 class="font-semibold text-(--s-dark)">Reminders on WhatsApp</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-700">Sent the day before and two hours before. No-shows drop by a third.</p>
      </article>
      <article class="rounded-2xl border border-zinc-200 p-6">
        <h3 class="font-semibold text-zinc-900">Bills and prescriptions</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Printed or sent as a PDF, with GST worked out for you.</p>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: "features-zigzag",
    category: "features",
    name: "Two rows, image and text swapping sides",
    note: "Two features that need a picture each. Never more than two in a row.",
    html: `<section class="bg-white">
  <div class="mx-auto max-w-6xl space-y-16 px-5 py-16">
    <div class="grid items-center gap-10 md:grid-cols-2">
      <img src="https://picsum.photos/seed/warehouse-scan/880/660" alt="" class="aspect-[4/3] w-full rounded-2xl object-cover" />
      <div>
        <span class="text-sm font-semibold text-(--p-dark)">Stock</span>
        <h3 class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Scan it in, scan it out</h3>
        <p class="mt-3 max-w-[46ch] leading-relaxed text-zinc-600">Any phone becomes a barcode scanner. Stock levels update in every branch the moment a box leaves the shelf.</p>
      </div>
    </div>
    <div class="grid items-center gap-10 md:grid-cols-2">
      <div class="md:order-2"><img src="https://picsum.photos/seed/delivery-route/880/660" alt="" class="aspect-[4/3] w-full rounded-2xl object-cover" /></div>
      <div class="md:order-1">
        <span class="text-sm font-semibold text-(--s-dark)">Delivery</span>
        <h3 class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Routes planned before the van leaves</h3>
        <p class="mt-3 max-w-[46ch] leading-relaxed text-zinc-600">Orders are grouped by area and sorted by traffic, and the customer gets a live link to follow the van.</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "features-icon-list",
    category: "features",
    name: "Heading left, list of features right",
    note: "Six or more small features without six identical cards.",
    html: `<section class="bg-zinc-50">
  <div class="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.6fr]">
    <div>
      <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">Built for how small agencies work</h2>
      <p class="mt-4 max-w-[36ch] leading-relaxed text-zinc-600">One place for clients, files, approvals and invoices, so nothing lives in a WhatsApp group.</p>
    </div>
    <dl class="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <div class="border-l-2 border-(--p) pl-4"><dt class="font-semibold text-zinc-900">Client portal</dt><dd class="mt-1 text-sm leading-relaxed text-zinc-600">Clients see progress and approve work without logging in.</dd></div>
      <div class="border-l-2 border-(--p) pl-4"><dt class="font-semibold text-zinc-900">Approvals with comments</dt><dd class="mt-1 text-sm leading-relaxed text-zinc-600">Feedback pinned to the exact spot on the design.</dd></div>
      <div class="border-l-2 border-(--s) pl-4"><dt class="font-semibold text-zinc-900">Retainer tracking</dt><dd class="mt-1 text-sm leading-relaxed text-zinc-600">Hours used against hours sold, per client, per month.</dd></div>
      <div class="border-l-2 border-(--s) pl-4"><dt class="font-semibold text-zinc-900">GST invoices</dt><dd class="mt-1 text-sm leading-relaxed text-zinc-600">Raised from approved work, paid by UPI link.</dd></div>
      <div class="border-l-2 border-(--t) pl-4"><dt class="font-semibold text-zinc-900">File versions</dt><dd class="mt-1 text-sm leading-relaxed text-zinc-600">Every upload kept, the latest one always on top.</dd></div>
      <div class="border-l-2 border-(--t) pl-4"><dt class="font-semibold text-zinc-900">Team calendar</dt><dd class="mt-1 text-sm leading-relaxed text-zinc-600">Who is on what this week, and who has room.</dd></div>
    </dl>
  </div>
</section>`,
  },
  {
    id: "features-steps",
    category: "features",
    name: "How it works, in steps",
    note: "A process with three or four stages, laid across the width.",
    html: `<section class="bg-white">
  <div class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">From first call to launch</h2>
    <ol class="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
      <li class="relative md:pt-8">
        <span class="hidden md:absolute md:top-3 md:left-10 md:block md:h-px md:w-[calc(100%-1rem)] md:bg-zinc-200"></span>
        <span class="relative grid size-8 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on) md:absolute md:top-0">1</span>
        <h3 class="mt-4 font-semibold text-zinc-900 md:mt-6">Discovery call</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Thirty minutes on what the site has to do and for whom.</p>
      </li>
      <li class="relative md:pt-8">
        <span class="hidden md:absolute md:top-3 md:left-10 md:block md:h-px md:w-[calc(100%-1rem)] md:bg-zinc-200"></span>
        <span class="relative grid size-8 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on) md:absolute md:top-0">2</span>
        <h3 class="mt-4 font-semibold text-zinc-900 md:mt-6">Design</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Home page first, then the rest once you like the direction.</p>
      </li>
      <li class="relative md:pt-8">
        <span class="hidden md:absolute md:top-3 md:left-10 md:block md:h-px md:w-[calc(100%-1rem)] md:bg-zinc-200"></span>
        <span class="relative grid size-8 place-items-center rounded-full bg-(--p) text-sm font-bold text-(--p-on) md:absolute md:top-0">3</span>
        <h3 class="mt-4 font-semibold text-zinc-900 md:mt-6">Build</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-zinc-600">A preview link you can open on your phone at every stage.</p>
      </li>
      <li class="relative md:pt-8">
        <span class="relative grid size-8 place-items-center rounded-full bg-(--t) text-sm font-bold text-(--t-on) md:absolute md:top-0">4</span>
        <h3 class="mt-4 font-semibold text-zinc-900 md:mt-6">Launch</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-zinc-600">Domain, Google listing and analytics set up on the day.</p>
      </li>
    </ol>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Profile cards
  // -------------------------------------------------------------------------
  {
    id: "profile-photo-top",
    category: "profile-cards",
    name: "Photo on top, details below",
    note: "Team pages. Three or four in a row, all the same height.",
    html: `<div class="grid gap-5 bg-zinc-50 p-6 sm:grid-cols-2 lg:grid-cols-3">
  <article class="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
    <img src="https://picsum.photos/seed/mentor-data/600/460" alt="" class="aspect-[4/3] w-full object-cover" />
    <div class="p-5">
      <h3 class="font-semibold text-zinc-900">Lead data mentor</h3>
      <p class="text-sm text-(--p-dark)">8 years in fintech analytics</p>
      <p class="mt-3 text-sm leading-relaxed text-zinc-600">Built the credit risk dashboards at a lending app. Reviews every SQL project line by line.</p>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">SQL</span>
        <span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">Power BI</span>
      </div>
    </div>
  </article>
  <article class="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
    <img src="https://picsum.photos/seed/mentor-ml/600/460" alt="" class="aspect-[4/3] w-full object-cover" />
    <div class="p-5">
      <h3 class="font-semibold text-zinc-900">Machine learning mentor</h3>
      <p class="text-sm text-(--p-dark)">6 years in retail forecasting</p>
      <p class="mt-3 text-sm leading-relaxed text-zinc-600">Forecasts demand for a grocery chain with 300 stores. Teaches the maths only when it is needed.</p>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">Python</span>
        <span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">scikit-learn</span>
      </div>
    </div>
  </article>
  <article class="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
    <img src="https://picsum.photos/seed/mentor-career/600/460" alt="" class="aspect-[4/3] w-full object-cover" />
    <div class="p-5">
      <h3 class="font-semibold text-zinc-900">Placement coach</h3>
      <p class="text-sm text-(--p-dark)">Former campus recruiter</p>
      <p class="mt-3 text-sm leading-relaxed text-zinc-600">Ran hiring for two IT services firms. Runs the mock interviews and rewrites the resumes.</p>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">Interviews</span>
        <span class="rounded-full bg-(--p-light) px-2.5 py-0.5 text-xs font-medium text-(--p-dark)">Resumes</span>
      </div>
    </div>
  </article>
</div>`,
  },
  {
    id: "profile-horizontal",
    category: "profile-cards",
    name: "Side by side with contact links",
    note: "Doctors, lawyers, consultants: someone people will contact.",
    html: `<div class="grid gap-5 bg-white p-6 lg:grid-cols-2">
  <article class="flex gap-5 rounded-2xl border border-zinc-200 p-5">
    <img src="https://picsum.photos/seed/doctor-ortho/240/240" alt="" class="size-24 shrink-0 rounded-xl object-cover" />
    <div class="min-w-0">
      <h3 class="font-semibold text-zinc-900">Consultant orthopaedic surgeon</h3>
      <p class="text-sm text-zinc-600">MS Ortho, 14 years, knee and shoulder</p>
      <p class="mt-2 text-sm text-zinc-600">Mon to Sat, 10 am to 2 pm</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <a href="#" class="rounded-lg bg-(--p) px-3 py-1.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Book</a>
        <a href="#" class="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 hover:border-zinc-900">Call clinic</a>
      </div>
    </div>
  </article>
  <article class="flex gap-5 rounded-2xl border border-zinc-200 p-5">
    <img src="https://picsum.photos/seed/doctor-derm/240/240" alt="" class="size-24 shrink-0 rounded-xl object-cover" />
    <div class="min-w-0">
      <h3 class="font-semibold text-zinc-900">Consultant dermatologist</h3>
      <p class="text-sm text-zinc-600">MD Derm, 9 years, skin and hair</p>
      <p class="mt-2 text-sm text-zinc-600">Tue, Thu, Sat, 4 pm to 8 pm</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <a href="#" class="rounded-lg bg-(--p) px-3 py-1.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Book</a>
        <a href="#" class="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-800 hover:border-zinc-900">Call clinic</a>
      </div>
    </div>
  </article>
</div>`,
  },
  {
    id: "profile-cover",
    category: "profile-cards",
    name: "Cover banner and stats",
    note: "Creators, freelancers and community profiles.",
    html: `<div class="bg-zinc-50 p-6">
  <article class="mx-auto max-w-sm overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
    <div class="h-24 bg-gradient-to-r from-(--p) to-(--s)"></div>
    <div class="px-5 pb-5">
      <img src="https://picsum.photos/seed/designer-face/200/200" alt="" class="-mt-10 size-20 rounded-full object-cover ring-4 ring-white" />
      <div class="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 class="font-semibold text-zinc-900">Brand and packaging designer</h3>
          <p class="text-sm text-zinc-600">Pune, open to freelance</p>
        </div>
        <a href="#" class="shrink-0 rounded-full bg-zinc-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-(--p-dark)">Hire</a>
      </div>
      <dl class="mt-5 grid grid-cols-3 divide-x divide-zinc-200 rounded-xl bg-zinc-50 py-3 text-center">
        <div><dt class="text-xs text-zinc-500">Projects</dt><dd class="font-semibold text-zinc-900">64</dd></div>
        <div><dt class="text-xs text-zinc-500">Rating</dt><dd class="font-semibold text-zinc-900">4.9</dd></div>
        <div><dt class="text-xs text-zinc-500">Repeat</dt><dd class="font-semibold text-zinc-900">72%</dd></div>
      </dl>
    </div>
  </article>
</div>`,
  },
  {
    id: "profile-minimal-grid",
    category: "profile-cards",
    name: "Compact grid with initials",
    note: "Large teams or a board, where photos are not available.",
    html: `<div class="bg-white p-6">
  <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <li class="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
      <span class="grid size-11 shrink-0 place-items-center rounded-full bg-(--p-light) text-sm font-bold text-(--p-dark)">CE</span>
      <span class="min-w-0"><span class="block truncate text-sm font-semibold text-zinc-900">Chief executive</span><span class="block truncate text-xs text-zinc-500">Founded the firm in 2011</span></span>
    </li>
    <li class="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
      <span class="grid size-11 shrink-0 place-items-center rounded-full bg-(--s-light) text-sm font-bold text-(--s-dark)">CT</span>
      <span class="min-w-0"><span class="block truncate text-sm font-semibold text-zinc-900">Chief technology officer</span><span class="block truncate text-xs text-zinc-500">Platform and security</span></span>
    </li>
    <li class="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
      <span class="grid size-11 shrink-0 place-items-center rounded-full bg-(--t-light) text-sm font-bold text-(--t-dark)">HD</span>
      <span class="min-w-0"><span class="block truncate text-sm font-semibold text-zinc-900">Head of design</span><span class="block truncate text-xs text-zinc-500">Product and brand</span></span>
    </li>
    <li class="flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
      <span class="grid size-11 shrink-0 place-items-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-700">FC</span>
      <span class="min-w-0"><span class="block truncate text-sm font-semibold text-zinc-900">Finance controller</span><span class="block truncate text-xs text-zinc-500">Accounts and compliance</span></span>
    </li>
  </ul>
</div>`,
  },
  {
    id: "profile-dark-hover",
    category: "profile-cards",
    name: "Photo with details on hover",
    note: "Agencies and studios. Shows the role always and the bio on hover.",
    html: `<div class="grid gap-4 bg-zinc-950 p-6 sm:grid-cols-2 lg:grid-cols-3">
  <article class="group relative overflow-hidden rounded-2xl">
    <img src="https://picsum.photos/seed/studio-lead/600/720" alt="" class="aspect-[5/6] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent p-5 pt-16">
      <h3 class="font-semibold text-white">Creative director</h3>
      <p class="text-sm text-(--t)">Brand films and campaigns</p>
      <p class="mt-2 max-h-24 overflow-hidden text-sm leading-relaxed text-white/75 transition-all duration-300 md:max-h-0 md:group-hover:max-h-24">Twelve years in advertising. Has shot for two airlines and a cricket league.</p>
    </div>
  </article>
  <article class="group relative overflow-hidden rounded-2xl">
    <img src="https://picsum.photos/seed/studio-dev/600/720" alt="" class="aspect-[5/6] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent p-5 pt-16">
      <h3 class="font-semibold text-white">Engineering lead</h3>
      <p class="text-sm text-(--t)">Web and mobile</p>
      <p class="mt-2 max-h-24 overflow-hidden text-sm leading-relaxed text-white/75 transition-all duration-300 md:max-h-0 md:group-hover:max-h-24">Ships the sites the studio designs, fast on a cheap phone and a slow network.</p>
    </div>
  </article>
  <article class="group relative overflow-hidden rounded-2xl">
    <img src="https://picsum.photos/seed/studio-strategy/600/720" alt="" class="aspect-[5/6] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/60 to-transparent p-5 pt-16">
      <h3 class="font-semibold text-white">Strategy lead</h3>
      <p class="text-sm text-(--t)">Research and positioning</p>
      <p class="mt-2 max-h-24 overflow-hidden text-sm leading-relaxed text-white/75 transition-all duration-300 md:max-h-0 md:group-hover:max-h-24">Talks to your customers before anyone designs anything.</p>
    </div>
  </article>
</div>`,
  },
  {
    id: "profile-speaker",
    category: "profile-cards",
    name: "Speaker or trainer card with session",
    note: "Events and workshops: who, what they are talking about, when.",
    html: `<div class="bg-(--s-light) p-6">
  <article class="mx-auto grid max-w-2xl gap-5 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-[9rem_1fr]">
    <img src="https://picsum.photos/seed/speaker-stage/320/380" alt="" class="aspect-[4/5] w-full rounded-xl object-cover" />
    <div class="flex flex-col">
      <span class="self-start rounded-full bg-(--s) px-2.5 py-0.5 text-xs font-semibold text-(--s-on)">Keynote</span>
      <h3 class="mt-3 text-lg font-semibold text-zinc-900">Shipping AI features without a data team</h3>
      <p class="mt-1 text-sm text-zinc-600">Head of product, B2B SaaS, Bengaluru</p>
      <p class="mt-3 text-sm leading-relaxed text-zinc-600">What worked, what was rolled back, and the three checks every AI feature now goes through.</p>
      <p class="mt-auto pt-4 text-sm font-semibold text-(--s-dark)">Saturday, 10:30 am, Hall B</p>
    </div>
  </article>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Forms
  // -------------------------------------------------------------------------
  {
    id: "form-contact-split",
    category: "forms",
    name: "Contact form beside contact details",
    note: "The contact page. Uses the width: details left, form right.",
    html: `<section class="bg-white">
  <div class="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_1.3fr]">
    <div>
      <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">Tell us about the project</h2>
      <p class="mt-3 max-w-[38ch] leading-relaxed text-zinc-600">We reply within one working day, usually with a few questions and a rough budget.</p>
      <dl class="mt-8 space-y-4 text-sm">
        <div><dt class="font-semibold text-zinc-900">Email</dt><dd class="text-zinc-600">projects@studio.example</dd></div>
        <div><dt class="font-semibold text-zinc-900">Phone</dt><dd class="text-zinc-600">+91 40 4852 1937</dd></div>
        <div><dt class="font-semibold text-zinc-900">Office</dt><dd class="text-zinc-600">3rd floor, Road No. 36, Jubilee Hills, Hyderabad</dd></div>
      </dl>
    </div>
    <form class="grid gap-5 rounded-2xl border border-zinc-200 p-6 sm:grid-cols-2 md:p-8">
      <div class="grid gap-1.5"><label for="cf-name" class="text-sm font-medium text-zinc-800">Name</label><input id="cf-name" class="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" /></div>
      <div class="grid gap-1.5"><label for="cf-company" class="text-sm font-medium text-zinc-800">Company</label><input id="cf-company" class="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" /></div>
      <div class="grid gap-1.5"><label for="cf-email" class="text-sm font-medium text-zinc-800">Work email</label><input id="cf-email" type="email" class="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" /></div>
      <div class="grid gap-1.5"><label for="cf-budget" class="text-sm font-medium text-zinc-800">Budget</label><select id="cf-budget" class="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none"><option>Under ₹1 lakh</option><option>₹1 to 3 lakh</option><option>₹3 to 10 lakh</option><option>Above ₹10 lakh</option></select></div>
      <div class="grid gap-1.5 sm:col-span-2"><label for="cf-msg" class="text-sm font-medium text-zinc-800">What do you need?</label><textarea id="cf-msg" rows="4" class="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none"></textarea><p class="text-xs text-zinc-500">A few lines is enough. Links to sites you like help.</p></div>
      <div class="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <label class="flex items-center gap-2 text-sm text-zinc-600"><input type="checkbox" class="size-4 accent-(--p)" /> Send me a copy</label>
        <button type="submit" class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Send enquiry</button>
      </div>
    </form>
  </div>
</section>`,
  },
  {
    id: "form-sign-in",
    category: "forms",
    name: "Sign in with Google or email",
    note: "Log-in pages and dashboards.",
    html: `<div class="grid min-h-[34rem] place-items-center bg-zinc-50 p-6">
  <form class="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm ring-1 ring-zinc-200">
    <span class="grid size-10 place-items-center rounded-xl bg-(--p) font-bold text-(--p-on)">L</span>
    <h2 class="mt-5 text-xl font-semibold text-zinc-900">Sign in to Ledgerly</h2>
    <p class="mt-1 text-sm text-zinc-600">Welcome back. Pick up where you left off.</p>
    <button type="button" class="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
      <img src="https://cdn.simpleicons.org/google" alt="" class="size-4" /> Continue with Google
    </button>
    <div class="my-5 flex items-center gap-3 text-xs text-zinc-500"><span class="h-px flex-1 bg-zinc-200"></span>or<span class="h-px flex-1 bg-zinc-200"></span></div>
    <label for="si-email" class="text-sm font-medium text-zinc-800">Email</label>
    <input id="si-email" type="email" class="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" />
    <div class="mt-4 flex items-center justify-between"><label for="si-pass" class="text-sm font-medium text-zinc-800">Password</label><a href="#" class="text-sm font-medium text-(--p-dark) hover:underline">Forgot it?</a></div>
    <input id="si-pass" type="password" class="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 focus:border-(--p) focus:ring-2 focus:ring-(--p-light) focus:outline-none" />
    <button type="submit" class="mt-6 w-full rounded-lg bg-(--p) px-4 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Sign in</button>
    <p class="mt-5 text-center text-sm text-zinc-600">New here? <a href="#" class="font-semibold text-(--p-dark) hover:underline">Create an account</a></p>
  </form>
</div>`,
  },
  {
    id: "form-errors",
    category: "forms",
    name: "Form showing errors",
    note: "How a field looks when it is wrong: red border, message under it.",
    html: `<div class="bg-white p-6">
  <form class="mx-auto grid max-w-md gap-5">
    <div role="alert" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">Two fields need fixing before we can send this.</div>
    <div class="grid gap-1.5">
      <label for="fe-email" class="text-sm font-medium text-zinc-800">Email</label>
      <input id="fe-email" type="email" value="orders@kalyaninteriors" aria-invalid="true" aria-describedby="fe-email-err" class="rounded-lg border border-red-500 px-3 py-2.5 text-sm text-zinc-900 focus:ring-2 focus:ring-red-200 focus:outline-none" />
      <p id="fe-email-err" class="text-sm text-red-700">This email is missing the ending, like .com or .in</p>
    </div>
    <div class="grid gap-1.5">
      <label for="fe-phone" class="text-sm font-medium text-zinc-800">Mobile number</label>
      <div class="flex rounded-lg border border-red-500 focus-within:ring-2 focus-within:ring-red-200"><span class="border-r border-zinc-200 px-3 py-2.5 text-sm text-zinc-500">+91</span><input id="fe-phone" value="98480" aria-invalid="true" aria-describedby="fe-phone-err" class="min-w-0 flex-1 rounded-r-lg px-3 py-2.5 text-sm text-zinc-900 focus:outline-none" /></div>
      <p id="fe-phone-err" class="text-sm text-red-700">Enter all 10 digits</p>
    </div>
    <div class="grid gap-1.5">
      <label for="fe-city" class="text-sm font-medium text-zinc-800">City</label>
      <input id="fe-city" value="Vijayawada" class="rounded-lg border border-(--s) px-3 py-2.5 text-sm text-zinc-900 focus:outline-none" />
      <p class="text-sm text-(--s-dark)">Looks good</p>
    </div>
    <button type="submit" class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Continue</button>
  </form>
</div>`,
  },
  {
    id: "form-newsletter",
    category: "forms",
    name: "Newsletter sign-up strip",
    note: "Above a footer or at the end of an article.",
    html: `<section class="bg-(--p-dark)">
  <div class="mx-auto grid max-w-6xl items-center gap-6 px-5 py-10 md:grid-cols-2">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-white">One useful email every Friday</h2>
      <p class="mt-2 text-sm leading-relaxed text-white/75">A SQL trick, a job opening and one interview question. No spam, leave any time.</p>
    </div>
    <form class="flex flex-col gap-3 sm:flex-row">
      <label for="nl-email" class="sr-only">Email</label>
      <input id="nl-email" type="email" placeholder="you@example.com" class="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none" />
      <button type="submit" class="rounded-lg bg-(--t) px-5 py-3 text-sm font-semibold text-(--t-on) hover:bg-(--t-light)">Subscribe</button>
    </form>
  </div>
</section>`,
  },
  {
    id: "form-booking",
    category: "forms",
    name: "Booking with date and time slots",
    note: "Clinics, salons, demos: pick a day, then a time.",
    html: `<div class="bg-zinc-50 p-6">
  <form class="mx-auto max-w-xl rounded-2xl bg-white p-6 ring-1 ring-zinc-200">
    <h2 class="text-lg font-semibold text-zinc-900">Book a consultation</h2>
    <p class="mt-1 text-sm text-zinc-600">30 minutes, in person or on video.</p>
    <fieldset class="mt-5">
      <legend class="text-sm font-medium text-zinc-800">Day</legend>
      <div class="mt-2 grid grid-cols-5 gap-2 text-center text-sm">
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 has-checked:border-(--p) has-checked:bg-(--p-light)"><input type="radio" name="bk-day" class="sr-only" /><span class="block text-xs text-zinc-500">Mon</span><span class="font-semibold text-zinc-900">14</span></label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 has-checked:border-(--p) has-checked:bg-(--p-light)"><input type="radio" name="bk-day" class="sr-only" checked /><span class="block text-xs text-zinc-500">Tue</span><span class="font-semibold text-zinc-900">15</span></label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 has-checked:border-(--p) has-checked:bg-(--p-light)"><input type="radio" name="bk-day" class="sr-only" /><span class="block text-xs text-zinc-500">Wed</span><span class="font-semibold text-zinc-900">16</span></label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 has-checked:border-(--p) has-checked:bg-(--p-light)"><input type="radio" name="bk-day" class="sr-only" /><span class="block text-xs text-zinc-500">Thu</span><span class="font-semibold text-zinc-900">17</span></label>
        <label class="cursor-not-allowed rounded-lg border border-zinc-100 bg-zinc-50 py-2 text-zinc-400"><input type="radio" name="bk-day" class="sr-only" disabled /><span class="block text-xs">Fri</span><span class="font-semibold">18</span></label>
      </div>
    </fieldset>
    <fieldset class="mt-5">
      <legend class="text-sm font-medium text-zinc-800">Time</legend>
      <div class="mt-2 grid grid-cols-3 gap-2 text-sm sm:grid-cols-4">
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 text-center font-medium text-zinc-800 has-checked:border-(--p) has-checked:bg-(--p) has-checked:text-(--p-on)"><input type="radio" name="bk-time" class="sr-only" />10:00</label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 text-center font-medium text-zinc-800 has-checked:border-(--p) has-checked:bg-(--p) has-checked:text-(--p-on)"><input type="radio" name="bk-time" class="sr-only" checked />10:30</label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 text-center font-medium text-zinc-800 has-checked:border-(--p) has-checked:bg-(--p) has-checked:text-(--p-on)"><input type="radio" name="bk-time" class="sr-only" />11:30</label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 text-center font-medium text-zinc-800 has-checked:border-(--p) has-checked:bg-(--p) has-checked:text-(--p-on)"><input type="radio" name="bk-time" class="sr-only" />4:00</label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 text-center font-medium text-zinc-800 has-checked:border-(--p) has-checked:bg-(--p) has-checked:text-(--p-on)"><input type="radio" name="bk-time" class="sr-only" />4:30</label>
        <label class="cursor-pointer rounded-lg border border-zinc-200 py-2 text-center font-medium text-zinc-800 has-checked:border-(--p) has-checked:bg-(--p) has-checked:text-(--p-on)"><input type="radio" name="bk-time" class="sr-only" />5:30</label>
      </div>
    </fieldset>
    <button type="submit" class="mt-6 w-full rounded-lg bg-(--p) px-5 py-3 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Book Tuesday 15, 10:30</button>
  </form>
</div>`,
  },
  {
    id: "form-multistep",
    category: "forms",
    name: "Multi-step form with progress",
    note: "Long forms (admissions, quotes) broken into short steps.",
    html: `<div class="bg-white p-6">
  <form class="mx-auto max-w-xl">
    <ol class="flex items-center gap-2 text-sm">
      <li class="flex items-center gap-2 font-semibold text-(--p-dark)"><span class="grid size-6 place-items-center rounded-full bg-(--p) text-xs text-(--p-on)">1</span><span class="max-sm:sr-only">About you</span></li>
      <li class="h-px flex-1 bg-(--p)"></li>
      <li class="flex items-center gap-2 font-semibold text-zinc-900"><span class="grid size-6 place-items-center rounded-full border-2 border-(--p) text-xs text-(--p-dark)">2</span>Course</li>
      <li class="h-px flex-1 bg-zinc-200"></li>
      <li class="flex items-center gap-2 text-zinc-400"><span class="grid size-6 place-items-center rounded-full border-2 border-zinc-200 text-xs">3</span><span class="max-sm:sr-only">Payment</span></li>
    </ol>
    <h2 class="mt-8 text-xl font-semibold text-zinc-900">Which course and when?</h2>
    <div class="mt-5 grid gap-3">
      <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 has-checked:border-(--p) has-checked:bg-(--p-light)"><input type="radio" name="ms-course" class="mt-1 accent-(--p)" checked /><span><span class="block font-semibold text-zinc-900">Data analytics, weekends</span><span class="block text-sm text-zinc-600">16 weeks, Sat and Sun, 10 am to 1 pm</span></span></label>
      <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 has-checked:border-(--p) has-checked:bg-(--p-light)"><input type="radio" name="ms-course" class="mt-1 accent-(--p)" /><span><span class="block font-semibold text-zinc-900">Data analytics, weekday evenings</span><span class="block text-sm text-zinc-600">12 weeks, Mon to Thu, 7 pm to 9 pm</span></span></label>
    </div>
    <div class="mt-8 flex justify-between">
      <button type="button" class="rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Back</button>
      <button type="submit" class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Next: payment</button>
    </div>
  </form>
</div>`,
  },
  {
    id: "form-search-filters",
    category: "forms",
    name: "Search with filters",
    note: "Listings: properties, courses, jobs, products.",
    html: `<div class="bg-(--s-light) p-6">
  <form class="mx-auto grid max-w-4xl gap-3 rounded-2xl bg-white p-3 shadow-sm md:grid-cols-[1.4fr_1fr_1fr_auto]">
    <div class="grid gap-1 rounded-xl px-3 py-2 hover:bg-zinc-50"><label for="sf-where" class="text-xs font-semibold text-zinc-700">Area</label><input id="sf-where" placeholder="Gachibowli, Kondapur..." class="text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none" /></div>
    <div class="grid gap-1 rounded-xl px-3 py-2 hover:bg-zinc-50"><label for="sf-type" class="text-xs font-semibold text-zinc-700">Type</label><select id="sf-type" class="bg-transparent text-sm text-zinc-900 focus:outline-none"><option>2 BHK</option><option>3 BHK</option><option>Villa</option></select></div>
    <div class="grid gap-1 rounded-xl px-3 py-2 hover:bg-zinc-50"><label for="sf-budget" class="text-xs font-semibold text-zinc-700">Budget</label><select id="sf-budget" class="bg-transparent text-sm text-zinc-900 focus:outline-none"><option>Up to ₹80 lakh</option><option>₹80 lakh to ₹1.5 cr</option><option>Above ₹1.5 cr</option></select></div>
    <button type="submit" class="rounded-xl bg-(--s-dark) px-6 py-3 text-sm font-semibold text-white hover:bg-(--s)">Search</button>
  </form>
  <div class="mx-auto mt-4 flex max-w-4xl flex-wrap gap-2 text-sm">
    <span class="rounded-full bg-white px-3 py-1 font-medium text-(--s-dark) ring-1 ring-(--s)">Ready to move</span>
    <span class="rounded-full bg-white px-3 py-1 text-zinc-700 ring-1 ring-zinc-200">Gated community</span>
    <span class="rounded-full bg-white px-3 py-1 text-zinc-700 ring-1 ring-zinc-200">Near metro</span>
    <span class="rounded-full bg-white px-3 py-1 text-zinc-700 ring-1 ring-zinc-200">East facing</span>
  </div>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Pricing
  // -------------------------------------------------------------------------
  {
    id: "pricing-three",
    category: "pricing",
    name: "Three plans, middle one marked",
    note: "The standard pricing table. The recommended plan stands out.",
    html: `<section class="bg-zinc-50">
  <div class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-center text-3xl font-semibold tracking-tight text-zinc-900">Plans for every size of shop</h2>
    <div class="mt-10 grid items-start gap-5 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-6 ring-1 ring-zinc-200">
        <h3 class="font-semibold text-zinc-900">Starter</h3>
        <p class="mt-1 text-sm text-zinc-600">One counter, one user.</p>
        <p class="mt-5"><span class="text-4xl font-semibold text-zinc-900">₹0</span><span class="text-sm text-zinc-500"> forever</span></p>
        <ul class="mt-6 space-y-2.5 text-sm text-zinc-700"><li>50 invoices a month</li><li>GST reports</li><li>UPI payment links</li></ul>
        <a href="#" class="mt-8 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-800 hover:border-zinc-900">Start free</a>
      </article>
      <article class="relative rounded-2xl bg-white p-6 shadow-lg ring-2 ring-(--p) md:-mt-4 md:pb-10">
        <span class="absolute -top-3 left-6 rounded-full bg-(--p) px-3 py-0.5 text-xs font-semibold text-(--p-on)">Most shops pick this</span>
        <h3 class="font-semibold text-zinc-900">Growth</h3>
        <p class="mt-1 text-sm text-zinc-600">Up to three counters.</p>
        <p class="mt-5"><span class="text-4xl font-semibold text-zinc-900">₹499</span><span class="text-sm text-zinc-500"> a month</span></p>
        <ul class="mt-6 space-y-2.5 text-sm text-zinc-700"><li>Unlimited invoices</li><li>Stock and barcodes</li><li>WhatsApp reminders</li><li>3 users</li></ul>
        <a href="#" class="mt-8 block rounded-lg bg-(--p) py-2.5 text-center text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Try 14 days free</a>
      </article>
      <article class="rounded-2xl bg-white p-6 ring-1 ring-zinc-200">
        <h3 class="font-semibold text-zinc-900">Chain</h3>
        <p class="mt-1 text-sm text-zinc-600">Many branches, one view.</p>
        <p class="mt-5"><span class="text-4xl font-semibold text-zinc-900">₹1,999</span><span class="text-sm text-zinc-500"> a month</span></p>
        <ul class="mt-6 space-y-2.5 text-sm text-zinc-700"><li>Everything in Growth</li><li>Branch transfers</li><li>Owner dashboard</li><li>Unlimited users</li></ul>
        <a href="#" class="mt-8 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-800 hover:border-zinc-900">Talk to sales</a>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: "pricing-toggle",
    category: "pricing",
    name: "Monthly or yearly switch",
    note: "When a yearly plan has a discount. Works with CSS only.",
    html: `<section class="group/price bg-white">
  <div class="mx-auto max-w-4xl px-5 py-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">Simple pricing</h2>
      <label class="flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-700">Monthly
        <input type="checkbox" class="peer sr-only" />
        <span class="relative h-6 w-11 rounded-full bg-zinc-300 transition-colors peer-checked:bg-(--p) after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"></span>
        Yearly <span class="rounded-full bg-(--t-light) px-2 py-0.5 text-xs font-semibold text-(--t-dark)">2 months free</span>
      </label>
    </div>
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      <article class="rounded-2xl border border-zinc-200 p-6">
        <h3 class="font-semibold text-zinc-900">Solo</h3>
        <p class="mt-4 text-4xl font-semibold text-zinc-900"><span class="group-has-checked/price:hidden">₹299</span><span class="hidden group-has-checked/price:inline">₹2,990</span></p>
        <p class="text-sm text-zinc-500"><span class="group-has-checked/price:hidden">per month</span><span class="hidden group-has-checked/price:inline">per year</span></p>
      </article>
      <article class="rounded-2xl bg-(--p-dark) p-6 text-white">
        <h3 class="font-semibold">Team</h3>
        <p class="mt-4 text-4xl font-semibold"><span class="group-has-checked/price:hidden">₹899</span><span class="hidden group-has-checked/price:inline">₹8,990</span></p>
        <p class="text-sm text-white/70"><span class="group-has-checked/price:hidden">per month, 5 seats</span><span class="hidden group-has-checked/price:inline">per year, 5 seats</span></p>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: "pricing-course",
    category: "pricing",
    name: "Single course fee with what is included",
    note: "One product, one price: a course, a package, an event ticket.",
    html: `<section class="bg-(--p-light)">
  <div class="mx-auto grid max-w-5xl gap-8 px-5 py-16 md:grid-cols-[1.2fr_1fr]">
    <div>
      <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">One fee, everything included</h2>
      <ul class="mt-6 grid gap-x-6 gap-y-3 text-sm text-zinc-800 sm:grid-cols-2">
        <li class="border-l-2 border-(--p) pl-3">96 hours of live classes</li>
        <li class="border-l-2 border-(--p) pl-3">Recordings for a year</li>
        <li class="border-l-2 border-(--p) pl-3">6 projects, reviewed 1 to 1</li>
        <li class="border-l-2 border-(--p) pl-3">Mock interviews</li>
        <li class="border-l-2 border-(--p) pl-3">Resume and LinkedIn rewrite</li>
        <li class="border-l-2 border-(--p) pl-3">Certificate on completion</li>
      </ul>
    </div>
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <p class="text-sm text-zinc-600">Course fee</p>
      <p class="mt-1 text-4xl font-semibold text-zinc-900">₹45,000</p>
      <p class="mt-1 text-sm text-zinc-600">or 3 instalments of ₹15,500</p>
      <a href="#" class="mt-6 block rounded-lg bg-(--p) py-3 text-center text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Reserve a seat for ₹2,000</a>
      <p class="mt-3 text-center text-xs text-zinc-500">Fully refundable until the first class</p>
    </div>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Testimonials
  // -------------------------------------------------------------------------
  {
    id: "testimonial-big-quote",
    category: "testimonials",
    name: "One large quote with a photo",
    note: "When one customer story says it best.",
    html: `<section class="bg-white">
  <div class="mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 md:grid-cols-[1fr_2fr]">
    <img src="https://picsum.photos/seed/bakery-owner/600/700" alt="" class="aspect-[6/7] w-full rounded-2xl object-cover" />
    <figure>
      <blockquote class="text-2xl leading-snug font-medium tracking-tight text-zinc-900 md:text-3xl">“Orders on the website went from a handful a week to forty a day, and the phone finally stopped ringing during baking hours.”</blockquote>
      <figcaption class="mt-6 text-sm"><span class="block font-semibold text-zinc-900">Owner, home bakery</span><span class="text-zinc-600">Secunderabad, customer since 2023</span></figcaption>
    </figure>
  </div>
</section>`,
  },
  {
    id: "testimonial-grid",
    category: "testimonials",
    name: "Grid of short reviews with ratings",
    note: "Several short reviews. Keep each under three lines.",
    html: `<section class="bg-zinc-50">
  <div class="mx-auto max-w-6xl px-5 py-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">What students say</h2>
      <p class="text-sm text-zinc-600"><span class="font-semibold text-zinc-900">4.8</span> from 312 Google reviews</p>
    </div>
    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <figure class="rounded-2xl bg-white p-5 ring-1 ring-zinc-200"><p class="text-(--t)">★★★★★</p><blockquote class="mt-3 text-sm leading-relaxed text-zinc-700">“The project reviews were the best part. Every comment made my SQL cleaner.”</blockquote><figcaption class="mt-4 text-xs"><span class="font-semibold text-zinc-900">Now a data analyst</span><span class="text-zinc-500"> at a logistics firm</span></figcaption></figure>
      <figure class="rounded-2xl bg-white p-5 ring-1 ring-zinc-200"><p class="text-(--t)">★★★★★</p><blockquote class="mt-3 text-sm leading-relaxed text-zinc-700">“I had a job and two kids. Weekend classes and recordings made it possible.”</blockquote><figcaption class="mt-4 text-xs"><span class="font-semibold text-zinc-900">Moved from accounts</span><span class="text-zinc-500"> to MIS reporting</span></figcaption></figure>
      <figure class="rounded-2xl bg-white p-5 ring-1 ring-zinc-200"><p class="text-(--t)">★★★★☆</p><blockquote class="mt-3 text-sm leading-relaxed text-zinc-700">“Mock interviews were tougher than the real one. That was the point.”</blockquote><figcaption class="mt-4 text-xs"><span class="font-semibold text-zinc-900">Final-year B.Tech</span><span class="text-zinc-500"> placed on campus</span></figcaption></figure>
    </div>
  </div>
</section>`,
  },
  {
    id: "testimonial-strip",
    category: "testimonials",
    name: "Coloured band with a quote and a number",
    note: "Between two sections, to break up the page.",
    html: `<section class="bg-(--s)">
  <div class="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 text-(--s-on) md:grid-cols-[auto_1fr]">
    <p class="text-6xl font-semibold tracking-tight">3.2x</p>
    <figure>
      <blockquote class="text-lg leading-relaxed font-medium">“Leads from Google tripled in four months, and we stopped paying for listings that never called back.”</blockquote>
      <figcaption class="mt-3 text-sm opacity-80">Marketing head, interior design firm, Chennai</figcaption>
    </figure>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Stats
  // -------------------------------------------------------------------------
  {
    id: "stats-row",
    category: "stats",
    name: "Four numbers in a row",
    note: "Under a hero or above a footer. Real numbers only.",
    html: `<section class="bg-white">
  <dl class="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-zinc-200 md:grid-cols-4">
    <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Projects delivered</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">214</dd></div>
    <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Average build</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">5 weeks</dd></div>
    <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Clients who came back</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-(--p-dark)">68%</dd></div>
    <div class="bg-white p-6"><dt class="text-sm text-zinc-600">Cities</dt><dd class="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">11</dd></div>
  </dl>
</section>`,
  },
  {
    id: "stats-feature",
    category: "stats",
    name: "One big number with context",
    note: "A single result worth the whole section.",
    html: `<section class="bg-(--p-dark)">
  <div class="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-2">
    <p class="text-7xl font-semibold tracking-tight text-white md:text-8xl">82%</p>
    <div>
      <h2 class="text-xl font-semibold text-white">of last year's batch got a job within four months</h2>
      <p class="mt-3 max-w-[44ch] text-sm leading-relaxed text-white/75">Counted from the 61 students who finished every project. The full list of companies is on the placements page.</p>
      <a href="#" class="mt-5 inline-block text-sm font-semibold text-(--t) underline underline-offset-4">See placements</a>
    </div>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Calls to action
  // -------------------------------------------------------------------------
  {
    id: "cta-band",
    category: "ctas",
    name: "Coloured band with one button",
    note: "The last thing before the footer.",
    html: `<section class="bg-white px-5 py-12">
  <div class="mx-auto grid max-w-6xl items-center gap-6 rounded-3xl bg-(--p) p-8 text-(--p-on) md:grid-cols-[1fr_auto] md:p-12">
    <div>
      <h2 class="text-3xl font-semibold tracking-tight">Ready to see your new website?</h2>
      <p class="mt-2 max-w-[48ch] opacity-85">Send us your current site and we will send back a free one-page redesign.</p>
    </div>
    <a href="#" class="justify-self-start rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">Get the free redesign</a>
  </div>
</section>`,
  },
  {
    id: "cta-image-split",
    category: "ctas",
    name: "Split with photo and two choices",
    note: "When there are two ways to start: call or visit.",
    html: `<section class="bg-(--s-light)">
  <div class="mx-auto grid max-w-6xl items-stretch overflow-hidden md:grid-cols-2">
    <img src="https://picsum.photos/seed/showroom-visit/900/700" alt="" class="h-full min-h-64 w-full object-cover" />
    <div class="p-8 md:p-12">
      <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">See the finishes in person</h2>
      <p class="mt-3 max-w-[40ch] leading-relaxed text-zinc-700">Our Madhapur showroom has every laminate, handle and countertop we fit. Open all week, 10 am to 8 pm.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-lg bg-(--s-dark) px-5 py-3 text-sm font-semibold text-white hover:bg-(--s)">Get directions</a>
        <a href="#" class="rounded-lg border border-(--s-dark) px-5 py-3 text-sm font-semibold text-(--s-dark) hover:bg-white">Call 040 4852 1937</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "cta-whatsapp",
    category: "ctas",
    name: "WhatsApp chat prompt",
    note: "Indian small businesses, where WhatsApp beats a form.",
    html: `<section class="bg-white px-5 py-12">
  <div class="mx-auto flex max-w-3xl flex-col items-start gap-5 rounded-2xl border border-zinc-200 p-6 sm:flex-row sm:items-center">
    <span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#25d366]"><img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="" class="size-7" /></span>
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-zinc-900">Questions? Ask us on WhatsApp</h2>
      <p class="text-sm text-zinc-600">A person replies, usually in under 15 minutes, 9 am to 9 pm.</p>
    </div>
    <a href="#" class="rounded-lg bg-[#1da851] px-5 py-3 text-sm font-semibold text-white hover:bg-[#128c3e]">Start a chat</a>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  FAQs
  // -------------------------------------------------------------------------
  {
    id: "faq-accordion",
    category: "faqs",
    name: "Accordion, heading on the left",
    note: "Uses details and summary, so it opens without JavaScript.",
    html: `<section class="bg-white">
  <div class="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_2fr]">
    <div>
      <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">Questions people ask</h2>
      <p class="mt-3 text-sm leading-relaxed text-zinc-600">Something else? <a href="#" class="font-semibold text-(--p-dark) underline underline-offset-2">Message us</a>.</p>
    </div>
    <div class="divide-y divide-zinc-200 border-y border-zinc-200">
      <details class="group py-4" open>
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900">Do I need a coding background?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary>
        <p class="mt-3 max-w-[60ch] text-sm leading-relaxed text-zinc-600">No. The first two weeks start from Excel and simple SQL. Most of last year's batch had never written code.</p>
      </details>
      <details class="group py-4">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900">What if I miss a class?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary>
        <p class="mt-3 max-w-[60ch] text-sm leading-relaxed text-zinc-600">Every class is recorded and up the same evening. Doubts go in the group and get answered within a day.</p>
      </details>
      <details class="group py-4">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900">Can I pay in instalments?<span class="grid size-7 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark) transition-transform group-open:rotate-45">+</span></summary>
        <p class="mt-3 max-w-[60ch] text-sm leading-relaxed text-zinc-600">Yes, three instalments a month apart, with no interest.</p>
      </details>
    </div>
  </div>
</section>`,
  },
  {
    id: "faq-cards",
    category: "faqs",
    name: "Two columns of answers",
    note: "Short answers that do not need to be hidden.",
    html: `<section class="bg-zinc-50">
  <div class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">Before you order</h2>
    <dl class="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
      <div><dt class="font-semibold text-zinc-900">How long does delivery take?</dt><dd class="mt-2 text-sm leading-relaxed text-zinc-600">Two days in Hyderabad, four to six days anywhere else in India.</dd></div>
      <div><dt class="font-semibold text-zinc-900">Can I return it?</dt><dd class="mt-2 text-sm leading-relaxed text-zinc-600">Within 7 days, unused and in the box. We pick it up for free.</dd></div>
      <div><dt class="font-semibold text-zinc-900">Is cash on delivery available?</dt><dd class="mt-2 text-sm leading-relaxed text-zinc-600">Yes, on orders under ₹5,000.</dd></div>
      <div><dt class="font-semibold text-zinc-900">Do you ship abroad?</dt><dd class="mt-2 text-sm leading-relaxed text-zinc-600">Not yet. Write to us and we will tell you when we do.</dd></div>
    </dl>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Blog and content cards
  // -------------------------------------------------------------------------
  {
    id: "blog-grid",
    category: "blog-cards",
    name: "Article cards with image",
    note: "A blog index or a 'read next' row.",
    html: `<section class="bg-white">
  <div class="mx-auto max-w-6xl px-5 py-16">
    <h2 class="text-3xl font-semibold tracking-tight text-zinc-900">From the blog</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <a href="#" class="group block">
        <img src="https://picsum.photos/seed/blog-sql/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" />
        <p class="mt-4 text-xs font-semibold text-(--p-dark)">SQL</p>
        <h3 class="mt-1 font-semibold text-zinc-900 group-hover:underline">Window functions explained with a cricket scorecard</h3>
        <p class="mt-2 text-sm text-zinc-500">8 min read</p>
      </a>
      <a href="#" class="group block">
        <img src="https://picsum.photos/seed/blog-resume/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" />
        <p class="mt-4 text-xs font-semibold text-(--s-dark)">Careers</p>
        <h3 class="mt-1 font-semibold text-zinc-900 group-hover:underline">The one-page resume that got four interview calls</h3>
        <p class="mt-2 text-sm text-zinc-500">5 min read</p>
      </a>
      <a href="#" class="group block">
        <img src="https://picsum.photos/seed/blog-dashboard/640/400" alt="" class="aspect-[16/10] w-full rounded-xl object-cover" />
        <p class="mt-4 text-xs font-semibold text-(--t-dark)">Power BI</p>
        <h3 class="mt-1 font-semibold text-zinc-900 group-hover:underline">A sales dashboard a manager reads in a minute</h3>
        <p class="mt-2 text-sm text-zinc-500">11 min read</p>
      </a>
    </div>
  </div>
</section>`,
  },
  {
    id: "blog-featured",
    category: "blog-cards",
    name: "One featured article and a list",
    note: "A blog home page with a lead story.",
    html: `<section class="bg-white">
  <div class="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1.5fr_1fr]">
    <a href="#" class="group block">
      <img src="https://picsum.photos/seed/blog-lead-ai/960/560" alt="" class="aspect-[16/9] w-full rounded-2xl object-cover" />
      <h3 class="mt-5 text-2xl font-semibold tracking-tight text-zinc-900 group-hover:underline">What an AI agent can and cannot do for a small business</h3>
      <p class="mt-2 max-w-[56ch] text-sm leading-relaxed text-zinc-600">Three agents we built this year, what they cost to run, and the one we switched off.</p>
    </a>
    <ul class="divide-y divide-zinc-200">
      <li class="py-4 first:pt-0"><a href="#" class="group block"><p class="text-xs font-semibold text-(--p-dark)">Marketing</p><p class="mt-1 font-semibold text-zinc-900 group-hover:underline">Google Business Profile in 20 minutes</p></a></li>
      <li class="py-4"><a href="#" class="group block"><p class="text-xs font-semibold text-(--p-dark)">Software</p><p class="mt-1 font-semibold text-zinc-900 group-hover:underline">Custom software or an off-the-shelf tool?</p></a></li>
      <li class="py-4"><a href="#" class="group block"><p class="text-xs font-semibold text-(--p-dark)">Design</p><p class="mt-1 font-semibold text-zinc-900 group-hover:underline">Picking three colours for a brand</p></a></li>
    </ul>
  </div>
</section>`,
  },
  {
    id: "resource-cards",
    category: "blog-cards",
    name: "Downloadable resources",
    note: "Guides, templates and checklists behind a button.",
    html: `<section class="bg-zinc-50">
  <div class="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-2">
    <a href="#" class="flex items-center gap-5 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 hover:ring-(--p)">
      <span class="grid size-14 shrink-0 place-items-center rounded-xl bg-(--p-light) text-xs font-bold text-(--p-dark)">PDF</span>
      <span class="min-w-0 flex-1"><span class="block font-semibold text-zinc-900">SQL interview questions, 60 with answers</span><span class="block text-sm text-zinc-500">24 pages, updated September</span></span>
      <span class="text-sm font-semibold text-(--p-dark)">Download</span>
    </a>
    <a href="#" class="flex items-center gap-5 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 hover:ring-(--p)">
      <span class="grid size-14 shrink-0 place-items-center rounded-xl bg-(--s-light) text-xs font-bold text-(--s-dark)">XLSX</span>
      <span class="min-w-0 flex-1"><span class="block font-semibold text-zinc-900">Monthly budget template for a small shop</span><span class="block text-sm text-zinc-500">Excel and Google Sheets</span></span>
      <span class="text-sm font-semibold text-(--p-dark)">Download</span>
    </a>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Footers
  // -------------------------------------------------------------------------
  {
    id: "footer-columns",
    category: "footers",
    name: "Dark, with link columns",
    note: "The usual company footer.",
    html: `<footer class="bg-zinc-950 text-zinc-400">
  <div class="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 text-sm md:grid-cols-[1.5fr_1fr_1fr_1fr]">
    <div class="col-span-2 md:col-span-1">
      <p class="flex items-center gap-2 text-base font-semibold text-white"><span class="size-4 rounded bg-(--p)"></span>Kalyan Interiors</p>
      <p class="mt-3 max-w-[32ch] leading-relaxed">Kitchens, wardrobes and full homes in Hyderabad since 2009.</p>
      <p class="mt-4 text-white">040 4852 1937</p>
    </div>
    <div><p class="font-semibold text-white">Services</p><ul class="mt-3 space-y-2"><li><a href="#" class="hover:text-white">Kitchens</a></li><li><a href="#" class="hover:text-white">Wardrobes</a></li><li><a href="#" class="hover:text-white">Full homes</a></li></ul></div>
    <div><p class="font-semibold text-white">Company</p><ul class="mt-3 space-y-2"><li><a href="#" class="hover:text-white">About</a></li><li><a href="#" class="hover:text-white">Projects</a></li><li><a href="#" class="hover:text-white">Careers</a></li></ul></div>
    <div class="col-span-2 md:col-span-1"><p class="font-semibold text-white">Visit</p><p class="mt-3 leading-relaxed">Plot 22, Hitech City Road, Madhapur, Hyderabad 500081</p></div>
  </div>
  <div class="border-t border-white/10">
    <div class="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-5 py-5 text-xs"><p>© 2026 Kalyan Interiors Pvt Ltd</p><p><a href="#" class="hover:text-white">Privacy</a><span class="mx-2">|</span><a href="#" class="hover:text-white">Terms</a></p></div>
  </div>
</footer>`,
  },
  {
    id: "footer-light-cta",
    category: "footers",
    name: "Light, with a sign-up on top",
    note: "When the footer should still ask for something.",
    html: `<footer class="border-t border-zinc-200 bg-white">
  <div class="mx-auto max-w-6xl px-5 py-12">
    <div class="grid items-center gap-6 border-b border-zinc-200 pb-10 md:grid-cols-2">
      <p class="text-2xl font-semibold tracking-tight text-zinc-900">New batch dates, straight to your inbox.</p>
      <form class="flex gap-2"><label for="fl-email" class="sr-only">Email</label><input id="fl-email" type="email" placeholder="you@example.com" class="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-(--p) focus:outline-none" /><button class="rounded-lg bg-(--p) px-4 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Notify me</button></form>
    </div>
    <div class="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-600">
      <p class="font-semibold text-zinc-900">north<span class="text-(--p)">desk</span></p>
      <nav class="flex flex-wrap gap-6"><a href="#" class="hover:text-zinc-900">Courses</a><a href="#" class="hover:text-zinc-900">Placements</a><a href="#" class="hover:text-zinc-900">Blog</a><a href="#" class="hover:text-zinc-900">Contact</a></nav>
      <p class="text-xs text-zinc-500">© 2026 Northdesk Learning</p>
    </div>
  </div>
</footer>`,
  },
  {
    id: "footer-minimal",
    category: "footers",
    name: "One line",
    note: "Landing pages and single-page sites.",
    html: `<footer class="bg-(--p-light)">
  <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-(--p-dark) sm:flex-row">
    <p>© 2026 Ledgerly Software</p>
    <nav class="flex gap-5"><a href="#" class="hover:underline">Privacy</a><a href="#" class="hover:underline">Terms</a><a href="#" class="hover:underline">Status</a></nav>
  </div>
</footer>`,
  },

  // -------------------------------------------------------------------------
  //  Buttons and badges
  // -------------------------------------------------------------------------
  {
    id: "buttons-set",
    category: "buttons",
    name: "Button set",
    note: "Main, secondary, quiet, danger, disabled, and two sizes.",
    html: `<div class="space-y-5 bg-white p-6">
  <div class="flex flex-wrap items-center gap-3">
    <button class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white active:translate-y-px">Main action</button>
    <button class="rounded-lg border border-(--p-dark) px-5 py-2.5 text-sm font-semibold text-(--p-dark) hover:bg-(--p-light)">Secondary</button>
    <button class="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Quiet</button>
    <button class="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
    <button disabled class="cursor-not-allowed rounded-lg bg-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-500">Disabled</button>
  </div>
  <div class="flex flex-wrap items-center gap-3">
    <button class="rounded-full bg-(--s) px-6 py-3 text-base font-semibold text-(--s-on) hover:bg-(--s-dark) hover:text-white">Large pill</button>
    <button class="rounded-md bg-(--t) px-3 py-1.5 text-xs font-semibold text-(--t-on) hover:bg-(--t-dark) hover:text-white">Small</button>
    <button class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"><span class="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>Saving</button>
  </div>
</div>`,
  },
  {
    id: "badges-set",
    category: "buttons",
    name: "Badges and tags",
    note: "Status, categories and counts.",
    html: `<div class="flex flex-wrap items-center gap-2 bg-white p-6 text-xs font-semibold">
  <span class="rounded-full bg-(--p-light) px-2.5 py-1 text-(--p-dark)">Primary</span>
  <span class="rounded-full bg-(--s-light) px-2.5 py-1 text-(--s-dark)">Secondary</span>
  <span class="rounded-full bg-(--t-light) px-2.5 py-1 text-(--t-dark)">Tertiary</span>
  <span class="rounded-full bg-(--p) px-2.5 py-1 text-(--p-on)">Solid</span>
  <span class="rounded-full border border-zinc-300 px-2.5 py-1 text-zinc-700">Outline</span>
  <span class="rounded-md bg-emerald-50 px-2 py-1 text-emerald-800">Paid</span>
  <span class="rounded-md bg-amber-50 px-2 py-1 text-amber-800">Pending</span>
  <span class="rounded-md bg-red-50 px-2 py-1 text-red-800">Overdue</span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">Inbox <span class="rounded-full bg-zinc-900 px-1.5 text-[0.625rem] text-white">12</span></span>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Alerts and empty states
  // -------------------------------------------------------------------------
  {
    id: "alerts-set",
    category: "feedback",
    name: "Alerts",
    note: "Success, information, warning and error, with a clear next step.",
    html: `<div class="grid gap-3 bg-white p-6 md:grid-cols-2">
  <div role="status" class="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4"><p class="text-sm font-semibold text-emerald-900">Payment received</p><p class="mt-1 text-sm text-emerald-800">₹15,500 for instalment 2. A receipt is on its way to your email.</p></div>
  <div role="status" class="rounded-xl border-l-4 border-(--p) bg-(--p-light) p-4"><p class="text-sm font-semibold text-(--p-dark)">Class moved to 11 am</p><p class="mt-1 text-sm text-zinc-700">Saturday only. The link stays the same.</p></div>
  <div role="alert" class="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4"><p class="text-sm font-semibold text-amber-900">Your trial ends in 3 days</p><p class="mt-1 text-sm text-amber-800">Pick a plan to keep your invoices. <a href="#" class="font-semibold underline">See plans</a></p></div>
  <div role="alert" class="rounded-xl border-l-4 border-red-500 bg-red-50 p-4"><p class="text-sm font-semibold text-red-900">Could not send the invoice</p><p class="mt-1 text-sm text-red-800">The customer's email bounced. Check the address and try again.</p></div>
</div>`,
  },
  {
    id: "empty-state",
    category: "feedback",
    name: "Empty state",
    note: "A list with nothing in it yet: say why, and how to fill it.",
    html: `<div class="bg-zinc-50 p-6">
  <div class="mx-auto max-w-md rounded-2xl border-2 border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
    <span class="mx-auto grid size-12 place-items-center rounded-xl bg-(--p-light) text-lg font-bold text-(--p-dark)">0</span>
    <h3 class="mt-4 font-semibold text-zinc-900">No invoices yet</h3>
    <p class="mt-1 text-sm text-zinc-600">Your first invoice takes about a minute. Customers and items are saved for next time.</p>
    <a href="#" class="mt-6 inline-block rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on) hover:bg-(--p-dark) hover:text-white">Create an invoice</a>
  </div>
</div>`,
  },
  {
    id: "toast",
    category: "feedback",
    name: "Toast notification",
    note: "A short message that confirms an action, bottom corner.",
    html: `<div class="relative h-48 bg-zinc-100">
  <div role="status" class="absolute right-4 bottom-4 flex w-80 max-w-[calc(100%-2rem)] items-start gap-3 rounded-xl bg-zinc-900 p-4 text-sm text-white shadow-lg">
    <span class="mt-0.5 size-2.5 shrink-0 rounded-full bg-(--s)"></span>
    <div class="flex-1"><p class="font-semibold">Link copied</p><p class="mt-0.5 text-white/70">Anyone with it can view this report.</p></div>
    <button class="text-white/60 hover:text-white" aria-label="Close">✕</button>
  </div>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Sketch diagrams
  // -------------------------------------------------------------------------
  {
    id: "sketch-flow",
    category: "sketch",
    name: "Three-step flow",
    note: "Any process: enquiry to delivery, data to dashboard.",
    html: `<div class="bg-white p-6">
  <div class="overflow-x-auto"><svg viewBox="0 0 640 220" class="mx-auto w-full max-w-3xl min-w-[32rem]" role="img" aria-label="Collect, clean, show">
    <defs><filter id="rough-flow"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" /><feDisplacementMap in="SourceGraphic" scale="3.5" /></filter></defs>
    <g filter="url(#rough-flow)" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive">
      <rect x="20" y="60" width="160" height="100" rx="16" class="fill-(--p-light) stroke-(--p-dark)" />
      <text x="100" y="105" text-anchor="middle" font-size="20" class="fill-(--p-dark)" stroke="none">Collect</text>
      <text x="100" y="132" text-anchor="middle" font-size="13" class="fill-zinc-600" stroke="none">forms, sheets, apps</text>
      <rect x="240" y="60" width="160" height="100" rx="16" class="fill-(--s-light) stroke-(--s-dark)" />
      <text x="320" y="105" text-anchor="middle" font-size="20" class="fill-(--s-dark)" stroke="none">Clean</text>
      <text x="320" y="132" text-anchor="middle" font-size="13" class="fill-zinc-600" stroke="none">fix, join, check</text>
      <rect x="460" y="60" width="160" height="100" rx="16" class="fill-(--t-light) stroke-(--t-dark)" />
      <text x="540" y="105" text-anchor="middle" font-size="20" class="fill-(--t-dark)" stroke="none">Show</text>
      <text x="540" y="132" text-anchor="middle" font-size="13" class="fill-zinc-600" stroke="none">one clear dashboard</text>
      <path d="M186 110 C 200 100, 220 120, 234 110" class="stroke-zinc-600" /><path d="M224 102 L 235 110 L 223 117" class="stroke-zinc-600" />
      <path d="M406 110 C 420 100, 440 120, 454 110" class="stroke-zinc-600" /><path d="M444 102 L 455 110 L 443 117" class="stroke-zinc-600" />
    </g>
  </svg></div>
</div>`,
  },
  {
    id: "sketch-before-after",
    category: "sketch",
    name: "Before and after",
    note: "Show the problem and the fix side by side.",
    html: `<div class="bg-zinc-50 p-6">
  <div class="overflow-x-auto"><svg viewBox="0 0 640 280" class="mx-auto w-full max-w-3xl min-w-[32rem]" role="img" aria-label="Before: scattered spreadsheets. After: one dashboard.">
    <defs><filter id="rough-ba"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
    <g filter="url(#rough-ba)" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive">
      <text x="150" y="36" text-anchor="middle" font-size="20" class="fill-zinc-700" stroke="none">Before</text>
      <rect x="40" y="70" width="90" height="70" rx="6" transform="rotate(-8 85 105)" class="fill-white stroke-zinc-500" />
      <rect x="150" y="60" width="90" height="70" rx="6" transform="rotate(6 195 95)" class="fill-white stroke-zinc-500" />
      <rect x="80" y="160" width="90" height="70" rx="6" transform="rotate(4 125 195)" class="fill-white stroke-zinc-500" />
      <rect x="190" y="160" width="80" height="60" rx="6" transform="rotate(-5 230 190)" class="fill-white stroke-zinc-500" />
      <text x="150" y="262" text-anchor="middle" font-size="14" class="fill-zinc-600" stroke="none">six sheets, three versions</text>
      <path d="M300 150 L 340 150" class="stroke-(--p-dark)" stroke-width="4" /><path d="M328 138 L 342 150 L 328 162" class="stroke-(--p-dark)" stroke-width="4" />
      <text x="490" y="36" text-anchor="middle" font-size="20" class="fill-(--p-dark)" stroke="none">After</text>
      <rect x="380" y="60" width="220" height="170" rx="14" class="fill-white stroke-(--p-dark)" />
      <rect x="400" y="80" width="80" height="40" rx="6" class="fill-(--p-light) stroke-(--p)" />
      <rect x="500" y="80" width="80" height="40" rx="6" class="fill-(--s-light) stroke-(--s)" />
      <path d="M405 205 L 440 175 L 470 188 L 510 150 L 545 162 L 580 135" class="stroke-(--t-dark)" stroke-width="3" />
      <text x="490" y="262" text-anchor="middle" font-size="14" class="fill-zinc-600" stroke="none">one dashboard, always current</text>
    </g>
  </svg></div>
</div>`,
  },
  {
    id: "sketch-hub",
    category: "sketch",
    name: "Hub and spokes",
    note: "One product connected to many tools or channels.",
    html: `<div class="bg-white p-6">
  <svg viewBox="0 0 520 340" class="mx-auto w-full max-w-2xl" role="img" aria-label="Your business in the middle, connected to website, WhatsApp, Google and Instagram">
    <defs><filter id="rough-hub"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="9" /><feDisplacementMap in="SourceGraphic" scale="3.5" /></filter></defs>
    <g filter="url(#rough-hub)" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive">
      <path d="M260 170 L 110 70 M260 170 L 410 70 M260 170 L 110 270 M260 170 L 410 270" class="stroke-zinc-400" stroke-dasharray="7 8" />
      <circle cx="260" cy="170" r="62" class="fill-(--p) stroke-(--p-dark)" />
      <text x="260" y="165" text-anchor="middle" font-size="17" class="fill-(--p-on)" stroke="none">Your</text>
      <text x="260" y="188" text-anchor="middle" font-size="17" class="fill-(--p-on)" stroke="none">business</text>
      <ellipse cx="110" cy="70" rx="72" ry="36" class="fill-(--s-light) stroke-(--s-dark)" /><text x="110" y="76" text-anchor="middle" font-size="16" class="fill-(--s-dark)" stroke="none">Website</text>
      <ellipse cx="410" cy="70" rx="72" ry="36" class="fill-(--s-light) stroke-(--s-dark)" /><text x="410" y="76" text-anchor="middle" font-size="16" class="fill-(--s-dark)" stroke="none">WhatsApp</text>
      <ellipse cx="110" cy="270" rx="72" ry="36" class="fill-(--t-light) stroke-(--t-dark)" /><text x="110" y="276" text-anchor="middle" font-size="16" class="fill-(--t-dark)" stroke="none">Google</text>
      <ellipse cx="410" cy="270" rx="72" ry="36" class="fill-(--t-light) stroke-(--t-dark)" /><text x="410" y="276" text-anchor="middle" font-size="16" class="fill-(--t-dark)" stroke="none">Instagram</text>
    </g>
  </svg>
</div>`,
  },
  {
    id: "sketch-timeline",
    category: "sketch",
    name: "Timeline",
    note: "A course plan, a project schedule or a company story.",
    html: `<div class="bg-(--p-light) p-6">
  <div class="overflow-x-auto"><svg viewBox="0 0 680 200" class="mx-auto w-full max-w-4xl min-w-[34rem]" role="img" aria-label="Week 1 Excel, week 4 SQL, week 8 Python, week 12 dashboards, week 16 interviews">
    <defs><filter id="rough-tl"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
    <g filter="url(#rough-tl)" fill="none" stroke-width="2.5" stroke-linecap="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive">
      <path d="M30 100 L 650 100" class="stroke-(--p-dark)" stroke-width="3" />
      <circle cx="70" cy="100" r="12" class="fill-white stroke-(--p-dark)" /><text x="70" y="70" text-anchor="middle" font-size="14" class="fill-zinc-600" stroke="none">week 1</text><text x="70" y="140" text-anchor="middle" font-size="17" class="fill-zinc-800" stroke="none">Excel</text>
      <circle cx="205" cy="100" r="12" class="fill-white stroke-(--p-dark)" /><text x="205" y="70" text-anchor="middle" font-size="14" class="fill-zinc-600" stroke="none">week 4</text><text x="205" y="140" text-anchor="middle" font-size="17" class="fill-zinc-800" stroke="none">SQL</text>
      <circle cx="340" cy="100" r="12" class="fill-(--s) stroke-(--s-dark)" /><text x="340" y="70" text-anchor="middle" font-size="14" class="fill-zinc-600" stroke="none">week 8</text><text x="340" y="140" text-anchor="middle" font-size="17" class="fill-zinc-800" stroke="none">Python</text>
      <circle cx="475" cy="100" r="12" class="fill-white stroke-(--p-dark)" /><text x="475" y="70" text-anchor="middle" font-size="14" class="fill-zinc-600" stroke="none">week 12</text><text x="475" y="140" text-anchor="middle" font-size="17" class="fill-zinc-800" stroke="none">Dashboards</text>
      <circle cx="610" cy="100" r="16" class="fill-(--t) stroke-(--t-dark)" /><text x="610" y="70" text-anchor="middle" font-size="14" class="fill-zinc-600" stroke="none">week 16</text><text x="610" y="146" text-anchor="middle" font-size="17" class="fill-zinc-800" stroke="none">Interviews</text>
    </g>
  </svg></div>
</div>`,
  },
];
