// Truncated octahedron — 14 faces total.
//   8 hexagons → one per MENU item (raycast targets)
//   6 squares  → static info (event metadata, decorative)
// https://en.wikipedia.org/wiki/Truncated_octahedron
//
// Each face is rendered as its own ShapeGeometry mesh with a canvas texture,
// oriented so its +Z normal points outward from the origin. Edges are a
// LineSegments wireframe in yellow. The exported function name + return shape
// are kept (`buildOctagon`, `{ group, faceTargets, RADIUS, HEIGHT }`) so
// app.js doesn't have to change.

import * as THREE from "three";
import { MENU, PAL } from "./menu-data.js";

// Unit truncated-octahedron has vertices at all permutations of (0, ±1, ±2).
// Edge length in unit coords = sqrt(2). After scaling by SCALE, faces are sized:
//   hex circumradius (= edge length) = sqrt(2) * SCALE
//   square edge length              = sqrt(2) * SCALE
const SCALE = 0.185;
const EDGE_LEN = Math.sqrt(2) * SCALE;
const HEX_RADIUS = EDGE_LEN;

// ── face data builders ──────────────────────────────────────────────────────

// 8 hex faces — one per (±, ±, ±) octant of the original octahedron.
// Vertices in unit coords; ordered CCW around the centroid in the face plane.
function hexFaces() {
  const out = [];
  for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) {
    const verts = [
      [0,    sy * 1, sz * 2],
      [0,    sy * 2, sz * 1],
      [sx * 1, 0,    sz * 2],
      [sx * 2, 0,    sz * 1],
      [sx * 1, sy * 2, 0   ],
      [sx * 2, sy * 1, 0   ],
    ];
    out.push({
      verts: ccwOrder(verts, [sx, sy, sz]),
      octant: [sx, sy, sz],
    });
  }
  return out;
}

// 6 square faces — one per axis direction.
function squareFaces() {
  return [
    { center: [ 2, 0, 0], verts: [[2,1,0],[2,0,1],[2,-1,0],[2,0,-1]] },
    { center: [-2, 0, 0], verts: [[-2,-1,0],[-2,0,1],[-2,1,0],[-2,0,-1]] },
    { center: [ 0, 2, 0], verts: [[1,2,0],[0,2,1],[-1,2,0],[0,2,-1]] },
    { center: [ 0,-2, 0], verts: [[-1,-2,0],[0,-2,1],[1,-2,0],[0,-2,-1]] },
    { center: [ 0, 0, 2], verts: [[1,0,2],[0,1,2],[-1,0,2],[0,-1,2]] },
    { center: [ 0, 0,-2], verts: [[-1,0,-2],[0,1,-2],[1,0,-2],[0,-1,-2]] },
  ];
}

// Sort vertices CCW around a centroid by their angle in the face's tangent plane.
function ccwOrder(verts, centroid) {
  const n = new THREE.Vector3(centroid[0], centroid[1], centroid[2]).normalize();
  let u = new THREE.Vector3().crossVectors(n, new THREE.Vector3(0, 1, 0));
  if (u.lengthSq() < 1e-6) u.set(1, 0, 0);
  u.normalize();
  const w = new THREE.Vector3().crossVectors(n, u);
  return verts
    .map(p => {
      const d = new THREE.Vector3(p[0] - centroid[0], p[1] - centroid[1], p[2] - centroid[2]);
      return { p, a: Math.atan2(d.dot(w), d.dot(u)) };
    })
    .sort((a, b) => a.a - b.a)
    .map(o => o.p);
}

// ── canvas textures ─────────────────────────────────────────────────────────

function makeHexCanvas(item) {
  const W = 1024, H = 1024;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#1a0f08";
  ctx.fillRect(0, 0, W, H);

  // Scanlines
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);

  // Magenta soft glow on left
  const grad = ctx.createLinearGradient(0, 0, W * 0.5, 0);
  grad.addColorStop(0, "rgba(255,0,110,0.25)");
  grad.addColorStop(1, "rgba(255,0,110,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Index — magenta, top
  ctx.fillStyle = "#ff006e";
  ctx.font = "bold 64px ui-monospace, 'Share Tech Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("// " + item.index, W / 2, H * 0.27);

  // Title — amber, large, centered
  ctx.fillStyle = "#ffb86b";
  ctx.font = "900 104px 'Orbitron', ui-sans-serif, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(item.title, W / 2, H * 0.5);

  // SELECT hint — yellow, bottom
  ctx.fillStyle = "#ffea00";
  ctx.font = "600 36px ui-monospace, monospace";
  ctx.textBaseline = "bottom";
  ctx.fillText("// SELECT", W / 2, H * 0.74);

  return c;
}

