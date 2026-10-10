/**
 * The outside services we wire into client projects, one entry per provider:
 * what each of its integrations does, what it costs, how to get access and
 * how it connects. Every provider answers the same seven questions in the
 * same order (SECTIONS), so two providers can be compared side by side.
 *
 * Prices move and many are not published. Each price row says how sure we
 * are: "official" is the provider's own pricing page, "reported" is from
 * third-party write-ups that do not always agree, and "quote" means the
 * provider only gives a price on request or per account.
 */

export type Confidence = "official" | "reported" | "quote";

export type IntegrationProduct = {
  name: string;
  /** What it does for the project, in a sentence. */
  what: string;
  /** How it is connected: REST API, webhook, SDK, plugin, dashboard. */
  via: string;
};

export type PriceRow = {
  item: string;
  price: string;
  /** Per what, and anything that changes the number. */
  basis: string;
  confidence: Confidence;
};

export type Integration = {
  slug: string;
  name: string;
  category: CategoryId;
  /** One line for the list. */
  tagline: string;
  overview: string;
  useFor: string[];
  products: IntegrationProduct[];
  pricing: PriceRow[];
  pricingNote: string;
  setup: string[];
  technical: { label: string; value: string }[];
  watchOuts: string[];
  links: { label: string; url: string }[];
  checked: string;
};

export const CATEGORIES = [
  { id: "delivery", label: "Delivery and shipping" },
  { id: "payments", label: "Payments" },
  { id: "messaging", label: "Messages and email" },
  { id: "maps", label: "Maps and location" },
  { id: "signin", label: "Sign-in" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/** The table of contents every provider page follows, in this order. */
export const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "integrations", label: "Integrations" },
  { id: "pricing", label: "Pricing" },
  { id: "setup", label: "Getting access" },
  { id: "technical", label: "How it connects" },
  { id: "watch-outs", label: "Watch-outs" },
  { id: "links", label: "Links" },
] as const;

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  official: "Official",
  reported: "Reported",
  quote: "Quote only",
};

const CHECKED = "Oct 2026";

