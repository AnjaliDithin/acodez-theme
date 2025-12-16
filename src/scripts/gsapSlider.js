import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export function initGsapSlider() {
  document.querySelectorAll(".slider").forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    const items = slider.querySelectorAll(".slider-item");

    if (!track || !items.length) return;

    let totalWidth = 0;
    items.forEach((item) => {
      totalWidth += item.offsetWidth;
    });

    const viewportWidth = slider.offsetWidth;
    const minX = viewportWidth - totalWidth;
    const maxX = 0;

    gsap.set(track, { x: 0 });

    Draggable.create(track, {
      type: "x",
      bounds: { minX, maxX },
      dragResistance: 0.2,     // 👈 smooth feel
      edgeResistance: 0.85,
      cursor: "grab",
      activeCursor: "grabbing",

      // 👇 smooth release (free GSAP)
      onRelease() {
        gsap.to(track, {
          x: this.x,
          duration: 0.6,
          ease: "power3.out",
        });
      },
    });
  });
}
