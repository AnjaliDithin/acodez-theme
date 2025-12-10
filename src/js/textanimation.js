import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initTextAnimation() {
  const left = document.querySelector(".floating-text .left");
  const right = document.querySelector(".floating-text .right");

  // ✅ Safety check for pages without this section
  if (!left || !right) return;

  // ✅ LEFT TEXT → Slide + Fade
  gsap.fromTo(
    left,
    { x: -120, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".floating-text",
        start: "top 80%",
        toggleActions: "play none none reset", // ✅ REPEAT ON SCROLL UP
        invalidateOnRefresh: true,
      },
    }
  );

  // ✅ RIGHT TEXT → Slide + Fade
  gsap.fromTo(
    right,
    { x: 120, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.2,
      delay: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".floating-text",
        start: "top 80%",
        toggleActions: "play none none reset", // ✅ REPEAT ON SCROLL UP
        invalidateOnRefresh: true,
      },
    }
  );
}
