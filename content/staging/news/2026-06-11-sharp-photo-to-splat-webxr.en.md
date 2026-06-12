---
title: "Photo to Splat in Under a Second — Apple SHARP into WebXR"
date: 2026-06-11T10:00:00+09:00
slug: "sharp-photo-to-splat-webxr"
tag: "WORKFLOW"
summary: "Apple's SHARP turns a single photo into a 3D Gaussian splat in under a second on a GPU — and it runs on a MacBook. Two small starter repos make the whole loop practical: a fork with a uv-based quickstart that gets SHARP installed in four commands, and a Spark + three.js template that serves the resulting PLY straight into a WebXR headset session."
---

The fastest photo-to-splat pipeline covered in this series so far is also the shortest: [**SHARP**](https://github.com/apple/ml-sharp), an Apple Machine Learning Research model ("Sharp Monocular View Synthesis in Less Than a Second"), predicts a **3D Gaussian splat from a single photograph in under a second** on a standard GPU — no capture walk, no COLMAP, no multi-view reconstruction. The output is a plain 3DGS **`.ply`**, which slots directly into the splat-to-headset delivery paths this series has already mapped. Two compact starter repos turn that into an end-to-end loop: an [ml-sharp fork](https://github.com/IoTone/ml-sharp) whose contribution is a friction-free **uv quickstart**, and [**gsplats-to-webxr**](https://github.com/IoTone/gsplats-to-webxr), a **Spark + three.js** template for getting the splat into a WebXR session.

▸ [apple/ml-sharp](https://github.com/apple/ml-sharp) · [IoTone/ml-sharp (uv quickstart)](https://github.com/IoTone/ml-sharp) · [IoTone/gsplats-to-webxr](https://github.com/IoTone/gsplats-to-webxr)

## What SHARP is — and where it sits

SHARP ([project page](https://apple.github.io/ml-sharp/), [paper](https://arxiv.org/abs/2512.10685)) is a **feedforward monocular view-synthesis model**: one image in, a Gaussian-splat scene out, in a single fast inference pass. That makes it the speed-optimized sibling of [LiTo](/news/lito-single-image-3dgs-webxr/), Apple's other single-image-to-splat research project — LiTo is a diffusion model that takes seconds on a datacenter GPU (and minutes on a laptop) in exchange for view-dependent lighting, while SHARP trades that finesse for **sub-second turnaround**. Both sit on the generative side of the splat workflow map, opposite the capture-based routes ([Scaniverse on a phone](/news/scaniverse-3dgs-webxr-godot/), the [360°-camera workflow](/news/3dgs-360-camera-workflow/)) that need a real scene and a capture pass.

The repo has real momentum — 8.5k+ GitHub stars, coverage in [UploadVR](https://www.uploadvr.com/apple-sharp-open-source-on-device-gaussian-splatting/), and third-party wrappers already forming around it. And the platform support is unusually generous for a research model: **prediction runs on CPU, CUDA, and Apple Silicon (MPS)** — Linux and Windows with NVIDIA, or **macOS on M1 and later**. A MacBook is a perfectly good SHARP machine; only the optional rendered flythrough video (`--render`) requires CUDA.

## Setup: four commands with uv

The [IoTone fork](https://github.com/IoTone/ml-sharp) of ml-sharp exists for exactly one reason: making the install trivial. Its delta over the upstream repo is a quickstart built on [uv](https://docs.astral.sh/uv/), plus small environment fixes — developer experience, not model changes. The whole setup:

```bash
git clone https://github.com/IoTone/ml-sharp
cd ml-sharp
uv venv
uv python install 3.13
uv pip sync requirements.txt
. ./.venv/bin/activate
```

Then point it at a folder of photos:

```bash
sharp predict -i /path/to/input/images -o /path/to/output/gaussians
```

The pretrained checkpoint downloads automatically on first run (to `~/.cache/torch/hub/checkpoints/`; it can also be passed explicitly with `-c sharp_2572gikvuh.pt`). Each image in the input folder is processed **independently** — this is single-photo prediction, not a multi-view reconstruction of the set — and each produces a Gaussian-splat `.ply` ready for any standard 3DGS renderer.

## Delivery: the Spark + three.js WebXR starter

[**gsplats-to-webxr**](https://github.com/IoTone/gsplats-to-webxr) is "a starter project for getting your splats into XR" — its `spark-threejs-webxr` template loads a splat with [Spark](https://sparkjs.dev/), the three.js Gaussian-splat renderer this series has used before, and stands up a WebXR session around it. Drop the SHARP-generated PLY into `models/`, serve, and open the URL in a **Quest 3 browser** or **Vision Pro Safari** (WebXR enabled in feature flags).

The one operational detail that trips people up: **WebXR requires HTTPS**, even on a LAN. The starter documents two ways through:

- **Quick and dirty** — a self-signed certificate plus `http-server`:

  ```bash
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout localhost.key -out localhost.crt -subj "/CN=localhost"
  npm install -g http-server
  http-server -S -C localhost.crt -K localhost.key -a 0.0.0.0 -p 8080
  ```

- **Recommended** — a Vite vanilla project (`npm init vite@latest spark-ply -- --template vanilla`) with HTTPS configured in the dev server, which gives hot reload while iterating on the scene.

If the splat is fetched from a CDN rather than served locally, the response must carry `Access-Control-Allow-Origin` — standard WebXR asset hygiene.

The combined loop is short enough for a hackathon demo iteration: photograph something on a phone, run `sharp predict` on a laptop, drop the PLY into the starter, reload the headset browser. **Photo to in-headset splat in well under a minute**, most of it file shuffling.

## Caveats

- **Monocular means monocular.** SHARP synthesizes plausible novel views *around* the original camera position; it is not a walk-around capture of a real space, and fidelity drops as the viewpoint strays from the photo. For a room-scale scene that holds up from every angle, use the [capture-based routes](/news/scaniverse-3dgs-webxr-godot/) instead.
- **Apple's research license, not MIT.** Like LiTo, SHARP ships under Apple's custom sample-code license with separate model-weight terms (`LICENSE`, `LICENSE_MODEL`). Check before shipping output in anything beyond a hackathon demo.
- **PLY only, for now.** There is no native `.splat`/`.spz` export — an [open feature request](https://github.com/apple/ml-sharp/issues/8) tracks it. For headset delivery, compress or convert with the usual tools (e.g. SuperSplat) if the raw PLY is heavy.
- **The starter repos are young.** The gsplats-to-webxr template is a handful of commits with no license file yet, and the fork's value is its quickstart docs — treat both as scaffolding to read and adapt, not dependencies to pin.
- **Splat delivery rules still apply:** budget gaussian count for headset framerate, and expect a possible orientation fix on import.

## Useful links

- [apple/ml-sharp](https://github.com/apple/ml-sharp) · [project page](https://apple.github.io/ml-sharp/) · [paper (arXiv)](https://arxiv.org/abs/2512.10685)
- [IoTone/ml-sharp — uv quickstart fork](https://github.com/IoTone/ml-sharp)
- [IoTone/gsplats-to-webxr — Spark + three.js WebXR starter](https://github.com/IoTone/gsplats-to-webxr) · [Spark](https://sparkjs.dev/)
- [One photo to a 3D splat — Apple's LiTo into WebXR](/news/lito-single-image-3dgs-webxr/) — the view-dependent-lighting sibling
- [Phone-captured Gaussian splats — Scaniverse into WebXR and Godot](/news/scaniverse-3dgs-webxr-godot/) — the capture-based counterpart
- [3D Gaussian Splatting from a 360° camera](/news/3dgs-360-camera-workflow/) — the full capture-to-scene workflow
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
