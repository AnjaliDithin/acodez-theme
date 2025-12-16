
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function GsapBgChange() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      const sections = document.querySelectorAll(".bg-change, .bg-chnge");
      const main =
        document.querySelector("main") ||
        document.querySelector("#app") ||
        document.body;

      if (!sections.length || !main) return;

      let currentBg = "#ffffff";

      gsap.set(main, { background: currentBg });

     function applyColor(nextColor) {
        if (currentBg === nextColor) return;

        gsap.killTweensOf(main);
        gsap.set(main, { background: currentBg });

        if (nextColor.includes('linear-gradient') || nextColor.includes('radial-gradient')) {
          // Instant change for gradients
          gsap.set(main, { background: nextColor });
        } else {
          // Smooth animation for solid colors
          gsap.to(main, {
            background: nextColor,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true,
          });
        }

        currentBg = nextColor;
      }

      sections.forEach((section, index) => {
        const color = section.getAttribute("data-color");
        if (!color) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",

          onEnter: () => applyColor(color),
          onEnterBack: () => applyColor(color),
          onLeaveBack: () => applyColor("#ffffff"),
        });
      });

      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf("*");
    };
  }, []);

  return null;
}

