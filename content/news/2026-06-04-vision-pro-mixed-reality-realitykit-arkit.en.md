---
title: "Your First Vision Pro Mixed-Reality Scene — RealityKit and ARKit in Swift"
date: 2026-06-04T10:00:00+09:00
slug: "vision-pro-mixed-reality-realitykit-arkit"
tag: "STARTER"
summary: "The native on-ramp to Apple Vision Pro mixed reality: build a .mixed ImmersiveSpace with RealityKit, then use ARKit's hand tracking and scene reconstruction to anchor virtual content to the real room — with a clear-eyed list of what only works on the device, not the simulator."
---

Apple Vision Pro's native development path is Swift, [**RealityKit**](https://developer.apple.com/documentation/realitykit), and [**ARKit**](https://developer.apple.com/documentation/arkit/arkit-in-visionos). This is the starter that gets a hackathon team from an empty Xcode project to a real **mixed-reality** scene — virtual content composited over the room's camera passthrough and *anchored to the physical world*, not just floating in front of you. For a broader survey of the platform first, our [visionOS 30-Days on-ramp](/news/visionos-2-30-days/) is the companion piece; this one walks the core RealityKit + ARKit stack.

## What "mixed reality" means on visionOS

A visionOS app shows content in one of two places: a **window** (the Shared Space, alongside other apps) or an **`ImmersiveSpace`** (your app takes over). Mixed reality lives in an immersive space opened with the `.mixed` immersion style:

```swift
.immersionStyle(selection: $style, in: .mixed)
```

`.mixed` composites your virtual content over the real-world passthrough feed. The easy part is putting a 3D model into that passthrough. The part that makes it *mixed reality* — and the real lesson here — is making that content **aware of and anchored to the physical room**: sitting on a real table, occluded by a real wall, reacting to your real hands. That awareness comes from ARKit.

## The mental model: RealityKit is entities and components

RealityKit is an **entity-component system**. A scene is a tree of `Entity` objects, and behaviour is attached as components — `ModelComponent` (the mesh), `Transform` (position/rotation/scale), `CollisionComponent`, `InputTargetComponent` (makes an entity tappable), and many more. You display the scene with a SwiftUI `RealityView`:

```swift
RealityView { content in
    let model = try? await Entity(named: "Globe", in: realityKitContentBundle)
    if let model { content.add(model) }
}
```

The standard authoring tool, **Reality Composer Pro**, ships inside Xcode. It edits USD scenes, materials (via Shader Graph), and particles, and compiles them into a Swift package (`RealityKitContent`) that your code loads by name — exactly as above.

## Start from the template

In Xcode, **File → New → Project → visionOS → App** scaffolds the whole stack: a window (`ContentView`), an `ImmersiveView` containing a `RealityView`, the toggle that opens the immersive space, and a linked `RealityKitContent` package. This is the de-facto "hello world" — run it in the simulator and you already have a window that opens an immersive scene.

## Anchor it to the real world with ARKit

ARKit on visionOS does **not** look like iOS ARKit. There is no `ARView`, no `ARSession`, no `ARConfiguration`. Instead you create an [`ARKitSession`](https://developer.apple.com/documentation/arkit/arkit-in-visionos) and run **data providers**:

- `WorldTrackingProvider` — device pose and world anchors
- `HandTrackingProvider` — up to ~27 joints per hand, in world space
- `SceneReconstructionProvider` — a live mesh of the room (`MeshAnchor`s), so virtual objects can collide with real surfaces
- `PlaneDetectionProvider` — floors, walls, tables
- `ImageTrackingProvider`, `ObjectTrackingProvider`, `RoomTrackingProvider`

A minimal hand-tracking loop:

```swift
let session = ARKitSession()
let handTracking = HandTrackingProvider()

try await session.run([handTracking])

for await update in handTracking.anchorUpdates {
    let hand = update.anchor
    // place or poke an entity at hand.handSkeleton joints
}
```

Two setup steps are mandatory and easy to forget:

1. **Authorization.** visionOS has two ARKit authorization types — `worldSensing` (world tracking, scene reconstruction, plane/image/object tracking) and `handTracking`. You request them on the session.
2. **Info.plist usage strings** — `NSWorldSensingUsageDescription` and `NSHandTrackingUsageDescription`. Without them, the providers return nothing.

A good weekend target: open a `.mixed` immersive space, drop a RealityKit entity in, and use **scene reconstruction** to let it rest on a real table, or **hand tracking** to let the user pinch it into place. That is a genuine mixed-reality interaction, not a floating model.

## What's new in visionOS 26

visionOS 26 (WWDC 2025) layers higher-level conveniences on top of this stack — `ManipulationComponent` for grab/rotate/scale, environment occlusion so real objects hide virtual ones, 90 Hz hand tracking, and a unified coordinate-conversion API between SwiftUI, RealityKit, and ARKit. Those are worth a dedicated walkthrough — see our next article, [grab, rotate, scale with visionOS 26 object manipulation](/news/vision-pro-object-manipulation-visionos26/). The fundamentals above are the foundation they build on.

## Caveats

- **The simulator can't do the mixed-reality core.** There is **no passthrough camera** in the visionOS Simulator, hand tracking is unavailable, and `PlaneDetectionProvider` / `SceneReconstructionProvider` are unsupported (they error out). The simulator is fine for SwiftUI layout, windows, and previewing RealityKit content — but true MR, anchored to a real room, is **device-only**. This is the single most-misstated point online.
- **Paid hardware is required** to ship and test MR: a physical Apple Vision Pro, a Mac running Xcode, and an Apple Developer account to install on device.
- **ARKit data only flows inside an `ImmersiveSpace`** with your app in focus — not in a window or the Shared Space. Beginners are routinely surprised that hand/scene data is empty in a normal window app.
- **Don't port iOS ARKit code directly.** The provider model is a different API shape; iOS `ARSession` samples don't transfer.
- **Version-gate your features.** Hand/world tracking, scene reconstruction, plane and image tracking are visionOS 1.0+; object tracking and room tracking are **visionOS 2.0+**; the `ManipulationComponent` family is **visionOS 26+**.
- **Enterprise-gated APIs are out of scope** for a hackathon. Main camera access and raw camera frames (`CameraFrameProvider`) require Apple-approved enterprise entitlements. The standard hand/world/scene/plane/image/object providers are not gated and are the right beginner surface.

## Useful links

- [ARKit in visionOS](https://developer.apple.com/documentation/arkit/arkit-in-visionos) · [Setting up access to ARKit data](https://developer.apple.com/documentation/visionos/setting-up-access-to-arkit-data)
- [Bringing your ARKit app to visionOS](https://developer.apple.com/documentation/visionos/bringing-your-arkit-app-to-visionos/) — how it differs from iOS
- [RealityKit](https://developer.apple.com/documentation/realitykit) · [visionOS — Get started](https://developer.apple.com/visionos/get-started/)
- WWDC23 [Develop your first immersive app](https://developer.apple.com/videos/play/wwdc2023/10203/) · [Meet ARKit for spatial computing](https://developer.apple.com/videos/play/wwdc2023/10082/)
- [Grab, rotate, scale — visionOS 26 object manipulation](/news/vision-pro-object-manipulation-visionos26/) — the next step up
- [A visionOS on-ramp — the 30-Days challenge](/news/visionos-2-30-days/) — broader platform survey
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
