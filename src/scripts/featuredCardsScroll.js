import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedCardsScroll() {
  const cards = document.querySelectorAll(".card-block");

  if (!cards.length) {
    console.warn("No cards found");
    return;
  }

  const cardsTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".cards-grid-area",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  cards.forEach((card) => {
    cardsTl.from(card, {
      opacity: 0,
      y: -80,
      duration: 0.8,
      ease: "power3.out",
    });
  });
}
