"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  Carried,
  Chair,
  Chip,
  Desk,
  Label,
  Person,
  Screen,
  ScrollStory,
  SiteNav,
  SiteSections,
  Zone,
  carried,
  turn,
  useTrack,
  useWindow,
  type Key,
  type Look,
  type Shot,
} from "./TopViewKit";

/**
 * A whole one-page site for an e-commerce fulfilment centre, told by the
 * warehouse seen from above. Scrolling plays one order: it lands on the
 * screen, a picker pushes a trolley down the aisles and picks three items
 * off the racks, the packer boxes, tapes and labels them, carries the box
 * to the dock and the van drives away. The services, numbers, reviews and
 * questions follow.
 *
 * Built on TopViewKit (people, carried things, the camera and the page),
 * which Copy TSX includes below this file.
 */

const END = 30;

const PICKER: Key[] = [
  [0, 470, 130, -90],
  [5.5, 470, 130, -90],
  [6.6, 250, 130, -90],
  [6.75, 250, 130, 0],
  [7.3, 250, 130, 0],
  [7.45, 250, 130, 90],
  [8.1, 380, 130, 90],
  [8.2, 380, 130, 180],
  [8.8, 380, 220, 180],
  [8.9, 380, 220, 270],
  [9.8, 160, 220, 270],
  [9.95, 160, 220, 360],
  [10.6, 160, 220, 360],
  [10.75, 160, 220, 270],
  [11.3, 100, 220, 270],
  [11.45, 100, 220, 180],
  [12.2, 100, 220, 180],
  [12.35, 100, 220, 90],
  [13.6, 380, 220, 90],
  [13.75, 380, 220, 180],
  [14.6, 380, 350, 180],
  [14.8, 400, 352, 180],
  [22.0, 400, 352, 180],
  [22.2, 400, 352, 41],
  [23.0, 480, 260, 41],
  [23.1, 480, 260, 0],
  [23.8, 480, 140, 0],
  [END, 480, 140, 0],
];

const PACKER: Key[] = [
  [0, 400, 455, 0],
  [21.8, 400, 455, 0],
  [22.0, 400, 455, 94],
  [23.6, 600, 470, 94],
  [23.8, 600, 470, 90],
  [24.8, 600, 470, 90],
  [25.0, 600, 470, -86],
  [26.4, 400, 455, -86],
  [26.6, 400, 455, 0],
  [END, 400, 455, 0],
];

const SUPERVISOR: Key[] = [
  [0, 640, 58, 180],
  [END, 640, 58, 180],
];

const VAN: Key[] = [
  [0, 720, 472, 0],
  [26.0, 720, 472, 0],
  [29.6, 1300, 472, 0],
  [END, 1300, 472, 0],
];

/* The trolley rides in front of the picker; the picks sit inside it. */
const TROLLEY = carried([[0, END, PICKER]], 25);
const PICKS = [
  {
    at: 7.0,
    from: [250, 92] as [number, number],
    reach: 33,
    colour: "var(--s)",
  },
  {
    at: 10.2,
    from: [160, 182] as [number, number],
    reach: 25,
    colour: "var(--t)",
  },
  {
    at: 11.8,
    from: [100, 258] as [number, number],
    reach: 17,
    colour: "var(--p)",
  },
].map((p, i) => ({
  ...p,
  track: carried(
    [
      [0, p.at, p.from],
      [p.at + 0.3, 18.3 + i * 0.3, PICKER],
      [18.6 + i * 0.3, END, [392 + i * 8, 405]],
    ],
    p.reach,
  ),
}));

/* The parcel: on the table, with the packer, into the van. */
const PARCEL = carried(
  [
    [0, 21.5, [400, 405]],
    [21.7, 24.3, PACKER],
    [24.6, END, [668, 472]],
  ],
  18,
);

const SHOTS: Shot[] = [
  [0, 420, 300, 980],
  [2.0, 600, 150, 520],
  [4.5, 600, 150, 520],
  [6.0, 300, 170, 560],
  [12.4, 240, 200, 560],
  [14.6, 380, 330, 600],
  [16.0, 400, 400, 440],
  [21.2, 400, 400, 440],
  [23.0, 520, 440, 560],
  [25.4, 680, 460, 480],
  [27.0, 780, 460, 720],
  [29.0, 420, 320, 1050],
  [END, 420, 320, 1050],
];

