
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

      gsap.set(main, { backgroundColor: currentBg });

     function applyColor(nextColor) {
        if (currentBg === nextColor) return;

        gsap.killTweensOf(main);
        gsap.set(main, { backgroundColor: currentBg });

        gsap.to(main, {
          backgroundColor: nextColor,
          duration: 1.4,
          ease: "power3.out",
          overwrite: true,
          onComplete: () => {
            // console.log(
            //   "BG FINAL:",
            //   nextColor,
            //   "→",
            //   getComputedStyle(main).backgroundColor
            // );
          }
        });

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

