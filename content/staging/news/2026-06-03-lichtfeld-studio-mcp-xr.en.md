---
title: "LichtFeld Studio + MCP — An AI Agent in Your Gaussian Splatting Loop"
date: 2026-06-03T13:00:00+09:00
slug: "lichtfeld-studio-mcp-xr"
tag: "WORKFLOW"
summary: "LichtFeld Studio v0.5 is a native desktop workstation for training, editing, and exporting 3D Gaussian splats — and it ships a real Model Context Protocol server, so an AI assistant can drive training and scene edits through the same code paths as the UI. Here's that workflow, plus the export-to-XR leg for Quest 3 and Vision Pro."
---

Our [360-camera 3DGS pipeline](/news/3dgs-360-camera-workflow/) used [**LichtFeld Studio**](https://github.com/MrNeRF/LichtFeld-Studio) as a GUI trainer. The project has moved on: **v0.5** is a full native workstation for 3D Gaussian Splatting — train, inspect, edit, automate, and export from one app — and the headline for this audience is that it ships a genuine **Model Context Protocol (MCP) server**. That makes an AI assistant a first-class operator of your splat pipeline.

## What LichtFeld Studio is now

Built by **Janusch Patas (MrNeRF)**, LichtFeld Studio is a C++23 / CUDA workstation, currently **v0.5.2** (April 2026), GPL-3.0. It takes **COLMAP datasets** (undistorted images, point cloud, camera poses) and exports **PLY, SOG, SPZ, USD, and a standalone HTML viewer**. v0.5 added an embedded Python runtime with isolated plugin environments, MCMC optimization, 3DGUT for distorted cameras, and mesh rendering alongside splats.

A prebuilt v0.5.2 is donation-gated through the Lichtfeld Portal; the **v0.4.0 build is free**, or you can build v0.5.2 from source. Training **requires an NVIDIA CUDA GPU** (CUDA 12.8+) — there is no Apple-silicon or AMD training path, so Mac and headset users train on a separate box or a cloud GPU.

## The MCP server — what's actually there

This is real, not marketing. The repository carries a dedicated [`src/mcp/` module](https://github.com/MrNeRF/LichtFeld-Studio/tree/master/src/mcp) with an HTTP MCP server, protocol, and tool registrations. The README describes MCP as letting "external tools and agents interact with LichtFeld Studio using the same internal code paths available to the graphical interface" — i.e. an agent gets capabilities comparable to a human operator.

The [registered tools](https://raw.githubusercontent.com/MrNeRF/LichtFeld-Studio/master/src/mcp/mcp_tools.cpp) include training introspection — `training.get_state`, `training.get_loss_history`, `training.list_operations` — plus tools auto-generated from the app's CommandCenter as `{target}.{operation}` (`model.*`, `optimizer.*`, `session.*`), scene-editing tools, and viewport/render capture. So an assistant connected as an MCP client can:

- start and monitor training, reading loss history and state;
- run model / optimizer / session operations;
- manipulate the scene; and
- capture rendered views to see what it just did.

One real limitation: the capability is verifiable in the source and README, but there is **no MCP wiki page or step-by-step "connect your assistant" tutorial yet**. Describe it as a real, source-backed capability — and expect to wire up the connection yourself rather than follow an official recipe.

## The export-to-XR leg

MCP drives the *studio*; it does not deploy to a headset. Delivery is a separate, well-trodden step:

- **Quest 3** — export **SPZ** (Niantic's MIT compressed format, ~10× smaller than PLY) or PLY, then view it through a WebXR splat viewer in the Quest 3 browser. [SuperSplat](https://superspl.at/editor) publishes a WebXR-ready viewer; its SplatTransform CLI converts between PLY, SPLAT, SOGS, and more. Quest 3 handles moderate scenes well — keep the gaussian count and compression in check for larger ones.
- **Apple Vision Pro** — the weaker target. WebXR in Safari works but is reported jittery with dropped frames; for quality, a native Metal renderer like [MetalSplatter](https://github.com/scier/MetalSplatter) or a dedicated visionOS viewer is the better route. RealityKit/PolySpatial still have no native splat primitive, so there is no drag-and-drop path.

## Caveats

- **Training is NVIDIA-CUDA only.** No Mac or headset training; use a separate GPU box or cloud.
- **MCP controls the studio, not the glasses.** The XR leg (export + viewer) is separate from anything the agent does.
- **MCP is lightly documented.** Real in source; no official setup tutorial yet — don't expect a polished UX.
- **Early-stage software.** v0.5.x ships frequent stability fixes; the prior article's "let the scene finish loading before training" crash gotcha still applies.
- **Vision Pro playback is not smooth** over Safari WebXR — don't promise otherwise.

## Useful links

- [LichtFeld Studio repository](https://github.com/MrNeRF/LichtFeld-Studio) · [releases (v0.5.2)](https://github.com/MrNeRF/LichtFeld-Studio/releases) · [wiki / build](https://github.com/MrNeRF/LichtFeld-Studio/wiki/)
- [MCP module source](https://github.com/MrNeRF/LichtFeld-Studio/tree/master/src/mcp) · [MCP tools](https://raw.githubusercontent.com/MrNeRF/LichtFeld-Studio/master/src/mcp/mcp_tools.cpp)
- [spz format (Niantic, MIT)](https://github.com/nianticlabs/spz) · [SuperSplat](https://superspl.at/editor)
- [MetalSplatter (visionOS native)](https://github.com/scier/MetalSplatter)
- [3D Gaussian Splatting from a 360° camera](/news/3dgs-360-camera-workflow/) — LichtFeld as a trainer in a capture pipeline
- [Phone-captured Gaussian splats — Scaniverse into WebXR and Godot](/news/scaniverse-3dgs-webxr-godot/) — the same XR delivery problem, phone capture
- [Vibe coding for Spectacles](/news/vibe-coding-spectacles/) — another MCP-driven creative workflow
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
