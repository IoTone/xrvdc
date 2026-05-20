---
title: "Getting Started with Android XR — Develop Today, No Hardware Required"
date: 2026-05-23T10:00:00+09:00
slug: "androidxr-getting-started"
tag: "STARTER"
summary: "Android XR Developer Preview 4 ships APIs ahead of consumer hardware. Here's how to build and test locally on the emulator — including the important API 34 (glasses) vs API 36 (VR) split and copy-pasteable Jetpack XR Gradle dependencies."
---

The latest twist in the native-platform thread: **Android XR**. Hardware isn't broadly shipping yet, but the SDK has reached **Developer Preview 4** and the toolchain is solid enough to build and test today on the emulator. Here's the practical setup.

▸ [Dev Preview 4 announcement](https://android-developers.googleblog.com/2026/05/android-xr-sdk-developer-preview-4-updates.html) · [developer.android.com/xr](https://developer.android.com/xr)

## Pick a form factor first — the API split matters

Android XR is **two stacks under one brand**. Make the call up front because it changes your target API, your Jetpack libraries, and your emulator AVD:

| | Immersive — VR headsets / wired XR glasses | Augmented — audio & display glasses |
|---|---|---|
| Target API | **36** | **34** |
| UI toolkit | Compose for XR + SceneCore | Compose Glimmer + Projected |
| Spatial perception | ARCore for Jetpack XR | ARCore for Jetpack XR (limited) |
| Use cases | Fully immersive scenes, spatial UI, glTF content | Notification chips, status panels, audio HUD |

Both share `androidx.xr.runtime` and ARCore, but the UI/runtime stack diverges. **Don't try to share one Gradle module across the two** — pick the form factor your hackathon project targets and configure to that API level.

## Local setup (no headset)

**1 · Canary Android Studio.** Use the **latest [Android Studio Canary](https://developer.android.com/studio/preview)**. XR APIs land in Canary first; stable channels lag.

**2 · Install the XR system image + create an AVD.** Open SDK Manager, install the Android XR system image, then create an AVD using the official guides — they differ per form factor:
- [XR headsets & XR glasses AVDs](https://developer.android.com/develop/xr/jetpack-xr-sdk/run/create-avds/xr-headsets-glasses)
- [Audio & display glasses AVDs](https://developer.android.com/develop/xr/jetpack-xr-sdk/run/create-avds/glasses)

**3 · Set SDK levels.** Per the [Jetpack XR SDK setup](https://developer.android.com/develop/xr/jetpack-xr-sdk/set-up-sdk):

```kotlin
android {
  compileSdk = 36          // 34+ minimum; use 36 for VR/immersive
  defaultConfig {
    minSdk = 24
    targetSdk = 36         // glasses projects use 34
  }
}
```

**4 · Add the right Jetpack XR dependencies.**

**Immersive (VR headsets / XR glasses, targetSdk 36):**

```kotlin
dependencies {
  implementation("androidx.xr.runtime:runtime:1.0.0-alpha14")
  implementation("androidx.xr.scenecore:scenecore:1.0.0-alpha15")
  implementation("androidx.xr.compose:compose:1.0.0-alpha14")
  implementation("androidx.xr.compose.material3:material3:1.0.0-alpha17")
  implementation("androidx.xr.arcore:arcore:1.0.0-alpha14")
  // Code-minification support (Jetpack XR alpha05+) — MUST be compileOnly:
  compileOnly("com.android.extensions.xr:extensions-xr:1.3.0")
}
```

**Augmented (audio / display glasses, targetSdk 34):**

```kotlin
dependencies {
  implementation("androidx.xr.runtime:runtime:1.0.0-alpha14")
  implementation("androidx.xr.glimmer:glimmer:1.0.0-alpha12")
  implementation("androidx.xr.glimmer:glimmer-google-fonts:1.0.0-alpha12")
  implementation("androidx.xr.projected:projected:1.0.0-alpha07")
  implementation("androidx.xr.arcore:arcore:1.0.0-alpha13")
}
```

> The docs explicitly say: pin these versions even if newer Jetpack libraries are available — they're a coordinated set.

**5 · Run a sample.** Don't start from scratch — open and modify one of the official examples:
- [Android XR samples](https://developer.android.com/develop/xr/samples)
- [Android XR experiments](https://developer.android.com/develop/xr/experiments)

## What's new in Dev Preview 4

- **XR Runtime, SceneCore, ARCore perception → Beta** for immersive.
- **Native glTF in Compose for XR** via `SpatialGltfModel` / `SpatialGltfModelState` — drop a 3D model directly into a Compose scene.
- **`GltfModelNode`** for runtime model tweaks (pose, materials, textures, animations); **experimental Custom Meshes** for programmatic geometry.
- **Geospatial API preview** for wired XR glasses — real-world anchoring across 87+ countries (similar in spirit to the [MultiSet VPS work on Ray-Ban](/news/multiset-vps-meta-glasses/)).
- **Device Availability API** in Jetpack Projected — wear/connectivity as standard `Lifecycle.State` values, plus a `ProjectedTestRule` for automated tests.

## Other engine routes

If Jetpack/Kotlin isn't your stack, Android XR also supports Unity (with the Android XR Interaction Framework, AXRIF), Unreal, Godot, and OpenXR — start at the [Android XR Engine Hub](https://developer.android.com/xr) and follow your engine of choice. (No first-party WebXR/Chrome story yet — for WebXR today, our [A-Frame article](/news/aframe-webxr-starter/) covers Quest 3, Vision Pro, and Spectacles.)

## Hackathon notes

- **Hardware:** consumer Android XR devices aren't broadly shipping yet. For pre-release access, the [Android XR Developer Catalyst program](https://g.co/dev/catalyst) is the official channel.
- **Preview status:** APIs are alpha and will move. Lock your dependency versions and don't ship anything you can't easily rebuild against a later preview.
- **Choose one form factor** per project to keep your AVD, dependencies, and target API consistent.

## Useful links

- [developer.android.com/xr](https://developer.android.com/xr) · [Jetpack XR SDK setup](https://developer.android.com/develop/xr/jetpack-xr-sdk/set-up-sdk) · [Samples](https://developer.android.com/develop/xr/samples)
- [Android Studio Canary](https://developer.android.com/studio/preview)
- [Dev Preview 4 blog](https://android-developers.googleblog.com/2026/05/android-xr-sdk-developer-preview-4-updates.html)
- Related: [Snap Spectacles & Lens Studio](/news/getting-started-snap-spectacles-lens-studio/) · [Meta Ray-Ban Display Web Apps](/news/meta-wearables-webapp-sdk/) · [visionOS on-ramp](/news/visionos-2-30-days/) · [A-Frame / WebXR](/news/aframe-webxr-starter/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach us via the [Contact](/contact/) page.
