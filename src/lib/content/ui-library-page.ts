import type { UiComponent } from "@/lib/content/ui-library";

/**
 * Elements from our reference document, by where they sit on a page: the
 * ribbon, the named hero types, 3D-perspective backgrounds, carousels,
 * scroll effects, and the trust strips and sticky bars Indian sites use.
 *
 * Previews run without scripts, so the motion here is CSS only: keyframes
 * for loops, and scroll-driven animation (animation-timeline) for anything
 * tied to scrolling, inside its own scroll box. Chrome and Edge run it;
 * other browsers show the finished state.
 */
export const PAGE_COMPONENTS: UiComponent[] = [
  // -------------------------------------------------------------------------
  //  Ribbon
  // -------------------------------------------------------------------------
  {
    id: "ribbon-offer",
    category: "ribbon",
    name: "Offer with a code",
    note: "One offer, one code, a close button.",
    html: `<div class="flex items-center justify-center gap-3 bg-(--p-dark) px-10 py-2 text-center text-sm text-white relative">
  <p>Flat 10% off on prepaid orders. Use code <span class="rounded border border-dashed border-white/60 px-1.5 py-0.5 font-mono font-semibold">WELCOME10</span></p>
  <a href="#" class="hidden font-semibold underline underline-offset-2 sm:inline">Shop now</a>
  <button class="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" aria-label="Close">✕</button>
</div>`,
  },
  {
    id: "ribbon-ticker",
    category: "ribbon",
    name: "Scrolling offer ticker",
    note: "Several short offers that loop past. Pauses on hover.",
    html: `<style>
  @keyframes ribbon-tick { to { transform: translateX(-50%); } }
  .ribbon-track { animation: ribbon-tick 22s linear infinite; }
  .ribbon-track:hover { animation-play-state: paused; }
</style>
<div class="overflow-hidden bg-zinc-900 py-2 text-sm text-white">
  <div class="ribbon-track flex w-max gap-12 whitespace-nowrap">
    <span>Free delivery above ₹499</span><span class="text-(--t)">✦</span>
    <span>Cash on delivery available</span><span class="text-(--t)">✦</span>
    <span>7-day easy returns</span><span class="text-(--t)">✦</span>
    <span>No-cost EMI on cards</span><span class="text-(--t)">✦</span>
    <span>Free delivery above ₹499</span><span class="text-(--t)">✦</span>
    <span>Cash on delivery available</span><span class="text-(--t)">✦</span>
    <span>7-day easy returns</span><span class="text-(--t)">✦</span>
    <span>No-cost EMI on cards</span><span class="text-(--t)">✦</span>
  </div>
</div>`,
  },
  {
    id: "ribbon-utility",
    category: "ribbon",
    name: "Utility links strip",
    note: "Small links above the header: support, business, language. Like Samsung.",
    html: `<div class="border-b border-zinc-200 bg-zinc-50 text-[0.8125rem] text-zinc-600">
  <div class="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-5">
    <p class="hidden sm:block">Call us: <a href="#" class="font-semibold text-zinc-900">1800 123 4567</a> (toll free)</p>
    <nav class="flex items-center gap-5">
      <a href="#" class="hover:text-zinc-900">Track order</a>
      <a href="#" class="hover:text-zinc-900">Support</a>
      <a href="#" class="hover:text-zinc-900">For Business ↗</a>
      <a href="#" class="font-semibold text-(--p-dark)">EN | हिंदी</a>
    </nav>
  </div>
</div>`,
  },
  {
    id: "ribbon-region",
    category: "ribbon",
    name: "Region chooser",
    note: "Suggests the visitor's country or city. Like Apple.",
    html: `<div class="bg-zinc-100">
  <div class="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3 text-sm text-zinc-700">
    <p class="min-w-[16rem] flex-1">Choose your city to see prices and delivery times for your area.</p>
    <select class="rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-8 text-zinc-900"><option>Hyderabad</option><option>Bengaluru</option><option>Mumbai</option></select>
    <a href="#" class="rounded-lg bg-zinc-900 px-4 py-2 font-semibold text-white">Continue</a>
    <button class="px-2 text-lg text-zinc-500 hover:text-zinc-900" aria-label="Close">✕</button>
  </div>
</div>`,
  },
  {
    id: "ribbon-countdown",
    category: "ribbon",
    name: "Sale countdown",
    note: "For a festive sale. The numbers need a small script on the real site.",
    html: `<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-(--s) px-5 py-2 text-sm text-(--s-on)">
  <p class="font-semibold">Diwali Sale: up to 60% off</p>
  <p class="flex items-center gap-1 font-mono">Ends in
    <span class="rounded bg-black/20 px-1.5">02</span>:<span class="rounded bg-black/20 px-1.5">14</span>:<span class="rounded bg-black/20 px-1.5">37</span>
  </p>
  <a href="#" class="font-semibold underline underline-offset-2">Shop the sale</a>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Heroes: luxury / brand-focused
  // -------------------------------------------------------------------------
  {
    id: "hero-luxury-slideshow",
    category: "heroes",
    type: "luxury",
    name: "Full-bleed slideshow, centred logo",
    note: "Like LVMH: dark bar with the logo between split links, the next slide peeking at the edge. Swipe or scroll sideways.",
    html: `<section class="bg-zinc-950 text-white">
  <header class="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-4 text-[0.75rem] tracking-[0.15em] uppercase">
    <nav class="hidden justify-end gap-7 text-white/70 md:flex"><a href="#">Group</a><a href="#">Houses</a><a href="#">Finance</a></nav>
    <a href="#" class="col-start-2 font-serif text-3xl tracking-normal normal-case">MAISON</a>
    <nav class="hidden gap-7 text-white/70 md:flex"><a href="#">Talents</a><a href="#">Media</a><a href="#">Journal</a></nav>
  </header>
  <div class="flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none]">
    <figure class="relative w-[94%] shrink-0 snap-start">
      <img src="https://picsum.photos/seed/lux-garden/1600/900" alt="" class="aspect-[16/8] w-full object-cover" />
      <figcaption class="absolute bottom-8 left-8 max-w-md">
        <p class="text-[0.75rem] tracking-[0.2em] uppercase text-white/80">Spring collection</p>
        <p class="mt-2 font-serif text-4xl">The art of the garden</p>
      </figcaption>
    </figure>
    <figure class="relative w-[94%] shrink-0 snap-start">
      <img src="https://picsum.photos/seed/lux-atelier/1600/900" alt="" class="aspect-[16/8] w-full object-cover" />
      <figcaption class="absolute bottom-8 left-8 font-serif text-4xl">Inside the atelier</figcaption>
    </figure>
    <figure class="relative w-[94%] shrink-0 snap-start">
      <img src="https://picsum.photos/seed/lux-evening/1600/900" alt="" class="aspect-[16/8] w-full object-cover" />
      <figcaption class="absolute bottom-8 left-8 font-serif text-4xl">Evening wear</figcaption>
    </figure>
  </div>
  <footer class="flex flex-wrap items-center justify-between gap-4 px-6 py-3 text-[0.6875rem] tracking-[0.12em] uppercase text-white/60">
    <nav class="flex gap-6"><a href="#">Newsletter</a><a href="#">Careers</a><a href="#">Privacy</a></nav>
    <p>Language: EN</p>
  </footer>
</section>`,
  },
  {
    id: "hero-luxury-big-logo",
    category: "heroes",
    type: "luxury",
    name: "Huge logo that shrinks into the header",
    note: "Like Prada: the wordmark fills the screen, then a slim header appears as you scroll. Scroll inside the preview.",
    html: `<style>
  .lux-scroller { scroll-timeline: --lux y; }
  @keyframes lux-logo { to { transform: scale(.18) translateY(-240%); opacity: 0; } }
  @keyframes lux-bar { from { transform: translateY(-100%); } to { transform: none; } }
  .lux-logo { animation: lux-logo linear both; animation-timeline: --lux; animation-range: 0 260px; }
  .lux-bar { animation: lux-bar linear both; animation-timeline: --lux; animation-range: 160px 260px; }
</style>
<div class="lux-scroller relative h-[560px] overflow-y-auto bg-black">
  <header class="lux-bar sticky top-0 z-20 flex items-center justify-between bg-white px-6 py-3 text-[0.75rem] tracking-[0.15em] uppercase text-zinc-900">
    <nav class="flex gap-5"><a href="#">Women</a><a href="#">Men</a></nav>
    <span class="text-lg font-bold tracking-[0.3em]">ARDEN</span>
    <nav class="flex gap-5"><a href="#">Search</a><a href="#">Bag</a></nav>
  </header>
  <section class="relative -mt-[44px] h-[560px]">
    <img src="https://picsum.photos/seed/lux-model/1600/1000" alt="" class="absolute inset-0 size-full object-cover opacity-80" />
    <p class="lux-logo absolute inset-0 grid place-items-center text-[18vw] leading-none font-bold tracking-[0.12em] text-white">ARDEN</p>
  </section>
  <section class="grid gap-2 bg-white p-2 sm:grid-cols-2">
    <img src="https://picsum.photos/seed/lux-bag/800/1000" alt="" class="aspect-[4/5] w-full object-cover" />
    <img src="https://picsum.photos/seed/lux-shoe/800/1000" alt="" class="aspect-[4/5] w-full object-cover" />
  </section>
</div>`,
  },
  {
    id: "hero-luxury-diptych",
    category: "heroes",
    type: "luxury",
    name: "Two images with the brand between",
    note: "Two campaign photos side by side and one quiet line of text. Jewellery, couture.",
    html: `<section class="bg-(--s-light)">
  <div class="grid md:grid-cols-2">
    <img src="https://picsum.photos/seed/lux-left/900/1100" alt="" class="aspect-[4/5] w-full object-cover" />
    <img src="https://picsum.photos/seed/lux-right/900/1100" alt="" class="hidden aspect-[4/5] w-full object-cover md:block" />
  </div>
  <div class="px-6 py-10 text-center">
    <p class="text-[0.75rem] tracking-[0.3em] text-(--s-dark) uppercase">The bridal edit</p>
    <h1 class="mt-3 font-serif text-4xl text-zinc-900 md:text-5xl">Heirlooms, made to be worn</h1>
    <a href="#" class="mt-6 inline-block border-b border-zinc-900 pb-1 text-sm tracking-[0.15em] uppercase text-zinc-900">Discover</a>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Heroes: category-heavy e-commerce
  // -------------------------------------------------------------------------
  {
    id: "hero-category-wakefit",
    category: "heroes",
    type: "category",
    name: "Search, category row and banner grid",
    note: "Like Wakefit: search with a pincode, a row of category icons, one big sliding banner and two side banners, then shop by category.",
    html: `<section class="bg-zinc-50">
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
      <a href="#" class="text-xl font-bold text-(--p-dark)">restful</a>
      <label class="hidden flex-1 items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-500 md:flex">⌕ <input class="w-full outline-none" placeholder="Search mattresses, beds, sofas" /></label>
      <button class="hidden rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 lg:block">📍 500032</button>
      <nav class="ml-auto flex items-center gap-4 text-sm text-zinc-700"><a href="#">Account</a><a href="#">Wishlist</a><a href="#" class="font-semibold">Cart (2)</a></nav>
    </div>
    <nav class="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 pb-3 text-center text-[0.75rem] text-zinc-700 [scrollbar-width:none]">
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--p-light)"></span>Mattresses</a>
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--p-light)"></span>Beds</a>
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--p-light)"></span>Sofas</a>
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--p-light)"></span>Pillows</a>
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--p-light)"></span>Wardrobes</a>
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--p-light)"></span>Tables</a>
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--p-light)"></span>Decor</a>
      <a href="#" class="w-16 shrink-0"><span class="mx-auto mb-1 block size-12 rounded-xl bg-(--s-light)"></span><b class="text-(--s-dark)">Sale</b></a>
    </nav>
  </header>
  <div class="mx-auto grid max-w-6xl gap-3 px-5 py-4 md:grid-cols-[2fr_1fr]">
    <div class="flex snap-x snap-mandatory overflow-x-auto rounded-xl [scrollbar-width:none]">
      <a href="#" class="relative w-full shrink-0 snap-start">
        <img src="https://picsum.photos/seed/bed-banner/1200/600" alt="" class="aspect-[2/1] w-full object-cover" />
        <span class="absolute bottom-5 left-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900">Up to 55% off beds →</span>
      </a>
      <a href="#" class="relative w-full shrink-0 snap-start">
        <img src="https://picsum.photos/seed/sofa-banner/1200/600" alt="" class="aspect-[2/1] w-full object-cover" />
        <span class="absolute bottom-5 left-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900">New sofas →</span>
      </a>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
      <a href="#" class="flex flex-col justify-end rounded-xl bg-(--p) p-5 text-(--p-on)"><b class="text-lg">100-night trial</b><span class="text-sm opacity-90">Sleep on it, then decide</span></a>
      <a href="#" class="flex flex-col justify-end rounded-xl bg-(--t-light) p-5 text-zinc-900"><b class="text-lg">No-cost EMI</b><span class="text-sm text-zinc-600">From ₹1,099 a month</span></a>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-category-makro",
    category: "heroes",
    type: "category",
    name: "Bright top bar, icons with dropdowns, three banners",
    note: "Like Makro: location, search, log in and catalogues in one bar; categories with arrows; one large banner and two stacked.",
    html: `<section class="bg-zinc-100">
  <div class="bg-(--t)">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-2.5 text-sm text-(--t-on)">
      <a href="#" class="text-lg font-extrabold">bazaar»</a>
      <span class="hidden md:inline">📍 Kukatpally, Hyderabad</span>
      <label class="flex min-w-[12rem] flex-1 items-center rounded-lg bg-white px-3 py-1.5 text-zinc-500"><input class="w-full outline-none" placeholder="Search Bazaar" />⌕</label>
      <a href="#" class="rounded-lg bg-zinc-900 px-4 py-1.5 font-semibold text-white">Log in</a>
      <a href="#" class="hidden font-semibold lg:inline">View catalogues</a>
      <a href="#" class="font-semibold">🛒 Cart</a>
    </div>
  </div>
  <nav class="border-b border-zinc-200 bg-white">
    <div class="mx-auto flex max-w-6xl justify-between gap-4 overflow-x-auto px-5 py-3 text-center text-[0.75rem] text-zinc-800 [scrollbar-width:none]">
      <a href="#" class="shrink-0"><img src="https://picsum.photos/seed/cat-appl/80/80" alt="" class="mx-auto mb-1 size-11 rounded-lg object-cover" />Appliances ▾</a>
      <a href="#" class="shrink-0"><img src="https://picsum.photos/seed/cat-elec/80/80" alt="" class="mx-auto mb-1 size-11 rounded-lg object-cover" />Electronics ▾</a>
      <a href="#" class="shrink-0"><img src="https://picsum.photos/seed/cat-pantry/80/80" alt="" class="mx-auto mb-1 size-11 rounded-lg object-cover" />Pantry ▾</a>
      <a href="#" class="shrink-0"><img src="https://picsum.photos/seed/cat-home/80/80" alt="" class="mx-auto mb-1 size-11 rounded-lg object-cover" />Home ▾</a>
      <a href="#" class="shrink-0"><img src="https://picsum.photos/seed/cat-beauty/80/80" alt="" class="mx-auto mb-1 size-11 rounded-lg object-cover" />Beauty ▾</a>
      <a href="#" class="shrink-0"><img src="https://picsum.photos/seed/cat-baby/80/80" alt="" class="mx-auto mb-1 size-11 rounded-lg object-cover" />Baby ▾</a>
      <a href="#" class="shrink-0"><img src="https://picsum.photos/seed/cat-sport/80/80" alt="" class="mx-auto mb-1 size-11 rounded-lg object-cover" />Sports ▾</a>
    </div>
  </nav>
  <div class="mx-auto grid max-w-6xl gap-3 px-5 py-4 md:grid-cols-[2fr_1fr]">
    <a href="#" class="relative overflow-hidden rounded-xl">
      <img src="https://picsum.photos/seed/festive-big/1200/700" alt="" class="aspect-[16/10] w-full object-cover md:h-full" />
      <span class="absolute bottom-5 left-5 rounded-lg bg-(--t) px-6 py-3 text-lg font-bold text-(--t-on)">Shop now</span>
    </a>
    <div class="grid gap-3">
      <a href="#" class="relative overflow-hidden rounded-xl"><img src="https://picsum.photos/seed/promo-a/700/360" alt="" class="aspect-[2/1] w-full object-cover" /><span class="absolute right-3 bottom-3 rounded-md bg-white px-3 py-1.5 text-sm font-semibold">Shop now</span></a>
      <a href="#" class="relative overflow-hidden rounded-xl"><img src="https://picsum.photos/seed/promo-b/700/360" alt="" class="aspect-[2/1] w-full object-cover" /><span class="absolute bottom-3 left-3 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white">Shop now</span></a>
    </div>
  </div>
</section>`,
  },
  {
    id: "hero-category-alibaba",
    category: "heroes",
    type: "category",
    name: "Category sidebar, banner, sign-in card",
    note: "Like Alibaba: every category down the left, the main banner in the middle, a sign-in and request-a-quote card on the right. B2B and wholesale.",
    html: `<section class="bg-zinc-100 py-4">
  <div class="mx-auto grid max-w-6xl gap-3 px-5 md:grid-cols-[13rem_1fr] lg:grid-cols-[13rem_1fr_15rem]">
    <nav class="hidden rounded-xl bg-white p-3 text-sm text-zinc-700 md:block">
      <p class="mb-2 px-2 text-[0.75rem] font-semibold tracking-wide text-zinc-500 uppercase">Categories</p>
      <a href="#" class="flex justify-between rounded-md px-2 py-1.5 hover:bg-(--p-light)">Apparel <span>›</span></a>
      <a href="#" class="flex justify-between rounded-md px-2 py-1.5 hover:bg-(--p-light)">Electronics <span>›</span></a>
      <a href="#" class="flex justify-between rounded-md px-2 py-1.5 hover:bg-(--p-light)">Machinery <span>›</span></a>
      <a href="#" class="flex justify-between rounded-md px-2 py-1.5 hover:bg-(--p-light)">Home and garden <span>›</span></a>
      <a href="#" class="flex justify-between rounded-md px-2 py-1.5 hover:bg-(--p-light)">Packaging <span>›</span></a>
      <a href="#" class="flex justify-between rounded-md px-2 py-1.5 hover:bg-(--p-light)">Agriculture <span>›</span></a>
      <a href="#" class="flex justify-between rounded-md px-2 py-1.5 hover:bg-(--p-light)">Beauty <span>›</span></a>
    </nav>
    <a href="#" class="relative overflow-hidden rounded-xl">
      <img src="https://picsum.photos/seed/b2b-banner/1000/620" alt="" class="size-full min-h-64 object-cover" />
      <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/70 to-transparent"></div>
      <div class="absolute bottom-6 left-6 max-w-xs text-white">
        <p class="text-3xl font-bold leading-tight">Source direct from verified makers</p>
        <span class="mt-4 inline-block rounded-full bg-(--p) px-5 py-2 text-sm font-semibold text-(--p-on)">Start sourcing</span>
      </div>
    </a>
    <aside class="hidden flex-col gap-3 lg:flex">
      <div class="rounded-xl bg-white p-4 text-sm">
        <p class="font-semibold text-zinc-900">Welcome to TradeHub</p>
        <div class="mt-3 grid grid-cols-2 gap-2"><a href="#" class="rounded-full bg-(--p) py-2 text-center font-semibold text-(--p-on)">Join free</a><a href="#" class="rounded-full border border-zinc-300 py-2 text-center font-semibold">Sign in</a></div>
      </div>
      <div class="flex-1 rounded-xl bg-(--s-light) p-4 text-sm">
        <p class="font-semibold text-(--s-dark)">Request for quotation</p>
        <p class="mt-1 text-zinc-600">One request, quotes from many suppliers.</p>
        <a href="#" class="mt-3 inline-block font-semibold text-(--s-dark)">Post a request →</a>
      </div>
    </aside>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Heroes: quick-links bar
  // -------------------------------------------------------------------------
  {
    id: "hero-quick-links",
    category: "heroes",
    type: "quick-links",
    name: "Photo hero with an \"I am looking for…\" bar",
    note: "Like Prudential: headline over the photo, slide arrows, and a coloured bar of icon shortcuts overlapping the bottom edge.",
    html: `<section class="bg-white pb-10">
  <div class="relative">
    <img src="https://picsum.photos/seed/pru-hero/1600/760" alt="" class="h-[440px] w-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-l from-zinc-950/70 via-zinc-950/30 to-transparent"></div>
    <div class="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col justify-center gap-4 px-8 text-white">
      <h1 class="text-4xl leading-tight font-light md:text-5xl">Our <b class="font-semibold">sustainability</b> ambition</h1>
      <p class="text-lg text-white/90">A responsible future for the people and places we serve.</p>
      <div class="flex items-center gap-6">
        <a href="#" class="rounded-full bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on)">Our approach →</a>
        <span class="flex gap-2"><button class="grid size-10 place-items-center rounded-full border border-white">‹</button><button class="grid size-10 place-items-center rounded-full border border-white">›</button></span>
      </div>
    </div>
  </div>
  <div class="relative z-10 mx-auto -mt-16 flex max-w-5xl flex-wrap items-center gap-6 rounded-2xl bg-(--p) px-8 py-6 text-(--p-on)">
    <p class="w-36 text-2xl leading-tight">I am looking for…</p>
    <nav class="grid flex-1 grid-cols-3 gap-4 text-center text-sm sm:grid-cols-6">
      <a href="#"><span class="mb-1 block text-2xl">◎</span>Strategy</a>
      <a href="#"><span class="mb-1 block text-2xl">▥</span>Results</a>
      <a href="#"><span class="mb-1 block text-2xl">▤</span>Reports</a>
      <a href="#"><span class="mb-1 block text-2xl">▣</span>Jobs</a>
      <a href="#"><span class="mb-1 block text-2xl">▦</span>News</a>
      <a href="#"><span class="mb-1 block text-2xl">☺</span>Leadership</a>
    </nav>
  </div>
</section>`,
  },
  {
    id: "hero-task-finder",
    category: "heroes",
    type: "quick-links",
    name: "Hero with a task finder",
    note: "Indian banks and insurers: the common tasks as tabs and chips right on the first screen.",
    html: `<section class="bg-(--p-light)">
  <div class="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 md:grid-cols-[1.1fr_1fr]">
    <div>
      <h1 class="text-4xl font-semibold leading-tight text-zinc-900">Banking that fits in your pocket</h1>
      <p class="mt-3 text-zinc-600">Open an account in 10 minutes with Aadhaar and PAN.</p>
      <div class="mt-6 rounded-2xl bg-white p-4 shadow-sm">
        <div class="flex gap-1 rounded-lg bg-zinc-100 p-1 text-sm font-semibold">
          <span class="flex-1 rounded-md bg-white py-1.5 text-center shadow-sm">Personal</span>
          <span class="flex-1 py-1.5 text-center text-zinc-500">Business</span>
          <span class="flex-1 py-1.5 text-center text-zinc-500">NRI</span>
        </div>
        <div class="mt-4 flex flex-wrap gap-2 text-sm">
          <a href="#" class="rounded-full border border-zinc-300 px-3 py-1.5 hover:border-(--p) hover:text-(--p-dark)">Open savings account</a>
          <a href="#" class="rounded-full border border-zinc-300 px-3 py-1.5 hover:border-(--p) hover:text-(--p-dark)">Apply for a credit card</a>
          <a href="#" class="rounded-full border border-zinc-300 px-3 py-1.5 hover:border-(--p) hover:text-(--p-dark)">Home loan</a>
          <a href="#" class="rounded-full border border-zinc-300 px-3 py-1.5 hover:border-(--p) hover:text-(--p-dark)">Fixed deposit</a>
          <a href="#" class="rounded-full border border-zinc-300 px-3 py-1.5 hover:border-(--p) hover:text-(--p-dark)">Pay a bill</a>
        </div>
      </div>
    </div>
    <img src="https://picsum.photos/seed/bank-hero/900/700" alt="" class="aspect-[9/7] w-full rounded-2xl object-cover" />
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Heroes: product reveal
  // -------------------------------------------------------------------------
  {
    id: "hero-product-reveal",
    category: "heroes",
    type: "product-reveal",
    name: "Foldable phone that opens as you scroll",
    note: "Like Apple's iPhone launch page: title, two buttons, and the device unfolds and rises with the scroll. Scroll inside the preview.",
    html: `<style>
  .reveal-scroller { scroll-timeline: --reveal y; perspective: 1400px; }
  @keyframes reveal-left { from { transform: rotateY(-88deg); } to { transform: none; } }
  @keyframes reveal-lift { from { transform: translateY(60px) scale(.86); } to { transform: none; } }
  .reveal-device { animation: reveal-lift linear both; animation-timeline: --reveal; animation-range: 0 320px; }
  .reveal-half { transform-origin: right center; animation: reveal-left linear both; animation-timeline: --reveal; animation-range: 0 320px; }
</style>
<div class="reveal-scroller h-[620px] overflow-y-auto bg-zinc-100">
  <div class="sticky top-0 flex h-[620px] flex-col items-center overflow-hidden pt-12 text-center">
    <h1 class="text-5xl font-semibold tracking-tight text-zinc-900 md:text-6xl">Fold Duo</h1>
    <p class="mt-2 text-2xl text-zinc-900">Hello, hello.</p>
    <p class="mt-1 text-lg text-zinc-500">Available from 23 October</p>
    <div class="mt-5 flex gap-3">
      <a href="#" class="rounded-full bg-(--p) px-6 py-2.5 font-semibold text-(--p-on)">Learn more</a>
      <a href="#" class="rounded-full border border-(--p) px-6 py-2.5 font-semibold text-(--p-dark)">Pre-order</a>
    </div>
    <div class="reveal-device mt-10 flex w-[min(520px,86%)] rounded-[2.2rem] bg-zinc-900 p-2.5 shadow-2xl">
      <div class="reveal-half aspect-[3/4] flex-1 overflow-hidden rounded-l-[1.7rem] bg-cover bg-center" style="background-image:url(https://picsum.photos/seed/fold-left/500/660)"></div>
      <div class="aspect-[3/4] flex-1 overflow-hidden rounded-r-[1.7rem] bg-gradient-to-br from-(--p-light) to-(--s-light) p-4">
        <div class="grid grid-cols-3 gap-3">
          <span class="aspect-square rounded-xl bg-white/80"></span><span class="aspect-square rounded-xl bg-white/80"></span><span class="aspect-square rounded-xl bg-white/80"></span>
          <span class="aspect-square rounded-xl bg-white/80"></span><span class="aspect-square rounded-xl bg-white/80"></span><span class="aspect-square rounded-xl bg-white/80"></span>
        </div>
      </div>
    </div>
  </div>
  <div class="h-[360px]"></div>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Heroes: other
  // -------------------------------------------------------------------------
  {
    id: "hero-inset-giant-type",
    category: "heroes",
    type: "other",
    name: "Inset hero with oversized type",
    note: "Like Square: a rounded panel inset from the edges, one giant word, and a floating bar with a video thumbnail and two buttons.",
    html: `<section class="bg-white p-3">
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-(--p) from-45% to-zinc-950 to-60%">
    <p class="py-24 text-center text-[clamp(4rem,16vw,11rem)] leading-none font-black tracking-tight text-white">kiosk</p>
    <div class="absolute inset-x-4 bottom-4 mx-auto flex max-w-2xl flex-wrap items-center gap-3 rounded-full bg-zinc-950/90 p-2 pr-3 text-white">
      <img src="https://picsum.photos/seed/kiosk-thumb/120/80" alt="" class="h-12 w-20 rounded-full object-cover" />
      <p class="min-w-[10rem] flex-1 text-sm md:text-base">Smarter self-service for a faster rush</p>
      <a href="#" class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-(--p-dark)">Learn more</a>
      <a href="#" class="rounded-full bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on)">Contact sales</a>
    </div>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  3D-perspective backgrounds
  // -------------------------------------------------------------------------
  {
    id: "bg-stadium-vanishing-point",
    category: "backgrounds",
    name: "Stadium with a vanishing point",
    note: "Like the NFL: a low-angle field running to the horizon, with cards and a button layered over it. Sports, gaming, events.",
    html: `<section class="relative isolate overflow-hidden bg-zinc-950">
  <div class="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,#0b2545_0%,#1d6fa5_38%,#8ecae6_50%,#1f5130_51%,#0b2a17_100%)]"></div>
  <div class="absolute top-[44%] left-1/2 -z-20 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl"></div>
  <div class="absolute inset-x-0 bottom-0 -z-10 h-[60%] [perspective:500px]">
    <div class="absolute inset-x-[-50%] bottom-0 h-[220%] origin-bottom [transform:rotateX(70deg)] bg-[repeating-linear-gradient(90deg,transparent_0_118px,rgba(255,255,255,.55)_118px_122px),linear-gradient(to_top,var(--s-dark),transparent)]"></div>
  </div>
  <div class="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-950/60 via-transparent to-zinc-950/80"></div>
  <div class="mx-auto max-w-6xl px-5 py-20 text-white">
    <p class="text-sm font-semibold tracking-[0.2em] text-(--t) uppercase">Season 2026</p>
    <h2 class="mt-3 max-w-xl text-4xl font-bold md:text-5xl">Every match. Every angle.</h2>
    <div class="mt-10 grid gap-4 sm:grid-cols-3">
      <article class="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"><p class="text-sm text-white/70">Tonight, 7:30 PM</p><p class="mt-1 text-lg font-semibold">Hyderabad vs Chennai</p></article>
      <article class="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"><p class="text-sm text-white/70">Highlights</p><p class="mt-1 text-lg font-semibold">Top 10 plays of the week</p></article>
      <article class="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"><p class="text-sm text-white/70">Tickets</p><p class="mt-1 text-lg font-semibold">Final, from ₹799</p></article>
    </div>
    <a href="#" class="mt-8 inline-block rounded-full bg-(--p) px-6 py-3 font-semibold text-(--p-on)">Watch live</a>
  </div>
</section>`,
  },
  {
    id: "bg-3d-ribbon",
    category: "backgrounds",
    name: "Flowing 3D ribbon",
    note: "Like Samsung: a glossy ribbon sweeps from the corner through the section, with the products sitting on it.",
    html: `<section class="relative isolate overflow-hidden bg-zinc-50">
  <svg class="absolute inset-0 -z-10 size-full" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="rib-a" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="var(--p-dark)" /><stop offset=".55" stop-color="var(--p)" /><stop offset="1" stop-color="var(--p-light)" /></linearGradient>
      <linearGradient id="rib-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7" /><stop offset="1" stop-color="#fff" stop-opacity="0" /></linearGradient>
    </defs>
    <path d="M380 660 C 560 520, 600 420, 760 380 S 1080 300, 1240 80 L 1240 180 C 1100 360, 900 420, 800 460 S 620 600, 520 680 Z" fill="url(#rib-a)" />
    <path d="M380 660 C 560 520, 600 420, 760 380 S 1080 300, 1240 80 L 1240 110 C 1090 320, 880 390, 780 420 S 580 560, 470 680 Z" fill="url(#rib-b)" />
  </svg>
  <div class="mx-auto grid max-w-6xl items-center gap-8 px-5 py-20 md:grid-cols-2">
    <div>
      <h2 class="text-5xl font-bold tracking-tight text-zinc-900">Smart Week</h2>
      <p class="mt-3 text-xl text-zinc-700">Discover new ways to live smarter</p>
      <a href="#" class="mt-6 inline-block rounded-full border border-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-900">Learn more</a>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <img src="https://picsum.photos/seed/rib-tv/500/360" alt="" class="rounded-2xl shadow-xl" />
      <img src="https://picsum.photos/seed/rib-phone/500/360" alt="" class="mt-10 rounded-2xl shadow-xl" />
    </div>
  </div>
</section>`,
  },
  {
    id: "bg-perspective-grid",
    category: "backgrounds",
    name: "Glowing grid floor to the horizon",
    note: "A dark section with a perspective grid that slowly moves towards you. Technology, AI, automotive.",
    html: `<style>
  @keyframes grid-run { to { background-position: 0 60px, 0 0; } }
  .grid-floor { animation: grid-run 2.4s linear infinite; }
</style>
<section class="relative isolate overflow-hidden bg-zinc-950 text-white">
  <div class="absolute inset-x-0 bottom-0 -z-10 h-1/2 [perspective:320px]">
    <div class="grid-floor absolute inset-x-[-60%] bottom-0 h-[260%] origin-bottom [transform:rotateX(72deg)] bg-[linear-gradient(var(--p)_1.5px,transparent_1.5px),linear-gradient(90deg,var(--p)_1.5px,transparent_1.5px)] bg-[size:60px_60px] opacity-60"></div>
  </div>
  <div class="absolute inset-x-0 top-1/2 -z-10 h-40 -translate-y-1/2 bg-(--p) opacity-30 blur-3xl"></div>
  <div class="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950"></div>
  <div class="mx-auto max-w-3xl px-5 py-24 text-center">
    <h2 class="text-4xl font-bold md:text-5xl">Built for what comes next</h2>
    <p class="mt-4 text-lg text-white/70">Edge AI that runs on the device, not in the cloud.</p>
    <a href="#" class="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-zinc-900">See the platform</a>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Trust and offers
  // -------------------------------------------------------------------------
  {
    id: "trust-badges",
    category: "trust",
    name: "Trust badges strip",
    note: "Under the hero or above the footer: the four promises that close the sale.",
    html: `<section class="border-y border-zinc-200 bg-white">
  <ul class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-6 text-sm md:grid-cols-4">
    <li class="flex items-center gap-3"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-lg text-(--p-dark)">₹</span><span><b class="block text-zinc-900">Cash on delivery</b><span class="text-zinc-500">Pay when it arrives</span></span></li>
    <li class="flex items-center gap-3"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-lg text-(--p-dark)">⇄</span><span><b class="block text-zinc-900">7-day returns</b><span class="text-zinc-500">No questions asked</span></span></li>
    <li class="flex items-center gap-3"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-lg text-(--p-dark)">⛟</span><span><b class="block text-zinc-900">Free delivery</b><span class="text-zinc-500">On orders above ₹499</span></span></li>
    <li class="flex items-center gap-3"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-lg text-(--p-dark)">✓</span><span><b class="block text-zinc-900">Secure payments</b><span class="text-zinc-500">UPI, cards, net banking</span></span></li>
  </ul>
</section>`,
  },
  {
    id: "trust-bank-offers",
    category: "trust",
    name: "Bank and payment offers",
    note: "The offer chips Indian shoppers scan on a product page.",
    html: `<section class="bg-white px-5 py-6">
  <h3 class="text-base font-semibold text-zinc-900">Offers for you</h3>
  <div class="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
    <article class="w-60 shrink-0 rounded-xl border border-zinc-200 p-4"><p class="text-sm font-semibold text-(--p-dark)">10% instant discount</p><p class="mt-1 text-sm text-zinc-600">On credit cards, up to ₹1,500</p><a href="#" class="mt-2 inline-block text-[0.8125rem] font-semibold text-zinc-900">2 offers ›</a></article>
    <article class="w-60 shrink-0 rounded-xl border border-zinc-200 p-4"><p class="text-sm font-semibold text-(--p-dark)">No-cost EMI</p><p class="mt-1 text-sm text-zinc-600">3 and 6 months on select cards</p><a href="#" class="mt-2 inline-block text-[0.8125rem] font-semibold text-zinc-900">See plans ›</a></article>
    <article class="w-60 shrink-0 rounded-xl border border-zinc-200 p-4"><p class="text-sm font-semibold text-(--p-dark)">₹50 cashback on UPI</p><p class="mt-1 text-sm text-zinc-600">On orders above ₹999</p><a href="#" class="mt-2 inline-block text-[0.8125rem] font-semibold text-zinc-900">Details ›</a></article>
    <article class="w-60 shrink-0 rounded-xl border border-zinc-200 p-4"><p class="text-sm font-semibold text-(--p-dark)">Exchange offer</p><p class="mt-1 text-sm text-zinc-600">Up to ₹8,000 off your old one</p><a href="#" class="mt-2 inline-block text-[0.8125rem] font-semibold text-zinc-900">Check value ›</a></article>
  </div>
</section>`,
  },
  {
    id: "trust-category-circles",
    category: "trust",
    name: "Shop by category circles",
    note: "Round photo tiles in one swipeable row, as on Nykaa and Myntra.",
    html: `<section class="bg-white px-5 py-8">
  <h3 class="text-xl font-semibold text-zinc-900">Shop by category</h3>
  <div class="mt-4 flex gap-6 overflow-x-auto pb-1 text-center text-sm text-zinc-800 [scrollbar-width:none]">
    <a href="#" class="w-24 shrink-0"><img src="https://picsum.photos/seed/circ-1/200/200" alt="" class="mb-2 size-24 rounded-full object-cover ring-2 ring-(--p) ring-offset-2" />Kurtas</a>
    <a href="#" class="w-24 shrink-0"><img src="https://picsum.photos/seed/circ-2/200/200" alt="" class="mb-2 size-24 rounded-full object-cover" />Sarees</a>
    <a href="#" class="w-24 shrink-0"><img src="https://picsum.photos/seed/circ-3/200/200" alt="" class="mb-2 size-24 rounded-full object-cover" />Footwear</a>
    <a href="#" class="w-24 shrink-0"><img src="https://picsum.photos/seed/circ-4/200/200" alt="" class="mb-2 size-24 rounded-full object-cover" />Jewellery</a>
    <a href="#" class="w-24 shrink-0"><img src="https://picsum.photos/seed/circ-5/200/200" alt="" class="mb-2 size-24 rounded-full object-cover" />Bags</a>
    <a href="#" class="w-24 shrink-0"><img src="https://picsum.photos/seed/circ-6/200/200" alt="" class="mb-2 size-24 rounded-full object-cover" />Watches</a>
    <a href="#" class="w-24 shrink-0"><img src="https://picsum.photos/seed/circ-7/200/200" alt="" class="mb-2 size-24 rounded-full object-cover" />Beauty</a>
  </div>
</section>`,
  },
  {
    id: "trust-pincode",
    category: "trust",
    name: "Delivery by pincode",
    note: "Beside the Buy button: check the pincode, see the date, COD and returns.",
    html: `<div class="max-w-sm bg-white p-5">
  <p class="text-sm font-semibold text-zinc-900">Delivery</p>
  <div class="mt-2 flex rounded-lg border border-zinc-300">
    <input class="min-w-0 flex-1 rounded-l-lg px-3 py-2 text-sm outline-none" value="500032" />
    <button class="px-4 text-sm font-semibold text-(--p-dark)">Check</button>
  </div>
  <ul class="mt-3 space-y-1.5 text-sm text-zinc-700">
    <li>⛟ Delivery by <b>Fri, 24 Oct</b>, free</li>
    <li>₹ Cash on delivery available</li>
    <li>⇄ 7-day return and exchange</li>
  </ul>
</div>`,
  },
  {
    id: "trust-reviews-press",
    category: "trust",
    name: "Google rating and \"as featured in\"",
    note: "Star rating with review count, then the press names. Clinics, colleges, D2C brands.",
    html: `<section class="bg-(--p-light) px-5 py-8">
  <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-6">
    <div class="flex items-center gap-3">
      <span class="text-4xl font-bold text-zinc-900">4.8</span>
      <span><span class="block text-lg tracking-wide text-(--t)">★★★★★</span><span class="text-sm text-zinc-600">2,340 Google reviews</span></span>
    </div>
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 text-zinc-500">
      <span class="text-[0.75rem] font-semibold tracking-wide uppercase">As featured in</span>
      <span class="font-serif text-lg font-bold">The Daily</span>
      <span class="text-lg font-black tracking-tight">BIZTODAY</span>
      <span class="font-serif text-lg italic">Mint Post</span>
      <span class="text-lg font-semibold">YourStory</span>
    </div>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Carousels and marquees
  // -------------------------------------------------------------------------
  {
    id: "carousel-split-articles",
    category: "carousels",
    name: "Description left, articles slide right",
    note: "Like NVIDIA: heading and a paragraph on the left, arrows top right, article cards running off the right edge.",
    html: `<section class="overflow-hidden bg-white py-12">
  <div class="mx-auto flex max-w-6xl items-start justify-between gap-4 pl-5">
    <h2 class="text-4xl font-bold tracking-tight text-zinc-900">Design and Simulation</h2>
    <div class="flex gap-2 pr-5"><button class="grid size-10 place-items-center rounded bg-(--p) text-(--p-on)">‹</button><button class="grid size-10 place-items-center rounded bg-(--p) text-(--p-on)">›</button></div>
  </div>
  <div class="mx-auto mt-6 grid max-w-6xl gap-8 pl-5 md:grid-cols-[minmax(0,22rem)_1fr]">
    <div>
      <p class="text-lg leading-relaxed text-zinc-700">Accelerated computing and AI models let makers build physically accurate simulations and digital twins, so teams can test before they build.</p>
      <a href="#" class="mt-5 inline-block text-sm font-semibold text-zinc-900"><span class="text-(--p)">⌄</span> Quick links</a>
    </div>
    <div class="flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:none]">
      <article class="w-80 shrink-0 snap-start overflow-hidden rounded-lg border border-zinc-200 shadow-sm"><img src="https://picsum.photos/seed/nv-car/640/360" alt="" class="aspect-video w-full object-cover" /><div class="p-5"><p class="text-sm font-semibold text-zinc-700">Simulation | Session</p><h3 class="mt-3 text-lg font-semibold text-zinc-900">Physical AI sessions at the Berlin summit</h3><p class="mt-3 text-sm text-zinc-600">How robotics and autonomous vehicles are changing factories.</p></div></article>
      <article class="w-80 shrink-0 snap-start overflow-hidden rounded-lg border border-zinc-200 shadow-sm"><img src="https://picsum.photos/seed/nv-robot/640/360" alt="" class="aspect-video w-full object-cover" /><div class="p-5"><p class="text-sm font-semibold text-zinc-700">Manufacturing | Session</p><h3 class="mt-3 text-lg font-semibold text-zinc-900">Industrial AI and digital twins</h3><p class="mt-3 text-sm text-zinc-600">The future of physical production.</p></div></article>
      <article class="w-80 shrink-0 snap-start overflow-hidden rounded-lg border border-zinc-200 shadow-sm"><img src="https://picsum.photos/seed/nv-city/640/360" alt="" class="aspect-video w-full object-cover" /><div class="p-5"><p class="text-sm font-semibold text-zinc-700">Cities | Blog</p><h3 class="mt-3 text-lg font-semibold text-zinc-900">Simulating a whole city's traffic</h3><p class="mt-3 text-sm text-zinc-600">One model, every junction.</p></div></article>
    </div>
  </div>
</section>`,
  },
  {
    id: "carousel-scroll-linked",
    category: "carousels",
    name: "Horizontal cards driven by vertical scroll",
    note: "Like L'Oréal: scroll down and the cards slide sideways; the card in front is in full colour, the rest faded. Scroll inside the preview.",
    html: `<style>
  .hs-scroller { scroll-timeline: --hs y; }
  @keyframes hs-slide { to { transform: translateX(calc(-100% + 100vw - 3rem)); } }
  @keyframes hs-focus { 0%, 100% { opacity: .35; filter: grayscale(.8); } 50% { opacity: 1; filter: none; } }
  .hs-track { animation: hs-slide linear both; animation-timeline: --hs; }
  .hs-card { animation: hs-focus linear both; animation-timeline: --hs; }
</style>
<div class="hs-scroller h-[520px] overflow-y-auto bg-zinc-950">
  <div class="h-[1500px]">
    <div class="sticky top-0 flex h-[520px] flex-col justify-center gap-6 overflow-hidden px-6">
      <h2 class="text-3xl font-semibold text-white">Stories of beauty</h2>
      <div class="hs-track flex w-max gap-5">
        <article class="hs-card w-72" style="animation-range: 0% 40%"><img src="https://picsum.photos/seed/hs-1/600/760" alt="" class="aspect-[4/5] w-full rounded-xl object-cover" /><p class="mt-3 font-semibold text-white">Science for skin</p></article>
        <article class="hs-card w-72" style="animation-range: 15% 55%"><img src="https://picsum.photos/seed/hs-2/600/760" alt="" class="aspect-[4/5] w-full rounded-xl object-cover" /><p class="mt-3 font-semibold text-white">Women in research</p></article>
        <article class="hs-card w-72" style="animation-range: 30% 70%"><img src="https://picsum.photos/seed/hs-3/600/760" alt="" class="aspect-[4/5] w-full rounded-xl object-cover" /><p class="mt-3 font-semibold text-white">Greener packaging</p></article>
        <article class="hs-card w-72" style="animation-range: 45% 85%"><img src="https://picsum.photos/seed/hs-4/600/760" alt="" class="aspect-[4/5] w-full rounded-xl object-cover" /><p class="mt-3 font-semibold text-white">Inside the lab</p></article>
        <article class="hs-card w-72" style="animation-range: 60% 100%"><img src="https://picsum.photos/seed/hs-5/600/760" alt="" class="aspect-[4/5] w-full rounded-xl object-cover" /><p class="mt-3 font-semibold text-white">Our next decade</p></article>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: "marquee-bidirectional",
    category: "carousels",
    name: "Bidirectional brand marquee",
    note: "Like Coca-Cola and PepsiCo: rows of brand logos scrolling in opposite directions. Pauses on hover.",
    html: `<style>
  @keyframes mq-left { to { transform: translateX(-50%); } }
  @keyframes mq-right { from { transform: translateX(-50%); } to { transform: none; } }
  .mq-row { display: flex; width: max-content; gap: 1rem; }
  .mq-l { animation: mq-left 28s linear infinite; }
  .mq-r { animation: mq-right 28s linear infinite; }
  .mq:hover .mq-row { animation-play-state: paused; }
</style>
<section class="mq overflow-hidden bg-white py-12">
  <h2 class="mb-8 text-center text-3xl font-bold text-zinc-900">Our brands</h2>
  <div class="space-y-4">
    <div class="mq-row mq-l">
      <span class="rounded-2xl bg-(--p-light) px-10 py-6 text-2xl font-black text-(--p-dark)">FIZZO</span><span class="rounded-2xl bg-zinc-100 px-10 py-6 font-serif text-2xl italic">Aqua Pure</span><span class="rounded-2xl bg-(--s-light) px-10 py-6 text-2xl font-bold text-(--s-dark)">Zest</span><span class="rounded-2xl bg-zinc-100 px-10 py-6 text-2xl font-black tracking-widest">MAAZA</span><span class="rounded-2xl bg-(--t-light) px-10 py-6 text-2xl font-bold">Chai Co.</span>
      <span class="rounded-2xl bg-(--p-light) px-10 py-6 text-2xl font-black text-(--p-dark)">FIZZO</span><span class="rounded-2xl bg-zinc-100 px-10 py-6 font-serif text-2xl italic">Aqua Pure</span><span class="rounded-2xl bg-(--s-light) px-10 py-6 text-2xl font-bold text-(--s-dark)">Zest</span><span class="rounded-2xl bg-zinc-100 px-10 py-6 text-2xl font-black tracking-widest">MAAZA</span><span class="rounded-2xl bg-(--t-light) px-10 py-6 text-2xl font-bold">Chai Co.</span>
    </div>
    <div class="mq-row mq-r">
      <span class="rounded-2xl bg-zinc-100 px-10 py-6 text-2xl font-bold">Spark</span><span class="rounded-2xl bg-(--t-light) px-10 py-6 font-serif text-2xl">Nimbu</span><span class="rounded-2xl bg-(--p-light) px-10 py-6 text-2xl font-black text-(--p-dark)">KOLA</span><span class="rounded-2xl bg-zinc-100 px-10 py-6 text-2xl font-semibold italic">Mango Mist</span><span class="rounded-2xl bg-(--s-light) px-10 py-6 text-2xl font-black text-(--s-dark)">VIVA</span>
      <span class="rounded-2xl bg-zinc-100 px-10 py-6 text-2xl font-bold">Spark</span><span class="rounded-2xl bg-(--t-light) px-10 py-6 font-serif text-2xl">Nimbu</span><span class="rounded-2xl bg-(--p-light) px-10 py-6 text-2xl font-black text-(--p-dark)">KOLA</span><span class="rounded-2xl bg-zinc-100 px-10 py-6 text-2xl font-semibold italic">Mango Mist</span><span class="rounded-2xl bg-(--s-light) px-10 py-6 text-2xl font-black text-(--s-dark)">VIVA</span>
    </div>
  </div>
</section>`,
  },

  // -------------------------------------------------------------------------
  //  Scroll and motion effects
  // -------------------------------------------------------------------------
  {
    id: "motion-zoom-reveal",
    category: "motion",
    name: "Scroll-driven zoom reveal",
    note: "Like Tencent: a small rounded card grows to full width as you scroll down and shrinks back as you scroll up. Scroll inside the preview.",
    html: `<style>
  .zr-scroller { scroll-timeline: --zr y; }
  @keyframes zr-grow { from { width: 46%; border-radius: 28px; } to { width: 100%; border-radius: 0; } }
  @keyframes zr-text { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  .zr-card { animation: zr-grow linear both; animation-timeline: --zr; animation-range: 0 360px; }
  .zr-text { animation: zr-text linear both; animation-timeline: --zr; animation-range: 200px 380px; }
</style>
<div class="zr-scroller h-[540px] overflow-y-auto bg-white">
  <div class="h-[1100px]">
    <div class="sticky top-0 flex h-[540px] flex-col items-center justify-center">
      <h2 class="mb-6 text-3xl font-semibold text-zinc-900">Connecting a billion people</h2>
      <div class="zr-card relative h-[360px] overflow-hidden">
        <img src="https://picsum.photos/seed/zoom-city/1600/800" alt="" class="absolute inset-0 size-full object-cover" />
        <div class="absolute inset-0 bg-zinc-950/40"></div>
        <div class="zr-text absolute bottom-8 left-8 max-w-md text-white">
          <p class="text-2xl font-semibold">Value for users, tech for good</p>
          <a href="#" class="mt-3 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900">Learn more</a>
        </div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: "motion-sticky-stack",
    category: "motion",
    name: "Cards that stack as you scroll",
    note: "Each card sticks under the last. Steps, services, case studies. Scroll inside the preview.",
    html: `<div class="h-[520px] overflow-y-auto bg-zinc-100 px-5">
  <div class="mx-auto max-w-2xl space-y-6 py-8 pb-40">
    <article class="sticky top-6 rounded-3xl bg-(--p) p-8 text-(--p-on) shadow-lg"><p class="text-sm opacity-80">Step 1</p><h3 class="mt-2 text-2xl font-semibold">Free site visit</h3><p class="mt-2 opacity-90">We measure and listen.</p><div class="h-24"></div></article>
    <article class="sticky top-10 rounded-3xl bg-(--s) p-8 text-(--s-on) shadow-lg"><p class="text-sm opacity-80">Step 2</p><h3 class="mt-2 text-2xl font-semibold">3D design</h3><p class="mt-2 opacity-90">See it before you pay.</p><div class="h-24"></div></article>
    <article class="sticky top-14 rounded-3xl bg-zinc-900 p-8 text-white shadow-lg"><p class="text-sm opacity-80">Step 3</p><h3 class="mt-2 text-2xl font-semibold">Built in 45 days</h3><p class="mt-2 opacity-90">By our own team.</p><div class="h-24"></div></article>
    <article class="sticky top-18 rounded-3xl bg-white p-8 text-zinc-900 shadow-lg"><p class="text-sm text-zinc-500">Step 4</p><h3 class="mt-2 text-2xl font-semibold">10-year warranty</h3><p class="mt-2 text-zinc-600">On every cabinet.</p><div class="h-24"></div></article>
  </div>
</div>`,
  },
  {
    id: "motion-text-reveal",
    category: "motion",
    name: "Words light up as you scroll",
    note: "A statement in grey that fills in word by word. Scroll inside the preview.",
    html: `<style>
  .tr-scroller { scroll-timeline: --tr y; }
  @keyframes tr-on { to { color: #18181b; } }
  .tr-word { color: #d4d4d8; animation: tr-on linear both; animation-timeline: --tr; }
</style>
<div class="tr-scroller h-[420px] overflow-y-auto bg-white">
  <div class="h-[1000px]">
    <p class="sticky top-0 flex h-[420px] max-w-3xl flex-wrap content-center gap-x-3 px-8 text-4xl leading-tight font-semibold">
      <span class="tr-word" style="animation-range: 0px 60px">We</span><span class="tr-word" style="animation-range: 40px 100px">build</span><span class="tr-word" style="animation-range: 80px 140px">websites</span><span class="tr-word" style="animation-range: 120px 180px">that</span><span class="tr-word" style="animation-range: 160px 220px">people</span><span class="tr-word" style="animation-range: 200px 260px">trust,</span><span class="tr-word" style="animation-range: 240px 300px">and</span><span class="tr-word" style="animation-range: 280px 340px">businesses</span><span class="tr-word text-(--p)" style="animation-range: 320px 380px">grow</span><span class="tr-word" style="animation-range: 360px 420px">with.</span>
    </p>
  </div>
</div>`,
  },
  {
    id: "motion-light-sweep",
    category: "motion",
    name: "Light sweep across a heading",
    note: "A glowing light streak that passes over text or a card every few seconds. Premium launches, offers.",
    html: `<style>
  @keyframes sweep { from { background-position: 150% 0; } to { background-position: -50% 0; } }
  .sweep { background: linear-gradient(110deg, rgba(255,255,255,.7) 42%, var(--t-light) 50%, rgba(255,255,255,.7) 58%) 0 0 / 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: sweep 3.2s ease-in-out infinite; }
</style>
<section class="grid place-items-center bg-zinc-950 px-6 py-20">
  <h2 class="sweep text-center text-5xl font-bold md:text-6xl">The Gold Collection</h2>
</section>`,
  },
  {
    id: "motion-line-art-logo",
    category: "motion",
    name: "Line-art logo that draws itself",
    note: "SVG stroke animation, looping. Use as a preloader while the site loads, or beside the logo.",
    html: `<style>
  @keyframes draw { 0% { stroke-dashoffset: 600; } 45%, 55% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -600; } }
  .draw path { stroke-dasharray: 600; animation: draw 3.6s ease-in-out infinite; }
  .draw path:nth-child(2) { animation-delay: .25s; }
</style>
<div class="grid place-items-center bg-white py-16">
  <svg class="draw size-40" viewBox="0 0 200 200" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-label="Loading">
    <path d="M40 150 C 40 60, 160 60, 160 150" stroke="var(--p)" />
    <path d="M70 150 C 70 95, 130 95, 130 150 M100 40 L100 150" stroke="var(--s)" />
  </svg>
  <p class="mt-4 text-sm tracking-[0.2em] text-zinc-500 uppercase">Loading</p>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Floating and sticky bars
  // -------------------------------------------------------------------------
  {
    id: "sticky-whatsapp-call",
    category: "sticky",
    name: "WhatsApp and call buttons",
    note: "Fixed bottom right on every page. The most-used contact on Indian sites.",
    html: `<div class="relative h-56 bg-zinc-100">
  <div class="absolute right-5 bottom-5 flex flex-col items-end gap-3">
    <a href="#" class="flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-sm font-semibold text-zinc-900 shadow-lg"><span class="grid size-9 place-items-center rounded-full bg-(--p) text-(--p-on)">✆</span>Call us</a>
    <a href="#" class="grid size-14 place-items-center rounded-full bg-[#25d366] text-2xl text-white shadow-lg" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" class="size-7" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.2.5.2.5.4.1.1.1.7-.2 1.3Z"/></svg>
    </a>
  </div>
</div>`,
  },
  {
    id: "sticky-mobile-bar",
    category: "sticky",
    name: "Bottom action bar on phones",
    note: "Call, WhatsApp and Enquire, always in thumb reach. Clinics, coaching, real estate.",
    html: `<div class="relative mx-auto h-64 max-w-sm overflow-hidden border border-zinc-200 bg-zinc-50">
  <p class="p-5 text-sm text-zinc-500">Page content…</p>
  <nav class="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-zinc-200 bg-white text-center text-[0.75rem] font-semibold">
    <a href="#" class="py-2.5 text-zinc-700"><span class="block text-lg">✆</span>Call</a>
    <a href="#" class="py-2.5 text-[#128c4a]"><span class="block text-lg">◉</span>WhatsApp</a>
    <a href="#" class="bg-(--p) py-2.5 text-(--p-on)"><span class="block text-lg">✉</span>Enquire</a>
  </nav>
</div>`,
  },

  // -------------------------------------------------------------------------
  //  Footer
  // -------------------------------------------------------------------------
  {
    id: "footer-india-company",
    category: "footers",
    name: "With company details for India",
    note: "Link columns plus registered office, CIN, GSTIN and the grievance officer that Indian e-commerce rules ask for.",
    html: `<footer class="bg-zinc-950 text-sm text-zinc-400">
  <div class="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
    <div>
      <p class="text-lg font-bold text-white">restful</p>
      <p class="mt-3 max-w-xs">Mattresses and furniture made in India, delivered to 18,000 pincodes.</p>
      <div class="mt-4 flex gap-2 text-white"><a href="#" class="grid size-9 place-items-center rounded-full bg-white/10">f</a><a href="#" class="grid size-9 place-items-center rounded-full bg-white/10">◎</a><a href="#" class="grid size-9 place-items-center rounded-full bg-white/10">▶</a><a href="#" class="grid size-9 place-items-center rounded-full bg-white/10">in</a></div>
    </div>
    <nav class="space-y-2"><p class="font-semibold text-white">Shop</p><a href="#" class="block hover:text-white">Mattresses</a><a href="#" class="block hover:text-white">Beds</a><a href="#" class="block hover:text-white">Sofas</a><a href="#" class="block hover:text-white">Offers</a></nav>
    <nav class="space-y-2"><p class="font-semibold text-white">Help</p><a href="#" class="block hover:text-white">Track order</a><a href="#" class="block hover:text-white">Returns and refunds</a><a href="#" class="block hover:text-white">Warranty</a><a href="#" class="block hover:text-white">Contact us</a></nav>
    <nav class="space-y-2"><p class="font-semibold text-white">Company</p><a href="#" class="block hover:text-white">About</a><a href="#" class="block hover:text-white">Careers</a><a href="#" class="block hover:text-white">Stores</a><a href="#" class="block hover:text-white">Bulk orders</a></nav>
  </div>
  <div class="border-t border-white/10">
    <div class="mx-auto grid max-w-6xl gap-2 px-5 py-6 text-[0.75rem] leading-relaxed md:grid-cols-2">
      <p><b class="text-zinc-300">Registered office:</b> Restful Home Pvt. Ltd., Plot 12, Madhapur, Hyderabad, Telangana 500081</p>
      <p><b class="text-zinc-300">CIN:</b> U36100TG2019PTC000000 · <b class="text-zinc-300">GSTIN:</b> 36AAAAA0000A1Z5</p>
      <p><b class="text-zinc-300">Grievance officer:</b> A. Rao, grievance@restful.in, 1800 123 4567</p>
      <p class="md:text-right">© 2026 Restful · Privacy · Terms · Shipping policy</p>
    </div>
  </div>
</footer>`,
  },
];
