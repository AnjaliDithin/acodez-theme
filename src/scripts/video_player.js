// export function initVideoControls() {
//   if (typeof window === "undefined") return;

//   console.log("[videoPlayer] initVideoControls()");

//   const wrapper = document.querySelector(".video-below-banner .video-wrapper");
//   const video = wrapper?.querySelector("video");
//   const trigger = wrapper?.querySelector(".video-play-btn");
//   const closeBtn = wrapper?.querySelector(".video-close-btn");

//   if (!wrapper || !video || !trigger || !closeBtn) {
//     console.warn("[videoPlayer] missing element:", { wrapper: !!wrapper, video: !!video, trigger: !!trigger, closeBtn: !!closeBtn });
//     return;
//   }

//   let expanded = false;

//   // ✅ INLINE AUTOPLAY ALWAYS RUNS
//   video.muted = true;
//   video.play().catch(() => {});

//   // ✅ FOLLOW CURSOR ONLY IN INLINE MODE
//   wrapper.addEventListener("mousemove", (e) => {
//     if (expanded) return;

//     const rect = wrapper.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     trigger.style.left = `${x}px`;
//     trigger.style.top = `${y}px`;
//   });

//   // Ensure the play button is clickable even if CSS sets pointer-events:none
//   try {
//     trigger.style.pointerEvents = "auto";
//   } catch (err) {
//     /* ignore */
//   }

//   // ✅ CLICK/TAP ANYWHERE TO EXPAND — bind to wrapper so it works on touch devices
//   wrapper.addEventListener("click", (e) => {
//     // prevent clicks coming from the close button from re-opening
//     if (e.target === closeBtn) return;

//     if (expanded) return;

//     console.log("[videoPlayer] wrapper click -> expand");
//     expandVideo();
//   });

//   // Also attach to the visible play button directly (safer)
//   trigger.addEventListener("click", (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (expanded) return;
//     console.log("[videoPlayer] trigger click -> expand");
//     expandVideo();
//   });

//   // Touchstart: some mobile browsers treat touches differently
//   wrapper.addEventListener("touchstart", (e) => {
//     if (expanded) return;
//     console.log("[videoPlayer] touchstart -> expand");
//     expandVideo();
//   });

//   function expandVideo() {
//     wrapper.classList.add("is-expanded");
//     closeBtn.hidden = false;

//     video.muted = false;
//     video.play().catch(() => {});

//     expanded = true;
//   }

//   function collapseVideo() {
//     wrapper.classList.remove("is-expanded");
//     closeBtn.hidden = true;

//     video.muted = true;
//     expanded = false;
//   }

//   // ✅ CLOSE
//   closeBtn.addEventListener("click", (e) => {
//     e.stopPropagation();
//     collapseVideo();
//   });

//   // ✅ ESC SUPPORT
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape" && expanded) {
//       collapseVideo();
//     }
//   });
// }

// src/js/videoPlayer.js
// export function initVideoControls() {
//   // SSR guard
//   if (typeof window === "undefined") return;

//   // Quick touch check (skip custom click UX on touch)
//   const isTouch =
//     "ontouchstart" in window || navigator.maxTouchPoints > 0;
//   if (isTouch) return;

//   const wrapper = document.querySelector(".video-below-banner .video-wrapper");
//   if (!wrapper) return;

//   const video = wrapper.querySelector("video");
//   const closeBtn = wrapper.querySelector(".video-close-btn");
//   if (!video || !closeBtn) {
//     console.warn("videoPlayer: missing video or close button");
//     return;
//   }

//   // ensure inline autoplay (muted) — allowed by browsers
//   video.muted = true;
//   video.playsInline = true;
//   video.loop = true;
//   video.play().catch(() => { /* ignore autoplay rejection */ });

//   let expanded = false;

//   // Expand the video to fixed full viewport
//   function expand() {
//     if (expanded) return;
//     wrapper.classList.add("is-expanded");
//     // ensure the close button is visible
//     closeBtn.hidden = false;
//     // unmute when expanding (optional)
//     video.muted = false;
//     // make sure it plays
//     video.play().catch((err) => console.warn("play failed:", err));
//     expanded = true;
//     // hide native cursor if you want Cuberto-only: handled by CSS .is-expanded { cursor: none; }
//   }

//   // Collapse back to inline
//   function collapse() {
//     if (!expanded) return;
//     wrapper.classList.remove("is-expanded");
//     closeBtn.hidden = true;
//     video.muted = true; // keep inline playback muted (optional)
//     expanded = false;
//   }

//   // Click the wrapper: expand if not expanded, collapse if expanded
//   wrapper.addEventListener("click", (ev) => {
//     // If a custom cursor or other overlay stops propagation, ensure it doesn't
//     // reach here during expand; but this logic is safe either way.
//     if (!expanded) {
//       ev.preventDefault();
//       ev.stopPropagation();
//       expand();
//       return;
//     }
//     // when expanded, clicking wrapper acts as collapse
//     collapse();
//   });

//   // Close button
//   closeBtn.addEventListener("click", (ev) => {
//     ev.preventDefault();
//     ev.stopPropagation();
//     collapse();
//   });

//   // ESC to close
//   document.addEventListener("keydown", (e) => {
//     if ((e.key === "Escape" || e.key === "Esc") && expanded) collapse();
//   });

//   // Optional: pause/resume handling when tab visibility changes (nice-to-have)
//   document.addEventListener("visibilitychange", () => {
//     if (document.hidden && expanded) {
//       // keep playing or pause if desired:
//       // video.pause();
//     }
//   });

//   // return cleanup if you ever need to unmount
//   return () => {
//     wrapper.removeEventListener("click", expand);
//     closeBtn.removeEventListener("click", collapse);
//     document.removeEventListener("keydown", collapse);
//   };
// }

// export default initVideoControls;


export function initVideoControls() {
  if (typeof window === "undefined") return;

  const isTouch =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  const wrapper = document.querySelector(".video-below-banner .video-wrapper");
  if (!wrapper) return;

  const video = wrapper.querySelector("video");
  const closeBtn = wrapper.querySelector(".video-close-btn");
  if (!video || !closeBtn) return;

  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.play().catch(() => {});

  let expanded = false;

  function expand() {
    if (expanded) return;
    wrapper.classList.add("is-expanded");
    closeBtn.hidden = false;
    video.muted = false;
    video.play().catch(() => {});
    expanded = true;
  }

  function collapse() {
    if (!expanded) return;
    wrapper.classList.remove("is-expanded");
    closeBtn.hidden = true;
    video.muted = true;
    expanded = false;
  }

  wrapper.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    expanded ? collapse() : expand();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    collapse();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && expanded) collapse();
  });
}




