import type { Money, PriceTable, Sheet } from "@/lib/price-book";
import { textCost } from "@/lib/model-cost";
import { inCurrency, isMoney, type Currency } from "@/lib/price-money";

/**
 * What a project costs to run, from the price book: the services a client
 * would pay for, each with the choices the sheets list. Prices are read
 * from the sheets as the team has edited them, so the estimate follows
 * any price change.
 */

/** How often a service is paid for. */
export type Billing = "once" | "monthly" | "yearly";

export type EstimateOption = {
  id: string;
  label: string;
  /** What it charges each time it bills. */
  price: Money;
  /** The first payment, when it differs (a domain's first year). */
  first?: Money;
};

export type EstimateItem = {
  id: string;
  group: string;
  label: string;
  /** What the quantity counts, e.g. "domains" or "articles a month". */
  unit: string;
  /** What one option's price buys, e.g. "a year" or "per article". */
  per: string;
  billing: Billing;
  defaultQuantity: number;
  options: EstimateOption[];
  note?: string;
};

/** An AI article: a 1,000-word piece written from a 300-word brief. */
export const ARTICLE_WORDS = 1000;
export const BRIEF_WORDS = 300;

const sum = (...parts: (Money | null)[]): Money | null => {
  if (parts.some((p) => !p)) return null;
  return { usd: parts.reduce((n, p) => n + inCurrency(p!, "usd"), 0) };
};

/** Read a table's cells by column label, row by row. */
function readRows(table: PriceTable | undefined) {
  if (!table) return [];
  const col = (label: string) =>
    table.columns.findIndex((c) => c.label === label);
  return table.rows.map(({ id, cells }) => ({
    id,
    text: (label: string) => {
      const cell = cells[col(label)];
      return typeof cell === "string" ? cell : "";
    },
    money: (label: string) => {
      const i = col(label);
      const cell = i < 0 ? null : cells[i];
      return isMoney(cell) ? cell : null;
    },
  }));
}

function options(
  rows: ReturnType<typeof readRows>,
  make: (row: ReturnType<typeof readRows>[number]) => {
    label: string;
    price: Money | null;
    first?: Money | null;
  } | null,
  prefix: string,
): EstimateOption[] {
  return rows.flatMap((row) => {
    const made = make(row);
    if (!made?.price) return [];
    return [
      {
        id: `${prefix}/${row.id}`,
        label: made.label,
        price: made.price,
        ...(made.first ? { first: made.first } : {}),
      },
    ];
  });
}

