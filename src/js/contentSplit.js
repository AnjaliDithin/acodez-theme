import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initReveal(scope = document) {

  /* -----------------------------
     TEXT (fade-up, light)
  ----------------------------- */
  gsap.utils.toArray(scope.querySelectorAll(".reveal")).forEach((el) => {
    gsap.fromTo(
      el,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 75%",
          scrub: 0.15,              // ✅ smooth sync
        },
      }
    );
  });

  /* -----------------------------
     IMAGE ZOOM (SMOOTH, NO LAG)
  ----------------------------- */
  gsap.utils.toArray(scope.querySelectorAll(".zoom-img")).forEach((wrap) => {
    const img = wrap.querySelector("img");
    if (!img) return;

    gsap.fromTo(
      img,
      { scale: 1.12, force3D: true },
      {
        scale: 1,
        ease: "none",             // ✅ IMPORTANT
        scrollTrigger: {
          trigger: wrap,
          start: "top 85%",
          end: "bottom 30%",
          scrub: true,            // ✅ smooth parallax feel
          invalidateOnRefresh: true,
        },
      }
    );
  });
}
