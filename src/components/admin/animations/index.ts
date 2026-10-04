import type { ComponentType } from "react";
import { AgencyMarqueeMagnetic } from "./heroes/AgencyMarqueeMagnetic";
import { AgencyRollingWords } from "./heroes/AgencyRollingWords";
import { AiOrbitNetwork } from "./heroes/AiOrbitNetwork";
import { AiTypingPrompt } from "./heroes/AiTypingPrompt";
import { EcommerceColourPicker } from "./heroes/EcommerceColourPicker";
import { EcommerceMaskReveal } from "./heroes/EcommerceMaskReveal";
import { EducationCountUp } from "./heroes/EducationCountUp";
import { EducationLearningPath } from "./heroes/EducationLearningPath";
import { FintechCardFan } from "./heroes/FintechCardFan";
import { FintechLiveChart } from "./heroes/FintechLiveChart";
import { HealthBreathing } from "./heroes/HealthBreathing";
import { HealthHeartbeat } from "./heroes/HealthHeartbeat";
import { SaasAuroraDashboard } from "./heroes/SaasAuroraDashboard";
import { SaasSpotlightGrid } from "./heroes/SaasSpotlightGrid";
import { TravelGalleryLanding } from "./heroes/TravelGalleryLanding";
import { TravelParallaxZoom } from "./heroes/TravelParallaxZoom";

/**
 * Each entry in the Animations catalogue (src/lib/content/animations.ts),
 * by id, to the component that draws it. Kept apart from the catalogue so
 * the server page can list and read the files without pulling these in.
 */
export const HEROES: Record<string, ComponentType> = {
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
};
