"use client";

import type { MotionValue } from "motion/react";
import {
  Carried,
  Chair,
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
  type Key,
  type Look,
  type Shot,
} from "./TopViewKit";

/**
 * A whole one-page site for a neighbourhood clinic, told by the clinic
 * seen from above. Scrolling plays one visit: the patient walks in and
 * registers, has their vitals taken, sees the doctor in the glass room,
 * gives a sample in the lab while it runs on the analyser, collects their
 * medicines from the pharmacist and walks out. The services, numbers,
 * reviews and questions follow.
 *
 * Built on TopViewKit (people, carried things, the camera and the page),
 * which Copy TSX includes below this file.
 */

const END = 30;

const PATIENT: Key[] = [
  [0, -70, 505, 90],
  [2.6, 205, 505, 90],
  [2.85, 205, 505, 0],
  [4.4, 205, 505, 0],
  [4.6, 205, 505, 90],
  [5.3, 300, 505, 90],
  [5.45, 300, 505, 0],
  [6.9, 300, 240, 0],
  [7.0, 300, 240, -64],
  [7.7, 160, 172, -64],
  [7.9, 160, 172, 0],
  [10.0, 160, 172, 0],
  [10.2, 160, 172, 90],
  [11.4, 520, 172, 90],
  [11.5, 520, 172, 151],
  [12.0, 590, 300, 151],
  [12.1, 590, 300, 184],
  [12.8, 578, 470, 184],
  [12.9, 578, 476, 90],
  [13.3, 660, 476, 90],
  [13.5, 660, 476, 0],
  [16.6, 660, 476, 0],
  [16.8, 660, 476, -90],
  [17.2, 578, 476, -90],
  [17.3, 578, 476, 0],
  [18.0, 578, 320, 0],
  [18.1, 578, 320, 36],
  [18.3, 600, 290, 36],
  [18.4, 600, 290, 19],
  [19.3, 640, 172, 19],
  [19.4, 640, 172, 0],
  [22.8, 640, 172, 0],
  [23.0, 640, 172, -143],
  [24.2, 520, 330, -143],
  [24.3, 520, 330, -90],
  [25.0, 400, 330, -90],
  [25.2, 400, 330, 0],
  [26.6, 400, 330, 0],
  [26.8, 400, 330, -150],
  [27.8, 300, 505, -150],
  [27.9, 300, 505, -90],
  [29.6, -70, 505, -90],
  [END, -70, 505, -90],
];

const still = (x: number, y: number, r: number): Key[] => [
  [0, x, y, r],
  [END, x, y, r],
];

const RECEPTIONIST = still(205, 392, 180);
const NURSE: Key[] = [
  [0, 160, 58, 180],
  [8.0, 160, 58, 180],
  [8.2, 160, 58, 200],
  [9.4, 160, 58, 165],
  [9.8, 160, 58, 180],
  [END, 160, 58, 180],
];
const DOCTOR: Key[] = [
  [0, 660, 374, 180],
  [13.4, 660, 374, 180],
  [13.7, 660, 374, 195],
  [14.0, 660, 374, 180],
  [END, 660, 374, 180],
];
const LAB_TECH: Key[] = [
  [0, 640, 58, 180],
  [20.3, 640, 58, 180],
  [20.5, 640, 58, 90],
  [20.9, 700, 58, 90],
  [21.0, 700, 58, 180],
  [22.4, 700, 58, 180],
  [22.6, 700, 58, -90],
  [23.0, 640, 58, -90],
  [23.1, 640, 58, 180],
  [END, 640, 58, 180],
];
const PHARMACIST: Key[] = [
  [0, 400, 240, 180],
  [23.5, 400, 240, 180],
  [23.8, 400, 240, 0],
  [24.3, 400, 240, 0],
  [24.6, 400, 240, 180],
  [END, 400, 240, 180],
];
const WAITING_1 = still(360, 552, 0);
const WAITING_2 = still(400, 552, 0);

/* The sample tube: on the bench, with the technician, into the analyser. */
const TUBE = carried([
  [0, 19.6, [612, 112]],
  [19.8, 20.9, LAB_TECH],
  [21.2, END, [700, 100]],
]);

