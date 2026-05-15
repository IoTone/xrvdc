---
title: "Getting Started with Snap Spectacles and Lens Studio"
date: 2026-05-15T10:00:00+09:00
slug: "getting-started-snap-spectacles-lens-studio"
tag: "STARTER"
summary: "First in our native-platform starter series for the hackathon: how to get Lens Studio, pair Spectacles, and walk through all 34 official Spectacles sample projects to find a strong starting point."
---

This is the first in a series of **starter-project guides** to help you hit the ground running at XR VisionDevCamp Fukuoka 2026. We're starting with **native platforms**, and there's no better on-ramp to wearable AR than **Snap Spectacles** with **Lens Studio**.

![Snap Spectacles](https://raw.githubusercontent.com/Snapchat/Spectacles-Sample/main/_README-ref/spectacles-2024-hero.png)

Spectacles are standalone AR glasses with hand tracking, world meshing, and on-device ML. Lenses are built in **Lens Studio**, Snap's free authoring tool, using a visual scene editor plus TypeScript/JavaScript. For a 2.5-day hackathon, the fastest path to a working demo is to start from an official sample and remix it — so this guide covers the toolchain and walks through every sample in Snap's reference repository.

## Get Lens Studio

Lens Studio is a free download for macOS and Windows.

▸ [Download Lens Studio](https://ar.snap.com/lens-studio)

After installing:

- Sign in with a Snap account.
- Open the **Spectacles** project template, or any sample project (below), to get Spectacles-ready scene settings.
- Pair your Spectacles and use **Send to Spectacles** / the in-editor preview to test on-device. The [Spectacles developer docs](https://developers.snap.com/spectacles) cover pairing, the developer program, and the full API reference.

## Prerequisites: Git LFS

Snap's sample repository stores 3D models, textures, and media with **Git LFS (Large File Storage)**. Install and enable it *before* cloning, or the large assets won't download:

```bash
# macOS
brew install git-lfs
git lfs install

# clone with LFS enabled
git clone https://github.com/Snapchat/Spectacles-Sample.git
cd Spectacles-Sample

# already cloned without LFS? fetch the binaries:
git lfs install && git lfs pull
```

Open any project folder directly in Lens Studio and start building.

## The Spectacles Sample repository

All samples below live in one repo:

▸ [github.com/Snapchat/Spectacles-Sample](https://github.com/Snapchat/Spectacles-Sample)

> **Note:** the repository's README is marked *deprecated* — the projects still build and remain an excellent learning resource, but for ongoing support Snap now points to the [specs-devs org](https://github.com/orgs/specs-devs) and the [r/Spectacles](https://www.reddit.com/r/Spectacles/) community.

Each card below links to the sample's source folder; **view demo GIF** opens the full animated preview hosted on GitHub (these are large — they open in a new tab rather than loading inline).

## Walk through the samples

{{< spectacles-samples >}}

## Recommended starting points for the hackathon

If you've never opened Lens Studio before, start in the **Getting Started** category:

- **Essentials** — the foundational concepts (interaction, physics, animation, raycast) in one project. Best first stop.
- **Fetch** — call any web API from a Lens; the basis for anything cloud- or AI-powered.
- **Spatial Image Gallery** / **Throw Lab** — small, self-contained scenes that are easy to reskin into a demo.

From there, pick the category that matches your idea — **AI** (Remote Service Gateway, LLM, vision), **Connected Lenses** (multiplayer), **SnapML** (custom on-device models), or **Navigation** (location AR).

## Useful links

- [Lens Studio download](https://ar.snap.com/lens-studio)
- [Spectacles developer documentation](https://developers.snap.com/spectacles)
- [Spatial design guidelines](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)
- [Spectacles-Sample repository](https://github.com/Snapchat/Spectacles-Sample)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Next in the native-platform series: another headset and its starter projects. Questions? Reach us via the [Contact](/contact/) page.
