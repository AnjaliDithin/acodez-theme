export function initClientLogoCrossfade() {
  const wraps = Array.from(
    document.querySelectorAll('.client-logogrid .images-wrap')
  );

  if (!wraps.length) return;

  const groups = [[], []];
  wraps.forEach((wrap, index) => {
    groups[index % 2].push(wrap);
  });

  let activeGroupIndex = 0;

  const state = new Map();
  wraps.forEach(wrap => state.set(wrap, 0));

  function showNextImage(wrap) {
    const images = wrap.querySelectorAll('.js-crossfade-random');
    if (!images.length) return;

    let index = state.get(wrap);

    images.forEach(img => img.classList.remove('is-active'));
    images[index].classList.add('is-active');

    state.set(wrap, (index + 1) % images.length);
  }

  function activateGroup(group) {
    group.forEach(wrap => showNextImage(wrap));
  }

  function deactivateGroup(group) {
    group.forEach(wrap => {
      wrap
        .querySelectorAll('.js-crossfade-random')
        .forEach(img => img.classList.remove('is-active'));
    });
  }

  activateGroup(groups[0]);

  setInterval(() => {
    deactivateGroup(groups[activeGroupIndex]);
    activeGroupIndex = (activeGroupIndex + 1) % groups.length;
    activateGroup(groups[activeGroupIndex]);
  }, 2000);
}
