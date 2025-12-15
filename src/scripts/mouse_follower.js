
import MouseFollower from "mouse-follower";
import gsap from "gsap";
import "mouse-follower/dist/mouse-follower.min.css";

let mfInstance = null;

export function initMouseFollower() {
  if (typeof window === "undefined") return;
  if ("ontouchstart" in window) return; // ✅ optional: disable on mobile
  if (mfInstance) return mfInstance;    // ✅ prevent duplicates on astro nav

  MouseFollower.registerGSAP(gsap);

  mfInstance = new MouseFollower({
    container: document.body,
    speed: 0.3,
    ease: "expo.out",
     skew: 0,
    skewAmount: 2,
    visible: true,
    width: 40,
    height: 40,
    text: true,
    textFontFamily: "DM Sans, sans-serif",
    textFontSize: 10,
    textFontWeight: 600,
  });

  return mfInstance;
}