const LOOKS: Record<string, Look> = {
  picker: {
    outfit: "var(--p)",
    skin: "#c68a5e",
    hair: "#27272a",
    hat: "var(--s)",
  },
  packer: { outfit: "var(--p-dark)", skin: "#e8b48f", hair: "#3f2a1d" },
  supervisor: {
    outfit: "#52525b",
    skin: "#8d5a3b",
    hair: "#18181b",
    collar: true,
  },
};

const RACK_COLOURS = [
  "var(--p)",
  "var(--s)",
  "var(--t)",
  "#a1a1aa",
  "var(--p-light)",
];

function Rack({
  x,
  y,
  w,
  seed,
}: {
  x: number;
  y: number;
  w: number;
  seed: number;
}) {
  return (
    <g>
      <rect
        x={x + 2}
        y={y + 3}
        width={w}
        height="30"
        rx="3"
        fill="#18181b"
        opacity="0.06"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height="30"
        rx="3"
        fill="#e4e4e7"
        stroke="#d4d4d8"
      />
      {Array.from({ length: Math.floor(w / 22) }).map((_, i) => (
        <rect
          key={i}
          x={x + 4 + i * 22}
          y={y + 4}
          width="18"
          height="22"
          rx="2"
          fill={RACK_COLOURS[(i * 3 + seed) % RACK_COLOURS.length]}
          opacity={(i + seed) % 3 === 0 ? 0.5 : 0.85}
        />
      ))}
    </g>
  );
}

function Pick({
  t,
  pick,
}: {
  t: MotionValue<number>;
  pick: (typeof PICKS)[number];
}) {
  const visible = useWindow(t, -1, 19.9);
  return (
    <motion.g style={{ opacity: visible }}>
      <Carried t={t} track={pick.track}>
        <rect x="-6" y="-5" width="12" height="10" rx="2" fill={pick.colour} />
        <path d="M-6 0 H6" stroke="#ffffff" strokeOpacity="0.6" />
      </Carried>
    </motion.g>
  );
}

/** The box: it appears open on the table, closes, gets taped and labelled. */
function Parcel({ t }: { t: MotionValue<number> }) {
  const shown = useWindow(t, 18.1, 25.0);
  const flaps = useTransform(t, [19.5, 19.9], [1, 0]);
  const tape = useTransform(t, [19.9, 20.4], [0, 1]);
  const label = useTransform(t, [20.8, 21.0], [0, 1]);
  return (
    <motion.g style={{ opacity: shown }}>
      <Carried t={t} track={PARCEL}>
        <rect x="-16" y="-14" width="32" height="28" fill="transparent" />
        <rect
          x="-15"
          y="-12"
          width="30"
          height="24"
          rx="2"
          fill="#d6b07a"
          stroke="#b08a55"
        />
        <motion.g style={{ opacity: flaps }}>
          <rect
            x="-15"
            y="-12"
            width="30"
            height="24"
            rx="2"
            fill="#a8824f"
            opacity="0.5"
          />
          <rect x="-12" y="-9" width="24" height="18" rx="1" fill="#f4f4f5" />
        </motion.g>
        <motion.rect
          x="-2.5"
          y="-12"
          width="5"
          height="24"
          fill="#e7d3b0"
          style={{ scaleY: tape, ...turn }}
        />
        <motion.g style={{ opacity: label }}>
          <rect
            x="3"
            y="-9"
            width="10"
            height="13"
            rx="1"
            fill="#ffffff"
            stroke="#a1a1aa"
            strokeWidth="0.6"
          />
          <path
            d="M5 -6 H11 M5 -3 H11 M5 0 H9"
            stroke="#18181b"
            strokeWidth="0.8"
          />
        </motion.g>
      </Carried>
    </motion.g>
  );
}

