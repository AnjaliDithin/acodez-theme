import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// ⚠️ Only if you really have the paid plugin
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initSplittext() {
  const textEl = document.querySelector(".about_text");
  const triggerEl = document.querySelector(".service") || textEl;

  // ✅ Page-safe guard for Astro
  if (!textEl) {
    console.warn("⏭️ SplitText skipped (missing .about_text)");
    return;
  }

  // Kill previous ScrollTriggers attached to this trigger
  ScrollTrigger.getAll().forEach((t) => {
    if (t.trigger === triggerEl) t.kill();
  });

  // Try SplitText; if it fails (not available or runtime error), fall back
  try {
    const split = new SplitText(textEl, { type: "words,chars" });

    gsap.from(split.chars, {
      autoAlpha: 0,
      y: 20,
      stagger: 0.02,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: triggerEl,
        start: "top 70%",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  } catch (err) {
    console.warn("[splittext] SplitText failed, falling back to simple fade:", err);
    // Fallback: animate the whole element so text remains visible and animates on scroll
    gsap.from(textEl, {
      autoAlpha: 0,
      y: 20,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: triggerEl,
        start: "top 70%",
        end: "bottom bottom",
        scrub: 1,
      },
    });
  }
}
