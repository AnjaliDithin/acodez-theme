import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrolltext() {
  const container = document.querySelector(".scrollingText");
  if (!container) return;

  // Clear existing ScrollTriggers for this element if any
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === container) st.kill();
  });

  // Duplicate content for seamless loop
  const content = container.innerHTML;
  container.innerHTML = content + content + content + content; // Add more to be safe

  const items = container.querySelectorAll("span");
  if (!items.length) return;

  // We want to move the container from right to left
  // But wait, .scrollingText is inline-flex. 
  // We should wrap the spans in a track if we want to move them easily,
  // or just move the container if it's placed correctly.

  // Actually, a simpler way is to animate the xPercent of the container
  // assuming it contains repeated elements.

  // Calculate the width of one "unit" (the original content)
  // Since we repeated 4 times, we move until 1/4th of the width

  const setupTicker = () => {
    const totalWidth = container.scrollWidth;
    const singleWidth = totalWidth / 4;

    gsap.set(container, { x: 0 });

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" }
    });

    tl.to(container, {
      x: -singleWidth,
      duration: 15, // Adjust speed here
      onComplete: () => {
        gsap.set(container, { x: 0 });
      }
    });

    // Start/Stop based on scroll visibility
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => tl.play(),
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause()
    });
  };

  // Wait for fonts/layout if needed, though usually DOMContentLoaded is enough
  setupTicker();
}
