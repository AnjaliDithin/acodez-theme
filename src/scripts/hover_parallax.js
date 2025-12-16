import gsap from "gsap";

export function initHoverParallax() {
  const wrap = document.getElementById("imageHoverWrap");
  if (!wrap) return;

  const boxes = Array.from(wrap.querySelectorAll(".img-box"));
  if (!boxes.length) return;

  let activeIndex = null;
  let wrapRect = null;
  let positions = [];

  function calculatePositions() {
    wrapRect = wrap.getBoundingClientRect();
    positions = boxes.map((box) => {
      const rect = box.getBoundingClientRect();
      return {
        x: rect.left - wrapRect.left,
        y: rect.top - wrapRect.top,
        width: rect.width,
        height: rect.height,
      };
    });
  }

  calculatePositions();
  window.addEventListener("resize", calculatePositions);

  let moveX = null;
  let moveY = null;

  wrap.addEventListener("mousemove", (e) => {
    if (activeIndex === null || !wrapRect || !moveX) return;

    const mouseX = e.clientX - wrapRect.left;
    const mouseY = e.clientY - wrapRect.top;
    const pos = positions[activeIndex];
    if (!pos) return;

    const centerX = pos.x + pos.width / 2;
    const centerY = pos.y + pos.height / 2;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const parallaxX = deltaX * 0.8; // adjust for strength
    const parallaxY = deltaY * 0.8;

    moveX(parallaxX);
    moveY(parallaxY);
    gsap.to(boxes[activeIndex], { scale: 1.05, duration: 0.25, ease: "power3.out" });
  });

  boxes.forEach((box, index) => {
    box.style.transformOrigin = "50% 50%";
    box.style.transition = "none";

    box.addEventListener("pointerenter", () => {
      // reset previous
      if (activeIndex !== null && activeIndex !== index) {
        const prev = boxes[activeIndex];
        gsap.killTweensOf(prev);
        gsap.to(prev, { x: 0, y: 0, scale: 1, duration: 0.45, ease: "power3.out" });
      }

      // set new active
      gsap.killTweensOf(box);
      gsap.set(box, { x: 0, y: 0, scale: 1 });

      activeIndex = index;

      // create quickTo for smooth movement
      moveX = gsap.quickTo(box, "x", { duration: 0.5, ease: "power2.out" });
      moveY = gsap.quickTo(box, "y", { duration: 0.5, ease: "power2.out" });
    });
  });

  wrap.addEventListener("mouseleave", () => {
    if (activeIndex !== null) {
      const box = boxes[activeIndex];
      gsap.killTweensOf(box);
      gsap.to(box, { x: 0, y: 0, scale: 1, duration: 0.45, ease: "power3.out" });
    }
    activeIndex = null;
  });

  // ✅ image load safety
  const imgs = wrap.querySelectorAll("img");
  let loaded = 0;
  imgs.forEach((img) => {
    if (img.complete) loaded++;
    else
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === imgs.length) calculatePositions();
      });
  });

  setTimeout(calculatePositions, 400);
}
