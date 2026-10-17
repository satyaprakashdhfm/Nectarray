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
  { id: "sms", label: "SMS and OTP" },
  { id: "messaging", label: "WhatsApp and email" },
  { id: "maps", label: "Maps and location" },
  { id: "signin", label: "Sign-in" },
  { id: "ai", label: "AI" },
  { id: "analytics", label: "Analytics and ads" },
  { id: "hosting", label: "Hosting, data and code" },
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
    category: "sms",
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
    slug: "message-central",
    name: "Message Central",
    category: "sms",
    tagline: "OTP by SMS for India, paid only when delivered, no DLT needed",
    overview:
      "An OTP service (VerifyNow) that sends and checks one-time codes by SMS. It sends from its own registered templates, so a client can start the same day without DLT registration, and it bills only OTPs the telecom operator confirms as delivered.",
    useFor: [
      "OTP sign-in when the client has no DLT registration yet",
      "Phone number checks at sign-up or checkout",
    ],
    products: [
      {
        name: "VerifyNow",
        what: "Sends an OTP, retries it and checks the code the user types.",
        via: "REST API",
      },
      {
        name: "WhatsApp OTP",
        what: "The same OTP sent on WhatsApp instead of SMS.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "OTP SMS, India",
        price: "From ₹0.30 each",
        basis: "Pay as you go; only delivered OTPs are charged",
        confidence: "official",
      },
      {
        item: "Large volumes",
        price: "Quote",
        basis: "Lower rates on request for high volume",
        confidence: "quote",
      },
      {
        item: "Setup",
        price: "₹0",
        basis: "No setup fee; free test credit at sign-up",
        confidence: "official",
      },
    ],
    pricingNote:
      "GST is not stated on the page; expect 18% on top. Prepaid wallet.",
    setup: [
      "Sign up and verify the business.",
      "Top up the wallet and take the customer id and auth token.",
      "Optional: register the client's own DLT sender id later for branded OTPs.",
    ],
    technical: [
      { label: "Auth", value: "Customer id and auth token" },
      { label: "Sandbox", value: "Free test credit at sign-up" },
      { label: "Webhooks", value: "None needed; the API checks the code" },
    ],
    watchOuts: [
      "OTPs come from Message Central's sender id, not the client's brand, unless the client registers their own DLT sender.",
      "Only for OTPs; order alerts and reminders need a DLT provider such as MSG91.",
    ],
    links: [
      {
        label: "India pricing",
        url: "https://www.messagecentral.com/product/verify-now/pricing/india",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "fast2sms",
    name: "Fast2SMS",
    category: "sms",
    tagline: "Low-cost bulk and OTP SMS for India, from a ₹100 top-up",
    overview:
      "An Indian SMS provider for OTPs, alerts and bulk messages. The price per SMS falls as the top-up grows, and credit bought in bulk lasts longer.",
    useFor: [
      "OTP and alert SMS on a small budget",
      "Bulk SMS to a client's customer list",
    ],
    products: [
      {
        name: "OTP SMS",
        what: "Sends a code the app generates.",
        via: "REST API",
      },
      {
        name: "DLT SMS",
        what: "Template SMS through the client's approved sender id.",
        via: "REST API",
      },
      {
        name: "Bulk SMS",
        what: "Campaigns to a list, from the dashboard.",
        via: "Dashboard",
      },
    ],
    pricing: [
      {
        item: "Top-up ₹100 to ₹3,999",
        price: "₹0.25 each",
        basis: "Credit never expires",
        confidence: "official",
      },
      {
        item: "Top-up ₹4,000 to ₹13,999",
        price: "₹0.21 to ₹0.19 each",
        basis: "Credit valid 6 months",
        confidence: "official",
      },
      {
        item: "Top-up ₹14,000 to ₹1.3 lakh",
        price: "₹0.17 to ₹0.15 each",
        basis: "Credit valid 12 months",
        confidence: "official",
      },
      {
        item: "Top-up ₹1.3 lakh and above",
        price: "₹0.13 to ₹0.11 each",
        basis: "₹0.11 from ₹6 lakh; valid 12 to 24 months",
        confidence: "official",
      },
    ],
    pricingNote:
      "₹50 free credit after sign-up. GST is not stated on the page; expect 18% on top.",
    setup: [
      "Sign up and complete KYC.",
      "Register the sender id and templates on a DLT portal, then add the DLT ids to Fast2SMS.",
      "Top up from ₹100 and take the API key.",
    ],
    technical: [
      { label: "Auth", value: "API key in the request header" },
      { label: "Sandbox", value: "No; ₹50 free credit to test" },
      { label: "Webhooks", value: "Delivery reports" },
    ],
    watchOuts: [
      "Its no-DLT 'Quick SMS' goes through an international route with manual approval; not for OTPs.",
      "Same DLT rules as every Indian sender: text must match the approved template.",
    ],
    links: [{ label: "Pricing", url: "https://www.fast2sms.com/" }],
    checked: CHECKED,
  },
  {
    slug: "twilio",
    name: "Twilio",
    category: "sms",
    tagline: "Global SMS and Verify, for clients with users abroad",
    overview:
      "A worldwide messaging platform. Far dearer than Indian providers for Indian numbers, so it fits only projects whose users are mostly outside India or that already run on Twilio.",
    useFor: [
      "OTPs and alerts to numbers outside India",
      "One provider for SMS, voice and WhatsApp in many countries",
    ],
    products: [
      {
        name: "Verify",
        what: "Sends and checks OTPs by SMS, WhatsApp, voice or email.",
        via: "REST API and SDKs",
      },
      {
        name: "Programmable SMS",
        what: "Any SMS from the app.",
        via: "REST API and SDKs",
      },
    ],
    pricing: [
      {
        item: "SMS to India",
        price: "$0.0832 each",
        basis: "Per 160-character segment; failed messages $0.001",
        confidence: "official",
      },
      {
        item: "Verify",
        price: "$0.05 each",
        basis: "Per successful verification, plus the SMS fee above",
        confidence: "official",
      },
    ],
    pricingNote:
      "An OTP to an Indian number through Verify comes to about $0.13 (₹12 or more), against ₹0.17 to ₹0.30 with an Indian provider.",
    setup: [
      "Create an account and upgrade from the trial.",
      "Register the sender for India (DLT) through Twilio's support.",
      "Take the account SID and auth token.",
    ],
    technical: [
      { label: "Auth", value: "Account SID and auth token" },
      { label: "Sandbox", value: "Trial account with test credit" },
      { label: "Webhooks", value: "Message status callbacks" },
    ],
    watchOuts: [
      "Billed in dollars on a card, so the rupee cost moves with the exchange rate.",
      "Use an Indian provider for Indian numbers unless there is a reason not to.",
    ],
    links: [
      {
        label: "India SMS pricing",
        url: "https://www.twilio.com/en-us/sms/pricing/in",
      },
      {
        label: "Verify pricing",
        url: "https://www.twilio.com/en-us/verify/pricing",
      },
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
  {
    slug: "payu",
    name: "PayU",
    category: "payments",
    tagline: "Payment gateway with links, subscriptions and payouts",
    overview:
      "One of India's oldest payment gateways: cards, UPI, netbanking, wallets, EMI and pay-later behind one checkout, priced pay-as-you-go with no setup or yearly fee.",
    useFor: [
      "Taking payments on a website or app",
      "Card and cardless EMI for higher-priced products",
      "Payment links sent on WhatsApp, SMS or email",
      "Recurring payments and payouts",
    ],
    products: [
      {
        name: "Checkout",
        what: "Hosted or embedded payment page for every Indian payment method.",
        via: "Web and mobile SDKs, REST API",
      },
      {
        name: "Payment Links",
        what: "A link for an amount, with no website needed.",
        via: "Dashboard or REST API",
      },
      {
        name: "Recurring payments",
        what: "Subscriptions on cards, UPI Autopay and e-mandates.",
        via: "REST API and webhooks",
      },
      {
        name: "Payouts",
        what: "Sends money to bank accounts and UPI ids: refunds, vendor payments.",
        via: "REST API",
      },
      {
        name: "Webhooks",
        what: "Server notifications for payment, refund and settlement events.",
        via: "Webhook",
      },
    ],
    pricing: [
      {
        item: "Domestic cards, netbanking, wallets, pay-later",
        price: "2%",
        basis: "Per payment, plus 18% GST on the fee",
        confidence: "official",
      },
      {
        item: "Amex, Diners, EMI, international cards",
        price: "3%",
        basis: "Per payment",
        confidence: "official",
      },
      {
        item: "UPI",
        price: "By business type and volume",
        basis: "Not published",
        confidence: "quote",
      },
      {
        item: "Setup, onboarding, yearly fee",
        price: "₹0",
        basis: "",
        confidence: "official",
      },
      {
        item: "Same-day or priority settlement",
        price: "Small extra fee",
        basis: "Standard settlement is T+2",
        confidence: "official",
      },
    ],
    pricingNote:
      "₹1,000 collected by card costs about ₹23.60 with GST. High-volume businesses get custom rates.",
    setup: [
      "Sign up with the client's business PAN, GST (if registered) and current account.",
      "Finish KYC with business and address proof, and a website or app showing refund, terms, privacy and contact pages.",
      "Build against the test keys, then switch to live keys after activation.",
      "Set the webhook URL before going live.",
    ],
    technical: [
      {
        label: "Auth",
        value: "Merchant key and salt; requests signed with a SHA-512 hash",
      },
      { label: "Sandbox", value: "Separate test environment and keys" },
      { label: "Webhooks", value: "Verify the hash on every one" },
      {
        label: "SDKs",
        value:
          "Android, iOS, React Native, Flutter; plugins for WooCommerce, Shopify",
      },
    ],
    watchOuts: [
      "Confirm each payment on the server with the hash or the verify API, never from the browser alone.",
      "UPI pricing is not public: get it in writing before quoting the client.",
    ],
    links: [
      { label: "Pricing", url: "https://payu.in/pricing/" },
      { label: "Docs", url: "https://docs.payu.in/" },
    ],
    checked: CHECKED,
  },
  {
    slug: "gemini",
    name: "Google Gemini API",
    category: "ai",
    tagline: "Google's AI models for chat, writing, reading files and speech",
    overview:
      "The AI behind this site's enquiry answers, project reviews, admin Agent and voice typing. Billed per million tokens read and written; Flash models are the low-cost workhorses.",
    useFor: [
      "Chat assistants and agents that call tools",
      "Writing, summarising and answering from a document",
      "Reading images, PDFs and audio",
      "Structured answers (JSON) for forms and checks",
    ],
    products: [
      {
        name: "Text and tool calling",
        what: "Answers and multi-step agents that read and change records through tools.",
        via: "REST API, AI SDK (@ai-sdk/google)",
      },
      {
        name: "Files and audio",
        what: "Reads PDFs, images and recordings in the same request.",
        via: "REST API",
      },
      {
        name: "Structured output",
        what: "Answers that follow a JSON schema.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "Gemini 3.6 / 3.7 / 3.8 Flash",
        price: "$0.75 in, $3.75 out",
        basis: "Per 1M tokens; doubles on 1 Jan 2027 ($1.50 / $7.50)",
        confidence: "official",
      },
      {
        item: "Gemini 3.1 Flash-Lite",
        price: "$0.25 in, $1.50 out",
        basis: "Per 1M tokens; the cheapest current model",
        confidence: "official",
      },
      {
        item: "Batch requests",
        price: "About half price",
        basis: "Answers within 24 hours",
        confidence: "official",
      },
      {
        item: "Free tier (AI Studio)",
        price: "$0",
        basis:
          "Low rate limits; free-tier prompts may be used to improve Google's products",
        confidence: "official",
      },
    ],
    pricingNote:
      "A typical admin Agent answer is a few thousand tokens: well under ₹1. Thinking tokens bill as output. See the AI models sheet for every model.",
    setup: [
      "Create a key in Google AI Studio on the company's Google account.",
      "Turn on billing for the project before launch, so the paid terms (no use of your data for training) apply.",
      "Set GOOGLE_GENERATIVE_AI_API_KEY on the server; never in the browser.",
    ],
    technical: [
      { label: "Auth", value: "API key in a server variable" },
      {
        label: "SDK",
        value: "Vercel AI SDK (@ai-sdk/google), or Google's own",
      },
      {
        label: "Limits",
        value: "Requests and tokens per minute by usage tier",
      },
    ],
    watchOuts: [
      "Model names change often: keep the model in a variable (GEMINI_MODEL, AGENT_MODEL).",
      "On the free tier prompts can be reviewed by Google; use a billed key for client data.",
    ],
    links: [
      {
        label: "Pricing",
        url: "https://ai.google.dev/gemini-api/docs/pricing",
      },
      { label: "Docs", url: "https://ai.google.dev/gemini-api/docs" },
    ],
    checked: CHECKED,
  },
  {
    slug: "groq",
    name: "Groq",
    category: "ai",
    tagline: "Very fast speech to text (Whisper) and open AI models",
    overview:
      "Runs open models on its own chips, so answers and transcripts come back in well under a second. This site uses its Whisper model for voice typing in the Workspace and the admin Agent when GROQ_API_KEY is set.",
    useFor: [
      "Voice typing and transcribing recordings",
      "Fast, cheap chat on open models",
    ],
    products: [
      {
        name: "Speech to text",
        what: "Whisper large-v3 and large-v3-turbo, from flac, mp3, m4a, ogg, wav or webm.",
        via: "REST API (OpenAI-compatible), AI SDK (@ai-sdk/groq)",
      },
      {
        name: "Chat models",
        what: "Open models such as Llama and Qwen at high speed.",
        via: "REST API (OpenAI-compatible)",
      },
    ],
    pricing: [
      {
        item: "whisper-large-v3-turbo",
        price: "$0.04",
        basis: "Per hour of audio; at least 10 seconds billed per request",
        confidence: "official",
      },
      {
        item: "whisper-large-v3",
        price: "$0.111",
        basis: "Per hour of audio; more accurate, slower",
        confidence: "official",
      },
      {
        item: "Free tier",
        price: "$0",
        basis: "Rate-limited; files up to 25 MB (100 MB on the paid tier)",
        confidence: "official",
      },
    ],
    pricingNote:
      "An hour of voice typing with turbo costs about ₹4. Chat model prices are per 1M tokens on Groq's pricing page.",
    setup: [
      "Create a key in the Groq console.",
      "Set GROQ_API_KEY on the server; without it the site falls back to Gemini for speech.",
    ],
    technical: [
      { label: "Auth", value: "API key (Bearer)" },
      {
        label: "Audio",
        value: "Up to 25 MB free, 100 MB paid; 16 kHz mono WAV is smallest",
      },
    ],
    watchOuts: [
      "Every request bills at least 10 seconds, so very short clips cost more than they seem.",
    ],
    links: [
      { label: "Pricing", url: "https://groq.com/pricing" },
      {
        label: "Speech to text docs",
        url: "https://console.groq.com/docs/speech-to-text",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "google-analytics",
    name: "Google Analytics 4",
    category: "analytics",
    tagline: "Who visits the site, from where, and what they do",
    overview:
      "Counts visitors, visits, sources, pages and enquiries. The admin Analytics tab reads it live through the Data API with a service account.",
    useFor: [
      "Visitors and traffic sources per service",
      "Which pages lead to enquiries",
      "Measuring ad campaigns",
    ],
    products: [
      {
        name: "Tag (gtag.js)",
        what: "The script on every page that sends visits and events.",
        via: "Script tag or Tag Manager",
      },
      {
        name: "Data API",
        what: "Reads reports into our own dashboard.",
        via: "REST API with a service account",
      },
      {
        name: "Realtime API",
        what: "Who is on the site right now.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "Google Analytics 4",
        price: "Free",
        basis: "Data API has daily token quotas per property",
        confidence: "official",
      },
      {
        item: "Google Analytics 360",
        price: "About $50,000 a year",
        basis: "For very large sites; sold through Google and partners",
        confidence: "reported",
      },
    ],
    pricingNote:
      "Free for a business our size; 360 only matters at millions of visits a month.",
    setup: [
      "Create a GA4 property and web stream; put the measurement id in the site.",
      "Add the service account's email as a Viewer on the property.",
      "Set GA4_PROPERTY_ID and GOOGLE_SERVICE_ACCOUNT_JSON on the server.",
    ],
    technical: [
      { label: "Auth", value: "Service account (JSON key), read-only scope" },
      {
        label: "Delay",
        value: "Reports settle over 24 to 48 hours; realtime is separate",
      },
    ],
    watchOuts: [
      "Ask for cookie consent where the law needs it; ad blockers hide some visits.",
    ],
    links: [
      {
        label: "Data API",
        url: "https://developers.google.com/analytics/devguides/reporting/data/v1",
      },
      {
        label: "Analytics 360",
        url: "https://marketingplatform.google.com/about/analytics-360/",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "search-console",
    name: "Google Search Console",
    category: "analytics",
    tagline: "How the site shows up in Google search",
    overview:
      "Clicks, impressions and position for every page and search term, and whether pages are indexed. The admin SEO tab reads it through the API.",
    useFor: [
      "Tracking keyword rankings",
      "Finding pages Google has not indexed",
      "Submitting the sitemap",
    ],
    products: [
      {
        name: "Search Analytics API",
        what: "Clicks, impressions, CTR and position by page and query.",
        via: "REST API with a service account",
      },
      {
        name: "URL Inspection API",
        what: "Whether a page is indexed, and why not.",
        via: "REST API",
      },
    ],
    pricing: [
      {
        item: "Search Console and its API",
        price: "Free",
        basis: "Query quotas per site and per project",
        confidence: "official",
      },
    ],
    pricingNote: "Free.",
    setup: [
      "Verify the domain (DNS record) in Search Console.",
      "Add the service account's email as a user on the property.",
      "Set SEARCH_CONSOLE_SITE_URL and GOOGLE_SERVICE_ACCOUNT_JSON.",
    ],
    technical: [
      { label: "Auth", value: "Service account, read-only scope" },
      { label: "Delay", value: "Data is about 2 to 3 days behind" },
    ],
    watchOuts: ["Shows Google only; Bing has its own Webmaster Tools."],
    links: [
      { label: "API", url: "https://developers.google.com/webmaster-tools" },
    ],
    checked: CHECKED,
  },
  {
    slug: "tag-manager",
    name: "Google Tag Manager",
    category: "analytics",
    tagline: "One container for every tracking tag",
    overview:
      "Adds and changes tracking tags (Analytics, Ads, Meta pixel) from a dashboard instead of the site's code.",
    useFor: [
      "Ad conversion tracking without a deploy",
      "Keeping marketing tags in one place",
    ],
    products: [
      {
        name: "Web container",
        what: "One script on the site that loads every tag set up in the dashboard.",
        via: "Script tag",
      },
    ],
    pricing: [
      {
        item: "Tag Manager",
        price: "Free",
        basis: "",
        confidence: "official",
      },
      {
        item: "Tag Manager 360",
        price: "Quote",
        basis: "Part of the Google Marketing Platform enterprise suite",
        confidence: "quote",
      },
    ],
    pricingNote: "Free.",
    setup: [
      "Create a container for the domain.",
      "Turn on the container id in the site (it is wired but off here: tagManagerEnabled).",
    ],
    technical: [{ label: "Load", value: "One async script plus a dataLayer" }],
    watchOuts: [
      "Anyone with publish access can add scripts to the live site: keep publishers few.",
    ],
    links: [{ label: "Tag Manager", url: "https://tagmanager.google.com/" }],
    checked: CHECKED,
  },
  {
    slug: "google-ads",
    name: "Google Ads API",
    category: "analytics",
    tagline: "Campaign spend, clicks and conversions from Google Ads",
    overview:
      "Reads (and can manage) Google Ads campaigns, for the admin Ads tab's spend and results. Not called yet: the variables are listed under Ads.",
    useFor: ["Ad spend and leads per campaign in our dashboard"],
    products: [
      {
        name: "Google Ads API",
        what: "Reports and campaign management.",
        via: "REST / gRPC with OAuth and a developer token",
      },
    ],
    pricing: [
      {
        item: "API access",
        price: "Free",
        basis: "Basic access allows 15,000 operations a day",
        confidence: "official",
      },
      {
        item: "The ads themselves",
        price: "Your ad budget",
        basis: "Billed by Google Ads per click or view",
        confidence: "official",
      },
    ],
    pricingNote: "The API costs nothing; the spend is the campaigns' budget.",
    setup: [
      "Apply for a developer token from a Google Ads manager account.",
      "Create OAuth credentials and get a refresh token for the ads account.",
      "Set GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID and GOOGLE_ADS_REFRESH_TOKEN.",
    ],
    technical: [
      { label: "Auth", value: "OAuth 2 refresh token plus developer token" },
      {
        label: "Approval",
        value: "Test access first; basic access after Google's review",
      },
    ],
    watchOuts: ["Token approval can take a few days; apply early."],
    links: [
      {
        label: "Docs",
        url: "https://developers.google.com/google-ads/api/docs/start",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "meta-ads",
    name: "Meta Marketing API",
    category: "analytics",
    tagline: "Facebook and Instagram ad spend and leads",
    overview:
      "Reads Facebook and Instagram campaign results for the admin Ads tab. Not called yet: the variables are listed under Ads.",
    useFor: ["Ad spend and leads from Facebook and Instagram in our dashboard"],
    products: [
      {
        name: "Insights API",
        what: "Spend, reach, clicks and leads per campaign.",
        via: "Graph API with a system-user token",
      },
      {
        name: "Conversions API",
        what: "Sends enquiries from the server, so ad results survive ad blockers.",
        via: "Graph API",
      },
    ],
    pricing: [
      {
        item: "API access",
        price: "Free",
        basis: "Rate limits grow with ad spend",
        confidence: "official",
      },
      {
        item: "The ads themselves",
        price: "Your ad budget",
        basis: "Billed by Meta",
        confidence: "official",
      },
    ],
    pricingNote: "The API costs nothing; the spend is the campaigns' budget.",
    setup: [
      "Create a Meta app and a system user in Business Manager.",
      "Give the system user the ad account; generate a long-lived token.",
      "Set META_ADS_ACCESS_TOKEN and META_AD_ACCOUNT_ID.",
    ],
    technical: [{ label: "Auth", value: "System-user access token" }],
    watchOuts: ["Business verification may be needed for standard access."],
    links: [
      {
        label: "Docs",
        url: "https://developers.facebook.com/docs/marketing-apis",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "railway",
    name: "Railway",
    category: "hosting",
    tagline: "Runs this website, its database, file storage and workers",
    overview:
      "Hosts the site, Postgres, the Drive's storage bucket, the code judge and the Workspace. Billed per second for what each service uses, on top of a small monthly plan that includes the same amount of usage.",
    useFor: [
      "Hosting a web app and its database together",
      "File storage for uploads (Buckets)",
      "Background workers and scheduled jobs",
    ],
    products: [
      {
        name: "Services",
        what: "Apps from GitHub or Docker, deployed on every push.",
        via: "Dashboard, CLI, GraphQL API",
      },
      {
        name: "Databases",
        what: "Postgres, MySQL, Redis on a volume.",
        via: "Template",
      },
      {
        name: "Buckets",
        what: "S3-compatible file storage with free downloads.",
        via: "S3 API",
      },
    ],
    pricing: [
      {
        item: "Hobby plan",
        price: "$5 a month",
        basis: "Includes $5 of usage",
        confidence: "official",
      },
      {
        item: "Pro plan",
        price: "$20 a month",
        basis: "Includes $20 of usage; team seats",
        confidence: "official",
      },
      {
        item: "CPU",
        price: "$20",
        basis: "Per vCPU a month, billed by the minute",
        confidence: "official",
      },
      {
        item: "Memory",
        price: "$10",
        basis: "Per GB a month, billed by the minute",
        confidence: "official",
      },
      {
        item: "Volume storage",
        price: "$0.15",
        basis: "Per GB a month",
        confidence: "official",
      },
      {
        item: "Network egress",
        price: "$0.05",
        basis: "Per GB",
        confidence: "official",
      },
      {
        item: "Buckets",
        price: "$0.015",
        basis: "Per GB a month; downloads and API calls free",
        confidence: "official",
      },
    ],
    pricingNote:
      "See the Deployment sheet for full plan limits and an always-on monthly example.",
    setup: [
      "Connect the GitHub repo; Railway builds and deploys each push to main.",
      "Add the database and bucket from the project canvas; their variables are shared to the service.",
      "Set RAILWAY_API_TOKEN for the admin deploy board.",
    ],
    technical: [
      {
        label: "Deploy",
        value: "Git push, with a pre-deploy step (migrations here)",
      },
      { label: "API", value: "GraphQL with an account or project token" },
    ],
    watchOuts: [
      "Uploads from a Railway service to a bucket count as egress; upload straight from the browser instead.",
    ],
    links: [
      {
        label: "Pricing",
        url: "https://docs.railway.com/reference/pricing/plans",
      },
      {
        label: "Buckets billing",
        url: "https://docs.railway.com/storage-buckets/billing",
      },
    ],
    checked: CHECKED,
  },
  {
    slug: "vercel",
    name: "Vercel",
    category: "hosting",
    tagline: "Hosting for Next.js front ends and showcase sites",
    overview:
      "Hosts front ends with a global CDN and preview links for every branch. The admin deploy board reads its deployments.",
    useFor: ["Client marketing sites", "Preview links for each change"],
    products: [
      {
        name: "Deployments",
        what: "Every git push built and served on the CDN, with previews.",
        via: "Git, CLI, REST API",
      },
      {
        name: "Functions",
        what: "Server code that runs per request.",
        via: "Framework routes",
      },
    ],
    pricing: [
      {
        item: "Hobby",
        price: "$0",
        basis: "Personal, non-commercial use only",
        confidence: "official",
      },
      {
        item: "Pro",
        price: "$20 a month per seat",
        basis: "Includes $20 of usage and 1 TB of traffic",
        confidence: "official",
      },
      {
        item: "Enterprise",
        price: "Quote",
        basis: "SSO, SLAs",
        confidence: "quote",
      },
    ],
    pricingNote:
      "A client's commercial site needs Pro. Usage rates are on the Deployment sheet.",
    setup: [
      "Import the GitHub repo into a Vercel team.",
      "Set VERCEL_API_TOKEN for the admin deploy board.",
    ],
    technical: [{ label: "API", value: "REST with a team token" }],
    watchOuts: ["Hobby forbids commercial use; move client sites to Pro."],
    links: [{ label: "Pricing", url: "https://vercel.com/pricing" }],
    checked: CHECKED,
  },
  {
    slug: "supabase",
    name: "Supabase",
    category: "hosting",
    tagline: "Postgres with sign-in, file storage and APIs built in",
    overview:
      "A hosted Postgres database with sign-in, file storage, realtime and edge functions. This site moved its own data to Railway Postgres; Supabase stays an option for client projects.",
    useFor: [
      "A database plus sign-in for a client app, without running servers",
      "Realtime features such as live updates",
    ],
    products: [
      {
        name: "Database",
        what: "Postgres with auto-generated APIs.",
        via: "SQL, REST, client SDKs",
      },
      { name: "Auth", what: "Email, phone and social sign-in.", via: "SDK" },
      { name: "Storage", what: "Files with access rules.", via: "SDK, S3 API" },
    ],
    pricing: [
      {
        item: "Free",
        price: "$0",
        basis: "500 MB database; paused after a week idle",
        confidence: "official",
      },
      {
        item: "Pro",
        price: "$25 a month",
        basis: "8 GB database, 100 GB files, 100,000 monthly users",
        confidence: "official",
      },
      {
        item: "Team",
        price: "$599 a month",
        basis: "SOC 2, SSO, longer backups",
        confidence: "official",
      },
    ],
    pricingNote: "Add-ons and overage are on the Storage sheet.",
    setup: [
      "Create a project in the Mumbai region for Indian users.",
      "Keep the service-role key on the server only.",
    ],
    technical: [
      {
        label: "Auth",
        value:
          "Anon key in the browser (with row-level security), service key on the server",
      },
    ],
    watchOuts: ["Turn on row-level security on every table before going live."],
    links: [{ label: "Pricing", url: "https://supabase.com/pricing" }],
    checked: CHECKED,
  },
  {
    slug: "github",
    name: "GitHub",
    category: "hosting",
    tagline: "Code, reviews and automated builds",
    overview:
      "Holds every repo. Railway and Vercel deploy from it, and the admin Workspace opens repos through its API.",
    useFor: ["Code and pull requests", "Automated tests and builds (Actions)"],
    products: [
      {
        name: "Repositories",
        what: "Unlimited public and private repos.",
        via: "Git, web",
      },
      {
        name: "Actions",
        what: "Builds and tests on every push.",
        via: "Workflow files",
      },
      {
        name: "REST and GraphQL API",
        what: "Repos, branches and pull requests from our tools.",
        via: "Token",
      },
    ],
    pricing: [
      {
        item: "Free",
        price: "$0",
        basis: "2,000 Actions minutes and 500 MB packages a month",
        confidence: "official",
      },
      {
        item: "Team",
        price: "$4 per user a month",
        basis: "3,000 Actions minutes, 2 GB packages; first-year price",
        confidence: "official",
      },
      {
        item: "Enterprise",
        price: "$21 per user a month",
        basis: "50,000 Actions minutes, 50 GB packages; first-year price",
        confidence: "official",
      },
      {
        item: "Codespaces",
        price: "From $0.18 an hour",
        basis: "Plus $0.07 per GB a month of storage",
        confidence: "official",
      },
    ],
    pricingNote: "Actions minutes are free on public repos.",
    setup: [
      "Keep client repos in the company's organisation.",
      "Use fine-grained tokens limited to the repos a tool needs.",
    ],
    technical: [
      { label: "API", value: "REST and GraphQL with a token or GitHub App" },
    ],
    watchOuts: ["Never commit .env files; rotate any key that was."],
    links: [{ label: "Pricing", url: "https://github.com/pricing" }],
    checked: CHECKED,
  },
];

export function integrationBySlug(slug: string) {
  return INTEGRATIONS.find((i) => i.slug === slug) ?? null;
}
