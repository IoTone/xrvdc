---
title: "The Moiré Lens — Two Rotating Plates Against XR's Focus Problem"
date: 2026-06-16T10:00:00+09:00
slug: "moire-lens-varifocal-xr"
tag: "STARTER"
summary: "Stack two diffractive plates, rotate one against the other, and the pair becomes a lens of any focal power you like — from strongly divergent through flat to strongly convergent. The moiré lens is the rotational cousin of the Alvarez lens and an elegant candidate for the varifocal optics that would finally fix focus in XR. It is also, today, entirely a lab device. Here is how it works, where it sits among the varifocal approaches, and why 'varifocal is coming' is true while 'moiré is shipping' is not."
---

Every headset shipping today shares one unsolved comfort problem: **focus is fixed**. Your eyes converge on a virtual object that appears close, but the light reaching them is focused at a fixed screen distance — the **vergence-accommodation conflict (VAC)**, the source of much of the eye strain in extended XR sessions. The fix is a lens whose focal length can change on the fly, ideally driven by where you are looking. One of the most elegant candidates is the **moiré lens** — and it is worth understanding precisely, because it is equal parts beautiful physics and cautionary tale about how far a lab result sits from a product.

▸ [Bernet & Ritsch-Marte 2008 (the foundational paper)](https://opg.optica.org/ao/abstract.cfm?uri=ao-47-21-3722) · [Varifocal meta-device for AR (PhotoniX 2025)](https://link.springer.com/article/10.1186/s43074-025-00164-9)

## How it works

Take two flat **diffractive optical elements** (DOEs) — or, in the modern version, two **metasurfaces**. Give the first a phase profile that, in polar coordinates *(r, φ)*, is proportional to **r²·φ**, and give the second the exact inverse. On their own, neither is a lens; the spiral-like phase does nothing useful. But stack them and **rotate one by an angle θ**, and the combined phase becomes proportional to **r²·θ** — a parabolic profile, which is precisely the phase of a Fresnel lens. Rotate more, and the lens gets stronger.

The result is the defining property: **optical power varies linearly with the rotation angle**, 1/f ∝ θ. And because θ can be positive or negative, the power passes continuously **through zero** — from divergent, to flat, to convergent — with one small twist of one plate. The principle was established by **Bernet and Ritsch-Marte at Innsbruck in 2008** ("Adjustable refractive power from diffractive moiré elements," *Applied Optics* 47, 3722), which showed cascaded DOEs forming a "moiré DOE" of continuously adjustable power and high diffraction efficiency. A later visible-wavelength realization spanned roughly **f = −36 mm to +12 mm across ±90° of rotation** — a genuinely wide tuning range from two thin plates.

## Where it sits in the varifocal family

The moiré lens is not the only way to change focus, and placing it among its cousins clarifies its niche:

- **Alvarez lens** — two cubic-freeform plates that **slide laterally** to change power. The moiré lens is its **rotational analog**: the same varifocal idea, tuned by rotation instead of translation, which keeps the optical axis fixed but demands precise concentric angular actuation.
- **Pancake optics** — the folded-polarization lenses in today's VR headsets. They shorten the optical path for a slimmer body, but they are **fixed focus** — a form-factor trick, not a focus solution.
- **Liquid-crystal (LC) tunable lenses** — focus changed **electrically**, by reorienting LC molecules, with no moving parts. This is the more product-adjacent path: Meta's Mirror Lake concept uses a multi-layer LC stack for dozens of focus states, and companies like FlexEnable build thin curvable LC lenses for AR.
- **Liquid lenses** — a fluid-filled membrane that physically changes shape; effective but comparatively bulky and orientation-sensitive.

Moiré's distinctive promise is being **planar, sub-millimeter thin, and passive between adjustments** — attractive for AR glasses where every gram and millimeter counts — at the cost of a precise mechanical rotation.

## The state of the art — all in the lab

The metasurface era has pushed moiré varifocal toward XR specifically, but every result below is a **research prototype**:

- **A three-metasurface varifocal "meta-device" for AR** (Xiao, Chen, and Geng; HIT-Shenzhen, City University of Hong Kong, and Tsinghua; *PhotoniX*, March 2025) used three cascaded TiO₂-nanopillar metasurfaces, rotation-tuned, to control focus **and** steer the pupil in three dimensions. It demonstrated a focal range of **3.7 to 33.2 mm**, a dynamic eyebox of 4.2–5.8 mm, and an actual AR display showing objects at different depths — but at a **single wavelength (532 nm)** and an **average efficiency of only 14.2%**, with full-color RGB left explicitly as future work.
- **A visible-wavelength moiré metalens** (Iwami group, Tokyo University of Agriculture and Technology, 2022) reached **64% efficiency at its 633 nm design wavelength** — but only **25% and 8%** at green and blue, a vivid illustration of the core problem below.

Achromatic, full-color moiré optics at product scale remain unachieved; these are elegant single-wavelength demonstrations.

## Who is building it — and who is *not* (the conflation trap)

This topic is unusually easy to get wrong, because adjacent work gets blurred into it. To be precise:

**Actually moiré rotational varifocal:** Bernet and Ritsch-Marte (Innsbruck, the originators); the Iwami/Ogawa group (TUAT, visible and infrared moiré metalenses); Xiao, Chen, and Geng (the 2025 AR meta-device); and Grewe and colleagues (rotation-tuned diffractive optics, 2017).

**Frequently confused, but *not* moiré:**

- **Metalenz and the Capasso group (Harvard)** build metasurfaces, but predominantly **static** ones. Metalenz's actually-shipping product is a flat metasurface inside STMicroelectronics' depth-sensing module — the first commercial metasurface optic, but a **sensor lens, not a tunable display lens.**
- **Meta's Mirror Lake** is a varifocal concept, but it achieves focus tuning with a **liquid-crystal stack**, not rotating moiré plates.

If a piece of coverage implies moiré varifocal is shipping because "metasurfaces are in phones now" or "Meta is doing varifocal," it has merged three different things.

## The limitations that keep it in the lab

The candor of the primary literature is clarifying. The blockers are real and mostly fundamental:

- **Chromatic aberration.** Diffractive lenses focus by wavelength — focal length runs inversely with λ — so a moiré lens is sharp at its design color and degraded elsewhere. The 64%→8% efficiency collapse from red to blue is the central obstacle to full-color XR.
- **Low efficiency and stray light.** A 14.2% average for the AR prototype means most light is lost to other diffraction orders, which also raises stray light and ghosting.
- **Mechanical precision.** The two surfaces must sit within a tight gap (set by the Talbot length) and stay concentric: a **2 µm lateral misalignment** already distorted the pattern in measurements, and no group has yet demonstrated a fast, precise *dynamic* rotational actuator — the published devices used manual mounts.
- **Small apertures and fabrication.** The metalens demonstrations are ~2 mm across and require electron-beam lithography; scaling fine metasurface features to eyeglass apertures at consumer cost is unsolved.

## What an XR developer should take away

There is **no moiré varifocal lens in any shipping headset today**, and there will not be one soon. The only consumer metasurface in the wild is a static depth-sensor optic. What *is* broadly true is that near-eye optics is moving from fixed focus toward **gaze-driven varifocal** to resolve VAC — Meta and others target the second half of the decade — but the product-adjacent mechanisms are **liquid-crystal and Alvarez**, not moiré.

So the accurate summary is two sentences that should not be merged: **varifocal is coming**, across several competing approaches; **moiré specifically is not shipping**, and remains a research-frontier candidate held back by color, efficiency, and the mechanics of rotating two plates with sub-micron precision. For anyone building XR now, design for fixed focus, keep comfort (and VAC-aware content depth) in mind, and treat "the lens that rotates to refocus" as a thing to watch in the literature — not a platform assumption. It is one of the more beautiful ideas in near-eye optics, which is a different claim from being one of the nearest.

## Useful links

- [Bernet & Ritsch-Marte, "Adjustable refractive power from diffractive moiré elements" (Applied Optics, 2008)](https://opg.optica.org/ao/abstract.cfm?uri=ao-47-21-3722)
- [Three-dimensional varifocal meta-device for AR display (PhotoniX, 2025)](https://link.springer.com/article/10.1186/s43074-025-00164-9)
- [Visible-wavelength moiré metalens (Iwami group, TUAT — open access)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11501419/)
- [Diffractive array optics tuned by rotation (Applied Optics, 2017)](https://opg.optica.org/ao/abstract.cfm?uri=ao-56-1-A89)
- [Meta's Mirror Lake varifocal concept (context — LC, not moiré)](https://www.uploadvr.com/meta-mirror-lake-compact-varifocal/) · [Metalenz × STMicroelectronics (first commercial metasurface — a static sensor optic)](https://metalenz.com/metalenz-and-stmicroelectronics-deliver-worlds-first-optical-metasurface-technology-for-consumer-electronics-devices/)
- Related: [Developing for XREAL glasses](/news/xreal-android-xr-glasses/) · [WWDC 2026 for XR builders](/news/wwdc-2026-xr-visionos-27/) · [Spatial video, end to end](/news/spatial-video-capture-to-headset/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
