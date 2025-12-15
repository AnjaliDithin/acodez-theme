// import gsap from "gsap";

// export default function heroCrossfade() {
//   const images = gsap.utils.toArray(".cross-fade-wrap .images-wrap img");

//   if (!images.length) return;

//   // Hide all images first
//   gsap.set(images, { autoAlpha: 0 });
  
//   // Always show first image
//   gsap.set(images[0], { autoAlpha: 1 });

//   const tl = gsap.timeline({
//     repeat: -1,
//     repeatDelay: 1
//   });

//   images.forEach((img, i) => {
//     const next = images[(i + 1) % images.length];

//     tl.to(img, { autoAlpha: 0, duration: 1 })
//       .to(next, { autoAlpha: 1, duration: 1 }, "<");
//   });
// }
// import gsap from "gsap";
// let isInit = false;
// export function initHeroCrossfade({
//   selector = ".js-crossfade",
//   duration = 1,
//   delay = 1.5
// } = {}) {
//   if (isInit) return;
//   isInit = true;

//   const elements = gsap.utils.toArray(selector);
//   if (elements.length < 2) return;

//   gsap.set(elements, {
//     autoAlpha: 0,
//     willChange: "opacity"
//   });

//   gsap.set(elements[0], { autoAlpha: 1 });

//   const tl = gsap.timeline({ 
//     repeat: -1,
//       defaults: { ease: "none" },
//     onRepeat() {
//       this.time(this.time() + 0.01);
//     }

//   });

//   elements.forEach((el, i) => {
//     const next = elements[(i + 1) % elements.length];

//     tl.to({}, { duration: delay })
//       .to(el, { autoAlpha: 0, duration, ease: "power1.out" })
//       .to(next, { autoAlpha: 1, duration, ease: "power1.out" }, "<");
//   });
// }
import gsap from "gsap";

let isInit = false;

export function initHeroCrossfade({
  selector = ".crossfade-layer--animated .js-crossfade",
  duration = 0.5,
  delay = 1.8
} = {}) {
  if (isInit) return;
  isInit = true;

  const items = gsap.utils.toArray(selector);
  if (items.length < 2) return;

  gsap.set(items, { autoAlpha: 0 });

  const tl = gsap.timeline({ repeat: -1 });

  items.forEach((current, i) => {
    const next = items[(i + 1) % items.length];

    tl.to({}, { duration: delay })
      .to(current, { autoAlpha: 0, duration: 0.25 })
      .to(next, { autoAlpha: 1, duration });
  });
}




