---
title: "Giving Meta Ray-Ban Glasses Precise Location: MultiSet VPS"
date: 2026-05-21T10:00:00+09:00
slug: "multiset-vps-meta-glasses"
tag: "SHOWCASE"
summary: "A capability spotlight: MultiSet's Visual Positioning System gives Meta Ray-Ban glasses 6-DOF location for turn-by-turn audio navigation and shared-space multiplayer — with an open iOS sample app to try."
---

A through-line of this series is that **AI glasses get dramatically more useful once they know precisely where they are**. As MultiSet AI's Nikhil Sawlani frames it: precise location context unlocks turn-by-turn audio navigation, location-aware games, and "finding your Uber pickup spot" — the right information exactly when and where you need it.

**MultiSet's Visual Positioning System (VPS)** delivers that location awareness to **Meta Ray-Ban Smart Glasses**, and there's a working iOS sample to learn from:

▸ [github.com/MultiSet-AI/wearable-vps-samples](https://github.com/MultiSet-AI/wearable-vps-samples) (iOS)

## What the sample does

It pairs with Meta Ray-Ban glasses and combines the **MultiSet VPS API** with the **Meta Wearables Device Access Toolkit** (the DAT SDK from our [Meta Ray-Ban Display post](/staging/news/meta-wearables-webapp-sdk/)):

- **Localization** — capture a frame from the glasses camera, send it with camera intrinsics, get back a **6-DOF pose** (position + orientation) and a confidence score within a mapped space.
- **Turn-by-turn navigation** — waypoint graph + A* pathfinding, with directional **audio played through the glasses' speakers** to Points of Interest.
- **Multiplayer** — streams the wearer's localized pose (~20 Hz over Multipeer Connectivity) to a host running the MultiSet iOS SDK, for shared-space AR.
- **Low latency** — session pre-warming, on-device downscaling, and a video-frame fast path for re-localization.

## Try it

**Prerequisites:** iOS 17+, Xcode 15+, Meta Ray-Ban Smart Glasses paired in the **Meta AI app with Developer Mode** on, the **Meta Wearables DAT SDK 0.6.0** (resolved via Swift Package Manager), and **MultiSet VPS API credentials** from the [MultiSet Developer Portal](https://developer.multiset.ai/credentials). You also need a **mapped environment** — maps and navigation data are produced with the [MultiSet Unity SDK](https://github.com/MultiSet-AI/multiset-unity-sdk) (`NavMeshExport` scene → `{mapCode}_navigation_data.json`).

```bash
git clone https://github.com/MultiSet-AI/wearable-vps-samples.git
cd wearable-vps-samples/iOS/MultisetWearable
open MultisetWearable.xcodeproj
```

Add your Client ID/Secret (xcconfig + Info.plist is the recommended, secret-safe path), set your Map Code in the in-app Settings, pair the glasses, and run the **Navigation Demo**.

> Note: unlike the open-source toolkits earlier in this series, the MultiSet SDK is under a **proprietary license** and requires API credentials. It's free to try via the developer portal; check terms for production use.

## Why it matters for the hackathon

Localization is the missing primitive for genuinely spatial glasses apps. With VPS you can build a **venue navigator**, a **location-anchored game**, or a **shared-space multiplayer** demo on hardware people actually wear — without inventing your own tracking. It pairs naturally with the Meta Ray-Ban Web App approach from earlier in the series.

## Useful links

- [wearable-vps-samples (iOS)](https://github.com/MultiSet-AI/wearable-vps-samples) · [MultiSet docs](https://docs.multiset.ai/) · [Developer Portal](https://developer.multiset.ai/credentials)
- [MultiSet Unity SDK](https://github.com/MultiSet-AI/multiset-unity-sdk) (mapping & nav data)
- Related: [Meta Ray-Ban Display Web Apps](/staging/news/meta-wearables-webapp-sdk/)
- [Hackathon details](/staging/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Thanks to Nikhil Sawlani (MultiSet AI) for surfacing this. Questions? Reach us via the [Contact](/staging/contact/) page.
