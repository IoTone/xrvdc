---
title: "Phone-Captured Gaussian Splats — Scaniverse into WebXR and Godot"
date: 2026-06-03T11:00:00+09:00
slug: "scaniverse-3dgs-webxr-godot"
tag: "WORKFLOW"
summary: "The phone-capture counterpart to our 360-camera 3DGS pipeline: scan a scene with Niantic's free Scaniverse app, which trains a Gaussian splat on-device and exports .ply or the compact open-source .spz, then bring it into WebXR (Quest 3 browser, Vision Pro Safari) or Godot — with clear notes on where each path breaks down."
---

Our [360-camera Gaussian Splatting workflow](/news/3dgs-360-camera-workflow/) took a desktop route — Insta360 capture, SphereSFM, LichtFeld Studio training. This is the phone counterpart: point [**Scaniverse**](https://www.nianticspatial.com/products/capture) at a subject, and it trains a 3D Gaussian splat **on-device in minutes, for free**. For a hackathon, it is the fastest way to get a real-world object or space into an XR scene.

## Capture and export

Scaniverse is a free iOS and Android app, operated by **Niantic Spatial**, with unlimited on-device Gaussian-splat capture. It exports:

- **`.ply`** — the universal splat format, accepted by Lens Studio, SuperSplat, Blender, Unity, and Unreal.
- **`.spz`** — Niantic's **open-source (MIT)** compressed splat format, roughly **10× smaller** than the equivalent PLY (a 250 MB PLY becomes ~25 MB) with no perceptible quality loss. The [spz repository](https://github.com/nianticlabs/spz) is the reference implementation; SPZ 4 (2026) moved to ZSTD streams and removed the old point-count cap.
- Meshes (OBJ, FBX, GLB, USDZ) for engine workflows that need geometry rather than splats.

For most XR delivery, export `.ply` for editors and converters, or `.spz` where a renderer ingests it directly.

## Into WebXR

The shortest path reuses the tool from our earlier article: import the `.ply` into [**SuperSplat**](https://superspl.at/editor) (open-source, MIT), clean it up, and **Publish** — the resulting PlayCanvas-powered HTML viewer is WebXR-integrated and tested in **AR and VR on Quest 2/3 and Apple Vision Pro**. Open the published URL in the headset browser and you are in the scene.

For a code-level build, two renderers stand out:

- [**Spark**](https://sparkjs.dev/) (`@sparkjsdev/spark`) — a Three.js / WebGL2 3DGS renderer built by **World Labs** (not Niantic, despite the splat connection). It reads `.ply`, `.spz`, `.splat`, and more, runs in WebXR, and its movement controller is tested on Quest 3. MIT-licensed.
- [**Babylon.js**](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting) — its `SPLATFileLoader` is the only major WebXR renderer with **native `.spz` ingest** (plus `.ply` and `.splat`) and spherical-harmonics support, on top of full WebXR.

Device reach: the **Quest 3 / 3S** Horizon OS browser supports immersive WebXR out of the box. **Apple Vision Pro Safari supports WebXR but it is off by default** — enable it under Settings → Apps → Safari → Advanced → Feature Flags → WebXR.

## Into Godot

Godot's leading splat addon is [**godot-gaussian-splatting (GDGS)**](https://github.com/ReconWorldLab/godot-gaussian-splatting) — MIT, actively maintained, Godot 4.4+. It reads `.ply`, compressed `.ply`, `.splat`, and `.sog` (convert `.spz` first), and you render by adding a `GaussianSplatNode`.

One caveat dominates the Godot path: **GDGS targets the desktop Forward+ renderer only — not the Mobile/Compatibility renderer that standalone Quest 3 OpenXR builds require.** Its generic VR rendering works for PCVR/Forward+, but **there is no documented standalone-Quest-3 support**. Godot-on-Quest is otherwise mature (core OpenXR plus the [Meta vendor extensions](https://github.com/GodotVR/godot_openxr_vendors)); the limitation is this plugin's renderer requirement, not Godot's XR.

## Caveats

- **Apple Vision Pro, natively.** RealityKit and PolySpatial have **no native Gaussian-splat primitive**, so a splat is not a drop-in RealityKit object. Godot 4.5 *did* add visionOS support, but it is windowed-first and AVP does not speak OpenXR, so immersive splat rendering through Godot is not a shipping path. The realistic native route is a Metal renderer such as [**MetalSplatter**](https://github.com/scier/MetalSplatter); otherwise use WebXR in Safari.
- **Format conversion is the connective tissue.** Tools that don't read `.spz` (GDGS, mkkellogg's GaussianSplats3D) need a convert step — Niantic's browser tool at [nianticlabs.github.io/spz](https://nianticlabs.github.io/spz/), the `gsbox` CLI, or a round-trip through SuperSplat.
- **Orientation.** There is no standard handedness for splat files; Niantic `.spz` scenes often load mirrored or upside-down and need a rotation or flip on import.
- **Performance.** Splat scenes are point-heavy; on standalone headsets, budget the gaussian count and lean on `.spz` / compressed PLY to hold framerate.
- **Rights.** The `.spz` *format* is MIT, but rights in the *scans you capture* are governed by Scaniverse's Terms of Use — check them before reusing captured content commercially.

## Useful links

- [Scaniverse / Niantic Spatial Capture](https://www.nianticspatial.com/products/capture)
- [spz format (MIT)](https://github.com/nianticlabs/spz) · [browser convert/inspect tool](https://nianticlabs.github.io/spz/)
- [SuperSplat editor](https://superspl.at/editor) — import, edit, publish a WebXR viewer
- [Spark (Three.js / WebXR)](https://sparkjs.dev/) · [Babylon.js Gaussian Splatting](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting)
- [godot-gaussian-splatting (GDGS)](https://github.com/ReconWorldLab/godot-gaussian-splatting) · [MetalSplatter (visionOS native)](https://github.com/scier/MetalSplatter)
- [3D Gaussian Splatting from a 360° camera](/news/3dgs-360-camera-workflow/) — the desktop-capture companion
- [Image-blaster → engine → headset](/news/image-blaster-xr-pipeline/) — AI-generated worlds, same delivery problem
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
