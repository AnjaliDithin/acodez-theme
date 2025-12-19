import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

export function initFeaturedMedia() {
  const section = document.querySelector(".featured_media-sec");
  if (!section) return;

  const center = section.querySelector(".media_listmain");
  const items = gsap.utils.toArray(
    section.querySelectorAll(".media_list")
  );

  if (items.length < 3) return;

  /* ----------------------------------
     BASE SETUP
  ---------------------------------- */
  gsap.set(items, {
    x: 0,
    y: 0,
    force3D: true,
    willChange: "transform",
  });

  gsap.set(center, {
    autoAlpha: 1,
    scale: 1,
    filter: "blur(0px)",
    force3D: true,
    willChange: "transform, opacity, filter",
  });

  /* ----------------------------------
     MEDIA ITEM — 1 (LEFT)
  ---------------------------------- */
  gsap.to(items[0], {
    x: "-40vw",
    ease: "none",
    scrollTrigger: {
      trigger: items[0],
      start: "top center",
      end: "bottom top",
      scrub: 0.6,
    },
  });

  /* ----------------------------------
     MEDIA ITEM — 2 (RIGHT)
  ---------------------------------- */
  gsap.to(items[1], {
    x: "40vw",
    ease: "none",
    scrollTrigger: {
      trigger: items[1],
      start: "top center",
      end: "bottom top",
      scrub: 0.6,
    },
  });

  /* ----------------------------------
     MEDIA ITEM — 3 (RIGHT / DOWN)
  ---------------------------------- */
  gsap.to(items[2], {
    x: "20vw",
    y: "30vh",          // remove if X-only needed
    ease: "none",
    scrollTrigger: {
      trigger: items[2],
      start: "top center",
      end: "bottom top",
      scrub: 0.6,
    },
  });

  /* ----------------------------------
     CENTER CONTENT — SUBTLE REACTION
  ---------------------------------- */
  gsap.to(center, {
    scale: 1.05,
    autoAlpha: 0.85,
    filter: "blur(4px)",   // optional (remove if needed)
    ease: "none",
    scrollTrigger: {
      trigger: items[0],   // reacts when first item moves
      start: "top center",
      end: "bottom top",
      scrub: 0.6,
    },
  });
}
