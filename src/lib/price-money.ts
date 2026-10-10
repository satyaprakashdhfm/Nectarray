import { FX_INR_PER_USD, type Cell, type Money } from "@/lib/price-book";

export type Currency = "usd" | "inr";

export const isMoney = (cell: Cell): cell is Money =>
  typeof cell === "object" && cell !== null;

export function inCurrency(money: Money, currency: Currency) {
  if ("usd" in money)
    return currency === "usd" ? money.usd : money.usd * FX_INR_PER_USD;
  return currency === "inr" ? money.inr : money.inr / FX_INR_PER_USD;
}

/** $0.20, $1.40, $1,935, $0.00000386; ₹19.29, ₹1,49,900. */
export function formatMoney(money: Money, currency: Currency) {
  const value = inCurrency(money, currency);
  const locale = currency === "usd" ? "en-US" : "en-IN";
  const style: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currency.toUpperCase(),
  };
  if (value === 0 || value >= 100)
    return value.toLocaleString(locale, { ...style, maximumFractionDigits: 0 });
  if (value >= 1 || Math.abs(value * 100 - Math.round(value * 100)) < 1e-9)
    return value.toLocaleString(locale, {
      ...style,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    });
  return value.toLocaleString(locale, {
    ...style,
    maximumSignificantDigits: 3,
  });
}
