import gsap from "gsap";
import Swiper from "swiper";
import "swiper/css";

export function initArcSliderResponsive() {
  if (typeof window === "undefined") return;

  const isDesktop = () => window.innerWidth >= 768;
  const isMobile = () => window.innerWidth < 768;

  let mobileSwiper = null;
  let arcRunning = false;
  let stopArc = null;

  /* ================= DESKTOP: GSAP ARC ================= */
  function initArcSlider() {
    if (!isDesktop() || arcRunning) return;

    const items = gsap.utils.toArray(".arc-track .arc-item");
    const path = document.querySelector("#arcPath");
    const container = document.querySelector(".arc-container");

    if (!items.length || !path) return;

    arcRunning = true;

    const TOTAL = items.length;
    const VISIBLE = 5;
    const CENTER = Math.floor(VISIBLE / 2);
    const ARC_START = 0.1;
    const ARC_END = 0.9;
    const SLOT_GAP = (ARC_END - ARC_START) / (VISIBLE - 1);
    const pathLength = path.getTotalLength();

    let offset = 0;
    const speed = 0.01;
    let paused = false;

    gsap.set(items, {
      position: "absolute",
      xPercent: -50,
      yPercent: -50,
      willChange: "transform",
    });

    function render() {
      if (paused) return;
      offset += speed;

      items.forEach((item, i) => {
        let d = i - offset;
        d = ((d % TOTAL) + TOTAL) % TOTAL;
        if (d > TOTAL / 2) d -= TOTAL;

        if (Math.abs(d) > CENTER + 0.5) {
          item.style.visibility = "hidden";
          return;
        }

        const slot = Math.floor(d + 0.5) + CENTER;
        const point = path.getPointAtLength(
          (ARC_START + slot * SLOT_GAP) * pathLength
        );

        gsap.set(item, {
          x: point.x,
          y: point.y,
          scale: Math.abs(d) < 0.5 ? 1.25 : 1,
          visibility: "visible",
          zIndex: 10 - Math.abs(d),
        });
      });
    }

    gsap.ticker.add(render);

    if (container) {
      container.addEventListener("mouseenter", () => (paused = true));
      container.addEventListener("mouseleave", () => (paused = false));
    }

    return () => {
      gsap.ticker.remove(render);
      arcRunning = false;
    };
  }

  /* ================= MOBILE: SWIPER ================= */
  function initMobileSwiper() {
    if (!isMobile() || mobileSwiper) return;

    const el = document.querySelector(".arc-trackmobile");
    if (!el) return;

    mobileSwiper = new Swiper(el, {
      slidesPerView: 2,
      spaceBetween: 20,
      speed: 1000,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 3 },
      },
    });
  }

  function destroyMobileSwiper() {
    if (mobileSwiper) {
      mobileSwiper.destroy(true, true);
      mobileSwiper = null;
    }
  }

  function handleResize() {
    if (isDesktop()) {
      destroyMobileSwiper();
      if (!stopArc) stopArc = initArcSlider();
    } else {
      if (stopArc) {
        stopArc();
        stopArc = null;
      }
      initMobileSwiper();
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);
}
