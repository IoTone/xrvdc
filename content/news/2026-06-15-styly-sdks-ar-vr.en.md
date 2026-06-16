---
title: "Every STYLY SDK for AR and VR — the Whole Toolchain Map"
date: 2026-06-15T10:00:00+09:00
slug: "styly-sdks-ar-vr"
tag: "STARTER"
summary: "STYLY, the Japanese spatial-layer platform, lets you author a scene once and play it across mobile AR, the web, Quest, and Vision Pro. But 'the STYLY SDK' is really four authoring tools and two incompatible Unity toolchains, with one rule across all of them: no custom C#. Here is the full map — every SDK, which AR and VR targets each reaches, and the constraints to design around before the hackathon."
---

[STYLY](https://styly.cc/) (by Tokyo's **Psychic VR Lab / STYLY, Inc.**) is a *spatial-layer* platform: you upload assets or a scene to its cloud, and STYLY runs them in its own runtime across a long list of devices — mobile AR, the browser, VR headsets, and Apple Vision Pro. For a bilingual hackathon it is an appealing shortcut, especially in Japan where STYLY is widely used. But "the STYLY SDK" is not one thing. It is **a no-code web editor, two separate and mutually incompatible Unity plugins, and a browser WebAR tool** — and one rule runs through all of them: **you cannot ship custom C#.** This is the full toolchain map, with each tool's AR and VR reach.

> One disambiguation up front: this is **styly.cc** (Psychic VR Lab's XR platform), not **styly.io** (an unrelated interior-design AI). Everything here is the XR platform.

▸ [STYLY docs](https://document.styly.cc/) · [github.com/styly-dev](https://github.com/styly-dev) · [STYLY Studio / Gallery](https://gallery.styly.cc/)

## The mental model

Author once, play many places. You build a scene either **in the browser (STYLY Studio)** or **in Unity (one of two plugins)**, publish it to the **STYLY Gallery**, and viewers open it — by URL, QR code, or a scanned STYLY marker — in whichever STYLY client matches their device. The catch is that the *authoring* side forks by target: the tool you pick is dictated by whether you are shipping to Vision Pro or to everything else.

## The authoring tools (the actual SDKs)

### 1. STYLY Studio — no-code, browser, free

The zero-install entry point. A browser scene builder: import models and media, place and arrange them with **Modifiers**, optionally edit from inside VR, and publish in one click. Supported imports are **glTF (.glb/.zip), FBX, OBJ, and .blend** for 3D, **PNG/JPEG/GIF** for images, **MP3** for audio, and **YouTube** for video. No Unity required, and it reaches both AR and VR clients. This is the fastest path to a working demo.

### 2. STYLY Plugin for Unity (classic) — VR, mobile AR, and web

The workhorse for everything except Vision Pro. A `.unitypackage` (from [styly.cc/download](https://styly.cc/download/)) that uploads Unity **prefabs and scenes** to the STYLY cloud, where they join your Studio assets. The important specifics:

- **Unity version is target-dependent:** **2022.3.24f1** for mobile (iOS/Android), the Web Player, STYLY Studio, **Quest 2/3**, and PICO 4; **2019.4.29f1** for Steam, VIVEPORT, VIVE Flow/XR Elite, XREAL, and SR Display.
- **Render pipeline: Built-in (Legacy) only, color space Gamma.** No URP/HDRP, no VFX Graph.
- **What survives upload:** Timeline (with audio tracks), the Shuriken particle system, Animator clips, audio, *baked* lighting and reflection probes, skyboxes, and custom **Built-in-pipeline shaders**.
- **What does not: custom C# `MonoBehaviour` scripts.** STYLY strips them "for security reasons." This is the single biggest constraint, so logic comes from one of two no-code systems below.

### 3. Scripting on the classic path — PlayMaker or the Interaction SDK

Because there is no C#, interactivity is wired visually:

- **PlayMaker** (STYLY bundles a pinned **1.9.2f3**) with STYLY-custom actions like `ChangeStylyScene`, `OpenURL`, and `GetHttpRequest`. STYLY injects PlayMaker **global events** for VR controller input — grip/trigger/touchpad `PressDown`/`PressUp`. Note those controller events fire only in the VR app, not in the web or mobile players.
- **STYLY Interaction SDK** — attribute components (`STYLY_Attr_Draggable`, `STYLY_Attr_ColliderTrigger`, `STYLY_Action_Spawner`, `STYLY_Action_Mover`, and more) that hook Unity's event system without PlayMaker. The **UI Pointer Click** path works across VR, web Studio, *and* smartphone — it is your one portable tap interaction.

### 4. STYLY Spatial Layer Plugin — Apple Vision Pro (a separate world)

Vision Pro uses an entirely different, modern toolchain that **does not share render pipeline, Unity version, or logic system with the classic plugin**, and its content does not run on the other platforms. From [github.com/styly-dev](https://github.com/styly-dev/STYLY-Spatial-Layer-Plugin):

- **Package:** `com.styly.styly-spatial-layer-plugin` via OpenUPM (`openupm add -f com.styly.styly-spatial-layer-plugin`), currently around v0.6.x.
- **Unity 6** (6000.0.x), **URP + Linear** color space — the exact opposite of the classic plugin's Built-in/Gamma.
- **Volumes:** Bounded (a 1×1×1 m volume that coexists with other apps) or Unbounded (exclusive MR space).
- **Scripting: Unity Visual Scripting only** — again no C#, no PlayMaker. It ships custom VS nodes (VRM, glTFast, WebRequest, Spectrum) and an **STYLY-XR-Rig**.
- **Companions:** `STYLY-Hands-Unity` (hand-gesture tracking), `STYLY-NetSync` (multi-user/LBE), and an enterprise camera-access plugin (Vision Pro + PICO 4).

### 5. STYLY WebAR — no-code browser AR, no app

The newest tool (launched **May 19, 2026**), built on the **palanAR** product STYLY acquired in its 2025 merger with palan, Inc. App-free AR in a mobile browser, authored no-code and distributed by **URL/QR**, with **12 AR types** (marker, image, plane, markerless, face, hand, GPS, portal, volumetric, sky, photo-frame, coloring-book) and a genuine free tier. *(A deeper, partner-contributed piece on STYLY WebAR is planned separately; this overview covers it at a glance.)*

A historical note to avoid confusion: **"NEWVIEW SDK"** was the old name for the classic Unity plugin, tied to STYLY's NEWVIEW creative awards — it is the same lineage, not a separate download.

## Where it runs — AR targets

- **STYLY Mobile app (iOS/Android)** — free; reaches the phone via the in-app gallery, a scanned STYLY marker, or a deep-link URL. Supports **marker and markerless plane** AR, plus **location AR** through **Immersal** scans and **City Anchor**, which uses **Google VPS** for accurate placement rather than raw GPS. (It doubles as a no-headset VR viewer too.)
- **STYLY WebAR** — browser AR, no install, the 12 types above.
- **AR glasses** — **XREAL and SR Display are confirmed targets**; STYLY ran on Nreal Light historically. **Snap Spectacles, HoloLens, Magic Leap, and Android XR are *not* confirmed** — if a team plans a [Spectacles](/news/vibe-coding-spectacles/) build, STYLY is not a documented path, so treat that as a gap.

## Where it runs — VR targets

- **Meta Quest 2/3 and PICO 4 / 4 Ultra** — free standalone STYLY app, scenes launched from the Gallery.
- **SteamVR / PCVR** — free app since 2017 (Rift, VIVE, Index, Windows MR); VIVEPORT historically.
- **Apple Vision Pro** — a **separate** "STYLY for Vision Pro" app (free, visionOS 26+), fed by the Spatial Layer plugin pipeline. It is explicitly *not compatible with legacy STYLY* content — a distinct world, as above.
- **Web** — a non-immersive browser **Web Player** (WASD/magic-window) on any desktop, plus embeddable scenes. STYLY has demonstrated **Unity WebXR**, but true "Enter VR" immersive WebXR in a headset browser is **not broadly documented** — verify before depending on it.

## Constraints to design around

- **No custom C#, anywhere.** Both Unity plugins strip it. If your idea needs real per-frame logic or external libraries, STYLY is the wrong tool — design for PlayMaker / Interaction SDK / Visual Scripting instead.
- **Two toolchains, one fork.** Classic (Unity 2022.3, Built-in, Gamma, PlayMaker) and Spatial Layer (Unity 6, URP, Linear, Visual Scripting) share nothing, and Vision Pro content is siloed from the rest. Pick your target device first; it picks your toolchain.
- **Immersive headset-browser WebXR is unconfirmed.** The web story is the Web Player and WebAR; do not assume "Enter VR" works in a Quest browser without testing.
- **Spectacles is unsupported.** No STYLY path found as of June 2026.

## Pricing, AI, and the 2026 picture

The creator tier is **free** (with a STYLY logo and non-commercial limits); **Business is $799/mo** (commercial use, location alignment, analytics, access control); **Enterprise** is custom. On AI, STYLY's generative story is **asset generation, not scene generation** — a **Tripo AI** partnership for text/image-to-3D models (tightening into WebAR around June 2026), not a build-the-whole-scene feature. The broader 2025–26 arc: **STYLY World Canvas** (publish to any city worldwide, June 2025), the **STYLY × palan merger** (full integration targeted end-2026), and the **WebAR rebrand** (May 2026). The Vision Pro app is actively maintained on Unity 6.

## Useful links

- [STYLY documentation](https://document.styly.cc/) · [Creator plugin intro](https://document.styly.cc/doc/docs/en-US/creator/creator_plugin_intro/) · [Plugin download](https://styly.cc/download/)
- [github.com/styly-dev](https://github.com/styly-dev) · [Spatial Layer Plugin (Vision Pro)](https://github.com/styly-dev/STYLY-Spatial-Layer-Plugin) · [STYLY WebAR](https://webar-editor.styly.cc/)
- [STYLY Studio / Gallery](https://gallery.styly.cc/) · [Business plans & device matrix](https://gallery.styly.cc/business/en) · [NEWVIEW awards](https://newview.design/en/)
- Related: [Developing for XREAL glasses](/news/xreal-android-xr-glasses/) · [Immersive Web SDK](/news/immersive-web-sdk-ai-native/) · [WebSpatial SDK for visionOS](/news/webspatial-sdk-visionos/) · [A-Frame WebXR starter](/news/aframe-webxr-starter/) · [ViroReact for React Native AR](/news/reactvision-react-native-ar/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
