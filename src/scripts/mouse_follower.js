
// import MouseFollower from "mouse-follower";
// import gsap from "gsap";
// import "mouse-follower/dist/mouse-follower.min.css";

// let mfInstance = null;

// export function initMouseFollower() {
//   if (typeof window === "undefined") return;
//   if ("ontouchstart" in window) return; // ✅ optional: disable on mobile
//   if (mfInstance) return mfInstance;    // ✅ prevent duplicates on astro nav

//   MouseFollower.registerGSAP(gsap);

//   mfInstance = new MouseFollower({
//     container: document.body,
//     speed: 0.3,
//     ease: "expo.out",
//      skew: 0,
//     skewAmount: 2,
//     visible: true,
//     width: 40,
//     height: 40,
//     text: true,
//     textFontFamily: "DM Sans, sans-serif",
//     textFontSize: 10,
//     textFontWeight: 600,
//   });
  

//   // Hide default cursor
//   document.body.style.cursor = 'none';

//   return mfInstance;
// }

// export { mfInstance };

// import MouseFollower from "mouse-follower";
// import gsap from "gsap";
// import "mouse-follower/dist/mouse-follower.min.css";

// let mfInstance = null;

// export function initMouseFollower() {
//   if (typeof window === "undefined") return;
//   if ("ontouchstart" in window) return;
//   if (mfInstance) return mfInstance;

//   MouseFollower.registerGSAP(gsap);

//   mfInstance = new MouseFollower({
//     container: document.body,
//     speed: 0.3,
//     ease: "expo.out",
//     visible: true,
//     skew: 0,
//     skewAmount: 2,
//     text: false, // ✅ IMPORTANT
//   });

//   const footer = document.querySelector(".footer-brand .brand-text");
//   if (!footer) return mfInstance;

//   footer.addEventListener("mouseenter", () => {
//     document.body.classList.add("footer-cursor-active");

//     mfInstance.setText(`
//       <div class="mf-circle-text">
//         <svg viewBox="0 0 200 200">
//           <defs>
//             <path id="circlePath"
//               d="M100,100 m-70,0
//                  a70,70 0 1,1 140,0
//                  a70,70 0 1,1 -140,0" />
//           </defs>
//           <text>
//             <textPath href="#circlePath">
//             LET’S TALK WITH US
//             <tspan class="circle-dot"> • </tspan>
//             LET’S TALK WITH US
//             <tspan class="circle-dot"> • </tspan>
//           </textPath>

//           </text>
//         </svg>
//         <span class="mf-center-arrow"></span>
//       </div>
//     `);
//   });

//   footer.addEventListener("mouseleave", () => {
//     document.body.classList.remove("footer-cursor-active");
//     mfInstance.setText(null);
//     const cursor = document.querySelector(".mf-cursor");
//     if (cursor) {
//       cursor.classList.remove("-text");
//     }
//   });

//   return mfInstance;
// }

import MouseFollower from "mouse-follower";
import gsap from "gsap";
import "mouse-follower/dist/mouse-follower.min.css";

let mfInstance = null;

export function initMouseFollower() {
  if (typeof window === "undefined") return;
  if ("ontouchstart" in window) return;
  if (mfInstance) return mfInstance;

  MouseFollower.registerGSAP(gsap);

  /* --------------------------------
     INIT CURSOR (DEFAULT STATE)
  -------------------------------- */
  mfInstance = new MouseFollower({
    container: document.body,
    speed: 0.3,
    ease: "expo.out",
    visible: true,
    skew: 0,
    skewAmount: 2,
    text: false,
  });

 
  const brandWrapper = document.querySelector(".footer-brand");
  const brandText = document.querySelector(".footer-brand .brand-text");

  if (!brandWrapper || !brandText) return mfInstance;

 
  if (!brandText.dataset.split) {
    const text = brandText.textContent.trim();
    brandText.innerHTML = "";

    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      brandText.appendChild(span);
    });

    brandText.dataset.split = "true";
  }

  const letters = brandText.querySelectorAll("span");

  
  brandWrapper.addEventListener("mouseenter", () => {
    document.body.classList.add("footer-cursor-active");

    mfInstance.setText(`
      <div class="mf-circle-text">
        <svg viewBox="0 0 200 200">
          <defs>
            <path id="circlePath"
              d="M100,100 m-70,0
                 a70,70 0 1,1 140,0
                 a70,70 0 1,1 -140,0" />
          </defs>
          <text>
            <textPath href="#circlePath">
              LET’S TALK WITH US
              <tspan class="circle-dot"> • </tspan>
              LET’S TALK WITH US
              <tspan class="circle-dot"> • </tspan>
            </textPath>
          </text>
        </svg>
        <span class="mf-center-arrow"></span>
      </div>
    `);
  });

  /* --------------------------------
     FOOTER BRAND → LEAVE
  -------------------------------- */
  brandWrapper.addEventListener("mouseleave", () => {
    document.body.classList.remove("footer-cursor-active");
    mfInstance.setText(null);
     const cursor = document.querySelector(".mf-cursor");
    if (cursor) {
      cursor.classList.remove("-text");
    }

    // reset letters
    letters.forEach((l) => l.classList.remove("is-active"));
     letters.forEach((l) => {
    l.style.setProperty("--lx", `50%`);
    l.style.setProperty("--ly", `50%`);
  });
  });
 
brandWrapper.addEventListener("mousemove", (e) => {
  letters.forEach((letter) => {
    const r = letter.getBoundingClientRect();

    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;

    if (inside) {
      const lx = ((e.clientX - r.left) / r.width) * 100;
      const ly = ((e.clientY - r.top) / r.height) * 100;

      letter.style.setProperty("--lx", `${lx}%`);
      letter.style.setProperty("--ly", `${ly}%`);
    } else {
      letter.style.setProperty("--lx", `50%`);
      letter.style.setProperty("--ly", `50%`);
    }
  });
});




  return mfInstance;
}



