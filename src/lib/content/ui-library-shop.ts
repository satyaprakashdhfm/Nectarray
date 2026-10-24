import type { UiComponent } from "@/lib/content/ui-library";

/**
 * Product cards modelled on Indian stores (Flipkart, Myntra, Blinkit,
 * Snitch, and Wigglitz's pop-out series wall), and logo animations for the
 * top of a page. Product pictures are Microsoft's Fluent 3D emoji (MIT),
 * cut out on transparent backgrounds, from jsDelivr.
 */
export const SHOP_COMPONENTS: UiComponent[] = [
  {
    id: "shop-marketplace-grid",
    category: "product-cards",
    group: "Store grids",
    name: "Marketplace grid, five across",
    note: "Like Flipkart and Amazon: small cards five to a row, green rating chip with review count, price with the MRP struck out and the discount in green, delivery promise underneath.",
    html: `<section class="bg-zinc-100 px-4 py-6">
  <div class="mx-auto max-w-7xl rounded-lg bg-white p-4">
    <div class="flex items-baseline justify-between"><h2 class="text-lg font-semibold text-zinc-900">Best of electronics</h2><a href="#" class="rounded-full bg-(--p) px-3 py-1 text-[0.75rem] font-semibold text-(--p-on)">View all</a></div>
    <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Headphone/3D/headphone_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">boAt Rockerz 450 Bluetooth headphones, 15 hr battery</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.2 ★</span><span class="text-zinc-500">(1,24,318)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹1,299</b><s class="text-[0.75rem] text-zinc-400">₹3,990</s><span class="text-[0.75rem] font-semibold text-green-700">67% off</span></p>
        <p class="mt-1 text-[0.6875rem] font-semibold text-(--s-dark)">Deal of the day</p><p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <span class="absolute top-2 left-2 rounded bg-zinc-900/80 px-1.5 py-0.5 text-[0.625rem] font-semibold text-white">Sponsored</span><button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Mobile%20phone/3D/mobile_phone_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">Redmi Note 14 5G (Midnight Black, 128 GB)</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.3 ★</span><span class="text-zinc-500">(48,221)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹15,999</b><s class="text-[0.75rem] text-zinc-400">₹21,999</s><span class="text-[0.75rem] font-semibold text-green-700">27% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Watch/3D/watch_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">Noise ColorFit Pro 5 smartwatch, 1.85 inch AMOLED</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.1 ★</span><span class="text-zinc-500">(9,870)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹2,999</b><s class="text-[0.75rem] text-zinc-400">₹7,999</s><span class="text-[0.75rem] font-semibold text-green-700">62% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Laptop/3D/laptop_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">HP 15s, Intel Core i5 13th Gen, 16 GB / 512 GB SSD</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.4 ★</span><span class="text-zinc-500">(3,412)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹52,990</b><s class="text-[0.75rem] text-zinc-400">₹68,000</s><span class="text-[0.75rem] font-semibold text-green-700">22% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Speaker%20high%20volume/3D/speaker_high_volume_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">JBL Go 4 portable speaker, waterproof</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.5 ★</span><span class="text-zinc-500">(21,066)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹3,499</b><s class="text-[0.75rem] text-zinc-400">₹4,999</s><span class="text-[0.75rem] font-semibold text-green-700">30% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Camera/3D/camera_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">Canon EOS 1500D DSLR with 18-55 mm lens</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.6 ★</span><span class="text-zinc-500">(12,905)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹36,490</b><s class="text-[0.75rem] text-zinc-400">₹41,995</s><span class="text-[0.75rem] font-semibold text-green-700">13% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Joystick/3D/joystick_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">Cosmic Byte Ares wireless controller for PC</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">3.9 ★</span><span class="text-zinc-500">(2,108)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹1,149</b><s class="text-[0.75rem] text-zinc-400">₹2,499</s><span class="text-[0.75rem] font-semibold text-green-700">54% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Television/3D/television_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">Samsung 43 inch Crystal 4K Smart LED TV</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.3 ★</span><span class="text-zinc-500">(18,442)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹28,990</b><s class="text-[0.75rem] text-zinc-400">₹52,900</s><span class="text-[0.75rem] font-semibold text-green-700">45% off</span></p>
        <p class="mt-1 text-[0.6875rem] font-semibold text-(--s-dark)">Deal of the day</p><p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sunglasses/3D/sunglasses_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">Fastrack UV-protected wayfarer sunglasses</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.0 ★</span><span class="text-zinc-500">(6,731)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹799</b><s class="text-[0.75rem] text-zinc-400">₹1,599</s><span class="text-[0.75rem] font-semibold text-green-700">50% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    <li class="group relative rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-lg">
      <button class="absolute top-2 right-2 z-10 grid size-7 place-items-center rounded-full bg-white text-zinc-400 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">♥</button>
      <a href="#" class="block">
        <div class="grid aspect-square place-items-center rounded-md bg-zinc-50"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Backpack/3D/backpack_3d.png" alt="" class="size-3/5 object-contain transition-transform duration-300 group-hover:scale-110" /></div>
        <p class="mt-2.5 line-clamp-2 text-[0.8125rem] leading-snug text-zinc-800 group-hover:text-(--p-dark)">American Tourister 32 L laptop backpack</p>
        <p class="mt-1.5 flex items-center gap-1.5 text-[0.75rem]"><span class="rounded bg-green-700 px-1.5 py-px font-semibold text-white">4.2 ★</span><span class="text-zinc-500">(40,552)</span></p>
        <p class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5"><b class="text-[0.9375rem] text-zinc-900">₹1,099</b><s class="text-[0.75rem] text-zinc-400">₹2,850</s><span class="text-[0.75rem] font-semibold text-green-700">61% off</span></p>
        <p class="mt-1 text-[0.6875rem] text-zinc-500">Free delivery by <b class="text-zinc-700">Tomorrow</b></p>
      </a>
    </li>
    </ul>
  </div>
</section>`,
  },
  {
    id: "shop-fashion-grid",
    category: "product-cards",
    group: "Store grids",
    name: "Fashion grid with wishlist on hover",
    note: "Like Myntra: tall pictures, brand in bold over a grey name, price with MRP and percent off in orange. On hover the name gives way to a Wishlist button and the sizes in stock.",
    html: `<section class="bg-white px-4 py-6">
  <div class="mx-auto max-w-7xl">
    <p class="text-sm text-zinc-500">Home / Clothing / <b class="text-zinc-900">Festive edit</b> <span class="text-zinc-400">- 12,408 items</span></p>
    <ul class="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#eef2ff">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/T-shirt/3D/t-shirt_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Roadster</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Men pure cotton oversized T-shirt</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 499</b><s class="text-[0.75rem] text-zinc-400">Rs. 1,299</s><span class="text-[0.75rem] font-semibold text-orange-500">(62% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#fdf2f8">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Dress/3D/dress_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">SASSAFRAS</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Women floral fit and flare dress</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 1,049</b><s class="text-[0.75rem] text-zinc-400">Rs. 2,999</s><span class="text-[0.75rem] font-semibold text-orange-500">(65% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#eff6ff">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Jeans/3D/jeans_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Levis</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Men 511 slim fit stretchable jeans</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 1,799</b><s class="text-[0.75rem] text-zinc-400">Rs. 3,599</s><span class="text-[0.75rem] font-semibold text-orange-500">(50% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#fff7ed">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sari/3D/sari_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Mitera</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Banarasi silk saree with blouse piece</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 1,349</b><s class="text-[0.75rem] text-zinc-400">Rs. 5,399</s><span class="text-[0.75rem] font-semibold text-orange-500">(75% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#f0fdf4">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Kimono/3D/kimono_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Libas</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Women printed anarkali kurta set</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 1,199</b><s class="text-[0.75rem] text-zinc-400">Rs. 3,999</s><span class="text-[0.75rem] font-semibold text-orange-500">(70% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#f5f5f4">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Coat/3D/coat_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">HRX</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Men lightweight puffer jacket</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 1,599</b><s class="text-[0.75rem] text-zinc-400">Rs. 4,599</s><span class="text-[0.75rem] font-semibold text-orange-500">(65% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#ecfeff">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Running%20shoe/3D/running_shoe_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Puma</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Unisex Softride running shoes</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 2,399</b><s class="text-[0.75rem] text-zinc-400">Rs. 5,999</s><span class="text-[0.75rem] font-semibold text-orange-500">(60% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#fef2f2">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/High-heeled%20shoe/3D/high-heeled_shoe_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Catwalk</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Women block heel pumps</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 899</b><s class="text-[0.75rem] text-zinc-400">Rs. 2,249</s><span class="text-[0.75rem] font-semibold text-orange-500">(60% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#faf5ff">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Handbag/3D/handbag_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Lavie</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Women structured tote bag</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 1,099</b><s class="text-[0.75rem] text-zinc-400">Rs. 3,399</s><span class="text-[0.75rem] font-semibold text-orange-500">(68% OFF)</span></p>
        </div>
      </a>
    </li>
    <li class="group relative overflow-hidden bg-white">
      <a href="#" class="block">
        <div class="relative grid aspect-[3/4] place-items-center" style="background:#fefce8">
          <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sunglasses/3D/sunglasses_3d.png" alt="" class="w-3/5 object-contain transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute bottom-2 left-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-zinc-800">4.2 ★ | 1.8k</span>
        </div>
        <div class="relative px-2.5 pt-2 pb-3">
          <div class="absolute inset-x-0 top-0 translate-y-2 bg-white px-2.5 pt-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span class="flex w-full items-center justify-center gap-1.5 rounded-sm border border-zinc-300 py-1.5 text-[0.75rem] font-bold tracking-wide text-zinc-800 uppercase">♡ Wishlist</span>
            <p class="mt-1.5 text-[0.75rem] text-zinc-500">Sizes: S, M, L, XL</p>
          </div>
          <p class="text-[0.875rem] font-bold text-zinc-900">Ray-Ban</p>
          <p class="truncate text-[0.8125rem] text-zinc-500">Unisex aviator sunglasses</p>
          <p class="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[0.8125rem]"><b class="text-zinc-900">Rs. 6,290</b><s class="text-[0.75rem] text-zinc-400">Rs. 8,990</s><span class="text-[0.75rem] font-semibold text-orange-500">(30% OFF)</span></p>
        </div>
      </a>
    </li>
    </ul>
  </div>
</section>`,
  },
  {
    id: "shop-quick-commerce",
    category: "product-cards",
    group: "Store grids",
    name: "Quick-commerce row with ADD buttons",
    note: "Like Blinkit and Zepto: narrow cards in a swipeable row, delivery time on each, pack size under the name, and an ADD button that turns into a minus-count-plus stepper once added.",
    html: `<section class="bg-white px-4 py-6">
  <div class="mx-auto max-w-7xl">
    <div class="flex items-baseline justify-between"><h2 class="text-xl font-bold text-zinc-900">Fresh vegetables and daily needs</h2><a href="#" class="text-sm font-semibold text-(--p-dark)">see all</a></div>
    <ul class="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <span class="absolute top-0 left-2 rounded-b-md bg-(--s) px-1.5 py-0.5 text-[0.625rem] leading-tight font-bold text-(--s-on)">20%<br />OFF</span><div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Tomato/3D/tomato_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Tomato (Hybrid)</p>
      <p class="text-[0.75rem] text-zinc-500">500 g</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹24<s class="block text-[0.6875rem] text-zinc-400">₹30</s></p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <span class="absolute top-0 left-2 rounded-b-md bg-(--s) px-1.5 py-0.5 text-[0.625rem] leading-tight font-bold text-(--s-on)">25%<br />OFF</span><div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Onion/3D/onion_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Onion</p>
      <p class="text-[0.75rem] text-zinc-500">1 kg</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹39<s class="block text-[0.6875rem] text-zinc-400">₹52</s></p><span class="flex h-8 w-[4.5rem] items-center justify-between rounded-lg bg-(--p) px-2 text-sm font-bold text-(--p-on)"><button aria-label="Remove one">−</button>2<button aria-label="Add one">+</button></span></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <span class="absolute top-0 left-2 rounded-b-md bg-(--s) px-1.5 py-0.5 text-[0.625rem] leading-tight font-bold text-(--s-on)">24%<br />OFF</span><div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Potato/3D/potato_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Potato</p>
      <p class="text-[0.75rem] text-zinc-500">1 kg</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹34<s class="block text-[0.6875rem] text-zinc-400">₹45</s></p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Carrot/3D/carrot_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Carrot (Ooty)</p>
      <p class="text-[0.75rem] text-zinc-500">500 g</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹31</p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <span class="absolute top-0 left-2 rounded-b-md bg-(--s) px-1.5 py-0.5 text-[0.625rem] leading-tight font-bold text-(--s-on)">17%<br />OFF</span><div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Lemon/3D/lemon_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Lemon</p>
      <p class="text-[0.75rem] text-zinc-500">250 g</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹29<s class="block text-[0.6875rem] text-zinc-400">₹35</s></p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Coconut/3D/coconut_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Tender coconut</p>
      <p class="text-[0.75rem] text-zinc-500">1 pc</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹55</p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Glass%20of%20milk/3D/glass_of_milk_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Amul Taaza toned milk</p>
      <p class="text-[0.75rem] text-zinc-500">500 ml</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹28</p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <span class="absolute top-0 left-2 rounded-b-md bg-(--s) px-1.5 py-0.5 text-[0.625rem] leading-tight font-bold text-(--s-on)">10%<br />OFF</span><div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Bread/3D/bread_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Modern white bread</p>
      <p class="text-[0.75rem] text-zinc-500">400 g</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹45<s class="block text-[0.6875rem] text-zinc-400">₹50</s></p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <span class="absolute top-0 left-2 rounded-b-md bg-(--s) px-1.5 py-0.5 text-[0.625rem] leading-tight font-bold text-(--s-on)">10%<br />OFF</span><div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Egg/3D/egg_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Farm fresh eggs</p>
      <p class="text-[0.75rem] text-zinc-500">6 pcs</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹54<s class="block text-[0.6875rem] text-zinc-400">₹60</s></p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    <li class="relative w-36 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-2.5 sm:w-40">
      <span class="absolute top-0 left-2 rounded-b-md bg-(--s) px-1.5 py-0.5 text-[0.625rem] leading-tight font-bold text-(--s-on)">13%<br />OFF</span><div class="grid aspect-square place-items-center"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Mango/3D/mango_3d.png" alt="" class="size-3/5 object-contain" /></div>
      <p class="inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 text-[0.625rem] font-bold text-zinc-700">⏱ 9 MINS</p>
      <p class="mt-1.5 line-clamp-2 h-9 text-[0.8125rem] leading-tight font-semibold text-zinc-900">Alphonso mango</p>
      <p class="text-[0.75rem] text-zinc-500">4 pcs</p>
      <div class="mt-2 flex items-end justify-between"><p class="text-[0.8125rem] leading-tight font-semibold text-zinc-900">₹349<s class="block text-[0.6875rem] text-zinc-400">₹399</s></p><button class="h-8 rounded-lg border border-(--p) bg-(--p-light) px-4 text-[0.8125rem] font-bold text-(--p-dark) transition-colors hover:bg-(--p) hover:text-(--p-on)">ADD</button></div>
    </li>
    </ul>
  </div>
</section>`,
  },
  {
    id: "shop-series-pop-out",
    category: "product-cards",
    group: "Collections",
    name: "Series tiles where the toys pop out",
    note: "Like Wigglitz's Build Your Bundle: a wall of pastel tiles, three characters in each. Point at one and the characters jump out past the edge of the tile, the middle one highest. Toys, collectibles, snacks, gift boxes.",
    html: `<style>
  .px-tile { position: relative; display: block; aspect-ratio: 1; border: 2.5px solid #18181b; border-radius: 1.25rem; background: var(--bg); transition: transform .3s cubic-bezier(.3,1.6,.5,1), box-shadow .3s; }
  .px-tile:hover, .px-tile:focus-visible { transform: translateY(-4px); box-shadow: 0 18px 30px -12px rgb(0 0 0 / .3); z-index: 2; }
  .px-toys { position: absolute; inset: 5% 7% 27%; display: flex; align-items: flex-end; justify-content: center; }
  .px-toys img { width: 37%; transition: transform .45s cubic-bezier(.3,1.7,.5,1); transform-origin: 50% 100%; filter: drop-shadow(0 6px 6px rgb(0 0 0 / .18)); }
  .px-toys .px-c { width: 50%; margin: 0 -10%; position: relative; z-index: 1; }
  .px-tile:hover .px-l, .px-tile:focus-visible .px-l { transform: translate(-28%, -14%) rotate(-14deg) scale(1.3); }
  .px-tile:hover .px-c, .px-tile:focus-visible .px-c { transform: translateY(-30%) scale(1.4); transition-delay: .05s; }
  .px-tile:hover .px-r, .px-tile:focus-visible .px-r { transform: translate(28%, -14%) rotate(14deg) scale(1.3); transition-delay: .1s; }
  .px-name { position: absolute; inset: auto 0 7%; text-align: center; font: 900 clamp(1.1rem, 2.6vw, 1.75rem)/1 ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif; color: var(--ink); -webkit-text-stroke: 5px #fff; paint-order: stroke fill; letter-spacing: -.02em; }
  .px-name span { display: block; width: max-content; margin: .15em auto 0; padding: .2em .7em .3em; border-radius: 999px; background: #18181b; color: #fff; -webkit-text-stroke: 0; font-size: .55em; transform: rotate(-3deg); }
  @media (prefers-reduced-motion: reduce) { .px-tile, .px-toys img { transition: none; } }
</style>
<section class="bg-white px-4 py-10">
  <h2 class="text-center text-3xl font-black text-zinc-900 md:text-4xl">Build your bundle today</h2>
  <p class="mt-2 text-center text-zinc-600">Pick any 3 series, get the 4th free</p>
  <ul class="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
    <li><a href="#" class="px-tile" style="--bg:#fef3c7;--ink:#f59e0b">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Monkey/3D/monkey_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Lion/3D/lion_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Elephant/3D/elephant_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Jungle<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#cffafe;--ink:#0891b2">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Turtle/3D/turtle_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Octopus/3D/octopus_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Dolphin/3D/dolphin_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Ocean<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#fee2e2;--ink:#dc2626">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Rooster/3D/rooster_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Cow/3D/cow_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Pig/3D/pig_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Farm<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#e0e7ff;--ink:#4f46e5">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Alien/3D/alien_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Rocket/3D/rocket_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Ringed%20planet/3D/ringed_planet_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Space<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#ecfccb;--ink:#65a30d">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Sauropod/3D/sauropod_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/T-rex/3D/t-rex_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Dragon/3D/dragon_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Dino<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#ffedd5;--ink:#ea580c">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Banana/3D/banana_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Mango/3D/mango_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Watermelon/3D/watermelon_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Fruity<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#fef9c3;--ink:#ca8a04">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Firecracker/3D/firecracker_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Diya%20lamp/3D/diya_lamp_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Kite/3D/kite_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Diwali<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#fce7f3;--ink:#db2777">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Robot/3D/robot_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Teddy%20bear/3D/teddy_bear_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Unicorn/3D/unicorn_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Toybox<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#dcfce7;--ink:#16a34a">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Peacock/3D/peacock_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Tiger%20face/3D/tiger_face_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Elephant/3D/elephant_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Royal<span>series</span></span>
    </a></li>
    <li><a href="#" class="px-tile" style="--bg:#f4f4f5;--ink:#18181b">
      <span class="px-toys"><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Ghost/3D/ghost_3d.png" alt="" class="px-l" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Balloon/3D/balloon_3d.png" alt="" class="px-c" /><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Robot/3D/robot_3d.png" alt="" class="px-r" /></span>
      <span class="px-name">Shop all<span>themes</span></span>
    </a></li>
  </ul>
</section>`,
  },
  {
    id: "shop-d2c-quick-add",
    category: "product-cards",
    group: "Store grids",
    name: "D2C cards with quick add",
    note: "Like Snitch and Bewakoof: big rounded pictures four to a row, a tag for bestseller or low stock, colour dots under the price. On hover a sizes panel slides up so the shopper adds without opening the product.",
    html: `<section class="bg-white px-4 py-8">
  <div class="mx-auto max-w-6xl">
    <div class="flex flex-wrap items-center justify-between gap-3"><h2 class="text-2xl font-bold text-zinc-900">New this week</h2>
      <div class="flex gap-2 text-sm"><a href="#" class="rounded-full bg-zinc-900 px-3.5 py-1.5 font-semibold text-white">All</a><a href="#" class="rounded-full border border-zinc-300 px-3.5 py-1.5">Tees</a><a href="#" class="rounded-full border border-zinc-300 px-3.5 py-1.5">Denim</a><a href="#" class="rounded-full border border-zinc-300 px-3.5 py-1.5">Sneakers</a></div></div>
    <ul class="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
    <li class="group">
      <div class="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl" style="background:#fff1e6">
        <span class="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-bold text-zinc-900">Bestseller</span><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/T-shirt/3D/t-shirt_3d.png" alt="" class="w-1/2 object-contain transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110" />
        <div class="absolute inset-x-3 bottom-3 translate-y-[120%] rounded-xl bg-white/95 p-2.5 shadow-lg backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
          <p class="text-center text-[0.6875rem] font-semibold text-zinc-500 uppercase">Quick add</p>
          <div class="mt-1.5 grid grid-cols-5 gap-1 text-[0.75rem] font-semibold"><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">S</button><button class="rounded-md border border-zinc-900 bg-zinc-900 py-1 text-white">M</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">L</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">XL</button><button class="rounded-md border border-zinc-200 py-1 text-zinc-300 line-through">XXL</button></div>
        </div>
      </div>
      <div class="mt-3 flex items-start justify-between gap-2">
        <p class="text-sm font-medium text-zinc-900">Oversized tee, Rust</p>
        <p class="shrink-0 text-right text-sm font-semibold text-zinc-900">₹699<s class="block text-[0.75rem] font-normal text-zinc-400">₹1,299</s></p>
      </div>
      <div class="mt-1.5 flex gap-2"><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#b45309"></span><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#18181b"></span><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#e4e4e7"></span></div>
    </li>
    <li class="group">
      <div class="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl" style="background:#eef4ff">
        <span class="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-bold text-zinc-900">New</span><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Jeans/3D/jeans_3d.png" alt="" class="w-1/2 object-contain transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110" />
        <div class="absolute inset-x-3 bottom-3 translate-y-[120%] rounded-xl bg-white/95 p-2.5 shadow-lg backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
          <p class="text-center text-[0.6875rem] font-semibold text-zinc-500 uppercase">Quick add</p>
          <div class="mt-1.5 grid grid-cols-5 gap-1 text-[0.75rem] font-semibold"><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">S</button><button class="rounded-md border border-zinc-900 bg-zinc-900 py-1 text-white">M</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">L</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">XL</button><button class="rounded-md border border-zinc-200 py-1 text-zinc-300 line-through">XXL</button></div>
        </div>
      </div>
      <div class="mt-3 flex items-start justify-between gap-2">
        <p class="text-sm font-medium text-zinc-900">Relaxed fit jeans, Ice blue</p>
        <p class="shrink-0 text-right text-sm font-semibold text-zinc-900">₹1,499<s class="block text-[0.75rem] font-normal text-zinc-400">₹2,499</s></p>
      </div>
      <div class="mt-1.5 flex gap-2"><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#93c5fd"></span><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#1e3a8a"></span></div>
    </li>
    <li class="group">
      <div class="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl" style="background:#f1f5e9">
        <img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Coat/3D/coat_3d.png" alt="" class="w-1/2 object-contain transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110" />
        <div class="absolute inset-x-3 bottom-3 translate-y-[120%] rounded-xl bg-white/95 p-2.5 shadow-lg backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
          <p class="text-center text-[0.6875rem] font-semibold text-zinc-500 uppercase">Quick add</p>
          <div class="mt-1.5 grid grid-cols-5 gap-1 text-[0.75rem] font-semibold"><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">S</button><button class="rounded-md border border-zinc-900 bg-zinc-900 py-1 text-white">M</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">L</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">XL</button><button class="rounded-md border border-zinc-200 py-1 text-zinc-300 line-through">XXL</button></div>
        </div>
      </div>
      <div class="mt-3 flex items-start justify-between gap-2">
        <p class="text-sm font-medium text-zinc-900">Quilted bomber, Olive</p>
        <p class="shrink-0 text-right text-sm font-semibold text-zinc-900">₹2,199<s class="block text-[0.75rem] font-normal text-zinc-400">₹3,999</s></p>
      </div>
      <div class="mt-1.5 flex gap-2"><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#4d7c0f"></span><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#18181b"></span></div>
    </li>
    <li class="group">
      <div class="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl" style="background:#f4f4f5">
        <span class="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-bold text-zinc-900">Only 3 left</span><img src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/Running%20shoe/3D/running_shoe_3d.png" alt="" class="w-1/2 object-contain transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110" />
        <div class="absolute inset-x-3 bottom-3 translate-y-[120%] rounded-xl bg-white/95 p-2.5 shadow-lg backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
          <p class="text-center text-[0.6875rem] font-semibold text-zinc-500 uppercase">Quick add</p>
          <div class="mt-1.5 grid grid-cols-5 gap-1 text-[0.75rem] font-semibold"><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">S</button><button class="rounded-md border border-zinc-900 bg-zinc-900 py-1 text-white">M</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">L</button><button class="rounded-md border border-zinc-200 py-1 hover:border-zinc-900">XL</button><button class="rounded-md border border-zinc-200 py-1 text-zinc-300 line-through">XXL</button></div>
        </div>
      </div>
      <div class="mt-3 flex items-start justify-between gap-2">
        <p class="text-sm font-medium text-zinc-900">Everyday sneakers, Chalk</p>
        <p class="shrink-0 text-right text-sm font-semibold text-zinc-900">₹1,899<s class="block text-[0.75rem] font-normal text-zinc-400">₹2,999</s></p>
      </div>
      <div class="mt-1.5 flex gap-2"><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#f4f4f5"></span><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#18181b"></span><span class="size-3.5 rounded-full ring-1 ring-zinc-300 ring-offset-1" style="background:#dc2626"></span></div>
    </li>
    </ul>
  </div>
</section>`,
  },
  {
    id: "logo-draw-on",
    category: "logo-animations",
    name: "Monogram that draws itself",
    note: "The mark is drawn as a line, fills in, and the name slides out beside it. For a first visit or a loading screen.",
    html: `<style>
  .ld-stroke { stroke-dasharray: 320; stroke-dashoffset: 320; animation: ld-draw 5s ease-in-out infinite; }
  .ld-fill { animation: ld-fill 5s ease-in-out infinite; }
  .ld-word { animation: ld-word 5s cubic-bezier(.2,.8,.2,1) infinite; }
  @keyframes ld-draw { 0% { stroke-dashoffset: 320; } 35%,100% { stroke-dashoffset: 0; } }
  @keyframes ld-fill { 0%,30% { fill-opacity: 0; } 45%,90% { fill-opacity: 1; } 100% { fill-opacity: 0; } }
  @keyframes ld-word { 0%,40% { opacity: 0; transform: translateX(-16px); clip-path: inset(0 100% 0 0); } 58%,90% { opacity: 1; transform: none; clip-path: inset(0 0 0 0); } 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .ld-stroke, .ld-fill, .ld-word { animation: none; stroke-dashoffset: 0; fill-opacity: 1; } }
</style>
<div class="grid min-h-64 place-items-center bg-white">
  <div class="flex items-center gap-4">
    <svg viewBox="0 0 64 64" class="size-16" aria-hidden="true">
      <path class="ld-stroke ld-fill fill-(--p) stroke-(--p-dark)" stroke-width="3" stroke-linejoin="round" d="M8 56V8l24 30L56 8v48H44V34L32 50 20 34v22Z" />
    </svg>
    <span class="ld-word text-4xl font-bold tracking-tight text-zinc-900">Meridian</span>
  </div>
</div>`,
  },
  {
    id: "logo-letters-rise",
    category: "logo-animations",
    name: "Letters rise one by one",
    note: "Each letter lifts in after the one before, then a dot drops onto the end. Light and quick, good on a hero or a splash.",
    html: `<style>
  .lr-word span { display: inline-block; animation: lr-rise 4s cubic-bezier(.2,1.4,.4,1) infinite both; }
  .lr-dot { animation: lr-dot 4s cubic-bezier(.3,1.8,.5,1) infinite both; }
  @keyframes lr-rise { 0% { opacity: 0; transform: translateY(70%); } 18%,85% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(-30%); } }
  @keyframes lr-dot { 0%,30% { opacity: 0; transform: translateY(-120%) scale(.4); } 42%,85% { opacity: 1; transform: none; } 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .lr-word span, .lr-dot { animation: none; } }
</style>
<div class="grid min-h-64 place-items-center bg-zinc-950">
  <p class="lr-word flex items-end overflow-hidden pb-1 text-5xl font-extrabold tracking-tight text-white md:text-6xl"><span style="animation-delay:0.00s">n</span><span style="animation-delay:0.07s">e</span><span style="animation-delay:0.14s">c</span><span style="animation-delay:0.21s">t</span><span style="animation-delay:0.28s">a</span><span style="animation-delay:0.35s">r</span><span style="animation-delay:0.42s">r</span><span style="animation-delay:0.49s">a</span><span style="animation-delay:0.56s">y</span><span class="lr-dot ml-1 mb-2 inline-block size-3 rounded-full bg-(--p) md:size-4"></span></p>
</div>`,
  },
  {
    id: "logo-spin-settle",
    category: "logo-animations",
    name: "Mark spins in, name unmasks",
    note: "The square mark turns into place with a small overshoot, then the name is revealed from behind it. Tech, fintech, SaaS.",
    html: `<style>
  .ss-mark { animation: ss-spin 4.5s cubic-bezier(.3,1.5,.5,1) infinite; }
  .ss-name { animation: ss-name 4.5s cubic-bezier(.2,.8,.2,1) infinite; }
  @keyframes ss-spin { 0% { transform: rotate(-270deg) scale(0); } 25%,88% { transform: rotate(0) scale(1); } 100% { transform: rotate(90deg) scale(0); } }
  @keyframes ss-name { 0%,22% { transform: translateX(-110%); } 42%,85% { transform: none; } 100% { transform: translateX(-110%); } }
  @media (prefers-reduced-motion: reduce) { .ss-mark, .ss-name { animation: none; } }
</style>
<div class="grid min-h-64 place-items-center bg-(--p-light)">
  <div class="flex items-center gap-3">
    <span class="ss-mark relative z-10 grid size-14 place-items-center rounded-2xl bg-(--p) text-2xl font-black text-(--p-on) shadow-lg">P</span>
    <span class="overflow-hidden"><span class="ss-name block text-4xl font-bold tracking-tight text-(--p-dark)">PayRupi</span></span>
  </div>
</div>`,
  },
  {
    id: "logo-shimmer",
    category: "logo-animations",
    name: "Shimmer across the wordmark",
    note: "A band of light sweeps across a heavy wordmark every few seconds. Jewellery, premium, festive offers.",
    html: `<style>
  .sh-word { background: linear-gradient(110deg, var(--p-dark) 0 40%, #fff6d8 48%, var(--p-light) 52%, var(--p-dark) 60% 100%); background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: sh-sweep 3.5s ease-in-out infinite; }
  @keyframes sh-sweep { 0% { background-position: 100% 0; } 60%,100% { background-position: -50% 0; } }
  @media (prefers-reduced-motion: reduce) { .sh-word { animation: none; } }
</style>
<div class="grid min-h-64 place-items-center bg-zinc-950 text-center">
  <div>
    <p class="sh-word font-serif text-5xl font-bold tracking-[0.12em] uppercase md:text-6xl">Swarna</p>
    <p class="mt-2 text-[0.75rem] tracking-[0.5em] text-white/60 uppercase">Fine jewellery · since 1962</p>
  </div>
</div>`,
  },
  {
    id: "logo-dots-gather",
    category: "logo-animations",
    name: "Dots gather into the mark",
    note: "Four scattered dots fly together into a 2 by 2 mark, then the name fades up. Agencies, data and logistics companies.",
    html: `<style>
  .dg-dot { animation: dg-gather 4.5s cubic-bezier(.5,0,.2,1.3) infinite; }
  .dg-a { --x: -90px; --y: -50px; } .dg-b { --x: 80px; --y: -70px; animation-delay: .06s; } .dg-c { --x: -70px; --y: 60px; animation-delay: .12s; } .dg-d { --x: 100px; --y: 40px; animation-delay: .18s; }
  .dg-name { animation: dg-name 4.5s ease-out infinite; }
  @keyframes dg-gather { 0% { transform: translate(var(--x), var(--y)) scale(.5); opacity: 0; } 10% { opacity: 1; } 35%,85% { transform: none; opacity: 1; } 100% { transform: translate(var(--x), var(--y)) scale(.5); opacity: 0; } }
  @keyframes dg-name { 0%,35% { opacity: 0; transform: translateY(8px); } 50%,85% { opacity: 1; transform: none; } 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .dg-dot, .dg-name { animation: none; } }
</style>
<div class="grid min-h-64 place-items-center bg-white">
  <div class="flex items-center gap-4">
    <span class="grid grid-cols-2 gap-1.5">
      <span class="dg-dot dg-a size-5 rounded-full bg-(--p)"></span><span class="dg-dot dg-b size-5 rounded-md bg-(--s)"></span>
      <span class="dg-dot dg-c size-5 rounded-md bg-(--t)"></span><span class="dg-dot dg-d size-5 rounded-full bg-(--p-dark)"></span>
    </span>
    <span class="dg-name text-4xl font-bold tracking-tight text-zinc-900">quadrant</span>
  </div>
</div>`,
  },
  {
    id: "logo-lotus-bloom",
    category: "logo-animations",
    name: "Lotus that blooms open",
    note: "Five petals open out from the centre, then the name settles under it. Wellness, yoga, ayurveda, weddings.",
    html: `<style>
  .lb-petal { transform-origin: 32px 52px; animation: lb-open 5s cubic-bezier(.3,1.3,.5,1) infinite both; }
  .lb-name { animation: lb-name 5s ease-out infinite; }
  @keyframes lb-open { 0% { transform: rotate(0) scale(.2); opacity: 0; } 30%,85% { transform: rotate(var(--r)) scale(1); opacity: .9; } 100% { transform: rotate(0) scale(.2); opacity: 0; } }
  @keyframes lb-name { 0%,32% { opacity: 0; letter-spacing: .6em; } 50%,85% { opacity: 1; letter-spacing: .25em; } 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .lb-petal, .lb-name { animation: none; } .lb-petal { transform: rotate(var(--r)); } }
</style>
<div class="grid min-h-64 place-items-center bg-[#fbf6ee] text-center">
  <div>
    <svg viewBox="0 0 64 60" class="mx-auto h-20 w-24 overflow-visible fill-(--p) stroke-(--p-dark)" stroke-width="1.2" aria-hidden="true"><path class="lb-petal" style="--r:-64deg;animation-delay:0.21s" d="M32 52C22 40 22 22 32 8c10 14 10 32 0 44Z" /><path class="lb-petal" style="--r:-32deg;animation-delay:0.11s" d="M32 52C22 40 22 22 32 8c10 14 10 32 0 44Z" /><path class="lb-petal" style="--r:0deg;animation-delay:0.00s" d="M32 52C22 40 22 22 32 8c10 14 10 32 0 44Z" /><path class="lb-petal" style="--r:32deg;animation-delay:0.11s" d="M32 52C22 40 22 22 32 8c10 14 10 32 0 44Z" /><path class="lb-petal" style="--r:64deg;animation-delay:0.21s" d="M32 52C22 40 22 22 32 8c10 14 10 32 0 44Z" /><path d="M14 56h36" stroke-linecap="round" fill="none" /></svg>
    <p class="lb-name mt-2 font-serif text-3xl text-(--p-dark) uppercase">Kamal</p>
    <p class="text-[0.75rem] tracking-[0.3em] text-zinc-500 uppercase">Ayurveda &amp; wellness</p>
  </div>
</div>`,
  },
  {
    id: "logo-typewriter",
    category: "logo-animations",
    name: "Typed out with a cursor",
    note: "The name is typed letter by letter with a blinking cursor, then deleted and typed again. Developer tools, blogs, studios.",
    html: `<style>
  .tw-text { width: 9ch; overflow: hidden; white-space: nowrap; animation: tw-type 5s steps(9) infinite; }
  .tw-cur { animation: tw-blink .7s step-end infinite; }
  @keyframes tw-type { 0% { width: 0; } 40%,75% { width: 9ch; } 95%,100% { width: 0; } }
  @keyframes tw-blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .tw-text, .tw-cur { animation: none; } }
</style>
<div class="grid min-h-64 place-items-center bg-zinc-950">
  <p class="flex items-center font-mono text-4xl font-bold text-white md:text-5xl"><span class="mr-2 text-(--p)">&gt;</span><span class="tw-text">codeshala</span><span class="tw-cur ml-1 inline-block h-[1em] w-[0.5ch] bg-(--p)"></span></p>
</div>`,
  },
];
