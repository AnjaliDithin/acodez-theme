import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initSplittext() {
  console.log("✅ initSplittext() CALLED");

  const elements = document.querySelectorAll("[scrub-each-word], [opacity-text]");
  console.log("✅ Found elements:", elements.length);

  elements.forEach((el, index) => {
    console.log("✅ Processing element", index, el);

    // HARD RESET to test animation visibility
    gsap.killTweensOf(el);
    ScrollTrigger.getAll().forEach(st => st.kill());

    // FORCE VISIBLE FROM LOW OPACITY
    gsap.fromTo(
      el,
      { opacity: 0.2 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 20%",
          scrub: true,
          markers: true // ✅ SHOWS DEBUG MARKERS ON SCREEN
        }
      }
    );
  });

  ScrollTrigger.refresh();
}

