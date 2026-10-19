import {
  discountOf,
  newId,
  type QuoteBody,
  type QuoteLine,
} from "@/lib/quotes";

/**
 * Ready-made quotes for a kind of project: the services, grouped and
 * numbered, what each includes for the Scope of work, and the terms. Picked
 * on a quote from "Fill from a template"; the quote is then edited as any
 * other.
 */

type PresetItem = {
  ref: string;
  /** This row's share of the development cost; only the total prints. */
  w: number;
  name: string;
  description: string;
  includes: string[];
};

export type QuotePreset = {
  id: string;
  label: string;
  /** Shown in the confirm before it fills the quote. */
  about: string;
  groups: { name: string; items: PresetItem[] }[];
  terms: string;
};

/**
 * A mobile wholesale business's operations system, from the Mobile
 * Wholesale Business Requirements document (Projects › Dashboard refactor),
 * one row per group of its modules.
 */
const MOBILE_WHOLESALE: QuotePreset = {
  id: "mobile-wholesale",
  label: "Mobile wholesale operations",
  about:
    "15 services in four groups, with their scope of work and terms, from the Mobile Wholesale Business Requirements document.",
  groups: [
    {
      name: "Platform and access",
      items: [
        {
          ref: "mw-portals",
          w: 8,
          name: "Admin portal and store portal",
          description:
            "One system with two views on the same records: a full admin portal for the owner and a simpler store portal for employees, across three stores and the godown.",
          includes: [
            "Admin portal for inventory, purchases, prices, accounts, finances, reports and users",
            "Store portal for searching stock, recording sales and daily store work",
            "Three stores and one godown, each with its own inventory view; more stores can be added later",
            "Closing a store keeps all its past transactions",
            "Roles and permissions: store employees see and change only what they are allowed to",
          ],
        },
      ],
    },
    {
      name: "Inventory and pricing",
      items: [
        {
          ref: "mw-inventory",
          w: 10,
          name: "Product master and IMEI inventory",
          description:
            "Every product and every device: categories, variants, IMEI tracking, stock by location, search and full movement history.",
          includes: [
            "Smartphones, feature phones and accessories, with brand, model, variant, colour, RAM and storage",
            "Each device traced by its IMEI; duplicate IMEIs are flagged, not saved twice",
            "Accessories and items without an IMEI tracked by quantity",
            "Stock for Store 1, Store 2, Store 3 and the godown separately, and in total",
            "Search by model, variant, colour, RAM, storage or IMEI across all locations",
            "Bulk entry for 100–300 products a day (forms or spreadsheet upload, to be agreed)",
            "Full history of where each product has been: receipt, transfers, suspense, activation and sale",
          ],
        },
        {
          ref: "mw-prices",
          w: 4,
          name: "Daily listing prices",
          description:
            "The day's price list for every model, updated daily, with the full price history kept.",
          includes: [
            "View, search and update the current price list every day",
            "Add prices for new models and variants",
            "Every change kept with its date and time; old prices are never overwritten",
            "The day's listing price shown when recording a sale",
            "Actual selling price stored separately and compared with the listing price",
          ],
        },
        {
          ref: "mw-purchases",
          w: 7,
          name: "Purchases and stock transfers",
          description:
            "Company purchases, store-to-store transfers and godown movements, with linked records on both sides.",
          includes: [
            "Company purchase: company, bill number, date, products, IMEIs, quantities and prices",
            "Company list managed by the admin; products keep their purchase source",
            "Store-to-store transfer creates the receiving store's record automatically",
            "Sending and receiving records stay linked and show in product history",
            "Movements into and out of the godown recorded separately",
          ],
        },
        {
          ref: "mw-suspense",
          w: 6,
          name: "Suspense products",
          description:
            "Products given to other traders for the day, until they are sold, returned or carried forward.",
          includes: [
            "Suspense record: product, IMEI, trader, issue date, location and status",
            "Close as sold (with the agreed amount) or as returned to stock",
            "Carry forward to the next day, keeping the original issue date",
            "Suspense stock shown apart from available stock and completed sales",
            "Evening reminder (around 9:00–9:30 PM) of items still pending",
          ],
        },
        {
          ref: "mw-activation",
          w: 3,
          name: "Product activation",
          description:
            "Activation status and date for eligible company-purchased devices.",
          includes: [
            "Only eligible company-purchased devices can be activated",
            "Find the device by IMEI, mark it activated and record the date",
            "Activation stays with the device when it moves between locations",
            "Activation shown on inventory and sales screens",
          ],
        },
      ],
    },
    {
      name: "Accounts, orders and sales",
      items: [
        {
          ref: "mw-accounts",
          w: 7,
          name: "Accounts and ledgers",
          description:
            "One account for every buyer, provider and business contact, with a clear ledger behind every balance.",
          includes: [
            "Shared accounts for buyers, product providers, card providers and suppliers; one person can have several roles",
            "Shop name, phone, address, city, role, balance and full history",
            "Positive balance: they owe us. Negative balance: we owe them",
            "Ledger showing how each balance was reached, transaction by transaction",
            "Buyer purchase history with model, date, IMEI and price",
            "Printable courier address sticker",
          ],
        },
        {
          ref: "mw-crowd",
          w: 7,
          name: "Crowd orders and delivery updates",
          description:
            "Orders placed by individuals on their own cards, and deliveries that arrive without notice, until verified.",
          includes: [
            "Crowd order: product, person, platform, ordered price and our buying price",
            "Statuses Ordered, Shipped and Delivered, updated by hand",
            "Ordering platforms in a dropdown the admin can extend (about six to start)",
            "Amount owed to the provider recorded once, against the right account",
            "Unexpected deliveries held as pending until the provider is found and the product verified",
            "Only verified products go into saleable stock",
          ],
        },
        {
          ref: "mw-cards",
          w: 5,
          name: "Card customers and card providers",
          description:
            "A database of card providers by bank, with Order and Swipe transactions.",
          includes: [
            "Card providers with contact details and the banks and number of cards they hold",
            "Search providers by bank, for example SBI or ICICI",
            "Order mode: product, ordered price, buying price, person, platform and status",
            "Swipe mode: product, amount, store machine, platform, provider and reference",
            "No card numbers or card details are stored",
          ],
        },
        {
          ref: "mw-billing",
          w: 8,
          name: "Sales and billing",
          description:
            "Sales of every product type, cash and online payments, group bills, and GST and non-GST bills.",
          includes: [
            "Sale entry with product, quantity, actual price, store, buyer and payment",
            "Cash and online payments; payments made straight to a provider kept out of store cash",
            "Group bills with several products and quantities in one bill",
            "GST and non-GST bill formats (legal and tax details from the client)",
            "Internal transfers kept apart from customer sales",
          ],
        },
        {
          ref: "mw-daybook",
          w: 8,
          name: "Daybook and daily accounting",
          description:
            "Each store's day in one place: sales, money in and out, expenses and the closing cash.",
          includes: [
            "Daily sales by category: smartphones, feature phones and accessories",
            "Money received from and paid to people and businesses",
            "Expenses such as salary, water and courier, with categories the admin can add",
            "Closing cash = opening cash + cash received − cash paid out, with the breakdown",
            "Yesterday's closing cash becomes today's opening cash",
            "Daily stock movement and a review of the day for errors",
          ],
        },
      ],
    },
    {
      name: "Messaging, reports and control",
      items: [
        {
          ref: "mw-whatsapp",
          w: 4,
          name: "WhatsApp messaging",
          description:
            "Balance messages to buyers and card requests to providers, always checked and sent by the admin.",
          includes: [
            "Outstanding balance message to one, several or all selected buyers",
            "Card request to providers of a chosen bank, for a set amount",
            "Nothing is sent automatically; the admin checks the message and recipients first",
            "Message wording approved by the client",
          ],
        },
        {
          ref: "mw-dashboard",
          w: 8,
          name: "Admin dashboard and reports",
          description:
            "Daily sales, stock, cash and profit across all stores at a glance, with history over time.",
          includes: [
            "Daily sales, stock and cash in hand for each store, and godown stock",
            "Selling price against listing price, in green above and red below",
            "Gross profit from actual selling price less purchase cost",
            "Daily, weekly, monthly, quarterly and yearly trends",
            "Open any figure to see the transactions behind it",
          ],
        },
        {
          ref: "mw-attachments",
          w: 2,
          name: "Invoice attachments",
          description:
            "Upload an invoice against a purchase or sale and find it again later.",
          includes: [
            "Attach an invoice file to the matching record",
            "Open it again from that record",
            "File types, size and access to be agreed",
          ],
        },
        {
          ref: "mw-security",
          w: 6,
          name: "Master data, security and audit",
          description:
            "The lists the system runs on, protected changes and a full record of who did what.",
          includes: [
            "Stores, categories, brands, companies, platforms and expense types kept by the admin",
            "Admin corrections protected by password or OTP",
            "History of every important action: who, what and when",
            "No silent deletion: corrections keep the original record",
            "A sale, transfer or payment updates stock, sales and accounts together",
          ],
        },
      ],
    },
  ],
  terms: [
    "This quotation covers the modules in the Mobile Wholesale Business Requirements document shared with you.",
    "The open points in Section 19 of that document (logins, stock valuation, transfers, settlements, billing details and others) will be confirmed with you before those modules are finalised.",
    "You provide the store and godown names, the opening inventory data, the price list and the GST details for billing.",
    "A public website, online store, online payments for customers and delivery-partner integrations are not included and can be quoted separately.",
    "WhatsApp, SMS, hosting and other third-party charges are paid separately, at actuals.",
    "All prices are in Indian Rupees (INR).",
  ].join("\n"),
};

