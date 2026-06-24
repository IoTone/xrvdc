---
title: "Vibe Coding XR — Let an AI Agent Write the Headset App"
date: 2026-06-18T10:00:00+09:00
slug: "vibe-coding-xr"
tag: "STARTER"
summary: "Describe a spatial scene in plain language and let an AI agent build it. Two AWE-circuit talks by Deutsche Telekom's Terry Schussler show the practitioner version — Cursor and Windsurf driven by Claude and Grok, building VR and AR apps from intent, including native visionOS and Android XR. Google XR Labs' XR Blocks + Gemini is the research-backed version of the same loop: intent, plan, preview in a desktop simulator, deploy to a headset, refine. Here is how the loop works, why XR is the hard case for it, and how to set it up for the hackathon."
---

"Vibe coding" — a phrase **Andrej Karpathy** coined in February 2025 for letting a model write the code while you steer at the level of intent — has a natural home in XR. Spatial apps are heavy on boilerplate (scene graphs, anchors, render setup) and light on the kind of business logic a human needs to hand-author, which is exactly the shape an AI coding agent handles well. The interesting question is not whether it works but where the **agentic loop** closes: intent in, working headset app out, with the agent running the build, reading the result, and fixing itself in between.

Two threads make this concrete. One is practitioner-facing — a pair of talks by **Terry Schussler** (Sr. Dir., Next-Generation Devices, Deutsche Telekom) on the AWE circuit. The other is research-backed — **Google XR Labs' "Vibe Coding XR,"** which wires a large language model into a purpose-built XR framework and measures what comes out.

