import gsap from "gsap";

export function initArcPathSlider() {
  const items = gsap.utils.toArray(".arc-item");
  const path = document.querySelector("#arcPath");

  if (!items.length || !path) return;

  const TOTAL = items.length;
  const VISIBLE = 5;
  const CENTER_OFFSET = Math.floor(VISIBLE / 2);
  const pathLength = path.getTotalLength();

  const AUTO_DELAY = 3000; // ⏱ autoplay time (ms)

  let activeIndex = 0;
  let autoTimer = null;

  const ARC_START = 0.15;
  const ARC_END = 0.85;
  const STEP = (ARC_END - ARC_START) / (VISIBLE - 1);

  function layout(index) {
    items.forEach((item, i) => {
      let offset = i - index;

      // Infinite loop correction
      if (offset > TOTAL / 2) offset -= TOTAL;
      if (offset < -TOTAL / 2) offset += TOTAL;

      // Hide items outside visible window
      if (offset < -CENTER_OFFSET || offset > CENTER_OFFSET) {
        gsap.to(item, {
          opacity: 0,
          scale: 0.8,
          pointerEvents: "none",
          duration: 0.3,
          overwrite: "auto"
        });
        return;
      }

      // Map visible items to arc slots
      const slot = offset + CENTER_OFFSET;
      const progress = ARC_START + STEP * slot;
      const point = path.getPointAtLength(progress * pathLength);

      gsap.to(item, {
        x: point.x,
        y: point.y,
        xPercent: -20,
        yPercent: -50,
        opacity: 1,
        scale: offset === 0 ? 1.25 : 1,
        pointerEvents: "auto",
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });

      item.classList.toggle("active", offset === 0);
    });
  }

  /* AUTOPLAY ONLY */
  function startAutoplay() {
    stopAutoplay();
    autoTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % TOTAL;
      layout(activeIndex);
    }, AUTO_DELAY);
  }

  function stopAutoplay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* INITIAL */
  layout(activeIndex);
  startAutoplay();

  /* Resize safety */
  window.addEventListener("resize", () => {
    layout(activeIndex);
  });
}
