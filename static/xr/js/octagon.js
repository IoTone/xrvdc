// Octagon mesh + 8-face menu decoration.
// Per face: drawn into a single canvas-as-texture atlas (1 draw call for all faces).

import * as THREE from "three";
import { MENU, PAL } from "./menu-data.js";

const RADIUS = 0.325;          // octagon outer radius (so diameter ≈ 0.65 m)
const HEIGHT = 0.50;           // vertical height
const SEGMENTS = 8;            // 8 faces
const FACE_PIX_W = 512;        // texture-atlas pixel size per face
const FACE_PIX_H = 768;        // 4:6 ratio so titles read tall

// Build a CanvasTexture atlas — 8 faces stacked horizontally.
function makeAtlasTexture() {
  const c = document.createElement("canvas");
  c.width = FACE_PIX_W * SEGMENTS;
  c.height = FACE_PIX_H;
  const ctx = c.getContext("2d");

  for (let i = 0; i < SEGMENTS; i++) {
    const x = i * FACE_PIX_W;
    drawFace(ctx, x, 0, FACE_PIX_W, FACE_PIX_H, MENU[i]);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = THREE.LinearMipMapLinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function drawFace(ctx, x, y, w, h, item) {
  // Warm dark brown background (passthrough-safe)
  ctx.fillStyle = "#1a0f08";
  ctx.fillRect(x, y, w, h);

  // Subtle scanlines
  ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
  for (let yy = 0; yy < h; yy += 4) ctx.fillRect(x, y + yy, w, 1);

  // Magenta soft glow on left edge
  const grad = ctx.createLinearGradient(x, 0, x + w * 0.5, 0);
  grad.addColorStop(0, "rgba(255, 0, 110, 0.25)");
  grad.addColorStop(1, "rgba(255, 0, 110, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Yellow HUD corner brackets
  ctx.strokeStyle = "#ffea00";
  ctx.lineWidth = 6;
  const m = 28; // margin
  const L = 60; // bracket leg length
  // top-left
  ctx.beginPath();
  ctx.moveTo(x + m, y + m + L); ctx.lineTo(x + m, y + m); ctx.lineTo(x + m + L, y + m);
  ctx.stroke();
  // top-right
  ctx.beginPath();
  ctx.moveTo(x + w - m - L, y + m); ctx.lineTo(x + w - m, y + m); ctx.lineTo(x + w - m, y + m + L);
  ctx.stroke();
  // bottom-left
  ctx.beginPath();
  ctx.moveTo(x + m, y + h - m - L); ctx.lineTo(x + m, y + h - m); ctx.lineTo(x + m + L, y + h - m);
  ctx.stroke();
  // bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - m - L, y + h - m); ctx.lineTo(x + w - m, y + h - m); ctx.lineTo(x + w - m, y + h - m - L);
  ctx.stroke();

  // Index "▸ 0N" magenta
  ctx.fillStyle = "#ff006e";
  ctx.font = "bold 56px ui-monospace, 'Share Tech Mono', monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("▸ " + item.index, x + 70, y + 110);

  // Title amber, large
  ctx.fillStyle = "#ffb86b";
  ctx.font = "900 96px 'Orbitron', ui-sans-serif, sans-serif";
  ctx.textBaseline = "middle";
  // Wrap if too wide
  const title = item.title;
  ctx.textAlign = "center";
  ctx.fillText(title, x + w / 2, y + h / 2);

  // Subtle "TAP TO OPEN" hint at bottom
  ctx.fillStyle = "#ffea00";
  ctx.font = "600 28px ui-monospace, monospace";
  ctx.textBaseline = "bottom";
  ctx.fillText("// SELECT", x + w / 2, y + h - 90);

  // REC dot top-right (decoration, not animated since canvas is static)
  ctx.beginPath();
  ctx.arc(x + w - 50, y + 56, 9, 0, Math.PI * 2);
  ctx.fillStyle = "#ff006e";
  ctx.fill();
}

// Build per-vertex UV map so each octagon side maps to its slice of the atlas.
function applyAtlasUVs(geom) {
  // CylinderGeometry openEnded with 8 segments has 8 quads on the side.
  // Three.js builds 9 ring vertices per ring (first and last are duplicates so UV wraps).
  const uv = geom.attributes.uv;
  const segs = SEGMENTS;
  // Two rings (top, bottom) with segs+1 verts each.
  for (let s = 0; s <= segs; s++) {
    // Each face occupies width 1/segs in U; vertex s spans s/segs.
    const u = s / segs;
    // Top ring
    uv.setXY(s, u, 1);
    // Bottom ring
    uv.setXY(s + segs + 1, u, 0);
  }
  uv.needsUpdate = true;
}

export function buildOctagon() {
  const group = new THREE.Group();
  group.name = "octagon-group";

  // Side prism — open-ended so atlas only paints the sides
  const sideGeom = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, SEGMENTS, 1, true);
  applyAtlasUVs(sideGeom);
  const sideMat = new THREE.MeshBasicMaterial({
    map: makeAtlasTexture(),
    transparent: true,
    side: THREE.DoubleSide,
  });
  const sides = new THREE.Mesh(sideGeom, sideMat);
  sides.name = "octagon-sides";
  group.add(sides);

  // Edge highlight — yellow wireframe outline of the octagon prism
  const edges = new THREE.EdgesGeometry(sideGeom, 1);
  const edgeMat = new THREE.LineBasicMaterial({ color: PAL.yellow, transparent: true, opacity: 0.6 });
  group.add(new THREE.LineSegments(edges, edgeMat));

  // Top and bottom rings (decorative warm-amber thin bands)
  const ringGeom = new THREE.RingGeometry(RADIUS * 0.96, RADIUS * 1.04, SEGMENTS, 1);
  const ringMat = new THREE.MeshBasicMaterial({ color: PAL.amber, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
  const topRing = new THREE.Mesh(ringGeom, ringMat);
  topRing.rotation.x = -Math.PI / 2;
  topRing.position.y = HEIGHT / 2 + 0.001;
  group.add(topRing);
  const bottomRing = topRing.clone();
  bottomRing.position.y = -HEIGHT / 2 - 0.001;
  group.add(bottomRing);

  // Per-face hit targets — invisible quads aligned with each side, used for raycasting.
  // Easier than computing UV-from-intersection on the cylinder.
  const faceTargets = [];
  const faceGeom = new THREE.PlaneGeometry(2 * RADIUS * Math.sin(Math.PI / SEGMENTS), HEIGHT * 0.95);
  const faceMat = new THREE.MeshBasicMaterial({ visible: false });
  for (let i = 0; i < SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2 + Math.PI / SEGMENTS;
    const m = new THREE.Mesh(faceGeom, faceMat);
    m.position.set(Math.sin(angle) * RADIUS * 1.001, 0, Math.cos(angle) * RADIUS * 1.001);
    m.lookAt(m.position.x * 10, 0, m.position.z * 10);
    m.userData = { menuItem: MENU[i], faceIndex: i };
    m.name = "octagon-face-" + i;
    group.add(m);
    faceTargets.push(m);
  }

  return { group, faceTargets, sides, RADIUS, HEIGHT };
}

// Floating logo plane (loaded as texture from /images/logo.png)
export function buildLogo(loader) {
  const tex = loader.load("/images/logo.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  const geom = new THREE.PlaneGeometry(0.4, 0.4);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
  const m = new THREE.Mesh(geom, mat);
  m.name = "logo";
  return m;
}
