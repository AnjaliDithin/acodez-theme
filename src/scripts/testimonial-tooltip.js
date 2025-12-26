export function initTestimonialTooltips(testimonials) {
  const wrappers = document.querySelectorAll(".logo-tooltip-wrap");

  wrappers.forEach((wrap) => {
    const logos = wrap.querySelectorAll(".js-crossfade");
    const tooltip = wrap.querySelector(".tooltip-card");

    if (!tooltip) return;

    const textEl = tooltip.querySelector(".tooltip-text");
    const imgEl = tooltip.querySelector(".user-img img");
    const nameEl = tooltip.querySelector(".customer");
    const desigEl = tooltip.querySelector(".desig");

    logos.forEach((logo) => {
      const index = Number(logo.dataset.index);
      const data = testimonials[index];

      if (!data) return;

      logo.addEventListener("mouseenter", () => {
        textEl.textContent = data.text;
        imgEl.src = data.customerImg;
        imgEl.alt = data.customer;
        nameEl.textContent = data.customer;
        desigEl.textContent = data.designation;

        tooltip.classList.add("is-visible");
      });

      logo.addEventListener("mouseleave", () => {
        tooltip.classList.remove("is-visible");
      });
    });
  });
}
