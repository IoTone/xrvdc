---
title: "Grab, Rotate, Scale — visionOS 26 Object Manipulation in Swift"
date: 2026-06-05T10:00:00+09:00
slug: "vision-pro-object-manipulation-visionos26"
tag: "STARTER"
summary: "visionOS 26 adds a high-level interaction layer on top of RealityKit: make any 3D object physically grabbable, rotatable, and scalable in a few lines with ManipulationComponent, then pin SwiftUI panels and gestures directly onto entities — no hand-joint math required."
---

Our [first Vision Pro mixed-reality walkthrough](/news/vision-pro-mixed-reality-realitykit-arkit/) covered the plumbing — RealityKit entities and ARKit's raw tracking providers. **visionOS 26** (WWDC 2025) adds a high-level interaction layer that sits *on top* of that plumbing and, for most apps, removes the need to write hand-joint math by hand. The headline is `ManipulationComponent`: make any entity physically grabbable, rotatable, and scalable — including two-handed manipulation and hand-to-hand pass-off — in a handful of lines. It is one of the highest-"wow", lowest-effort things a hackathon team can ship.

## Make anything grabbable

The whole feature is one configuration call:

```swift
ManipulationComponent.configureEntity(
    subject,
    collisionShapes: [.generateBox(width: 0.25, height: 0.25, depth: 0.25)]
)
```

`configureEntity` automatically adds everything the entity needs to be interactive — `InputTargetComponent`, `CollisionComponent`, `HoverEffectComponent`, and the `ManipulationComponent` itself. From that moment the object can be grabbed, moved, rotated, and scaled with natural gestures, highlights on hover, and physically-modeled release inertia.

The SwiftUI equivalent works on views and `Model3D`:

```swift
Model3D(named: "Teapot")
    .manipulable(operations: [.translation, .primaryRotation, .secondaryRotation],
                 inertia: .high)
```

To react to the interaction, subscribe to `ManipulationEvents` — `WillBegin`, `DidUpdateTransform`, `WillRelease`, `WillEnd`, `DidHandOff` — and drive app state or swap in a custom pickup/release sound.

## Pin SwiftUI directly onto entities

visionOS 26 also unifies SwiftUI and RealityKit so UI lives *on* objects rather than in a separate attachments closure:

- **`ViewAttachmentComponent`** — attach a SwiftUI view to an entity inline: `Entity(components: ViewAttachmentComponent(rootView: InfoCard()))`.
- **`GestureComponent`** — attach SwiftUI gestures (e.g. a `TapGesture`) directly to an entity.
- **`PresentationComponent`** — present a SwiftUI popover or sheet anchored to an entity in the scene.
- **Observable entities** — `entity.observable` exposes properties (like `.position`) to SwiftUI's observation tracking, for two-way SwiftUI ↔ RealityKit data flow.

The unified **Coordinate Conversion API** (`CoordinateSpace3D`) converts points between SwiftUI and RealityKit space, removing the manual math teams used to hand-roll. A good hackathon target: load a USDZ, make it manipulable, and attach a floating SwiftUI info card with a tap gesture — an inspectable 3D product or anatomy model that feels native, built in hours.

## Worth a sidebar

Two more visionOS 26 additions pair well with manipulation: **Environment Occlusion**, where static real-world geometry occludes virtual objects (a far stronger sense of "in the room"), and **90 Hz hand tracking** with no code change. You can also drive RealityKit transforms with SwiftUI animation curves via `content.animate { }` / `Entity.animate()`.

## Caveats

- **visionOS 26 / Xcode 26 only.** `ManipulationComponent`, `.manipulable`, `ViewAttachmentComponent`, `GestureComponent`, `PresentationComponent`, and observable entities **do not exist on visionOS 1.x/2.x** — none of it compiles on an older deployment target. Confirm everyone's Xcode and OS before committing a team to this path.
- **Device-only for real testing.** Manipulation is driven by real hand input, and the simulator cannot deliver it (only crude virtual hand poses). Demo it on a physical Apple Vision Pro; teams without a headset can't meaningfully build this.
- **"A few lines," not "no code."** Spatial *widgets* are the no-code-change feature; manipulation is little code but you still configure collision shapes, allowed operations, and event handlers. If a grab doesn't move the object, check that the collision shape actually covers the mesh — a common early-beta gotcha.
- **It abstracts hand data away.** This is not a path to per-joint hand data; teams that need raw joints still use `HandTrackingProvider` from the [core RealityKit + ARKit article](/news/vision-pro-mixed-reality-realitykit-arkit/).

## Useful links

- WWDC25 [Better together: SwiftUI and RealityKit](https://developer.apple.com/videos/play/wwdc2025/274/) — the primary source for everything above
- WWDC25 [What's new in RealityKit](https://developer.apple.com/videos/play/wwdc2025/287/) · [What's new in visionOS 26](https://developer.apple.com/videos/play/wwdc2025/317/)
- [ManipulationComponent.configureEntity(...)](https://developer.apple.com/documentation/realitykit/manipulationcomponent/configureentity(_:hovereffect:allowedinputtypes:collisionshapes:)) — exact signature and auto-added components
- [What's new in visionOS](https://developer.apple.com/visionos/whats-new/) — feature set, Xcode 26 / visionOS 26 / Vision Pro requirements
- [Your first Vision Pro mixed-reality scene](/news/vision-pro-mixed-reality-realitykit-arkit/) — the RealityKit + ARKit foundation
- [A visionOS on-ramp — the 30-Days challenge](/news/visionos-2-30-days/) — broader platform survey
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
