---
title: "Babylon.js: an Engine-Grade Path to WebXR"
date: 2026-05-24T10:00:00+09:00
slug: "babylonjs-webxr-starter"
tag: "STARTER"
summary: "When a WebXR demo needs PBR materials, physics, a GUI, or AR features like hit-testing and hand tracking, Babylon.js is the no-build path that already wraps them. A starter for Quest 3, Vision Pro, and Snap Spectacles."
---

[Babylon.js](https://www.babylonjs.com/) is a full TypeScript 3D engine with first-party WebXR support. It runs the same browsers as the [A-Frame starter](/news/aframe-webxr-starter/) — Meta Quest Browser, Safari on visionOS, the Snap Spectacles Browser Lens — and reaches them with the same single-HTML-file pattern. The difference is depth: Babylon ships PBR materials, physics, a 2D/3D GUI, an Inspector debugger, and a remix-friendly Playground out of the box, all wired into a single WebXR feature manager.

▸ [babylonjs.com](https://www.babylonjs.com/) · [doc.babylonjs.com](https://doc.babylonjs.com/) · [Playground](https://playground.babylonjs.com/) · [GitHub](https://github.com/BabylonJS/Babylon.js) (Apache-2.0, **v9.8.0**, 25.5k★)

## When to pick Babylon over A-Frame

| | A-Frame | Babylon.js |
|---|---|---|
| Authoring style | Declarative (`<a-scene>`, components) | Imperative (TypeScript / JavaScript) |
| Best for | Quick scenes, entity-component patterns | Engine-grade demos: PBR, physics, GUI, post-processing |
| AR features | Via community components | First-party `WebXRFeaturesManager` (hit-test, anchors, planes, meshes, hand input, light estimation, depth) |
| Tooling | Inspector via plugin | Built-in Inspector + browser Playground |
| TypeScript | Possible | Native |

Pick A-Frame when an HTML file with a few `<a-entity>` tags is enough. Pick Babylon when the demo needs the engine surface — physics-driven objects, baked PBR lighting, an in-scene GUI, or AR anchors and hit-testing.

## The starter — one HTML file, no build step

```html
<!DOCTYPE html>
<html><body style="margin:0">
  <canvas id="c" style="width:100%;height:100vh"></canvas>
  <script src="https://cdn.babylonjs.com/babylon.js"></script>
  <script>
    const canvas = document.getElementById('c');
    const engine = new BABYLON.Engine(canvas, true);
    const scene  = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 1.6, -3), scene);
    camera.attachControl(canvas, true);
    new BABYLON.HemisphericLight('h', new BABYLON.Vector3(0, 1, 0), scene);
    BABYLON.MeshBuilder.CreateBox('b', { size: 0.4 }, scene).position.y = 1.5;

    // One line enables VR with controllers, hands, teleport, pointer:
    scene.createDefaultXRExperienceAsync({
      uiOptions: { sessionMode: 'immersive-vr' }
    });

    engine.runRenderLoop(() => scene.render());
    addEventListener('resize', () => engine.resize());
  </script>
</body></html>
```

`createDefaultXRExperienceAsync` injects the Enter VR/AR button, configures the XR camera, and wires controllers + teleportation in one call. For AR passthrough, pass `sessionMode: 'immersive-ar'` (and usually `referenceSpaceType: 'local-floor'`). For production, replace the CDN with the npm package — `npm i babylonjs` or the tree-shakable ES6 packages.

The [Playground](https://playground.babylonjs.com/) is the quickest way to iterate without any local setup: write code in the browser, share a URL, fork community examples.

## AR features through the feature manager

Babylon exposes every WebXR module through a single API. Enable what the demo needs after the XR experience is created:

```javascript
const xr = await scene.createDefaultXRExperienceAsync({
  uiOptions: { sessionMode: 'immersive-ar', referenceSpaceType: 'local-floor' }
});
const fm = xr.baseExperience.featuresManager;
const hitTest      = fm.enableFeature(BABYLON.WebXRFeatureName.HIT_TEST,         'latest');
const anchors      = fm.enableFeature(BABYLON.WebXRFeatureName.ANCHOR_SYSTEM,    'latest');
const planes       = fm.enableFeature(BABYLON.WebXRFeatureName.PLANE_DETECTION,  'latest');
const handTracking = fm.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING,    'latest', { xrInput: xr.input });
```

Hit test, anchors, plane / mesh detection, light estimation, depth sensing, image tracking, hand tracking (WebXR Hand Input), DOM overlay, and layers are all opt-in features behind this manager.

## Deploy & target devices

WebXR requires **HTTPS**. Static host options (GitHub Pages, Vercel, Cloudflare Pages) and the local-tunnel options from the [A-Frame article](/news/aframe-webxr-starter/) apply unchanged — including the `cloudflared` quick-tunnel one-liner for fast headset iteration:

```bash
cloudflared tunnel --url http://localhost:8080
```

Same three WebXR targets:

- **Meta Quest 3** — Meta Quest Browser: full WebXR (immersive-vr, immersive-ar passthrough, hand tracking, AR features). Smoothest target.
- **Apple Vision Pro** — Safari on visionOS: immersive-vr with hand / transient-pointer input. Test the Enter VR flow early; keep interactions simple.
- **Snap Spectacles** — [Browser Lens](https://developers.snap.com/spectacles/about-spectacles-features/webxr): immersive-ar with hand tracking. Hit-testing is currently emulated; design around hands rather than gamepads.

## Why this fits a 2.5-day hackathon

- **Engine depth without engine setup** — PBR, physics, GUI and AR features are all behind small imperative calls; no build, no plugin install.
- **Playground for collaboration** — fork an example, share a URL, demo to teammates in seconds.
- **One codebase, three targets** — the same Vite/CDN bundle runs on Quest 3, Vision Pro, and Spectacles from the same URL.
- **TypeScript-first** — large parts of the API are typed, which pays off when a project grows past a single file.

## Useful links

- [Babylon.js documentation](https://doc.babylonjs.com/) · [Playground](https://playground.babylonjs.com/) · [GitHub](https://github.com/BabylonJS/Babylon.js)
- [Babylon WebXR deep dive](https://doc.babylonjs.com/features/featuresDeepDive/webXR) · [WebXR Device API](https://immersiveweb.dev/)
- Related: [A-Frame / WebXR starter](/news/aframe-webxr-starter/) · [Snap Spectacles & Lens Studio](/news/getting-started-snap-spectacles-lens-studio/) · [Android XR getting-started](/news/androidxr-getting-started/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
