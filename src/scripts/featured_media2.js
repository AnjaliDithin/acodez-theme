import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedMedia() {
  const section = document.querySelector(".featured_media-sec");
  if (!section) return;

  const center = section.querySelector(".media_listmain");

  const items = gsap.utils.toArray(
    ".featured_media-sec .media_list"
  );

  console.log("media items found:", items.length); // MUST be 3

  // start stacked
  gsap.set(items, { x: 0, force3D: true });
  gsap.set(center, { autoAlpha: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: true,
    },
  });

  // HOLD
  tl.to({}, { duration: 0.2 });

  // SPLIT IN X (ALL 3 GUARANTEED)
  tl.to(items[0], { x: "-40vw", ease: "none" }, 0.2);
  tl.to(items[1], { x: "40vw",  ease: "none" }, 0.2);
  tl.to(items[2], { x: "20vw",  ease: "none" }, 0.2);
}
