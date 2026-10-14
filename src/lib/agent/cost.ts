import { FX_INR_PER_USD } from "@/lib/price-book";

/**
 * What one Agent answer cost, from the tokens the model reports. Prices are
 * US dollars per million tokens, from the price book (Admin › Software ›
 * pricing): Gemini 3.6 / 3.7 / 3.8 Flash are $0.75 in and $3.75 out until
 * they double on 1 January 2027. Thinking is billed as output, and the
 * model's output count already includes it.
 *
 * A model not listed here can be priced with AGENT_PRICE_PER_M="in,out";
 * without that the cost shows as unknown rather than a wrong number.
 */

type Price = { input: number; output: number };

const DOUBLING = "2027-01-01";

function listed(model: string, today: string): Price | null {
  const m = model.toLowerCase();
  if (/^gemini-3\.[678]-flash(?!-lite)/.test(m))
    return today < DOUBLING
      ? { input: 0.75, output: 3.75 }
      : { input: 1.5, output: 7.5 };
  if (m.startsWith("gemini-3.5-flash-lite")) return { input: 0.3, output: 2.5 };
  if (m.startsWith("gemini-3.1-flash-lite"))
    return { input: 0.25, output: 1.5 };
  if (m.startsWith("gemini-3.5-flash")) return { input: 1.5, output: 9 };
  return null;
}

export function priceOf(model: string, today: string): Price | null {
  const set = process.env.AGENT_PRICE_PER_M?.split(",").map(Number);
  if (set?.length === 2 && set.every((n) => Number.isFinite(n) && n >= 0))
    return { input: set[0], output: set[1] };
  return listed(model, today);
}

export function costOf(
  model: string,
  today: string,
  inputTokens: number,
  outputTokens: number,
) {
  const price = priceOf(model, today);
  if (!price) return null;
  return (inputTokens * price.input + outputTokens * price.output) / 1_000_000;
}

export const toInr = (usd: number) => usd * FX_INR_PER_USD;

/** ₹0.42, or ₹0.0031 for the fractions a single short answer costs. */
export function inr(usd: number | null) {
  if (usd === null) return "cost unknown";
  const rupees = toInr(usd);
  if (rupees === 0) return "₹0";
  if (rupees < 0.01) return `₹${rupees.toPrecision(2)}`;
  if (rupees < 100) return `₹${rupees.toFixed(2)}`;
  return `₹${Math.round(rupees).toLocaleString("en-IN")}`;
}