/* The medicines: on the shelf, with the pharmacist, on the counter, out. */
const MEDICINE = carried([
  [0, 24.0, [400, 214]],
  [24.15, 24.95, PHARMACIST],
  [25.2, 25.5, [400, 281]],
  [25.75, END, PATIENT],
]);

const SHOTS: Shot[] = [
  [0, 380, 300, 980],
  [2.5, 240, 470, 560],
  [4.4, 240, 470, 560],
  [6.2, 260, 300, 760],
  [7.8, 160, 170, 440],
  [9.9, 160, 170, 440],
  [12.6, 450, 320, 800],
  [13.6, 660, 440, 420],
  [16.5, 660, 440, 420],
  [18.5, 620, 240, 620],
  [19.6, 650, 150, 440],
  [22.7, 650, 150, 440],
  [24.3, 480, 300, 620],
  [25.2, 400, 290, 440],
  [26.6, 400, 290, 440],
  [28.2, 300, 400, 800],
  [29.4, 400, 300, 1000],
  [END, 400, 300, 1000],
];

const LOOKS: Record<string, Look> = {
  patient: { outfit: "var(--s)", skin: "#d9a27a", hair: "#27272a" },
  reception: {
    outfit: "var(--p)",
    skin: "#c68a5e",
    hair: "#2b1d14",
    collar: true,
  },
  nurse: { outfit: "var(--p-light)", skin: "#8d5a3b", hair: "#18181b" },
  doctor: { outfit: "#e4e4e7", skin: "#f1c7a1", hair: "#4a3426", collar: true },
  lab: { outfit: "var(--p-dark)", skin: "#e8b48f", hair: "#3f2a1d" },
  pharmacy: {
    outfit: "var(--t)",
    skin: "#a8714c",
    hair: "#18181b",
    collar: true,
  },
  waiting1: { outfit: "#a1a1aa", skin: "#c68a5e", hair: "#3f3f46" },
  waiting2: { outfit: "var(--s-light)", skin: "#f1c7a1", hair: "#71717a" },
};

