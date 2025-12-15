
import gsap from "gsap";

let isInit = false;

export function initHeroCrossfade({
  selector = ".crossfade-layer--animated .js-crossfade",
  duration = 0.5,
  delay = 1.8
} = {}) {
  if (isInit) return;
  isInit = true;

  const items = gsap.utils.toArray(selector);
  if (items.length < 2) return;

  gsap.set(items, { autoAlpha: 0 });

  const tl = gsap.timeline({ repeat: -1 });

  items.forEach((current, i) => {
    const next = items[(i + 1) % items.length];

    tl.to({}, { duration: delay })
      .to(current, { autoAlpha: 0, duration: 0.25 })
      .to(next, { autoAlpha: 1, duration });
  });
}




