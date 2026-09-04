/** The four practices, and the detail sections for the first three. */
import type { IconCard, Link, Practice, TagGroup } from "@/types";

export const pillars: Practice[] = [
  {
    id: "marketing",
    index: "01",
    icon: "megaphone",
    title: "Growth & Marketing",
    summary:
      "Paid media, organic content and the tracking that proves which of them worked.",
    points: [
      "Meta & Google Ads",
      "SEO & content",
      "Social management",
      "Analytics & CRO",
    ],
    href: "/marketing",
  },
  {
    id: "software",
    index: "02",
    icon: "code",
    title: "Software & Web",
    summary:
      "Marketing sites, web apps and internal tools — from a five-page launch site to a multi-tenant platform.",
    points: [
      "Websites & landing pages",
      "Web applications",
      "E-commerce",
      "Dashboards & portals",
    ],
    href: "/software",
  },
  {
    id: "ai",
    index: "03",
    icon: "bot",
    title: "Agentic AI",
    summary:
      "Chatbots, copilots and autonomous agents built on modern harnesses — wired into the systems you already run.",
    points: [
      "Support & sales chatbots",
      "RAG over your docs",
      "Workflow agents",
      "Agents inside your product",
    ],
    href: "/agentic-ai",
  },
  {
    id: "academy",
    index: "04",
    icon: "graduation",
    title: "NectArray Academy",
    summary:
      "Live, project-driven courses taught by the same engineers who ship our client work.",
    points: [
      "Python foundations",
      "SQL & databases",
      "Data science",
      "Portfolio projects",
    ],
    href: "/academy",
  },
];

export const marketing: {
  eyebrow: string;
  title: string;
  lede: string;
  channels: IconCard[];
  note: string;
} = {
  eyebrow: "01 — Growth & Marketing",
  title: "Every channel that can send you a customer, run by one team.",
  lede: "Most agencies sell you one channel and call it strategy. We map where your buyers actually are, run those channels properly, and kill the ones that do not pay for themselves.",
  channels: [
    {
      icon: "target",
      title: "Meta Ads",
      body: "Facebook and Instagram campaigns — full-funnel structure, creative testing at volume, Advantage+ where it earns its place, and Conversions API so iOS traffic stops disappearing.",
    },
    {
      icon: "search",
      title: "Google Ads",
      body: "Search, Performance Max, Shopping, YouTube and Demand Gen. Tight keyword and negative hygiene, landing pages built by our own engineers, bidding tuned to margin rather than clicks.",
    },
    {
      icon: "globe",
      title: "SEO & Content",
      body: "Technical audits, site architecture, programmatic pages, local and Maps optimisation, plus a genuine editorial calendar — not 500-word filler.",
    },
    {
      icon: "share",
      title: "Social & Content Management",
      body: "Instagram, LinkedIn and YouTube handled end to end: monthly calendar, shoots, reels and short-form edits, carousels, captions, scheduling, community replies and reporting.",
    },
    {
      icon: "briefcase",
      title: "LinkedIn & B2B",
      body: "For longer sales cycles: LinkedIn Ads, founder-led content, lead-gen forms and outbound sequences that feed a CRM instead of a spreadsheet.",
    },
    {
      icon: "message",
      title: "WhatsApp & Lifecycle",
      body: "WhatsApp Business API, email and SMS flows — abandoned cart, onboarding, win-back and retention journeys wired to your store or CRM.",
    },
    {
      icon: "chart",
      title: "Analytics & CRO",
      body: "GA4 and GTM done correctly, server-side tracking, offline conversion imports, dashboards you actually read, and A/B tests on the pages that carry the revenue.",
    },
    {
      icon: "cart",
      title: "Marketplace & Commerce",
      body: "Amazon and Flipkart ad management, listing and catalogue optimisation, and feed management for Shopping campaigns.",
    },
  ],
  note: "Not sure which channels fit? The first thing we do is tell you which ones to skip.",
};

/* ---------------------------------------------------------------------------
   02 — Software & Web
   ---------------------------------------------------------------------------
   These three shapes are declared here rather than in @/types because nothing
   else uses them. They describe this one page's three catalogues — what we
   build, what we plug into, and what we build it on — and would only be noise
   in the shared file.
--------------------------------------------------------------------------- */

