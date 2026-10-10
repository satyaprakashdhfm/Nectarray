import type { Money, PriceTable } from "@/lib/price-book";
import { inCurrency, isMoney, type Currency } from "@/lib/price-money";

/**
 * Models bill by the token, people think in words. English prose averages
 * about 0.75 words a token; other languages and code take more tokens.
 */
export const TOKENS_PER_WORD = 4 / 3;

export const tokensFor = (words: number) => Math.ceil(words * TOKENS_PER_WORD);

export type PricedRow = {
  id: string;
  name: string;
  provider: string;
  /** One per asked-for price column; null where the row has no number. */
  prices: (Money | null)[];
  /** The matching text columns (what a price means), when asked for. */
  labels: (string | null)[];
};

/**
 * A price table's rows read by column label: their prices in the given
 * columns, and optionally the text column that says what each price is
 * for. Rows with no number in any of them ("Custom") are left out, and a
 * table without the columns gives nothing.
 */
export function pricedRows(
  table: PriceTable,
  priceColumns: string[],
  labelColumns: string[] = [],
): PricedRow[] {
  const col = (label: string) =>
    table.columns.findIndex((c) => c.label === label);
  const prices = priceColumns.map(col);
  const labels = labelColumns.map(col);
  const provider = col("Provider");
  if ([...prices, ...labels].some((i) => i < 0)) return [];
  return table.rows.flatMap(({ id, cells }) => {
    const name = cells[0];
    const money = prices.map((i) => {
      const cell = cells[i];
      return isMoney(cell) ? cell : null;
    });
    if (typeof name !== "string" || !name || money.every((m) => !m)) return [];
    const text = (i: number) => {
      const cell = cells[i];
      return typeof cell === "string" && cell ? cell : null;
    };
    return [
      {
        id,
        name,
        provider: provider < 0 ? "" : (text(provider) ?? ""),
        prices: money,
        labels: labels.map(text),
      },
    ];
  });
}

/** A price per image or per second, times how many. */
export const unitCost = (price: Money, units: number, currency: Currency) =>
  inCurrency(price, currency) * units;

export function textCost(
  {
    wordsIn,
    wordsOut,
    requests,
    input,
    output,
  }: {
    wordsIn: number;
    wordsOut: number;
    requests: number;
    input: Money;
    output: Money;
  },
  currency: Currency,
) {
  const tokensIn = tokensFor(wordsIn);
  const tokensOut = tokensFor(wordsOut);
  const perRequest =
    (tokensIn * inCurrency(input, currency) +
      tokensOut * inCurrency(output, currency)) /
    1_000_000;
  return { tokensIn, tokensOut, perRequest, total: perRequest * requests };
}
