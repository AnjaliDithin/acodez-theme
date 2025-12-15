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

  // ✅ fresh setters created per hover
  let moveX = null;
  let moveY = null;
  let scaleTo = null;

  wrap.addEventListener("mousemove", (e) => {
    if (activeIndex === null || !wrapRect || !moveX) return;

    const mouseX = e.clientX - wrapRect.left;
    const mouseY = e.clientY - wrapRect.top;
    const pos = positions[activeIndex];
    if (!pos) return;

    const targetX = mouseX - pos.width / 2 - pos.x;
    const targetY = mouseY - pos.height / 2 - pos.y;

    moveX(targetX);
    moveY(targetY);
    scaleTo(1.05);
  });

  boxes.forEach((box, index) => {
    box.style.transformOrigin = "50% 50%";
    box.style.transition = "none";

    // ✅ pointerenter is more stable than mouseenter for transforms
    box.addEventListener("pointerenter", () => {
      // ✅ reset previous box safely
      if (activeIndex !== null && activeIndex !== index) {
        const prev = boxes[activeIndex];
        gsap.killTweensOf(prev);
        gsap.set(prev, { x: 0, y: 0, scale: 1, zIndex: 1 });
        prev.style.pointerEvents = "auto";
      }

      // ✅ reset this box
      gsap.killTweensOf(box);
      gsap.set(box, { x: 0, y: 0, scale: 1 });

      activeIndex = index;
      wrap.style.cursor = "none";

      // ✅ disable pointer events ONLY while active (this kills flicker)
      box.style.pointerEvents = "none";

      // ✅ recreate quickTo for this box only
      moveX = gsap.quickTo(box, "x", { duration: 0.35, ease: "power3.out" });
      moveY = gsap.quickTo(box, "y", { duration: 0.35, ease: "power3.out" });
      scaleTo = gsap.quickTo(box, "scale", { duration: 0.25, ease: "power3.out" });

      gsap.set(box, { zIndex: 10 });
    });
  });

  // ✅ reset ONLY when leaving wrapper
  wrap.addEventListener("mouseleave", () => {
    if (activeIndex !== null) {
      const box = boxes[activeIndex];

      gsap.killTweensOf(box);
      gsap.to(box, {
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 1,
        duration: 0.45,
        ease: "power3.out",
      });

      // ✅ restore pointer events AFTER reset
      setTimeout(() => {
        box.style.pointerEvents = "auto";
      }, 50);
    }

    activeIndex = null;
    moveX = moveY = scaleTo = null;
    wrap.style.cursor = "auto";
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
