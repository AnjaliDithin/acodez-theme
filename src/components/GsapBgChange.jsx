import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function GsapBgChange() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const main =
      document.querySelector("main") ||
      document.querySelector("#app") ||
      document.body;

    const sections = gsap.utils.toArray(".bg-change, .bg-chnge");

    if (!sections.length || !main) return;

    const DEFAULT_BG = "#ffffff";
    let currentBg = DEFAULT_BG;

    // Initial background
    gsap.set(main, {
      backgroundColor: DEFAULT_BG,
      backgroundImage: "none",
    });

    function applyBackground(nextBg) {
      if (!nextBg || nextBg === currentBg) return;

      currentBg = nextBg;

      // ✅ If gradient → apply instantly
      if (nextBg.includes("gradient")) {
        gsap.killTweensOf(main);

        gsap.set(main, {
          backgroundImage: nextBg,
          backgroundColor: "transparent",
        });
        return;
      }

      // ✅ Solid color → animate smoothly
      gsap.set(main, { backgroundImage: "none" });

      gsap.to(main, {
        backgroundColor: nextBg,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    function updateBg() {
      const centerY = window.innerHeight / 2;
      let activeSection = null;

      // Pick FIRST section that contains center
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();

        if (rect.top <= centerY && rect.bottom >= centerY) {
          activeSection = sections[i];
          break;
        }
      }

      const nextBg =
        activeSection?.getAttribute("data-color") || DEFAULT_BG;

      applyBackground(nextBg);
    }

    // One global trigger
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: updateBg,
    });

    // Ensure correct background on load & refresh
    ScrollTrigger.addEventListener("refresh", updateBg);

    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
      updateBg();
    });

    // Initial run (SPA safety)
    updateBg();

    return () => {
      ScrollTrigger.removeEventListener("refresh", updateBg);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(main);
    };
  }, []);

  return null;
}
