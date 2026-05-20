---
title: "From an Image to a Headset Scene: image-blaster → Unity/Unreal → Quest 3 & Vision Pro"
date: 2026-05-22T10:00:00+09:00
slug: "image-blaster-xr-pipeline"
tag: "WORKFLOW"
summary: "Turn one photo into a meshed 3D world with image-blaster, then take it on-device the engine route — import assets into Unity/Unreal/Godot and build to Meta Quest 3 or Apple Vision Pro."
---

Need an environment fast? **[image-blaster](https://github.com/neilsonnn/image-blaster)** (MIT) is a Claude Code skillset that turns a single image into a meshed 3D world in under five minutes. This post covers the **engine route** to a headset — the heavier path, but the one with the best on-device performance and full XR input. (For the lighter browser route, see our [A-Frame / WebXR starter](/news/aframe-webxr-starter/).)

## What image-blaster gives you

Run `claude` in the repo, supply [World Labs](https://platform.worldlabs.ai/) and [FAL](https://fal.ai/) API keys, drop an image in `input/`, and ask Claude to *"blast it and confirm each step with me."* You get:

1. **`.glb` / `.obj` meshes** of the *dynamic* objects (Hunyuan-3D via FAL — tune `--face-count 40000-1500000`, default `50000`; `--generate-type Normal|LowPoly|Geometry`)
2. **`.spz` Gaussian splat** of the *static* environment (World Labs Marble `marble-1.1`)
3. **`.mp3`** ambient loop + per-object SFX (ElevenLabs)

> The skillset is MIT, but it calls paid third-party APIs (World Labs, FAL/Hunyuan, ElevenLabs) — bring API keys and credits. This is also why it pairs well with our [3DGS-from-360°-camera workflow](/news/3dgs-360-camera-workflow/): both end in a Gaussian splat you have to get on-device.

## The engine pipeline (Path B)

**1 · Generate.** `IMAGE-BLAST` your reference image. For headsets, generate meshes with a sane budget — keep `--face-count` modest (≈50k or lower) and consider `LowPoly` for dynamic props.

**2 · Import meshes.** `.glb`/`.obj` import natively into **Unity, Unreal, or Godot**. These are your interactive/dynamic objects and colliders.

**3 · Handle the splat.** The `.spz` environment is the hard part — engines don't render Gaussian splats natively. Convert `.spz` → `.ply` (SuperSplat / spz tooling), then add a splat renderer:

- **Unity → Quest 3:** use a Gaussian-splatting package (e.g. Aras Pranckevičius' UnityGaussianSplatting). It's compute-shader based and mobile/Quest support is experimental — keep splat counts low, test early, and have a **mesh fallback** for the environment.
- **Unreal → Quest 3:** a Gaussian-splat plugin + OpenXR; same perf discipline.
- **Apple Vision Pro:** the toughest target — RealityKit has **no built-in Gaussian-splat rendering**, and Unity **PolySpatial**/visionOS doesn't render splats out of the box. Pragmatic options: (a) ask World Labs Marble for a **mesh export of the environment** and skip splats entirely on AVP, or (b) use a Metal-based splat renderer in a full-immersive Unity/visionOS app. The mesh-only route is by far the faster hackathon path on AVP.

**4 · Wire audio.** Drop the `.mp3` ambient loop on a looping audio source; attach object SFX to the matching props.

**5 · Build to device.**

- **Meta Quest 3** — Unity (URP) or Unreal via **OpenXR**, Android build, hand tracking + controllers. The smoothest engine target.
- **Apple Vision Pro** — Unity **PolySpatial** (shared space) or a fully-immersive visionOS app; favor the mesh environment for performance.

## Hackathon takeaways

- **Meshes are easy; splats are the risk.** The `.glb`/`.obj` outputs drop straight into any engine. The `.spz` environment needs conversion *and* an experimental renderer — on Quest 3 budget it carefully, and on Vision Pro prefer a **mesh environment** unless you've already proven a splat renderer.
- **Lower the face count up front** — regenerating is a one-line flag; re-decimating later is not.
- **Best polish/perf** comes from this engine route; if you just need *something running today* across Quest 3 + Vision Pro, the [WebXR route](/news/aframe-webxr-starter/) is faster to first pixel.

## Useful links

- [image-blaster repository](https://github.com/neilsonnn/image-blaster) (MIT)
- [World Labs](https://platform.worldlabs.ai/) · [FAL](https://fal.ai/)
- Related: [3DGS from a 360° camera](/news/3dgs-360-camera-workflow/) · [A-Frame / WebXR](/news/aframe-webxr-starter/) · [visionOS on-ramp](/news/visionos-2-30-days/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach us via the [Contact](/contact/) page.
