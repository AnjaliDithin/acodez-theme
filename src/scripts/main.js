
import { initMouseFollower } from "./mouse_follower.js";
import { initInteractiveGlobe } from "./interactiveGlobe.js";
import { initHeroCrossfade }from "./hero_crossfade.js";
import { initVideoControls } from "./video_player.js";
import { initHoverParallax } from "./hover_parallax.js";
import { initSplittext } from "./splittext.js";
import { initTextAnimation } from "./textanimation.js";
import { initScrollAccordion } from "./scrolltrigger_accordion.js";
import { initImageTrail } from "./image_trail.js";
import { initStatCounter } from "./statCounter.js";
import { initGsapCardSlider } from "./gsap_cardSlider.js";
import { initArcPathSlider } from "./gsap_arcSlider.js";
import { initFeaturedWorks } from "./featured_work.js";
import { initFeaturedCardsScroll } from "./featuredCardsScroll.js";




function initAll() {
  const mf = initMouseFollower();
  initInteractiveGlobe();
  initHeroCrossfade();
  initVideoControls();
  initHoverParallax();
  initSplittext();
  initTextAnimation();
  initScrollAccordion();
  initImageTrail();
  initStatCounter();
  initGsapCardSlider({ mfInstance: mf });
  initArcPathSlider();
   initFeaturedWorks();
   initFeaturedCardsScroll();
}

// First load
 if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAll);
    } else {
      initAll();
    }

// Astro navigation
document.addEventListener("astro:page-load", initAll);
