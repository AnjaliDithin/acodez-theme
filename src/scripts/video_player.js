
export function initVideoControls(section, mfInstance) {
  if (typeof window === "undefined") return;

  // Use the provided section or fall back to finding it in the DOM
  const container = section || document.querySelector(".full-video-block");
  if (!container) return;

  const wrapper = container.querySelector(".video-wrapper");
  if (!wrapper) return;

  const video = wrapper.querySelector("video");
  const closeBtn = wrapper.querySelector(".video-close-btn");
  if (!video || !closeBtn) return;

  // Initial setup: muted, loop, playsinline for autoplay compatibility
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.controls = false;

  video.play().catch(() => { });

  let expanded = false;

  function expand() {
    if (expanded) return;
    wrapper.classList.add("is-expanded");
    closeBtn.hidden = false;
    video.muted = false;
    video.controls = true;
    video.play().catch(() => { });
    expanded = true;

    // Disable scroll on body
    document.body.style.overflow = "hidden";

    // ✅ Mouse Follower logic: Hide text and reset state when expanded
    if (mfInstance) {
      mfInstance.removeText();
      const cursor = document.querySelector(".mf-cursor");
      if (cursor) cursor.classList.remove("-text");

      // Temporarily disable the "play video" text while expanded
      wrapper.removeAttribute("data-cursor-text");
    }
  }

  function collapse() {
    if (!expanded) return;
    wrapper.classList.remove("is-expanded");
    closeBtn.hidden = true;
    video.muted = true;
    video.controls = false;
    expanded = false;

    // Restore scroll
    document.body.style.overflow = "";

    // ✅ Mouse Follower logic: Restore "play video" text
    if (mfInstance) {
      wrapper.setAttribute("data-cursor-text", "play video");
    }
  }

  // Handle click on the wrapper
  wrapper.addEventListener("click", (e) => {
    if (e.target.closest(".video-close-btn")) return;

    // Only expand if clickable elements (controls) aren't being interacted with
    if (!expanded) {
      e.preventDefault();
      e.stopPropagation();
      expand();
    }
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    collapse();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && expanded) {
      collapse();
    }
  });
}
