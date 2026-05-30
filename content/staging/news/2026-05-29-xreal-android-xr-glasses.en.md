---
title: "Developing for XREAL Glasses — XREAL SDK Today, Android XR Tomorrow"
date: 2026-05-29T10:00:00+09:00
slug: "xreal-android-xr-glasses"
tag: "STARTER"
summary: "Two starter paths for XREAL optical see-through glasses: build on shipping hardware today with the Unity-based XREAL SDK 3.0, and prepare for Project Aura — XREAL's first Android XR glasses — with the Android XR SDK and emulator."
---

XREAL's optical see-through glasses sit at an interesting moment: a mature, shipping SDK for current hardware, and an Android XR future taking shape in **Project Aura**. A hackathon team can start on either path today. This post lays out both.

## Path 1 — Build today with XREAL SDK 3.0 (Unity)

For glasses you can buy now (Air 2 Ultra, Air 2, Air, Light, One Pro), the development path is **Unity + XREAL SDK 3.0**.

▸ [developer.xreal.com](https://developer.xreal.com/) · [docs.xreal.com](https://docs.xreal.com/)

- **Engine:** Unity, with support for **Unity XRI** and **AR Foundation** — so an existing AR Foundation project ports with less friction, and the same input abstractions carry over.
- **Capabilities:** 6DoF spatial recognition, plane detection (horizontal + vertical), image tracking, hand tracking (pinch / grab / swipe), depth meshing for occlusion and collision, and spatial anchors for persistent, multi-user content.
- **Compute model:** the glasses tether over USB-C / HDMI to a host. Full spatial computing currently requires a compatible Snapdragon Android phone (Samsung S22 / S23 class, OneUI 5.1+); display-only output also works from iPhone, Mac, Steam Deck, ROG Ally, and Windows PCs.

This is the right path when the team has Unity skills and access to current XREAL hardware, and wants a working build during the event.

## Path 2 — Prepare for Project Aura (Android XR glasses)

**Project Aura** is XREAL's first pair of **Android XR** glasses: an optical see-through design with a ~70° field of view, a split-compute external puck, and an XREAL X1S spatial chip paired with a Qualcomm Snapdragon XR platform processor.

The key point for developers: because Aura is an **Android XR device**, you build for it with the **Android XR SDK** — the same Jetpack XR stack covered in our [Android XR getting-started guide](/news/androidxr-getting-started/) — not a separate XREAL SDK. That guide's emulator workflow lets you start today, with no headset:

- Use the **glasses form-factor stack** (Jetpack Compose Glimmer + Projected, target API 34) for a glasses-class device.
- Develop and test on the **Android XR emulator** in the latest Android Studio Canary.
- Apply to the **[Android XR Developer Catalyst program](https://g.co/dev/catalyst)** for a Project Aura developer kit — kits begin shipping summer 2026 to a limited first cohort, with a consumer launch targeted before the end of 2026.

▸ [Project Aura](https://www.xreal.com/us/aura) · [Android XR for developers](https://developer.android.com/xr)

## Which path for the hackathon?

| You have / want | Path |
|---|---|
| Unity skills + current XREAL glasses, working build by Sunday | **Path 1 — XREAL SDK 3.0** |
| Kotlin / Jetpack XR skills, targeting the Android XR future, emulator-only is fine | **Path 2 — Android XR SDK** |
| No XREAL hardware at all | **Path 2** on the emulator — it needs no device |

The two are not mutually exclusive: a concept validated on current XREAL hardware with the XREAL SDK is a strong foundation for an Android XR port once Aura kits land.

## Caveats

- **Project Aura has not shipped.** Dev kits are summer 2026, limited cohort, application-gated via Catalyst; consumer launch is targeted for end of 2026. Pricing, weight, and battery life are not finalised.
- **XREAL SDK spatial computing is host-dependent.** Full 6DoF/spatial features currently expect a compatible Snapdragon Android phone; verify your device against the [XREAL docs](https://docs.xreal.com/) before relying on a capability.
- **Two different SDKs.** Today's XREAL glasses use the XREAL SDK (Unity). Project Aura uses the Android XR SDK. Don't assume code moves between them without a port.

## Useful links

- [XREAL developer hub](https://developer.xreal.com/) · [XREAL docs](https://docs.xreal.com/) · [Project Aura](https://www.xreal.com/us/aura)
- [Android XR for developers](https://developer.android.com/xr) · [Catalyst program](https://g.co/dev/catalyst)
- Related: [Android XR getting-started](/news/androidxr-getting-started/) · [ViroReact (Meta Horizon OS)](/news/reactvision-react-native-ar/) · [WebSpatial (visionOS)](/news/webspatial-sdk-visionos/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
