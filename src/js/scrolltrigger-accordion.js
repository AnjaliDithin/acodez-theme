// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

// // Initialize the scroll animation
// export function initScrollAccordion() {
//   const accordions = document.querySelectorAll('.scroll-accordion');
  
//   accordions.forEach((accordion, index) => {
//     const headingRow = accordion.querySelector('.heading-row');
//     const featuredImgRow = accordion.querySelector('.featured-img-row');
//     const textWrapper = accordion.querySelector('.text__wrapper');
    
//     // Set initial state - hidden by default
//     gsap.set(featuredImgRow, { opacity: 0, y: 30 });
//     gsap.set(textWrapper, { opacity: 0, y: 30 });
    
//     // Pin the heading row while scrolling through this section
//     ScrollTrigger.create({
//       trigger: accordion,
//       start: 'top top+=100',
//       endTrigger: textWrapper,
//       end: 'bottom center',
//       pin: headingRow,
//       pinSpacing: false,
//       anticipatePin: 1,
//     });
    
//     // Animate featured image on scroll - OPEN on enter, CLOSE on leave
//     gsap.to(featuredImgRow, {
//       y: 0,
//       opacity: 1,
//       ease: 'power2.out',
//       scrollTrigger: {
//         trigger: accordion,
//         start: 'top center+=100',
//         end: 'top top+=200',
//         scrub: 1,
//         onLeave: () => {
//           // Close when scrolling to next section
//           gsap.to(featuredImgRow, { opacity: 0, y: -30, duration: 0.3 });
//         },
//         onEnterBack: () => {
//           // Re-open when scrolling back
//           gsap.to(featuredImgRow, { opacity: 1, y: 0, duration: 0.3 });
//         }
//       }
//     });
    
//     // Animate text content on scroll - OPEN on enter, CLOSE on leave
//     gsap.to(textWrapper, {
//       y: 0,
//       opacity: 1,
//       ease: 'power2.out',
//       scrollTrigger: {
//         trigger: accordion,
//         start: 'top center+=50',
//         end: 'top top+=150',
//         scrub: 1,
//         onLeave: () => {
//           // Close when scrolling to next section
//           gsap.to(textWrapper, { opacity: 0, y: -30, duration: 0.3 });
//         },
//         onEnterBack: () => {
//           // Re-open when scrolling back
//           gsap.to(textWrapper, { opacity: 1, y: 0, duration: 0.3 });
//         }
//       }
//     });
//   });
// }

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initScrollAccordion() {
  const accordions = Array.from(document.querySelectorAll('.scroll-accordion'));
  if (!accordions.length) return;

  // Clean up previous ScrollTriggers for safety (optional)
  ScrollTrigger.getAll().forEach(t => {
    if (t && t.trigger && t.trigger.classList && t.trigger.classList.contains('scroll-accordion')) {
      try { t.kill(true); } catch (e) {}
    }
  });

  // Helper: set spacer padding for a given headingRow (safe lookup of the spacer element)
  function setSpacerPaddingFor(headingRow, paddingPx) {
    try {
      // try common placements
      let spacer = headingRow.closest('.gsap-pin-spacer') ||
                   (headingRow.parentElement && headingRow.parentElement.closest('.gsap-pin-spacer')) ||
                   Array.from(document.querySelectorAll('.gsap-pin-spacer')).find(sp => sp.contains(headingRow) || sp === headingRow.parentElement);

      if (spacer) {
        spacer.style.paddingBottom = paddingPx + 'px';
      }
    } catch (e) {
      // ignore
    }
  }

  // For each accordion item create its ScrollTrigger (pin heading and reveal content)
  accordions.forEach((accordion) => {
    const headingRow = accordion.querySelector('.heading-row');
    const featuredImgRow = accordion.querySelector('.featured-img-row');
    const textWrapper = accordion.querySelector('.text__wrapper');

    if (!headingRow || !textWrapper) return;

    // Ensure textWrapper measured properly: set auto then measure when needed.
    // We will NOT rely on a single measured value: end() will compute scrollHeight dynamically
    // so if images load later, the new height will be used on refresh.
    textWrapper.style.height = '0px'; // start collapsed
    textWrapper.style.overflow = 'hidden';

    // Set featured image initial state
    if (featuredImgRow) {
      gsap.set(featuredImgRow, { opacity: 0, y: 20, willChange: 'transform,opacity' });
    }

    // Extra padding to reserve while pinned (compute or set fixed)
    // You can compute per-item (e.g., based on image height). Here we compute a default using image (if exists) else fallback.
    const baseExtra = 120;
    let computedExtra = baseExtra;
    if (featuredImgRow) {
      const imgEl = featuredImgRow.querySelector('img');
      if (imgEl && imgEl.naturalHeight) {
        // approximate visible img height (scaled). This is just a hint — end() computes dynamically anyway.
        computedExtra = Math.max(baseExtra, Math.round((imgEl.naturalHeight * (featuredImgRow.offsetWidth / (imgEl.naturalWidth || 1))) || baseExtra));
      }
    }

    // Create ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: accordion,
      start: () => `top top`, // can be tweaked
      // end calculates from the *current* textWrapper.scrollHeight so lazy-loaded images are accounted for after refresh
      end: () => `+=${(textWrapper && textWrapper.scrollHeight) || 0 + computedExtra}`,
      pin: headingRow,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        // onRefresh runs after ScrollTrigger recalculates sizes.
        // update spacer padding so the pinned area has extra reserved space.
        // Use a responsive rule: larger padding on wider screens
        const paddingForViewport = window.innerWidth >= 1024 ? 80 : 40; // adjust to taste
        setSpacerPaddingFor(headingRow, paddingForViewport);
      },
      onEnter: () => {
        // compute natural height on enter (in case it changed since init)
        const naturalHeight = textWrapper.scrollHeight || 0;
        gsap.to(textWrapper, {
          height: naturalHeight,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        });
        if (featuredImgRow) {
          gsap.to(featuredImgRow, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        }
      },
      onLeave: () => {
        gsap.to(textWrapper, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
        if (featuredImgRow) gsap.to(featuredImgRow, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' });
      },
      onEnterBack: () => {
        const naturalHeight = textWrapper.scrollHeight || 0;
        gsap.to(textWrapper, { height: naturalHeight, opacity: 1, duration: 0.6, ease: 'power2.out' });
        if (featuredImgRow) gsap.to(featuredImgRow, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
      },
      onLeaveBack: () => {
        gsap.to(textWrapper, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
        if (featuredImgRow) gsap.to(featuredImgRow, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' });
      }
    });

    // If textWrapper contains images that may load after init, refresh ScrollTrigger when images load.
    const imgs = Array.from(textWrapper.querySelectorAll('img'));
    if (imgs.length) {
      let remaining = imgs.length;
      imgs.forEach(img => {
        if (img.complete) {
          remaining--;
        } else {
          img.addEventListener('load', () => {
            remaining--;
            if (remaining <= 0) {
              // All images inside textWrapper loaded — refresh triggers so end() and layout are recalculated.
              ScrollTrigger.refresh();
            }
          }, { once: true });
          img.addEventListener('error', () => {
            remaining--;
            if (remaining <= 0) ScrollTrigger.refresh();
          }, { once: true });
        }
      });
      // If all images were already complete, trigger a refresh to ensure calculations are current.
      if (remaining <= 0) ScrollTrigger.refresh();
    }
  }); // end accordions.forEach

  // After creating triggers, one final refresh to ensure everything is aligned
  ScrollTrigger.refresh();
}


