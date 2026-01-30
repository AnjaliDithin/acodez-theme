import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initMouseFollower } from "./mouse_follower.js";
import { initInteractiveGlobe } from "./interactiveGlobe.js";
import { initHeroCrossfade } from "./hero_crossfade.js";
import { initVideoControls } from "./video_player.js";
import { initHoverParallax } from "./hover_parallax.js";
// import { initSplittext } from "./splittext.js";
import { initTextAnimation } from "./textanimation.js";
import { initScrollAccordion } from "./scrolltrigger_accordion.js";
import { initImageTrail } from "./image_trail.js";
import { initStatCounter } from "./statCounter.js";
import { initSwiperCardSlider } from "./swiper_cardSlider.js";
import { initArcSliderResponsive} from "./gsap_arcSlider.js";
import { initFeaturedWorks } from "./featured_work.js";
import { initFeaturedMedia } from "./featured_media.js";
import { initFaqAccordion } from "./faq-accordion.js";
// import { initTestimonialTooltips } from "./testimonial-tooltip.js";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------
   GLOBAL SINGLETONS
-------------------------------------------------- */
let mfInstance = null;

function initGlobal() {
  if (!mfInstance) {
    mfInstance = initMouseFollower();
  }
}

/* --------------------------------------------------
   COMPONENT REGISTRY
-------------------------------------------------- */
const COMPONENTS = [
  { selector: ".hero-section", init: initHeroCrossfade },
  { selector: ".interactive-globe-container", init: initInteractiveGlobe },
  { selector: ".full-video-block", init: initVideoControls },
  { selector: ".image-hover-section", init: initHoverParallax },
  // { selector: ".split-text", init: initSplittext },
  { selector: ".floating-text", init: initTextAnimation },
  { selector: ".scroll-accordion", init: initScrollAccordion },
  { selector: ".interaction_trail", init: initImageTrail },
  { selector: ".stats-highlight-section", init: initStatCounter },
  { selector: ".arc-track", init: initArcSliderResponsive },
  { selector: ".featured-work-sec", init: initFeaturedWorks },
  { selector: ".featured_media-sec", init: initFeaturedMedia },
  { selector: ".FaqScrollsection", init: initFaqAccordion },
  { selector: ".footer-ctbar", init: initHeroCrossfade },

  // 👇 Component that NEEDS MouseFollower
  {
    selector: ".col3Projectslider",
    init: (section) => initSwiperCardSlider({ section, mfInstance }),
  },
];

/* --------------------------------------------------
   SAFE COMPONENT INIT
-------------------------------------------------- */
function initComponents() {
  COMPONENTS.forEach(({ selector, init }) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.dataset.jsInit) return;
      el.dataset.jsInit = "true";

      init(el);
    });
  });
}

/* --------------------------------------------------
   RUNNER (ASTRO SAFE)
-------------------------------------------------- */
function run() {
  initGlobal();      // 👈 MouseFollower once
  initComponents();  // 👈 Components only if present

  // Refresh ScrollTrigger once everything is ready
  ScrollTrigger.refresh();
}

// First load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}

// Astro navigation
document.addEventListener("astro:page-load", run);
