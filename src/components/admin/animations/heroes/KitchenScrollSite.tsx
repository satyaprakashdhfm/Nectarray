"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  Carried,
  Chip,
  Desk,
  Entrance,
  Label,
  Person,
  Screen,
  ScrollStory,
  SiteNav,
  SiteSections,
  Zone,
  carried,
  turn,
  useFrom,
  useWindow,
  type Key,
  type Look,
  type Shot,
} from "./TopViewKit";

/**
 * A whole one-page site for a cloud kitchen, told by its kitchen seen
 * from above. Scrolling plays one order: it prints at the pass, the chef
 * pins the ticket and chops at the prep counter, cooks on the flame while
 * the pan steams, brings it to the pass where it is packed and sealed, and
 * the rider walks in, takes the bag and rides away. The menu, numbers,
 * reviews and questions follow.
 *
 * Built on TopViewKit (people, carried things, the camera and the page),
 * which Copy TSX includes below this file.
 */

const END = 30;

const CHEF: Key[] = [
  [0, 400, 232, 180],
  [3.6, 400, 232, 180],
  [3.8, 400, 232, -76],
  [5.4, 160, 172, -76],
  [5.6, 160, 172, 0],
  [10.2, 160, 172, 0],
  [10.4, 160, 172, 90],
  [12.0, 640, 172, 90],
  [12.2, 640, 172, 0],
  [18.0, 640, 172, 0],
  [18.2, 640, 172, -104],
  [19.6, 400, 232, -104],
  [19.8, 400, 232, -180],
  [END, 400, 232, -180],
];

const PACKER: Key[] = [
  [0, 400, 330, 0],
  [END, 400, 330, 0],
];

const RIDER: Key[] = [
  [0, -120, 505, 90],
  [21.0, -120, 505, 90],
  [23.0, 300, 505, 90],
  [23.1, 300, 505, 47],
  [24.2, 445, 345, 47],
  [24.3, 445, 345, 0],
  [24.8, 445, 345, 0],
  [25.0, 445, 345, -140],
  [26.2, 300, 505, -140],
  [26.3, 300, 505, -90],
  [28.2, -110, 505, -90],
  [29.8, -640, 505, -90],
  [END, -640, 505, -90],
];

const SCOOTER: Key[] = [
  [0, -110, 505, -90],
  [28.2, -110, 505, -90],
  [29.8, -640, 505, -90],
  [END, -640, 505, -90],
];

/* The ticket: printed at the pass, carried by the chef, pinned at prep. */
const TICKET = carried([
  [0, 3.0, [350, 281]],
  [3.2, 5.4, CHEF],
  [5.7, END, [204, 96]],
]);

/* Chopped vegetables, then the pan: prep board, stove, pass. */
const PAN = carried(
  [
    [0, 10.2, [150, 114]],
    [10.4, 12.0, CHEF],
    [12.4, 18.0, [640, 112]],
    [18.3, 19.6, CHEF],
    [19.9, END, [400, 281]],
  ],
  17,
);

/* The sealed bag: on the pass, then with the rider. */
const BAG = carried([
  [0, 24.4, [400, 281]],
  [24.7, END, RIDER],
]);

const SHOTS: Shot[] = [
  [0, 380, 300, 980],
  [1.5, 400, 270, 480],
  [3.5, 400, 270, 480],
  [5.5, 240, 190, 620],
  [6.2, 160, 150, 420],
  [10.0, 160, 150, 420],
  [12.0, 400, 170, 680],
  [12.8, 640, 150, 420],
  [17.8, 640, 150, 420],
  [19.8, 450, 240, 620],
  [20.4, 400, 290, 440],
  [22.6, 400, 290, 440],
  [24.4, 360, 380, 640],
  [26.4, 200, 450, 720],
  [28.8, 100, 420, 900],
  [29.6, 380, 300, 1000],
  [END, 380, 300, 1000],
];