/** One kind of build, plus the industries that actually buy it. */
export type SoftwareBuild = IconCard & {
  /**
   * Verticals, shown as chips under the card. This is the whole point of the
   * section: a visitor should find their own trade in the list rather than
   * read "bespoke solutions for every business" and have to guess.
   */
  domains: string[];
  /**
   * A 3D render for the category, as a path into Microsoft's Fluent
   * Emoji set. components/software/CategoryMark.tsx is the only thing
   * that turns it into a URL.
   */
  image: string;
  /** Only where another route explains the thing properly. */
  more?: Link;
};

/**
 * A logo tile, identified by domain rather than by a slug in some icon set.
 *
 * Every company in the world has a domain, and half the software an Indian
 * business actually runs — Petpooja, Vyapar, Marg, Shiprocket — is in no icon
 * set at all. components/software/BrandLogo.tsx is the only thing that turns
 * this into a URL, so moving to self-hosted logos later is a one-line change
 * in one file.
 */
export type Brand = { name: string; domain: string };

export type BrandGroup = {
  label: string;
  /** One line under the group heading, where the group needs explaining. */
  note?: string;
  brands: Brand[];
};

export const software: {
  eyebrow: string;
  title: string;
  lede: string;
  services: SoftwareBuild[];
  integrations: {
    eyebrow: string;
    title: string;
    lede: string;
    groups: BrandGroup[];
    closer: { title: string; body: string };
  };
  stack: {
    eyebrow: string;
    title: string;
    lede: string;
    groups: BrandGroup[];
    clouds: { title: string; body: string; groups: TagGroup[] };
  };
  why: {
    eyebrow: string;
    title: string;
    lede: string;
    points: IconCard[];
  };
  /**
   * The one ask on the page, shown twice — once above the catalogue and once
   * closing it. Same offer both times, so a reader who is already convinced
   * never has to scroll past four sections to find the button.
   */
  quote: {
    eyebrow: string;
    title: string;
    /** One line, for the band at the top. */
    lead: string;
    /** The full pitch, for the band that closes the page. */
    body: string;
    cta: Link;
  };
} = {
  eyebrow: "02 — Software & Web",
  title: "Whatever the business is, there is a build here for it.",
  lede: "One page or one platform, we take it at any scale. Find the shape of what you need below, and the trade it gets built for — if your industry is not on a list, it is because the list ran out of room, not because we have not built it.",

  services: [
    {
      icon: "layout",
      title: "Portfolio & Profile Sites",
      image: "Identification card/3D/identification_card_3d.png",
      body: "The site that makes a real business look like one: who you are, what you do, proof that you do it, and one obvious way to get in touch. Edited by you afterwards, not by a support ticket.",
      domains: [
        "Doctors & clinics",
        "Dentists",
        "Lawyers & CAs",
        "Architects",
        "Interior designers",
        "Photographers & studios",
        "Consultants & coaches",
        "Freelancers",
        "Salons & spas",
        "Gyms & trainers",
        "Restaurants & cafés",
        "Schools & coaching centres",
        "Real estate agents",
        "Builders & contractors",
        "Manufacturers & exporters",
        "Artists & creators",
        "Personal profile & résumé",
        "Weddings & events",
      ],
    },
    {
      icon: "cart",
      title: "E-commerce, Any Category",
      image: "Shopping cart/3D/shopping_cart_3d.png",
      body: "Shopify when the platform is the sensible answer, a custom storefront when it is not. Catalogue, cart, checkout, coupons, returns, invoices and the shipping label at the end of it — the whole path, not the pretty half.",
      domains: [
        "Fashion & apparel",
        "Jewellery",
        "Electronics",
        "Groceries & fresh produce",
        "D2C brands",
        "Furniture & décor",
        "Pharmacy & wellness",
        "Food & cloud kitchens",
        "Sweets & bakery",
        "B2B & wholesale",
        "Subscription boxes",
        "Digital downloads",
        "Rentals & deposits",
        "Multi-vendor marketplaces",
        "Pet supplies",
        "Auto parts",
        "Agri & seeds",
        "Handloom & crafts",
      ],
    },
    {
      icon: "gauge",
      title: "Dashboards & Internal Tools",
      image: "Bar chart/3D/bar_chart_3d.png",
      body: "The screen that replaces the spreadsheet the whole company secretly runs on. Roles, approvals, audit trails, exports and reports that reconcile — built for the people who have to use it all day.",
      domains: [
        "Logistics & fleet",
        "Manufacturing & production",
        "Inventory & warehouse",
        "Billing & invoicing",
        "Healthcare & diagnostics",
        "Schools & admissions",
        "Finance & lending",
        "Retail chains",
        "Field service & AMC",
        "HR, payroll & attendance",
        "Procurement & vendors",
        "Order & dispatch desks",
        "Support & ticketing",
        "Reporting & BI",
      ],
    },
    {
      icon: "layers",
      title: "Web Applications & Platforms",
      image: "Gear/3D/gear_3d.png",
      body: "Products rather than pages: accounts, permissions, payments, multi-tenancy, notifications and the twenty unglamorous things a demo never shows you. This is the half of the work that decides whether the thing survives its first hundred users.",
      domains: [
        "Booking & appointments",
        "SaaS products",
        "Membership portals",
        "Learning platforms",
        "Marketplaces",
        "Ticketing & events",
        "Job boards",
        "Property listings",
        "Insurance & claims",
        "Clinic & patient portals",
        "Franchise & dealer portals",
        "Communities & forums",
      ],
    },
    {
      icon: "bot",
      title: "Agentic AI, Inside the Product",
      image: "Robot/3D/robot_3d.png",
      body: "Not a chatbot in the corner — agents with tools and permissions that read your data and take real actions. Including the ones we build for engineering teams: assistants that review code, write the tests, run the migration and document what they changed.",
      domains: [
        "Support & sales agents",
        "WhatsApp agents",
        "Invoice & document extraction",
        "Internal copilots",
        "Engineering assistants",
        "Code review & test generation",
        "Data migration agents",
        "RAG over company documents",
        "Lead qualification",
        "Voice agents",
        "Report & summary generation",
        "Workflow automation",
      ],
      more: { label: "See the agentic AI practice", href: "/agentic-ai" },
    },
    {
      icon: "smartphone",
      title: "Mobile-First & Mobile Apps",
      image: "Mobile phone/3D/mobile_phone_3d.png",
      body: "Designed at 360px and up, because that is where your customers actually are. Installable web apps where a store listing is overhead, and real iOS and Android builds where the camera, GPS or offline use make it the only honest option.",
      domains: [
        "Delivery & live tracking",
        "Booking & appointments",
        "Field-force & attendance",
        "Loyalty & rewards",
        "E-commerce apps",
        "Fitness & habit tracking",
        "Content & streaming",
        "Kiosk & counter POS",
        "Inspection & survey apps",
        "Driver & partner apps",
        "Installable PWAs",
        "iOS & Android store builds",
      ],
    },
  ],

  integrations: {
    eyebrow: "Integrations",
    title: "If it has an API, it can be wired in.",
    lede: "Shiprocket for the label, Petpooja for the bill, WhatsApp for the message, Google for the login, Razorpay for the money, Tally for the accountant. Below is what we plug into most often — and it is a sample, not a limit.",
    groups: [
      {
        label: "Shipping, courier & delivery",
        note: "Rate cards, label generation, pickup scheduling, live tracking and returns — intercity freight and intracity same-day both.",
        brands: [
          { name: "Shiprocket", domain: "shiprocket.in" },
          { name: "Delhivery", domain: "delhivery.com" },
          { name: "Blue Dart", domain: "bluedart.com" },
          { name: "DTDC", domain: "dtdc.in" },
          { name: "Ecom Express", domain: "ecomexpress.in" },
          { name: "XpressBees", domain: "xpressbees.com" },
          { name: "Shadowfax", domain: "shadowfax.in" },
          { name: "India Post", domain: "indiapost.gov.in" },
          { name: "FedEx", domain: "fedex.com" },
          { name: "DHL", domain: "dhl.com" },
          { name: "Porter", domain: "porter.in" },
          { name: "Borzo", domain: "borzodelivery.com" },
          { name: "Rapido", domain: "rapido.bike" },
          { name: "Uber", domain: "uber.com" },
          { name: "Ola", domain: "olacabs.com" },
        ],
      },
      {
        label: "Logins & identity",
        note: "Google or Gmail, a phone number and an OTP, WhatsApp, or all of them at once against the same account.",
        brands: [
          { name: "Google", domain: "google.com" },
          { name: "WhatsApp OTP", domain: "whatsapp.com" },
          { name: "Apple", domain: "apple.com" },
          { name: "Microsoft Entra", domain: "microsoft.com" },
          { name: "Facebook", domain: "facebook.com" },
          { name: "GitHub", domain: "github.com" },
          { name: "LinkedIn", domain: "linkedin.com" },
          { name: "Truecaller", domain: "truecaller.com" },
          { name: "DigiLocker", domain: "digilocker.gov.in" },
          { name: "Aadhaar eKYC", domain: "uidai.gov.in" },
          { name: "Supabase Auth", domain: "supabase.com" },
          { name: "Clerk", domain: "clerk.com" },
          { name: "Auth0", domain: "auth0.com" },
        ],
      },
      {
        label: "WhatsApp, mail & notifications",
        note: "Order updates, OTPs, reminders and receipts — on the channel the customer actually reads.",
        brands: [
          { name: "WhatsApp Business", domain: "business.whatsapp.com" },
          { name: "Meta Cloud API", domain: "meta.com" },
          { name: "Gupshup", domain: "gupshup.io" },
          { name: "Twilio", domain: "twilio.com" },
          { name: "MSG91", domain: "msg91.com" },
          { name: "Exotel", domain: "exotel.com" },
          { name: "Gmail & Workspace", domain: "workspace.google.com" },
          { name: "Zoho Mail", domain: "zoho.com" },
          { name: "Resend", domain: "resend.com" },
          { name: "SendGrid", domain: "sendgrid.com" },
          { name: "Mailchimp", domain: "mailchimp.com" },
          { name: "Firebase Push", domain: "firebase.google.com" },
          { name: "Telegram", domain: "telegram.org" },
          { name: "Slack", domain: "slack.com" },
        ],
      },
      {
        label: "Payments & UPI",
        brands: [
          { name: "Razorpay", domain: "razorpay.com" },
          { name: "PhonePe", domain: "phonepe.com" },
          { name: "Paytm", domain: "paytm.com" },
          { name: "Cashfree", domain: "cashfree.com" },
          { name: "UPI · NPCI", domain: "npci.org.in" },
          { name: "Juspay", domain: "juspay.in" },
          { name: "BillDesk", domain: "billdesk.com" },
          { name: "CCAvenue", domain: "ccavenue.com" },
          { name: "Instamojo", domain: "instamojo.com" },
          { name: "Stripe", domain: "stripe.com" },
          { name: "PayPal", domain: "paypal.com" },
        ],
      },
      {
        label: "Billing, accounting & GST",
        note: "Whatever your accountant already uses. Invoices out of the app and into their software, without anyone retyping them.",
        brands: [
          { name: "Tally", domain: "tallysolutions.com" },
          { name: "Zoho Books", domain: "zoho.com" },
          { name: "Vyapar", domain: "vyaparapp.in" },
          { name: "Marg ERP", domain: "margcompusoft.com" },
          { name: "Busy", domain: "busy.in" },
          { name: "ClearTax", domain: "cleartax.in" },
          { name: "GST e-invoicing", domain: "gst.gov.in" },
          { name: "QuickBooks", domain: "quickbooks.intuit.com" },
          { name: "Xero", domain: "xero.com" },
          { name: "Odoo", domain: "odoo.com" },
        ],
      },
      {
        label: "POS, restaurants & retail",
        brands: [
          { name: "Petpooja", domain: "petpooja.com" },
          { name: "Posist", domain: "posist.com" },
          { name: "UrbanPiper", domain: "urbanpiper.com" },
          { name: "Zomato", domain: "zomato.com" },
          { name: "Swiggy", domain: "swiggy.com" },
          { name: "DotPe", domain: "dotpe.in" },
          { name: "Ginesys", domain: "ginesys.in" },
          { name: "Zakya", domain: "zakya.com" },
          { name: "Square", domain: "squareup.com" },
        ],
      },
      {
        label: "E-commerce & marketplaces",
        brands: [
          { name: "Shopify", domain: "shopify.com" },
          { name: "WooCommerce", domain: "woocommerce.com" },
          { name: "Adobe Commerce", domain: "magento.com" },
          { name: "BigCommerce", domain: "bigcommerce.com" },
          { name: "Wix", domain: "wix.com" },
          { name: "Amazon Seller", domain: "sellercentral.amazon.in" },
          { name: "Flipkart", domain: "flipkart.com" },
          { name: "Meesho", domain: "meesho.com" },
          { name: "Myntra", domain: "myntra.com" },
          { name: "Ajio", domain: "ajio.com" },
          { name: "Nykaa", domain: "nykaa.com" },
          { name: "Unicommerce", domain: "unicommerce.com" },
          { name: "EasyEcom", domain: "easyecom.io" },
          { name: "Vinculum", domain: "vinculumgroup.com" },
        ],
      },
      {
        label: "CRM, ERP & HR",
        brands: [
          { name: "Zoho CRM", domain: "zoho.com" },
          { name: "Salesforce", domain: "salesforce.com" },
          { name: "HubSpot", domain: "hubspot.com" },
          { name: "Freshworks", domain: "freshworks.com" },
          { name: "LeadSquared", domain: "leadsquared.com" },
          { name: "Pipedrive", domain: "pipedrive.com" },
          { name: "Dynamics 365", domain: "dynamics.microsoft.com" },
          { name: "SAP", domain: "sap.com" },
          { name: "Keka", domain: "keka.com" },
          { name: "Darwinbox", domain: "darwinbox.com" },
        ],
      },
      {
        label: "Maps, documents & the rest",
        brands: [
          { name: "Google Maps", domain: "maps.google.com" },
          { name: "Mapbox", domain: "mapbox.com" },
          { name: "Google Sheets", domain: "sheets.google.com" },
          { name: "Google Drive", domain: "drive.google.com" },
          { name: "Google Calendar", domain: "calendar.google.com" },
          { name: "Calendly", domain: "calendly.com" },
          { name: "DocuSign", domain: "docusign.com" },
          { name: "Zoom", domain: "zoom.us" },
          { name: "Google Meet", domain: "meet.google.com" },
          { name: "Google Analytics", domain: "analytics.google.com" },
          { name: "Tag Manager", domain: "tagmanager.google.com" },
          { name: "Meta Pixel", domain: "meta.com" },
          { name: "Sentry", domain: "sentry.io" },
        ],
      },
    ],
    closer: {
      title: "Not on the list? Name it.",
      body: "REST, GraphQL, SOAP, a webhook, an SFTP folder of CSVs, a vendor who will only email you a PDF, or a system whose documentation is one page long and wrong — we have integrated all of it. Tell us the software you already run and you will get a straight answer: whether it exposes an API, what it can and cannot do, and what it takes to connect. If there is genuinely no way in, we will say that too rather than bill you to find out.",
    },
  },

  stack: {
    eyebrow: "Stack",
    title: "We are not married to a stack. We are fluent across it.",
    lede: "Unless a project argues otherwise we reach for the first few in each group — fast to build in, cheap to run, and easy for whoever picks it up next. When your team already runs something else, we work in that instead.",
    groups: [
      {
        label: "Frontend",
        brands: [
          { name: "React", domain: "react.dev" },
          { name: "Next.js", domain: "nextjs.org" },
          { name: "TypeScript", domain: "typescriptlang.org" },
          { name: "Tailwind CSS", domain: "tailwindcss.com" },
          { name: "shadcn/ui", domain: "ui.shadcn.com" },
          { name: "Motion", domain: "motion.dev" },
          { name: "Vue", domain: "vuejs.org" },
          { name: "Nuxt", domain: "nuxt.com" },
          { name: "Svelte", domain: "svelte.dev" },
          { name: "Astro", domain: "astro.build" },
          { name: "Angular", domain: "angular.dev" },
          { name: "Vite", domain: "vite.dev" },
        ],
      },
      {
        label: "Mobile",
        brands: [
          { name: "React Native", domain: "reactnative.dev" },
          { name: "Expo", domain: "expo.dev" },
          { name: "Flutter", domain: "flutter.dev" },
          { name: "Swift", domain: "swift.org" },
          { name: "Kotlin", domain: "kotlinlang.org" },
          { name: "Capacitor", domain: "capacitorjs.com" },
        ],
      },
      {
        label: "Backend",
        brands: [
          { name: "Node.js", domain: "nodejs.org" },
          { name: "Python", domain: "python.org" },
          { name: "FastAPI", domain: "fastapi.tiangolo.com" },
          { name: "Django", domain: "djangoproject.com" },
          { name: "NestJS", domain: "nestjs.com" },
          { name: "Express", domain: "expressjs.com" },
          { name: "Go", domain: "go.dev" },
          { name: "Spring", domain: "spring.io" },
          { name: "Laravel", domain: "laravel.com" },
          { name: "Rails", domain: "rubyonrails.org" },
          { name: ".NET", domain: "dotnet.microsoft.com" },
          { name: "GraphQL", domain: "graphql.org" },
        ],
      },
      {
        label: "Databases & data",
        brands: [
          { name: "PostgreSQL", domain: "postgresql.org" },
          { name: "MySQL", domain: "mysql.com" },
          { name: "MongoDB", domain: "mongodb.com" },
          { name: "Redis", domain: "redis.io" },
          { name: "Supabase", domain: "supabase.com" },
          { name: "Firebase", domain: "firebase.google.com" },
          { name: "Neon", domain: "neon.tech" },
          { name: "Prisma", domain: "prisma.io" },
          { name: "ClickHouse", domain: "clickhouse.com" },
          { name: "Elasticsearch", domain: "elastic.co" },
          { name: "Snowflake", domain: "snowflake.com" },
        ],
      },
      {
        label: "Cloud & infrastructure",
        brands: [
          { name: "AWS", domain: "aws.amazon.com" },
          { name: "Microsoft Azure", domain: "azure.microsoft.com" },
          { name: "Google Cloud", domain: "cloud.google.com" },
          { name: "Vercel", domain: "vercel.com" },
          { name: "Cloudflare", domain: "cloudflare.com" },
          { name: "Docker", domain: "docker.com" },
          { name: "Kubernetes", domain: "kubernetes.io" },
          { name: "Terraform", domain: "terraform.io" },
          { name: "GitHub Actions", domain: "github.com" },
          { name: "Nginx", domain: "nginx.org" },
          { name: "DigitalOcean", domain: "digitalocean.com" },
          { name: "Hostinger", domain: "hostinger.in" },
        ],
      },
      {
        label: "AI & agents",
        brands: [
          { name: "Claude", domain: "anthropic.com" },
          { name: "OpenAI", domain: "openai.com" },
          { name: "Gemini", domain: "gemini.google.com" },
          { name: "AI SDK", domain: "ai-sdk.dev" },
          { name: "MCP", domain: "modelcontextprotocol.io" },
          { name: "LangChain", domain: "langchain.com" },
          { name: "Pinecone", domain: "pinecone.io" },
          { name: "Hugging Face", domain: "huggingface.co" },
          { name: "Ollama", domain: "ollama.com" },
          { name: "n8n", domain: "n8n.io" },
        ],
      },
    ],
    clouds: {
      title: "Down to the individual service",
      body: "Cloud is not one decision, it is thirty. These are the services we provision, wire up and hand over inside your own account — billed to you, owned by you, with nothing running on ours.",
      groups: [
        {
          label: "Amazon Web Services",
          items: [
            "EC2",
            "S3",
            "Lambda",
            "RDS",
            "Aurora",
            "DynamoDB",
            "CloudFront",
            "Route 53",
            "ECS & Fargate",
            "EKS",
            "SQS & SNS",
            "SES",
            "API Gateway",
            "Cognito",
            "Bedrock",
            "Amplify",
            "CloudWatch",
            "IAM",
          ],
        },
        {
          label: "Microsoft Azure",
          items: [
            "App Service",
            "Functions",
            "AKS",
            "Container Apps",
            "Blob Storage",
            "Azure SQL",
            "Cosmos DB",
            "Entra ID",
            "Service Bus",
            "Azure OpenAI",
            "Front Door",
            "Key Vault",
            "Azure DevOps",
            "Monitor",
          ],
        },
        {
          label: "Google Cloud",
          items: [
            "Cloud Run",
            "GKE",
            "Cloud Functions",
            "Cloud SQL",
            "Firestore",
            "Cloud Storage",
            "Pub/Sub",
            "BigQuery",
            "Vertex AI",
            "Load Balancing",
            "Secret Manager",
          ],
        },
      ],
    },
  },

  why: {
    eyebrow: "Why NectArray",
    title:
      "A small team, a fraction of the cost, and no agency layer in between.",
    lede: "Put our quote next to an agency's for the same scope and the gap is not a discount — it is everything you were being charged for that was never engineering.",
    points: [
      {
        icon: "code",
        title: "The people on the call write the code",
        body: "No account manager relaying your requirements to someone you never meet, and no junior quietly doing the work under a senior's name. Small enough that you know exactly who built each part, and can ask them about it.",
      },
      {
        icon: "target",
        title: "A fraction of what an agency quotes",
        body: "An agency's price carries a sales floor, an office, and four layers of management before a line of code is written. We carry none of it, so the same build costs a fraction of the same scope elsewhere — for engineering that is not worse for it.",
      },
      {
        icon: "check",
        title: "Fixed scope, fixed price, in writing",
        body: "You get a quote against a written scope before anything starts, not an hourly rate and an invoice that grows. If the scope changes, we re-quote and you decide — no surprises arriving at the end.",
      },
      {
        icon: "shield",
        title: "You own every piece of it",
        body: "Code in your repository, infrastructure in your cloud account, domain in your registrar, all in your name from the first day. Nothing is rented from us and nothing holds you hostage — you can take it to any other engineer and they can pick it up.",
      },
      {
        icon: "layers",
        title: "Four practices under one roof",
        body: "The people who build it also run the paid media, the AI and the analytics. So the site is built to convert and instrumented to prove it, instead of being thrown over a wall to an agency that has to reverse-engineer it first.",
      },
      {
        icon: "message",
        title: "A direct line, not a ticket queue",
        body: "One WhatsApp group or one call, with the engineers in it. You see working software as it is built rather than a status report about it, so nothing is a surprise at handover.",
      },
    ],
  },

  quote: {
    eyebrow: "Get a quote",
    title: "Tell us what you are building.",
    lead: "A short note is enough. You will get a written scope and a fixed price against it — no retainer, and no discovery fee.",
    body: "Send a short note and you will get a written scope and a fixed price against it — no retainer, no discovery fee, and a straight answer if we are not the right people for the job. Then take that number to anyone else you are considering: that comparison is the entire pitch, and it is the reason most of our work comes from people who did exactly that.",
    // Deep-links to the form, not the top of /contact: that page opens on
    // the same dark ground and the same contact details as the footer, so
    // landing above the form reads as having gone nowhere.
    cta: { label: "Start a project", href: "/contact#enquiry" },
  },
};

