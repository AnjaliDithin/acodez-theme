
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initScrollAccordion() {
  if (typeof window === "undefined") return;
  if (window.__accordionPinnedInit) return;

  const wrapper = document.querySelector(".service-accordion-area");
  const items = [...document.querySelectorAll(".scroll-block")];
  if (!wrapper || !items.length) return;

  window.__accordionPinnedInit = true;

  const accordionItems = {};
  const contents = {};
  const images = {};

  items.forEach(item => {
    const idx = Number(item.dataset.index);
    if (!Number.isNaN(idx)) {
      accordionItems[idx] = item;
      contents[idx] = item.querySelector(".text__wrapper") || item.querySelector(".scroll-bttom-row");
      images[idx] = item.querySelector(".featured-img");
    }
  });

  const indexes = Object.keys(accordionItems).map(Number).sort((a, b) => a - b);
  const total = indexes.length;
  let lastOpened = -1;

  function openAccordion(index, force = false) {
    if (!contents[index]) return;
    if (index === lastOpened && !force) return;

    lastOpened = index;

    indexes.forEach(i => {
      const c = contents[i];
      const img = images[i];
      const item = accordionItems[i];
      if (!c) return;

      gsap.killTweensOf(c);
      if (img) gsap.killTweensOf(img);

      if (i === index) {
        // Active item: show it
        item.style.zIndex = "2";
        item.style.visibility = "visible";
        c.style.visibility = "visible";

        gsap.to(c, {
          opacity: 1,
          duration: 0.6,
          ease: "power3.out"
        });

        if (img) {
          gsap.to(img, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        }
      } else {
        // Reset non-active items
        item.style.zIndex = "1";

        gsap.to(c, {
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            if (lastOpened !== i) {
              c.style.visibility = "hidden";
              item.style.visibility = "hidden";
            }
          }
        });

        if (img) {
          gsap.to(img, {
            opacity: 0,
            scale: 0.95,
            y: 30,
            duration: 0.4,
            ease: "power2.inOut"
          });
        }
      }
    });
  }

  // Initial state for all items
  indexes.forEach(i => {
    const c = contents[i];
    const img = images[i];
    const item = accordionItems[i];
    if (!c) return;

    // Hide everything initially
    c.style.opacity = "0";
    c.style.visibility = "hidden";
    item.style.visibility = "hidden";

    if (img) {
      gsap.set(img, { opacity: 0, scale: 0.95, y: 30 });
    }
  });

  // Open the first item by default
  openAccordion(indexes[0], true);

  // Core ScrollTrigger: Pins the whole area and cycles through indices
  ScrollTrigger.create({
    trigger: wrapper,
    start: "top-=100p",
    end: () => `+=${window.innerHeight * 1}`, // Control the scroll distance here
    pin: true,
    pinSpacing: true,
    scrub: 1,
    anticipatePin: 1,
    invalidateOnRefresh: true,

    onUpdate: self => {
      // Calculate active index based on scroll progress
      const index = Math.min(
        total - 1,
        Math.floor(self.progress * total)
      );
      if (index >= 0) {
        openAccordion(indexes[index]);
      }
    }
  });

  // Handle window events
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
    if (lastOpened !== -1) openAccordion(lastOpened, true);
  });
}