const LOOKS: Record<string, Look> = {
  chef: {
    outfit: "#f4f4f5",
    skin: "#c68a5e",
    hair: "#27272a",
    hat: "#ffffff",
    collar: true,
  },
  packer: {
    outfit: "var(--p)",
    skin: "#e8b48f",
    hair: "#3f2a1d",
    hat: "var(--p-dark)",
  },
  rider: {
    outfit: "var(--s)",
    skin: "#8d5a3b",
    hair: "#18181b",
    hat: "var(--s-dark)",
  },
};

/** A burner: dark when off, a flickering ring of flame while cooking. */
function Burner({
  t,
  clock,
  x,
  y,
  on,
  off,
}: {
  t: MotionValue<number>;
  clock: MotionValue<number>;
  x: number;
  y: number;
  on?: number;
  off?: number;
}) {
  const lit = useWindow(t, on ?? 99, off ?? 100);
  const flicker = useTransform(clock, (ms) => 0.85 + Math.sin(ms / 90) * 0.15);
  return (
    <g>
      <circle cx={x} cy={y} r="17" fill="#27272a" />
      <circle
        cx={x}
        cy={y}
        r="11"
        fill="none"
        stroke="#52525b"
        strokeWidth="2"
      />
      {on !== undefined && (
        <motion.g style={{ opacity: lit }}>
          <motion.circle
            cx={x}
            cy={y}
            r="13"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeDasharray="3 2"
            style={{ scale: flicker, ...turn }}
          />
          <circle
            cx={x}
            cy={y}
            r="9"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            opacity="0.7"
          />
        </motion.g>
      )}
    </g>
  );
}

/** Steam rising off the pan while it cooks: rings that grow and fade. */
function Steam({
  t,
  clock,
  x,
  y,
}: {
  t: MotionValue<number>;
  clock: MotionValue<number>;
  x: number;
  y: number;
}) {
  const on = useWindow(t, 12.6, 17.9);
  const a = useTransform(clock, (ms) => (ms / 1600) % 1);
  const b = useTransform(clock, (ms) => ((ms + 800) / 1600) % 1);
  const scaleA = useTransform(a, [0, 1], [0.6, 2.2]);
  const scaleB = useTransform(b, [0, 1], [0.6, 2.2]);
  const fadeA = useTransform(a, [0, 0.2, 1], [0, 0.5, 0]);
  const fadeB = useTransform(b, [0, 0.2, 1], [0, 0.5, 0]);
  return (
    <motion.g style={{ opacity: on }}>
      <motion.circle
        cx={x - 4}
        cy={y - 6}
        r="10"
        fill="#ffffff"
        stroke="#e4e4e7"
        style={{ scale: scaleA, opacity: fadeA, ...turn }}
      />
      <motion.circle
        cx={x + 5}
        cy={y - 2}
        r="10"
        fill="#ffffff"
        stroke="#e4e4e7"
        style={{ scale: scaleB, opacity: fadeB, ...turn }}
      />
    </motion.g>
  );
}

/** What is on the prep board: whole vegetables, then chopped ones. */
function Board({ t }: { t: MotionValue<number> }) {
  const whole = useTransform(t, [6.2, 9.4], [1, 0]);
  // Chopped, then scooped into the pan.
  const chopped = useTransform(t, [6.6, 9.6, 9.9, 10.1], [0, 1, 1, 0]);
  return (
    <g>
      <rect
        x="118"
        y="98"
        width="64"
        height="34"
        rx="5"
        fill="#e7d3b0"
        stroke="#d6b07a"
      />
      <motion.g style={{ opacity: whole }}>
        <circle cx="134" cy="115" r="7" fill="#dc2626" opacity="0.85" />
        <circle cx="150" cy="113" r="6" fill="#f59e0b" opacity="0.85" />
        <circle cx="165" cy="116" r="7" fill="#16a34a" opacity="0.8" />
      </motion.g>
      <motion.g style={{ opacity: chopped }}>
        {[
          [128, 108, "#dc2626"],
          [137, 120, "#dc2626"],
          [146, 110, "#f59e0b"],
          [153, 121, "#f59e0b"],
          [162, 108, "#16a34a"],
          [170, 120, "#16a34a"],
          [141, 114, "#f59e0b"],
          [166, 114, "#dc2626"],
        ].map(([x, y, c], i) => (
          <rect
            key={i}
            x={Number(x) - 2.5}
            y={Number(y) - 2.5}
            width="5"
            height="5"
            rx="1"
            fill={String(c)}
            opacity="0.85"
          />
        ))}
      </motion.g>
    </g>
  );
}

