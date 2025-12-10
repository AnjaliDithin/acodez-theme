import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function GsapBgChange() {
  useEffect(() => {
    console.log("✅ GsapBgChange mounted");

    gsap.registerPlugin(ScrollTrigger);

    // ✅ HARD WAIT to ensure Astro DOM is fully rendered
    setTimeout(() => {
      // support both common spellings used in the project
      const sections = document.querySelectorAll(".bg-change, .bg-chnge");
      const main = document.querySelector("main");

      console.log("✅ main found:", !!main);
      console.log("✅ bg-change count:", sections.length);

      if (!main || !sections.length) {
        console.error("❌ main OR sections not found. GSAP stopped.");
        return;
      }
      const firstColor = sections[0] && sections[0].getAttribute("data-color");
      if (firstColor) {
        gsap.set(main, { backgroundColor: firstColor });
      }

      sections.forEach((section, i) => {
        const next = sections[i + 1];
        const currentColor = section.getAttribute("data-color");
        if (!next) return; // nothing after the last section

        const nextColor = next.getAttribute("data-color");
        if (!nextColor) return;

        console.log(`✅ create trigger for next section ${i + 1} color:`, nextColor);

        ScrollTrigger.create({
          trigger: next,
          start: "top 60%",
          end: "bottom 60%",

          onEnter: () => {
            gsap.to(main, {
              backgroundColor: nextColor,
              duration: 1.2,
              ease: "power2.out",
            });
          },

          onLeaveBack: () => {
            gsap.to(main, {
              backgroundColor: currentColor || firstColor || "#ffffff",
              duration: 1.2,
              ease: "power2.out",
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}
