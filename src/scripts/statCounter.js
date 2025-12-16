import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initStatCounter() {
  const counters = document.querySelectorAll(".stat-value");

  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.count, 10);
    const suffix = counter.dataset.suffix || "";

    let tl = gsap.timeline({
      repeat: -1,              // 🔁 infinite loop
      repeatDelay: 0.6,
      paused: true,            // start paused
    });

    tl.fromTo(
      counter,
      { innerText: 0 },
      {
        innerText: target,
        duration: 1.6,
        ease: "power3.out",
        snap: { innerText: 1 },
        onUpdate: () => {
          counter.innerText = Math.floor(counter.innerText);
        },
        onComplete: () => {
          counter.innerText = target + suffix;
        },
      }
    );

    ScrollTrigger.create({
      trigger: counter.closest(".stats-highlight-section"),
      start: "top 70%",
      end: "bottom 30%",

      onEnter: () => tl.play(),
      onEnterBack: () => tl.play(),

      onLeave: () => tl.pause(),
      onLeaveBack: () => tl.pause(),
    });
  });
}