function Food({ t }: { t: MotionValue<number> }) {
  // The pan until it reaches the pass, then the boxed meal, then the bag.
  const pan = useWindow(t, 9.7, 20.6);
  const box = useWindow(t, 20.3, 21.4);
  const bag = useFrom(t, 21.1);
  const filled = useTransform(t, [9.6, 10.2], [0, 1]);
  return (
    <>
      <motion.g style={{ opacity: pan }}>
        <Carried t={t} track={PAN}>
          <rect x="-34" y="-16" width="50" height="32" fill="transparent" />
          <rect x="-34" y="-3" width="20" height="6" rx="3" fill="#3f3f46" />
          <circle r="15" fill="#3f3f46" />
          <circle r="12" fill="#52525b" />
          <motion.g style={{ opacity: filled }}>
            <circle cx="-4" cy="-3" r="3" fill="#dc2626" />
            <circle cx="4" cy="2" r="3" fill="#f59e0b" />
            <circle cx="-2" cy="5" r="3" fill="#16a34a" />
            <circle cx="5" cy="-5" r="2.5" fill="#f59e0b" />
          </motion.g>
        </Carried>
      </motion.g>
      <motion.g style={{ opacity: box }}>
        <rect
          x="384"
          y="268"
          width="32"
          height="26"
          rx="4"
          fill="#ffffff"
          stroke="#d4d4d8"
        />
        <rect
          x="388"
          y="272"
          width="24"
          height="18"
          rx="3"
          fill="#f59e0b"
          opacity="0.5"
        />
      </motion.g>
      <motion.g style={{ opacity: bag }}>
        <Carried t={t} track={BAG}>
          <rect x="-14" y="-12" width="28" height="24" fill="transparent" />
          <rect
            x="-13"
            y="-11"
            width="26"
            height="22"
            rx="4"
            fill="#d6b07a"
            stroke="#b08a55"
          />
          <path
            d="M-6 -11 Q0 -17 6 -11"
            fill="none"
            stroke="#b08a55"
            strokeWidth="2"
          />
          <circle r="4" fill="var(--p)" />
        </Carried>
      </motion.g>
    </>
  );
}

/** The order ticket, from the moment it prints. */
function Ticket({ t }: { t: MotionValue<number> }) {
  const printed = useFrom(t, 1.9);
  return (
    <motion.g style={{ opacity: printed }}>
      <Carried t={t} track={TICKET}>
        <rect
          x="-6"
          y="-8"
          width="12"
          height="16"
          rx="1"
          fill="#ffffff"
          stroke="#a1a1aa"
          strokeWidth="0.8"
        />
        <path
          d="M-3.5 -4 H3.5 M-3.5 -1 H3.5 M-3.5 2 H1.5"
          stroke="#18181b"
          strokeWidth="0.8"
        />
      </Carried>
    </motion.g>
  );
}

function Scooter() {
  return (
    <g>
      <rect x="-11" y="-30" width="22" height="58" rx="10" fill="var(--s)" />
      <rect x="-7" y="-4" width="14" height="22" rx="5" fill="#27272a" />
      <rect x="-18" y="-30" width="36" height="5" rx="2.5" fill="#3f3f46" />
      <rect
        x="-12"
        y="16"
        width="24"
        height="18"
        rx="3"
        fill="#ffffff"
        stroke="#d4d4d8"
      />
    </g>
  );
}