/** The courier van from above, its rear doors open until it is loaded. */
function Van({ t }: { t: MotionValue<number> }) {
  const { x, y } = useTrack(t, VAN);
  const doors = useTransform(t, [24.7, 25.1], [70, 0]);
  const doorsBack = useTransform(doors, (d) => -d);
  return (
    <motion.g style={{ x, y }}>
      <rect
        x="-78"
        y="-28"
        width="196"
        height="64"
        rx="10"
        fill="#18181b"
        opacity="0.07"
      />
      <rect
        x="-80"
        y="-32"
        width="160"
        height="64"
        rx="8"
        fill="#ffffff"
        stroke="#d4d4d8"
        strokeWidth="1.5"
      />
      <rect
        x="-70"
        y="-24"
        width="140"
        height="10"
        rx="3"
        fill="var(--p)"
        opacity="0.9"
      />
      <rect
        x="80"
        y="-30"
        width="34"
        height="60"
        rx="12"
        fill="#f4f4f5"
        stroke="#d4d4d8"
        strokeWidth="1.5"
      />
      <rect
        x="98"
        y="-24"
        width="12"
        height="48"
        rx="4"
        fill="#94a3b8"
        opacity="0.7"
      />
      <rect x="84" y="-36" width="8" height="6" rx="2" fill="#71717a" />
      <rect x="84" y="30" width="8" height="6" rx="2" fill="#71717a" />
      {/* The rear doors, hinged at the corners. */}
      <motion.rect
        x="-84"
        y="-32"
        width="5"
        height="32"
        rx="1.5"
        fill="#e4e4e7"
        stroke="#a1a1aa"
        style={{
          rotate: doors,
          originX: "100%",
          originY: "0%",
          transformBox: "fill-box",
        }}
      />
      <motion.rect
        x="-84"
        y="0"
        width="5"
        height="32"
        rx="1.5"
        fill="#e4e4e7"
        stroke="#a1a1aa"
        style={{
          rotate: doorsBack,
          originX: "100%",
          originY: "100%",
          transformBox: "fill-box",
        }}
      />
    </motion.g>
  );
}

function Warehouse(t: MotionValue<number>, clock: MotionValue<number>) {
  return (
    <>
      <Zone x={40} y={52} w={330} h={250} />
      <Zone x={316} y={364} w={168} h={120} r={20} />

      {/* Stock racks, aisles between them. */}
      <Rack x={60} y={70} w={280} seed={0} />
      <Rack x={60} y={160} w={280} seed={2} />
      <Rack x={60} y={250} w={280} seed={4} />

      {/* Orders desk. */}
      <Chair x={640} y={58} r={180} />
      <Desk x={560} y={84} w={160} h={60} />
      <Screen t={t} clock={clock} x={640} y={106} on={0.8} off={3.0} />
      <Chip t={t} at={2.8} x={640} y={190} text="Order in: 3 items, prepaid" />

      {/* Packing table, with a tape gun and a label printer. */}
      <Desk x={330} y={380} w={140} h={50} />
      <rect x="342" y="390" width="20" height="12" rx="3" fill="#a1a1aa" />
      <rect x="438" y="388" width="22" height="16" rx="3" fill="#52525b" />
      <Screen
        t={t}
        clock={clock}
        x={449}
        y={418}
        on={20.6}
        off={21.0}
        w={18}
        h={10}
        stand={false}
      />
      <Chip
        t={t}
        at={12.0}
        x={220}
        y={312}
        text="All 3 items picked and scanned"
      />
      <Chip t={t} at={20.4} x={548} y={388} text="Packed with care" />
      <Chip t={t} at={21.1} x={548} y={416} text="Label on, ready to ship" />

      {/* The dock, with its hazard edge. */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x="620"
          y={430 + i * 12}
          width="10"
          height="6"
          fill={i % 2 ? "#3f3f46" : "#f5a44a"}
          opacity="0.8"
        />
      ))}
      <Chip t={t} at={25.4} x={720} y={418} text="Out for delivery" />

      <Label x={60} y={62}>
        STOCK
      </Label>
      <Label x={560} y={160}>
        ORDERS
      </Label>
      <Label x={330} y={374}>
        PACKING
      </Label>
      <Label x={640} y={540}>
        DISPATCH
      </Label>

      <Parcel t={t} />
      {PICKS.map((p) => (
        <Pick key={p.at} t={t} pick={p} />
      ))}
      <Van t={t} />

      <Carried t={t} track={TROLLEY}>
        <rect x="-13" y="-20" width="26" height="40" fill="transparent" />
        <rect
          x="-11"
          y="-17"
          width="22"
          height="34"
          rx="3"
          fill="none"
          stroke="#71717a"
          strokeWidth="2"
        />
        <path
          d="M-11 17 H11"
          stroke="#3f3f46"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Carried>
      <Person
        t={t}
        clock={clock}
        track={SUPERVISOR}
        look={LOOKS.supervisor}
        busy={[[0.8, 3.0]]}
      />
      <Person
        t={t}
        clock={clock}
        track={PACKER}
        look={LOOKS.packer}
        busy={[[18.5, 21.0]]}
      />
      <Person t={t} clock={clock} track={PICKER} look={LOOKS.picker} />
    </>
  );
}

