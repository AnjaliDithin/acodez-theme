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

    // 🛡️ Isolated Cleanup - Only kill triggers for this section
    const oldTrigger = ScrollTrigger.getById("stats-trigger");
    if (oldTrigger) oldTrigger.kill();

    const animate = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10) || 0;
            const suffix = counter.dataset.suffix || "";
            const obj = { value: 0 };

            gsap.to(obj, {
                value: target,
                duration: 2,
                ease: "power2.out",
                overwrite: true,
                onUpdate: () => {
                    counter.textContent = Math.floor(obj.value) + suffix;
                },
                onComplete: () => {
                    counter.textContent = target + suffix;
                }
            });
        });
    };

    const reset = () => {
        counters.forEach(counter => {
            const suffix = counter.dataset.suffix || "";
            counter.textContent = "0" + suffix;
        });
    };

    // 🏗️ Safe Trigger Setup
    // We use refreshPriority: 0 so it calculates AFTER the pinned media section above (which is priority 10).
    // This prevents the sections from overlapping.
    ScrollTrigger.create({
        trigger: section,
        start: "top 90%",
        end: "bottom 10%",
        id: "stats-trigger",
        onEnter: animate,
        onEnterBack: animate,
        onLeave: reset,
        onLeaveBack: reset,
        invalidateOnRefresh: true,
        refreshPriority: 0,
    });
}