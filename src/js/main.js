import { initMouseFollower } from "./mouseFollower.js";
import heroCrossfade from "./heroCrossfade.js";
import { initVideoControls } from "./videoPlayer.js";
import { initHoverParallax } from "./hoverParallax.js";
import { initSplittext } from "./splittext.js";
import { initTextAnimation } from "./textAnimation.js";


function initAll() {
  initMouseFollower();
  heroCrossfade();
  initVideoControls();
  initHoverParallax();
  initSplittext();
  initTextAnimation();
}

// First load
 if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAll);
    } else {
      initAll();
    }

// Astro navigation
document.addEventListener("astro:page-load", initAll);
