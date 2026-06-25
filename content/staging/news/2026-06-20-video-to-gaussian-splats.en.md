---
title: "Video to Gaussian Splats — Turn a Clip into a Walkable Scene"
date: 2026-06-20T10:00:00+09:00
slug: "video-to-gaussian-splats"
tag: "WORKFLOW"
summary: "A video clip is already a multi-view capture rig — walk a phone around an object and the frames hold enough parallax to train a 3D Gaussian splat. Here is the practical weekend path: extract frames, train with Postshot or Nerfstudio, export a .ply or .splat, and view it in WebXR — plus where 4D (moving) splats stand."
---

For a videographer or photographer, the most direct route from footage to an XR scene is **Gaussian splatting**. The [photo-to-splat](/news/sharp-photo-to-splat-webxr/) and [phone-scan](/news/scaniverse-3dgs-webxr-godot/) pipelines covered earlier start from stills or a dedicated scanner; this one starts from a **video clip**, which most creatives already shoot. A slow orbit around a subject is, frame for frame, the same multi-view input a photogrammetry rig produces — and modern tooling turns it into a splat that loads straight into the [WebXR viewers](/news/threejs-webxr-starter/) the rest of the camp uses.

▸ [Postshot](https://www.jawset.com/) · [Nerfstudio + gsplat](https://docs.nerf.studio/) · [Brush (cross-platform)](https://github.com/ArthurBrussee/brush) · [SuperSplat editor/viewer](https://superspl.at/)

## Two regimes: static scene vs. moving subject

The fork that catches everyone: **is the subject still, or moving?**

- **Static scene (3DGS)** — the camera moves, the world holds still. A walk-around of a statue, a room, a product. This is the solved, weekend-friendly case: ordinary 3D Gaussian splatting, the same as a photo set.
- **Moving subject (4DGS)** — a person talking, water, anything that changes between frames. This needs **4D Gaussian splatting** — splats with a time dimension — and it is still research-grade: [4DGaussians](https://github.com/hustvl/4DGaussians), [Deformable-3DGS](https://github.com/ingra14m/Deformable-3D-Gaussians), and Luma-style volumetric capture. Heavier to train, fussier to view. Treat it as a stretch goal.

For a 2.5-day build, **shoot for the static case**: pick a subject that does not move and orbit it.

## Capture for splatting

The training cares about parallax and coverage, not cinematography:

- **Move, don't zoom.** Physically circle the subject; keep focal length fixed.
- **Cover every angle**, including a high and low pass. Gaps become holes in the splat.
- **Even, diffuse light**; avoid changing exposure mid-shot — bakes inconsistencies in.
- **Slow and steady** beats fast — motion blur is the enemy. 30–60 seconds at a walking pace is plenty.

## Extract frames

Splat trainers take images. `ffmpeg` samples the clip — three to six frames per second is a good starting density:

```bash
ffmpeg -i orbit.mov -vf "fps=4,scale=1600:-1" frames/%04d.jpg
```

Too many near-identical frames slows training without adding detail; too few starves the structure-from-motion step. 150–300 sharp, well-spread frames is a healthy target.

## Train the splat

Three accessible options, in rough order of least setup:

- **[Postshot](https://www.jawset.com/)** (Windows, free) — drag in the video or the frame folder and it runs structure-from-motion plus 3DGS training end to end, exporting `.ply`. The lowest-friction path.
- **[Nerfstudio](https://docs.nerf.studio/)** with the `gsplat` backend — `ns-process-data video --data orbit.mov` runs COLMAP for camera poses, then `ns-train splatfacto` trains. Cross-platform, scriptable, CUDA-friendly.
- **[Brush](https://github.com/ArthurBrussee/brush)** — a wgpu trainer that runs on macOS, Windows, Linux, and even in a browser; no CUDA required, which suits a mixed-laptop team.

All three export a standard Gaussian-splat `.ply`; convert to the compact `.splat`/`.spz` form with [SuperSplat](https://superspl.at/) for faster loading.

## View it in WebXR

This is where the splat meets a headset. The same single-file WebXR engines the camp already uses load splats directly:

- **Babylon.js** has first-party support — `await SceneLoader.ImportMeshAsync(null, "", "scene.splat", scene)` drops the splat into the scene used by the [Babylon WebXR starter](/news/babylonjs-webxr-starter/).
- **Three.js** loads them via [`GaussianSplats3D`](https://github.com/mkkellogg/GaussianSplats3D) (mkkellogg) in the [three.js starter](/news/threejs-webxr-starter/).
- **PlayCanvas / SuperSplat** publish a viewer to a URL with no code at all — open it in the Quest, PICO, or Vision Pro browser.

A static splat is a fixed scene, not interactive geometry — but standing inside your own capture on a Quest 3 is a strong demo on its own, and pairs naturally with the [in-headset art tools](/news/make-art-inside-xr/) for annotation.

## Caveats

- **Static subjects only**, unless you commit to the 4DGS rabbit hole — moving people ghost badly in plain 3DGS.
- **VRAM is the limiter** for training; a cloud GPU or Brush's lighter footprint is the fallback on modest laptops.
- **Splats are heavy on the wire** — decimate in SuperSplat before shipping to a standalone headset; aim for well under a million splats for comfortable WebXR frame rates.
- **Reflective and transparent surfaces** fool the solver — glass, chrome, and water produce floaters.

## Useful links

- [Postshot (Jawset)](https://www.jawset.com/) · [Nerfstudio docs](https://docs.nerf.studio/) · [gsplat](https://github.com/nerfstudio-project/gsplat) · [Brush](https://github.com/ArthurBrussee/brush)
- [SuperSplat editor/viewer](https://superspl.at/) · [GaussianSplats3D for three.js](https://github.com/mkkellogg/GaussianSplats3D) · [Babylon Gaussian Splatting](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting)
- 4D / dynamic: [4DGaussians](https://github.com/hustvl/4DGaussians) · [Deformable-3DGS](https://github.com/ingra14m/Deformable-3D-Gaussians)
- Related: [Phone-captured splats (Scaniverse)](/news/scaniverse-3dgs-webxr-godot/) · [Photo to splat (SHARP)](/news/sharp-photo-to-splat-webxr/) · [3DGS from a 360° camera](/news/3dgs-360-camera-workflow/) · [LichtFeld + MCP](/news/lichtfeld-studio-mcp-xr/) · [Three.js WebXR starter](/news/threejs-webxr-starter/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
