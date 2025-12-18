import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedWorks() {
  const section = document.querySelector(".featured-work-sec .featured-area");
  const title = section?.querySelector(".heading-text");
  const cards = gsap.utils.toArray(".card-block");

  if (!section || !title || !cards.length) return;

  /* -------------------------
     CONFIG VALUES (IMPORTANT)
  -------------------------- */
  const textScroll = 400;        // scroll distance for heading
  const cardScroll = 300;        // scroll distance per card
  const totalScroll = textScroll + cards.length * cardScroll;

  /* -------------------------
     INITIAL STATES
  -------------------------- */
  gsap.set(title, {
    x: window.innerWidth,
    force3D: true,
    willChange: "transform",
  });

  gsap.set(cards, {
    y: 80,                       // start lower
    opacity: 0,
  });

  /* -------------------------
     MASTER TIMELINE (PINNED)
  -------------------------- */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: `+=${totalScroll}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
    },
  });

  /* -------------------------
     HEADING SCROLL
  -------------------------- */
  tl.to(title, {
    x: -title.offsetWidth * 0.8,
    ease: "none",
    duration: textScroll,
  });

  /* -------------------------
     CARDS SCROLL ONE BY ONE
  -------------------------- */
  cards.forEach((card, i) => {
    tl.to(
      card,
      {
        y: 0,
        opacity: 1,
        ease: "none",
        duration: cardScroll,
      },
      textScroll + i * cardScroll
    );
  });
}
