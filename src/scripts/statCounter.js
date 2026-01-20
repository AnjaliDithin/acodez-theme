import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initStatCounter(container) {
  if (!container) return;

  const section = container.classList.contains("stats-highlight-section")
    ? container
    : container.closest(".stats-highlight-section");

  if (!section) return;

  const counters = section.querySelectorAll(".stat-value");
  if (!counters.length) return;

  console.log("StatCounter: Initializing for", counters.length, "elements in", section);

  // Setup proxies for each counter. 
  // We DO NOT set textContent to 0 here so the default values in HTML stay visible.
  counters.forEach(counter => {
    counter._gsapProxy = { value: 0 };
  });

  const animate = () => {
    console.log("StatCounter: Starting Animation");
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count, 10) || 0;
      const suffix = counter.dataset.suffix || "";

      gsap.fromTo(counter._gsapProxy,
        { value: 0 },
        {
          value: target,
          duration: 2,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => {
            counter.textContent = Math.floor(counter._gsapProxy.value) + suffix;
          },
          onComplete: () => {
            counter.textContent = target + suffix;
          }
        }
      );
    });
  };

  const reset = () => {
    counters.forEach(counter => {
      const suffix = counter.dataset.suffix || "";
      gsap.killTweensOf(counter._gsapProxy);
      counter._gsapProxy.value = 0;
      counter.textContent = `0${suffix}`;
    });
  };

  // Small delay for Astro/Vite mount stability
  setTimeout(() => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: animate,
      onEnterBack: animate,
      onLeave: reset,
      onLeaveBack: reset,
      once: false,
    });

    ScrollTrigger.refresh();
    console.log("StatCounter: Ready and Refreshed");
  }, 200);
}