export function estimateItems(sheets: Sheet[]): EstimateItem[] {
  const table = (sheet: string, id: string) =>
    sheets.find((s) => s.slug === sheet)?.tables.find((t) => t.id === id);
  const rows = (sheet: string, id: string) => readRows(table(sheet, id));

  const vm = (provider: string, id: string) =>
    options(
      rows("deployment", id),
      (r) => ({
        label: `${provider} ${r.text("Instance")}`,
        price: r.money("Per month"),
      }),
      id,
    );
  const clouds = (service: string, prefix: string) => {
    const row = rows("deployment", "clouds").find(
      (r) => r.text("Service") === service,
    );
    if (!row) return [];
    return (["AWS", "Google Cloud", "Azure"] as const).flatMap((cloud) => {
      const price = row.money(cloud);
      return price ? [{ id: `${prefix}/${cloud}`, label: cloud, price }] : [];
    });
  };

  const items: EstimateItem[] = [
    {
      id: "domain",
      group: "Domain",
      label: "Domain name",
      unit: "domains",
      per: "a year",
      billing: "yearly",
      defaultQuantity: 1,
      note: "First year at the best offer, then renewal each year. Privacy and ICANN fees included.",
      options: [
        ...options(
          rows("domains", "registrars"),
          (r) => ({
            label: `${r.text("Registrar")} ${r.text("TLD")}`,
            first: sum(
              r.money("Best 1st year"),
              r.money("Privacy / year"),
              r.money("ICANN fee / year"),
            ),
            price: sum(
              r.money("Renewal / year"),
              r.money("Privacy / year"),
              r.money("ICANN fee / year"),
            ),
          }),
          "registrars",
        ),
        ...options(
          rows("domains", "india"),
          (r) => ({
            label: `${r.text("Registrar")} ${r.text("TLD")}`,
            first: r.money("1st year"),
            price: r.money("Renewal"),
          }),
          "india",
        ),
      ],
    },
    {
      id: "hosting",
      group: "Hosting",
      label: "App hosting or server",
      unit: "servers",
      per: "a month",
      billing: "monthly",
      defaultQuantity: 1,
      options: [
        ...options(
          rows("deployment", "hosting"),
          (r) => ({
            label: `${r.text("Platform")} ${r.text("Plan or size")}`,
            price: r.money("Per month"),
          }),
          "hosting",
        ),
        ...vm("AWS", "ec2"),
        ...vm("Google Cloud", "gcp-vm"),
        ...vm("Azure", "azure-vm"),
      ],
    },
    {
      id: "load-balancer",
      group: "Hosting",
      label: "Load balancer",
      unit: "load balancers",
      per: "a month",
      billing: "monthly",
      defaultQuantity: 1,
      note: "Base charge only; traffic is billed on top. Hosting platforms include one.",
      options: clouds("Load balancer, base charge", "lb"),
    },
    {
      id: "database",
      group: "Database and storage",
      label: "Database",
      unit: "databases",
      per: "a month",
      billing: "monthly",
      defaultQuantity: 1,
      options: [
        ...options(
          rows("storage", "supabase"),
          (r) => ({
            label: `Supabase ${r.text("Plan")}`,
            price: r.money("Per month"),
          }),
          "supabase",
        ),
        ...clouds("Managed Postgres, smallest", "postgres").map((o) => ({
          ...o,
          label: `${o.label} Postgres, smallest`,
        })),
      ],
    },
    {
      id: "files",
      group: "Database and storage",
      label: "File and image storage",
      unit: "GB stored",
      per: "per GB a month",
      billing: "monthly",
      defaultQuantity: 50,
      options: options(
        rows("storage", "files"),
        (r) => ({
          label: r.text("Service"),
          price: r.money("Storage / GB-month"),
        }),
        "files",
      ),
    },
    {
      id: "articles",
      group: "AI",
      label: `AI-written articles (${ARTICLE_WORDS.toLocaleString("en-IN")} words each)`,
      unit: "articles a month",
      per: "per article",
      billing: "monthly",
      defaultQuantity: 10,
      note: `Each article is ${ARTICLE_WORDS.toLocaleString("en-IN")} words written from a ${BRIEF_WORDS}-word brief.`,
      options: options(
        rows("ai-models", "api"),
        (r) => {
          const input = r.money("Input / 1M");
          const output = r.money("Output / 1M");
          if (!input || !output) return null;
          const { perRequest } = textCost(
            {
              wordsIn: BRIEF_WORDS,
              wordsOut: ARTICLE_WORDS,
              requests: 1,
              input,
              output,
            },
            "usd",
          );
          return {
            label: `${r.text("Model")} (${r.text("Provider")})`,
            price: { usd: perRequest },
          };
        },
        "api",
      ),
    },
    {
      id: "images",
      group: "AI",
      label: "AI images",
      unit: "images a month",
      per: "per image",
      billing: "monthly",
      defaultQuantity: 20,
      options: options(
        rows("ai-models", "image"),
        (r) => ({
          label: `${r.text("Model")} (${r.text("Provider")})`,
          price: r.money("Standard image"),
        }),
        "image",
      ),
    },
    {
      id: "play",
      group: "App stores",
      label: "Google Play developer account",
      unit: "accounts",
      per: "once",
      billing: "once",
      defaultQuantity: 1,
      options: options(
        rows("app-dev", "accounts").filter(
          (r) => r.text("Billing") === "One-time",
        ),
        (r) => ({ label: r.text("Account"), price: r.money("Price") }),
        "accounts",
      ),
    },
    {
      id: "apple",
      group: "App stores",
      label: "Apple developer account",
      unit: "accounts",
      per: "a year",
      billing: "yearly",
      defaultQuantity: 1,
      options: options(
        rows("app-dev", "accounts").filter(
          (r) => r.text("Billing") === "Per year",
        ),
        (r) => ({ label: r.text("Account"), price: r.money("Price") }),
        "accounts",
      ),
    },
    {
      id: "app-builds",
      group: "App stores",
      label: "App builds without a Mac",
      unit: "subscriptions",
      per: "a month",
      billing: "monthly",
      defaultQuantity: 1,
      options: options(
        rows("app-dev", "no-mac").filter(
          (r) => r.text("Billing") === "Per month",
        ),
        (r) => ({ label: r.text("Option"), price: r.money("Price") }),
        "no-mac",
      ),
    },
  ];
  return items.filter((item) => item.options.length > 0);
}

/** One ticked line of an estimate, in the chosen currency. */
export type EstimateLine = {
  billing: Billing;
  quantity: number;
  /** Each time it bills. */
  price: number;
  /** The first time it bills, when that differs. */
  first?: number;
};

export type EstimateTotals = {
  /** Paid once and never again. */
  oneTime: number;
  monthly: number;
  /** Renewals each year after the first. */
  yearly: number;
  /** The first bill: one-time, the first month and the first year. */
  firstPayment: number;
  /** Everything in the first twelve months. */
  firstYear: number;
};

export function estimateTotals(lines: EstimateLine[]): EstimateTotals {
  let oneTime = 0;
  let monthly = 0;
  let yearly = 0;
  let firstYearly = 0;
  for (const line of lines) {
    const each = line.price * line.quantity;
    const first = (line.first ?? line.price) * line.quantity;
    if (line.billing === "once") oneTime += first;
    if (line.billing === "monthly") monthly += each;
    if (line.billing === "yearly") {
      yearly += each;
      firstYearly += first;
    }
  }
  return {
    oneTime,
    monthly,
    yearly,
    firstPayment: oneTime + monthly + firstYearly,
    firstYear: oneTime + monthly * 12 + firstYearly,
  };
}

/** A price in the estimate's currency. */
export const priceIn = (money: Money, currency: Currency) =>
  inCurrency(money, currency);