function Kitchen(t: MotionValue<number>, clock: MotionValue<number>) {
  return (
    <>
      <Entrance />
      <Zone x={60} y={50} w={220} h={170} />
      <Zone x={520} y={50} w={240} h={170} />
      <Zone x={300} y={196} w={204} h={180} r={28} />

      {/* Walk-in fridge and a sink against the left side. */}
      <rect
        x="30"
        y="250"
        width="50"
        height="90"
        rx="6"
        fill="#e4e4e7"
        stroke="#d4d4d8"
      />
      <path d="M36 295 H74" stroke="#a1a1aa" strokeWidth="1.5" />
      <rect
        x="30"
        y="360"
        width="50"
        height="40"
        rx="6"
        fill="#e4e4e7"
        stroke="#d4d4d8"
      />
      <rect x="38" y="366" width="34" height="28" rx="8" fill="#cbd5e1" />

      {/* Prep counter. */}
      <Desk x={80} y={84} w={160} h={60} fill="#f1f5f9" />
      <Board t={t} />
      <rect x="196" y="90" width="30" height="4" rx="2" fill="#a1a1aa" />

      {/* The stove: four burners, one lit while the pan cooks. */}
      <Desk x={560} y={84} w={160} h={60} fill="#f1f5f9" />
      <Burner t={t} clock={clock} x={600} y={104} />
      <Burner t={t} clock={clock} x={640} y={112} on={12.4} off={18.1} />
      <Burner t={t} clock={clock} x={684} y={104} />
      <rect x="670" y="122" width="34" height="14" rx="4" fill="#52525b" />
      <Steam t={t} clock={clock} x={640} y={112} />
      <Chip t={t} at={16.8} x={640} y={214} text="Cooked to order" />

      {/* The pass: the tablet, the ticket printer and the packing space. */}
      <Desk x={330} y={262} w={140} h={38} fill="#f1f5f9" />
      <rect x="340" y="272" width="20" height="18" rx="3" fill="#52525b" />
      <Screen
        t={t}
        clock={clock}
        x={448}
        y={281}
        on={1.0}
        off={2.0}
        w={28}
        h={18}
        stand={false}
      />
      <Chip
        t={t}
        at={1.8}
        x={400}
        y={180}
        text="New order: 2 thalis, 1 lassi"
      />
      <Chip
        t={t}
        at={9.6}
        x={160}
        y={214}
        text="Chopped fresh for your order"
      />
      <Chip t={t} at={21.4} x={560} y={281} text="Sealed for safety" />

      <Label x={80} y={76}>
        PREP
      </Label>
      <Label x={560} y={76}>
        STOVE
      </Label>
      <Label x={330} y={254}>
        THE PASS
      </Label>
      <Label x={30} y={242}>
        COLD STORE
      </Label>

      <Carried t={t} track={SCOOTER}>
        <rect x="-20" y="-34" width="40" height="70" fill="transparent" />
        <Scooter />
      </Carried>

      <Ticket t={t} />
      <Food t={t} />

      <Person
        t={t}
        clock={clock}
        track={PACKER}
        look={LOOKS.packer}
        busy={[[20.0, 21.8]]}
      />
      <Person
        t={t}
        clock={clock}
        track={CHEF}
        look={LOOKS.chef}
        busy={[
          [6.0, 9.8],
          [12.6, 17.6],
        ]}
      />
      <Person t={t} clock={clock} track={RIDER} look={LOOKS.rider} />
    </>
  );
}

