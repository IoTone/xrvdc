---
title: "WebSpatial SDK — When the Web App Becomes a Native Spatial App"
date: 2026-05-26T10:00:00+09:00
slug: "webspatial-sdk-visionos"
tag: "STARTER"
summary: "WebSpatial is a polyfill-style SDK that extends HTML/CSS/DOM with spatial primitives and ships a React app as a native visionOS spatial app. Distinct from the WebXR-in-a-browser path covered earlier in the series."
---

The WebXR articles in this series — [A-Frame](/news/aframe-webxr-starter/), [Babylon.js](/news/babylonjs-webxr-starter/), [Immersive Web SDK](/news/immersive-web-sdk-ai-native/) — all run inside a browser's WebXR session. **WebSpatial** takes a different shape: a small set of extensions to HTML/CSS/DOM plus a polyfill-style SDK that lets a React app ship as a **native spatial app**, currently targeting **Apple Vision Pro / visionOS**. The Web framework you already know becomes a first-class window manager on the headset.

▸ [webspatial.dev](https://webspatial.dev/) · [github.com/webspatial/webspatial-sdk](https://github.com/webspatial/webspatial-sdk) · MIT · TypeScript · W3C alignment via [TPAC 2025 prototype](https://tpac2025.webspatial.dev/)

## The "2D containing 3D" model

Native spatial apps are usually written from scratch in RealityKit or Unity PolySpatial. WebSpatial inverts that: it keeps the Web's 2D layout as the host and lets specific elements break out into real-world volume. Mainstream Web mental model and tooling stay intact; spatial primitives are added rather than substituted. The project's framing: *"HTML content on spatial computing platforms can break free from the screen, enter real space, gain real volume, support natural spatial interactions and flexible 3D programming, while preserving the Web's original cross-platform nature, mental model, and development workflow."*

A practical consequence: the existing React skill set transfers directly. There's no engine layer to learn.

## The SDK surface

WebSpatial ships as four coordinated packages:

| Package | Role |
|---|---|
| `@webspatial/react-sdk` | React components, CSS APIs, DOM APIs, events, scene options |
| `@webspatial/core-sdk` | Underlying runtime-facing SDK (lower-level entry point) |
| `@webspatial/builder` | CLI: `run`, `build`, `publish` — bundles the Web app and produces the target platform's app shell |
| `@webspatial/platform-visionos` | visionOS runtime package consumed by Builder |

Apps query the active shell at runtime with `WebSpatialRuntime.supports(name, tokens?)` from `@webspatial/react-sdk`, so a single codebase can branch on what the current host supports.

## Setup

**Requirements:** Node.js 22+ and pnpm 9+. The visionOS publish path also requires Xcode and an Apple Developer account (App Store Connect for distribution).

A typical loop:

```bash
# install
pnpm add @webspatial/react-sdk @webspatial/core-sdk @webspatial/builder
pnpm add -D @webspatial/platform-visionos

# develop in the browser polyfill
pnpm webspatial run

# build for visionOS
pnpm webspatial build

# publish (Xcode + App Store Connect required)
pnpm webspatial publish
```

The polyfill in `run` mode renders a 2D approximation of the spatial scene in a normal browser, which means most of the iteration loop stays at the desktop. The headset is reserved for verifying spatial behaviour and final polish.

## Where it fits in the series

| Path | Runs in | Output | Best for |
|---|---|---|---|
| A-Frame / Babylon.js / IWSDK | Browser's WebXR session | Page on a URL | Cross-headset WebXR from any HTTPS host |
| [Android XR](/news/androidxr-getting-started/) | Android XR runtime | APK | Jetpack XR / Compose XR teams targeting AndroidXR devices |
| **WebSpatial** | visionOS runtime | Native visionOS .app | React teams targeting Apple Vision Pro with a Web-style mental model |

## Caveats to plan around

- **Platform package is visionOS today.** The published `@webspatial/platform-*` set currently covers visionOS. Other targets (Android XR, Pico, Quest) would need their own platform package, which isn't shipped as of this writing — confirm the package set before committing to a multi-platform plan.
- **Toolchain expectations.** Node 22+, pnpm 9+, and the standard Xcode publish flow for visionOS. Lock those in your project README so a teammate cloning the repo isn't blocked.
- **The spec is moving.** TPAC 2025 prototype + W3C alignment are recent. Pin SDK versions and follow the project's changelog.

## Hackathon takeaways

- **One stack for the team's existing React skills** — no engine onboarding.
- **Iterate in the desktop polyfill**, validate on the headset. Shorter feedback loop than a full Xcode-rebuild cycle for every change.
- **Pairs with the WebXR articles** when a project needs a Web-shaped UI that also reaches Quest 3 in a browser session — keep the WebXR build for the browser targets, ship the same React UI as a native visionOS app via WebSpatial Builder.

## Useful links

- [webspatial.dev documentation](https://webspatial.dev/docs/introduction/getting-started)
- [WebSpatial SDK on GitHub](https://github.com/webspatial/webspatial-sdk)
- [TPAC 2025 prototype + spec direction](https://tpac2025.webspatial.dev/)
- Related: [A-Frame WebXR](/news/aframe-webxr-starter/) · [Babylon.js WebXR](/news/babylonjs-webxr-starter/) · [Immersive Web SDK](/news/immersive-web-sdk-ai-native/) · [Android XR getting-started](/news/androidxr-getting-started/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
