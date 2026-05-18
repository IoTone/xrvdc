---
title: "A-Frame: the Fastest Way into WebXR (Quest 3, Vision Pro & Spectacles)"
date: 2026-05-20T10:00:00+09:00
slug: "aframe-webxr-starter"
tag: "STARTER"
summary: "One HTML file, no build step, runs across headsets: an A-Frame WebXR starter and honest guidance on targeting Meta Quest 3, Apple Vision Pro, and Snap Spectacles."
---

If you want a working headset demo with **zero toolchain**, WebXR via **A-Frame** is the shortest path. It's a declarative web framework on top of three.js + WebXR — you describe a scene with HTML-like tags and the browser handles the headset.

▸ [aframe.io](https://aframe.io/) · [github.com/aframevr/aframe](https://github.com/aframevr/aframe) (MIT, v1.7.1)

## The entire starter

A complete WebXR scene is a single HTML file — no npm, no bundler:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://aframe.io/releases/1.7.1/aframe.min.js"></script>
  </head>
  <body>
    <a-scene>
      <a-box position="0 1.5 -3" color="#ff006e"></a-box>
      <a-sphere position="1 1.5 -4" color="#00d4ff"></a-sphere>
      <a-sky color="#1a0f08"></a-sky>
    </a-scene>
  </body>
</html>
```

A-Frame automatically injects an **Enter VR / Enter AR** button. For a structured starting point, fork the official [aframe-boilerplate](https://github.com/aframevr/aframe-boilerplate) or work through [Building a Basic Scene](https://aframe.io/docs/1.7.0/guides/building-a-basic-scene.html) in the docs. The component ecosystem (physics, hand controls, environment, networked-aframe for multiplayer) covers most hackathon needs.

## Deploy & target devices

WebXR requires **HTTPS**. Host the file on any static host (GitHub Pages, Vercel, Glitch) and open the URL in the headset's browser:

- **Meta Quest 3** — Meta Quest Browser has full WebXR: `immersive-vr`, `immersive-ar` passthrough, and hand tracking. Open the URL, tap **Enter VR/AR**. This is the smoothest target.
- **Apple Vision Pro** — Safari on visionOS supports WebXR (`immersive-vr`) with hand/transient-pointer input. Support is newer than Quest's, so test the **Enter VR** flow early and keep interactions simple.
- **Snap Spectacles** — supported via the **[Spectacles Browser Lens](https://developers.snap.com/spectacles/about-spectacles-features/webxr)**. WebXR apps run directly in that browser — no Lens Studio required — in `immersive-ar` mode with **hand tracking** as the primary input. Caveats per Snap's docs: hit-testing is currently emulated (full native planned), and WebXR gamepads aren't practically usable, so design around hands. For deeper *native* integration the Lens Studio route remains an option — see our [Spectacles & Lens Studio starter](/news/getting-started-snap-spectacles-lens-studio/).

## Why this fits a 2.5-day hackathon

- **No build step** — edit HTML, refresh the headset browser, iterate in seconds.
- **One codebase, three targets** — the same URL runs on Quest 3, Vision Pro, and Spectacles (mind each platform's input/mode notes above).
- **Huge component library** — bolt on physics, networking, and controllers instead of writing engine code.

## Useful links

- [A-Frame documentation](https://aframe.io/docs/) · [aframe-boilerplate](https://github.com/aframevr/aframe-boilerplate)
- [WebXR Device API](https://immersiveweb.dev/)
- Spectacles: [WebXR / Browser Lens (Snap docs)](https://developers.snap.com/spectacles/about-spectacles-features/webxr) · [Spectacles & Lens Studio (native)](/news/getting-started-snap-spectacles-lens-studio/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach us via the [Contact](/contact/) page.
