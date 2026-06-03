---
title: "One Photo to a 3D Splat — Apple's LiTo into WebXR"
date: 2026-06-03T12:00:00+09:00
slug: "lito-single-image-3dgs-webxr"
tag: "WORKFLOW"
summary: "Apple Research's LiTo turns a single image into a 3D Gaussian splat that preserves view-dependent lighting, exportable as PLY. Here's a realistic single-image → splat → WebXR pipeline — and an honest account of why it is a PyTorch research model, not a Vision Pro tool, and what getting it onto Apple Vision Pro actually costs."
---

[**LiTo**](https://machinelearning.apple.com/research/lito) (Surface Light Field Tokenization) is an Apple Machine Learning Research project, accepted to ICLR 2026, that generates a **3D object from a single input image** — and unlike most image-to-3D methods, it captures *view-dependent appearance*: specular highlights, reflections, and Fresnel effects, with geometry and lighting cleanly separated. Its native output is a **3D Gaussian splat**, which makes it a natural fit for the splat-to-XR pipelines we have been covering.

## What it actually is

Be precise about the tool before building on it. LiTo is a **PyTorch research codebase** with two models — a point-cloud tokenizer and an image-to-3D diffusion transformer — plus pretrained checkpoints and a runnable FastAPI demo ([repo](https://github.com/apple/ml-lito), [paper](https://arxiv.org/abs/2603.11047)). It is **not** a Swift library, a Core ML model, or a visionOS component; the repository contains no Apple-platform code despite being published by Apple.

It is also GPU-heavy: roughly 5 seconds per image on an H100, ~160 seconds on an M4 Max. It runs on Apple Silicon, but it is a workstation/cloud model, not an on-device one.

**Licensing:** LiTo ships under Apple's research sample-code license — *not* MIT/BSD/Apache — with separate terms for the model weights (`LICENSE_MODEL`) and generated samples (`LICENSE_generated_samples`). Treat output as research-use unless you have cleared the terms; do not assume it is free to ship.

## The realistic pipeline: image → splat → WebXR

The honest connection to XR runs through the **output format**, not through any Apple integration:

1. Run the LiTo demo locally (Apple Silicon works, slowly) or on a rented NVIDIA GPU, feeding it a single image.
2. Export the result as a Gaussian-splat **`.ply`** — the reconstruction notebook saves PLY directly, and a community [ComfyUI wrapper](https://github.com/PozzettiAndrea/ComfyUI-LiTo) adds an explicit "export PLY" node for a single-image → splat flow.
3. Load that PLY in a WebXR splat renderer — [SuperSplat](https://superspl.at/editor) to publish a headset-ready viewer, or [Spark](https://sparkjs.dev/) / [Babylon.js](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting) for a code-level build. These run in the **Quest 3 browser** and in **Vision Pro Safari** (WebXR enabled in feature flags).

That is a concrete, buildable demo: a photograph becomes a splat you can walk around in a headset, with LiTo's view-dependent lighting intact.

## The Vision Pro caveat

Getting LiTo content *natively* into Apple Vision Pro is the hard, lossy part. RealityKit and PolySpatial have **no native Gaussian-splat renderer**, and LiTo provides no conversion. The two routes both have a cost:

- **Third-party Metal splat renderer** (e.g. [MetalSplatter](https://github.com/scier/MetalSplatter)) — preserves the splat, but means Swift/Metal work outside Apple's stock frameworks.
- **Convert the splat to a textured mesh → USDZ** — drops into RealityKit cleanly, but **throws away the view-dependent lighting that is LiTo's entire point.**

So treat Vision Pro as a caveated stretch goal. The solid, demonstrable result is **single image → LiTo splat → WebXR**, which works in a headset browser today.

## Caveats

- **Not an Apple Vision Pro / Core ML tool.** Being an Apple Research repo doesn't make it AVP tooling — it is server-class PyTorch with no on-device path.
- **Research license, not open-source.** Check `LICENSE`, `LICENSE_MODEL`, and `LICENSE_generated_samples` before reusing output.
- **Heavy.** Seconds on a datacenter GPU, minutes on a laptop — plan compute accordingly.
- **Splat delivery applies as always:** budget gaussian count for headset framerate, expect a possible orientation fix on import.

## Useful links

- [LiTo project page (interactive 3DGS demos)](https://apple.github.io/ml-lito/) · [Apple ML Research](https://machinelearning.apple.com/research/lito)
- [apple/ml-lito repository](https://github.com/apple/ml-lito) · [paper (arXiv)](https://arxiv.org/abs/2603.11047)
- [ComfyUI-LiTo (single image → splat → PLY)](https://github.com/PozzettiAndrea/ComfyUI-LiTo)
- [SuperSplat](https://superspl.at/editor) · [Spark](https://sparkjs.dev/) · [Babylon.js Gaussian Splatting](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting)
- [MetalSplatter (native visionOS)](https://github.com/scier/MetalSplatter)
- [Phone-captured Gaussian splats — Scaniverse into WebXR and Godot](/news/scaniverse-3dgs-webxr-godot/) — the capture-based counterpart
- [Image-blaster → engine → headset](/news/image-blaster-xr-pipeline/) — another AI-asset-to-XR route
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
