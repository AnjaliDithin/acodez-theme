import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initGsapCardSlider({
  autoplay = true,
  autoplayDuration = 8,
  mfInstance = null
} = {}) {
  const section = document.querySelector("#horizontal-Projectscroll");
  const track = section?.querySelector(".col3Projectslider .Projects-slidertrack");

  if (!section || !track) return;

  gsap.set(track, { force3D: true });

  const getScrollAmount = () =>
    track.scrollWidth - window.innerWidth;

  // 🔹 SCROLLTRIGGER
  const st = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${getScrollAmount()}`,
    pin: true,
    onUpdate: (self) => {
      gsap.set(track, { x: -getScrollAmount() * self.progress });
    },
    invalidateOnRefresh: true
  });

  // 🔹 AUTOPLAY (animate ScrollTrigger progress)
  let autoTween;

  function startAutoplay() {
    if (!autoplay) return;

    autoTween?.kill();
    autoTween = gsap.to(track, {
      x: -getScrollAmount(),
      duration: autoplayDuration,
      ease: "none",
      onComplete: () => {
        gsap.set(track, { x: 0 });
        startAutoplay();
      }
    });
  }

  function stopAutoplay() {
    autoTween?.kill();
    autoTween = null;
  }

  // 🔹 Pause autoplay while user scrolls
  ScrollTrigger.addEventListener("scrollStart", stopAutoplay);
  ScrollTrigger.addEventListener("scrollEnd", startAutoplay);

  if (autoplay) startAutoplay();

  // 🔹 Resize safety
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

  // Function to convert hex to rgba
  function hexToRgba(hex) {
    hex = hex.replace('#', '');
    let r, g, b, a = 1;
    if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = parseInt(hex.slice(6, 8), 16) / 255;
    }
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // Add hover listeners for cursor color change
  if (mfInstance) {
    const items = track.querySelectorAll('.slider-item');
    const cursor = document.querySelector('.mf-cursor');
    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        const color = item.dataset.color;
        if (color && cursor) {
          cursor.style.backgroundColor = hexToRgba(color);
        }
      });
      item.addEventListener('mouseleave', () => {
        if (cursor) {
          cursor.style.backgroundColor = '';
        }
      });
    });
  }

  return {
    play: startAutoplay,
    pause: stopAutoplay
  };
}
