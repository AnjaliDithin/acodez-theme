import gsap from "gsap";

export default function heroCrossfade() {
  const images = gsap.utils.toArray(".cross-fade-wrap .images-wrap img");

  if (!images.length) return;

  // Hide all images first
  gsap.set(images, { autoAlpha: 0 });
  
  // Always show first image
  gsap.set(images[0], { autoAlpha: 1 });

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1
  });

  images.forEach((img, i) => {
    const next = images[(i + 1) % images.length];

    tl.to(img, { autoAlpha: 0, duration: 1 })
      .to(next, { autoAlpha: 1, duration: 1 }, "<");
  });
}