export const INTEGRATIONS: Integration[] = [
  {
    slug: "delhivery",
    name: "Delhivery",
    category: "delivery",
    tagline: "Courier across India: forward, reverse, COD and freight",
    overview:
      "India's largest independent courier network, used directly through its own API rather than through an aggregator. Worth it once a client ships enough parcels to negotiate their own rate card; below that, an aggregator such as Shiprocket is usually cheaper and quicker to start.",
    useFor: [
      "Ecommerce orders shipped anywhere in India",
      "Cash-on-delivery orders, with the cash remitted back",
      "Returns picked up from the customer (reverse pickup)",
      "Heavier B2B shipments as part-truck freight",
    ],
    products: [
      {
        name: "Pincode serviceability",
        what: "Checks whether a pincode is served, and for which of prepaid, COD and reverse pickup, before the customer can order.",
        via: "REST API",
      },
      {
        name: "Waybill (AWB) fetch",
        what: "Reserves tracking numbers in bulk so orders can be labelled the moment they are created.",
        via: "REST API",
      },
      {
        name: "Shipment creation and update",
        what: "Books the parcel with weight, dimensions, address and payment mode, and edits it before pickup.",
        via: "REST API",
      },
      {
        name: "Pickup request",
        what: "Asks for a pickup from a registered warehouse for a date and parcel count.",
        via: "REST API",
      },
      {
        name: "Shipping label",
        what: "Returns the printable label for each waybill.",
        via: "REST API (PDF)",
      },
      {
        name: "Shipping cost calculator",
        what: "Prices a parcel from origin, destination, weight and mode before booking.",
        via: "REST API",
      },
      {
        name: "Tracking",
        what: "Returns the scan history for a waybill; status pushes can also be set up so the order page updates itself.",
        via: "REST API and webhook",
      },
      {
        name: "B2B freight (LTL)",
        what: "Part-truck loads for heavier consignments, booked and tracked separately from parcels.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "Surface, within city",
        price: "About ₹25 to ₹32 per 500 g",
        basis: "Forward parcel, first 500 g",
        confidence: "reported",
      },
      {
        item: "Express, within city / metro / rest of India",
        price: "About ₹30 / ₹43 / ₹58 per 500 g",
        basis: "Forward parcel, first 500 g",
        confidence: "reported",
      },
      {
        item: "Typical range, 500 g and 1 kg",
        price: "₹50 to ₹90 (500 g), ₹80 to ₹180 (1 kg)",
        basis: "Direct account, by zone",
        confidence: "reported",
      },
      {
        item: "Cash on delivery",
        price: "About ₹15 to ₹25, or a % of order value",
        basis: "Per COD shipment, whichever is higher",
        confidence: "reported",
      },
      {
        item: "Network surcharge (from 1 Sep 2026)",
        price: "+₹4 express, +₹2 surface",
        basis: "Per shipment",
        confidence: "reported",
      },
      {
        item: "Fuel surcharge",
        price: "About 8% to 22%",
        basis: "On the freight amount, revised monthly",
        confidence: "reported",
      },
      {
        item: "API access",
        price: "₹0",
        basis: "Comes with a Delhivery One business account",
        confidence: "official",
      },
    ],
    pricingNote:
      "There is no public rate card. Rates depend on volume, zones and weight slabs and are set per account, so get the client's own rate card before quoting delivery costs. 18% GST on top.",
    setup: [
      "Create a Delhivery One business account with the client's GST, PAN and bank details.",
      "Register each pickup warehouse; its exact registered name is used in every API call.",
      "Sign the rate card with the Delhivery sales contact (volume decides the price).",
      "Open the Client Developer Portal to get staging and production URLs and the API token.",
      "Test in staging, then switch the token and URL to production.",
    ],
    technical: [
      { label: "Auth", value: "Static API token in the Authorization header" },
      {
        label: "Sandbox",
        value: "Yes, a staging environment with its own URL",
      },
      {
        label: "Webhooks",
        value: "Tracking status pushes, set up with Delhivery",
      },
      { label: "SDKs", value: "None official; plain HTTPS and JSON" },
      {
        label: "Docs",
        value: "Behind the Delhivery One login (Client Developer Portal)",
      },
    ],
    watchOuts: [
      "Weight is billed on the higher of actual and volumetric weight, and disputes are common: weigh and measure before booking.",
      "COD cash comes back on a remittance cycle, not instantly; agree the cycle in the contract.",
      "Failed deliveries (NDR) are charged both ways if they become returns (RTO).",
      "The warehouse name in API calls must match the registered one exactly.",
    ],
    links: [
      { label: "Website", url: "https://www.delhivery.com/" },
      {
        label: "Client Developer Portal",
        url: "https://help.delhivery.com/docs/client-developer-portal-1",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "shiprocket",
    name: "Shiprocket",
    category: "delivery",
    tagline: "One API, 17+ couriers, the cheapest one picked per parcel",
    overview:
      "A shipping aggregator: one account and one API that books with Delhivery, Xpressbees, Blue Dart, Ekart and others, picking the cheapest or fastest courier per parcel. The quickest way for a new store to ship across India with no minimum volume.",
    useFor: [
      "New ecommerce stores with no courier contract yet",
      "Comparing courier rates per order automatically",
      "COD with remittance handled by Shopify-style plugins",
    ],
    products: [
      {
        name: "Courier serviceability",
        what: "Lists the couriers that serve a route with their charges and delivery estimates.",
        via: "REST API",
      },
      {
        name: "Create order",
        what: "Creates the order and shipment in one call.",
        via: "REST API",
      },
      {
        name: "Assign AWB",
        what: "Picks a courier and returns the tracking number; can be reassigned.",
        via: "REST API",
      },
      {
        name: "Pickup, label, manifest and invoice",
        what: "Schedules the pickup and returns PDFs for the label, manifest and invoice.",
        via: "REST API (PDF links)",
      },
      {
        name: "Tracking",
        what: "Tracking by AWB or shipment id, plus status pushes.",
        via: "REST API and webhook",
      },
      {
        name: "Store channels",
        what: "Imports orders from Shopify, WooCommerce, Amazon and others without code.",
        via: "Dashboard plugin",
      },
    ],
    pricing: [
      {
        item: "Free plan",
        price: "₹0 a month",
        basis: "Pay per shipment from a prepaid wallet",
        confidence: "official",
      },
      {
        item: "Shipping rate",
        price: "From about ₹19 to ₹29 per 500 g",
        basis: "Cheapest surface courier, by plan",
        confidence: "reported",
      },
      {
        item: "Paid plans",
        price: "From about ₹199 a month",
        basis: "Lower per-parcel rates on higher plans",
        confidence: "reported",
      },
      {
        item: "Cash on delivery",
        price: "Charged per COD order",
        basis: "Fixed fee or % of order value, by plan",
        confidence: "quote",
      },
    ],
    pricingNote:
      "Prices are shown in the dashboard per route before booking. The wallet must be recharged in advance. 18% GST on top.",
    setup: [
      "Sign up and complete KYC (PAN, GST optional for small sellers, bank account).",
      "Add the pickup address and recharge the wallet.",
      "Create an API user under Settings, API (a separate email from the main login).",
      "Call the auth endpoint with that user to get a token, valid for 10 days.",
    ],
    technical: [
      {
        label: "Auth",
        value:
          "Email and password of an API user, exchanged for a bearer token",
      },
      { label: "Base URL", value: "https://apiv2.shiprocket.in/v1/external/" },
      {
        label: "Sandbox",
        value: "No separate sandbox; test with cancelled orders",
      },
      { label: "Webhooks", value: "Tracking pushes, set in Settings" },
      { label: "Docs", value: "Public, with a Postman collection" },
    ],
    watchOuts: [
      "The token expires every 10 days; refresh it on a schedule, not on failure.",
      "Weight discrepancies are deducted from the wallet after delivery.",
      "Courier choice changes per order, so delivery times are less predictable than a direct contract.",
    ],
    links: [
      {
        label: "Pricing",
        url: "https://www.shiprocket.in/pricing-plan-professionals/",
      },
      { label: "API docs", url: "https://apidocs.shiprocket.in/" },
      {
        label: "API helpsheet",
        url: "https://support.shiprocket.in/support/solutions/articles/43000337456",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "porter",
    name: "Porter",
    category: "delivery",
    tagline: "Same-city delivery by two-wheeler, booked from the app",
    overview:
      "Intra-city delivery on demand: a rider picks up and delivers within the hour. The API books two-wheelers only; trucks and tempos are booked from the Porter Enterprise dashboard.",
    useFor: [
      "Restaurants, bakeries, pharmacies and stores delivering in one city",
      "Same-day documents and parcels between branches",
    ],
    products: [
      {
        name: "Get quote",
        what: "Live fare between two points, and whether both are serviceable.",
        via: "REST API",
      },
      {
        name: "Create order",
        what: "Books a two-wheeler with one pickup and one drop; returns a tracking link.",
        via: "REST API",
      },
      {
        name: "Track and cancel",
        what: "Order status (at most once a minute per order) and cancellation.",
        via: "REST API",
      },
      {
        name: "Status webhooks",
        what: "Pushes each stage: allotted, picked up, delivered.",
        via: "Webhook",
      },
      {
        name: "Delivery code",
        what: "Optional code sent to the receiver by SMS, needed to close the trip.",
        via: "Dashboard setting",
      },
    ],
    pricing: [
      {
        item: "Two-wheeler, Bengaluru",
        price: "From ₹48 a trip",
        basis: "First 1 km and 25 minutes of waiting included",
        confidence: "official",
      },
      {
        item: "API access",
        price: "₹0",
        basis: "Trips paid from a prepaid Enterprise wallet",
        confidence: "official",
      },
    ],
    pricingNote:
      "Fares change with distance, area and time of day; the Get quote API is the real price for each trip.",
    setup: [
      "Open a Porter Enterprise account (activated in about one business day).",
      "Request API credentials through the form on the API integrations page.",
      "Top up the wallet; every trip is prepaid.",
    ],
    technical: [
      { label: "Auth", value: "API key issued by Porter" },
      { label: "Sandbox", value: "Ask Porter when requesting credentials" },
      { label: "Webhooks", value: "Yes, per order stage" },
      { label: "Rate limits", value: "Track Order once a minute per order" },
    ],
    watchOuts: [
      "No cash on delivery through the API: send prepaid orders only.",
      "One pickup and one drop per order; multi-stop routes need separate orders.",
      "Two-wheelers only through the API.",
    ],
    links: [
      { label: "API integrations", url: "https://porter.in/api-integrations" },
      {
        label: "Two-wheeler fares",
        url: "https://porter.in/two-wheelers/bangalore",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    category: "payments",
    tagline:
      "Payment gateway, links, subscriptions, split payments and payouts",
    overview:
      "The default payment gateway for Indian businesses: cards, UPI, netbanking, wallets and EMI behind one checkout, plus links, subscriptions, marketplace splits and bank payouts on the same account.",
    useFor: [
      "Taking payments on a website or app",
      "Sending a payment link on WhatsApp or email",
      "Monthly subscriptions and fee collection",
      "Marketplaces that split each payment between sellers",
    ],
    products: [
      {
        name: "Standard Checkout",
        what: "The hosted payment popup for cards, UPI, netbanking, wallets and EMI.",
        via: "JS / mobile SDK and Orders API",
      },
      {
        name: "Payment Links",
        what: "A link for an amount, sent by SMS, email or WhatsApp, with no website needed.",
        via: "Dashboard or REST API",
      },
      {
        name: "Payment Pages and Buttons",
        what: "No-code pages and buttons for donations, fees and events.",
        via: "Dashboard",
      },
      {
        name: "Subscriptions",
        what: "Recurring charges on cards, UPI Autopay and e-mandates.",
        via: "REST API and webhooks",
      },
      {
        name: "Route",
        what: "Splits each payment between linked accounts, for marketplaces.",
        via: "REST API",
      },
      {
        name: "Smart Collect",
        what: "Virtual bank accounts and UPI ids per customer, matched automatically.",
        via: "REST API",
      },
      {
        name: "Payouts (RazorpayX)",
        what: "Sends money to bank accounts and UPI ids: refunds, vendor and salary payouts.",
        via: "REST API",
      },
      {
        name: "Webhooks",
        what: "Signed events for payments, refunds and subscriptions; the server's source of truth.",
        via: "Webhook",
      },
    ],
    pricing: [
      {
        item: "Domestic cards, UPI, netbanking, wallets, EMI",
        price: "2%",
        basis: "Per payment, plus 18% GST on the fee",
        confidence: "official",
      },
      {
        item: "Corporate and business credit cards",
        price: "2.15%",
        basis: "Per payment",
        confidence: "official",
      },
      {
        item: "International cards",
        price: "Up to 3%",
        basis: "Per payment",
        confidence: "official",
      },
      {
        item: "Payment Pages and Buttons",
        price: "0.2% + gateway fee",
        basis: "Per payment",
        confidence: "official",
      },
      {
        item: "Subscriptions on cards",
        price: "0.9% + gateway fee",
        basis: "Per charge; UPI and NACH on request",
        confidence: "official",
      },
      {
        item: "Route",
        price: "0.1% + gateway fee",
        basis: "Per split payment",
        confidence: "official",
      },
      {
        item: "Smart Collect",
        price: "1% or ₹10, whichever is lower",
        basis: "Per incoming transfer",
        confidence: "official",
      },
      {
        item: "Payouts (RazorpayX)",
        price: "From ₹2,476 a quarter",
        basis: "BB+ Core plan; higher plans for API access",
        confidence: "official",
      },
      {
        item: "Setup, yearly fee, refunds",
        price: "₹0",
        basis: "",
        confidence: "official",
      },
    ],
    pricingNote:
      "₹1,000 collected costs about ₹23.60 with GST. New accounts often get 0% for the first 90 days on up to ₹5 lakh; check the current offer.",
    setup: [
      "Sign up with the client's business PAN, GST (if registered) and current account.",
      "Complete KYC: business proof, address proof and the website or app with policies (refund, terms, privacy, contact).",
      "Test with the test-mode keys straight away; live keys come after activation (usually 2 to 5 working days).",
      "Add the webhook URL and secret in the dashboard before going live.",
    ],
    technical: [
      {
        label: "Auth",
        value: "Key id and key secret (Basic auth), test and live pairs",
      },
      { label: "Sandbox", value: "Test mode on the same account" },
      { label: "Webhooks", value: "Signed with HMAC-SHA256; verify every one" },
      {
        label: "SDKs",
        value: "Node, Python, PHP, Java, Android, iOS, React Native, Flutter",
      },
    ],
    watchOuts: [
      "Never trust the browser's success callback alone: confirm by signature or webhook on the server.",
      "The website must show refund, terms, privacy and contact pages or KYC is rejected.",
      "Settlement is T+2 by default; instant settlement costs extra.",
    ],
    links: [
      { label: "Pricing", url: "https://razorpay.com/pricing/" },
      { label: "Docs", url: "https://razorpay.com/docs/" },
    ],
    checked: CHECKED,
  },
  {
    slug: "cashfree",
    name: "Cashfree",
    category: "payments",
    tagline: "Gateway, payouts and subscriptions at slightly lower rates",
    overview:
      "A Razorpay alternative with a lower headline rate and per-transfer payout pricing instead of a plan. Strong on payouts, verification APIs and UPI Autopay.",
    useFor: [
      "Payments where 0.05% matters at volume",
      "Payouts priced per transfer with no monthly plan",
      "Subscriptions on UPI Autopay",
    ],
    products: [
      {
        name: "Payment Gateway",
        what: "Hosted and embedded checkout for cards, UPI, netbanking, wallets, EMI and Pay Later.",
        via: "JS / mobile SDK and Orders API",
      },
      {
        name: "Payment Links and Forms",
        what: "Links and no-code forms, no website needed.",
        via: "Dashboard or REST API",
      },
      {
        name: "Subscriptions",
        what: "Card mandates, e-NACH and UPI Autopay.",
        via: "REST API and webhooks",
      },
      {
        name: "Payouts",
        what: "Bank, UPI and Amazon Pay transfers, single or in bulk.",
        via: "REST API",
      },
      {
        name: "Virtual accounts",
        what: "A bank account per customer for IMPS, NEFT and RTGS collection.",
        via: "REST API",
      },
      {
        name: "Easy Split",
        what: "Splits payments between vendors for marketplaces.",
        via: "REST API",
      },
      {
        name: "Secure ID",
        what: "Bank account, PAN, GSTIN and Aadhaar verification.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "Domestic cards, UPI, netbanking, wallets",
        price: "1.95%",
        basis: "Per payment, plus 18% GST",
        confidence: "official",
      },
      {
        item: "Credit card EMI / debit card EMI",
        price: "2.2% / 1.5%",
        basis: "Per payment",
        confidence: "official",
      },
      {
        item: "International cards / Amex",
        price: "2.99% / 2.95%",
        basis: "Per payment",
        confidence: "official",
      },
      {
        item: "Instant settlement",
        price: "0.30%",
        basis: "On top of the gateway fee",
        confidence: "official",
      },
      {
        item: "Payouts by NEFT / IMPS or UPI",
        price: "₹3 to ₹8 / ₹6 to ₹15",
        basis: "Per transfer, by amount",
        confidence: "official",
      },
      {
        item: "UPI Autopay mandate",
        price: "₹7.50 + ₹5 (under ₹1,000), ₹7.50 + ₹15 (above)",
        basis: "Creation + per debit",
        confidence: "official",
      },
      {
        item: "Virtual account payment",
        price: "₹20",
        basis: "Per IMPS, NEFT or RTGS payment",
        confidence: "official",
      },
      {
        item: "Payment links, setup",
        price: "₹0",
        basis: "",
        confidence: "official",
      },
    ],
    pricingNote:
      "New merchants are often offered 0% on the first ₹20 lakh of domestic payments (not Amex, EMI or international). 18% GST on all fees.",
    setup: [
      "Sign up and complete KYC with PAN, GST, current account and the website or app.",
      "Use the test environment keys while KYC is reviewed.",
      "Payouts are a separate product and need their own activation.",
    ],
    technical: [
      { label: "Auth", value: "Client id and client secret in headers" },
      { label: "Sandbox", value: "Yes, a separate test environment" },
      { label: "Webhooks", value: "Signed; verify the signature header" },
      {
        label: "SDKs",
        value: "Node, Python, PHP, Java, Go, Android, iOS, Flutter",
      },
    ],
    watchOuts: [
      "API versions are pinned with a header; keep it fixed so a new version does not change responses.",
      "Payout transfers need a funded payout account, separate from collections.",
    ],
    links: [
      {
        label: "Pricing",
        url: "https://www.cashfree.com/payment-gateway-charges/",
      },
      { label: "Docs", url: "https://www.cashfree.com/docs/" },
    ],
    checked: CHECKED,
  },
  {
    slug: "phonepe",
    name: "PhonePe Payment Gateway",
    category: "payments",
    tagline: "Gateway from India's largest UPI app",
    overview:
      "PhonePe's online payment gateway. UPI-first, with high success rates on PhonePe UPI, plus cards and netbanking. Pricing is agreed per merchant.",
    useFor: [
      "Stores where most customers pay by UPI",
      "A second gateway to fall back on when the first fails",
    ],
    products: [
      {
        name: "Standard Checkout",
        what: "Hosted checkout with UPI intent, collect and QR, cards and netbanking.",
        via: "REST API and mobile SDK",
      },
      {
        name: "Payment Links",
        what: "Links for an amount, shared on any channel.",
        via: "Dashboard or REST API",
      },
      {
        name: "Autopay",
        what: "UPI Autopay mandates for subscriptions.",
        via: "REST API",
      },
      {
        name: "Callbacks",
        what: "Server-to-server status updates for each payment.",
        via: "Webhook",
      },
    ],
    pricing: [
      {
        item: "Setup and yearly fee",
        price: "₹0",
        basis: "",
        confidence: "official",
      },
      {
        item: "UPI (bank account)",
        price: "Usually free",
        basis: "Zero MDR rules; wallet-funded UPI may cost up to 1.1%",
        confidence: "official",
      },
      {
        item: "Cards, netbanking",
        price: "About 2%",
        basis: "Per payment; set in the merchant agreement",
        confidence: "quote",
      },
    ],
    pricingNote:
      "Rates are not published and are agreed per merchant by category and volume. Settlement is T+1. 18% GST on fees.",
    setup: [
      "Apply as a merchant with PAN, GST, current account and the website.",
      "Integrate with the UAT (test) credentials, then submit for review.",
      "Production credentials are issued after the integration passes review.",
    ],
    technical: [
      {
        label: "Auth",
        value: "Client id and secret exchanged for an access token",
      },
      { label: "Sandbox", value: "UAT environment" },
      {
        label: "Webhooks",
        value: "Callbacks with an authorization header to check",
      },
      {
        label: "SDKs",
        value: "Android, iOS, web; server calls are plain HTTPS",
      },
    ],
    watchOuts: [
      "Go-live needs PhonePe's own review of the integration, which takes extra days.",
      "Always confirm status with the Order Status API, not only the redirect.",
    ],
    links: [
      {
        label: "Website",
        url: "https://www.phonepe.com/business-solutions/payment-gateway/",
      },
      { label: "Developer docs", url: "https://developer.phonepe.com/" },
    ],
    checked: CHECKED,
  },
  {
    slug: "whatsapp",
    name: "WhatsApp Business Platform",
    category: "messaging",
    tagline: "Order updates, OTPs and offers on WhatsApp, priced per message",
    overview:
      "Meta's API for sending WhatsApp messages from a business number: order confirmations, OTPs, reminders and marketing. Since July 2025 it is billed per delivered template message, by category and the recipient's country.",
    useFor: [
      "Order, booking and delivery updates",
      "OTP sign-in codes",
      "Replying to customers inside the 24-hour window",
      "Marketing broadcasts to people who opted in",
    ],
    products: [
      {
        name: "Cloud API",
        what: "Sends and receives messages from the business number, hosted by Meta.",
        via: "REST API (Graph API)",
      },
      {
        name: "Message templates",
        what: "Pre-approved messages in four categories: marketing, utility, authentication, service.",
        via: "WhatsApp Manager or API",
      },
      {
        name: "Webhooks",
        what: "Incoming messages and delivery, read and failed statuses.",
        via: "Webhook",
      },
      {
        name: "Flows",
        what: "Forms inside WhatsApp: bookings, sign-ups, surveys.",
        via: "API and Flow builder",
      },
      {
        name: "Business Solution Providers",
        what: "Partners such as AiSensy or Interakt that add an inbox and broadcasts on top, for a fee.",
        via: "Dashboard",
      },
    ],
    pricing: [
      {
        item: "Marketing message (India)",
        price: "About ₹0.86",
        basis: "Per delivered message; no volume discount",
        confidence: "reported",
      },
      {
        item: "Utility message (India)",
        price: "About ₹0.115",
        basis: "Per delivered message; cheaper at volume",
        confidence: "reported",
      },
      {
        item: "Authentication / OTP (India)",
        price: "About ₹0.115",
        basis: "Per delivered message; cheaper at volume",
        confidence: "reported",
      },
      {
        item: "Service replies",
        price: "₹0",
        basis: "Inside the 24-hour window after the customer writes",
        confidence: "official",
      },
      {
        item: "Utility template inside the 24-hour window",
        price: "₹0",
        basis: "",
        confidence: "official",
      },
    ],
    pricingNote:
      "Meta's own rate card is in US dollars per country and changes a few times a year; rupee billing for India is planned for the second half of 2026. Providers like AiSensy add their own markup and monthly fee.",
    setup: [
      "Verify the client's business in Meta Business Manager.",
      "Add a phone number that is not on the WhatsApp app (or delete it from the app first).",
      "Set the display name, which Meta reviews.",
      "Create a system user token for the API and submit templates for approval.",
      "Add a payment method in WhatsApp Manager.",
    ],
    technical: [
      { label: "Auth", value: "Permanent system-user access token" },
      { label: "Sandbox", value: "A test number with five recipient numbers" },
      {
        label: "Webhooks",
        value: "Signed with the app secret (X-Hub-Signature-256)",
      },
      {
        label: "Limits",
        value: "Starts at 250 business-started chats a day, rises with quality",
      },
    ],
    watchOuts: [
      "Templates are rejected if they look like marketing but are filed as utility; Meta recategorises them.",
      "Message quality ratings drop if people block the number, which cuts the daily limit.",
      "A number moved to the API can no longer use the WhatsApp Business app at the same time.",
    ],
    links: [
      {
        label: "Pricing",
        url: "https://developers.facebook.com/docs/whatsapp/pricing",
      },
      {
        label: "Cloud API docs",
        url: "https://developers.facebook.com/docs/whatsapp/cloud-api",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "msg91",
    name: "MSG91",
    category: "messaging",
    tagline: "SMS, OTP and voice for India, with DLT handled",
    overview:
      "An Indian messaging provider for transactional SMS and OTPs. Cheaper than Firebase for OTPs to Indian numbers, and it walks you through the TRAI DLT registration every sender needs.",
    useFor: [
      "OTP sign-in by SMS",
      "Order and appointment SMS alerts",
      "One provider for SMS, WhatsApp and email",
    ],
    products: [
      {
        name: "SendOTP",
        what: "Sends, retries and verifies OTPs, with a ready widget.",
        via: "REST API and widget",
      },
      {
        name: "Transactional SMS",
        what: "Template SMS sent through a registered sender id.",
        via: "REST API (Flow)",
      },
      {
        name: "WhatsApp, email, voice",
        what: "The same account for WhatsApp messages, email and voice OTP.",
        via: "REST API",
      },
      {
        name: "Delivery reports",
        what: "Delivered and failed statuses per message.",
        via: "Webhook",
      },
    ],
    pricing: [
      {
        item: "SMS, 5,000",
        price: "₹0.25 each",
        basis: "Prepaid pack",
        confidence: "official",
      },
      {
        item: "SMS, 30,000",
        price: "₹0.18 each",
        basis: "Prepaid pack",
        confidence: "official",
      },
      {
        item: "SMS, 60,000 to 4.5 lakh",
        price: "₹0.17 each",
        basis: "Prepaid pack",
        confidence: "official",
      },
      {
        item: "SMS, about 9.6 lakh",
        price: "₹0.16 each",
        basis: "Prepaid pack; down to ₹0.13 on request",
        confidence: "official",
      },
    ],
    pricingNote:
      "18% GST on top. DLT registration with a telecom operator has its own one-time fee, paid to the operator.",
    setup: [
      "Register the client as a principal entity on a DLT portal (Jio, Airtel, Vi or BSNL), with a GST or PAN.",
      "Register the sender id (header) and every SMS template on the DLT portal.",
      "Add the DLT ids to MSG91 and buy a credit pack.",
      "DLT approval usually takes 2 to 7 days, so start it early.",
    ],
    technical: [
      { label: "Auth", value: "Auth key in the request header" },
      { label: "Sandbox", value: "No; use a small credit pack" },
      { label: "Webhooks", value: "Delivery reports to a URL" },
    ],
    watchOuts: [
      "An SMS whose text does not match its DLT template exactly is blocked by the operator.",
      "Promotional SMS can only go out between 10 am and 9 pm.",
    ],
    links: [
      { label: "SMS pricing", url: "https://msg91.com/in/pricing/sms" },
      { label: "Docs", url: "https://docs.msg91.com/" },
    ],
    checked: CHECKED,
  },
  {
    slug: "resend",
    name: "Resend",
    category: "messaging",
    tagline: "Emails from the website: forms, receipts, sign-in links",
    overview:
      "A developer email API for the emails a website sends: contact-form notifications, receipts, password resets. This site's own contact form and admin codes go out through it.",
    useFor: [
      "Contact and enquiry form notifications",
      "Receipts, invoices and order emails",
      "Sign-in links and one-time codes by email",
      "Newsletters to a contact list (marketing plans)",
    ],
    products: [
      {
        name: "Emails API",
        what: "Sends an email with HTML or React Email templates.",
        via: "REST API and SDKs",
      },
      {
        name: "Domains",
        what: "Sends from the client's own domain after DNS verification (SPF, DKIM).",
        via: "Dashboard",
      },
      {
        name: "Broadcasts and audiences",
        what: "Newsletters to a stored contact list.",
        via: "Dashboard or API",
      },
      {
        name: "Webhooks",
        what: "Delivered, bounced, complained and opened events.",
        via: "Webhook",
      },
    ],
    pricing: [
      {
        item: "Free",
        price: "$0",
        basis: "3,000 emails a month, 100 a day, 3 domains",
        confidence: "official",
      },
      {
        item: "Pro",
        price: "$20 / $35 a month",
        basis: "50,000 / 100,000 emails; $0.90 per 1,000 extra",
        confidence: "official",
      },
      {
        item: "Scale",
        price: "From $90 a month",
        basis: "100,000 emails, up to 2.5 million on higher tiers",
        confidence: "official",
      },
      {
        item: "Marketing",
        price: "Free to 1,000 contacts, then from $40 a month",
        basis: "Priced by contacts, not emails",
        confidence: "official",
      },
    ],
    pricingNote:
      "Billed in US dollars. Most small client sites fit the free plan.",
    setup: [
      "Create an account and add the client's domain.",
      "Add the DNS records it shows (SPF, DKIM, optional DMARC) at the registrar.",
      "Create an API key with sending access only.",
    ],
    technical: [
      { label: "Auth", value: "API key as a bearer token" },
      {
        label: "Sandbox",
        value: "onboarding@resend.dev sends only to the account owner",
      },
      { label: "Webhooks", value: "Signed (Svix headers)" },
      { label: "SDKs", value: "Node, Python, PHP, Ruby, Go, Java, .NET" },
    ],
    watchOuts: [
      "Until the domain is verified, mail only reaches the account owner.",
      "If the domain already sends mail (Zoho, Google), add Resend's records alongside theirs, not instead of them.",
    ],
    links: [
      { label: "Pricing", url: "https://resend.com/pricing" },
      { label: "Docs", url: "https://resend.com/docs" },
    ],
    checked: CHECKED,
  },
  {
    slug: "google-maps",
    name: "Google Maps Platform",
    category: "maps",
    tagline: "Maps, address search, geocoding and routes",
    overview:
      "Google's maps APIs. Since March 2025 each API has its own free monthly allowance instead of one $200 credit, which covers most small client sites completely.",
    useFor: [
      "A map with the business's locations",
      "Address autocomplete at checkout",
      "Distance-based delivery charges",
      "Turning addresses into coordinates and back",
    ],
    products: [
      {
        name: "Maps JavaScript (dynamic maps)",
        what: "The interactive map on a web page.",
        via: "JS SDK",
      },
      {
        name: "Static Maps",
        what: "A map as an image, for emails and light pages.",
        via: "URL",
      },
      {
        name: "Places Autocomplete",
        what: "Suggests addresses and places as the customer types.",
        via: "JS SDK or REST API",
      },
      {
        name: "Place Details",
        what: "Full details for a chosen place: address parts, location, hours.",
        via: "REST API",
      },
      {
        name: "Geocoding",
        what: "Address to coordinates, and coordinates to address.",
        via: "REST API",
      },
      {
        name: "Routes and Route Matrix",
        what: "Directions, travel time and distances between many points.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "Dynamic Maps",
        price: "10,000 free, then $7 per 1,000",
        basis: "Map loads a month",
        confidence: "official",
      },
      {
        item: "Static Maps",
        price: "10,000 free, then $2 per 1,000",
        basis: "Requests a month",
        confidence: "official",
      },
      {
        item: "Places Autocomplete",
        price: "10,000 free, then $2.83 per 1,000",
        basis: "Requests a month",
        confidence: "official",
      },
      {
        item: "Place Details Essentials / Pro",
        price: "10,000 / 5,000 free, then $5 / $17 per 1,000",
        basis: "Requests a month",
        confidence: "official",
      },
      {
        item: "Geocoding",
        price: "10,000 free, then $5 per 1,000",
        basis: "Requests a month",
        confidence: "official",
      },
      {
        item: "Compute Routes / Route Matrix (Essentials)",
        price: "10,000 free, then $5 per 1,000",
        basis: "Requests or elements a month",
        confidence: "official",
      },
    ],
    pricingNote:
      "Free allowances are per API, every month: about 10,000 for Essentials, 5,000 for Pro and 1,000 for Enterprise features. Embedding a plain map with the Embed API is free. Billed in US dollars.",
    setup: [
      "Create a Google Cloud project and turn on billing (a card is required even for free use).",
      "Enable only the APIs the site uses.",
      "Create an API key and restrict it to the site's domains and those APIs.",
      "Set a budget alert in Cloud Billing.",
    ],
    technical: [
      { label: "Auth", value: "API key, restricted by domain or app" },
      { label: "Sandbox", value: "No; the free allowance covers testing" },
      { label: "SDKs", value: "JS, Android, iOS, Flutter plugins" },
    ],
    watchOuts: [
      "An unrestricted key in a web page will be copied and used by others on the client's bill.",
      "Autocomplete should use session tokens so a search and its details are billed as one session.",
      "Asking for more fields than needed moves a request from Essentials to Pro pricing.",
    ],
    links: [
      {
        label: "Pricing",
        url: "https://developers.google.com/maps/billing-and-pricing/pricing",
      },
      {
        label: "Docs",
        url: "https://developers.google.com/maps/documentation",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "ola-maps",
    name: "Ola Maps",
    category: "maps",
    tagline: "Indian maps, autocomplete and routing with a large free tier",
    overview:
      "Ola's maps platform, built for Indian addresses and roads, with a generous free monthly tier. A cheaper choice than Google for India-only apps that make many calls.",
    useFor: [
      "Delivery and ride apps in India with heavy routing",
      "Address autocomplete for Indian addresses",
    ],
    products: [
      {
        name: "Map tiles",
        what: "Vector maps for web and mobile.",
        via: "Web and mobile SDKs",
      },
      {
        name: "Autocomplete and Places",
        what: "Address and place search for India.",
        via: "REST API",
      },
      {
        name: "Geocoding",
        what: "Address to coordinates and back.",
        via: "REST API",
      },
      {
        name: "Directions and distance matrix",
        what: "Routes, travel times and distances.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "Free tier",
        price: "₹0 up to about 5 lakh calls",
        basis: "Per API, per month",
        confidence: "reported",
      },
      {
        item: "Geocoding / Autocomplete / Directions",
        price: "About ₹0.015 / ₹0.01 / ₹0.035 per call",
        basis: "Beyond the free tier",
        confidence: "reported",
      },
    ],
    pricingNote:
      "New tiers started on 1 September 2026, with paid usage moving to prepaid credits; check the live pricing page before quoting heavy usage.",
    setup: [
      "Sign up on the Ola Maps developer console.",
      "Create a project and an API key.",
      "Buy prepaid credits only if usage will pass the free tier.",
    ],
    technical: [
      { label: "Auth", value: "API key, or OAuth client credentials" },
      { label: "SDKs", value: "Web, Android, iOS" },
    ],
    watchOuts: [
      "Coverage and data are India only.",
      "Ola Maps credits are separate from Krutrim AI credits.",
    ],
    links: [
      { label: "Pricing", url: "https://maps.olakrutrim.com/pricing" },
      {
        label: "2026 pricing notice",
        url: "https://maps.olakrutrim.com/pricing/update-2026",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "firebase-auth",
    name: "Firebase Authentication",
    category: "signin",
    tagline: "Sign-in by Google, email or phone OTP for apps",
    overview:
      "Google's sign-in service for web and mobile apps: Google, Apple and email sign-in are free; phone OTP is charged per SMS sent.",
    useFor: [
      "Sign-in for mobile apps built with Flutter or React Native",
      "Phone number sign-in without running an SMS provider",
    ],
    products: [
      {
        name: "Social and email sign-in",
        what: "Google, Apple, Facebook, email and password, email links.",
        via: "Client SDKs",
      },
      {
        name: "Phone sign-in",
        what: "Sends and checks an SMS OTP.",
        via: "Client SDKs",
      },
      {
        name: "Admin SDK",
        what: "Verifies sign-in tokens on the server and manages users.",
        via: "Server SDK",
      },
      {
        name: "Identity Platform upgrade",
        what: "Multi-factor, SAML and OIDC, blocking functions, higher limits.",
        via: "Console",
      },
    ],
    pricing: [
      {
        item: "Google, Apple, email sign-in",
        price: "₹0",
        basis: "Up to 50,000 monthly users on Identity Platform",
        confidence: "official",
      },
      {
        item: "Phone OTP to India",
        price: "About $0.07 per SMS",
        basis: "Blaze (pay as you go) plan only",
        confidence: "reported",
      },
      {
        item: "SAML / OIDC sign-in",
        price: "$0.015 per monthly user",
        basis: "After the first 50",
        confidence: "reported",
      },
    ],
    pricingNote:
      "At about ₹6 an OTP, Firebase phone sign-in costs far more than MSG91 (about ₹0.20) for Indian numbers. Phone sign-in needs the Blaze plan with a billing account.",
    setup: [
      "Create a Firebase project and add the web or mobile app.",
      "Enable the sign-in methods needed.",
      "For phone sign-in, upgrade to Blaze and set an SMS region policy that allows India only.",
    ],
    technical: [
      {
        label: "Auth",
        value: "Client SDK config; server checks ID tokens with the Admin SDK",
      },
      {
        label: "Sandbox",
        value: "Test phone numbers with fixed codes, no SMS sent",
      },
      {
        label: "SDKs",
        value: "Web, Android, iOS, Flutter, React Native (community)",
      },
    ],
    watchOuts: [
      "Without an SMS region policy, bots can trigger costly OTPs to other countries.",
      "Phone sign-in on the web needs reCAPTCHA set up.",
    ],
    links: [
      { label: "Pricing", url: "https://firebase.google.com/pricing" },
      { label: "Docs", url: "https://firebase.google.com/docs/auth" },
    ],
    checked: CHECKED,
  },
];

export function integrationBySlug(slug: string) {
  return INTEGRATIONS.find((i) => i.slug === slug) ?? null;
}

export function integrationsByCategory() {
  return CATEGORIES.map((c) => ({
    ...c,
    items: INTEGRATIONS.filter((i) => i.category === c.id),
  })).filter((c) => c.items.length > 0);
}
