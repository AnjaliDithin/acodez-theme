import gsap from "gsap";

export function initImageTrail() {
  const section = document.querySelector(".cta-section-main");
  const trail = document.querySelector(".cta-section .interaction_trail");

  if (!section || !trail) return;

  const list = trail.querySelector(".interaction_list");
  const sources = [...trail.querySelectorAll(".interaction_item img")];

  if (!list || !sources.length) return;

  // Hide source images
  sources.forEach(img => (img.style.display = "none"));

  let index = 0;
  let lastX = 0;
  let lastY = 0;
  const threshold = 60;

  const getNextSrc = () => {
    index = (index + 1) % sources.length;
    return sources[index].src;
  };

  section.addEventListener("mousemove", (e) => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist < threshold) return;

    lastX = x;
    lastY = y;

    const item = document.createElement("div");
    item.className = "interaction_item";

    const img = document.createElement("img");
    img.className = "image-trail-img";
    img.src = getNextSrc();

    item.appendChild(img);
    list.appendChild(item);

    gsap.set(item, {
      x: x - img.width / 2,
      y: y - img.height / 2,
      opacity: 0
    });

    gsap.timeline({
      onComplete: () => item.remove()
    })
    .to(item, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out"
    })
    .to(item, {
      x: x + gsap.utils.random(-20, 20),
      y: y + gsap.utils.random(-20, 20),
      duration: 0.6,
      ease: "expo.out"
    }, "<")
    .to(img, {
      opacity: 0,
      scale: 0.6,
      duration: 0.4,
      ease: "power2.out"
    }, 0.3);
  });
}
