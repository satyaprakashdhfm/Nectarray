import type { UiComponent } from "@/lib/content/ui-library";

/**
 * Second pass on the Elements tab: motion that plays on its own, pricing,
 * NVIDIA-style article cards, centred placeholders, FAQ styles, short calls
 * to action, sticky bars, footers, one-board walls for the small pieces
 * (buttons, badges, fields, alerts, tabs) and more sketch diagrams.
 */
export const MORE_COMPONENTS: UiComponent[] = [
  {
    id: "motion-blur-rise",
    category: "motion",
    group: "Text",
    name: "Copy rises out of blur",
    note: "Like the Sculpted by Time jewellery store: each line drifts up out of a blur, holds, then dissolves upward as the next arrives, over a slowly turning piece. Plays on its own. Luxury, jewellery, perfume.",
    html: `<style>
  .br-stage { background: radial-gradient(60% 70% at 70% 50%, #483f39 0%, #1a1614 55%, #0b0909 100%); }
  .br-line { position: absolute; inset: 0; display: grid; align-content: center; opacity: 0; animation: br-cycle 12s cubic-bezier(.2,.7,.2,1) infinite; }
  .br-line:nth-child(2) { animation-delay: 4s; }
  .br-line:nth-child(3) { animation-delay: 8s; }
  @keyframes br-cycle {
    0% { opacity: 0; filter: blur(14px); transform: translateY(36px); }
    9%, 25% { opacity: 1; filter: blur(0); transform: none; }
    34%, 100% { opacity: 0; filter: blur(12px); transform: translateY(-30px); }
  }
  .br-piece { animation: br-turn 12s ease-in-out infinite; }
  @keyframes br-turn { 0%, 100% { transform: rotate(-8deg) translateY(0) scale(1); } 50% { transform: rotate(10deg) translateY(-14px) scale(1.05); } }
  .br-glow { animation: br-glow 6s ease-in-out infinite; }
  @keyframes br-glow { 50% { opacity: .35; transform: scale(1.15); } }
  @media (prefers-reduced-motion: reduce) { .br-line, .br-piece, .br-glow { animation: none; } .br-line:first-child { opacity: 1; } }
</style>
<section class="br-stage relative isolate overflow-hidden text-[#dbd1d0]">
  <div class="mx-auto grid min-h-[30rem] max-w-6xl items-center gap-8 px-6 md:grid-cols-2">
    <div class="relative h-56">
      <div class="br-line"><p class="text-[0.75rem] tracking-[0.4em] text-[#c2c35f] uppercase">Aurelia · 18k gold</p><h2 class="mt-4 font-serif text-5xl leading-none md:text-6xl">Sculpted<br />by time.</h2></div>
      <div class="br-line"><p class="text-[0.75rem] tracking-[0.4em] text-[#c2c35f] uppercase">Hand finished in Jaipur</p><h2 class="mt-4 font-serif text-5xl leading-none md:text-6xl">Worn<br />by you.</h2></div>
      <div class="br-line"><p class="text-[0.75rem] tracking-[0.4em] text-[#c2c35f] uppercase">One piece at a time</p><h2 class="mt-4 font-serif text-5xl leading-none md:text-6xl">Made<br />slowly.</h2><a href="#" class="mt-6 inline-block w-max border-b border-[#dbd1d0]/50 pb-1 text-sm tracking-[0.2em] uppercase">Discover the piece</a></div>
    </div>
    <div class="relative grid place-items-center py-10">
      <span class="br-glow absolute size-72 rounded-full bg-[#906964]/40 blur-3xl"></span>
      <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Ring/3D/ring_3d.png" alt="" class="br-piece relative w-56 drop-shadow-[0_30px_40px_rgba(0,0,0,.6)] md:w-72" />
    </div>
  </div>
</section>`,
  },
  {
    id: "motion-panel-slide",
    category: "motion",
    group: "Images and panels",
    name: "Product panel slides in from the left",
    note: "The film keeps moving behind, a product panel slides in on a long ease, presents one piece, then slips away again. From the same jewellery store. Plays on its own.",
    html: `<style>
  .ps-film { animation: ps-film 16s ease-in-out infinite alternate; }
  @keyframes ps-film { from { transform: scale(1.08) translateX(2%); } to { transform: scale(1.22) translateX(-3%); } }
  .ps-panel { animation: ps-panel 8s cubic-bezier(.16,1,.3,1) infinite; }
  @keyframes ps-panel { 0%, 8% { transform: translateX(-110%); } 25%, 75% { transform: none; } 92%, 100% { transform: translateX(-110%); } }
  .ps-in > * { animation: ps-item 8s ease-out infinite both; }
  .ps-in > *:nth-child(2) { animation-delay: .1s; } .ps-in > *:nth-child(3) { animation-delay: .2s; } .ps-in > *:nth-child(4) { animation-delay: .3s; }
  @keyframes ps-item { 0%, 18% { opacity: 0; transform: translateY(14px); filter: blur(6px); } 30%, 72% { opacity: 1; transform: none; filter: none; } 80%, 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .ps-film, .ps-panel, .ps-in > * { animation: none; } }
</style>
<section class="relative isolate h-[30rem] overflow-hidden bg-black">
  <img src="https://picsum.photos/seed/ps-film-dark/1600/900?grayscale" alt="" class="ps-film absolute inset-0 -z-10 size-full object-cover opacity-60" />
  <div class="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
  <p class="absolute right-6 bottom-6 text-right font-serif text-3xl leading-tight text-white/80 md:text-5xl">The weight<br />of the hand.</p>
  <aside class="ps-panel absolute inset-y-0 left-0 flex w-[min(22rem,85%)] flex-col justify-center bg-[#dbd1d0] px-7 text-[#1a1614]">
    <div class="ps-in">
      <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Gem%20stone/3D/gem_stone_3d.png" alt="" class="w-28" />
      <p class="mt-6 text-[0.6875rem] tracking-[0.35em] text-[#906964] uppercase">Piece 02 of 07</p>
      <h3 class="mt-2 font-serif text-3xl">Nila solitaire</h3>
      <p class="mt-3 flex items-center justify-between border-t border-[#1a1614]/15 pt-3 text-sm"><span>Sapphire, 18k gold</span><b>₹48,900</b></p>
    </div>
    <a href="#" class="mt-6 bg-[#1a1614] py-3 text-center text-sm tracking-[0.2em] text-[#dbd1d0] uppercase">Add to bag</a>
  </aside>
</section>`,
  },
  {
    id: "motion-film-crossfade",
    category: "motion",
    group: "Images and panels",
    name: "Two films crossfade, slow zoom",
    note: "Two pictures drift and zoom like film, crossfading at a fixed point, with the caption changing with them. A hero that feels alive without a video file.",
    html: `<style>
  .fc-shot { position: absolute; inset: 0; opacity: 0; animation: fc-show 14s linear infinite; }
  .fc-shot:nth-child(2) { animation-delay: 7s; }
  .fc-shot img { animation: fc-zoom 14s linear infinite; }
  .fc-shot:nth-child(2) img { animation-delay: 7s; }
  @keyframes fc-show { 0% { opacity: 0; } 6%, 50% { opacity: 1; } 56%, 100% { opacity: 0; } }
  @keyframes fc-zoom { from { transform: scale(1.05) translate(0, 0); } to { transform: scale(1.25) translate(-3%, -2%); } }
  .fc-cap { animation: fc-show 14s linear infinite; }
  .fc-cap:nth-of-type(2) { animation-delay: 7s; }
  @media (prefers-reduced-motion: reduce) { .fc-shot, .fc-shot img, .fc-cap { animation: none; } .fc-shot:first-child, .fc-cap:first-of-type { opacity: 1; } }
</style>
<section class="relative isolate h-[28rem] overflow-hidden bg-zinc-950 text-white">
  <div class="absolute inset-0 -z-10">
    <div class="fc-shot"><img src="https://picsum.photos/seed/fc-hills/1600/900" alt="" class="size-full object-cover" /></div>
    <div class="fc-shot"><img src="https://picsum.photos/seed/fc-coast/1600/900" alt="" class="size-full object-cover" /></div>
  </div>
  <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/10 to-black/30"></div>
  <div class="absolute inset-x-6 bottom-8">
    <div class="fc-cap absolute bottom-0"><p class="text-sm tracking-[0.3em] uppercase opacity-80">Munnar · 3 nights</p><h2 class="mt-2 text-4xl font-semibold md:text-5xl">Wake up above the clouds</h2></div>
    <div class="fc-cap absolute bottom-0"><p class="text-sm tracking-[0.3em] uppercase opacity-80">Gokarna · 4 nights</p><h2 class="mt-2 text-4xl font-semibold md:text-5xl">Sleep to the sound of the sea</h2></div>
  </div>
</section>`,
  },
  {
    id: "motion-mask-lines",
    category: "motion",
    group: "Text",
    name: "Headline lines slide up from a mask",
    note: "Each line of the headline rises out from behind an invisible edge, one after another, and a hand-drawn underline finishes it. The classic agency opener.",
    html: `<style>
  .ml-row { display: block; overflow: hidden; padding-bottom: .08em; }
  .ml-row:last-child { padding-bottom: .45em; }
  .ml-row > span { display: block; animation: ml-up 6s cubic-bezier(.2,.9,.1,1) infinite both; }
  .ml-row:nth-child(2) > span { animation-delay: .12s; } .ml-row:nth-child(3) > span { animation-delay: .24s; }
  @keyframes ml-up { 0% { transform: translateY(110%); } 15%, 80% { transform: none; } 95%, 100% { transform: translateY(-110%); } }
  .ml-ul { stroke-dasharray: 260; animation: ml-draw 6s ease-out infinite; }
  @keyframes ml-draw { 0%, 22% { stroke-dashoffset: 260; } 38%, 80% { stroke-dashoffset: 0; } 90%, 100% { stroke-dashoffset: -260; } }
  @media (prefers-reduced-motion: reduce) { .ml-row > span, .ml-ul { animation: none; } }
</style>
<section class="bg-[#f4f1ea] px-6 py-20">
  <h2 class="mx-auto max-w-4xl text-5xl leading-[1.02] font-black tracking-tight text-zinc-900 md:text-7xl">
    <span class="ml-row"><span>We make brands</span></span>
    <span class="ml-row"><span>people remember</span></span>
    <span class="ml-row"><span class="relative w-max">after one visit.<svg viewBox="0 0 260 20" class="absolute top-[95%] left-0 h-[0.3em] w-full" preserveAspectRatio="none" fill="none" aria-hidden="true"><path class="ml-ul stroke-(--p)" stroke-width="7" stroke-linecap="round" d="M4 14 C 70 4, 150 4, 256 12" /></svg></span></span>
  </h2>
</section>`,
  },
  {
    id: "motion-curtain-wipe",
    category: "motion",
    group: "Images and panels",
    name: "Curtain wipes to reveal the picture",
    note: "A coloured curtain sweeps across, the photo is revealed behind it, then the caption rises. Portfolios, case studies, new launches.",
    html: `<style>
  .cw-photo { animation: cw-photo 6s cubic-bezier(.7,0,.2,1) infinite; }
  .cw-curtain { animation: cw-curtain 6s cubic-bezier(.7,0,.2,1) infinite; }
  .cw-cap { animation: cw-cap 6s ease-out infinite; }
  @keyframes cw-curtain { 0% { transform: scaleX(0); transform-origin: left; } 18% { transform: scaleX(1); transform-origin: left; } 19% { transform-origin: right; } 36%, 100% { transform: scaleX(0); transform-origin: right; } }
  @keyframes cw-photo { 0%, 18% { clip-path: inset(0 100% 0 0); } 19%, 88% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 0 0 100%); } }
  @keyframes cw-cap { 0%, 34% { opacity: 0; transform: translateY(16px); } 46%, 85% { opacity: 1; transform: none; } 95%, 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .cw-photo, .cw-curtain, .cw-cap { animation: none; } .cw-curtain { transform: scaleX(0); } }
</style>
<section class="bg-white px-6 py-14">
  <div class="mx-auto grid max-w-5xl items-end gap-8 md:grid-cols-[1.4fr_1fr]">
    <div class="relative aspect-[4/3] overflow-hidden rounded-xl">
      <img src="https://picsum.photos/seed/cw-studio/1200/900" alt="" class="cw-photo size-full object-cover" />
      <span class="cw-curtain absolute inset-0 bg-(--p)"></span>
    </div>
    <div class="cw-cap">
      <p class="text-sm font-semibold text-(--p-dark)">Case study · 2026</p>
      <h3 class="mt-2 text-3xl font-bold text-zinc-900">Rebuilding Chai Point's ordering app</h3>
      <p class="mt-3 text-zinc-600">Orders up 38% in the first quarter after launch.</p>
    </div>
  </div>
</section>`,
  },
  {
    id: "motion-card-grows",
    category: "motion",
    group: "Images and panels",
    name: "Card grows to full width",
    note: "A rounded picture card opens out to the full width, then the words rise over it. The zoom reveal, playing on its own.",
    html: `<style>
  .cg-card { animation: cg-grow 7s cubic-bezier(.65,0,.25,1) infinite; }
  .cg-text { animation: cg-text 7s ease-out infinite; }
  @keyframes cg-grow { 0%, 10% { width: 46%; border-radius: 28px; } 40%, 85% { width: 100%; border-radius: 0; } 100% { width: 46%; border-radius: 28px; } }
  @keyframes cg-text { 0%, 35% { opacity: 0; transform: translateY(24px); } 50%, 82% { opacity: 1; transform: none; } 95%, 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .cg-card, .cg-text { animation: none; } .cg-card { width: 100%; } }
</style>
<section class="grid place-items-center bg-zinc-950 py-10">
  <div class="cg-card relative h-[22rem] overflow-hidden">
    <img src="https://picsum.photos/seed/cg-lake/1600/900" alt="" class="absolute inset-0 size-full object-cover" />
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="cg-text absolute inset-0 grid place-items-center px-6 text-center text-white"><div><p class="text-sm tracking-[0.3em] uppercase">Chapter one</p><h2 class="mt-2 text-4xl font-bold md:text-6xl">Where it all began</h2></div></div>
  </div>
</section>`,
  },
  {
    id: "motion-card-stack",
    category: "motion",
    group: "Images and panels",
    name: "Cards stack one over another",
    note: "Cards slide up and stack on top of each other, each one slightly smaller behind the next, then reset. The sticky stack, playing on its own. Services, process steps.",
    html: `<style>
  .cs-card { position: absolute; inset-inline: 0; top: 0; animation: cs-in 9s cubic-bezier(.2,.9,.2,1) infinite both; }
  .cs-card:nth-child(1) { animation-name: cs-first; }
  .cs-card:nth-child(2) { animation-delay: 1.5s; } .cs-card:nth-child(3) { animation-delay: 3s; }
  @keyframes cs-first { 0%, 15% { transform: none; } 30%, 85% { transform: translateY(-24px) scale(.92); opacity: .7; } 100% { transform: none; opacity: 1; } }
  @keyframes cs-in { 0% { transform: translateY(120%); } 12% { transform: translateY(0); } 30%, 70% { transform: translateY(-12px) scale(.96); } 85%, 100% { transform: translateY(120%); } }
  .cs-card:nth-child(3) { animation-name: cs-last; }
  @keyframes cs-last { 0% { transform: translateY(120%); } 12%, 60% { transform: none; } 72%, 100% { transform: translateY(120%); } }
  @media (prefers-reduced-motion: reduce) { .cs-card { position: static; animation: none; margin-bottom: 1rem; } }
</style>
<section class="bg-zinc-100 px-6 py-12">
  <div class="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
    <div><p class="text-sm font-semibold text-(--p-dark)">How we work</p><h2 class="mt-2 text-4xl font-bold text-zinc-900">Three steps, no surprises</h2><p class="mt-3 text-zinc-600">Fixed price, weekly check-ins, and you own everything at the end.</p></div>
    <div class="relative h-64 overflow-hidden">
      <article class="cs-card rounded-2xl bg-white p-6 shadow-xl"><p class="font-mono text-sm text-(--p-dark)">01</p><h3 class="mt-2 text-2xl font-bold text-zinc-900">Discovery call</h3><p class="mt-2 text-zinc-600">30 minutes to understand the business and the numbers that matter.</p></article>
      <article class="cs-card rounded-2xl bg-(--p-light) p-6 shadow-xl"><p class="font-mono text-sm text-(--p-dark)">02</p><h3 class="mt-2 text-2xl font-bold text-zinc-900">Design in a week</h3><p class="mt-2 text-zinc-600">Clickable screens you can show your team before a line of code.</p></article>
      <article class="cs-card rounded-2xl bg-zinc-900 p-6 text-white shadow-xl"><p class="font-mono text-sm text-(--p)">03</p><h3 class="mt-2 text-2xl font-bold">Live in four</h3><p class="mt-2 text-white/70">Built, tested on real phones, launched with you watching.</p></article>
    </div>
  </div>
</section>`,
  },
  {
    id: "motion-words-light",
    category: "motion",
    group: "Text",
    name: "Words light up one by one",
    note: "A big statement in grey, each word lighting up in turn like it is being read aloud, then fading back. The scroll text reveal, playing on its own.",
    html: `<style>
  .wl-w { color: #d4d4d8; animation: wl-on 7s ease infinite both; }
  @keyframes wl-on { 0% { color: #d4d4d8; } 6%, 70% { color: #18181b; } 85%, 100% { color: #d4d4d8; } }
  .wl-acc { animation-name: wl-accent; }
  @keyframes wl-accent { 0% { color: #d4d4d8; } 6%, 70% { color: var(--p); } 85%, 100% { color: #d4d4d8; } }
  @media (prefers-reduced-motion: reduce) { .wl-w { animation: none; color: #18181b; } }
</style>
<section class="bg-white px-6 py-20">
  <p class="mx-auto max-w-4xl text-4xl leading-tight font-bold tracking-tight md:text-6xl"><span class="wl-w" style="animation-delay:0.00s">We</span> <span class="wl-w" style="animation-delay:0.32s">build</span> <span class="wl-w" style="animation-delay:0.64s">websites</span> <span class="wl-w" style="animation-delay:0.96s">that</span> <span class="wl-w" style="animation-delay:1.28s">people</span> <span class="wl-w" style="animation-delay:1.60s">trust,</span> <span class="wl-w" style="animation-delay:1.92s">and</span> <span class="wl-w" style="animation-delay:2.24s">businesses</span> <span class="wl-w wl-acc" style="animation-delay:2.56s">grow</span> <span class="wl-w" style="animation-delay:2.88s">with.</span></p>
</section>`,
  },
  {
    id: "motion-orbit-badge",
    category: "motion",
    group: "Text",
    name: "Rotating text badge",
    note: "A circle of text turning slowly around an arrow, the badge that sits on a hero corner and says scroll, explore or book now.",
    html: `<style>
  .ob-ring { animation: ob-spin 14s linear infinite; }
  @keyframes ob-spin { to { transform: rotate(360deg); } }
  .ob-badge:hover .ob-arrow { transform: rotate(-45deg); }
  @media (prefers-reduced-motion: reduce) { .ob-ring { animation: none; } }
</style>
<section class="relative overflow-hidden bg-(--p-light) px-6 py-16">
  <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-8">
    <h2 class="max-w-lg text-5xl leading-none font-black tracking-tight text-zinc-900 md:text-6xl">Interiors that feel like you.</h2>
    <a href="#" class="ob-badge relative grid size-40 place-items-center" aria-label="Book a site visit">
      <svg viewBox="0 0 200 200" class="ob-ring absolute inset-0 size-full" aria-hidden="true"><defs><path id="ob-circle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs><text class="fill-zinc-900 text-[17px] font-bold tracking-[0.32em] uppercase"><textPath href="#ob-circle">Book a site visit · Free · Book a site visit · Free ·</textPath></text></svg>
      <span class="grid size-20 place-items-center rounded-full bg-zinc-900 text-white"><span class="ob-arrow text-3xl transition-transform duration-300">↓</span></span>
    </a>
  </div>
</section>`,
  },
  {
    id: "motion-aurora",
    category: "motion",
    group: "Text",
    name: "Aurora drifting behind a heading",
    note: "Soft coloured light drifts slowly behind the words, in the palette's three colours. A launch, an AI product, an event.",
    html: `<style>
  .au-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .7; mix-blend-mode: screen; }
  .au-a { animation: au-a 12s ease-in-out infinite alternate; } .au-b { animation: au-b 14s ease-in-out infinite alternate; } .au-c { animation: au-c 10s ease-in-out infinite alternate; }
  @keyframes au-a { to { transform: translate(40%, 30%) scale(1.3); } }
  @keyframes au-b { to { transform: translate(-35%, 25%) scale(.8); } }
  @keyframes au-c { to { transform: translate(20%, -35%) scale(1.2); } }
  @media (prefers-reduced-motion: reduce) { .au-blob { animation: none; } }
</style>
<section class="relative isolate overflow-hidden bg-zinc-950 px-6 py-24 text-center text-white">
  <div class="absolute inset-0 -z-10">
    <span class="au-blob au-a top-[-10%] left-[5%] size-80 bg-(--p)"></span>
    <span class="au-blob au-b top-[10%] right-[0%] size-96 bg-(--s)"></span>
    <span class="au-blob au-c bottom-[-20%] left-[35%] size-80 bg-(--t)"></span>
  </div>
  <p class="text-sm font-semibold tracking-[0.3em] text-white/70 uppercase">Launching 14 November</p>
  <h2 class="mx-auto mt-4 max-w-3xl text-5xl leading-tight font-bold md:text-7xl">Your shop, run by an assistant that never sleeps</h2>
  <a href="#" class="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-zinc-900">Join the waitlist</a>
</section>`,
  },
  {
    id: "pricing-switch-gst",
    category: "pricing",
    group: "Plans",
    name: "Three plans with a working monthly or yearly switch",
    note: "The switch really flips the prices (no script, just a radio and :has). Prices in rupees with GST noted, the middle plan lifted with a glow. SaaS, software, memberships.",
    html: `<style>
  .pg-y { display: none; }
  .pg:has(#pg-yearly:checked) .pg-y { display: inline; }
  .pg:has(#pg-yearly:checked) .pg-m { display: none; }
  .pg-knob { transition: transform .25s cubic-bezier(.3,1.5,.5,1); }
  .pg:has(#pg-yearly:checked) .pg-knob { transform: translateX(100%); }
</style>
<section class="pg bg-zinc-50 px-5 py-14">
  <div class="text-center">
    <h2 class="text-4xl font-bold tracking-tight text-zinc-900">Simple pricing, in rupees</h2>
    <p class="mt-2 text-zinc-600">Start free for 14 days. No card needed.</p>
    <div class="relative mx-auto mt-6 grid w-72 grid-cols-2 rounded-full bg-white p-1 text-sm font-semibold shadow-sm ring-1 ring-zinc-200">
      <span class="pg-knob absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-zinc-900"></span>
      <label class="pg-lm relative z-10 cursor-pointer py-2 text-center text-white mix-blend-difference"><input type="radio" name="pg-cycle" class="sr-only" checked />Monthly</label>
      <label class="pg-ly relative z-10 cursor-pointer py-2 text-center text-white mix-blend-difference"><input id="pg-yearly" type="radio" name="pg-cycle" class="sr-only" />Yearly <span class="text-(--t)">−20%</span></label>
    </div>
  </div>
  <div class="mx-auto mt-10 grid max-w-5xl items-center gap-5 md:grid-cols-3">
    <article class="rounded-2xl bg-white p-7 ring-1 ring-zinc-200">
      <h3 class="font-semibold text-zinc-900">Starter</h3><p class="mt-1 text-sm text-zinc-500">For a single shop</p>
      <p class="mt-5 text-4xl font-bold text-zinc-900"><span class="pg-m">₹499</span><span class="pg-y">₹399</span><span class="text-base font-medium text-zinc-500">/mo</span></p>
      <p class="text-[0.75rem] text-zinc-500">+18% GST</p>
      <a href="#" class="mt-6 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-900 hover:border-zinc-900">Start free trial</a>
      <ul class="mt-6 space-y-2.5 text-sm"><li class="flex gap-2.5 text-zinc-600"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>1 store, 500 products</li><li class="flex gap-2.5 text-zinc-600"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>UPI and card payments</li><li class="flex gap-2.5 text-zinc-600"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>WhatsApp order alerts</li></ul>
    </article>
    <article class="relative rounded-2xl bg-zinc-900 p-8 text-white shadow-[0_30px_60px_-20px_var(--p)] ring-2 ring-(--p) md:-my-4">
      <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--p) px-3 py-1 text-[0.75rem] font-bold text-(--p-on)">Most popular</span>
      <h3 class="font-semibold">Growth</h3><p class="mt-1 text-sm text-white/60">For brands selling every day</p>
      <p class="mt-5 text-4xl font-bold"><span class="pg-m">₹1,499</span><span class="pg-y">₹1,199</span><span class="text-base font-medium text-white/60">/mo</span></p>
      <p class="text-[0.75rem] text-white/60">+18% GST</p>
      <a href="#" class="mt-6 block rounded-lg bg-(--p) py-2.5 text-center text-sm font-semibold text-(--p-on)">Start free trial</a>
      <ul class="mt-6 space-y-2.5 text-sm"><li class="flex gap-2.5 text-white/80"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>3 stores, unlimited products</li><li class="flex gap-2.5 text-white/80"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>Abandoned cart on WhatsApp</li><li class="flex gap-2.5 text-white/80"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>Shiprocket and Delhivery</li><li class="flex gap-2.5 text-white/80"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>GST invoices</li></ul>
    </article>
    <article class="rounded-2xl bg-white p-7 ring-1 ring-zinc-200">
      <h3 class="font-semibold text-zinc-900">Business</h3><p class="mt-1 text-sm text-zinc-500">For teams and wholesalers</p>
      <p class="mt-5 text-4xl font-bold text-zinc-900"><span class="pg-m">₹3,999</span><span class="pg-y">₹3,199</span><span class="text-base font-medium text-zinc-500">/mo</span></p>
      <p class="text-[0.75rem] text-zinc-500">+18% GST</p>
      <a href="#" class="mt-6 block rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-semibold text-zinc-900 hover:border-zinc-900">Talk to sales</a>
      <ul class="mt-6 space-y-2.5 text-sm"><li class="flex gap-2.5 text-zinc-600"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>Unlimited stores and staff</li><li class="flex gap-2.5 text-zinc-600"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>B2B price lists</li><li class="flex gap-2.5 text-zinc-600"><svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 fill-(--p)"><path d="M8.3 14.3 4 10l1.4-1.4 2.9 2.9 6.3-6.3L16 6.6z" /></svg>Dedicated manager</li></ul>
    </article>
  </div>
</section>`,
  },
  {
    id: "pricing-compare-table",
    category: "pricing",
    group: "Plans",
    name: "Plan comparison table",
    note: "Every feature against every plan, the middle column shaded, a button under each. Sits under the plan cards for people who read everything before buying.",
    html: `<section class="bg-white px-5 py-12">
  <div class="mx-auto max-w-4xl overflow-x-auto">
    <table class="w-full min-w-[34rem] text-sm">
      <thead>
        <tr><th class="w-2/5 pb-4 text-left text-2xl font-bold text-zinc-900">Compare plans</th><th class="pb-4 font-semibold text-zinc-900">Starter<span class="block text-[0.8125rem] font-normal text-zinc-500">₹499/mo</span></th><th class="rounded-t-xl bg-(--p-light)/50 pt-3 pb-4 font-semibold text-zinc-900">Growth<span class="block text-[0.8125rem] font-normal text-zinc-500">₹1,499/mo</span></th><th class="pb-4 font-semibold text-zinc-900">Business<span class="block text-[0.8125rem] font-normal text-zinc-500">₹3,999/mo</span></th></tr>
      </thead>
      <tbody><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">Products</th><td class="py-3 text-center text-zinc-700 ">500</td><td class="py-3 text-center text-zinc-700 bg-(--p-light)/50">Unlimited</td><td class="py-3 text-center text-zinc-700 ">Unlimited</td></tr><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">Staff accounts</th><td class="py-3 text-center text-zinc-700 ">1</td><td class="py-3 text-center text-zinc-700 bg-(--p-light)/50">5</td><td class="py-3 text-center text-zinc-700 ">Unlimited</td></tr><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">UPI and cards</th><td class="py-3 text-center "><span class="text-lg text-(--p-dark)">✓</span></td><td class="py-3 text-center bg-(--p-light)/50"><span class="text-lg text-(--p-dark)">✓</span></td><td class="py-3 text-center "><span class="text-lg text-(--p-dark)">✓</span></td></tr><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">WhatsApp alerts</th><td class="py-3 text-center "><span class="text-lg text-(--p-dark)">✓</span></td><td class="py-3 text-center bg-(--p-light)/50"><span class="text-lg text-(--p-dark)">✓</span></td><td class="py-3 text-center "><span class="text-lg text-(--p-dark)">✓</span></td></tr><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">Abandoned cart recovery</th><td class="py-3 text-center text-zinc-300 ">—</td><td class="py-3 text-center bg-(--p-light)/50"><span class="text-lg text-(--p-dark)">✓</span></td><td class="py-3 text-center "><span class="text-lg text-(--p-dark)">✓</span></td></tr><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">GST invoices</th><td class="py-3 text-center text-zinc-300 ">—</td><td class="py-3 text-center bg-(--p-light)/50"><span class="text-lg text-(--p-dark)">✓</span></td><td class="py-3 text-center "><span class="text-lg text-(--p-dark)">✓</span></td></tr><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">B2B price lists</th><td class="py-3 text-center text-zinc-300 ">—</td><td class="py-3 text-center text-zinc-300 bg-(--p-light)/50">—</td><td class="py-3 text-center "><span class="text-lg text-(--p-dark)">✓</span></td></tr><tr class="border-t border-zinc-100"><th class="py-3 pr-4 text-left font-medium text-zinc-700">Support</th><td class="py-3 text-center text-zinc-700 ">Email</td><td class="py-3 text-center text-zinc-700 bg-(--p-light)/50">Chat, 9 to 9</td><td class="py-3 text-center text-zinc-700 ">Phone, 24 × 7</td></tr></tbody>
      <tfoot><tr><td></td><td class="pt-4 text-center"><a href="#" class="inline-block rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-900">Choose</a></td><td class="rounded-b-xl bg-(--p-light)/50 pt-4 pb-4 text-center"><a href="#" class="inline-block rounded-lg bg-(--p) px-4 py-2 font-semibold text-(--p-on)">Choose</a></td><td class="pt-4 text-center"><a href="#" class="inline-block rounded-lg border border-zinc-300 px-4 py-2 font-semibold text-zinc-900">Choose</a></td></tr></tfoot>
    </table>
  </div>
</section>`,
  },
  {
    id: "pricing-packages-addons",
    category: "pricing",
    group: "Packages",
    name: "Service packages with add-ons",
    note: "Dark and elegant: three packages for a service, what each includes, add-ons as chips and how much to pay to book. Wedding photography, events, interiors, salons.",
    html: `<section class="bg-[#14110f] px-5 py-14 text-[#efe7df]">
  <div class="mx-auto max-w-5xl">
    <p class="text-center text-sm tracking-[0.3em] text-(--p) uppercase">Wedding packages</p>
    <h2 class="mt-2 text-center font-serif text-4xl">Every ritual, beautifully kept</h2>
    <div class="mt-10 grid gap-5 md:grid-cols-3">
      <article class="rounded-xl border border-white/10 p-6"><h3 class="font-serif text-2xl">Muhurtham</h3><p class="mt-1 text-sm text-white/60">Wedding day only</p><p class="mt-5 text-3xl font-semibold">₹85,000</p><ul class="mt-5 space-y-2 text-sm text-white/80"><li>· 1 photographer, 1 videographer</li><li>· 400 edited photos</li><li>· 5-minute highlight film</li></ul></article>
      <article class="rounded-xl border border-(--p) bg-white/[0.04] p-6"><p class="text-[0.75rem] font-bold tracking-wide text-(--p) uppercase">Booked most</p><h3 class="mt-1 font-serif text-2xl">Saptapadi</h3><p class="mt-1 text-sm text-white/60">Haldi, mehendi, wedding</p><p class="mt-5 text-3xl font-semibold">₹1,90,000</p><ul class="mt-5 space-y-2 text-sm text-white/80"><li>· Team of 4 over 3 days</li><li>· 1,200 edited photos</li><li>· Wedding film and teaser</li><li>· 40-page album</li></ul></article>
      <article class="rounded-xl border border-white/10 p-6"><h3 class="font-serif text-2xl">Utsav</h3><p class="mt-1 text-sm text-white/60">Every function, plus pre-wedding</p><p class="mt-5 text-3xl font-semibold">₹3,40,000</p><ul class="mt-5 space-y-2 text-sm text-white/80"><li>· Team of 6, drone, live stream</li><li>· Pre-wedding shoot in one city</li><li>· Two albums and a documentary</li></ul></article>
    </div>
    <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
      <div class="flex flex-wrap gap-2 text-sm"><span class="text-white/60">Add on:</span><span class="rounded-full border border-white/20 px-3 py-1">Drone ₹15,000</span><span class="rounded-full border border-white/20 px-3 py-1">Same-day edit ₹25,000</span><span class="rounded-full border border-white/20 px-3 py-1">Extra album ₹18,000</span></div>
      <a href="#" class="rounded-full bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on)">Pay 30% to book the date</a>
    </div>
  </div>
</section>`,
  },
  {
    id: "blog-nvidia-cards",
    category: "blog-cards",
    group: "Blog cards",
    name: "Article cards, NVIDIA style",
    note: "The NVIDIA card: 16 by 9 picture, a category and type line, bold title, two lines of summary and a Read more link pinned to the bottom so every card lines up.",
    html: `<section class="bg-zinc-50 px-5 py-12">
  <div class="mx-auto max-w-6xl">
    <div class="flex flex-wrap items-end justify-between gap-4"><h2 class="text-3xl font-bold tracking-tight text-zinc-900">Latest from the blog</h2><a href="#" class="text-sm font-bold text-zinc-900">See all articles <span class="text-(--p)">›</span></a></div>
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <article class="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div class="overflow-hidden"><img src="https://picsum.photos/seed/nv-solar/640/360" alt="" class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div class="flex flex-1 flex-col p-5">
          <p class="text-[0.8125rem] font-semibold text-zinc-600">Energy | Blog</p>
          <h3 class="mt-3 text-lg leading-snug font-bold text-zinc-900">How a Pune factory cut its power bill by 41%</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">Rooftop solar, smarter shifts and one sensor on every motor.</p>
          <a href="#" class="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-zinc-900">Read more <span class="text-(--p) transition-transform group-hover:translate-x-1">›</span></a>
        </div>
      </article>
      <article class="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div class="overflow-hidden"><img src="https://picsum.photos/seed/nv-clinic/640/360" alt="" class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div class="flex flex-1 flex-col p-5">
          <p class="text-[0.8125rem] font-semibold text-zinc-600">Healthcare | Case study</p>
          <h3 class="mt-3 text-lg leading-snug font-bold text-zinc-900">A clinic chain that books 3,000 visits a day on WhatsApp</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">No app to install, reminders that people actually read.</p>
          <a href="#" class="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-zinc-900">Read more <span class="text-(--p) transition-transform group-hover:translate-x-1">›</span></a>
        </div>
      </article>
      <article class="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div class="overflow-hidden"><img src="https://picsum.photos/seed/nv-school/640/360" alt="" class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div class="flex flex-1 flex-col p-5">
          <p class="text-[0.8125rem] font-semibold text-zinc-600">Education | Webinar</p>
          <h3 class="mt-3 text-lg leading-snug font-bold text-zinc-900">Running exams for 40,000 students online</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">What broke on day one, and what we built after.</p>
          <a href="#" class="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-zinc-900">Read more <span class="text-(--p) transition-transform group-hover:translate-x-1">›</span></a>
        </div>
      </article>
      <article class="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
        <div class="overflow-hidden"><img src="https://picsum.photos/seed/nv-farm/640/360" alt="" class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div class="flex flex-1 flex-col p-5">
          <p class="text-[0.8125rem] font-semibold text-zinc-600">Agriculture | Blog</p>
          <h3 class="mt-3 text-lg leading-snug font-bold text-zinc-900">Mandi prices on a farmer's phone, every morning</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">SMS in nine languages, built for 2G.</p>
          <a href="#" class="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-zinc-900">Read more <span class="text-(--p) transition-transform group-hover:translate-x-1">›</span></a>
        </div>
      </article>
    </div>
  </div>
</section>`,
  },
  {
    id: "blog-news-list",
    category: "blog-cards",
    group: "Blog cards",
    name: "News list with dates",
    note: "A plain, fast list: date on the left, title and tag, thumbnail on the right. For press, updates, circulars and notices.",
    html: `<section class="bg-white px-5 py-12">
  <div class="mx-auto max-w-3xl">
    <h2 class="text-3xl font-bold tracking-tight text-zinc-900">News and updates</h2>
    <ul class="mt-6 divide-y divide-zinc-200 border-y border-zinc-200">
      <li><a href="#" class="group grid grid-cols-[4.5rem_1fr_6rem] items-center gap-4 py-4"><span class="text-center"><b class="block text-2xl text-zinc-900">21</b><span class="text-[0.75rem] text-zinc-500 uppercase">Oct</span></span><span><span class="text-[0.75rem] font-semibold text-(--p-dark)">Press</span><span class="block font-semibold text-zinc-900 group-hover:underline">We opened our sixth store, in Kochi</span></span><img src="https://picsum.photos/seed/nl-1/240/160" alt="" class="aspect-[3/2] rounded object-cover" /></a></li>
      <li><a href="#" class="group grid grid-cols-[4.5rem_1fr_6rem] items-center gap-4 py-4"><span class="text-center"><b class="block text-2xl text-zinc-900">09</b><span class="text-[0.75rem] text-zinc-500 uppercase">Oct</span></span><span><span class="text-[0.75rem] font-semibold text-(--p-dark)">Product</span><span class="block font-semibold text-zinc-900 group-hover:underline">Same-day delivery is now live in Hyderabad</span></span><img src="https://picsum.photos/seed/nl-2/240/160" alt="" class="aspect-[3/2] rounded object-cover" /></a></li>
      <li><a href="#" class="group grid grid-cols-[4.5rem_1fr_6rem] items-center gap-4 py-4"><span class="text-center"><b class="block text-2xl text-zinc-900">28</b><span class="text-[0.75rem] text-zinc-500 uppercase">Sep</span></span><span><span class="text-[0.75rem] font-semibold text-(--p-dark)">Notice</span><span class="block font-semibold text-zinc-900 group-hover:underline">Stores closed on 2 October for Gandhi Jayanti</span></span><img src="https://picsum.photos/seed/nl-3/240/160" alt="" class="aspect-[3/2] rounded object-cover" /></a></li>
    </ul>
  </div>
</section>`,
  },
  {
    id: "content-skeleton-centred",
    category: "blog-cards",
    group: "Placeholders",
    name: "Loading placeholders, centred",
    note: "Shimmering grey shapes in the middle of the page where the cards will land, so the page does not jump when the content arrives.",
    html: `<style>
  .sk { background: linear-gradient(100deg, #ececee 30%, #f8f8f9 50%, #ececee 70%) 0 0 / 300% 100%; animation: sk 1.4s linear infinite; border-radius: .5rem; }
  @keyframes sk { to { background-position: -150% 0; } }
  @media (prefers-reduced-motion: reduce) { .sk { animation: none; } }
</style>
<section class="grid min-h-[26rem] place-items-center bg-white px-5 py-12">
  <div class="w-full max-w-4xl">
    <div class="mx-auto mb-8 flex flex-col items-center gap-3"><span class="sk h-7 w-64"></span><span class="sk h-4 w-96 max-w-full"></span></div>
    <div class="grid gap-5 sm:grid-cols-3">
      <div class="rounded-xl border border-zinc-100 p-3"><span class="sk block aspect-video"></span><span class="sk mt-4 block h-4 w-3/4"></span><span class="sk mt-2 block h-3 w-full"></span><span class="sk mt-2 block h-3 w-2/3"></span></div>
      <div class="rounded-xl border border-zinc-100 p-3"><span class="sk block aspect-video"></span><span class="sk mt-4 block h-4 w-2/3"></span><span class="sk mt-2 block h-3 w-full"></span><span class="sk mt-2 block h-3 w-1/2"></span></div>
      <div class="rounded-xl border border-zinc-100 p-3"><span class="sk block aspect-video"></span><span class="sk mt-4 block h-4 w-4/5"></span><span class="sk mt-2 block h-3 w-full"></span><span class="sk mt-2 block h-3 w-3/5"></span></div>
    </div>
  </div>
</section>`,
  },
  {
    id: "content-empty-centred",
    category: "blog-cards",
    group: "Placeholders",
    name: "Nothing here yet, centred",
    note: "When a list is empty: one picture, one line saying why, one button to fix it, all in the middle of the space.",
    html: `<section class="grid min-h-[24rem] place-items-center bg-zinc-50 px-5 py-12 text-center">
  <div class="max-w-sm">
    <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Open%20book/3D/open_book_3d.png" alt="" class="mx-auto w-24" />
    <h3 class="mt-5 text-xl font-bold text-zinc-900">No articles in this topic yet</h3>
    <p class="mt-2 text-zinc-600">We publish every Tuesday. Pick another topic, or get the next one by email.</p>
    <div class="mt-6 flex justify-center gap-3"><a href="#" class="rounded-lg bg-(--p) px-4 py-2 text-sm font-semibold text-(--p-on)">Browse all topics</a><a href="#" class="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900">Notify me</a></div>
  </div>
</section>`,
  },
  {
    id: "content-search-empty",
    category: "blog-cards",
    group: "Placeholders",
    name: "No search results, centred",
    note: "For a search that finds nothing: what was searched, a spelling suggestion and popular searches to tap.",
    html: `<section class="grid min-h-[24rem] place-items-center bg-white px-5 py-12 text-center">
  <div class="max-w-md">
    <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Magnifying%20glass%20tilted%20left/3D/magnifying_glass_tilted_left_3d.png" alt="" class="mx-auto w-20" />
    <h3 class="mt-5 text-xl font-bold text-zinc-900">No results for "kurtha set"</h3>
    <p class="mt-2 text-zinc-600">Did you mean <a href="#" class="font-semibold text-(--p-dark) underline">kurta set</a>?</p>
    <p class="mt-6 text-[0.75rem] font-semibold tracking-wide text-zinc-500 uppercase">Popular right now</p>
    <div class="mt-3 flex flex-wrap justify-center gap-2 text-sm"><a href="#" class="rounded-full bg-zinc-100 px-3 py-1.5 hover:bg-zinc-200">Silk sarees</a><a href="#" class="rounded-full bg-zinc-100 px-3 py-1.5 hover:bg-zinc-200">Festive kurtas</a><a href="#" class="rounded-full bg-zinc-100 px-3 py-1.5 hover:bg-zinc-200">Juttis</a><a href="#" class="rounded-full bg-zinc-100 px-3 py-1.5 hover:bg-zinc-200">Under ₹999</a></div>
  </div>
</section>`,
  },
  {
    id: "faq-numbered-large",
    category: "faqs",
    group: "Styles",
    name: "Large numbered questions",
    note: "Editorial and roomy: big numbered questions, a round plus that turns into a cross when open. For a brand that wants the FAQ to look designed.",
    html: `<section class="bg-[#f4f1ea] px-5 py-14">
  <div class="mx-auto max-w-4xl">
    <h2 class="text-sm font-semibold tracking-[0.3em] text-zinc-500 uppercase">Questions</h2>
    <div class="mt-4 border-t border-zinc-900/15">
      <details class="group border-b border-zinc-900/15 py-6" open>
        <summary class="flex cursor-pointer list-none items-start gap-6 [&::-webkit-details-marker]:hidden"><span class="pt-1 font-mono text-sm text-(--p-dark)">01</span><span class="flex-1 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">How long does delivery take?</span><span class="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-900/20 text-xl transition-transform duration-300 group-open:rotate-45 group-open:bg-zinc-900 group-open:text-white">+</span></summary>
        <p class="mt-4 max-w-2xl pl-12 text-lg leading-relaxed text-zinc-600">2 to 4 days in metro cities and up to 7 days elsewhere. You get a tracking link on WhatsApp the moment it ships.</p>
      </details>
      <details class="group border-b border-zinc-900/15 py-6">
        <summary class="flex cursor-pointer list-none items-start gap-6 [&::-webkit-details-marker]:hidden"><span class="pt-1 font-mono text-sm text-(--p-dark)">02</span><span class="flex-1 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">Can I pay cash on delivery?</span><span class="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-900/20 text-xl transition-transform duration-300 group-open:rotate-45 group-open:bg-zinc-900 group-open:text-white">+</span></summary>
        <p class="mt-4 max-w-2xl pl-12 text-lg leading-relaxed text-zinc-600">Yes, on orders under ₹5,000. Above that, pay by UPI, card or net banking.</p>
      </details>
      <details class="group border-b border-zinc-900/15 py-6">
        <summary class="flex cursor-pointer list-none items-start gap-6 [&::-webkit-details-marker]:hidden"><span class="pt-1 font-mono text-sm text-(--p-dark)">03</span><span class="flex-1 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">What if it does not fit?</span><span class="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-900/20 text-xl transition-transform duration-300 group-open:rotate-45 group-open:bg-zinc-900 group-open:text-white">+</span></summary>
        <p class="mt-4 max-w-2xl pl-12 text-lg leading-relaxed text-zinc-600">Exchange or return within 7 days. We pick it up from your door, free.</p>
      </details>
      <details class="group border-b border-zinc-900/15 py-6">
        <summary class="flex cursor-pointer list-none items-start gap-6 [&::-webkit-details-marker]:hidden"><span class="pt-1 font-mono text-sm text-(--p-dark)">04</span><span class="flex-1 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">Do you ship outside India?</span><span class="grid size-10 shrink-0 place-items-center rounded-full border border-zinc-900/20 text-xl transition-transform duration-300 group-open:rotate-45 group-open:bg-zinc-900 group-open:text-white">+</span></summary>
        <p class="mt-4 max-w-2xl pl-12 text-lg leading-relaxed text-zinc-600">Not yet. We ship to every pin code in India that our courier partners reach.</p>
      </details>
    </div>
  </div>
</section>`,
  },
  {
    id: "faq-search-topics",
    category: "faqs",
    group: "Styles",
    name: "Help centre with search and topics",
    note: "A search box, topic chips and the answers as rounded rows. The shape of Swiggy and Zomato help pages; good when there are many questions.",
    html: `<section class="bg-zinc-50 px-5 py-14">
  <div class="mx-auto max-w-2xl text-center">
    <h2 class="text-3xl font-bold text-zinc-900">How can we help?</h2>
    <label class="mt-5 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-zinc-200 focus-within:ring-2 focus-within:ring-(--p)"><span class="text-zinc-400">⌕</span><input class="w-full bg-transparent text-zinc-900 outline-none" placeholder="Search, e.g. refund, COD, track order" /></label>
    <div class="mt-4 flex flex-wrap justify-center gap-2 text-sm font-semibold"><a href="#" class="rounded-full bg-zinc-900 px-3.5 py-1.5 text-white">All</a><a href="#" class="rounded-full bg-white px-3.5 py-1.5 ring-1 ring-zinc-200 hover:ring-zinc-400">Orders</a><a href="#" class="rounded-full bg-white px-3.5 py-1.5 ring-1 ring-zinc-200 hover:ring-zinc-400">Payments</a><a href="#" class="rounded-full bg-white px-3.5 py-1.5 ring-1 ring-zinc-200 hover:ring-zinc-400">Returns</a><a href="#" class="rounded-full bg-white px-3.5 py-1.5 ring-1 ring-zinc-200 hover:ring-zinc-400">Account</a></div>
  </div>
  <div class="mx-auto mt-8 max-w-2xl space-y-3">
      <details class="group rounded-xl bg-white px-5 py-4 ring-1 ring-zinc-200 open:ring-(--p)">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">How long does delivery take?<span class="text-zinc-400 transition-transform group-open:rotate-180">⌄</span></summary>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">2 to 4 days in metro cities and up to 7 days elsewhere. You get a tracking link on WhatsApp the moment it ships.</p>
      </details>
      <details class="group rounded-xl bg-white px-5 py-4 ring-1 ring-zinc-200 open:ring-(--p)">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">Can I pay cash on delivery?<span class="text-zinc-400 transition-transform group-open:rotate-180">⌄</span></summary>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Yes, on orders under ₹5,000. Above that, pay by UPI, card or net banking.</p>
      </details>
      <details class="group rounded-xl bg-white px-5 py-4 ring-1 ring-zinc-200 open:ring-(--p)">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">What if it does not fit?<span class="text-zinc-400 transition-transform group-open:rotate-180">⌄</span></summary>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Exchange or return within 7 days. We pick it up from your door, free.</p>
      </details>
      <details class="group rounded-xl bg-white px-5 py-4 ring-1 ring-zinc-200 open:ring-(--p)">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">Do you ship outside India?<span class="text-zinc-400 transition-transform group-open:rotate-180">⌄</span></summary>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600">Not yet. We ship to every pin code in India that our courier partners reach.</p>
      </details>
  </div>
</section>`,
  },
  {
    id: "faq-chat",
    category: "faqs",
    group: "Styles",
    name: "Questions as a chat",
    note: "Each question is a sent message; tap it and the answer arrives as a reply. Feels like WhatsApp, which most Indian customers already trust.",
    html: `<section class="bg-[#ece5dd] px-5 py-12">
  <div class="mx-auto max-w-xl">
    <div class="flex items-center gap-3 rounded-t-2xl bg-zinc-900 px-4 py-3 text-white"><span class="grid size-9 place-items-center rounded-full bg-(--p) font-bold text-(--p-on)">R</span><span><b class="block text-sm">Restful support</b><span class="text-[0.75rem] text-white/60">Usually replies in 5 minutes</span></span></div>
    <div class="space-y-4 rounded-b-2xl bg-[#efeae2] p-4 text-sm">
      <details class="group" open>
        <summary class="ml-auto flex w-max max-w-[85%] cursor-pointer list-none items-center gap-2 rounded-2xl rounded-br-sm bg-(--p) px-4 py-2.5 text-(--p-on) [&::-webkit-details-marker]:hidden">How long does delivery take?</summary>
        <div class="mt-2 flex max-w-[85%] gap-2"><span class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-[0.75rem] font-bold text-white">R</span><p class="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-zinc-700 shadow-sm">2 to 4 days in metro cities and up to 7 days elsewhere. You get a tracking link on WhatsApp the moment it ships.</p></div>
      </details>
      <details class="group" open>
        <summary class="ml-auto flex w-max max-w-[85%] cursor-pointer list-none items-center gap-2 rounded-2xl rounded-br-sm bg-(--p) px-4 py-2.5 text-(--p-on) [&::-webkit-details-marker]:hidden">Can I pay cash on delivery?</summary>
        <div class="mt-2 flex max-w-[85%] gap-2"><span class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-[0.75rem] font-bold text-white">R</span><p class="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-zinc-700 shadow-sm">Yes, on orders under ₹5,000. Above that, pay by UPI, card or net banking.</p></div>
      </details>
      <details class="group">
        <summary class="ml-auto flex w-max max-w-[85%] cursor-pointer list-none items-center gap-2 rounded-2xl rounded-br-sm bg-(--p) px-4 py-2.5 text-(--p-on) [&::-webkit-details-marker]:hidden">What if it does not fit?</summary>
        <div class="mt-2 flex max-w-[85%] gap-2"><span class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-[0.75rem] font-bold text-white">R</span><p class="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-zinc-700 shadow-sm">Exchange or return within 7 days. We pick it up from your door, free.</p></div>
      </details>
      <details class="group">
        <summary class="ml-auto flex w-max max-w-[85%] cursor-pointer list-none items-center gap-2 rounded-2xl rounded-br-sm bg-(--p) px-4 py-2.5 text-(--p-on) [&::-webkit-details-marker]:hidden">Do you ship outside India?</summary>
        <div class="mt-2 flex max-w-[85%] gap-2"><span class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-[0.75rem] font-bold text-white">R</span><p class="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-zinc-700 shadow-sm">Not yet. We ship to every pin code in India that our courier partners reach.</p></div>
      </details>
    </div>
  </div>
</section>`,
  },
  {
    id: "faq-side-topics",
    category: "faqs",
    group: "Styles",
    name: "Topics on the left, answers on the right",
    note: "A sticky list of topics with counts beside grouped answers, and a contact card underneath. For a services site with a few dozen questions.",
    html: `<section class="bg-white px-5 py-14">
  <div class="mx-auto grid max-w-5xl gap-10 md:grid-cols-[14rem_1fr]">
    <aside class="md:sticky md:top-6 md:self-start">
      <h2 class="text-2xl font-bold text-zinc-900">FAQs</h2>
      <nav class="mt-5 space-y-1 text-sm"><a href="#fq-orders" class="flex justify-between rounded-lg bg-(--p-light) px-3 py-2 font-semibold text-(--p-dark)">Orders <span>2</span></a><a href="#fq-returns" class="flex justify-between rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100">Returns <span>2</span></a><a href="#" class="flex justify-between rounded-lg px-3 py-2 text-zinc-600 hover:bg-zinc-100">Payments <span>5</span></a></nav>
      <div class="mt-6 rounded-xl bg-zinc-900 p-4 text-sm text-white"><p class="font-semibold">Still stuck?</p><p class="mt-1 text-white/70">Call 1800 123 4567, 9 am to 9 pm.</p></div>
    </aside>
    <div><h3 id="fq-orders" class="mt-8 first:mt-0 text-sm font-bold tracking-wide text-(--p-dark) uppercase">Orders</h3><details class="group border-b border-zinc-200 py-4"><summary class="flex cursor-pointer list-none justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">How long does delivery take?<span class="text-(--p) group-open:hidden">+</span><span class="hidden text-(--p) group-open:inline">−</span></summary><p class="mt-2 text-zinc-600">2 to 4 days in metro cities and up to 7 days elsewhere. You get a tracking link on WhatsApp the moment it ships.</p></details><details class="group border-b border-zinc-200 py-4"><summary class="flex cursor-pointer list-none justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">Can I pay cash on delivery?<span class="text-(--p) group-open:hidden">+</span><span class="hidden text-(--p) group-open:inline">−</span></summary><p class="mt-2 text-zinc-600">Yes, on orders under ₹5,000. Above that, pay by UPI, card or net banking.</p></details><h3 id="fq-returns" class="mt-8 first:mt-0 text-sm font-bold tracking-wide text-(--p-dark) uppercase">Returns</h3><details class="group border-b border-zinc-200 py-4"><summary class="flex cursor-pointer list-none justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">What if it does not fit?<span class="text-(--p) group-open:hidden">+</span><span class="hidden text-(--p) group-open:inline">−</span></summary><p class="mt-2 text-zinc-600">Exchange or return within 7 days. We pick it up from your door, free.</p></details><details class="group border-b border-zinc-200 py-4"><summary class="flex cursor-pointer list-none justify-between gap-4 font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">Do you ship outside India?<span class="text-(--p) group-open:hidden">+</span><span class="hidden text-(--p) group-open:inline">−</span></summary><p class="mt-2 text-zinc-600">Not yet. We ship to every pin code in India that our courier partners reach.</p></details></div>
  </div>
</section>`,
  },
  {
    id: "faq-dark-grid",
    category: "faqs",
    group: "Styles",
    name: "Dark two-column cards",
    note: "Questions as dark cards in two columns that open in place, with a WhatsApp line at the end. For tech and premium brands.",
    html: `<section class="bg-zinc-950 px-5 py-14">
  <div class="mx-auto max-w-5xl">
    <h2 class="text-center text-4xl font-bold text-white">Good questions</h2>
    <div class="mt-10 grid items-start gap-4 md:grid-cols-2"><details class="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors open:bg-white/[0.07]"><summary class="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">How long does delivery take?<span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-(--p) text-(--p-on) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-white/65">2 to 4 days in metro cities and up to 7 days elsewhere. You get a tracking link on WhatsApp the moment it ships.</p></details><details class="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors open:bg-white/[0.07]"><summary class="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">Can I pay cash on delivery?<span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-(--p) text-(--p-on) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-white/65">Yes, on orders under ₹5,000. Above that, pay by UPI, card or net banking.</p></details><details class="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors open:bg-white/[0.07]"><summary class="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">What if it does not fit?<span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-(--p) text-(--p-on) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-white/65">Exchange or return within 7 days. We pick it up from your door, free.</p></details><details class="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors open:bg-white/[0.07]"><summary class="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden">Do you ship outside India?<span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-(--p) text-(--p-on) transition-transform group-open:rotate-45">+</span></summary><p class="mt-3 text-sm leading-relaxed text-white/65">Not yet. We ship to every pin code in India that our courier partners reach.</p></details></div>
    <p class="mt-8 text-center text-white/60">Something else? <a href="#" class="font-semibold text-(--p)">Message us on WhatsApp</a></p>
  </div>
</section>`,
  },
  {
    id: "cta-glow-card",
    category: "ctas",
    name: "Dark card with a glowing edge",
    note: "One line, one button, inside a dark card whose edge glows in the brand colour. Ends a page with confidence.",
    html: `<style>
  .gc-card { background: linear-gradient(#0b0b0f, #0b0b0f) padding-box, conic-gradient(from var(--gc-a, 0deg), transparent 0 60%, var(--p) 75%, var(--s) 85%, transparent 100%) border-box; border: 1.5px solid transparent; animation: gc-turn 6s linear infinite; }
  @property --gc-a { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
  @keyframes gc-turn { to { --gc-a: 360deg; } }
  @media (prefers-reduced-motion: reduce) { .gc-card { animation: none; } }
</style>
<section class="bg-zinc-950 px-5 py-16">
  <div class="gc-card mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-6 rounded-3xl px-8 py-10">
    <h2 class="max-w-md text-3xl font-bold tracking-tight text-white md:text-4xl">Ready when you are. Live in 4 weeks.</h2>
    <a href="#" class="rounded-full bg-white px-6 py-3 font-semibold text-zinc-900 transition-transform hover:scale-105">Book a call →</a>
  </div>
</section>`,
  },
  {
    id: "cta-big-type",
    category: "ctas",
    name: "Huge words and a round button",
    note: "Two words set huge, and a round button that turns its arrow when pointed at. Agencies, studios, portfolios.",
    html: `<section class="bg-(--p) px-5 py-16 text-(--p-on)">
  <div class="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8">
    <h2 class="text-7xl leading-[0.9] font-black tracking-tighter md:text-9xl">Let's<br />talk.</h2>
    <a href="#" class="group grid size-36 place-items-center rounded-full bg-zinc-950 text-white transition-transform duration-300 hover:scale-110 md:size-44">
      <span class="text-center text-sm font-semibold">hello@studio.in<span class="mt-2 block text-3xl transition-transform duration-300 group-hover:-rotate-45">→</span></span>
    </a>
  </div>
</section>`,
  },
  {
    id: "cta-whatsapp-strip",
    category: "ctas",
    name: "WhatsApp or call, with reply time",
    note: "The way Indian customers actually get in touch: two buttons and an honest reply time. Short enough to sit after any section.",
    html: `<section class="bg-white px-5 py-10">
  <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#e7f8ee] px-6 py-6">
    <div><h2 class="text-2xl font-bold text-zinc-900">Questions? Ask a real person.</h2><p class="mt-1 flex items-center gap-2 text-sm text-zinc-600"><span class="size-2 rounded-full bg-green-500"></span>Online now · replies in about 5 minutes</p></div>
    <div class="flex gap-3"><a href="#" class="rounded-full bg-[#25d366] px-5 py-2.5 font-semibold text-white hover:bg-[#1fb457]">WhatsApp us</a><a href="#" class="rounded-full border border-zinc-300 bg-white px-5 py-2.5 font-semibold text-zinc-900">Call</a></div>
  </div>
</section>`,
  },
  {
    id: "sticky-add-to-cart",
    category: "sticky",
    group: "Shopping",
    name: "Sticky add to cart on a product page",
    note: "Slides up once the main button scrolls away: thumbnail, name, price, size and Add to cart, always in reach.",
    html: `<style>.sa-bar { animation: sa-up .6s cubic-bezier(.2,.9,.2,1) both .3s; } @keyframes sa-up { from { transform: translateY(100%); } } @media (prefers-reduced-motion: reduce) { .sa-bar { animation: none; } }</style>
<div class="relative h-80 overflow-hidden bg-zinc-100">
  <div class="mx-auto max-w-3xl space-y-3 p-6 opacity-60"><div class="h-6 w-1/2 rounded bg-zinc-300"></div><div class="h-3 w-full rounded bg-zinc-200"></div><div class="h-3 w-5/6 rounded bg-zinc-200"></div><div class="h-32 rounded-xl bg-zinc-200"></div></div>
  <div class="sa-bar absolute inset-x-0 bottom-0 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,.25)] backdrop-blur">
    <div class="mx-auto flex max-w-4xl items-center gap-3"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/T-shirt/3D/t-shirt_3d.png" alt="" class="size-11 rounded-lg bg-zinc-100 p-1.5" /><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-zinc-900">Oversized tee, Rust</p><p class="text-sm"><b>₹699</b> <s class="text-zinc-400">₹1,299</s></p></div>
    <select class="hidden rounded-lg border border-zinc-300 px-2 py-2 text-sm sm:block"><option>Size M</option><option>Size L</option></select>
    <a href="#" class="rounded-lg bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on)">Add to cart</a></div>
  </div>
</div>`,
  },
  {
    id: "sticky-promo-pill",
    category: "sticky",
    group: "Shopping",
    name: "Floating offer pill",
    note: "A small dark pill floating at the bottom centre with the offer, a countdown and a close. Noticeable without blocking the page.",
    html: `<style>.pp { animation: pp-in .7s cubic-bezier(.3,1.6,.5,1) both .3s; } @keyframes pp-in { from { transform: translate(-50%, 140%); } } .pp-dot { animation: pp-pulse 1.6s ease-out infinite; } @keyframes pp-pulse { 70%, 100% { box-shadow: 0 0 0 8px transparent; } 0% { box-shadow: 0 0 0 0 var(--p); } } @media (prefers-reduced-motion: reduce) { .pp, .pp-dot { animation: none; } }</style>
<div class="relative h-80 overflow-hidden bg-zinc-100">
  <div class="mx-auto max-w-3xl space-y-3 p-6 opacity-60"><div class="h-6 w-1/2 rounded bg-zinc-300"></div><div class="h-3 w-full rounded bg-zinc-200"></div><div class="h-3 w-5/6 rounded bg-zinc-200"></div><div class="h-32 rounded-xl bg-zinc-200"></div></div>
  <a href="#" class="pp absolute bottom-5 left-1/2 flex w-max max-w-[92%] -translate-x-1/2 items-center gap-3 rounded-full bg-zinc-900 py-2 pr-2 pl-4 text-sm text-white shadow-2xl">
    <span class="pp-dot size-2 shrink-0 rounded-full bg-(--p)"></span><span><b>Diwali sale</b> · 40% off ends in <b class="font-mono">1d 14h</b></span><span class="rounded-full bg-white px-3 py-1.5 font-semibold text-zinc-900">Shop</span><span class="px-1 text-white/50" aria-label="Close">✕</span>
  </a>
</div>`,
  },
  {
    id: "sticky-chat-greeting",
    category: "sticky",
    group: "Help",
    name: "Chat button with a greeting",
    note: "A round chat button bottom right; a greeting bubble pops up beside it after a moment, with quick replies to tap.",
    html: `<style>.cg-b { animation: cg-pop .5s cubic-bezier(.3,1.6,.5,1) both 1s; transform-origin: bottom right; } @keyframes cg-pop { from { opacity: 0; transform: scale(.6) translateY(10px); } } @media (prefers-reduced-motion: reduce) { .cg-b { animation: none; } }</style>
<div class="relative h-80 overflow-hidden bg-zinc-100">
  <div class="mx-auto max-w-3xl space-y-3 p-6 opacity-60"><div class="h-6 w-1/2 rounded bg-zinc-300"></div><div class="h-3 w-full rounded bg-zinc-200"></div><div class="h-3 w-5/6 rounded bg-zinc-200"></div><div class="h-32 rounded-xl bg-zinc-200"></div></div>
  <div class="absolute right-5 bottom-5 flex flex-col items-end gap-3">
    <div class="cg-b w-64 rounded-2xl rounded-br-sm bg-white p-4 text-sm shadow-xl ring-1 ring-zinc-200"><p class="font-semibold text-zinc-900">Namaste 👋 Need help choosing?</p><div class="mt-3 flex flex-wrap gap-1.5"><a href="#" class="rounded-full border border-(--p) px-2.5 py-1 text-[0.75rem] font-semibold text-(--p-dark)">Track my order</a><a href="#" class="rounded-full border border-(--p) px-2.5 py-1 text-[0.75rem] font-semibold text-(--p-dark)">Sizes</a><a href="#" class="rounded-full border border-(--p) px-2.5 py-1 text-[0.75rem] font-semibold text-(--p-dark)">Talk to us</a></div></div>
    <a href="#" class="relative grid size-14 place-items-center rounded-full bg-(--p) text-2xl text-(--p-on) shadow-lg" aria-label="Chat">💬<span class="absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-red-500 text-[0.625rem] font-bold text-white ring-2 ring-white">1</span></a>
  </div>
</div>`,
  },
  {
    id: "sticky-cookie",
    category: "sticky",
    group: "Help",
    name: "Cookie and privacy bar",
    note: "A short, polite consent bar along the bottom with Accept and Settings, as the DPDP Act expects.",
    html: `<div class="relative h-80 overflow-hidden bg-zinc-100">
  <div class="mx-auto max-w-3xl space-y-3 p-6 opacity-60"><div class="h-6 w-1/2 rounded bg-zinc-300"></div><div class="h-3 w-full rounded bg-zinc-200"></div><div class="h-3 w-5/6 rounded bg-zinc-200"></div><div class="h-32 rounded-xl bg-zinc-200"></div></div>
  <div class="absolute inset-x-3 bottom-3 mx-auto flex max-w-3xl flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-zinc-200">
    <span class="text-2xl">🍪</span><p class="min-w-0 flex-1 text-sm text-zinc-600">We use cookies to remember your cart and to see which pages help. <a href="#" class="font-semibold text-zinc-900 underline">Privacy policy</a></p>
    <div class="flex gap-2"><a href="#" class="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Settings</a><a href="#" class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">Accept</a></div>
  </div>
</div>`,
  },
  {
    id: "sticky-app-banner",
    category: "sticky",
    group: "Help",
    name: "Get the app banner",
    note: "The smart banner phones show at the top: app icon, rating, an offer for installing, and a close.",
    html: `<div class="relative h-64 overflow-hidden bg-zinc-100">
  <div class="mx-auto max-w-3xl space-y-3 p-6 opacity-60"><div class="h-6 w-1/2 rounded bg-zinc-300"></div><div class="h-3 w-full rounded bg-zinc-200"></div><div class="h-3 w-5/6 rounded bg-zinc-200"></div><div class="h-32 rounded-xl bg-zinc-200"></div></div>
  <div class="absolute inset-x-0 top-0 flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5">
    <span class="text-zinc-400" aria-label="Close">✕</span><span class="grid size-11 place-items-center rounded-xl bg-(--p) text-lg font-black text-(--p-on)">r</span>
    <div class="min-w-0 flex-1 text-sm"><p class="font-semibold text-zinc-900">restful app</p><p class="text-[0.75rem] text-zinc-500">★ 4.6 · ₹200 off your first app order</p></div>
    <a href="#" class="rounded-full bg-(--p) px-4 py-1.5 text-sm font-bold text-(--p-on)">Open</a>
  </div>
</div>`,
  },
  {
    id: "sticky-reading-progress",
    category: "sticky",
    group: "Help",
    name: "Reading progress and back to top",
    note: "A thin bar across the top fills as the article is read, and a round back-to-top button shows the same progress as a ring. Animated here so you can see it move.",
    html: `<style>.rp-bar { animation: rp-fill 6s linear infinite; transform-origin: left; } @keyframes rp-fill { from { transform: scaleX(0); } } .rp-ring { stroke-dasharray: 126; animation: rp-ring 6s linear infinite; } @keyframes rp-ring { from { stroke-dashoffset: 126; } to { stroke-dashoffset: 0; } } @media (prefers-reduced-motion: reduce) { .rp-bar, .rp-ring { animation: none; } }</style>
<div class="relative h-80 overflow-hidden bg-white">
  <div class="mx-auto max-w-3xl space-y-3 p-6 opacity-60"><div class="h-6 w-1/2 rounded bg-zinc-300"></div><div class="h-3 w-full rounded bg-zinc-200"></div><div class="h-3 w-5/6 rounded bg-zinc-200"></div><div class="h-32 rounded-xl bg-zinc-200"></div></div>
  <span class="rp-bar absolute inset-x-0 top-0 h-1 bg-(--p)"></span>
  <a href="#" class="absolute right-5 bottom-5 grid size-12 place-items-center rounded-full bg-white text-zinc-900 shadow-lg" aria-label="Back to top">
    <svg viewBox="0 0 44 44" class="absolute inset-0 size-full -rotate-90"><circle cx="22" cy="22" r="20" fill="none" stroke="#e4e4e7" stroke-width="3" /><circle class="rp-ring" cx="22" cy="22" r="20" fill="none" stroke="var(--p)" stroke-width="3" stroke-linecap="round" /></svg>↑
  </a>
</div>`,
  },
  {
    id: "footer-big-wordmark",
    category: "footers",
    name: "Giant wordmark at the bottom",
    note: "Dark footer with a short line, three link columns, and the brand name set huge across the bottom edge, cut off by the page. Very current.",
    html: `<footer class="overflow-hidden bg-zinc-950 px-5 pt-14 text-white">
  <div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
    <div><p class="max-w-xs text-2xl font-semibold">Websites people trust, built in Hyderabad.</p><a href="#" class="mt-5 inline-block rounded-full bg-(--p) px-5 py-2.5 text-sm font-semibold text-(--p-on)">Start a project</a></div>
    <nav class="space-y-2 text-sm text-white/60"><p class="mb-3 font-semibold text-white">Work</p><a href="#" class="block hover:text-white">Case studies</a><a href="#" class="block hover:text-white">Services</a><a href="#" class="block hover:text-white">Pricing</a></nav>
    <nav class="space-y-2 text-sm text-white/60"><p class="mb-3 font-semibold text-white">Studio</p><a href="#" class="block hover:text-white">About</a><a href="#" class="block hover:text-white">Careers</a><a href="#" class="block hover:text-white">Journal</a></nav>
    <nav class="space-y-2 text-sm text-white/60"><p class="mb-3 font-semibold text-white">Say hello</p><a href="#" class="block hover:text-white">hello@nectarray.in</a><a href="#" class="block hover:text-white">+91 40 4000 1234</a><a href="#" class="block hover:text-white">Instagram</a></nav>
  </div>
  <div class="mx-auto mt-12 flex max-w-6xl justify-between border-t border-white/10 pt-5 text-[0.75rem] text-white/40"><span>© 2026 Nectarray</span><span>Privacy · Terms</span></div>
  <p class="mt-4 -mb-[0.22em] text-center text-[22vw] leading-none font-black tracking-tighter text-white/[0.06] select-none">nectarray</p>
</footer>`,
  },
  {
    id: "footer-store-india",
    category: "footers",
    name: "Indian store footer with payments and app",
    note: "Everything an Indian shopper looks for at the bottom: help links, popular searches, app download, payment methods, registered office and GSTIN.",
    html: `<footer class="bg-zinc-50 text-sm text-zinc-600">
  <div class="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
    <nav class="space-y-2"><p class="mb-3 text-[0.75rem] font-bold tracking-wide text-zinc-900 uppercase">Help</p><a href="#" class="block hover:text-zinc-900">Track your order</a><a href="#" class="block hover:text-zinc-900">Returns and refunds</a><a href="#" class="block hover:text-zinc-900">Shipping</a><a href="#" class="block hover:text-zinc-900">Contact us</a></nav>
    <nav class="space-y-2"><p class="mb-3 text-[0.75rem] font-bold tracking-wide text-zinc-900 uppercase">Shop</p><a href="#" class="block hover:text-zinc-900">Mattresses</a><a href="#" class="block hover:text-zinc-900">Sofas</a><a href="#" class="block hover:text-zinc-900">Beds</a><a href="#" class="block hover:text-zinc-900">Bulk orders</a></nav>
    <div><p class="mb-3 text-[0.75rem] font-bold tracking-wide text-zinc-900 uppercase">Get the app</p><div class="flex gap-2"><a href="#" class="rounded-lg bg-zinc-900 px-3 py-2 text-[0.75rem] leading-tight text-white"><span class="block text-[0.625rem] text-white/60">Get it on</span>Google Play</a><a href="#" class="rounded-lg bg-zinc-900 px-3 py-2 text-[0.75rem] leading-tight text-white"><span class="block text-[0.625rem] text-white/60">Download on the</span>App Store</a></div><p class="mt-4 text-[0.75rem]">100% secure payments</p><div class="mt-2 flex flex-wrap gap-1.5"><span class="rounded border border-zinc-300 bg-white px-2 py-1 text-[0.6875rem] font-bold text-zinc-700">UPI</span><span class="rounded border border-zinc-300 bg-white px-2 py-1 text-[0.6875rem] font-bold text-zinc-700">RuPay</span><span class="rounded border border-zinc-300 bg-white px-2 py-1 text-[0.6875rem] font-bold text-zinc-700">VISA</span><span class="rounded border border-zinc-300 bg-white px-2 py-1 text-[0.6875rem] font-bold text-zinc-700">Mastercard</span><span class="rounded border border-zinc-300 bg-white px-2 py-1 text-[0.6875rem] font-bold text-zinc-700">Net banking</span><span class="rounded border border-zinc-300 bg-white px-2 py-1 text-[0.6875rem] font-bold text-zinc-700">COD</span></div></div>
    <div><p class="mb-3 text-[0.75rem] font-bold tracking-wide text-zinc-900 uppercase">Registered office</p><p class="leading-relaxed">Restful Home Pvt Ltd<br />Plot 12, Hitech City, Hyderabad 500081<br />CIN U36100TG2016PTC110222<br />GSTIN 36AAACR1234A1Z5</p></div>
  </div>
  <div class="border-t border-zinc-200"><p class="mx-auto max-w-6xl px-5 py-4 text-[0.75rem] leading-relaxed"><b class="text-zinc-900">Popular searches:</b> Orthopaedic mattress · Queen size bed · L shape sofa · Study table · Office chair · Memory foam pillow · Wardrobe</p></div>
  <div class="bg-zinc-900 py-3 text-center text-[0.75rem] text-white/60">© 2026 Restful Home Pvt Ltd · Privacy · Terms · Grievance officer</div>
</footer>`,
  },
  {
    id: "footer-rounded-cta",
    category: "footers",
    name: "Rounded panel with a sign-up on top",
    note: "The footer starts with a rounded coloured panel holding a one-line sign-up, then light link rows and socials underneath.",
    html: `<footer class="bg-white px-4 pt-6 pb-8">
  <div class="mx-auto max-w-6xl rounded-3xl bg-(--p-dark) px-6 py-10 text-white md:px-10">
    <div class="flex flex-wrap items-center justify-between gap-6"><h2 class="max-w-sm text-3xl font-bold">One useful email a month. That's it.</h2>
      <form class="flex w-full max-w-sm gap-2"><input type="email" placeholder="you@company.in" class="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2.5 text-white ring-1 ring-white/20 outline-none placeholder:text-white/50 focus:ring-white" /><button class="rounded-full bg-white px-5 py-2.5 font-semibold text-(--p-dark)">Join</button></form></div>
  </div>
  <div class="mx-auto mt-8 flex max-w-6xl flex-wrap items-center justify-between gap-4 px-2 text-sm text-zinc-600">
    <a href="#" class="text-lg font-bold text-zinc-900">brightpath</a>
    <nav class="flex flex-wrap gap-5"><a href="#" class="hover:text-zinc-900">Courses</a><a href="#" class="hover:text-zinc-900">Mentors</a><a href="#" class="hover:text-zinc-900">Results</a><a href="#" class="hover:text-zinc-900">Contact</a></nav>
    <div class="flex gap-2"><a href="#" class="grid size-9 place-items-center rounded-full bg-zinc-100 font-bold hover:bg-zinc-200" aria-label="Instagram">IG</a><a href="#" class="grid size-9 place-items-center rounded-full bg-zinc-100 font-bold hover:bg-zinc-200" aria-label="YouTube">YT</a><a href="#" class="grid size-9 place-items-center rounded-full bg-zinc-100 font-bold hover:bg-zinc-200" aria-label="LinkedIn">in</a></div>
  </div>
</footer>`,
  },
  {
    id: "board-buttons",
    category: "buttons",
    group: "Boards",
    name: "Every button, on one board",
    note: "All the button styles together to click and feel: solid, outline, soft, sizes, shapes, icons, loading, groups, a push button and a shine. Copy the board and keep the ones you need.",
    html: `<section class="bg-white px-6 py-4">
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Solid</p>
    <div class="flex flex-wrap items-center gap-3"><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-(--p) px-5 py-2.5 text-(--p-on) hover:brightness-110">Primary</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-(--s) px-5 py-2.5 text-(--s-on) hover:brightness-110">Secondary</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-zinc-900 px-5 py-2.5 text-white hover:bg-zinc-700">Dark</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-red-600 px-5 py-2.5 text-white hover:bg-red-700">Delete</button></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Outline and soft</p>
    <div class="flex flex-wrap items-center gap-3"><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg border-2 border-(--p) px-5 py-2 text-(--p-dark) hover:bg-(--p) hover:text-(--p-on)">Outline</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-(--p-light) px-5 py-2.5 text-(--p-dark) hover:bg-(--p) hover:text-(--p-on)">Soft</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg px-5 py-2.5 text-zinc-700 hover:bg-zinc-100">Ghost</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) text-(--p-dark) underline-offset-4 hover:underline">Text link →</button></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Sizes</p>
    <div class="flex flex-wrap items-center gap-3"><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-md bg-(--p) px-2.5 py-1 text-[0.75rem] text-(--p-on)">Small</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-(--p) px-4 py-2 text-sm text-(--p-on)">Medium</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-xl bg-(--p) px-6 py-3 text-(--p-on)">Large</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-2xl bg-(--p) px-8 py-4 text-lg text-(--p-on)">Extra large</button></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Shapes</p>
    <div class="flex flex-wrap items-center gap-3"><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-full bg-zinc-900 px-6 py-2.5 text-white">Pill</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-none bg-zinc-900 px-6 py-2.5 tracking-[0.2em] text-white uppercase">Square</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-zinc-900 shadow-sm hover:shadow-md">Raised</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) size-11 rounded-full bg-(--p) text-xl text-(--p-on)" aria-label="Add">+</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) size-11 rounded-xl border border-zinc-300 text-lg hover:bg-zinc-100" aria-label="Favourite">♡</button></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">With icons</p>
    <div class="flex flex-wrap items-center gap-3"><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-(--p) px-5 py-2.5 text-(--p-on)">↓ Download brochure</button><button class="group inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-zinc-900 px-5 py-2.5 text-white">Continue <span class="transition-transform group-hover:translate-x-1">→</span></button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-[#25d366] px-5 py-2.5 text-white hover:bg-[#1fb457]">WhatsApp</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-zinc-800 hover:bg-zinc-50"><span class="font-black text-[#4285f4]">G</span> Continue with Google</button></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">States</p>
    <div class="flex flex-wrap items-center gap-3"><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-(--p) px-5 py-2.5 text-(--p-on)"><span class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>Saving</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-green-600 px-5 py-2.5 text-white">✓ Saved</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) cursor-not-allowed rounded-lg bg-zinc-200 px-5 py-2.5 text-zinc-400" disabled>Disabled</button></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Groups</p>
    <div class="flex flex-wrap items-center gap-3"><div class="inline-flex overflow-hidden rounded-lg border border-zinc-300 text-sm font-semibold"><button class="bg-zinc-900 px-4 py-2 text-white">Day</button><button class="border-l border-zinc-300 px-4 py-2 hover:bg-zinc-100">Week</button><button class="border-l border-zinc-300 px-4 py-2 hover:bg-zinc-100">Month</button></div><div class="inline-flex rounded-lg bg-(--p) text-sm font-semibold text-(--p-on)"><button class="px-4 py-2">Pay ₹1,499</button><button class="border-l border-white/30 px-3 py-2" aria-label="More options">⌄</button></div><div class="inline-flex items-center rounded-lg border border-zinc-300 text-lg"><button class="px-3 py-1 hover:bg-zinc-100">−</button><span class="w-8 text-center text-sm font-semibold">2</span><button class="px-3 py-1 hover:bg-zinc-100">+</button></div></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Special</p>
    <div class="flex flex-wrap items-center gap-3"><style>.bw-shine{position:relative;overflow:hidden}.bw-shine::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.5) 50%,transparent 70%);transform:translateX(-120%)}.bw-shine:hover::after{transform:translateX(120%);transition:transform .7s}.bw-push{box-shadow:0 5px 0 var(--p-dark)}.bw-push:active{box-shadow:0 1px 0 var(--p-dark);transform:translateY(4px)}</style><button class="bw-shine inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg bg-zinc-900 px-5 py-2.5 text-white">Shine on hover</button><button class="bw-push inline-flex items-center rounded-xl bg-(--p) px-5 py-2.5 font-bold text-(--p-on) transition-all duration-75">Push me</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-full bg-gradient-to-r from-(--p) via-(--s) to-(--t) px-6 py-2.5 text-white hover:shadow-[0_8px_24px_-6px_var(--p)]">Gradient glow</button><button class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--p) rounded-lg border border-dashed border-zinc-400 px-5 py-2.5 text-zinc-600 hover:border-(--p) hover:text-(--p-dark)">+ Add another</button></div>
  </div>
</section>`,
  },
  {
    id: "board-badges",
    category: "buttons",
    group: "Boards",
    name: "Every badge and tag, on one board",
    note: "Status pills, shop labels, rating chips, coupon codes, counters, removable chips and verified ticks, together on one board.",
    html: `<section class="bg-white px-6 py-4">
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Status</p>
    <div class="flex flex-wrap items-center gap-3"><span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[0.75rem] font-semibold text-green-700 ring-1 ring-green-600/20"><span class="size-1.5 rounded-full bg-green-500"></span>Paid</span><span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[0.75rem] font-semibold text-amber-700 ring-1 ring-amber-600/20"><span class="size-1.5 rounded-full bg-amber-500"></span>Pending</span><span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[0.75rem] font-semibold text-red-700 ring-1 ring-red-600/20"><span class="size-1.5 rounded-full bg-red-500"></span>Failed</span><span class="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[0.75rem] font-semibold text-sky-700 ring-1 ring-sky-600/20"><span class="size-1.5 animate-pulse rounded-full bg-sky-500"></span>Shipped</span></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Shop</p>
    <div class="flex flex-wrap items-center gap-3"><span class="rounded bg-(--p) px-2 py-0.5 text-[0.6875rem] font-bold text-(--p-on) uppercase">New</span><span class="rounded bg-zinc-900 px-2 py-0.5 text-[0.6875rem] font-bold text-white">Bestseller</span><span class="rounded bg-green-700 px-1.5 py-0.5 text-[0.75rem] font-semibold text-white">4.3 ★</span><span class="text-sm font-semibold text-green-700">56% off</span><span class="rounded-sm bg-red-600 px-1.5 py-0.5 text-[0.6875rem] font-bold text-white">Only 2 left</span><span class="rounded border border-dashed border-(--p) px-2 py-0.5 font-mono text-[0.75rem] font-bold text-(--p-dark)">DIWALI40</span></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Counts</p>
    <div class="flex flex-wrap items-center gap-3"><span class="relative text-2xl">🛒<span class="absolute -top-1 -right-2 grid size-5 place-items-center rounded-full bg-red-500 text-[0.625rem] font-bold text-white ring-2 ring-white">3</span></span><span class="relative text-2xl">🔔<span class="absolute top-0 right-0 size-2.5 rounded-full bg-red-500 ring-2 ring-white"></span></span><span class="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-semibold">Inbox <span class="rounded-full bg-zinc-900 px-1.5 text-[0.6875rem] text-white">12</span></span></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Tags and chips</p>
    <div class="flex flex-wrap items-center gap-3"><span class="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">#design</span><span class="inline-flex items-center gap-1.5 rounded-full bg-(--p-light) py-1 pr-1.5 pl-3 text-sm font-medium text-(--p-dark)">Size M<button class="grid size-5 place-items-center rounded-full hover:bg-(--p) hover:text-(--p-on)" aria-label="Remove">✕</button></span><span class="inline-flex items-center gap-2 rounded-full border border-zinc-200 py-1 pr-3 pl-1 text-sm"><span class="grid size-6 place-items-center rounded-full bg-(--s) text-[0.6875rem] font-bold text-(--s-on)">AK</span>Anita K</span><span class="inline-flex items-center gap-1 text-sm font-semibold text-sky-600"><span class="grid size-4 place-items-center rounded-full bg-sky-500 text-[0.625rem] text-white">✓</span>Verified</span></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Outline and soft</p>
    <div class="flex flex-wrap items-center gap-3"><span class="rounded-md border border-zinc-300 px-2 py-0.5 text-[0.75rem] font-semibold text-zinc-700">Draft</span><span class="rounded-md border border-(--p) px-2 py-0.5 text-[0.75rem] font-semibold text-(--p-dark)">Featured</span><span class="rounded-md bg-(--s-light) px-2 py-0.5 text-[0.75rem] font-semibold text-(--s-dark)">Beta</span><span class="rounded-md bg-(--t-light) px-2 py-0.5 text-[0.75rem] font-semibold text-(--t-dark)">Eco</span></div>
  </div>
</section>`,
  },
  {
    id: "board-fields",
    category: "forms",
    group: "Fields",
    name: "Every field, on one board",
    note: "Inputs with labels, floating label, +91 mobile, error and success, OTP boxes, select, date, textarea with a counter, checkboxes, radio cards, switches, a range and a file drop. All working; type and click.",
    html: `<style>
  .fw-sw input:checked + span { background: var(--p); }
  .fw-sw input:checked + span::after { transform: translateX(1.25rem); }
  .fw-sw span::after { content: ""; position: absolute; top: 2px; left: 2px; width: 1.25rem; height: 1.25rem; border-radius: 999px; background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / .25); transition: transform .2s; }
  .fw-fl input:focus + span, .fw-fl input:not(:placeholder-shown) + span { transform: translateY(-1.35rem) scale(.8); background: #fff; color: var(--p-dark); }
</style>
<section class="bg-zinc-50 px-6 py-8">
  <div class="mx-auto grid max-w-5xl gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
    <label class="block"><span class="text-sm font-semibold text-zinc-800">Full name</span><input class="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25" placeholder="Priya Sharma" /></label>
    <label class="fw-fl relative block pt-2"><input class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25 py-2.5" placeholder=" " /><span class="pointer-events-none absolute top-4.5 left-2.5 origin-left px-1 text-sm text-zinc-500 transition-transform">Floating label</span></label>
    <label class="block"><span class="text-sm font-semibold text-zinc-800">Mobile</span><span class="mt-1.5 flex rounded-lg border border-zinc-300 bg-white focus-within:border-(--p) focus-within:ring-2 focus-within:ring-(--p)/25"><span class="border-r border-zinc-200 px-3 py-2 text-sm whitespace-nowrap text-zinc-600">+91</span><input class="w-full rounded-r-lg px-3 py-2 text-sm outline-none" placeholder="98765 43210" /></span></label>
    <label class="block"><span class="text-sm font-semibold text-zinc-800">Email</span><input class="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25 border-red-400 ring-2 ring-red-100" value="priya@gmail" /><span class="mt-1 block text-[0.75rem] text-red-600">Enter a full email, like priya@gmail.com</span></label>
    <label class="block"><span class="text-sm font-semibold text-zinc-800">PIN code</span><span class="relative mt-1.5 block"><input class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25 border-green-500 pr-9" value="500081" /><span class="absolute top-1/2 right-3 -translate-y-1/2 text-green-600">✓</span></span><span class="mt-1 block text-[0.75rem] text-green-700">Delivers by Thursday</span></label>
    <label class="block"><span class="text-sm font-semibold text-zinc-400">Disabled</span><input class="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25 cursor-not-allowed bg-zinc-100 text-zinc-400" value="Cannot change" disabled /></label>
    <div><span class="text-sm font-semibold text-zinc-800">OTP</span><div class="mt-1.5 flex gap-2"><input maxlength="1" inputmode="numeric" class="size-11 rounded-lg border border-zinc-300 bg-white text-center text-lg font-bold outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25" value="4" /><input maxlength="1" inputmode="numeric" class="size-11 rounded-lg border border-zinc-300 bg-white text-center text-lg font-bold outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25" value="8" /><input maxlength="1" inputmode="numeric" class="size-11 rounded-lg border border-zinc-300 bg-white text-center text-lg font-bold outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25" value="" /><input maxlength="1" inputmode="numeric" class="size-11 rounded-lg border border-zinc-300 bg-white text-center text-lg font-bold outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25" value="" /></div></div>
    <label class="block"><span class="text-sm font-semibold text-zinc-800">State</span><select class="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25"><option>Telangana</option><option>Andhra Pradesh</option><option>Karnataka</option><option>Tamil Nadu</option></select></label>
    <label class="block"><span class="text-sm font-semibold text-zinc-800">Date of visit</span><input type="date" class="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25" /></label>
    <label class="block md:col-span-2 lg:col-span-1"><span class="flex justify-between text-sm font-semibold text-zinc-800">Message <span class="font-normal text-zinc-400">42 / 300</span></span><textarea rows="3" class="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-(--p) focus:ring-2 focus:ring-(--p)/25">Need a quote for 40 office chairs.</textarea></label>
    <fieldset class="space-y-2"><legend class="text-sm font-semibold text-zinc-800">Checkboxes</legend><label class="flex items-center gap-2.5 text-sm"><input type="checkbox" class="size-4 accent-(--p)" checked />Send updates on WhatsApp</label><label class="flex items-center gap-2.5 text-sm"><input type="checkbox" class="size-4 accent-(--p)" />Email me the invoice</label><label class="flex items-center gap-2.5 text-sm text-zinc-400"><input type="checkbox" class="size-4" disabled />Gift wrap (not available)</label></fieldset>
    <fieldset class="space-y-2"><legend class="text-sm font-semibold text-zinc-800">Radio cards</legend><div class="grid grid-cols-2 gap-2"><label class="cursor-pointer rounded-lg border border-zinc-300 bg-white p-3 text-sm has-[:checked]:border-(--p) has-[:checked]:bg-(--p-light) has-[:checked]:ring-1 has-[:checked]:ring-(--p)"><input type="radio" name="fw-pay" class="sr-only" checked /><b class="block">UPI</b><span class="text-[0.75rem] text-zinc-500">Instant</span></label><label class="cursor-pointer rounded-lg border border-zinc-300 bg-white p-3 text-sm has-[:checked]:border-(--p) has-[:checked]:bg-(--p-light) has-[:checked]:ring-1 has-[:checked]:ring-(--p)"><input type="radio" name="fw-pay" class="sr-only" /><b class="block">Cash</b><span class="text-[0.75rem] text-zinc-500">On delivery</span></label></div></fieldset>
    <div class="space-y-3"><span class="text-sm font-semibold text-zinc-800">Switches</span><label class="fw-sw flex cursor-pointer items-center justify-between gap-3 text-sm">Order updates<input type="checkbox" class="peer sr-only" checked /><span class="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 transition-colors"></span></label><label class="fw-sw flex cursor-pointer items-center justify-between gap-3 text-sm">Offers and deals<input type="checkbox" class="peer sr-only" /><span class="relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 transition-colors"></span></label></div>
    <label class="block"><span class="flex justify-between text-sm font-semibold text-zinc-800">Budget <span class="text-(--p-dark)">₹40,000</span></span><input type="range" min="5000" max="100000" value="40000" class="mt-3 w-full accent-(--p)" /></label>
    <label class="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-zinc-300 bg-white p-5 text-center text-sm text-zinc-600 hover:border-(--p) md:col-span-2"><span class="text-2xl">⇪</span><b class="text-zinc-900">Upload your floor plan</b>PDF or JPG, up to 10 MB<input type="file" class="sr-only" /></label>
  </div>
</section>`,
  },
  {
    id: "board-alerts",
    category: "feedback",
    group: "Boards",
    name: "Alerts, all on one board",
    note: "Success, info, warning, error, offline and a tip line. One line each, an action where it helps.",
    html: `<section class="space-y-3 bg-white px-6 py-6">
  <div class="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm"><span class="grid size-6 shrink-0 place-items-center rounded-full bg-green-600 text-white">✓</span><p class="text-green-900"><b>Order placed.</b> We'll WhatsApp you when it ships.</p></div>
  <div class="flex gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm"><span class="grid size-6 shrink-0 place-items-center rounded-full bg-sky-600 font-bold text-white">i</span><p class="text-sky-900">Delivery to your PIN code takes 2 extra days during the festival week.</p></div>
  <div class="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm"><span class="grid size-6 shrink-0 place-items-center rounded-full bg-amber-500 font-bold text-white">!</span><p class="flex-1 text-amber-900">Your plan renews in 3 days.</p><a href="#" class="font-semibold text-amber-900 underline">Renew now</a></div>
  <div class="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm"><span class="grid size-6 shrink-0 place-items-center rounded-full bg-red-600 text-white">✕</span><p class="flex-1 text-red-900"><b>Payment failed.</b> No money was taken. Try another UPI app.</p><button class="text-red-400 hover:text-red-700" aria-label="Dismiss">✕</button></div>
  <div class="flex items-center gap-3 rounded-xl bg-zinc-900 p-4 text-sm text-white"><span class="text-lg">📶</span><p class="flex-1">You are offline. Changes will save when you reconnect.</p><button class="rounded-lg bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20">Retry</button></div>
  <div class="border-l-4 border-(--p) bg-(--p-light) px-4 py-3 text-sm text-zinc-800"><b>Tip:</b> add your GSTIN at checkout to claim input credit.</div>
</section>`,
  },
  {
    id: "board-toasts",
    category: "feedback",
    group: "Boards",
    name: "Toasts, all on one board",
    note: "The small pop-ups after an action: added to cart, undo, saved with a timer bar, someone booked, update available.",
    html: `<style>
  .tw-t { animation: tw-in .5s cubic-bezier(.3,1.5,.5,1) both; }
  .tw-t:nth-child(2) { animation-delay: .25s; } .tw-t:nth-child(3) { animation-delay: .5s; }
  @keyframes tw-in { from { opacity: 0; transform: translateX(40px); } }
  @media (prefers-reduced-motion: reduce) { .tw-t { animation: none; } }
</style>
<section class="grid gap-8 bg-zinc-100 px-6 py-8 md:grid-cols-2">
  <div class="space-y-3">
    <div class="tw-t flex items-center gap-3 rounded-xl bg-white p-3 pr-4 text-sm shadow-lg ring-1 ring-zinc-200"><span class="grid size-8 place-items-center rounded-full bg-green-100 text-green-700">✓</span><p class="flex-1"><b>Added to cart</b><span class="block text-zinc-500">Oversized tee, size M</span></p><a href="#" class="font-semibold text-(--p-dark)">View</a></div>
    <div class="tw-t flex items-center gap-3 rounded-xl bg-white p-3 pr-4 text-sm shadow-lg ring-1 ring-zinc-200"><span class="grid size-8 place-items-center rounded-full bg-zinc-100">🗑</span><p class="flex-1">Address deleted</p><a href="#" class="font-semibold text-zinc-900 underline">Undo</a></div>
    <div class="tw-t relative overflow-hidden rounded-xl bg-zinc-900 p-3 pr-4 text-sm text-white shadow-lg"><p><b>Saved.</b> Your changes are live.</p><span class="absolute inset-x-0 bottom-0 h-1 origin-left animate-[tw-bar_4s_linear_infinite] bg-(--p)"></span><style>@keyframes tw-bar { from { transform: scaleX(1); } to { transform: scaleX(0); } }</style></div>
  </div>
  <div class="space-y-3">
    <div class="flex gap-3 rounded-xl bg-white p-4 text-sm shadow-lg ring-1 ring-zinc-200"><span class="grid size-10 place-items-center rounded-full bg-(--p) font-bold text-(--p-on)">RK</span><p class="flex-1"><b>Ravi Kumar</b> booked a site visit<span class="block text-zinc-500">Saturday, 11:00 am · 2 min ago</span></p></div>
    <div class="rounded-xl bg-white p-4 text-sm shadow-lg ring-1 ring-zinc-200"><p class="font-semibold">Update available</p><p class="mt-0.5 text-zinc-500">Version 2.4 fixes the UPI timeout.</p><div class="mt-3 flex gap-2"><button class="rounded-lg bg-zinc-900 px-3 py-1.5 font-semibold text-white">Restart</button><button class="rounded-lg px-3 py-1.5 font-semibold text-zinc-600 hover:bg-zinc-100">Later</button></div></div>
  </div>
</section>`,
  },
  {
    id: "board-tabs",
    category: "navigation",
    group: "Boards",
    name: "Tabs, all on one board",
    note: "Underline, segmented, pill and icon tabs. They switch when clicked, with no script.",
    html: `<style>
  .tb-u label { border-bottom: 2px solid transparent; }
  .tb-u label:has(:checked) { border-color: var(--p); color: #18181b; }
  .tb-s label:has(:checked) { background: #fff; color: #18181b; box-shadow: 0 1px 3px rgb(0 0 0 / .12); }
  .tb-p label:has(:checked) { background: var(--p); color: var(--p-on); }
</style>
<section class="bg-white px-6 py-4">
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Underline</p>
    <div class="flex flex-wrap items-center gap-3"><div class="tb-u flex gap-6 border-b border-zinc-200 text-sm font-semibold text-zinc-500"><label class="cursor-pointer pb-2.5 hover:text-zinc-900"><input type="radio" name="tb-u" class="sr-only" checked />Overview</label><label class="cursor-pointer pb-2.5 hover:text-zinc-900"><input type="radio" name="tb-u" class="sr-only" />Specifications</label><label class="cursor-pointer pb-2.5 hover:text-zinc-900"><input type="radio" name="tb-u" class="sr-only" />Reviews (214)</label><label class="cursor-pointer pb-2.5 hover:text-zinc-900"><input type="radio" name="tb-u" class="sr-only" />Delivery</label></div></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Segmented</p>
    <div class="flex flex-wrap items-center gap-3"><div class="tb-s inline-flex rounded-xl bg-zinc-100 p-1 text-sm font-semibold text-zinc-500"><label class="cursor-pointer rounded-lg px-4 py-1.5 transition-all"><input type="radio" name="tb-s" class="sr-only" checked />Monthly</label><label class="cursor-pointer rounded-lg px-4 py-1.5 transition-all"><input type="radio" name="tb-s" class="sr-only" />Quarterly</label><label class="cursor-pointer rounded-lg px-4 py-1.5 transition-all"><input type="radio" name="tb-s" class="sr-only" />Yearly</label></div></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Pills</p>
    <div class="flex flex-wrap items-center gap-3"><div class="tb-p flex flex-wrap gap-2 text-sm font-semibold text-zinc-600"><label class="cursor-pointer rounded-full bg-zinc-100 px-4 py-1.5 transition-colors hover:bg-zinc-200"><input type="radio" name="tb-p" class="sr-only" checked />All</label><label class="cursor-pointer rounded-full bg-zinc-100 px-4 py-1.5 transition-colors hover:bg-zinc-200"><input type="radio" name="tb-p" class="sr-only" />Veg</label><label class="cursor-pointer rounded-full bg-zinc-100 px-4 py-1.5 transition-colors hover:bg-zinc-200"><input type="radio" name="tb-p" class="sr-only" />Non-veg</label><label class="cursor-pointer rounded-full bg-zinc-100 px-4 py-1.5 transition-colors hover:bg-zinc-200"><input type="radio" name="tb-p" class="sr-only" />Desserts</label><label class="cursor-pointer rounded-full bg-zinc-100 px-4 py-1.5 transition-colors hover:bg-zinc-200"><input type="radio" name="tb-p" class="sr-only" />Drinks</label></div></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">With icons</p>
    <div class="flex flex-wrap items-center gap-3"><div class="tb-u flex gap-6 text-sm font-semibold text-zinc-500"><label class="flex cursor-pointer flex-col items-center gap-1 pb-2 hover:text-zinc-900"><input type="radio" name="tb-i" class="sr-only" checked /><span class="text-xl">🏠</span>Home</label><label class="flex cursor-pointer flex-col items-center gap-1 pb-2 hover:text-zinc-900"><input type="radio" name="tb-i" class="sr-only" /><span class="text-xl">🛋</span>Living</label><label class="flex cursor-pointer flex-col items-center gap-1 pb-2 hover:text-zinc-900"><input type="radio" name="tb-i" class="sr-only" /><span class="text-xl">🛏</span>Bedroom</label><label class="flex cursor-pointer flex-col items-center gap-1 pb-2 hover:text-zinc-900"><input type="radio" name="tb-i" class="sr-only" /><span class="text-xl">🍳</span>Kitchen</label></div></div>
  </div>
</section>`,
  },
  {
    id: "board-breadcrumbs-pagination",
    category: "navigation",
    group: "Boards",
    name: "Breadcrumbs and pagination, on one board",
    note: "Two breadcrumb styles, numbered pages, previous and next, and a load-more with progress.",
    html: `<section class="bg-white px-6 py-4">
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Breadcrumbs</p>
    <div class="flex flex-wrap items-center gap-3"><nav class="flex items-center gap-2 text-sm text-zinc-500"><a href="#" class="hover:text-zinc-900">Home</a>›<a href="#" class="hover:text-zinc-900">Furniture</a>›<span class="font-semibold text-zinc-900">Sofas</span></nav><nav class="flex items-center gap-1 rounded-full bg-zinc-100 p-1 text-sm"><a href="#" class="rounded-full px-3 py-1 hover:bg-white">Courses</a>/<a href="#" class="rounded-full px-3 py-1 hover:bg-white">Data</a>/<span class="rounded-full bg-white px-3 py-1 font-semibold shadow-sm">SQL basics</span></nav></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Pagination</p>
    <div class="flex flex-wrap items-center gap-3"><nav class="flex items-center gap-1 text-sm font-semibold"><a href="#" class="grid size-9 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100">‹</a><a href="#" class="grid size-9 place-items-center rounded-lg hover:bg-zinc-100">1</a><a href="#" class="grid size-9 place-items-center rounded-lg bg-(--p) text-(--p-on)">2</a><a href="#" class="grid size-9 place-items-center rounded-lg hover:bg-zinc-100">3</a><span class="px-1 text-zinc-400">…</span><a href="#" class="grid size-9 place-items-center rounded-lg hover:bg-zinc-100">12</a><a href="#" class="grid size-9 place-items-center rounded-lg hover:bg-zinc-100">›</a></nav><div class="flex items-center gap-3 text-sm"><a href="#" class="rounded-lg border border-zinc-300 px-3 py-1.5 font-semibold">← Previous</a><span class="text-zinc-500">Page 2 of 12</span><a href="#" class="rounded-lg border border-zinc-300 px-3 py-1.5 font-semibold">Next →</a></div></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Load more</p>
    <div class="flex flex-wrap items-center gap-3"><div class="w-64 text-center text-sm"><p class="text-zinc-500">Showing 24 of 180</p><div class="mt-2 h-1 rounded-full bg-zinc-200"><div class="h-full w-[13%] rounded-full bg-(--p)"></div></div><button class="mt-3 w-full rounded-lg border border-zinc-900 py-2 font-semibold hover:bg-zinc-900 hover:text-white">Load more</button></div></div>
  </div>
</section>`,
  },
  {
    id: "board-steps",
    category: "navigation",
    group: "Boards",
    name: "Steps and progress, on one board",
    note: "Checkout steps, a segmented progress bar and an order-tracking timeline.",
    html: `<section class="bg-white px-6 py-4">
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Checkout</p>
    <div class="flex flex-wrap items-center gap-3"><ol class="flex w-full max-w-xl items-center text-sm font-semibold"><li class="flex items-center gap-2 flex-1"><span class="grid size-8 shrink-0 place-items-center rounded-full bg-(--p) text-(--p-on)">✓</span><span class="text-zinc-900">Cart</span><span class="mx-3 h-0.5 flex-1 bg-(--p)"></span></li><li class="flex items-center gap-2 flex-1"><span class="grid size-8 shrink-0 place-items-center rounded-full bg-(--p) text-(--p-on)">✓</span><span class="text-zinc-900">Address</span><span class="mx-3 h-0.5 flex-1 bg-(--p)"></span></li><li class="flex items-center gap-2 flex-1"><span class="grid size-8 shrink-0 place-items-center rounded-full ring-2 ring-(--p) text-(--p-dark) bg-white">3</span><span class="text-zinc-900">Payment</span><span class="mx-3 h-0.5 flex-1 bg-zinc-200"></span></li><li class="flex items-center gap-2 "><span class="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-400">4</span><span class="text-zinc-400">Done</span></li></ol></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Progress</p>
    <div class="flex flex-wrap items-center gap-3"><div class="w-full max-w-md"><div class="flex justify-between text-sm"><b>Profile 60% complete</b><span class="text-zinc-500">3 of 5</span></div><div class="mt-2 grid grid-cols-5 gap-1.5"><span class="h-2 rounded-full bg-(--p)"></span><span class="h-2 rounded-full bg-(--p)"></span><span class="h-2 rounded-full bg-(--p)"></span><span class="h-2 rounded-full bg-zinc-200"></span><span class="h-2 rounded-full bg-zinc-200"></span></div></div></div>
  </div>
  <div class="grid items-center gap-x-6 gap-y-3 border-b border-zinc-100 py-5 md:grid-cols-[9rem_1fr]">
    <p class="text-[0.75rem] font-semibold tracking-wide text-zinc-400 uppercase">Order tracking</p>
    <div class="flex flex-wrap items-center gap-3"><ol class="relative space-y-4 border-l-2 border-zinc-200 pl-6 text-sm"><li class="relative"><span class="absolute top-0.5 -left-[1.95rem] grid size-4 place-items-center rounded-full bg-green-600 ring-4 ring-white"></span><b>Ordered</b> <span class="text-zinc-500">· Mon, 20 Oct</span></li><li class="relative"><span class="absolute top-0.5 -left-[1.95rem] size-4 rounded-full bg-green-600 ring-4 ring-white"></span><b>Shipped</b> <span class="text-zinc-500">· Tue, 21 Oct</span></li><li class="relative"><span class="absolute top-0.5 -left-[1.95rem] size-4 animate-pulse rounded-full bg-(--p) ring-4 ring-white"></span><b>Out for delivery</b> <span class="text-zinc-500">· Today, by 7 pm</span></li><li class="relative text-zinc-400"><span class="absolute top-0.5 -left-[1.95rem] size-4 rounded-full bg-zinc-200 ring-4 ring-white"></span>Delivered</li></ol></div>
  </div>
</section>`,
  },
  {
    id: "sketch-funnel",
    category: "sketch",
    group: "Diagrams",
    name: "Funnel with a highlighter",
    note: "Visitors to customers in four hand-drawn bands, the number that matters circled in highlighter. Marketing and sales pages.",
    html: `<div class="bg-[#fffdf7] p-6">
  <svg viewBox="0 0 620 330" class="mx-auto w-full max-w-2xl" role="img" aria-label="10,000 visitors, 1,200 enquiries, 300 demos, 90 customers">
    <defs><filter id="rough-fn"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
    <g filter="url(#rough-fn)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive">
      <path d="M40 30 H360 L330 95 H70 Z" class="fill-(--p-light) stroke-(--p-dark)" />
      <path d="M72 103 H328 L300 168 H100 Z" class="fill-(--s-light) stroke-(--s-dark)" />
      <path d="M102 176 H298 L272 241 H128 Z" class="fill-(--t-light) stroke-(--t-dark)" />
      <path d="M128 249 H272 L254 312 H146 Z" class="fill-(--p) stroke-(--p-dark)" />
      <text x="200" y="70" text-anchor="middle" font-size="19" class="fill-zinc-800" stroke="none">10,000 visitors</text>
      <text x="200" y="143" text-anchor="middle" font-size="19" class="fill-zinc-800" stroke="none">1,200 enquiries</text>
      <text x="200" y="216" text-anchor="middle" font-size="19" class="fill-zinc-800" stroke="none">300 demos</text>
      <text x="200" y="287" text-anchor="middle" font-size="16" class="fill-(--p-on)" stroke="none">90 customers</text>
      <path d="M390 120 C 430 100, 520 100, 560 130 C 590 160, 540 190, 470 188 C 400 186, 380 150, 400 125" fill="none" class="stroke-(--p)" stroke-width="3" />
      <text x="478" y="152" text-anchor="middle" font-size="22" class="fill-zinc-900" stroke="none">12% reply!</text>
      <path d="M392 150 C 370 160, 350 150, 335 140" fill="none" class="stroke-zinc-500" /><path d="M343 132 L 333 140 L 345 146" fill="none" class="stroke-zinc-500" />
      <path d="M380 288 C 430 280, 500 282, 560 276" fill="none" stroke="#fde047" stroke-width="18" opacity=".7" />
      <text x="470" y="292" text-anchor="middle" font-size="17" class="fill-zinc-800" stroke="none">₹54 per customer</text>
    </g>
  </svg>
</div>`,
  },
  {
    id: "sketch-cycle",
    category: "sketch",
    group: "Diagrams",
    name: "Loop that keeps going",
    note: "Four steps around a circle with curved arrows, the middle saying what the loop produces. For any repeat process: plan, make, sell, learn.",
    html: `<div class="bg-white p-6">
  <svg viewBox="0 0 520 380" class="mx-auto w-full max-w-xl" role="img" aria-label="Plan, cook, deliver, collect feedback, repeat">
    <defs><filter id="rough-cy"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
    <g filter="url(#rough-cy)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive" fill="none">
      <path d="M215 70 C 150 85, 115 120, 105 165" class="stroke-zinc-500" /><path d="M96 152 L 105 168 L 118 155" class="stroke-zinc-500" />
      <path d="M120 245 C 140 300, 190 320, 230 318" class="stroke-zinc-500" /><path d="M218 309 L 233 318 L 219 328" class="stroke-zinc-500" />
      <path d="M300 315 C 365 300, 400 265, 410 215" class="stroke-zinc-500" /><path d="M399 226 L 410 211 L 421 227" class="stroke-zinc-500" />
      <path d="M400 135 C 380 85, 340 62, 300 60" class="stroke-zinc-500" /><path d="M312 52 L 298 60 L 311 70" class="stroke-zinc-500" />
      <rect x="190" y="30" width="140" height="56" rx="16" class="fill-(--p-light) stroke-(--p-dark)" /><text x="260" y="65" text-anchor="middle" font-size="19" class="fill-(--p-dark)" stroke="none">Plan menu</text>
      <rect x="40" y="165" width="120" height="56" rx="16" class="fill-(--s-light) stroke-(--s-dark)" /><text x="100" y="200" text-anchor="middle" font-size="19" class="fill-(--s-dark)" stroke="none">Cook fresh</text>
      <rect x="200" y="290" width="120" height="56" rx="16" class="fill-(--t-light) stroke-(--t-dark)" /><text x="260" y="325" text-anchor="middle" font-size="19" class="fill-(--t-dark)" stroke="none">Deliver hot</text>
      <rect x="355" y="140" width="125" height="72" rx="16" class="fill-(--p-light) stroke-(--p-dark)" /><text x="417" y="172" text-anchor="middle" font-size="18" class="fill-(--p-dark)" stroke="none">Read the</text><text x="417" y="196" text-anchor="middle" font-size="18" class="fill-(--p-dark)" stroke="none">reviews</text>
      <circle cx="260" cy="190" r="56" class="fill-(--p) stroke-(--p-dark)" /><text x="260" y="186" text-anchor="middle" font-size="17" class="fill-(--p-on)" stroke="none">better</text><text x="260" y="208" text-anchor="middle" font-size="17" class="fill-(--p-on)" stroke="none">every week</text>
    </g>
  </svg>
</div>`,
  },
  {
    id: "sketch-us-them",
    category: "sketch",
    group: "Diagrams",
    name: "Us against the usual way",
    note: "Two hand-drawn columns with ticks and crosses, and a scribbled arrow to the winner. Comparison sections that need to feel honest.",
    html: `<div class="bg-[#fffdf7] p-6">
  <svg viewBox="0 0 640 320" class="mx-auto w-full max-w-2xl" role="img" aria-label="The usual agency compared with us">
    <defs><filter id="rough-ut"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="21" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
    <g filter="url(#rough-ut)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive">
      <rect x="30" y="30" width="270" height="260" rx="14" class="fill-white stroke-zinc-400" />
      <rect x="340" y="30" width="270" height="260" rx="14" class="fill-(--p-light) stroke-(--p-dark)" stroke-width="3.5" />
      <text x="165" y="70" text-anchor="middle" font-size="22" class="fill-zinc-500" stroke="none">The usual way</text>
      <text x="475" y="70" text-anchor="middle" font-size="22" class="fill-(--p-dark)" stroke="none">With us</text>
      <g font-size="17" stroke="none" class="fill-zinc-500"><text x="80" y="120">3 months to launch</text><text x="80" y="165">Surprise invoices</text><text x="80" y="210">Locked in their tools</text><text x="80" y="255">Reply in 3 days</text></g>
      <g class="stroke-red-400" fill="none"><path d="M52 108 L 66 122 M66 108 L 52 122" /><path d="M52 153 L 66 167 M66 153 L 52 167" /><path d="M52 198 L 66 212 M66 198 L 52 212" /><path d="M52 243 L 66 257 M66 243 L 52 257" /></g>
      <g font-size="17" stroke="none" class="fill-zinc-800"><text x="390" y="120">Live in 4 weeks</text><text x="390" y="165">One fixed price</text><text x="390" y="210">You own everything</text><text x="390" y="255">WhatsApp, same day</text></g>
      <g class="stroke-green-600" fill="none" stroke-width="3"><path d="M360 113 L 367 121 L 380 105" /><path d="M360 158 L 367 166 L 380 150" /><path d="M360 203 L 367 211 L 380 195" /><path d="M360 248 L 367 256 L 380 240" /></g>
    </g>
  </svg>
</div>`,
  },
  {
    id: "sketch-map-pins",
    category: "sketch",
    group: "Diagrams",
    name: "Map with pins and a route",
    note: "A hand-drawn map with dotted roads, three pins and a highlighted route. Delivery areas, branch locations, tour routes.",
    html: `<div class="bg-[#f6f3ea] p-6">
  <svg viewBox="0 0 640 340" class="mx-auto w-full max-w-2xl" role="img" aria-label="Kitchen in Madhapur delivering to Gachibowli and Kondapur within 30 minutes">
    <defs><filter id="rough-mp"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="8" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter></defs>
    <g filter="url(#rough-mp)" stroke-linecap="round" stroke-linejoin="round" font-family="'Segoe Print','Bradley Hand','Comic Sans MS',cursive" fill="none">
      <path d="M20 250 C 160 220, 260 280, 420 230 S 600 180, 630 200" class="stroke-zinc-300" stroke-width="14" />
      <path d="M150 20 C 170 120, 140 220, 180 330" class="stroke-zinc-300" stroke-width="10" />
      <path d="M480 20 C 470 100, 520 200, 500 330" class="stroke-zinc-300" stroke-width="10" />
      <ellipse cx="330" cy="120" rx="70" ry="40" class="fill-sky-100 stroke-sky-300" stroke-width="2" /><text x="330" y="126" text-anchor="middle" font-size="15" class="fill-sky-500" stroke="none">Durgam lake</text>
      <path d="M170 235 C 230 200, 300 200, 360 240 S 460 270, 495 215" class="stroke-(--p)" stroke-width="4" stroke-dasharray="2 10" />
      <circle cx="330" cy="200" r="150" class="stroke-(--p)" stroke-width="2" stroke-dasharray="6 8" opacity=".5" />
      <g stroke-width="2.5"><path d="M170 238 C 150 205, 150 185, 170 180 C 190 185, 190 205, 170 238 Z" class="fill-(--p) stroke-(--p-dark)" /><circle cx="170" cy="198" r="6" class="fill-white" stroke="none" /></g>
      <g stroke-width="2.5"><path d="M360 243 C 343 215, 343 197, 360 193 C 377 197, 377 215, 360 243 Z" class="fill-(--s) stroke-(--s-dark)" /></g>
      <g stroke-width="2.5"><path d="M495 218 C 478 190, 478 172, 495 168 C 512 172, 512 190, 495 218 Z" class="fill-(--t) stroke-(--t-dark)" /></g>
      <g font-size="16" stroke="none" class="fill-zinc-800"><text x="120" y="290">Our kitchen</text><text x="330" y="285">Gachibowli</text><text x="470" y="150">Kondapur</text></g>
      <text x="40" y="45" font-size="22" stroke="none" class="fill-(--p-dark)">Hot in 30 minutes</text>
      <path d="M40 55 C 110 50, 180 52, 245 50" class="stroke-(--p)" stroke-width="3" />
    </g>
  </svg>
</div>`,
  },
];
