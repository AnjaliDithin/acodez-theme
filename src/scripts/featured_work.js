import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedWorks() {
  const section = document.querySelector(".featured-work-sec");
  const title = section?.querySelector(".heading-text");
  const cards = gsap.utils.toArray(".card-block");

  if (!section || !title || !cards.length) return;

  // 🔒 Kill only triggers inside this section
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger && st.trigger.closest(".featured-work-sec")) {
      st.kill();
    }
  });

  const getTextWidth = () => title.offsetWidth;
  const cardHeight = cards[0].offsetHeight;
  const TOP_GAP = 100;


  gsap.set(title, {
    x: () => window.innerWidth / 2 + getTextWidth() / 2,
    force3D: true,
  });

  cards.forEach(card => {
    gsap.set(card, {
      y: window.innerHeight * 0.6,
      scale: 1,
      opacity: 0,
      force3D: true,
    });
  });


  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + (window.innerHeight + cards.length * cardHeight),
      scrub: 1.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });


  tl.to(title, {
    x: () => -getTextWidth() / 2,
    ease: "none",
    duration: 1,
  });


cards.forEach((card, i) => {
  const scaleValue = 1 - (cards.length - i) * 0.025;
  const finalY =
    -window.innerHeight * 0.6 +
    (TOP_GAP - i * cardHeight);

  // 1️⃣ Move + stack card
  tl.to(
    card,
    {
      y: finalY,
      scale: scaleValue,
      opacity: 1,
      ease: "none",
      duration: 0.6,
    },
    ">+=0.15"
  );

  tl.add(() => {
    cards.forEach(c => {
      c.classList.remove("is-active");
      gsap.set(c, { opacity: 0 });
    });

    card.classList.add("is-active");
    gsap.set(card, { opacity: 1 });
  }, ">");
});

}