function Clinic(t: MotionValue<number>, clock: MotionValue<number>) {
  return (
    <>
      <Entrance />
      <Zone x={120} y={372} w={300} h={210} />
      <Zone x={300} y={190} w={204} h={180} r={28} />

      {/* The doctor's glass room, its door at the top. */}
      <rect
        x="560"
        y="300"
        width="220"
        height="280"
        rx="6"
        fill="var(--p-light)"
        opacity="0.3"
      />
      <path
        d="M572 300 H566 Q560 300 560 306 V574 Q560 580 566 580 H774 Q780 580 780 574 V306 Q780 300 774 300 H622"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* The examination bed, with its pillow. */}
      <rect
        x="696"
        y="490"
        width="70"
        height="80"
        rx="8"
        fill="#ffffff"
        stroke="#d4d4d8"
      />
      <rect x="704" y="496" width="54" height="16" rx="6" fill="#e4e4e7" />

      {/* Reception. */}
      <Chair x={205} y={392} />
      <Desk x={140} y={420} w={130} h={46} />
      <Screen
        t={t}
        clock={clock}
        x={238}
        y={438}
        on={2.9}
        off={4.3}
        w={40}
        h={26}
        stand={false}
      />
      <Chip
        t={t}
        at={4.2}
        x={205}
        y={545}
        text="Registered, token on WhatsApp"
      />

      {/* Waiting chairs. */}
      <Chair x={320} y={556} r={180} />
      <Chair x={360} y={556} r={180} />
      <Chair x={400} y={556} r={180} />

      {/* Vitals. */}
      <Chair x={160} y={58} r={180} />
      <Desk x={80} y={84} w={160} h={60} />
      <Screen
        t={t}
        clock={clock}
        x={125}
        y={110}
        on={8.0}
        off={9.8}
        kind="pulse"
        w={56}
        h={28}
      />
      <rect x="182" y="98" width="34" height="24" rx="5" fill="#e4e4e7" />
      <circle
        cx="199"
        cy="110"
        r="7"
        fill="none"
        stroke="#a1a1aa"
        strokeWidth="2"
      />
      <circle cx="160" cy="174" r="13" fill="#e4e4e7" stroke="#d4d4d8" />
      <Chip t={t} at={8.9} x={160} y={216} text="Blood pressure normal" />
      <Chip t={t} at={9.6} x={160} y={244} text="Pulse and oxygen fine" />

      {/* The doctor's desk. */}
      <Chair x={660} y={374} r={180} />
      <Desk x={600} y={400} w={124} h={46} />
      <Screen
        t={t}
        clock={clock}
        x={700}
        y={418}
        on={14.0}
        off={16.2}
        w={36}
        h={22}
        stand={false}
      />
      <path
        d="M620 412 q10 18 26 6"
        fill="none"
        stroke="#71717a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="646" cy="418" r="4" fill="#a1a1aa" />
      <Chair x={660} y={478} />
      <Chip t={t} at={16.0} x={640} y={530} text="Prescription on your phone" />

      {/* The lab. */}
      <Chair x={640} y={58} r={180} />
      <Desk x={560} y={84} w={160} h={60} />
      <rect
        x="598"
        y="100"
        width="28"
        height="24"
        rx="4"
        fill="#e4e4e7"
        stroke="#d4d4d8"
      />
      <Screen
        t={t}
        clock={clock}
        x={700}
        y={118}
        on={21.2}
        off={22.6}
        w={34}
        h={22}
        stand={false}
      />
      <circle cx="640" cy="174" r="13" fill="#e4e4e7" stroke="#d4d4d8" />
      <Chip t={t} at={22.6} x={640} y={216} text="Report ready the same day" />

      {/* The pharmacy: shelves behind, counter in front. */}
      <rect x="330" y="204" width="140" height="18" rx="3" fill="#e4e4e7" />
      {Array.from({ length: 11 }).map((_, i) => (
        <rect
          key={i}
          x={336 + i * 12}
          y="207"
          width="9"
          height="12"
          rx="2"
          fill={["var(--p)", "var(--s)", "var(--p-light)", "#a1a1aa"][i % 4]}
          opacity={i % 2 ? 0.6 : 0.9}
        />
      ))}
      <Desk x={330} y={262} w={140} h={38} />
      <Chip t={t} at={25.6} x={400} y={372} text="Every dose explained" />

      <Label x={140} y={484}>
        RECEPTION
      </Label>
      <Label x={80} y={160}>
        VITALS
      </Label>
      <Label x={560} y={160}>
        LAB
      </Label>
      <Label x={580} y={322}>
        DOCTOR
      </Label>
      <Label x={330} y={196}>
        PHARMACY
      </Label>

      <Person
        t={t}
        clock={clock}
        track={WAITING_1}
        look={LOOKS.waiting1}
        busy={[[0, END]]}
      />
      <Person t={t} clock={clock} track={WAITING_2} look={LOOKS.waiting2} />
      <Person
        t={t}
        clock={clock}
        track={RECEPTIONIST}
        look={LOOKS.reception}
        busy={[[3.0, 4.3]]}
      />
      <Person
        t={t}
        clock={clock}
        track={NURSE}
        look={LOOKS.nurse}
        busy={[[8.0, 9.8]]}
      />
      <Person
        t={t}
        clock={clock}
        track={DOCTOR}
        look={LOOKS.doctor}
        busy={[[14.0, 16.2]]}
      />
      <Person
        t={t}
        clock={clock}
        track={LAB_TECH}
        look={LOOKS.lab}
        busy={[[19.5, 20.2]]}
      />
      <Person t={t} clock={clock} track={PHARMACIST} look={LOOKS.pharmacy} />
      <Person t={t} clock={clock} track={PATIENT} look={LOOKS.patient} />

      <Carried t={t} track={TUBE}>
        <rect
          x="-3"
          y="-8"
          width="6"
          height="16"
          rx="3"
          fill="#ffffff"
          stroke="#a1a1aa"
        />
        <rect
          x="-3"
          y="1"
          width="6"
          height="7"
          rx="3"
          fill="#dc2626"
          opacity="0.8"
        />
      </Carried>
      <Carried t={t} track={MEDICINE}>
        <rect x="-12" y="-11" width="24" height="22" fill="transparent" />
        <rect
          x="-11"
          y="-9"
          width="22"
          height="18"
          rx="4"
          fill="#ffffff"
          stroke="var(--p)"
          strokeWidth="1.6"
        />
        <path
          d="M-3 0 H3 M0 -3 V3"
          stroke="var(--p)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Carried>
    </>
  );
}

