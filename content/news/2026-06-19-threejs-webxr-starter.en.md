---
title: "Three.js: the Standard Library of WebXR"
date: 2026-06-19T10:00:00+09:00
slug: "threejs-webxr-starter"
tag: "STARTER"
summary: "Three.js is the engine A-Frame is built on and the one most WebXR examples are written in. Its WebXRManager turns a flat WebGL scene into a headset app with two extra lines — renderer.xr.enabled and a VR button. A single-file starter for Quest 3, PICO 4 Ultra Enterprise, Vision Pro, and Spectacles."
---

[Three.js](https://threejs.org/) is the most widely used WebGL library on the web, and the layer underneath much of the WebXR ecosystem — [A-Frame](/news/aframe-webxr-starter/) wraps it, and a large share of the [WebXR samples](https://immersive-web.github.io/webxr-samples/) are written directly against it. Where A-Frame is declarative and [Babylon.js](/news/babylonjs-webxr-starter/) is a batteries-included engine, three.js sits in between: a lean, imperative toolkit that gives full control of the scene graph while keeping the WebXR plumbing down to a couple of calls.

▸ [threejs.org](https://threejs.org/) · [docs](https://threejs.org/docs/) · [WebXR examples](https://threejs.org/examples/#webxr_xr_ballshooter) · [GitHub](https://github.com/mrdoob/three.js) (MIT, **r170**, 105k★)

## What three.js adds for XR

The whole of WebXR support lives in **`renderer.xr`** — three.js's `WebXRManager`. Turning it on is one property; entering a session is one button helper:

- `renderer.xr.enabled = true` routes rendering through the headset's stereo views and per-eye projection.
- `VRButton` / `ARButton` (in `three/addons/webxr/`) handle `navigator.xr.requestSession`, feature negotiation, and the enter/exit UI.
- `renderer.setAnimationLoop(fn)` replaces `requestAnimationFrame` — it is XR-aware and ticks once per eye-pair at the headset's frame rate.
- `renderer.xr.getController(i)` and `XRHandModelFactory` surface controllers and articulated hands as ordinary `Object3D`s in the scene.

## The starter — one HTML file, no build step

Modern three.js ships as ES modules. An **import map** pulls the library from a CDN, so the entire starter is a single file with no bundler:

```html
<!DOCTYPE html>
<html><body style="margin:0">
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
} }
</script>
<script type="module">
  import * as THREE from 'three';
  import { VRButton } from 'three/addons/webxr/VRButton.js';

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.xr.enabled = true;                          // ① enable WebXR
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer)); // ② Enter VR

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 3));

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x23f0ff }));
  cube.position.set(0, 1.5, -2);
  scene.add(cube);

  renderer.setAnimationLoop(() => {                    // ③ XR-aware render loop
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  });
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
</script>
</body></html>
```

Those three marked lines are the entire difference between a desktop WebGL page and a headset app. Swap `VRButton` for `ARButton` — `ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] })` — to start an `immersive-ar` passthrough session instead.

## Controllers and hands

Both come out of the same manager. Add a controller as a scene object and listen for its `select` events; load hand meshes through the factory:

```javascript
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

const controller = renderer.xr.getController(0);
controller.addEventListener('select', () => { /* trigger pull */ });
scene.add(controller);

const hands = new XRHandModelFactory();
const hand = renderer.xr.getHand(0);
hand.add(hands.createHandModel(hand, 'mesh'));
scene.add(hand);
```

For grips and ray pointers, `renderer.xr.getControllerGrip(i)` plus `XRControllerModelFactory` renders the physical controller model; the [`webxr_vr_dragging`](https://threejs.org/examples/#webxr_vr_dragging) and `webxr_xr_ballshooter` examples are the canonical references.

## Deploy & target devices

WebXR requires **HTTPS**. The same static hosts and the `cloudflared` quick-tunnel one-liner from the [A-Frame article](/news/aframe-webxr-starter/) apply unchanged:

```bash
cloudflared tunnel --url http://localhost:8080
```

Headsets available at the event, and how three.js reaches them:

- **Meta Quest 3** — Meta Quest Browser: full WebXR — `immersive-vr`, `immersive-ar` passthrough, hand tracking, AR features. The smoothest target.
- **PICO 4 Ultra Enterprise** — the PICO Browser exposes WebXR on the same standalone Android base; several units are on hand at the hackathon. Test the Enter VR flow early, as on any standalone.
- **Apple Vision Pro** — Safari on visionOS: `immersive-vr` with hand and transient-pointer input (no WebXR AR module). Keep interactions hand-first.
- **Snap Spectacles** — the [Browser Lens](https://developers.snap.com/spectacles/about-spectacles-features/webxr): `immersive-ar` with hand tracking, compute-limited.

## Why this fits a 2.5-day hackathon

- **The reference dialect** — most WebXR snippets, Stack Overflow answers, and AI-generated code assume three.js, so help is everywhere.
- **No build step** — the import-map starter runs from a single file; reach for Vite only when the project grows.
- **One scene, every headset** — the same URL runs on Quest 3, PICO, Vision Pro, and Spectacles.
- **A path to splats and video** — three.js loads [Gaussian splats](/news/video-to-gaussian-splats/) and plays [stereo video](/news/spatial-video-capture-to-headset/) in the same scene graph, so a WebXR viewer and an interactive demo share one codebase.

## Useful links

- [Three.js documentation](https://threejs.org/docs/) · [WebXR examples](https://threejs.org/examples/#webxr_xr_ballshooter) · [GitHub](https://github.com/mrdoob/three.js)
- [How to create VR content (three.js manual)](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content) · [WebXR Device API](https://immersiveweb.dev/)
- Related: [A-Frame / WebXR starter](/news/aframe-webxr-starter/) · [Babylon.js WebXR](/news/babylonjs-webxr-starter/) · [Video to Gaussian splats](/news/video-to-gaussian-splats/) · [Spatial video, end to end](/news/spatial-video-capture-to-headset/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