export function WarehouseScrollSite() {
  return (
    <div className="@container bg-white">
      <SiteNav
        brand="Godown Fulfilment"
        mark="G"
        links={[
          { label: "Services", href: "#services" },
          { label: "Pricing", href: "#start" },
        ]}
        cta="Ship with us"
      />
      <ScrollStory
        end={END}
        shots={SHOTS}
        world={Warehouse}
        floor="concrete"
        label="A warehouse from above. An order arrives, a picker collects three items from the racks, the packer boxes and labels them, and the courier van drives away."
        hero={{
          title: "Ordered tonight. Packed by morning.",
          text: "We store, pick, pack and ship your store's orders, so you can get on with selling.",
          primary: "Ship with us",
          secondary: "Our services",
          hint: "Scroll to follow an order through the warehouse.",
        }}
        steps={[
          {
            title: "The order lands.",
            text: "Orders from your website and every marketplace arrive on one screen the minute they are placed.",
            points: ["Every channel in one queue", "Stock updated as it ships"],
          },
          {
            title: "Picked from the shelves.",
            text: "A picker is routed aisle by aisle, scanning each item into the trolley.",
          },
          {
            title: "Nothing missed.",
            text: "Every pick is scanned against the order, so the wrong size never goes out.",
            points: [
              "Barcode check on every item",
              "Photo of every packed order",
            ],
          },
          {
            title: "Packed with care.",
            text: "Boxed to size, padded, taped and labelled at the packing table.",
          },
          {
            title: "Out the same day.",
            text: "The courier van is loaded at our dock and your customer gets the tracking link.",
          },
        ]}
        finale={{
          title: "Shipped. Arriving tomorrow.",
          text: "Picked, packed and handed to the courier.",
        }}
        cta="Ship with us"
      />
      <SiteSections
        content={{
          servicesTitle: "Your store's back room, run for you.",
          services: [
            {
              name: "Pick, pack and ship",
              text: "Orders picked and packed within hours, and handed to the courier the same day.",
            },
            {
              name: "Storage",
              text: "Racked, labelled and counted, so stock is where the system says.",
            },
            {
              name: "Marketplace links",
              text: "Your website, Amazon, Flipkart and Meesho in one queue.",
            },
            {
              name: "Returns",
              text: "Checked, restocked or written off within two days.",
            },
            {
              name: "Custom packaging",
              text: "Your box, your tape, your thank-you card.",
            },
          ],
          numbers: [
            { value: "1.2 lakh+", label: "Orders shipped" },
            { value: "Same day", label: "Dispatch before 2pm" },
            { value: "24,000", label: "Square feet of racking" },
            { value: "9", label: "Courier partners" },
          ],
          reviewsTitle: "Sellers who stopped packing at midnight.",
          reviews: [
            {
              quote:
                "We went from packing in the living room to 400 orders a day without hiring anyone.",
              who: "Founder, skincare brand",
            },
            {
              quote:
                "Wrong-item complaints went to almost nothing once every pick was scanned.",
              who: "Operations lead, apparel store",
            },
            {
              quote:
                "Festival week used to break us. This year it was just a busy week.",
              who: "Owner, home decor shop",
            },
          ],
          faqTitle: "Before you send us stock.",
          faqs: [
            {
              q: "Is there a minimum number of orders?",
              a: "No minimum to start. Pricing is per order, with a lower rate as volumes grow.",
            },
            {
              q: "Which couriers do you ship with?",
              a: "We compare rates across our partners for each order, or use your own courier account.",
            },
            {
              q: "Can I see my stock?",
              a: "Yes, live, with every inward, pick and return logged against your login.",
            },
          ],
          closing: {
            title: "Send us your first hundred orders.",
            text: "We will set up your store, receive your stock and ship within the week.",
            cta: "Ship with us",
          },
          footer: {
            brand: "Godown Fulfilment",
            about:
              "Storage, pick-pack and same-day dispatch for online stores.",
            address: ["Survey No. 44, Shamshabad", "Hyderabad 501218"],
            contact: ["hello@godownfulfil.in", "Mon to Sat, 9am to 8pm"],
          },
        }}
      />
    </div>
  );
}
