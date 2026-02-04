import { gsap } from "gsap";
import Swiper from "swiper";

let mobileSwiper = null;
let gsapRenderFn = null;

/* =========================
   MAIN INIT FUNCTION
========================= */
export function initArcSlider() {
  if (typeof window === "undefined") return;

  const initDesktop = () => {
    if (window.innerWidth < 768 || gsapRenderFn) return;

    const items = gsap.utils.toArray(".arc-track .arc-item");
    const path = document.querySelector("#arcPath");
    const container = document.querySelector(".arc-container");

    if (!items.length || !path) return;

    const TOTAL = items.length;
    const VISIBLE = 5;
    const CENTER_IDX = Math.floor(VISIBLE / 2);
    const ARC_START = 0.1;
    const ARC_END = 0.9;
    const ARC_RANGE = ARC_END - ARC_START;
    const SLOT_GAP = ARC_RANGE / (VISIBLE - 1);
    const pathLength = path.getTotalLength();

    let offset = 0;
    const autoSpeed = 0.005;
    let paused = false;

    gsap.set(items, {
      position: "absolute",
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0.5,
      willChange: "transform, opacity",
    });

    gsapRenderFn = () => {
      if (paused) return;
      offset += autoSpeed;

      items.forEach((item, i) => {
        let d = (i - offset) % TOTAL;
        if (d < 0) d += TOTAL;
        if (d > TOTAL / 2) d -= TOTAL;

        const dist = Math.abs(d);
        if (dist > CENTER_IDX + 0.6) {
          item.style.visibility = "hidden";
          item.style.opacity = 0;
          return;
        }

        const arcProgress = ARC_START + (d + CENTER_IDX) * SLOT_GAP;
        const p = Math.max(0, Math.min(1, arcProgress)) * pathLength;
        const point = path.getPointAtLength(p);

        const scale =
          dist < 0.5
            ? gsap.utils.mapRange(0, 0.5, 1.35, 1, dist)
            : 1;

        const opacity = gsap.utils.mapRange(
          CENTER_IDX,
          CENTER_IDX + 0.6,
          1,
          0,
          dist
        );

        gsap.set(item, {
          x: point.x,
          y: point.y,
          scale,
          opacity,
          visibility: "visible",
          zIndex: Math.round(10 - dist),
        });
      });
    };

    gsap.ticker.add(gsapRenderFn);

    container?.addEventListener("mouseenter", () => (paused = true));
    container?.addEventListener("mouseleave", () => (paused = false));
  };

  const destroyDesktop = () => {
    if (gsapRenderFn) {
      gsap.ticker.remove(gsapRenderFn);
      gsapRenderFn = null;
      gsap.set(".arc-track", { clearProps: "all" });
    }
  };

  const initMobile = () => {
    if (window.innerWidth >= 768 || mobileSwiper) return;

    mobileSwiper = new Swiper(".arc-trackmobile", {
      slidesPerView: 2,
      spaceBetween: 20,
      speed: 1000,
      loop: true,
      loopedSlides: 6,
      loopAdditionalSlides: 2,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 3 },
      },
    });
  };

  const destroyMobile = () => {
    if (mobileSwiper) {
      mobileSwiper.destroy(true, true);
      mobileSwiper = null;
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      destroyDesktop();
      initMobile();
    } else {
      destroyMobile();
      initDesktop();
    }
  };

  // INITIAL RUN
  handleResize();

  // LISTEN ONCE
  window.addEventListener("resize", handleResize);
}
