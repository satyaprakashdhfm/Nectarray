import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Brand } from "@/lib/content/practices";

/**
 * One tool, as a logo with its name beside it.
 *
 * Integrations and the stack below it are the same chip, so they live in one
 * component: the two sections are read one after the other, and a size or a
 * radius that drifted between them would be visible on the same scroll.
 *
 * The logo is recognition support rather than the label — a favicon at this
 * size is a colour and a shape, and the customer scanning for "Petpooja" is
 * reading the word.
 */
export function BrandChip({ brand }: { brand: Brand }) {
  return (
    <li className="border-line bg-canvas flex items-center gap-2 rounded-lg border px-2.5 py-1.5">
      <BrandLogo
        name={brand.name}
        domain={brand.domain}
        className="size-[1.125rem]"
      />
      <span className="text-ink-soft text-[0.8125rem] font-medium whitespace-nowrap">
        {brand.name}
      </span>
    </li>
  );
}
