console.log("✅ main.js bundled and executed");

import { initMouseFollower } from "./mouse_follower.js";
import { initInteractiveGlobe } from "./interactiveGlobe.js";
import { initHeroCrossfade }from "./hero_crossfade.js";
import { initVideoControls } from "./video_player.js";
import { initHoverParallax } from "./hover_parallax.js";
import { initSplittext } from "./splittext.js";
import { initTextAnimation } from "./textanimation.js";
import { initScrollAccordion } from "./scrolltrigger_accordion.js";
import { initImageTrail } from "./image_trail.js";



function initAll() {
  initMouseFollower();
  initInteractiveGlobe();
  initHeroCrossfade();
  initVideoControls();
  initHoverParallax();
  initSplittext();
  initTextAnimation();
  initScrollAccordion();
  initImageTrail();
}

// First load
 if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAll);
    } else {
      initAll();
    }

// Astro navigation
document.addEventListener("astro:page-load", initAll);
