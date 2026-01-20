import Swiper from 'swiper';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';

export function initSwiperCardSlider({
  root = document,
  autoplay = true,
  autoplayDelay = 8000,
  mfInstance = null,
  effect = 'slide' // 'slide' | 'coverflow'
} = {}) {
  const swiperEl = root.querySelector('.Projects-slider.swiper');
  if (!swiperEl) return;

  /* -----------------------------
   * SWIPER INIT
   * ----------------------------- */
  const swiper = new Swiper(swiperEl, {
    modules: [Navigation, Autoplay, EffectCoverflow],
    loop: true,
    slidesPerView: 2.2,
    spaceBetween: 20,
    speed: 1000,
     autoplay: {
        delay: 3000,              // wait 3s before next slide
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      640: { slidesPerView: 1.5 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 2.2 }
    },
   
  });

  /* -----------------------------
   * UTIL: HEX → RGBA
   * ----------------------------- */
  const hexToRgba = (hex) => {
    hex = hex.replace('#', '');
    let r, g, b, a = 1;

    if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
      a = parseInt(hex.slice(6, 8), 16) / 255;
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  /* -----------------------------
   * HOVER COLOR SYNC
   * ----------------------------- */
  if (mfInstance) {
    const cursor = document.querySelector('.mf-cursor');
    // const section = document.querySelector('#horizontal-Projectscroll');

    let activeItem = null;

    swiperEl.addEventListener('mouseover', (e) => {
      // disable hover logic on touch devices
      if (window.matchMedia('(hover: none)').matches) return;

      const slide = e.target.closest('.swiper-slide');
      if (!slide) return;

      const item = slide.querySelector('.slider-item');
      if (!item || item === activeItem) return;

      activeItem = item;

      const color = item.dataset.color;
      if (!color) return;

      const rgba = hexToRgba(color);

      if (cursor) cursor.style.backgroundColor = rgba;
    //   if (section) section.style.backgroundColor = rgba;
    });

    swiperEl.addEventListener('mouseleave', () => {
      activeItem = null;

      if (cursor) cursor.style.backgroundColor = '';
    //   if (section) section.style.backgroundColor = '';
    });
  }

  /* -----------------------------
   * API
   * ----------------------------- */
  return {
    swiper,
    play: () => swiper.autoplay?.start(),
    pause: () => swiper.autoplay?.stop(),
    next: () => swiper.slideNext(),
    prev: () => swiper.slidePrev()
  };
}
