import type { Money, PriceTable } from "@/lib/price-book";
import { inCurrency, isMoney, type Currency } from "@/lib/price-money";

/**
 * Models bill by the token, people think in words. English prose averages
 * about 0.75 words a token; other languages and code take more tokens.
 */
export const TOKENS_PER_WORD = 4 / 3;

export const tokensFor = (words: number) => Math.ceil(words * TOKENS_PER_WORD);

export type PricedModel = {
  id: string;
  name: string;
  provider: string;
  input: Money;
  output: Money;
};

/**
 * The rows of a per-1M-token price table that have a number for both input
 * and output. Rows quoted as a word ("Custom") cannot be estimated.
 */
export function priceableModels(table: PriceTable): PricedModel[] {
  const col = (label: string) =>
    table.columns.findIndex((c) => c.label === label);
  const input = col("Input / 1M");
  const output = col("Output / 1M");
  const provider = col("Provider");
  if (input < 0 || output < 0) return [];
  return table.rows.flatMap(({ id, cells }) => {
    const [name, inPrice, outPrice] = [cells[0], cells[input], cells[output]];
    if (typeof name !== "string" || !name) return [];
    if (!isMoney(inPrice) || !isMoney(outPrice)) return [];
    const by = provider < 0 ? null : cells[provider];
    return [
      {
        id,
        name,
        provider: typeof by === "string" ? by : "",
        input: inPrice,
        output: outPrice,
      },
    ];
  });
}

export function estimate(
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
