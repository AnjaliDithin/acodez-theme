import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedWorks() {
  const section = document.querySelector(".featured-work-sec");
  const title = section?.querySelector(".heading-text");

  if (!section || !title) return;

  // Measure AFTER fonts/layout are ready
  const getTextWidth = () => title.offsetWidth;

  gsap.set(title, {
    x: () => window.innerWidth / 2 + getTextWidth() / 2,
    force3D: true,
    willChange: "transform",
  });

  gsap.to(title, {
    x: () => -getTextWidth() / 2,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=1200",          // give more scroll room
      scrub: 1.8,             // smooth scrub
      pin: true,
      anticipatePin: 1,       // 🔥 reduces pin flicker
      invalidateOnRefresh: true,
      fastScrollEnd: false,
    },
  });
}
