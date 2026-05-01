// Entry point — sets up scene, capability detection, XR session lifecycle, fallback mode.

import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { buildOctagon, buildLogo } from "./octagon.js";
import { buildContentPanel, materializeIn, materializeOut } from "./content-panel.js";
import { HandInputs } from "./interaction.js";
import { PAL } from "./menu-data.js";

const canvas = document.getElementById("xrCanvas");
const startARBtn = document.getElementById("startARBtn");
const startVRBtn = document.getElementById("startVRBtn");
const preview2DBtn = document.getElementById("preview2DBtn");
const cta = document.getElementById("xrCta");
const hint = document.getElementById("xrHint");

// Surface any runtime/module errors into the hint so failures are visible.
function showErr(msg) {
  if (hint) {
    hint.textContent = "// ERROR — " + msg;
    hint.style.color = "#ff006e";
  }
}
window.addEventListener("error", (e) => showErr(e.message || String(e)));
window.addEventListener("unhandledrejection", (e) => showErr((e.reason && e.reason.message) || String(e.reason)));

// Preview button always works — dismiss CTA so user can interact with the 2D scene
if (preview2DBtn) {
  preview2DBtn.addEventListener("click", () => {
    cta.style.display = "none";
  });
}

// ───── renderer / scene / camera ─────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.xr.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(PAL.bgSky);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 50);
camera.position.set(0, 1.55, 2.0); // EYE_TO_FLOOR_M from doc

const ambient = new THREE.AmbientLight(0xffe4b8, 0.55);
scene.add(ambient);
const key = new THREE.DirectionalLight(0xffd9a8, 0.8);
key.position.set(0.6, 2, 1);
scene.add(key);

// ───── content ─────
const loader = new THREE.TextureLoader();
const root = new THREE.Group();
root.position.set(0, 1.4, -1.4); // anchor — set on session start, but place a default for 2D
scene.add(root);

const oct = buildOctagon();
root.add(oct.group);

const logo = buildLogo(loader);
logo.position.set(0, oct.HEIGHT / 2 + 0.32, 0);
root.add(logo);

// Floor reference grid (warm amber)
const grid = new THREE.GridHelper(6, 12, PAL.warmEdge, PAL.amberDim);
grid.material.transparent = true;
grid.material.opacity = 0.25;
scene.add(grid);

// Content panel
const panel = buildContentPanel();
panel.container.position.set(0, 1.5, -1.2);
scene.add(panel.container);

// ───── interaction ─────
const targets = [...oct.faceTargets, panel.closeBtn];
const inputs = new HandInputs(scene, targets);

let isPanelOpen = false;
function openPanelFor(item) {
  panel.setContent(item);
  // Recede octagon
  root.position.z = -1.7;
  panel.container.visible = true;
  materializeIn(panel.container);
  isPanelOpen = true;
}
function closePanel() {
  if (!isPanelOpen) return;
  materializeOut(panel.container, () => {
    root.position.z = -1.4;
  });
  isPanelOpen = false;
}

inputs.onHoverChange = (target, hand) => {
  // Cosmetic: tint the hovered face's ring tone (bracket-ish via mesh.color)
  // For v1, we just rely on reticle + beam to indicate hover.
};

inputs.onSelect = (target) => {
  if (target === panel.closeBtn || (target.userData && target.userData.isCloseButton)) {
    closePanel();
    return;
  }
  if (target.userData && target.userData.menuItem) {
    if (isPanelOpen) closePanel();
    setTimeout(() => openPanelFor(target.userData.menuItem), 220);
  }
};

// ───── XR session lifecycle ─────
let arButtonEl = null, vrButtonEl = null;

if ("xr" in navigator) {
  Promise.all([
    navigator.xr.isSessionSupported("immersive-ar"),
    navigator.xr.isSessionSupported("immersive-vr"),
  ]).then(([arOK, vrOK]) => {
    if (arOK) {
      arButtonEl = ARButton.createButton(renderer, {
        requiredFeatures: ["local-floor"],
        optionalFeatures: ["hand-tracking"],
      });
      startARBtn.disabled = false;
      startARBtn.addEventListener("click", () => arButtonEl.click());
    }
    if (vrOK) {
      vrButtonEl = VRButton.createButton(renderer);
      startVRBtn.disabled = false;
      startVRBtn.addEventListener("click", () => vrButtonEl.click());
    }
    if (arOK || vrOK) {
      hint.textContent = "// READY — " + (arOK ? "AR" : "") + (arOK && vrOK ? " · " : "") + (vrOK ? "VR" : "") + " AVAILABLE";
    } else {
      hint.textContent = "// XR session not available — using 2D preview. Drag to orbit · click face to open.";
    }
  });
} else {
  hint.textContent = "// WebXR not supported in this browser — using 2D preview. Drag to orbit · click face to open.";
}

// On XR session start: hide CTA, switch to transparent bg in AR, defer anchoring to first valid frame.
let needsAnchor = false;
let anchorFramesWaited = 0;

renderer.xr.addEventListener("sessionstart", () => {
  cta.style.display = "none";

  const session = renderer.xr.getSession();
  // immersive-ar = passthrough → transparent background; VR → keep warm-dark sky
  if (session.environmentBlendMode === "additive" || session.environmentBlendMode === "alpha-blend") {
    scene.background = null;
  } else {
    scene.background = new THREE.Color(PAL.bgSky);
  }

  needsAnchor = true;
  anchorFramesWaited = 0;

  // Register XR controllers
  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    scene.add(controller);
    inputs.registerXRController(controller, "controller-" + i);
  }
});

renderer.xr.addEventListener("sessionend", () => {
  cta.style.display = "";
  scene.background = new THREE.Color(PAL.bgSky);
});

function maybeAnchorRoot() {
  if (!needsAnchor || !renderer.xr.isPresenting) return;
  // Wait ~30 frames (~500ms @ 60fps) so XR camera matrices are valid.
  if (anchorFramesWaited++ < 30) return;
  const cam = renderer.xr.getCamera();
  const camPos = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  cam.getWorldPosition(camPos);
  cam.getWorldDirection(camDir);
  // Sanity check: camera position must not be (0,0,0) or anchor will collapse to floor.
  if (camPos.lengthSq() < 0.0001 && Math.abs(camPos.y) < 0.5) {
    // local reference space without floor — fall back to a default eye height
    camPos.set(0, 1.55, 0);
    camDir.set(0, 0, -1);
  }
  root.position.copy(camPos).add(camDir.clone().multiplyScalar(1.4));
  root.lookAt(camPos);
  panel.container.position.copy(camPos).add(camDir.clone().multiplyScalar(1.2));
  panel.container.lookAt(camPos);
  needsAnchor = false;
}

// 2D fallback orbit + click
const orbit = new OrbitControls(camera, canvas);
orbit.target.set(0, 1.4, -1.4);
orbit.enableDamping = true;
orbit.update();
inputs.registerMouse(camera, canvas);

// ───── render loop ─────
ThreeMeshUI.update();
renderer.setAnimationLoop((t) => {
  // Anchor octagon in front of XR user once camera matrix is valid
  maybeAnchorRoot();

  // Idle auto-rotation when no panel open
  if (!isPanelOpen) {
    oct.group.rotation.y += 0.0025;
  }
  // Logo slow spin
  logo.rotation.y += 0.005;

  inputs.update();
  ThreeMeshUI.update();
  if (!renderer.xr.isPresenting) orbit.update();
  renderer.render(scene, camera);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
