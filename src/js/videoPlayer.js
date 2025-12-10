// const isTouch = 'ontouchstart' in window;

// export function initVideoControls() {
//   if (isTouch) return; // skip on touch devices

//   const wrapper = document.querySelector('.video-below-banner .video-wrapper');
//   if (!wrapper) return;

//   const video = wrapper.querySelector('video');
//   const btn = wrapper.querySelector('.video-play-btn');
//   const closeBtn = wrapper.querySelector('.video-close-btn');
//   if (!video || !btn) return;

//   // Make the play button follow the cursor inside the wrapper
//   function onMove(e) {
//     const rect = wrapper.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     btn.style.left = `${x}px`;
//     btn.style.top = `${y}px`;
//     btn.style.transform = 'translate(-50%, -50%)';
//   }

//   wrapper.addEventListener('mousemove', onMove);
//   wrapper.addEventListener('mouseenter', () => {
//     btn.style.opacity = '1';
//     btn.style.pointerEvents = 'auto';
//   });
//   wrapper.addEventListener('mouseleave', () => {
//     btn.style.opacity = '0';
//     btn.style.pointerEvents = 'none';
//   });

//   let expanded = false;

//   btn.addEventListener('click', (ev) => {
//     ev.preventDefault();
//     ev.stopPropagation(); // avoid triggering wrapper click
//     if (!expanded) {
//       wrapper.classList.add('is-expanded');
//       // user gesture — play permitted
//       video.play().catch(() => {});
//       btn.setAttribute('aria-pressed', 'true');
//       expanded = true;
//     } else {
//       // collapse but DO NOT pause — keep inline playback by default
//       wrapper.classList.remove('is-expanded');
//       btn.setAttribute('aria-pressed', 'false');
//       expanded = false;
//     }
//   });

//   // helper to collapse (explicit close)
//   function collapse() {
//     if (!expanded) return;
//     wrapper.classList.remove('is-expanded');
//     // keep playing inline by default when collapsing
//     btn.setAttribute('aria-pressed', 'false');
//     expanded = false;
//   }

//   // close button behavior (stop propagation so wrapper handler doesn't toggle again)
//   if (closeBtn) {
//     closeBtn.addEventListener('click', (ev) => {
//       ev.preventDefault();
//       ev.stopPropagation();
//       collapse();
//     });
//   }

//   // allow ESC to close when expanded
//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape' || e.key === 'Esc') {
//       collapse();
//     }
//   });

//   // When expanded, clicking video toggles back (acts as close)
//   // Clicking the wrapper or the video toggles expansion/playback.
//   function toggleExpand() {
//     if (!expanded) {
//       wrapper.classList.add('is-expanded');
//       video.play().catch(() => {});
//       btn.setAttribute('aria-pressed', 'true');
//       expanded = true;
//     } else {
//       // collapse without pausing
//       collapse();
//     }
//   }

//   // wrapper covers both video and play button area
//   wrapper.addEventListener('click', (e) => {
//     // If the click originated on the button, its handler already ran (and stopped propagation),
//     // otherwise toggle here (clicking the video itself will trigger this).
//     toggleExpand();
//   });
// }

// export default initVideoControls;
const isTouch =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;

export function initVideoControls() {
  if (isTouch) return; // skip on touch devices

  const wrapper = document.querySelector(
    ".video-below-banner .video-wrapper"
  );
  if (!wrapper) return;

  const video = wrapper.querySelector("video");
  const btn = wrapper.querySelector(".video-play-btn");
  const closeBtn = wrapper.querySelector(".video-close-btn");

  if (!video || !btn) return;

  // ✅ IMPORTANT: wrapper must be position: relative in CSS
  // .video-wrapper { position: relative; }
  // .video-play-btn { position: absolute; }

  // -----------------------
  // CURSOR FOLLOW
  // -----------------------
  function onMove(e) {
    if (expanded) return; // ✅ freeze button when expanded

    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.transform = "translate(-50%, -50%)";
  }

  wrapper.addEventListener("mousemove", onMove);

  wrapper.addEventListener("mouseenter", () => {
    if (!expanded) {
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    }
  });

  wrapper.addEventListener("mouseleave", () => {
    if (!expanded) {
      btn.style.opacity = "0";
      btn.style.pointerEvents = "none";
    }
  });

  // -----------------------
  // EXPAND STATE
  // -----------------------
  let expanded = false;

  function expand() {
    if (expanded) return;

    wrapper.classList.add("is-expanded");
    btn.setAttribute("aria-pressed", "true");
    btn.style.opacity = "1"; // ✅ ensure visible
    btn.style.pointerEvents = "auto";

    video.play().catch(() => {});

    expanded = true;
  }

  function collapse() {
    if (!expanded) return;

    wrapper.classList.remove("is-expanded");
    btn.setAttribute("aria-pressed", "false");

    expanded = false;
  }

  // -----------------------
  // BUTTON CLICK (ONLY EXPANDS)
  // -----------------------
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation(); // ✅ stops wrapper click
    expand(); // ✅ never toggles back here
  });

  // -----------------------
  // WRAPPER CLICK (ONLY COLLAPSES)
  // -----------------------
  wrapper.addEventListener("click", () => {
    if (expanded) {
      collapse(); // ✅ only collapse here
    }
  });

  // -----------------------
  // CLOSE BUTTON
  // -----------------------
  if (closeBtn) {
    closeBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      collapse();
    });
  }

  // -----------------------
  // ESC KEY SUPPORT
  // -----------------------
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Escape" || e.key === "Esc") && expanded) {
      collapse();
    }
  });
}

export default initVideoControls;