export function ClinicScrollSite() {
  return (
    <div className="@container bg-white">
      <SiteNav
        brand="Arogya Clinic"
        mark="A"
        links={[
          { label: "Services", href: "#services" },
          { label: "Visit", href: "#start" },
        ]}
        cta="Book a visit"
      />
      <ScrollStory
        end={END}
        shots={SHOTS}
        world={Clinic}
        label="A clinic from above. A patient registers, has vitals taken, sees the doctor, gives a sample in the lab, collects medicines and leaves."
        hero={{
          title: "Walk in unwell. Walk out with a plan.",
          text: "Registration, tests, the doctor and your medicines, all under one roof and one visit.",
          primary: "Book a visit",
          secondary: "Our services",
          hint: "Scroll to follow a visit through the clinic.",
        }}
        steps={[
          {
            title: "Registered in a minute.",
            text: "Your token comes on WhatsApp, and your history is on our screen before you sit down.",
            points: ["No forms to fill", "Waiting time shown live"],
          },
          {
            title: "Vitals first.",
            text: "A nurse checks blood pressure, pulse and oxygen, so the doctor starts with the numbers.",
          },
          {
            title: "Unhurried time with the doctor.",
            text: "A proper consultation, and a digital prescription you keep.",
            points: [
              "Prescription on your phone",
              "Follow-up booked before you leave",
            ],
          },
          {
            title: "Tests in the same building.",
            text: "Samples are taken here and run on our own analyser. Most reports are ready the same day.",
          },
          {
            title: "Medicines, explained.",
            text: "The pharmacist hands over your medicines and tells you when and how to take each one.",
          },
        ]}
        finale={{
          title: "All done. Get well soon.",
          text: "Seen, tested and treated in a single visit.",
        }}
        cta="Book a visit"
      />
      <SiteSections
        content={{
          servicesTitle: "Care for the whole family, close to home.",
          services: [
            {
              name: "General consultation",
              text: "Fevers, aches, check-ups and everything in between, with a doctor who knows your history.",
            },
            {
              name: "Lab tests",
              text: "Blood, urine and thyroid panels, most reported the same day.",
            },
            {
              name: "Pharmacy",
              text: "Prescriptions filled on the spot, with doses explained.",
            },
            {
              name: "Child care",
              text: "Vaccinations and growth checks on a schedule we keep for you.",
            },
            {
              name: "Home visits",
              text: "A doctor or nurse at your door for the elderly and bedridden.",
            },
          ],
          numbers: [
            { value: "38,000+", label: "Patients seen" },
            { value: "12", label: "Doctors and nurses" },
            { value: "Same day", label: "Most lab reports" },
            { value: "7 days", label: "Open every week" },
          ],
          reviewsTitle: "What our patients say.",
          reviews: [
            {
              quote:
                "Token on my phone, tests downstairs, medicines at the counter. Forty minutes, door to door.",
              who: "Patient, Madhapur",
            },
            {
              quote:
                "The doctor actually listened, and called the next day to ask how I was.",
              who: "Patient, Gachibowli",
            },
            {
              quote:
                "They came home for my father's dressing every morning for two weeks.",
              who: "Family of a patient, Kukatpally",
            },
          ],
          faqTitle: "Before your visit.",
          faqs: [
            {
              q: "Do I need an appointment?",
              a: "Walk-ins are welcome. Booking ahead on WhatsApp gets you a time slot and a shorter wait.",
            },
            {
              q: "When will my lab report be ready?",
              a: "Most routine tests are ready the same evening, on WhatsApp and in print at the desk.",
            },
            {
              q: "Do you accept health insurance?",
              a: "Yes, for consultations and tests under most cashless plans. Bring your card and an ID.",
            },
          ],
          closing: {
            title: "See a doctor today.",
            text: "Book on WhatsApp and we will hold a slot for you, or simply walk in.",
            cta: "Book a visit",
          },
          footer: {
            brand: "Arogya Clinic",
            about: "A family clinic with its own lab and pharmacy.",
            address: ["Plot 21, Hitech City Road", "Hyderabad 500081"],
            contact: ["care@arogyaclinic.in", "Open 8am to 9pm, all week"],
          },
        }}
      />
    </div>
  );
}
