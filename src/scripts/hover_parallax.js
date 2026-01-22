import gsap from "gsap";

export function initHoverParallax() {
  const wrap = document.getElementById("imageHoverWrap");
  if (!wrap) return;

  const boxes = Array.from(wrap.querySelectorAll(".img-box"));
  if (!boxes.length) return;

  let activeIndex = null;
  let currentPos = null;
  let moveX = null;
  let moveY = null;

  wrap.addEventListener("mousemove", (e) => {
    if (activeIndex === null || !moveX || !currentPos) return;

    const wrapRect = wrap.getBoundingClientRect();
    const mouseX = e.clientX - wrapRect.left;
    const mouseY = e.clientY - wrapRect.top;

    const centerX = currentPos.x + currentPos.width / 2;
    const centerY = currentPos.y + currentPos.height / 2;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const parallaxX = deltaX * 0.4; // Reduced strength for more stability
    const parallaxY = deltaY * 0.4;

    moveX(parallaxX);
    moveY(parallaxY);
  });

  boxes.forEach((box, index) => {
    box.style.transformOrigin = "50% 50%";

    box.addEventListener("pointerenter", () => {
      // Reset previous
      if (activeIndex !== null && activeIndex !== index) {
        const prev = boxes[activeIndex];
        gsap.killTweensOf(prev);
        gsap.to(prev, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
      }

      activeIndex = index;

      // Calculate position EXACTLY when entering to avoid jumping
      const wrapRect = wrap.getBoundingClientRect();
      const rect = box.getBoundingClientRect();

      // We need the coordinates WITHOUT the current transform to prevent feedback loops
      // So we temporarily clear transform if it exists
      const currentTransform = gsap.getProperty(box, "transform");
      gsap.set(box, { clearProps: "transform" });
      const cleanRect = box.getBoundingClientRect();
      gsap.set(box, { transform: currentTransform });

      currentPos = {
        x: cleanRect.left - wrapRect.left,
        y: cleanRect.top - wrapRect.top,
        width: cleanRect.width,
        height: cleanRect.height
      };

      // Create quickTo for smooth movement
      moveX = gsap.quickTo(box, "x", { duration: 0.5, ease: "power2.out" });
      moveY = gsap.quickTo(box, "y", { duration: 0.5, ease: "power2.out" });

      gsap.to(box, { scale: 1.05, duration: 0.5, ease: "power2.out" });
    });
  });

  wrap.addEventListener("mouseleave", () => {
    if (activeIndex !== null) {
      const box = boxes[activeIndex];
      gsap.killTweensOf(box);
      gsap.to(box, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power2.out" });
    }
    activeIndex = null;
    currentPos = null;
  });
}