▸ [Vibe Coding for XR — Schussler, AWE USA 2025](https://www.youtube.com/watch?v=-GE_CpRvY4o) · [Dual Reality: Native XR for visionOS & Android XR — Schussler](https://www.youtube.com/watch?v=pmsVCwAeVKk) · [XR Blocks (Google XR Labs)](https://xrblocks.github.io/)

## The practitioner view — Schussler's two talks

In **"Vibe Coding for XR"** (AWE USA 2025, June 2025), Schussler walks through AI-driven development as a way to compress XR prototyping. The setup is ordinary AI-editor tooling pointed at a spatial target: **Cursor** and **Windsurf** as the agentic editors, backed by **Claude Sonnet** (the 3.5 → 4.x line) and **Grok**, turning natural-language — and voice — prompts into functional VR and AR apps. The talk is less a tool demo than a method: prompt-engineering patterns that work, how to troubleshoot AI-generated code, and where the model's limits actually sit so the developer knows when to take the wheel back.

The companion talk, **"Dual Reality: Vibe Coding Native XR for visionOS and Android XR,"** aims the same method at the two native platforms at once — Apple's visionOS and Google's Android XR. That pairing is the useful part for this audience: it is the same intent-driven loop applied to the [Vision Pro](/news/vision-pro-mixed-reality-realitykit-arkit/) and [Android XR](/news/androidxr-getting-started/) stacks this series has covered natively, rather than to a single engine.

The throughline of both: the developer supplies intent and judgement; the agent supplies the typing. The skill that moves from "demo" to "shipped" is knowing how to keep the agent grounded — which is exactly where the research thread gets specific.

## The loop, made concrete — XR Blocks + Gemini

Google XR Labs' **"Vibe Coding XR"** (paper plus an open framework, [xrblocks.github.io](https://xrblocks.github.io/)) is the same idea built to be measured. Two pieces make it work:

- **XR Blocks** — an open-source, LLM-native **WebXR** framework (three.js + WebXR under the hood) that exposes a deliberately concise "Reality Model": a small spatial vocabulary — environmental perception, hand tracking, physics and collision, rendering — that maps cleanly onto natural language and **fits inside a model's context window**. A conventional game-engine hierarchy does not; that compactness is the whole trick.
- **Gemini**, given a system prompt that teaches it the XR Blocks surface and seeds it with curated sample code, so it plans a scene rather than hallucinating an API.

The loop runs: a prompt ("a dandelion that reacts to my hand") → the model plans scene, perception, and interaction and emits XR Blocks code → a **desktop "simulated reality" preview** to check it without a headset → **deploy to an Android XR headset** with body and hand interaction → refine and reshare. The authors evaluate it on a 60-prompt pilot set (**VCXR60**) and report high one-shot success; **Gemini Flash** returns in around twenty seconds, while **Pro** is slower but more reliable. The caveat is the authors' own: XR is genuinely hard to evaluate, because confirming an app *works* still tends to require hands-on, on-device testing.

## Why XR is the hard case for vibe coding

Two frictions make spatial apps harder for an agent than an ordinary web or phone app, and both are the same lessons this series hit with [agentic coding in Android Studio](/news/agentic-coding-android-studio/):

- **The APIs post-date the model.** XR platforms move fast and the SDK surfaces churn — Jetpack XR is still `1.0.0-alphaNN`, visionOS gains manipulation APIs version-by-version. A model recalling an API from training data will confidently name calls that were since renamed or removed. The fix is grounding: pin versions, put the real API surface and doc links where the agent reads them, and keep an official sample open as a reference. XR Blocks sidesteps this by feeding the model its small, current vocabulary directly; with a full engine, the developer has to supply that grounding.
- **You cannot fully judge it from the build log.** A web app that compiles probably renders; an XR app that compiles may still have an anchor in the wrong place, a panel out of reach, or interaction that feels wrong only in the headset. The agent can close a *compile* loop on its own; the *does-it-feel-right* loop still needs a human in a headset. A desktop simulator (XR Blocks' preview, or the [Android XR emulator](/news/androidxr-getting-started/)) shortens that loop but does not remove the on-device check.

## Setting it up for the hackathon

The method is engine-agnostic; the recipe is the same whichever stack a team picks:

- **Pick the target, then the tooling.** For the fastest intent-to-headset loop, **XR Blocks + a capable model** is hard to beat — it is WebXR, runs in a browser, and previews on the desktop. For a native build, use an agentic editor (**Cursor**, **Windsurf**, **Claude Code**, or **Gemini in Android Studio**) pointed at the [Vision Pro](/news/vision-pro-mixed-reality-realitykit-arkit/) or [Android XR](/news/androidxr-getting-started/) stack.
- **Ground the agent.** Put the exact build/run/deploy commands, the pinned SDK versions, and the real API names in a memory file the agent reads every turn (`CLAUDE.md` / `AGENTS.md`). For XR this is not optional — it is the difference between generated code that compiles and code that invents APIs.
- **Close the loop on a simulator first.** Let the agent build, preview in the desktop simulator or emulator, read the result, and iterate — then move to the headset for the judgement only a person wearing it can make.
- **Keep the human on intent and feel.** The agent is fast at the scene graph and slow at taste. Spend the saved time on what it cannot evaluate: comfort, reach, depth, and whether the interaction is actually fun.

## Caveats to plan around

- **One-shot success is not the same as good.** High first-pass compile rates are real and useful, but "it built" is the floor, not the ceiling — the on-device pass is where a spatial app is actually judged.
- **Frameworks and model lineups move.** XR Blocks is young and versioned (it reached its current release through many iterations); the editor model menus (Claude, Grok, Gemini) change often. Treat specific versions as snapshots and check on the day.
- **WebXR vs native is a real fork.** XR Blocks is the fastest path but lives in the browser (and WebXR's AR support is uneven across headsets); native visionOS / Android XR buys full platform features at the cost of a heavier, more grounding-hungry loop.
- **The talks are practitioner demos, not specs.** Schussler's sessions are a method and a live build, not a maintained API — use them for the workflow and the prompt patterns, and lean on the framework docs for current specifics.

## Useful links

- [Vibe Coding for XR — Terry Schussler, AWE USA 2025](https://www.youtube.com/watch?v=-GE_CpRvY4o) · [Dual Reality: Vibe Coding Native XR for visionOS and Android XR](https://www.youtube.com/watch?v=pmsVCwAeVKk)
- [XR Blocks (Google XR Labs)](https://xrblocks.github.io/) · [Vibe Coding XR — Google Research blog](https://research.google/blog/vibe-coding-xr-accelerating-ai-xr-prototyping-with-xr-blocks-and-gemini/)
- Related: [Agentic Coding in Android Studio](/news/agentic-coding-android-studio/) — the same loop for Android XR · [Vibe Coding for Spectacles](/news/vibe-coding-spectacles/) — the Lens Studio analog · [Your first Vision Pro MR scene](/news/vision-pro-mixed-reality-realitykit-arkit/) · [Getting Started with Android XR](/news/androidxr-getting-started/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
