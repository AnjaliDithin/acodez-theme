
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initScrollAccordion({ debug = false } = {}) {
  // Prevent double-init
  if (window.__accordionInitiated) {
    if (debug) console.info("[accordion] already initiated — skipping");
    return;
  }
  window.__accordionInitiated = true;

  if (debug) console.info("[accordion] init start");

  const items = Array.from(document.querySelectorAll(".scroll-accordion"));
  if (!items.length) {
    if (debug) console.warn("[accordion] no .scroll-accordion items found");
    return;
  }

  const contents = items.map((it) => it.querySelector(".text__wrapper"));
  const images = items.map((it) => it.querySelector(".featured-img"));

  const wrapper =
    document.getElementById("service-scroll-wrapper") ||
    document.getElementById("grid_container") ||
    document.querySelector(".service-accordion-area");

  // bottom-row element (optional)
  const bottomRow = document.querySelector(".scroll-bttom-row");

  function getNaturalHeight(el) {
    if (!el) return 0;
    const clone = el.cloneNode(true);
    clone.style.height = "auto";
    clone.style.opacity = "0";
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "-1";
    // append to same parent so width/layout matches
    el.parentNode.appendChild(clone);
    const h = clone.offsetHeight;
    clone.remove();
    return h;
  }

  contents.forEach((c, i) => {
    if (!c) return;
    c.style.overflow = "hidden";
    if (i === 0) {
      c.style.height = "auto";
      c.style.opacity = "1";
      c.classList.add("is-open");
      if (images[i]) images[i].style.opacity = "1";
    } else {
      c.style.height = "0px";
      c.style.opacity = "0";
      c.classList.remove("is-open");
      if (images[i]) images[i].style.opacity = "0";
    }
  });

  function setBottomRowVisible(visible) {
    if (!bottomRow) return;
    if (visible) bottomRow.classList.add("is-visible");
    else bottomRow.classList.remove("is-visible");
    if (debug) console.info("[accordion] bottomRow visible ->", visible);
  }
  // ensure initial bottom row hidden
  if (bottomRow) setBottomRowVisible(false);

  // pointer events toggle (to avoid hover interactions causing reflow)
  function togglePointerEvents(enable) {
    if (!wrapper) return;
    wrapper.style.pointerEvents = enable ? "auto" : "none";
  }

  function ensureVisibleBeforeAnimate(el) {
    if (!el) return;
    el.style.display = "grid"; // matches SCSS usage
    el.style.visibility = "visible";
    el.classList.add("is-open");
    // freeze pixel height so GSAP animates from a stable start
    gsap.set(el, { height: el.offsetHeight + "px" });
  }

  let lastOpened = -1;
  const lastIndex = items.length - 1;

  function openAccordion(activeIndex, { force = false } = {}) {
    if (activeIndex === lastOpened && !force) {
      if (debug) console.debug("[accordion] openAccordion skipped (already open)", activeIndex);
      return;
    }
    lastOpened = activeIndex;

    if (debug) console.info("[accordion] opening index", activeIndex);

    // briefly disable pointer events to reduce interactive reflows
    togglePointerEvents(false);

    contents.forEach((c, i) => {
      if (!c) return;
      const naturalHeight = getNaturalHeight(c);

      // stop any current tween on this content
      gsap.killTweensOf(c);

      // ensure pixel start to avoid auto->px jump
      ensureVisibleBeforeAnimate(c);

      if (i === activeIndex) {
        // OPEN
        gsap.to(c, {
          height: naturalHeight,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            // switch to auto to allow responsiveness
            c.style.height = "auto";
            // slight delay so sibling closes finish
            setTimeout(() => togglePointerEvents(true), 60);
            // refresh ScrollTrigger measurements after final layout
            ScrollTrigger.refresh();
          }
        });

        if (images[i]) {
          gsap.killTweensOf(images[i]);
          gsap.to(images[i], { opacity: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
        }
      } else {
        // CLOSE
        gsap.to(c, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            c.style.height = "0px";
            c.style.visibility = "hidden";
            c.classList.remove("is-open");
          }
        });

        if (images[i]) {
          gsap.killTweensOf(images[i]);
          gsap.to(images[i], { opacity: 0, duration: 0.38, ease: "power3.out", overwrite: "auto" });
        }
      }
    });

    // Bottom row logic: show when last index is open; hide otherwise
    if (activeIndex === lastIndex) {
      setBottomRowVisible(true);
    } else {
      setBottomRowVisible(false);
    }
  }

  // PER-ITEM ScrollTrigger setups
  items.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top bottom",
      toggleActions: "restart none none reverse",
      onEnter: () => openAccordion(index),
      onEnterBack: () => openAccordion(index)
    });
  });

  // SECTION-LEVEL ScrollTrigger: open first on enter, last on leave
  if (wrapper) {
    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: `bottom+=${window.innerHeight} top`, // slack so leave has time to animate
      onEnter: () => {
        openAccordion(0, { force: true });
        setBottomRowVisible(false);
      },
      onEnterBack: () => {
        openAccordion(0, { force: true });
        setBottomRowVisible(false);
      },
      onLeave: () => {
        openAccordion(lastIndex, { force: true });
        // show bottom row when leaving the entire section
        setBottomRowVisible(true);
      },
      onLeaveBack: () => {
        openAccordion(lastIndex, { force: true });
        setBottomRowVisible(true);
      }
    });
  }

  // NEAREST-TO-CENTER scanner (debounced + rAF)
  let scanTimer = null;
  function scanNearestDebounced() {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight / 2;
        let closestIdx = -1;
        let closestDist = Infinity;

        items.forEach((it, idx) => {
          const rect = it.getBoundingClientRect();
          const elCenter = rect.top + rect.height / 2;
          const dist = Math.abs(elCenter - viewportCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = idx;
          }
        });

        // threshold for sensitivity (tune if needed)
        const threshold = 220;
        if (closestIdx >= 0) {
          if (closestIdx === lastIndex || closestDist < threshold) {
            openAccordion(closestIdx);
          }
        }
      });
    }, 120); // debounce window (ms)
  }

  if (wrapper) {
    // initial scan so direct navigation opens proper panel
    scanNearestDebounced();
    window.addEventListener("scroll", scanNearestDebounced, { passive: true });
    window.addEventListener("resize", scanNearestDebounced);
  }

  // Refresh ScrollTrigger when images load and on window load
  function refreshAfterImagesAndLoad() {
    const imgs = wrapper ? wrapper.querySelectorAll("img") : document.querySelectorAll(".scroll-accordion img");
    let pending = 0;
    imgs.forEach((img) => {
      if (!img.complete) {
        pending++;
        img.addEventListener(
          "load",
          () => {
            pending--;
            if (pending === 0) ScrollTrigger.refresh();
          },
          { once: true }
        );
      }
    });

    window.addEventListener(
      "load",
      () => {
        ScrollTrigger.refresh();
      },
      { once: true }
    );

    // safety refresh if lazy loads later
    setTimeout(() => ScrollTrigger.refresh(), 400);
  }
  refreshAfterImagesAndLoad();

  // Programmatic API
  window.openServiceAccordion = (idx) => {
    if (typeof idx !== "number") return;
    if (idx < 0 || idx > lastIndex) return;
    openAccordion(idx, { force: true });
    // intentionally NOT calling scrollIntoView here to avoid interrupting animation;
    // callers can scroll after a short delay if desired.
  };

  // Debug probe (if debug flag true, log key events)
  if (debug) {
    console.info("[accordion] debug enabled");
    // wrap openAccordion to log opens
    const _origOpen = openAccordion;
    openAccordion = function (idx, opts = {}) {
      console.groupCollapsed(`[accordion debug] open -> ${idx}`);
      const c = contents[idx];
      if (c) {
        console.log("computed:", getComputedStyle(c).height, getComputedStyle(c).opacity, getComputedStyle(c).display);
        console.log("inline height:", c.style.height, "offsetHeight:", c.offsetHeight);
        console.log("naturalHeight:", getNaturalHeight(c));
      }
      console.groupEnd();
      return _origOpen.call(this, idx, opts);
    };

    // log bottom row visibility changes
    const _origSetBottom = setBottomRowVisible;
    setBottomRowVisible = function (v) {
      console.info("[accordion debug] bottomRow visible ->", v);
      return _origSetBottom(v);
    };
  }

  if (debug) console.info("[accordion] init complete");

  // expose small programmatic API object
  return {
    open: (i) => window.openServiceAccordion(i),
    refresh: () => ScrollTrigger.refresh()
  };
}



// export function initScrollAccordion() {
//   const cards = gsap.utils.toArray(".scroll-block");
//   if (!cards.length) return;

//   // Kill old triggers (important if re-init / Astro)
//   ScrollTrigger.getAll().forEach(t => t.kill());

//   // Stack order: later cards above earlier
//   cards.forEach((card, i) => {
//     gsap.set(card, {
//       position: "relative",
//       zIndex: i + 1
//     });
//   });

//   cards.forEach((card, i) => {
//     ScrollTrigger.create({
//       trigger: card,
//       start: "top top",
//       endTrigger: cards[i + 1] || card,
//       end: cards[i + 1] ? "top top" : "+=300",
//       pin: true,
//       pinSpacing: false,
//       anticipatePin: 1
//     });
//   });
// }



