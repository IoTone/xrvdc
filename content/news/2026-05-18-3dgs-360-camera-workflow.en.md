---
title: "3D Gaussian Splatting from a 360° Camera: a Capture-to-Scene Workflow"
date: 2026-05-18T10:00:00+09:00
slug: "3dgs-360-camera-workflow"
tag: "WORKFLOW"
summary: "Capture photoreal 3D scenes for your hackathon project: a summarized 360°-video Gaussian Splatting pipeline — Insta360 capture, SfM, LichtFeld training, and export — with every tool and repo linked."
---

Photoreal environments are a fast way to make an XR demo feel real. **3D Gaussian Splatting (3DGS)** turns ordinary footage into a renderable point-based scene — and a 360° camera makes capture quick. This post summarizes a clear, practical pipeline.

> This is a condensed, English walkthrough of **@Tks_Yoshinaga's** Qiita article *"Getting Started with 360° Image Gaussian Splatting (Basic Workflow)"*. Please read the original for full detail and screenshots: [qiita.com/Tks_Yoshinaga/items/354e9082bd607f3cefee](https://qiita.com/Tks_Yoshinaga/items/354e9082bd607f3cefee). All credit to the author; any errors in summarizing are ours.

## What you need

- **Camera:** a 360° camera — Insta360 X4 Air (shoot 8K) or a RICOH THETA.
- **PC:** Windows 11, an NVIDIA RTX GPU (the author used an RTX 4070 SUPER), 32 GB RAM.

## The pipeline

**1 · Capture & export.** Shoot a short clip (start with **under one minute**). Export to **equirectangular** with the camera's software (e.g. Insta360 Studio). Critical: if stabilization is on, **disable horizon leveling, tilt recovery, and vibration reduction** — they distort the camera geometry SfM relies on.

**2 · SfM & point cloud — [360° Gaussian](https://laskosvirtuals.gumroad.com/l/360gaussian).** Load the equirectangular video, set a frame interval, and enable sharp-frame extraction. Optionally mask moving subjects/low-texture regions with **AutoMasker** (paid) using period-separated keywords like `person.sky`. Configure: Training Method `No Training`, SfM `SphereSFM`, matcher `sequential`, preset size matching the camera (e.g. Ultra 8K). For large outdoor scenes: more iterations/refinements, lower MinInliers, looser reprojection thresholds. Run, then verify camera poses and the cloud in `train_data/sparse`.

**3 · Train — [LichtFeld Studio](https://lichtfeld.io/).** Drag the `train_data` folder in and **wait for the point cloud and all cubemap faces to finish loading** before training (training mid-load crashes it). Strategy `MRNF`; Steps Scaler `1` for ≤300 images, else `image_count / 300`; bump it 2–3× if the view whites out; raise Max Gaussians for more detail. Start training — it sharpens progressively and halts at the step limit.

**4 · Export & view.** Export a `.ply` and open it in the browser-based **[SuperSplat Editor](https://superspl.at/editor)** to clean up and render video. Sample result: [youtube.com/watch?v=n-NL1UisVF4](https://www.youtube.com/watch?v=n-NL1UisVF4).

## Tools & repositories

| Tool | Purpose |
|---|---|
| [360° Gaussian](https://laskosvirtuals.gumroad.com/l/360gaussian) | Frame extraction + SfM automation (SphereSFM) |
| AutoMasker | Auto-masking of moving/low-texture regions (paid, ~€46) |
| [LichtFeld Studio](https://lichtfeld.io/) · [source](https://github.com/MrNeRF/LichtFeld-Studio) | GUI Gaussian Splatting trainer |
| [SuperSplat Editor](https://superspl.at/editor) | Browser viewer / cleanup / video export |
| Insta360 Studio | Equirectangular export (native to Insta360) |

## Gotchas worth knowing

- **Wait for the full load** before training in LichtFeld Studio — the most common crash.
- **Stabilization** sub-features must be off at capture or SfM accuracy degrades.
- **First-run "Failed to process"** can appear instantly — click Stop and retry.
- **Licensing:** prebuilt **LichtFeld Studio v0.5.2** is no longer free; **v0.4.0** prebuilt remains free, or build v0.5.2 from source. Build tips: `git clone --recursive` (submodules), and Strawberry Perl can shadow system `cmake` — rename `C:\Strawberry\c\bin\cmake.exe` if the build picks the wrong one. See the [Windows build wiki](https://github.com/MrNeRF/LichtFeld-Studio/wiki/Build-Instructions-%E2%80%90-Windows).

## Why this matters for the hackathon

A captured splat scene is a drop-in photoreal backdrop or asset for a Spectacles/Quest/WebXR build — minutes of capture instead of hours of modeling. The author also has follow-up "quality improvement" and "Metashape" editions worth reading once the basics click.

## Useful links

- Original article: [qiita.com/Tks_Yoshinaga/items/354e9082bd607f3cefee](https://qiita.com/Tks_Yoshinaga/items/354e9082bd607f3cefee)
- [LichtFeld Studio](https://lichtfeld.io/) · [SuperSplat Editor](https://superspl.at/editor)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach us via the [Contact](/contact/) page.