function makeSquareCanvas(text) {
  const W = 512, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#1a0f08";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.025)";
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

  // Yellow corner brackets
  ctx.strokeStyle = "#ffea00";
  ctx.lineWidth = 4;
  const m = 32, L = 56;
  // tl
  ctx.beginPath(); ctx.moveTo(m, m + L); ctx.lineTo(m, m); ctx.lineTo(m + L, m); ctx.stroke();
  // tr
  ctx.beginPath(); ctx.moveTo(W - m - L, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + L); ctx.stroke();
  // bl
  ctx.beginPath(); ctx.moveTo(m, H - m - L); ctx.lineTo(m, H - m); ctx.lineTo(m + L, H - m); ctx.stroke();
  // br
  ctx.beginPath(); ctx.moveTo(W - m - L, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - L); ctx.stroke();

  // Multi-line text — split by '|'
  ctx.fillStyle = "#ffb86b";
  ctx.font = "700 44px 'Orbitron', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = text.split("|").map(s => s.trim());
  const n = lines.length;
  for (let i = 0; i < n; i++) {
    const y = H / 2 + (i - (n - 1) / 2) * 56;
    ctx.fillText(lines[i], W / 2, y);
  }

  return c;
}

function texFromCanvas(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.minFilter = THREE.LinearMipMapLinearFilter;
  t.needsUpdate = true;
  return t;
}

// ── face geometry helpers ───────────────────────────────────────────────────

// Regular hexagon ShapeGeometry, pointy-top, circumradius r.
function hexShapeGeom(r) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

// Square face is a rotated-45° square (diamond) in the face plane,
// with vertices at distance SCALE from the local center.
function squareShapeGeom() {
  const shape = new THREE.Shape();
  shape.moveTo( SCALE,  0);
  shape.lineTo( 0,      SCALE);
  shape.lineTo(-SCALE,  0);
  shape.lineTo( 0,     -SCALE);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

// Position mesh at world centroid; orient so +Z (its visible front) faces away from origin.
function orientOutward(mesh, centroid) {
  mesh.position.copy(centroid);
  // lookAt makes the object's -Z point at the target, so look at origin to push +Z outward.
  mesh.lookAt(0, 0, 0);
}

// ── main builder ────────────────────────────────────────────────────────────

export function buildOctagon() {
  const group = new THREE.Group();
  group.name = "to-group";

  const faceTargets = [];
  const hf = hexFaces();
  const sf = squareFaces();

  // 8 hex menu faces
  hf.forEach((face, idx) => {
    const item = MENU[idx];
    if (!item) return;
    const center = new THREE.Vector3(face.octant[0], face.octant[1], face.octant[2]).multiplyScalar(SCALE);
    const geom = hexShapeGeom(HEX_RADIUS);
    const mat = new THREE.MeshBasicMaterial({
      map: texFromCanvas(makeHexCanvas(item)),
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geom, mat);
    orientOutward(mesh, center);
    mesh.userData = { menuItem: item, faceIndex: idx };
    mesh.name = "to-hex-" + idx;
    group.add(mesh);
    faceTargets.push(mesh);
  });

  // 6 square info faces
  // Order matches squareFaces(): +x, -x, +y, -y, +z, -z
  const squareInfo = [
    "// 06.26 | 2026",     // +x
    "// 06.28 | 2026",     // -x
    "ENG CAFE | & CIC",    // +y (top)
    "FUKUOKA",             // -y (bottom)
    "VDC | 2026",          // +z (front)
    "XR | AR | VR",        // -z (back)
  ];
  sf.forEach((face, i) => {
    const center = new THREE.Vector3(face.center[0], face.center[1], face.center[2]).multiplyScalar(SCALE);
    const geom = squareShapeGeom();
    const mat = new THREE.MeshBasicMaterial({
      map: texFromCanvas(makeSquareCanvas(squareInfo[i])),
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geom, mat);
    orientOutward(mesh, center);
    mesh.userData = { isSquareFace: true, infoIndex: i };
    mesh.name = "to-sq-" + i;
    group.add(mesh);
  });

  // Edge wireframe — gather all face edges as line segments.
  const edgePos = [];
  hf.forEach(face => {
    for (let i = 0; i < 6; i++) {
      const a = face.verts[i], b = face.verts[(i + 1) % 6];
      edgePos.push(a[0] * SCALE, a[1] * SCALE, a[2] * SCALE);
      edgePos.push(b[0] * SCALE, b[1] * SCALE, b[2] * SCALE);
    }
  });
  sf.forEach(face => {
    for (let i = 0; i < 4; i++) {
      const a = face.verts[i], b = face.verts[(i + 1) % 4];
      edgePos.push(a[0] * SCALE, a[1] * SCALE, a[2] * SCALE);
      edgePos.push(b[0] * SCALE, b[1] * SCALE, b[2] * SCALE);
    }
  });
  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute("position", new THREE.Float32BufferAttribute(edgePos, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: PAL.yellow, transparent: true, opacity: 0.6 });
  group.add(new THREE.LineSegments(lineGeom, lineMat));

  return {
    group,
    faceTargets,
    RADIUS: SCALE * 2,  // outer "radius" — distance from center to vertex
    HEIGHT: SCALE * 4,  // bounding height — distance between top and bottom square faces
  };
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
