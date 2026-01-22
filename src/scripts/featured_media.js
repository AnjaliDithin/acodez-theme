import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFeaturedMedia() {

  // Kill only previous featured media triggers
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id === "featured-media-pin") st.kill();
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".featured_media_area",   // ✅ class selector
      start: "top top",
      end: () => "+=" + window.innerHeight * 1.5,
      scrub: 1,
      pin: ".featured_media_area",       // ✅ pin same class
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      id: "featured-media-pin"
    }
  });

  tl.to(".medialist1", {
    x: "-45vw",
    y: "-10vh",
    scale: 0.8,
    opacity: 0.6,
    ease: "none"
  }, 0);

  tl.to(".medialist2", {
    x: "45vw",
    y: "-15vh",
    scale: 0.8,
    opacity: 0.6,
    ease: "none"
  }, 0);

  tl.to(".medialist3", {
    x: "40vw",
    y: "30vh",
    scale: 0.8,
    opacity: 0.6,
    ease: "none"
  }, 0);

  tl.to(".medialistmain", {
    scale: 1.05,
    ease: "none"
  }, 0);

  ScrollTrigger.refresh();
}