export const ai: {
  eyebrow: string;
  title: string;
  lede: string;
  capabilities: IconCard[];
  harnesses: { title: string; body: string; items: string[] };
} = {
  eyebrow: "03 — Agentic AI",
  title: "Agents that do the work, not demos that describe it.",
  lede: "A chatbot that answers questions is table stakes. We build agents with tools, memory and permissions — systems that read your data, take actions in your software, and hand off to a human when they should.",
  capabilities: [
    {
      icon: "message",
      title: "Support & Sales Chatbots",
      body: "Grounded in your real documentation and catalogue, embedded in your site or WhatsApp, with escalation to a human the moment confidence drops.",
    },
    {
      icon: "database",
      title: "RAG Over Your Knowledge",
      body: "Contracts, SOPs, tickets, product docs — indexed, chunked and retrieved properly, with citations so answers can be checked rather than trusted.",
    },
    {
      icon: "workflow",
      title: "Workflow Agents",
      body: "Multi-step automation with real tool access: triage an inbox, enrich a lead, reconcile invoices, draft the report, update the CRM, ping the channel.",
    },
    {
      icon: "sparkles",
      title: "Agents Inside Your Product",
      body: "In-app copilots and assistants shipped as a feature of your own software — streaming responses, tool calls, and UI that reacts to what the model does.",
    },
    {
      icon: "phone",
      title: "Voice & Multimodal",
      body: "Voice agents for bookings and qualification, plus document, image and screenshot understanding where the input was never going to be plain text.",
    },
    {
      icon: "shield",
      title: "Evals & Guardrails",
      body: "The unglamorous half: test suites for prompts, regression evals, cost and latency budgets, PII handling, and observability so you can see why it did that.",
    },
  ],
  harnesses: {
    title: "Built on harnesses, not from scratch",
    body: "We build on the agent frameworks that already solved the hard parts — streaming, tool calling, state, retries, tracing — and spend our time on the part that is specific to you.",
    items: [
      "Vercel AI SDK",
      "Claude Agent SDK",
      "Model Context Protocol",
      "LangGraph",
      "OpenAI Agents SDK",
      "Pinecone / pgvector",
      "n8n & Temporal",
      "LangSmith",
    ],
  },
};
