// One place that registers GSAP plugins. Import gsap, ScrollTrigger and useGSAP from here
// (never straight from "gsap") so registration happens once. Client components only.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
