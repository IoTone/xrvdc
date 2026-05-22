---
title: "Immersive Web SDK — Meta's AI-Native WebXR Toolkit"
date: 2026-05-25T10:00:00+09:00
slug: "immersive-web-sdk-ai-native"
tag: "STARTER"
summary: "Meta's open-source Immersive Web SDK ships WebXR with a built-in agent interface: screenshots, scene inspection, input simulation, and state snapshots — designed for AI coding tools like Claude Code or Codex to read the running scene and iterate."
---

The WebXR series so far has covered the lightweight ([A-Frame](/staging/news/aframe-webxr-starter/)) and engine-grade ([Babylon.js](/staging/news/babylonjs-webxr-starter/)) paths. **Immersive Web SDK (IWSDK)** adds a third orientation: **AI-native**. The SDK is built so AI coding agents can see the running scene, run it, and debug it — not just write code that targets WebXR.

▸ [iwsdk.dev](https://iwsdk.dev/) · [github.com/facebook/immersive-web-sdk](https://github.com/facebook/immersive-web-sdk) · MIT · Meta Platforms · package `@iwsdk/core`

## What "AI-native" means here

IWSDK exposes **32 tools** that an AI agent can invoke against the running app: screenshot capture, controller input simulation, scene-graph inspection, engine-level debugging, state snapshots. The framing in the project's own words: *"AI agents can see, interact with, and debug your 3D scenes."*

The practical effect during development: a Claude Code, Codex, or Cursor session that's working on a WebXR scene can grab a screenshot of the current camera view, list scene-graph nodes, fire a synthetic controller click, or read materials/transforms — and iterate based on the actual rendered state, not just source guesses. This is the same direction as the [Meta Wearables Web App AI Toolkit](/staging/news/meta-wearables-webapp-sdk/), applied to general WebXR rather than Ray-Ban Display glasses.

## Quick start

One command bootstraps a new project:

```bash
npm create @iwsdk@latest
```

The scaffold pulls `@iwsdk/core` and wires the agent-tool interface alongside the WebXR scene setup. From there the iteration loop is:

1. Run the project locally and tunnel it (Cloudflare quick tunnel works the same as the [A-Frame article](/staging/news/aframe-webxr-starter/)):

   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```

2. Open the printed HTTPS URL on Quest 3 (Meta Quest Browser) or in Safari on Vision Pro.
3. Ask the AI agent to inspect, screenshot, or simulate input against the running scene; let it iterate on the source.

## Where IWSDK fits the series

| Path | Authoring style | Best for |
|---|---|---|
| A-Frame | Declarative `<a-scene>` | Quick declarative WebXR, no build step |
| Babylon.js | Imperative TS engine | PBR, physics, AR feature manager |
| **IWSDK** | Imperative + agent introspection | AI-driven iteration on a WebXR scene |

A team that already prototypes with an AI assistant gets the most leverage from IWSDK: the assistant can verify its own work against the live scene rather than relying on the team to describe what's wrong.

## Caveats to confirm during a hackathon

The project's homepage emphasizes the agent surface and the install path; explicit headset compatibility (`immersive-vr` vs `immersive-ar`, hand input support) is not enumerated on the landing page itself. Treat these as the first verifications when starting:

- Confirm `immersive-vr` and `immersive-ar` sessions on the target browser (Meta Quest Browser, Safari/visionOS, Snap Spectacles Browser Lens).
- Confirm hand tracking and controller input expectations.
- Pin the SDK version (`@iwsdk/core@0.4.x`) — alpha-style versioning is implied.

## Useful links

- [Immersive Web SDK homepage](https://iwsdk.dev/) · [GitHub repository](https://github.com/facebook/immersive-web-sdk)
- Related (same series): [A-Frame WebXR starter](/staging/news/aframe-webxr-starter/) · [Babylon.js WebXR](/staging/news/babylonjs-webxr-starter/) · [Meta Wearables Web App AI Toolkit](/staging/news/meta-wearables-webapp-sdk/)
- [Hackathon details](/staging/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/staging/contact/) page.
