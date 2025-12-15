import { initMouseFollower } from "./mouseFollower.js";
import {initHeroCrossfade }from "./heroCrossfade.js";
import { initVideoControls } from "./videoPlayer.js";
import { initHoverParallax } from "./hoverParallax.js";
import { initSplittext } from "./splittext.js";
import { initTextAnimation } from "./textanimation.js";
import { initScrollAccordion } from "./scrolltrigger-accordion.js";


function initAll() {
  initMouseFollower();
  initHeroCrossfade();
  initVideoControls();
  initHoverParallax();
  initSplittext();
  initTextAnimation();
  initScrollAccordion();
}

// First load
 if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAll);
    } else {
      initAll();
    }

// Astro navigation
document.addEventListener("astro:page-load", initAll);
