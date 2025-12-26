import * as THREE from "three";

let globeInstance = null;

export function initInteractiveGlobe() {
  const container = document.querySelector(".interactive-globe-container");
  const canvas = document.getElementById("globe-canvas");

  if (!container || !canvas) return;

  // 🛑 prevent double-init on astro navigation
  if (globeInstance) return;
  globeInstance = true;

  console.log("🌍 Interactive Globe init");

  const innerColor = container.dataset.innerColor || "#0E1216";
  const outerColor1 = container.dataset.outerColor1 || "#00CCE6";
  const outerColor2 = container.dataset.outerColor2 || "#8000CC";

  function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r
      ? {
          r: parseInt(r[1], 16) / 255,
          g: parseInt(r[2], 16) / 255,
          b: parseInt(r[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 };
  }

  const inner = hexToRgb(innerColor);
  const c1 = hexToRgb(outerColor1);
  const c2 = hexToRgb(outerColor2);

  /* ---------- THREE ---------- */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 250;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);

  /* ---------- PARTICLES ---------- */
  const count = 20000;
  const radius = 80;

  const geometry = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const orig = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    pos.set([x, y, z], i3);
    orig.set([x, y, z], i3);

    const d = Math.sqrt(x * x + y * y + z * z) / radius;
    const a = Math.atan2(y, x);
    const m = (Math.sin(a * 2) + 1) / 2;

    col[i3] = inner.r + d * (c1.r * (1 - m) + c2.r * m);
    col[i3 + 1] = inner.g + d * (c1.g * (1 - m) + c2.g * m);
    col[i3 + 2] = inner.b + d * (c1.b * (1 - m) + c2.b * m);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geometry.userData.orig = orig;

  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const globe = new THREE.Points(geometry, material);
  scene.add(globe);

  /* ---------- MOUSE ---------- */
  const mouse = { x: 0, y: 0 };

  container.addEventListener("mousemove", (e) => {
    const r = container.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  });

  /* ---------- ANIMATE ---------- */
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    const p = geometry.attributes.position.array;

    for (let i = 0; i < p.length; i += 3) {
      const x = orig[i];
      const y = orig[i + 1];
      const z = orig[i + 2];

      const a1 = Math.atan2(y, x);
      const a2 = Math.atan2(z, Math.sqrt(x * x + y * y));

      const w =
        Math.sin(a1 * 4 + t * 2) * 8 +
        Math.cos(a2 * 6 - t * 1.5) * 6 +
        Math.sin(a1 * 8 + a2 * 4 + t * 3) * 4;

      const d = Math.sqrt(x * x + y * y + z * z);
      const f = (d + w) / d;

      p[i] = x * f;
      p[i + 1] = y * f;
      p[i + 2] = z * f;
    }

    geometry.attributes.position.needsUpdate = true;

    globe.rotation.y += (mouse.x * 0.3 - globe.rotation.y) * 0.02;
    globe.rotation.x += (mouse.y * 0.3 - globe.rotation.x) * 0.02;
    globe.rotation.y += 0.002;

    renderer.render(scene, camera);
  }

  animate();

  /* ---------- RESIZE ---------- */
  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
