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
    note: "Like Wakefit: offer ribbon, search header with pincode and cart, category links, a full-width sliding sale banner, sale countdown with bank offers, why-us strip and a shop-by-categories grid.",
    html: `<style>
  @keyframes wf-slide { 0%,28% { transform: translateX(0); } 33%,61% { transform: translateX(-100%); } 66%,95% { transform: translateX(-200%); } 100% { transform: translateX(0); } }
  @keyframes wf-dot { 0%,28% { width: 1.5rem; opacity: 1; } 33%,100% { width: .5rem; opacity: .5; } }
  @keyframes wf-note { 0%,45% { transform: translateY(0); } 50%,95% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
  .wf-track { animation: wf-slide 15s infinite; }
  .wf-dot { width: .5rem; animation: wf-dot 15s infinite; }
  .wf-dot:nth-child(2) { animation-delay: -10s; }
  .wf-dot:nth-child(3) { animation-delay: -5s; }
  .wf-notes { animation: wf-note 8s infinite; }
  @media (prefers-reduced-motion: reduce) { .wf-track, .wf-dot, .wf-notes { animation: none; } }
</style>
<section class="bg-white text-zinc-900">
  <div class="bg-(--p-dark) text-(--p-on)">
    <div class="mx-auto h-9 max-w-7xl overflow-hidden px-5 text-center text-[0.8125rem]">
      <div class="wf-notes">
        <a href="#" class="flex h-9 items-center justify-center">Use code&nbsp;<b>HOME</b>&nbsp;for up to 65% off, plus 11% off with bank offers</a>
        <a href="#" class="flex h-9 items-center justify-center">Our app is live.&nbsp;<b class="underline">Download it</b>&nbsp;for ₹500 off your first order</a>
      </div>
    </div>
  </div>

  <header class="border-b border-zinc-200">
    <div class="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 lg:gap-8">
      <a href="#" class="shrink-0 text-2xl font-extrabold tracking-tight text-(--p-dark)">restful</a>
      <label class="hidden flex-1 items-center gap-2 rounded-md bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500 md:flex">
        <svg viewBox="0 0 24 24" class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input class="w-full bg-transparent outline-none placeholder:text-zinc-500" placeholder="Search for mattresses, sofas, beds and more" />
      </label>
      <nav class="ml-auto flex items-center gap-5 text-[0.75rem] text-zinc-700">
        <a href="#" class="hidden flex-col items-center gap-0.5 lg:flex"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>500032</a>
        <a href="#" class="hidden flex-col items-center gap-0.5 lg:flex"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9.5 5 4h14l2 5.5M3 9.5h18M3 9.5V20h18V9.5M9 20v-6h6v6" /></svg>Stores</a>
        <a href="#" class="hidden flex-col items-center gap-0.5 sm:flex"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" /></svg>Wishlist</a>
        <a href="#" class="flex flex-col items-center gap-0.5"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Profile</a>
        <a href="#" class="relative flex flex-col items-center gap-0.5"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14l-1.2 12H6.2L5 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>Cart<span class="absolute -top-1.5 right-0 grid size-4 place-items-center rounded-full bg-(--s) text-[0.625rem] font-bold text-(--s-on)">2</span></a>
      </nav>
    </div>
    <nav class="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 pb-2.5 text-[0.8125rem] font-medium whitespace-nowrap text-zinc-700 [scrollbar-width:none]">
      <a href="#" class="font-bold text-(--s-dark)">Sale</a><a href="#">Mattresses</a><a href="#">Beds</a><a href="#">Sofas</a><a href="#">Chairs</a><a href="#">Pillows &amp; bedding</a><a href="#">Wardrobes</a><a href="#">Tables</a><a href="#">Dining</a><a href="#">Decor</a><a href="#">Kids</a><a href="#">Bulk orders</a>
    </nav>
  </header>

  <div class="relative overflow-hidden">
    <div class="wf-track flex">
      <a href="#" class="relative w-full shrink-0">
        <img src="https://picsum.photos/seed/wf-bedroom/1920/600" alt="" class="aspect-[16/9] w-full object-cover md:aspect-[16/5]" />
        <span class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></span>
        <span class="absolute top-1/2 left-[6%] max-w-sm -translate-y-1/2 text-white"><b class="block text-[0.75rem] tracking-[0.2em] uppercase opacity-80">Home Sweet Home Sale</b><b class="mt-1 block text-3xl leading-tight md:text-5xl">Up to 65% off</b><span class="mt-3 inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900">Shop now</span></span>
      </a>
      <a href="#" class="relative w-full shrink-0">
        <img src="https://picsum.photos/seed/wf-mattress/1920/600" alt="" class="aspect-[16/9] w-full object-cover md:aspect-[16/5]" />
        <span class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></span>
        <span class="absolute top-1/2 left-[6%] max-w-sm -translate-y-1/2 text-white"><b class="block text-[0.75rem] tracking-[0.2em] uppercase opacity-80">Mattresses</b><b class="mt-1 block text-3xl leading-tight md:text-5xl">From ₹5,999</b><span class="mt-3 inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900">Shop mattresses</span></span>
      </a>
      <a href="#" class="relative w-full shrink-0">
        <img src="https://picsum.photos/seed/wf-sofa/1920/600" alt="" class="aspect-[16/9] w-full object-cover md:aspect-[16/5]" />
        <span class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></span>
        <span class="absolute top-1/2 left-[6%] max-w-sm -translate-y-1/2 text-white"><b class="block text-[0.75rem] tracking-[0.2em] uppercase opacity-80">Sofas</b><b class="mt-1 block text-3xl leading-tight md:text-5xl">Flat 50% off</b><span class="mt-3 inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900">Shop sofas</span></span>
      </a>
    </div>
    <button class="absolute top-1/2 left-3 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl text-zinc-900 shadow md:grid" aria-label="Previous slide">‹</button>
    <button class="absolute top-1/2 right-3 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-xl text-zinc-900 shadow md:grid" aria-label="Next slide">›</button>
    <div class="absolute inset-x-0 bottom-3 flex justify-center gap-1.5"><span class="wf-dot h-2 rounded-full bg-white"></span><span class="wf-dot h-2 rounded-full bg-white"></span><span class="wf-dot h-2 rounded-full bg-white"></span></div>
  </div>

  <a href="#" class="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 bg-(--p-light) px-5 py-3 text-sm">
    <b class="text-(--p-dark)">Home Sweet Home Sale</b>
    <span class="flex items-center gap-1.5 text-zinc-700">Ends in
      <b class="rounded bg-white px-1.5 py-0.5 font-mono text-zinc-900">04</b>d :
      <b class="rounded bg-white px-1.5 py-0.5 font-mono text-zinc-900">16</b>h :
      <b class="rounded bg-white px-1.5 py-0.5 font-mono text-zinc-900">50</b>m</span>
    <span class="flex items-center gap-2"><span class="rounded bg-white px-2 py-0.5 text-[0.6875rem] font-bold text-zinc-600">AXIS</span><span class="rounded bg-white px-2 py-0.5 text-[0.6875rem] font-bold text-zinc-600">SBI</span><span class="rounded bg-white px-2 py-0.5 text-[0.6875rem] font-bold text-zinc-600">HDFC</span><b class="text-(--p-dark)">Flat 15% off</b></span>
  </a>

  <div class="mx-auto max-w-7xl px-5">
    <div class="mt-5 flex flex-col items-center gap-4 rounded-xl border border-zinc-200 px-5 py-4 md:flex-row md:gap-8">
      <b class="shrink-0 text-lg text-(--p-dark)">Why restful?</b>
      <ul class="grid w-full grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <li class="flex items-center gap-2.5"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark)">★</span><b>25 lakh+ customers</b></li>
        <li class="flex items-center gap-2.5"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark)">⛟</span><b>Free shipping</b></li>
        <li class="flex items-center gap-2.5"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark)">⚒</span><b>Free installation</b></li>
        <li class="flex items-center gap-2.5"><span class="grid size-10 shrink-0 place-items-center rounded-full bg-(--p-light) text-(--p-dark)">✓</span><b>Best warranty</b></li>
      </ul>
    </div>

    <h2 class="mt-8 text-xl font-bold md:text-2xl">Shop by categories</h2>
    <ul class="mt-4 grid grid-cols-3 gap-x-3 gap-y-5 pb-10 text-center text-[0.8125rem] font-medium sm:grid-cols-4 lg:grid-cols-6">
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c1/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Mattresses &amp; bedding</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c2/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Beds &amp; side tables</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c3/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Pillows &amp; cushions</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c4/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Chairs &amp; WFH</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c5/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Sofas &amp; seating</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c6/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Wardrobes</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c7/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">TV units &amp; coffee tables</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c8/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Dining &amp; kitchen</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c9/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Cabinets &amp; shelves</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c10/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Rugs, mats &amp; bath</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c11/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Curtains &amp; decor</span></a></li>
      <li><a href="#"><img src="https://picsum.photos/seed/wf-c12/300/300" alt="" class="aspect-square w-full rounded-lg bg-zinc-100 object-cover" /><span class="mt-2 block">Kids &amp; nursery</span></a></li>
    </ul>
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
  {
    id: "bg-3d-devices-samsung",
    category: "backgrounds",
    name: "3D devices on an orbit, Samsung style",
    note: "Like Samsung's homepage hero: a full-screen key visual where a foldable opens and closes, a phone and a watch float in 3D and a glossy ring orbits them, under one big headline. Pure CSS 3D, still for reduced motion.",
    html: `<style>
  .sx-hero { --ring: conic-gradient(from 0deg, var(--p-dark), var(--p), var(--t), var(--p-light), var(--s), var(--p-dark)); }
  .sx-stage { perspective: 1400px; perspective-origin: 50% 35%; }
  .sx-scene { position: relative; width: 520px; height: 380px; transform-style: preserve-3d; animation: sx-sway 14s ease-in-out infinite; }
  .sx-scene * { transform-style: preserve-3d; }
  @keyframes sx-sway { 0%,100% { transform: rotateX(-8deg) rotateY(-24deg); } 50% { transform: rotateX(-4deg) rotateY(24deg); } }

  .sx-ring { position: absolute; left: 50%; top: 55%; width: 560px; height: 560px; margin: -280px 0 0 -280px; border-radius: 50%; transform: rotateX(64deg); }
  .sx-ring i { position: absolute; inset: 0; border-radius: 50%; background: var(--ring); -webkit-mask: radial-gradient(closest-side, transparent 86%, #000 87%, #000 99%, transparent 100%); mask: radial-gradient(closest-side, transparent 86%, #000 87%, #000 99%, transparent 100%); animation: sx-spin 16s linear infinite; filter: drop-shadow(0 0 18px color-mix(in srgb, var(--p) 45%, transparent)); }
  @keyframes sx-spin { to { transform: rotate(360deg); } }

  .sx-floor { position: absolute; left: 50%; top: 82%; width: 420px; height: 120px; margin-left: -210px; border-radius: 50%; background: radial-gradient(closest-side, rgb(0 0 0 / .22), transparent); transform: rotateX(90deg) translateZ(-40px); filter: blur(6px); }

  .sx-panel { position: absolute; width: 140px; height: 290px; border-radius: 22px; }
  .sx-face { position: absolute; inset: 0; border-radius: inherit; backface-visibility: hidden; }
  .sx-screen { background: linear-gradient(150deg, var(--p-dark), var(--p) 45%, var(--t) 100%); box-shadow: inset 0 0 0 5px #111, 0 30px 60px -20px rgb(0 0 0 / .45); overflow: hidden; }
  .sx-screen::after { content: ""; position: absolute; inset: -40%; background: linear-gradient(105deg, transparent 40%, rgb(255 255 255 / .35) 50%, transparent 60%); animation: sx-gloss 6s ease-in-out infinite; }
  @keyframes sx-gloss { 0%,30% { transform: translateX(-60%); } 70%,100% { transform: translateX(60%); } }
  .sx-back { background: linear-gradient(160deg, #3a3d44, #15161a); transform: rotateY(180deg); box-shadow: inset 0 0 0 2px #555; }
  .sx-cam { position: absolute; top: 16px; left: 16px; display: grid; gap: 6px; }
  .sx-cam b { display: block; width: 22px; height: 22px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #4b5563, #000 70%); box-shadow: 0 0 0 2px #6b7280; }

  .sx-fold { position: absolute; left: 120px; top: 30px; transform: translateZ(30px); }
  .sx-fold .sx-left { left: 0; }
  .sx-fold .sx-right { left: 142px; transform-origin: -1px 50%; animation: sx-open 8s cubic-bezier(.6,0,.3,1) infinite; }
  @keyframes sx-open { 0%,12% { transform: rotateY(-172deg); } 38%,74% { transform: rotateY(0deg); } 100% { transform: rotateY(-172deg); } }

  .sx-phone { position: absolute; left: 400px; top: 70px; width: 118px; height: 246px; animation: sx-float 6s ease-in-out infinite; }
  .sx-phone .sx-panel { width: 118px; height: 246px; border-radius: 20px; }
  @keyframes sx-float { 0%,100% { transform: translateZ(90px) rotateY(-28deg) translateY(0); } 50% { transform: translateZ(90px) rotateY(-18deg) translateY(-18px); } }

  .sx-watch { position: absolute; left: 30px; top: 190px; animation: sx-float2 7s ease-in-out infinite; }
  .sx-watch .sx-dial { width: 96px; height: 96px; border-radius: 50%; background: radial-gradient(circle at 50% 50%, #111 58%, #2a2a2a 60%, #888 64%, #222 70%); box-shadow: 0 20px 40px -12px rgb(0 0 0 / .45); display: flex; align-items: center; justify-content: center; color: #fff; font: 600 18px/1 system-ui; }
  .sx-watch .sx-dial span { color: var(--p-light); }
  @keyframes sx-float2 { 0%,100% { transform: translateZ(120px) rotateY(20deg) translateY(0); } 50% { transform: translateZ(120px) rotateY(32deg) translateY(-14px); } }

  .sx-fit { transform: scale(.62); transform-origin: top center; margin-bottom: -150px; }
  @media (min-width: 640px) { .sx-fit { transform: scale(.85); margin-bottom: -60px; } }
  @media (min-width: 1024px) { .sx-fit { transform: none; margin-bottom: 0; } }
  @media (prefers-reduced-motion: reduce) { .sx-hero * { animation: none !important; } .sx-fold .sx-right { transform: rotateY(-20deg); } }
</style>
<section class="sx-hero relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,var(--p-light),#f5f6f8_55%,#eceef2)] text-zinc-950">
  <div class="mx-auto max-w-5xl px-5 pt-14 text-center md:pt-20">
    <p class="text-sm font-semibold tracking-wide text-zinc-600">Nova Week · 24 Oct – 2 Nov</p>
    <h1 class="mt-3 text-5xl font-bold tracking-tight md:text-7xl">Nova Week</h1>
    <p class="mt-3 text-lg text-zinc-700 md:text-2xl">Discover new ways to live smarter</p>
    <div class="mt-6 flex justify-center gap-3">
      <a href="#" class="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white">Learn more</a>
      <a href="#" class="rounded-full border border-zinc-950 px-6 py-2.5 text-sm font-semibold">Buy now</a>
    </div>
  </div>
  <div class="sx-stage mt-4 flex justify-center pb-6" aria-hidden="true">
    <div class="sx-fit">
      <div class="sx-scene">
        <div class="sx-floor"></div>
        <div class="sx-ring"><i></i></div>
        <div class="sx-watch"><div class="sx-dial">10<span>:</span>09</div></div>
        <div class="sx-fold">
          <div class="sx-panel sx-left"><div class="sx-face sx-screen"></div><div class="sx-face sx-back"></div></div>
          <div class="sx-panel sx-right"><div class="sx-face sx-screen"></div><div class="sx-face sx-back"><div class="sx-cam"><b></b><b></b><b></b></div></div></div>
        </div>
        <div class="sx-phone"><div class="sx-panel"><div class="sx-face sx-screen"></div><div class="sx-face sx-back"><div class="sx-cam"><b></b><b></b></div></div></div></div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center gap-3 pb-6">
    <span class="h-1.5 w-8 rounded-full bg-zinc-950"></span><span class="size-1.5 rounded-full bg-zinc-400"></span><span class="size-1.5 rounded-full bg-zinc-400"></span><span class="size-1.5 rounded-full bg-zinc-400"></span>
    <button class="ml-2 grid size-7 place-items-center rounded-full border border-zinc-400 text-[0.625rem] text-zinc-700" aria-label="Pause">❚❚</button>
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
    category: "product-cards",
    group: "Collections",
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
    id: "motion-light-sweep",
    category: "motion",
    group: "Text",
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
    group: "Text",
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
    group: "Help",
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
    group: "Shopping",
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
  // -------------------------------------------------------------------------
  //  Sketch: engraved heroes. Public-domain engravings from Wikimedia
  //  Commons, toned sepia and multiplied onto warm paper, so the paper
  //  disappears and only the linework stays.
  // -------------------------------------------------------------------------
  {
    id: "sketch-engraved-law",
    category: "sketch",
    group: "Engraved heroes",
    name: "Lady Justice, engraved",
    note: "Advocates and legal consultants: a navy bar, warm paper, and a blindfolded Justice with her scales behind soft circles. Engraving: public domain, Wikimedia Commons.",
    html: `<section class="bg-[#fbf3e9] text-[#2b2118]">
  <header class="bg-[#0b1733] text-white">
    <div class="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
      <a href="#" class="font-serif text-xl font-bold tracking-wide">Sharma <span class="text-[#d39a5b]">&amp;</span> Associates</a>
      <nav class="ml-8 hidden gap-6 text-sm text-white/80 lg:flex"><a href="#">Practice areas</a><a href="#">Advocates</a><a href="#">Judgements</a><a href="#">Contact</a></nav>
      <div class="ml-auto flex gap-3">
        <a href="#" class="rounded-md bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on)">Enquiry →</a>
        <a href="#" class="hidden rounded-md border border-white/30 px-4 py-2 text-sm font-semibold sm:block">Login</a>
      </div>
    </div>
  </header>
  <div class="relative isolate overflow-hidden">
    <div class="absolute top-1/2 right-[-6rem] -z-10 size-[34rem] -translate-y-1/2 rounded-full bg-[#f3dcc0]/60"></div>
    <div class="absolute right-[2rem] bottom-[-14rem] -z-10 size-[26rem] rounded-full bg-[#efd2b0]/50"></div>
    <div class="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
      <div>
        <p class="text-sm font-semibold tracking-[0.2em] text-[#a8692d] uppercase">Advocates · since 1998</p>
        <h1 class="mt-4 font-serif text-4xl leading-tight md:text-6xl">Justice, argued with care.</h1>
        <p class="mt-5 max-w-md text-lg leading-relaxed text-[#5b4a3a]">Civil, criminal, property and family matters before the High Court and district courts of Telangana.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#" class="rounded-md bg-(--p) px-6 py-3 font-semibold text-(--p-on)">Book a consultation</a>
          <a href="#" class="rounded-md border border-[#2b2118]/25 px-6 py-3 font-semibold">+91 98480 12345</a>
        </div>
        <p class="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#7a6552]"><span><b class="text-[#2b2118]">4,000+</b> matters</span><span><b class="text-[#2b2118]">12</b> advocates</span><span>Telugu · Hindi · English</span></p>
      </div>
      <div class="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden [mask-image:radial-gradient(ellipse_58%_60%_at_50%_48%,black_50%,transparent_100%)]">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/Gerechtigheid_%28Justitia%29%2C_RP-P-OB-54.738.jpg" alt="Engraving of Justice holding a sword and scales" class="absolute inset-0 size-full scale-[1.7] object-cover object-[50%_40%] mix-blend-multiply [filter:grayscale(1)_sepia(.45)_contrast(1.3)_brightness(1.08)]" />
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: "sketch-engraved-temple",
    category: "sketch",
    group: "Engraved heroes",
    name: "Temple gopuram, engraved",
    note: "Temple trusts, poojas and spiritual tourism: the gopuram rises from the paper on the right, with timings and two clear actions. Engraving c.1812: public domain, Wikimedia Commons.",
    html: `<section class="relative isolate overflow-hidden bg-[linear-gradient(180deg,#fff8ee,#f7e6cf)] text-[#3a2414]">
  <header class="mx-auto flex max-w-6xl items-center gap-6 px-5 py-5">
    <a href="#" class="font-serif text-xl font-bold text-[#8a3b12]">ॐ Sri Venkateswara Seva Trust</a>
    <nav class="ml-auto hidden gap-6 text-sm lg:flex"><a href="#">Sevas</a><a href="#">Darshan</a><a href="#">Annadanam</a><a href="#">Festivals</a></nav>
    <a href="#" class="ml-auto rounded-full bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) lg:ml-0">Donate</a>
  </header>
  <div class="mx-auto grid max-w-6xl items-end gap-6 px-5 md:grid-cols-2">
    <div class="pb-14 md:pb-24">
      <p class="font-serif text-lg text-[#a8551f] italic">Om Namo Venkatesaya</p>
      <h1 class="mt-3 font-serif text-4xl leading-tight md:text-6xl">Book your seva, from anywhere.</h1>
      <p class="mt-5 max-w-md text-lg leading-relaxed text-[#6b4a32]">Archana, abhishekam and kalyanotsavam, performed in your gotra and name, with prasadam sent home.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-full bg-(--p) px-6 py-3 font-semibold text-(--p-on)">Book a seva</a>
        <a href="#" class="rounded-full border border-[#3a2414]/25 px-6 py-3 font-semibold">Today's timings</a>
      </div>
      <dl class="mt-8 grid max-w-sm grid-cols-2 gap-3 text-sm">
        <div class="rounded-lg border border-[#3a2414]/15 bg-white/50 px-3 py-2"><dt class="text-[#8b6a50]">Morning darshan</dt><dd class="font-semibold">6:00 – 12:30</dd></div>
        <div class="rounded-lg border border-[#3a2414]/15 bg-white/50 px-3 py-2"><dt class="text-[#8b6a50]">Evening darshan</dt><dd class="font-semibold">4:00 – 8:30</dd></div>
      </dl>
    </div>
    <div class="relative mx-auto w-full max-w-md">
      <div class="absolute bottom-0 left-1/2 -z-10 size-[28rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-[#f0cf9e]/50"></div>
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/%2A%27Elevation_of_the_Great_Pagoda_at_Conjeveram%2C%27_engraving_by_Capt._Thomas_Fraser%2C_c.1812%2A_%28BL%29.jpg" alt="Engraving of a South Indian temple gopuram" class="w-full mix-blend-multiply [filter:grayscale(1)_sepia(.45)_contrast(1.3)_brightness(1.08)] [mask-image:radial-gradient(ellipse_48%_52%_at_50%_45%,black_70%,transparent_100%)]" style="margin-bottom:-14%" />
    </div>
  </div>
</section>`,
  },
  {
    id: "sketch-engraved-charminar",
    category: "sketch",
    group: "Engraved heroes",
    name: "Charminar, engraved",
    note: "A Hyderabadi restaurant, sweet shop or heritage walk: the old-city street engraving on the left, the menu promise on the right. Engraving: public domain, Wikimedia Commons.",
    html: `<section class="relative isolate overflow-hidden bg-[#f8efe2] text-[#2e2116]">
  <div class="absolute top-10 left-[-8rem] -z-10 size-[36rem] rounded-full border border-[#c99d6b]/40"></div>
  <div class="absolute top-24 left-[-4rem] -z-10 size-[28rem] rounded-full bg-[#efdcc2]/70"></div>
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
    <div class="relative order-2 mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden md:order-1 [mask-image:radial-gradient(ellipse_70%_75%_at_50%_45%,black_55%,transparent_78%)]">
      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/The_Char_Minar%2C_Hyderabad.jpg" alt="Engraving of the Charminar, Hyderabad" class="absolute inset-0 size-full scale-[1.15] object-cover object-[50%_35%] mix-blend-multiply [filter:grayscale(1)_sepia(.45)_contrast(1.3)_brightness(1.08)]" />
    </div>
    <div class="order-1 md:order-2">
      <p class="text-sm font-semibold tracking-[0.25em] text-[#a35a23] uppercase">Old City · since 1953</p>
      <h1 class="mt-4 font-serif text-4xl leading-tight md:text-6xl">Dum biryani, the way Hyderabad remembers it.</h1>
      <p class="mt-5 max-w-md text-lg leading-relaxed text-[#64503d]">Sealed handis, aged basmati and a recipe three generations old. Dine in near the Charminar or order to your door.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-md bg-(--p) px-6 py-3 font-semibold text-(--p-on)">Order online</a>
        <a href="#" class="rounded-md border border-[#2e2116]/25 px-6 py-3 font-semibold">Reserve a table</a>
      </div>
      <p class="mt-6 text-sm text-[#7d6550]">★ 4.6 on Google · 18,000+ reviews</p>
    </div>
  </div>
</section>`,
  },
  {
    id: "sketch-engraved-qutb",
    category: "sketch",
    group: "Engraved heroes",
    name: "Qutb arch, engraved",
    note: "Coaching institutes, history and civil-services prep: a grand arch engraving framing the promise, with results up front. Engraving 1878: public domain, Wikimedia Commons.",
    html: `<section class="bg-[#faf5ec] text-[#22201c]">
  <header class="border-b border-[#22201c]/10">
    <div class="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
      <a href="#" class="font-serif text-xl font-bold">Vidya <span class="text-[#9b5e2a]">IAS Academy</span></a>
      <nav class="ml-auto hidden gap-6 text-sm text-[#55504a] lg:flex"><a href="#">Courses</a><a href="#">Test series</a><a href="#">Toppers</a><a href="#">Current affairs</a></nav>
      <a href="#" class="ml-auto rounded-md bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on) lg:ml-0">Free demo</a>
    </div>
  </header>
  <div class="relative isolate mx-auto grid max-w-6xl items-center gap-8 overflow-hidden px-5 py-14 md:grid-cols-[1.15fr_1fr] md:py-16">
    <div class="absolute top-1/2 right-0 -z-10 size-[30rem] -translate-y-1/2 translate-x-1/4 rounded-full bg-[#efe1c8]/80"></div>
    <div>
      <p class="inline-block rounded-full border border-[#9b5e2a]/30 bg-white/60 px-3 py-1 text-sm text-[#9b5e2a]">UPSC CSE 2027 batch · Old Rajinder Nagar</p>
      <h1 class="mt-5 font-serif text-4xl leading-tight md:text-6xl">History is the syllabus. Discipline is the strategy.</h1>
      <p class="mt-5 max-w-lg text-lg leading-relaxed text-[#55504a]">Foundation, prelims and mains with mentors who cleared it, weekly answer writing and a library open till midnight. Online and in Delhi.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#" class="rounded-md bg-(--p) px-6 py-3 font-semibold text-(--p-on)">Join a free demo class</a>
        <a href="#" class="rounded-md border border-[#22201c]/25 px-6 py-3 font-semibold">Download syllabus</a>
      </div>
      <dl class="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[#22201c]/10 pt-6">
        <div><dt class="text-sm text-[#7a7268]">Selections</dt><dd class="font-serif text-2xl font-bold">214</dd></div>
        <div><dt class="text-sm text-[#7a7268]">Top 100</dt><dd class="font-serif text-2xl font-bold">19</dd></div>
        <div><dt class="text-sm text-[#7a7268]">Years</dt><dd class="font-serif text-2xl font-bold">22</dd></div>
      </dl>
    </div>
    <div class="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden [mask-image:radial-gradient(ellipse_70%_72%_at_50%_45%,black_58%,transparent_80%)]">
      <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/%22Koutub%2C_near_Delhi%2C%22_a_wood_engraving_of_the_screen_by_E._Therond%3B_Bickers_%26_Son%2C_London%2C_1878_-_%2Aa_very_large_scan_of_this_engraving%2A.jpg/960px-%22Koutub%2C_near_Delhi%2C%22_a_wood_engraving_of_the_screen_by_E._Therond%3B_Bickers_%26_Son%2C_London%2C_1878_-_%2Aa_very_large_scan_of_this_engraving%2A.jpg" alt="Engraving of the arch at the Qutb complex, Delhi" class="absolute inset-0 size-full scale-[1.12] object-cover object-[50%_40%] mix-blend-multiply [filter:grayscale(1)_sepia(.45)_contrast(1.3)_brightness(1.08)]" />
    </div>
  </div>
</section>`,
  },
  {
    id: "sketch-engraved-taj",
    category: "sketch",
    group: "Engraved heroes",
    name: "Taj Mahal, etched",
    note: "Travel agents and tour packages: a centred promise over a wide etching of the Taj, with package prices people scan first. Etching 1916: public domain, Wikimedia Commons.",
    html: `<section class="relative isolate overflow-hidden bg-[#fbf4ea] text-[#2a2119]">
  <div class="mx-auto max-w-3xl px-5 pt-14 text-center md:pt-20">
    <p class="text-sm font-semibold tracking-[0.25em] text-[#a8692d] uppercase">Golden Triangle · 6 nights</p>
    <h1 class="mt-4 font-serif text-4xl leading-tight md:text-6xl">Delhi, Agra and Jaipur, planned to the last chai.</h1>
    <p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#65513f]">Sunrise at the Taj, a night in a haveli and a driver who knows the shortcuts. Hotels, trains and guides in one booking.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="#" class="rounded-full bg-(--p) px-6 py-3 font-semibold text-(--p-on)">Plan my trip</a>
      <a href="#" class="rounded-full border border-[#2a2119]/25 px-6 py-3 font-semibold">WhatsApp us</a>
    </div>
  </div>
  <div class="relative mx-auto mt-6 max-w-5xl px-5">
    <div class="absolute inset-x-[15%] top-[10%] -z-10 aspect-square rounded-full bg-[#f1dcc0]/70"></div>
    <div class="relative aspect-[16/8] overflow-hidden [mask-image:radial-gradient(ellipse_62%_80%_at_50%_60%,black_50%,transparent_78%)]">
      <img src="https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3e/%27Taj_Mahal%2C_India%27_by_Charles_W._Bartlett%2C_1916%2C_etching.JPG/960px-%27Taj_Mahal%2C_India%27_by_Charles_W._Bartlett%2C_1916%2C_etching.JPG" alt="Etching of the Taj Mahal" class="absolute inset-0 size-full scale-[1.2] object-cover object-[50%_40%] mix-blend-multiply [filter:grayscale(1)_sepia(.45)_contrast(1.3)_brightness(1.08)]" />
    </div>
    <ul class="relative -mt-10 mb-12 grid gap-3 sm:grid-cols-3">
      <li class="rounded-xl border border-[#2a2119]/10 bg-white/80 p-4 backdrop-blur"><p class="text-sm text-[#7d6550]">Golden Triangle</p><p class="font-semibold">from ₹14,999</p></li>
      <li class="rounded-xl border border-[#2a2119]/10 bg-white/80 p-4 backdrop-blur"><p class="text-sm text-[#7d6550]">Rajasthan forts</p><p class="font-semibold">from ₹22,499</p></li>
      <li class="rounded-xl border border-[#2a2119]/10 bg-white/80 p-4 backdrop-blur"><p class="text-sm text-[#7d6550]">Varanasi and Agra</p><p class="font-semibold">from ₹18,999</p></li>
    </ul>
  </div>
</section>`,
  },
];
