
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initScrollAccordion() {
  if (typeof window === "undefined") return;

  const items = Array.from(document.querySelectorAll(".scroll-accordion"));
  if (!items.length) return;

  const contents = items.map((it) => it.querySelector(".text__wrapper"));
  const images = items.map((it) => it.querySelector(".featured-img"));

  function getNaturalHeight(el) {
    if (!el) return 0;
    const clone = el.cloneNode(true);
    clone.style.height = "auto";
    clone.style.width = el.offsetWidth + "px";
    clone.style.opacity = "0";
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "-1";
    el.parentNode.appendChild(clone);
    const h = clone.offsetHeight;
    clone.remove();
    return h;
  }

  // Initial setup: Items are stacked. JS sets initial heights.
  items.forEach((item, i) => {
    const c = contents[i];
    const img = images[i];
    if (!c) return;

    c.style.overflow = "hidden";

    if (i === 0) {
      gsap.set(c, { height: "auto", opacity: 1, visibility: "visible" });
      item.classList.add("is-active");
      if (img) gsap.set(img, { opacity: 1, scale: 1, y: 0 });
    } else {
      gsap.set(c, { height: 0, opacity: 0, visibility: "hidden" });
      item.classList.remove("is-active");
      if (img) gsap.set(img, { opacity: 0, scale: 0.95, y: 30 });
    }
  });

  let lastIndex = 0;

  function openAccordion(activeIndex, force = false) {
    if (activeIndex === lastIndex && !force) return;
    lastIndex = activeIndex;

    items.forEach((item, i) => {
      const c = contents[i];
      const img = images[i];
      if (!c) return;

      if (i === activeIndex) {
        const targetH = getNaturalHeight(c);
        item.classList.add("is-active");

        gsap.to(c, {
          height: targetH,
          opacity: 1,
          duration: 0.6,
          ease: "power3.inOut",
          overwrite: "auto",
          onStart: () => {
            c.style.visibility = "visible";
          },
          onComplete: () => {
            c.style.height = "auto";
            ScrollTrigger.refresh();
          }
        });

        if (img) {
          gsap.killTweensOf(img);
          gsap.to(img, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        }
      } else {
        item.classList.remove("is-active");
        gsap.to(c, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut",
          overwrite: "auto",
          onComplete: () => {
            c.style.height = "0px";
            c.style.visibility = "hidden";
          }
        });

        if (img) {
          gsap.killTweensOf(img);
          gsap.to(img, { opacity: 0, scale: 0.95, y: 30, duration: 0.4, ease: "power2.inOut", overwrite: "auto" });
        }
      }
    });
  }

  // Interaction Listeners & ScrollTrigger
  items.forEach((item, index) => {
    // 1. CLICK to open
    item.addEventListener("click", () => {
      openAccordion(index);
    });

    // 2. HOVER to open
    item.addEventListener("mouseenter", () => {
      openAccordion(index);
    });

    // 3. SCROLL to open
    ScrollTrigger.create({
      trigger: item,
      start: "top 35%",
      end: "bottom 35%",
      onEnter: () => openAccordion(index),
      onEnterBack: () => openAccordion(index),
      invalidateOnRefresh: true,
    });
  });

  // Handle image loads and resize
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
  window.addEventListener("resize", () => {
    const activeC = contents[lastIndex];
    if (activeC) activeC.style.height = "auto";
    ScrollTrigger.refresh();
  });
}
