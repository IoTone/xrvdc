---
title: "Grab, Teleport, Point — VR Interactions in Godot with XR Tools"
date: 2026-06-08T10:00:00+09:00
slug: "godot-xr-tools-interaction"
tag: "STARTER"
summary: "The Godot OpenXR setup gets a headset rendering, but the scene is inert. Godot XR Tools is the community toolkit that drops in the missing half — grab, teleport, locomotion, and pointer-driven UI — as prefab scenes you instance rather than scripts you hand-write."
---

The [Godot OpenXR starter](/news/godot-xr-quest-3/) gets a stereo view onto a Meta Quest 3 with a six-node rig — but at that point the scene is inert. There are no controllers you can grab with, no way to move, no UI you can point at. **Godot XR Tools** fills that gap. It's a toolkit of prefab scenes — pickups, teleport, locomotion, a laser pointer, 2D-UI-in-3D — that you instance into your rig instead of writing interaction code by hand. This is the "now make it interactive" follow-up to the OpenXR article.

▸ [github.com/GodotVR/godot-xr-tools](https://github.com/GodotVR/godot-xr-tools) · [docs](https://godotvr.github.io/godot-xr-tools/) · MIT

## What it is — and what it isn't

Godot XR Tools is a **community add-on** maintained by the Godot XR team (Bastiaan Olij, Malcolm Nixon / the GodotVR org). It is **not** built into the engine — you install it through the Asset Library or a GitHub release. And it's a **scaffold, not a framework**: a repository of ready-made scenes and classes that get you moving fast, not a finished interaction system. You will still write glue code.

One version note up front, because it bites teams: the latest tagged stable release is **4.5.1**, whose stated minimum is **Godot 4.4**. There is no 4.6-specific tag yet — but the official [`godot-xr-template`](https://github.com/GodotVR/godot-xr-template) ships XR Tools 4.5.1 running on Godot 4.6 with Quest exports preconfigured. If you want the lowest-friction start, clone that template rather than wiring a project from scratch.

## Install

In Godot 4.6, open the **AssetLib** tab, search "Godot XR Tools for Godot 4" (asset 1698), download, and import the `addons/godot-xr-tools` folder. Or grab the [`godot-xr-template`](https://github.com/GodotVR/godot-xr-template), which already has the toolkit, the OpenXR vendor plugin, and Android/Quest export presets in place.

## StartXR vs your manual init — pick one

The toolkit ships `addons/godot-xr-tools/xr/start_xr.tscn`, which brings up OpenXR (or WebXR) automatically — the same job the [OpenXR article](/news/godot-xr-quest-3/) did by hand in a five-line `_ready()`. **Don't run both**, or you double-initialize the runtime. If you're continuing from that article, the lowest-friction move is to keep your manual init and just add the interaction scenes below. If you're starting fresh, adopt `start_xr.tscn` and the toolkit's staging system instead.

## Locomotion: the player body + a movement provider

Add a **movement provider** to your `XROrigin3D` and the toolkit auto-adds an `XRToolsPlayerBody` that handles physics and ground collision. The minimum viable setup is **Direct Movement** (thumbstick glide) plus **Turn** (smooth or snap). The toolkit also ships glide, jump, climb, flight, grapple, crouch, and wind providers — layer them on the same player body as your design needs.

## Grab: pickups, grab points, snap zones

- Add an **`XRToolsFunctionPickup`** as a child of each `XRController3D`.
- Make an object grabbable by inheriting a scene from `objects/pickable.tscn`, or attach the `XRToolsPickable` script to an existing `RigidBody3D`.
- Optionally add **grab points** (with custom hand poses) so the object snaps to a natural grip, and an **`XRToolsSnapZone`** that holds a pickable in place — the basis for sockets, holsters, and "put the key in the lock" puzzles.

## Teleport and pointer-driven UI

- Instance the **`function_teleport`** scene under a hand controller and bind it to an action (trigger or grip) for arc-teleport locomotion.
- For UI, add a **`Viewport2Din3D`** node and assign it a stock Godot 2D scene — buttons, sliders, a normal control layout. Add an **`XRToolsFunctionPointer`** to a controller and its laser drives that 2D viewport like a mouse. Note: out of the box the pointer is mainly for `Viewport2Din3D` panels; pointing at arbitrary 3D objects needs a `StaticBody3D` + collision shape and a little code.

A solid hackathon target: player rig with Direct Movement + Turn, one pickable cube, a teleport area, and a floating `Viewport2Din3D` menu you point at to start the demo. That's a complete, native-feeling VR loop in an afternoon.

## Caveats to plan around

- **Pin your versions.** Every minor XR Tools bump has historically raised the minimum Godot version and shipped breaking changes (4.5.0 raised the floor to Godot 4.4). Pin a specific toolkit tag against a specific Godot patch — the template's Godot 4.6 + XR Tools 4.5.1 combo is the known-good pairing — and don't upgrade mid-event.
- **No 4.6-specific tag yet.** 4.5.1 stable predates Godot 4.6 and its README still says minimum 4.4. It runs on 4.6 (the official template proves it), but treat that as "template-verified," not "officially tagged." Re-check the [releases page](https://github.com/GodotVR/godot-xr-tools/releases) at event time.
- **It's GDScript.** All interaction logic is GDScript, which matters on the standalone Quest's mobile chip. The toolkit pre-caches shaders to avoid hitches, but heavy interaction scenes can still cost frames — profile on-device.
- **Hand tracking is the weak leg.** XR Tools' functions mostly assume controllers. Bridging OpenXR hand tracking into these interactions needs a separate add-on, [`GodotXRHandPoseDetector`](https://github.com/Malcolmnixon/GodotXRHandPoseDetector), which converts hand-tracker data into a virtual controller. Default to controllers unless hand tracking is the whole point of your build.
- **Scaffold, not framework.** Expect to write glue — the pointer needs colliders and code to touch 3D objects, teleport needs its activation wired, pickables often need tuning. The toolkit removes the boilerplate, not the design work.

## Useful links

- [Godot XR Tools repo](https://github.com/GodotVR/godot-xr-tools) · [docs site](https://godotvr.github.io/godot-xr-tools/) · [Asset Library (1698)](https://godotengine.org/asset-library/asset/1698)
- [godot-xr-template](https://github.com/GodotVR/godot-xr-template) — Godot 4.6 + XR Tools 4.5.1 + Quest exports, ready to clone
- [Introducing XR Tools](https://docs.godotengine.org/en/stable/tutorials/xr/introducing_xr_tools.html) — the official Godot tutorial
- [GodotXRHandPoseDetector](https://github.com/Malcolmnixon/GodotXRHandPoseDetector) — bridge hand tracking into XR Tools
- Related: [Godot OpenXR for Quest 3](/news/godot-xr-quest-3/) — the setup this builds on
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
