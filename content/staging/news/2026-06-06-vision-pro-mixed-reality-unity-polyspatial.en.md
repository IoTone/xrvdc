---
title: "Vision Pro Mixed Reality in Unity — Getting Started with PolySpatial"
date: 2026-06-06T10:00:00+09:00
slug: "vision-pro-mixed-reality-unity-polyspatial"
tag: "STARTER"
summary: "Build Apple Vision Pro passthrough mixed reality in Unity — no Swift required — with PolySpatial and the visionOS XR plugin. The day-one decision is which app mode you target; this walks the four modes and the two things teams get wrong: the Unity Pro license gate and the Shader Graph / MaterialX limits."
---

If your team builds in Unity rather than Swift, Apple Vision Pro mixed reality runs through [**Unity PolySpatial**](https://docs.unity3d.com/Manual/visionOS.html) and the visionOS XR plugin. You can put virtual objects on a real table — passthrough and all — without writing a line of RealityKit. The catch is that the day-one decision is which **app mode** you target, because that single choice locks in your packages, your license tier, and your rendering path. This is the starter that makes that decision for you.

## The key idea: simulate in Unity, render in RealityKit

For mixed reality, **Unity does not render the frame**. It simulates the scene and sends commands to RealityKit, visionOS's system renderer, which draws it over passthrough. That one fact is the root of nearly every limitation below — it is why custom shaders and screen-space effects don't simply carry over.

## Choose your app mode

1. **Windowed** — 2D/3D content in the Shared Space, alongside other apps. No PolySpatial, no Pro license.
2. **Bounded volume (MR)** — RealityKit-rendered 3D in a fixed box that coexists with other apps.
3. **Unbounded volume (MR)** — RealityKit with **passthrough** and full ARKit access (planes, mesh, hands, images). This is the mixed-reality target.
4. **Fully Immersive (VR)** — Unity renders directly via **Metal** compositor surfaces; no passthrough by default.

**Hybrid** apps can switch RealityKit ⇄ Metal at runtime, but a Metal camera and an Unbounded RealityKit camera **cannot be active at the same time**. (To get passthrough in Metal mode you set `ImmersionStyle = Mixed`, camera `Clear Flags = Solid Color`, and that color's **alpha = 0**.)

For an MR hackathon build, the answer is almost always **Unbounded volume**.

## Packages and input

MR needs three packages — `com.unity.xr.visionos`, `com.unity.polyspatial.visionos`, and `com.unity.polyspatial.xr`. (VR-only needs just the first.) You do **not** use the iOS `com.unity.xr.arkit` package; ARKit features arrive through the visionOS XR plugin and **AR Foundation** — plane detection, scene-reconstruction mesh, image tracking, and hand tracking (via XR Hands).

There are no controllers. Interaction is **gaze + pinch** ("indirect pinch"), plus direct poke and pinch within arm's reach, exposed through the `SpatialPointerDevice` in the new Input System. An object needs a collider on the **PolySpatial Input** layer to receive 3D touch; the XR Interaction Toolkit works via `XRSpatialPointerInteractor`.

## Caveats

- **MR and VR apps require Unity Pro, Enterprise, or Industry.** This is real and still in force. A team on **Unity Personal/Free cannot ship a passthrough MR app.** The only free route is a **Student or Educator** plan — and since January 2025, Student licenses automatically get Pro-level editor access for visionOS. Verify every teammate's license before the event; this is the number-one practical gotcha.
- **You can't bring arbitrary custom shaders.** ShaderLab/HLSL is not supported in MR mode. Author with **Shader Graph**, which is converted to **MaterialX** — and only a *subset* of nodes have a MaterialX analog (unsupported nodes are flagged with a `#` in the editor). Effects relying on grab-pass, custom render passes, or post-processing generally do not translate to RealityKit. "My Unity shader just works" is the most common wrong assumption.
- **The simulator can't do the interesting MR parts.** Plane detection, scene mesh, image tracking, and real hand/world data need the **physical device**. Budget at least one Vision Pro per team or a sharing schedule.
- **MR vs Fully-Immersive is a real trade-off.** RealityKit MR gives passthrough and ARKit features but a *translated subset* of Unity rendering; Metal/VR gives full Unity rendering power but loses native passthrough convenience. Hybrid bridges them — but not simultaneously.
- **Mind the UV/material details.** RealityKit's MaterialX uses only the first two UV channels, and visionOS materials don't support global shader properties natively (PolySpatial patches them per-instance — a performance consideration).
- **Hardware cost / version churn.** Apple Vision Pro is ~US$3,499 and not universally available. PolySpatial moves fast (0.x → 3.x in about two years) — pin your package and Unity LTS version (Unity 6.x LTS is the current line; requires an Apple Silicon Mac, Xcode 16+, visionOS 2.0 SDK+, Linear color space, URP recommended) and don't trust old tutorials' exact menu paths.

## Useful links

- [Unity Manual — visionOS](https://docs.unity3d.com/Manual/visionOS.html) — app types, license gating, packages
- [PolySpatial visionOS — Getting started](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@3.1/manual/GettingStarted.html) · [Requirements](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@2.4/manual/Requirements.html)
- [Hybrid apps — bounded/unbounded/Metal & passthrough](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@2.4/manual/PolySpatialHybridApps.html)
- [Shader Graph → MaterialX limits](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@1.0/manual/ShaderGraph.html) · [Input / spatial pointer](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@1.1/manual/Input.html)
- [Unity Learn — Developing for visionOS](https://learn.unity.com/tutorial/developing-for-vision-os-with-unity) — hands-on tutorial
- [Image-blaster → engine → headset](/news/image-blaster-xr-pipeline/) — the Unity/Unreal/Godot delivery route for AI-generated worlds
- [Your first Vision Pro mixed-reality scene](/news/vision-pro-mixed-reality-realitykit-arkit/) — the native Swift alternative
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
