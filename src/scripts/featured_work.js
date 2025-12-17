import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedWorks() {
  const section = document.querySelector(".featured-work-sec .featured-area");
  const title = section?.querySelector(".heading-text");
  const cards = gsap.utils.toArray(".card-block");

  if (!section || !title) return;

  const startX = window.innerWidth;
  const endX = -title.offsetWidth * 0.8;

  // Initial text position
  gsap.set(title, {
    x: startX,
    force3D: true,
    willChange: "transform",
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=1500",        // controls how long section stays fixed
      pin: true,
      pinType: "fixed",            // ✅ section becomes fixed
      scrub: 1.5,
      anticipatePin: 1,
      fastScrollEnd: true,
    },
  })
  .to(title, {
    x: endX,
    ease: "none",
    duration: 1,
  });
   cards.forEach((card, i) => {
    gsap.to(card, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: `top+=${textScroll + i * cardScroll} top`,
        end: `top+=${textScroll + (i + 1) * cardScroll} top`,
        scrub: true,
      },
    });
  });
}
