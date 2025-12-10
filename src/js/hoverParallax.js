import gsap from "gsap";

export function initHoverParallax() {
  const wrap = document.getElementById("imageHoverWrap");
  if (!wrap) {
    console.warn("❌ imageHoverWrap not found");
    return;
  }

  const boxes = wrap.querySelectorAll(".img-box");
  if (!boxes.length) {
    console.warn("❌ No .img-box found");
    return;
  }

  let activeIndex = null;
  let wrapRect = null;
  let positions = [];

  // ✅ Store initial positions relative to wrapper
  function calculatePositions() {
    wrapRect = wrap.getBoundingClientRect();
    positions = [];

    boxes.forEach((box) => {
      const rect = box.getBoundingClientRect();
      positions.push({
        x: rect.left - wrapRect.left,
        y: rect.top - wrapRect.top,
        width: rect.width,
        height: rect.height,
      });
    });
  }

  calculatePositions();
  window.addEventListener("resize", calculatePositions);

  // ✅ Mouse move INSIDE wrapper only
  wrap.addEventListener("mousemove", (e) => {
    if (activeIndex === null || !wrapRect) return;

    const mouseX = e.clientX - wrapRect.left;
    const mouseY = e.clientY - wrapRect.top;

    const pos = positions[activeIndex];

    const targetX = mouseX - pos.width / 2 - pos.x;
    const targetY = mouseY - pos.height / 2 - pos.y;

    gsap.to(boxes[activeIndex], {
      x: targetX,
      y: targetY,
      scale: 1.05,
      zIndex: 10,
      duration: 0.35,
      ease: "power3.out",
    });
  });

  // ✅ Handle hover state per image
  boxes.forEach((box, index) => {
    box.addEventListener("mouseenter", () => {
      activeIndex = index;
      wrap.style.cursor = "none";
    });

    box.addEventListener("mouseleave", () => {
      activeIndex = null;
      wrap.style.cursor = "auto";

      gsap.to(box, {
        x: 0,
        y: 0,
        scale: 1,
        zIndex: 1,
        duration: 0.6,
        ease: "power3.out",
      });
    });
  });

  console.log("✅ GSAP Hover Parallax Initialized");
}