export const QUOTE_PRESETS: QuotePreset[] = [MOBILE_WHOLESALE];

/** Ticked one-time Build rows: what a template's rows take the place of. */
const replaced = (l: QuoteLine) =>
  l.on && l.section === "build" && l.billing === "once";

/**
 * A quote filled from a template. Its ticked one-time Build rows give way
 * to the template's, which share the same development cost (after the old
 * rows' discounts), so the total does not move. The terms are the
 * template's, and descriptions, scope and terms are shown. Maintenance and
 * every other row stay as they are.
 */
export function applyPreset(body: QuoteBody, preset: QuotePreset): QuoteBody {
  const cost = body.lines
    .filter(replaced)
    .reduce((n, l) => n + l.price - discountOf(l.price, l.discount), 0);
  const items = preset.groups.flatMap((g) => {
    const groupId = newId();
    return g.items.map((item) => ({ ...item, groupId, groupName: g.name }));
  });
  const weight = items.reduce((n, i) => n + i.w, 0) || 1;
  let given = 0;
  const fresh: QuoteLine[] = items.map((item, i) => {
    const price =
      i === items.length - 1
        ? cost - given
        : Math.floor((cost * item.w) / weight);
    given += price;
    return {
      id: newId(),
      on: true,
      section: "build",
      groupId: item.groupId,
      groupName: item.groupName,
      name: item.name,
      service: "software",
      description: item.description,
      price,
      billing: "once",
      discount: { mode: "none", value: 0 },
      ref: item.ref,
      includes: item.includes,
    };
  });
  return {
    ...body,
    lines: [...fresh, ...body.lines.filter((l) => !replaced(l))],
    doc: {
      ...body.doc,
      terms: preset.terms,
      show: { ...body.doc.show, descriptions: true, scope: true, terms: true },
    },
  };
}