export function KitchenScrollSite() {
  return (
    <div className="@container bg-white">
      <SiteNav
        brand="Tava Kitchen"
        mark="T"
        links={[
          { label: "Menu", href: "#services" },
          { label: "Order", href: "#start" },
        ]}
        cta="Order now"
      />
      <ScrollStory
        end={END}
        shots={SHOTS}
        world={Kitchen}
        label="A kitchen from above. An order prints, the chef chops and cooks it, it is packed and sealed at the pass, and a rider takes it away."
        hero={{
          title: "Cooked when you order. Never before.",
          text: "A cloud kitchen that starts your meal the moment you tap order, and hands it to the rider hot.",
          primary: "Order now",
          secondary: "Our menu",
          hint: "Scroll to follow an order through the kitchen.",
        }}
        steps={[
          {
            title: "The order prints.",
            text: "Every order lands on the pass and prints a ticket the chef takes to the station.",
            points: [
              "All delivery apps in one place",
              "Allergies printed in red",
            ],
          },
          {
            title: "Chopped fresh.",
            text: "Vegetables are washed and cut for your order, not hours before.",
          },
          {
            title: "Cooked to order.",
            text: "On a hot pan, by a chef who tastes it before it leaves the stove.",
          },
          {
            title: "Packed and sealed.",
            text: "Leak-proof containers, a tamper seal on the bag, and the bill inside.",
          },
          {
            title: "Handed over hot.",
            text: "The rider is waiting at the pass, and your food is out the door within a minute of packing.",
          },
        ]}
        finale={{
          title: "On its way, hot and sealed.",
          text: "Cooked, packed and with the rider.",
        }}
        cta="Order now"
      />
      <SiteSections
        content={{
          servicesTitle: "Home-style food, cooked the moment you order.",
          services: [
            {
              name: "Thalis",
              text: "Dal, two sabzis, rice, rotis and a sweet, changing every day of the week.",
            },
            {
              name: "Biryani",
              text: "Dum-cooked in small batches, never reheated.",
            },
            {
              name: "Office lunches",
              text: "Twenty to two hundred boxes, on time, every weekday.",
            },
            {
              name: "Healthy bowls",
              text: "Millets, greens and protein, counted for you.",
            },
            {
              name: "Party orders",
              text: "Trays for twenty, with servers if you want them.",
            },
          ],
          numbers: [
            { value: "2,300+", label: "Orders a week" },
            { value: "28 min", label: "Average to your door" },
            { value: "4.6", label: "Rating on delivery apps" },
            { value: "0", label: "Food kept overnight" },
          ],
          reviewsTitle: "What our regulars say.",
          reviews: [
            {
              quote:
                "It tastes like it was made at home, because it was made ten minutes ago.",
              who: "Regular, Kondapur",
            },
            {
              quote:
                "Our team's lunch has come at 12:45 every day for a year. Not once late.",
              who: "Office manager, Hitech City",
            },
            {
              quote:
                "The seal on the bag is a small thing, but it is why I trust them.",
              who: "Customer, Manikonda",
            },
          ],
          faqTitle: "Before you order.",
          faqs: [
            {
              q: "Where do you deliver?",
              a: "Within six kilometres of the kitchen, through the delivery apps and our own riders.",
            },
            {
              q: "Can you make it less spicy?",
              a: "Yes. Add a note and the chef sees it on the ticket, printed in red.",
            },
            {
              q: "Do you take bulk orders?",
              a: "Yes, with a day's notice for office lunches and two days for parties.",
            },
          ],
          closing: {
            title: "Hungry? It starts cooking when you tap.",
            text: "Order on the apps or straight from us, and it is at your door in about half an hour.",
            cta: "Order now",
          },
          footer: {
            brand: "Tava Kitchen",
            about: "A delivery-only kitchen cooking home-style meals to order.",
            address: ["Shop 4, Botanical Garden Road", "Hyderabad 500084"],
            contact: ["order@tavakitchen.in", "Open 11am to 11pm"],
          },
        }}
      />
    </div>
  );
}
