import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initSplittext() {
  const elements = document.querySelectorAll(
    "[scrub-each-word], [opacity-text]"
  );

  if (!elements.length) return;

  elements.forEach((el) => {
    // Kill only triggers related to this element
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === el) st.kill();
    });

    gsap.fromTo(
      el,
      { opacity: 0.2 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 20%",
          scrub: true,
        },
      }
    );
  });

  ScrollTrigger.refresh();
}
