---
title: "Godot XR — Built-in OpenXR for Meta Quest 3"
date: 2026-05-28T10:00:00+09:00
slug: "godot-xr-quest-3"
tag: "STARTER"
summary: "Godot 4.6 ships OpenXR as a core interface — no third-party plugin. A small project-settings checklist, a six-node scene, and a five-line init script are all that stand between a fresh Godot project and a Meta Quest 3 build."
---

The series rounds out the engine-route survey: after [Unity / Unreal via image-blaster](/news/image-blaster-xr-pipeline/) and [Jetpack XR for Android XR](/news/androidxr-getting-started/), **Godot 4.6** is the open-source path with **first-party OpenXR** built into the engine. No plugin marketplace, no SDK download — turn on two project settings, drop in an `XROrigin3D` rig, and the headset is yours.

▸ [Godot XR setup guide](https://docs.godotengine.org/en/stable/tutorials/xr/setting_up_xr.html) · [godotengine.org](https://godotengine.org/) · MIT

## Setup checklist

**Engine:** Godot **4.6** or later — OpenXR is a core interface in this release; no separate plugin needed.

**Project Settings:**

| Setting | Value |
|---|---|
| `XR > OpenXR > Enabled` | ON |
| `XR > Shaders > Enabled` | ON |
| `Rendering > Rendering Driver` | **Compatibility** for Quest 3 standalone; **Mobile** for PC-tethered VR |

Save the project, then **Save & Restart** the editor so the renderer change takes effect.

## Minimum scene

Six nodes are enough to render a stereo view with hand controllers:

```
Main (Node3D + script)
├── XROrigin3D
│   ├── XRCamera3D
│   ├── XRController3D (tracker="left_hand")
│   └── XRController3D (tracker="right_hand")
├── DirectionalLight3D
└── WorldEnvironment
```

## Init script

Attach this to the root `Node3D`. It finds the OpenXR interface, disables vsync (the XR runtime drives presentation), and hands the viewport over to XR.

```gdscript
extends Node3D

var xr_interface: XRInterface

func _ready():
    xr_interface = XRServer.find_interface("OpenXR")
    if xr_interface and xr_interface.is_initialized():
        DisplayServer.window_set_vsync_mode(DisplayServer.VSYNC_DISABLED)
        get_viewport().use_xr = true
        # Match the headset's native refresh rate. Quest 3 defaults to 90Hz;
        # also valid: 72 / 80 / 120 depending on the device profile.
        Engine.physics_ticks_per_second = 90
```

Run in the editor to verify on a tethered headset. For Quest 3 standalone, build to Android.

## Deploy to Quest 3 (Android export)

Follow the [Deploying to Android](https://docs.godotengine.org/en/stable/tutorials/xr/deploying_to_android.html) guide. Summary of the path:

1. Install the **Android Build Template** from the editor (Project → Install Android Build Template).
2. Install Android Studio + Android SDK and set the SDK path in Godot's Editor Settings (`export/android/android_sdk_path`).
3. Add an **Android export preset**; set Min SDK 29, Target SDK 34; enable the OpenXR meta plug-in for Meta Horizon OS.
4. Connect the headset via USB (Developer Mode + adb authorisation enabled) and press **One-click deploy**.

The first build takes a few minutes; subsequent rebuilds are incremental.

## Where it fits in the series

| Path | Engine / runtime | Targets |
|---|---|---|
| A-Frame / Babylon / IWSDK | Browser + WebXR | Quest 3 (browser), Vision Pro (Safari), Spectacles (Browser Lens) |
| [Android XR](/news/androidxr-getting-started/) | Jetpack XR | Android XR headsets + glasses |
| [WebSpatial](/news/webspatial-sdk-visionos/) | React + Web standards → native | visionOS / Apple Vision Pro |
| [ViroReact](/news/reactvision-react-native-ar/) | React Native + native AR | iOS, Android, Meta Horizon OS |
| **Godot 4.6 + OpenXR** | **Native engine, GDScript / C#** | **Meta Quest 3 (standalone), PC VR via OpenXR runtimes** |

Godot is the right call for a team that wants engine depth (physics, rendering, scene tooling, animation) without the licence terms or memory footprint of Unity or Unreal.

## Apple Vision Pro: not a Godot target

This needs to be flagged early. **AVP doesn't expose OpenXR**, so the Godot OpenXR path doesn't reach it. The Godot foundation is investigating native Apple platforms separately. For AVP today, the realistic routes are:

- [WebSpatial SDK](/news/webspatial-sdk-visionos/) — React → native visionOS app
- Unity PolySpatial — native visionOS via the C# engine
- WebXR in Safari on visionOS — covered by the [A-Frame article](/news/aframe-webxr-starter/) and the [Babylon.js article](/news/babylonjs-webxr-starter/)

## Caveats to plan around

- **Single primary OpenXR interface per app** — the engine accepts one XR runtime at a time.
- **Stereo support gaps in some post-effects** — verify each post-process effect renders correctly in the right eye before committing to the look.
- **Silent init failure** — `is_initialized()` returns false if the runtime is missing or the headset is unplugged. Log and surface that to the user; don't render the 2D scene as a "VR" experience by mistake.
- **vsync off + physics 90+** — leaving vsync on or running physics at 60Hz causes visible micro-stutter in the headset; match the device's refresh rate.

## Useful links

- [Godot XR setup](https://docs.godotengine.org/en/stable/tutorials/xr/setting_up_xr.html) · [OpenXR settings reference](https://docs.godotengine.org/en/stable/tutorials/xr/openxr_settings.html) · [Deploying to Android](https://docs.godotengine.org/en/stable/tutorials/xr/deploying_to_android.html)
- [Godot XR features overview](https://docs.godotengine.org/en/stable/about/list_of_features.html#xr-support)
- Related: [Android XR](/news/androidxr-getting-started/) · [WebSpatial (AVP)](/news/webspatial-sdk-visionos/) · [A-Frame WebXR](/news/aframe-webxr-starter/) · [ViroReact (RN AR)](/news/reactvision-react-native-ar/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
