export function initFaqAccordion() {
  const items = document.querySelectorAll(".FaqScrollsection .scroll-block");
  if (!items.length) return;

  function closeAll(except = null) {
    items.forEach((item) => {
      if (item !== except) {
        item.classList.remove("is_open");
        const c = item.querySelector(".text__wrapper");
        if (c) c.style.height = "0px";
      }
    });
  }

  items.forEach((item) => {
    const trigger = item.querySelector(".title-row");
    const content = item.querySelector(".text__wrapper");
    if (!trigger || !content) return;

    content.style.height = "0px";
    content.style.overflow = "hidden";
    content.style.transition = "height 0.4s ease";

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = item.classList.contains("is_open");

      if (!isOpen) {
        closeAll(item);
        item.classList.add("is_open");
        requestAnimationFrame(() => {
          content.style.height = content.scrollHeight + "px";
        });
      } else {
        item.classList.remove("is_open");
        content.style.height = "0px";
      }
    });
  });

  // ✅ open FIRST item only
  const firstItem = items[0];
  if (!firstItem) return;

  const firstContent = firstItem.querySelector(".text__wrapper");
  setTimeout(() => {
    closeAll(firstItem);
    firstItem.classList.add("is_open");
    firstContent.style.height = firstContent.scrollHeight + "px";
  }, 0);
}
