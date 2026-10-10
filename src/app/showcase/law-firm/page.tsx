import { permanentRedirect } from "next/navigation";

/** The first link sent for the law firm site, now the story template. */
export default function LawFirmShowcase() {
  permanentRedirect("/showcase/deeds-and-co/story");
}
