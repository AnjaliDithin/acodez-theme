import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedCardsScroll() {
  const cards = gsap.utils.toArray(".card-block");
  if (!cards.length) return;

  const vh = window.innerHeight;
  const TOP_GAP = 475;     // where the FIRST card stops
  const EXTRA_GAP = 0;    // optional small spacing between cards

  // Measure card height once (assumes equal heights)
  const cardHeight = cards[0].offsetHeight;

  cards.forEach((card, i) => {
    // Start below viewport
    gsap.set(card, {
      y: vh * 0.6,
      opacity: 0,
      force3D: true,
      willChange: "transform, opacity",
    });

    // 🔥 TRUE STACKING: each card fully above the previous
    const finalY =
      -vh * 0.6 +
      (TOP_GAP - i * (cardHeight + EXTRA_GAP));

    gsap.to(card, {
      y: finalY,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "top+=200 top",
        scrub: 1.5,
        invalidateOnRefresh: true,
        fastScrollEnd: false,
      },
    });
  });
}
