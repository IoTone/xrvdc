---
title: "Make Art Inside the Headset — and Get It Into Your Build"
date: 2026-06-14T10:00:00+09:00
slug: "make-art-inside-xr"
tag: "WORKFLOW"
summary: "The creative inverse of scanning the real world: paint, sculpt, and model 3D art from inside a headset, then run the same asset pipeline to drop it into a WebXR scene, a Quest app, or a Vision Pro build. The free, open centerpiece is Open Brush — and the part that actually bites is the export, where vertex colors, unlit materials, and brush shaders quietly break unless you handle them. Here's the toolkit and the pipeline that works for free."
---

The capture pipelines covered here — [photo-to-splat](/news/sharp-photo-to-splat-webxr/), [spatial video](/news/spatial-video-capture-to-headset/), [360° scenes](/news/3dgs-360-camera-workflow/) — all start from the real world. **Making art inside the headset is the inverse:** the artist authors 3D geometry from nothing, hands tracked in space, and the result is a real mesh to bring into a build. For a hackathon the deciding question is not which tool feels best to paint with — it is **which tools export engine-ready geometry, for free**, and how to keep that geometry from breaking on the way into a scene. That second half is where most teams lose an afternoon.

▸ [Open Brush](https://openbrush.app/) · [Open Brush Toolkit (Unity)](https://github.com/icosa-foundation/open-brush-toolkit) · [`three-icosa` (WebXR)](https://github.com/icosa-foundation/three-icosa)

## The free, open centerpiece: Open Brush

[**Open Brush**](https://openbrush.app/) is the community successor to Google's Tilt Brush, maintained by the **Icosa Foundation**, **free and open-source (Apache-2.0)**, and **actively released through 2026**. It runs **natively on Quest** (no PC) and on **PCVR/SteamVR**, and — the reason it anchors this whole piece — it exports the full set of engine formats: **GLB** (binary glTF 2.0), **FBX**, **OBJ**, and **USD**, plus raw per-stroke **JSON** and the **LATK** stroke-interchange format. There is no native Vision Pro build yet, but its output reaches Vision Pro through conversion (below).

Two companion projects make the export land correctly, because brush strokes are not ordinary meshes:

- [**Open Brush Toolkit**](https://github.com/icosa-foundation/open-brush-toolkit) — a Unity SDK (UnitySDK v24.x, Unity 2019.4+). Copy an exported GLB into a Unity project and it reassigns the correct brush materials and shaders on import.
- [**`three-icosa`**](https://github.com/icosa-foundation/three-icosa) — an npm package that implements the `GOOGLE_tilt_brush_material` glTF extension for **three.js / WebXR**. Register it with a `GLTFLoader`, point it at a brushes directory, and Open Brush strokes render with their real shaders instead of flat polygons.

That pairing — a free open painter plus extension-aware loaders for Unity and the web — is what makes Open Brush the safe default.

## The rest of the free toolkit, by what it does

Pick by output, not vibe. Everything below is realistically usable for free at a weekend, and every entry produces real geometry unless noted:

- **Low-poly modeling — [Open Blocks](https://github.com/icosa-foundation/open-blocks)** (Icosa Foundation, open-source, Quest native). The Google Blocks successor; exports **OBJ**.
- **Pro 3D design / CAD-ish — [Gravity Sketch](https://www.gravitysketch.com/)** (Quest native + PCVR). Its **free tier is genuine and permanent** (reworked February 2026); in-headset export covers **OBJ, FBX, and glTF/GLB**, with **IGES** (NURBS/CAD handoff) reserved for paid tiers. Export from the web inspector without re-entering VR.
- **AI text-to-3D, in VR — [Masterpiece X](https://www.masterpiecex.com/)** (Quest native, free app + 250 starter credits). Prompt a **rigged, animated** model into existence; exports **GLB**.
- **Illustration + animation — [Quill](https://quill.art/)** (free, PCVR — needs a Windows PC and a tethered headset). Exports **USD, FBX, and Alembic**; note there is **no glTF**, and its frame-by-frame animation only survives as **Alembic** (see recipes).
- **Architecture / spatial design — [Arkio](https://www.arkio.is/)** (Quest 3 MR native + PCVR). Free **Starter** tier exports **glTF/GLB and OBJ**.
- **Sculpting ("digital clay") — [Adobe Substance 3D Modeler](https://www.adobe.com/products/substance3d/apps/modeler.html)** (VR + desktop). Best-in-class USD/glTF/FBX/OBJ export, but **no free tier** — only a 30-day trial, feasible for the weekend if you plan around it.

A note on what to **skip** for a pipeline: the 2D VR painting apps (Vermillion, Painting VR, Kingspray) are a pleasure to use but output **flat images, not meshes**. They earn their place only if you specifically want a painted texture.

## The export discipline — where it actually bites

Getting a file out is easy. Getting it to *look right* in the engine is the real work, because painted and sculpted assets lean on features that silently fail in default pipelines. The rules that save the afternoon:

- **GLB is the universal key; USDZ is the Vision Pro key.** Anything that exports GLB drops into three.js, Babylon.js, Godot, A-Frame, and `<model-viewer>`. Anything bound for **native Vision Pro must become USDZ**.
- **Use `KHR_materials_unlit`.** Painted art carries its color in the strokes; under a metallic/rough PBR shader that color washes out or disappears. Unlit makes the painted color the final look. Supported across three.js, Babylon, Godot, and `<model-viewer>`.
- **Set materials double-sided.** Brush strokes are often single-plane — without `doubleSided=true` (uncheck Backface Culling in Blender) they vanish at grazing angles.
- **Avoid Draco compression on painted assets** — it can corrupt the vertex colors the look depends on. Compress textures with KTX2 instead.
- **Brush shaders need an extension-aware loader.** Without `three-icosa` (web) or the Open Brush Toolkit (Unity), animated/custom brushes lose their appearance on a plain glTF import. **Particle and transparent brushes are lossy even then** — keep test sketches to simpler brushes, or keep the JSON/LATK to rebuild geometry yourself.
- **Godot has a known vertex-color bug** (4.3–4.4.x): vertex colors can import black in the Compatibility renderer. Enable "Use Vertex Colors as Albedo" and prefer the Forward+ or Mobile renderer.

For the **glTF↔USDZ** conversion itself, two free paths are reliable: **Blender** (imports glTF, exports USD/USDZ natively — the dependable route) and Google's **`usd_from_gltf`** (archived read-only since June 2024, but still converts GLB→USDZ with `KHR_materials_unlit` support).

## Per-target recipes

- **Quest 3 native app:** Open Brush or Masterpiece X → **GLB** → import directly with the Meta **Spatial SDK** (it reads GLB/OBJ/FBX with no conversion).
- **WebXR demo:** Open Brush → **GLB** → three.js + **`three-icosa`** (or [A-Frame](/news/aframe-webxr-starter/)'s `gltf-model`). Apply unlit + double-sided, skip Draco. This is the most portable target — it runs on Quest 3 and Vision Pro Safari alike, and it is where the [Babylon.js](/news/babylonjs-webxr-starter/) and A-Frame crowd here already lives.
- **Native Vision Pro:** any tool → **GLB** → Blender or `usd_from_gltf` → **USDZ** → Quick Look, Reality Composer Pro, or the Safari **`<model>`** element. See the [RealityKit + ARKit starter](/news/vision-pro-mixed-reality-realitykit-arkit/) for the scene side.
- **Quill animation → Unreal/Unity:** export **Alembic (`.abc`)** → Unreal **Geometry Cache** (or Unity's Alembic package), and wire the Alembic vertex color into an **unlit emissive** material to keep the hand-painted look. (FBX cannot carry Quill's per-frame deformation — Alembic is mandatory.)

## Vision Pro's input shift — and why it matters for art

Vision Pro defaults to hand-and-eye input, which is poor for precise drawing — but that changed with **visionOS 26 (2025)**, which added support for **6DoF spatial accessories**. The creative one is the **[Logitech Muse](https://www.logitech.com/)** stylus ($129.95, October 2025): a spatially tracked pen with a pressure tip, a force-sensitive side button, and haptics, purpose-built for drawing and sculpting. Sony's **PSVR2 Sense controllers** ($249.95, November 2025) are also supported, aimed more at games. By visionOS 26.2 even Apple's own Freeform and Notes accept Muse input, and third-party creation apps followed.

So controller- and stylus-based art on Vision Pro now genuinely exists, though the app ecosystem is still young, and the headline VR painters (Open Brush, Gravity Sketch) have **no native visionOS release yet**. For now, the native-AVP art path runs through small USDZ-exporting apps (Spatial Drawing, VoxScan — the latter also does glTF/OBJ), or through the cross-platform tools plus a conversion step.

## Sharing, and the one device that doesn't fit

For hosting and reuse, the Icosa Foundation also runs **[Icosa Gallery](https://icosa.gallery/)** — an open-source, self-hostable replacement for the shuttered Google Poly, with a public API for fetching models. Open Brush can **upload a sketch straight to it** from inside the app. For free CC0/CC-BY assets to build against, **[poly.pizza](https://poly.pizza/)** has an API too.

The exception is **[Snap Spectacles](/news/vibe-coding-spectacles/)**: art made in a Lens stays as locked Lens content (Snap Cloud JSON), with **no standard mesh export** to glTF or USDZ. Lens Studio happily imports glTF/FBX/OBJ, so Spectacles is a fine place to *show* art authored elsewhere — but it is a create-and-display target, not a source for the asset pipeline.

## Caveats

- **Free does not mean frictionless.** The tools are free; the export breakage (vertex colors, unlit, double-sided, Draco, the Godot bug) is the real cost. Budget time to get one asset looking right before producing many.
- **Brush fidelity is lossy.** Simple brushes survive a glTF round-trip; particle and animated brushes do not, even with the toolkits. Design around it.
- **Vision Pro native art is early.** Controller/stylus support is new (visionOS 26+) and the big painters aren't ported — plan on a conversion step, and confirm any small app's price and export before relying on it.
- **Check the live details.** Free-tier limits, app prices, and store listings shift; verify before the event. Open Brush and Open Blocks, being open-source, are the most stable bets.

## Useful links

- [Open Brush](https://openbrush.app/) · [export guide](https://docs.openbrush.app/user-guide/exporting-open-brush-sketches-to-other-apps) · [Open Brush Toolkit (Unity)](https://github.com/icosa-foundation/open-brush-toolkit) · [`three-icosa` (WebXR)](https://github.com/icosa-foundation/three-icosa)
- [Open Blocks](https://github.com/icosa-foundation/open-blocks) · [Gravity Sketch](https://www.gravitysketch.com/) · [Masterpiece X](https://www.masterpiecex.com/) · [Quill](https://quill.art/) · [Arkio](https://www.arkio.is/)
- [Icosa Gallery (Poly successor)](https://icosa.gallery/) · [poly.pizza (CC0 models)](https://poly.pizza/) · [Blender USD/USDZ export](https://docs.blender.org/manual/en/latest/addons/import_export/scene_universal_scene_description.html) · [`usd_from_gltf`](https://github.com/google/usd_from_gltf)
- Related: [Photo to splat with SHARP](/news/sharp-photo-to-splat-webxr/) · [Spatial video, end to end](/news/spatial-video-capture-to-headset/) · [WWDC 2026 for XR builders](/news/wwdc-2026-xr-visionos-27/) · [A-Frame WebXR starter](/news/aframe-webxr-starter/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
