"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { AgencyMarqueeMagnetic } from "./heroes/AgencyMarqueeMagnetic";
import { AgencyRollingWords } from "./heroes/AgencyRollingWords";
import { AiOrbitNetwork } from "./heroes/AiOrbitNetwork";
import { AiTypingPrompt } from "./heroes/AiTypingPrompt";
import { ClinicCareSite } from "./heroes/ClinicCareSite";
import { CommerceCitySite } from "./heroes/CommerceCitySite";
import { DeedsJourneySite } from "./heroes/DeedsJourneySite";
import { EcommerceColourPicker } from "./heroes/EcommerceColourPicker";
import { EcommerceMaskReveal } from "./heroes/EcommerceMaskReveal";
import { EducationCountUp } from "./heroes/EducationCountUp";
import { EducationLearningPath } from "./heroes/EducationLearningPath";
import { FintechCardFan } from "./heroes/FintechCardFan";
import { FintechLiveChart } from "./heroes/FintechLiveChart";
import { HealthBreathing } from "./heroes/HealthBreathing";
import { HealthHeartbeat } from "./heroes/HealthHeartbeat";
import { KitchenTasteSite } from "./heroes/KitchenTasteSite";
import { LawOfficeScrollSite } from "./heroes/LawOfficeScrollSite";
import { LawPropertyVerification } from "./heroes/LawPropertyVerification";
import { SaasAuroraDashboard } from "./heroes/SaasAuroraDashboard";
import { ScrollCardToPhone } from "./heroes/ScrollCardToPhone";
import { ScrollStickyFeatures } from "./heroes/ScrollStickyFeatures";
import { ScrollWordFill } from "./heroes/ScrollWordFill";
import { SaasSpotlightGrid } from "./heroes/SaasSpotlightGrid";
import { TravelGalleryLanding } from "./heroes/TravelGalleryLanding";
import { TravelParallaxZoom } from "./heroes/TravelParallaxZoom";

/*
 * The 3D heroes load on demand and only in the browser: three.js is most of
 * a megabyte, and WebGL has nothing to draw on the server. Everything else
 * is small enough to import outright.
 */
const CinematicVoxelCity = dynamic(
  () => import("./heroes/CinematicVoxelCity").then((m) => m.CinematicVoxelCity),
  { ssr: false },
);
const CinematicShieldCore = dynamic(
  () =>
    import("./heroes/CinematicShieldCore").then((m) => m.CinematicShieldCore),
  { ssr: false },
);
const CinematicDataGlobe = dynamic(
  () => import("./heroes/CinematicDataGlobe").then((m) => m.CinematicDataGlobe),
  { ssr: false },
);
const LawFirmScrollSite = dynamic(
  () => import("./heroes/LawFirmScrollSite").then((m) => m.LawFirmScrollSite),
  { ssr: false },
);
const CinematicFloatingCard = dynamic(
  () =>
    import("./heroes/CinematicFloatingCard").then(
      (m) => m.CinematicFloatingCard,
    ),
  { ssr: false },
);

/**
 * Each entry in the Animations catalogue (src/lib/content/animations.ts),
 * by id, to the component that draws it. Kept apart from the catalogue so
 * the server page can list and read the files without pulling these in.
 */
export const HEROES: Record<string, ComponentType> = {
  "cinematic-voxel-city": CinematicVoxelCity,
  "cinematic-shield-core": CinematicShieldCore,
  "cinematic-data-globe": CinematicDataGlobe,
  "cinematic-floating-card": CinematicFloatingCard,
  "scroll-word-fill": ScrollWordFill,
  "scroll-card-to-phone": ScrollCardToPhone,
  "scroll-sticky-features": ScrollStickyFeatures,
  "saas-aurora-dashboard": SaasAuroraDashboard,
  "saas-spotlight-grid": SaasSpotlightGrid,
  "ai-typing-prompt": AiTypingPrompt,
  "ai-orbit-network": AiOrbitNetwork,
  "ecommerce-mask-reveal": EcommerceMaskReveal,
  "ecommerce-colour-picker": EcommerceColourPicker,
  "agency-rolling-words": AgencyRollingWords,
  "agency-marquee-magnetic": AgencyMarqueeMagnetic,
  "education-count-up": EducationCountUp,
  "education-learning-path": EducationLearningPath,
  "fintech-live-chart": FintechLiveChart,
  "fintech-card-fan": FintechCardFan,
  "health-breathing": HealthBreathing,
  "health-heartbeat": HealthHeartbeat,
  "travel-parallax-zoom": TravelParallaxZoom,
  "travel-gallery-landing": TravelGalleryLanding,
  "clinic-care-site": ClinicCareSite,
  "commerce-city-site": CommerceCitySite,
  "kitchen-taste-site": KitchenTasteSite,
  "deeds-journey-site": DeedsJourneySite,
  "law-office-scroll-site": LawOfficeScrollSite,
  "law-firm-scroll-site": LawFirmScrollSite,
  "law-property-verification": LawPropertyVerification,
};
