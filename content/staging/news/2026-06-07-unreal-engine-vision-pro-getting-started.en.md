---
title: "Unreal Engine on Vision Pro — Native visionOS and the Polyarc Fork"
date: 2026-06-07T10:00:00+09:00
slug: "unreal-engine-vision-pro-getting-started"
tag: "STARTER"
summary: "Yes, you can build Apple Vision Pro apps in Unreal Engine 5 today — natively, no pixel-streaming. Epic's support is experimental (full-immersion VR is solid, mixed-reality passthrough is newer and fragile), and Polyarc's UE 5.6 visionOS fork closes the performance gaps. Expect EULA-gated source and a custom-engine build."
---

Unreal Engine completes the Vision Pro engine picture for VisionDevCamp, alongside the [Unity PolySpatial](/news/vision-pro-mixed-reality-unity-polyspatial/) and [native Swift](/news/vision-pro-mixed-reality-realitykit-arkit/) routes. The common belief that "Unreal has no Vision Pro support, only forks" is **out of date** as of 2026 — and the accurate picture matters, because it changes what a hackathon team should realistically target.

## The state of play in 2026

- **Epic ships native visionOS support in mainline UE** — Experimental since **UE 5.4** (full immersion), with **mixed-immersion / passthrough added experimentally in UE 5.5** (Metal rendering, enabled once visionOS 2.0 opened it up). It is genuinely Experimental: expect bugs, performance cliffs, and breaking changes.
- **The prominent fork is Polyarc's visionOS fork** (released February 2026), based on **UE 5.6**. It fixes rendering bugs and adds performance features mainline lacks — fixed foveated rendering, mobile multi-view, layered render targets, reduced render-target memory, Crown-button suspend/resume — that roughly **doubled effective GPU output** in Polyarc's testing. Polyarc shipped a real commercial AVP title (*Glassbreakers*) on it, and submitted a PR to merge the changes back into Epic mainline (~April 2026), so the gap may narrow during the year.

## The realistic hackathon target

For a weekend project, aim at **full-immersion VR**. It is the solid, well-trodden path: a UE5 scene packaged to the headset, rendered with the Metal Desktop Renderer. **Mixed-reality passthrough** is possible but newer and fragile — it only arrived in 5.5/visionOS 2.0, and the underlying Metal-Compositor-Services passthrough has been reported to break in some recent visionOS betas. Treat passthrough as a stretch goal, not the baseline.

## Build flow (native path)

1. **Toolchain:** an **Apple Silicon Mac**, **Xcode 15.3+** (the Polyarc fork supports Xcode through 26), an Apple Developer account, and a Vision Pro paired to the Mac.
2. **Engine:** the native path works with stock UE 5.4/5.5; the fork requires **building a custom engine from source** — an hours-long compile, not a binary install.
3. **Renderer:** use the **Metal Desktop Renderer** and disable iOS mobile rendering. Note that **TSR (Temporal Super Resolution) anti-aliasing is too costly on Apple Silicon** — a documented performance gotcha.
4. **Deploy:** Package Project → Platforms → **Vision OS**, then in Xcode → *Window → Devices and Simulators*, select the Apple Vision Pro and deploy.

## Caveats

- **Native support is real but Experimental** — in both 5.4 and 5.5. Don't expect production stability.
- **Full immersion is the reliable target; MR passthrough is fragile.** Passthrough only arrived in 5.5/visionOS 2.0 and has broken in recent OS betas. For a hackathon, recommend full immersion and flag passthrough as may-break.
- **Real build pain.** Apple Silicon Mac + Xcode + Apple Developer account + paired Vision Pro, and the fork means compiling a custom engine from source.
- **Access is gated.** Unreal Engine source — and any UE fork — lives behind Epic's access-controlled GitHub. Participants must link an Epic account, accept the UE EULA, and be granted access **in advance**; the fork repo is not publicly browsable for this reason.
- **It is not open source.** UE forks inherit the **Unreal Engine EULA**, a custom Epic license — don't call the fork "open source."
- **Pixel streaming is a different, fallback path.** Streaming UE content to AVP over WebXR is not native rendering and has historically had stereo-convergence and stuck-input issues — don't conflate it with the native build.
- **Moving target.** With Polyarc's mainline PR pending, version specifics shift through 2026 — confirm the current UE and visionOS versions close to the event.

## Useful links

- [Polyarc visionOS fork](https://polyarcgames.github.io/) — feature list, immersion modes, Xcode support
- Epic forum — [Polyarc visionOS Fork is Out](https://forums.unrealengine.com/t/polyarc-visionos-fork-is-out/2699827) — branch `polyarc-visionos-5.6`, build notes, mainline PR
- Epic — [Unreal Engine Apple Vision Pro Quick Start Guide](https://dev.epicgames.com/community/learning/tutorials/1JWr/unreal-engine-apple-vision-pro-quick-start-guide) — native package/deploy steps
- [UploadVR — Glassbreakers](https://www.uploadvr.com/glassbreakers-champions-of-moss-release-date/) — the first UE VR game shipped on Vision Pro
- [Vision Pro mixed reality in Unity (PolySpatial)](/news/vision-pro-mixed-reality-unity-polyspatial/) · [Your first Vision Pro mixed-reality scene (Swift)](/news/vision-pro-mixed-reality-realitykit-arkit/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
