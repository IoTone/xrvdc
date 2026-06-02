---
title: "Six Lens Studio Assets to Level Up Your Spectacles Projects"
date: 2026-06-02T10:00:00+09:00
slug: "lens-studio-assets-spectacles"
tag: "STARTER"
summary: "A community spotlight on six underused Lens Studio Asset Library components — Surface Placement, 3D Hand Hints, Spectacles UI Kit, Interactable Helper, Access Components, and Marker Tracking — surfaced by AR developer Lafiya Watson (Bad Chick Studios) as practical building blocks for a hackathon Spectacles Lens."
---

The [Lens Studio](https://ar.snap.com/lens-studio) Asset Library ships with far more than most projects ever use, and the components that save the most time are easy to scroll past. AR developer **Lafiya Watson** of [Bad Chick Studios](https://badchickstudios.com/) collected six of them in a short walkthrough — [*6 Lens Studio Assets to Level Up Your Spectacles Projects*](https://youtu.be/piNmt2kqih8) — each one an off-the-shelf building block that removes boilerplate from a [Snap Spectacles](/news/getting-started-snap-spectacles-lens-studio/) Lens. For a 2.5-day hackathon, these are the kind of components that turn a prototype into a finished demo without writing the plumbing yourself.

All six install from the Asset Library inside Lens Studio: open **Window → Asset Library**, then add each component to your project.

## The six assets

**Surface Placement** — Lets the wearer find a spot in their space and lock the experience in place, establishing a fixed world anchor before content appears. The standard opening move for a seated or tabletop Lens.

**Spectacles 3D Hand Hints** — Animated 3D hands that demonstrate gestures to the wearer — for example, showing exactly how to pinch to press a button. A low-effort way to onboard users who have never worn the glasses.

**Spectacles UI Kit** — Ready-made UI components designed for Spectacles, including the button component used to drive interactions. Drop-in widgets that match the platform's spatial design language.

**Interactable Helper** — Handles the interaction response — wiring a button press through to the action it triggers — so input connects to behaviour without hand-built event plumbing. Works alongside the Spectacles Interaction Kit (SIK).

**Access Components** — Controls material and visual properties from script, for instance toggling an object's colour on each press. The hook for making a scene respond dynamically to input.

**Marker Tracking** — Recognises a specific image and triggers content from it — in the demo, an animated character appears overlaid on a piece of artwork when the marker is detected. The basis for poster-, card-, or artwork-activated AR.

## See them working together

Watson combines all six in a single gallery Lens — surface-place the scene, a hand hint shows the pinch, a UI Kit button toggles a material via Access Components, and Marker Tracking overlays an animated character on recognised artwork. The full demo project is on GitHub:

▸ [github.com/badchickstudios/LSAssetDemo](https://github.com/badchickstudios/LSAssetDemo)

## Useful links

- [Watch: 6 Lens Studio Assets to Level Up Your Spectacles Projects](https://youtu.be/piNmt2kqih8) — Bad Chick Studios
- [Demo project on GitHub](https://github.com/badchickstudios/LSAssetDemo)
- [Lens Studio Asset Library overview](https://developers.snap.com/lens-studio/assets-pipeline/asset-library/asset-library-overview)
- [Getting Started with Snap Spectacles and Lens Studio](/news/getting-started-snap-spectacles-lens-studio/) — our native-platform starter guide
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

*Community spotlight — Lafiya Watson ([Bad Chick Studios](https://badchickstudios.com/)). The asset roundup and demo project are her work; this post summarises and links them.* Questions? Reach the team via the [Contact](/contact/) page.
