import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedWorks() {
  const section = document.querySelector(".heading-layer");
  if (!section) return;

  const title = section.querySelector(".heading-text");
  const bg = section.querySelector(".spacing-layer1");
  const overlay = section.querySelector(".spacing-layer2");

  if (!title || !bg) return;

  /* ------------------------------------
     CALCULATE POSITIONS ONCE
  ------------------------------------ */
  const startX = window.innerWidth + title.offsetWidth;
  const endX = -title.offsetWidth * 0.8;
  const bgStartX = window.innerWidth;

  /* ------------------------------------
     GPU LOCK
  ------------------------------------ */
  gsap.set([title, bg], {
    force3D: true,
    willChange: "transform",
  });

  gsap.set(overlay, { opacity: 0 });

  /* ------------------------------------
     TIMELINE (SYNCED)
  ------------------------------------ */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
    //   end: "bottom bottom",
       end: "+=1300",
      pin: true,
      pinType: "fixed",
      scrub: 1.5,
      anticipatePin: 1,
      fastScrollEnd: true,
    },
  });


  tl.fromTo(
    bg,
    { x: bgStartX },
    {
      x: 0,
      duration: 1,
      ease: "none",     
    },
    0
  );

  tl.fromTo(
    title,
    { x: startX },
    {
      x: endX,
      duration: 1,
      ease: "none",     
    },
    0
  );


  tl.to(
    overlay,
    {
      opacity: 1,
      duration: 0.2,
      ease: "none",
    },
    0
  );
}
