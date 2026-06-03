---
title: "Vibe Coding for Spectacles — AI Assistants in the Lens Studio Loop"
date: 2026-06-03T10:00:00+09:00
slug: "vibe-coding-spectacles"
tag: "STARTER"
summary: "How to drive Lens Studio with AI coding assistants — Cursor, VS Code Copilot, or Claude Code — using TypeScript scripting, the auto-generated type definitions, and Lens Studio's MCP server, which lets an assistant query the scene graph, create objects, and install assets directly. Inspired by Andrew Douglas's Spectacles tutorial."
---

"Vibe coding" — describing what you want in natural language and letting an AI assistant write and wire the code — works for [Snap Spectacles](/news/getting-started-snap-spectacles-lens-studio/) Lenses too. AR developer **Andrew Douglas** demonstrates the workflow in [*Vibe Coding For Spectacles Tutorial*](https://www.youtube.com/watch?v=RzIyVkQfGOI), pairing [Lens Studio](https://ar.snap.com/lens-studio) with **Cursor** and **VS Code's GitHub Copilot**. This post lays out the toolchain behind it and how to set it up for the hackathon.

There are two layers: AI-assisted **scripting** (the assistant writes TypeScript against the Lens Scripting API), and AI-assisted **scene control** (the assistant drives Lens Studio itself through an MCP server). The second layer is what makes the workflow feel like vibe coding rather than autocomplete.

## Layer 1: TypeScript scripting in an external editor

Since Lens Studio 5.0, scripts can be written in **TypeScript or JavaScript**. The internal editor does not offer autocomplete for TypeScript, so Snap recommends an external editor — right-click a script in the Asset Browser and choose **Open in External Editor**.

The detail that makes AI assistance accurate: Lens Studio writes a **TypeScript definition file (`.d.ts`)** into the project's `Support` folder. Open the saved project folder in VS Code, Cursor, or any editor that reads `.d.ts`, and both you *and the AI assistant* get the real Lens Scripting API surface as type-ahead — which sharply reduces hallucinated APIs.

The optional [Lens Studio VS Code extension](https://developers.snap.com/lens-studio/features/scripting/vscode-extension) adds code snippets (type the `ls_` prefix for input declarations, events, UI widgets, component access, and math helpers), IntelliSense, and breakpoint debugging.

## Layer 2: Developer Mode and the MCP server

[Developer Mode with VS Code](https://developers.snap.com/lens-studio/features/lens-studio-ai/developer-mode-with-vscode) starts an **MCP (Model Context Protocol) server** inside Lens Studio. Once an AI assistant is connected, it can act on the project directly — not just suggest text. The server exposes tools to:

- Query the scene structure (`GetLensStudioSceneGraph`)
- Create and modify scene objects (`CreateLensStudioSceneObject`)
- Manage project components and assets
- Generate and integrate scripts for interactivity
- Search and install assets from the Asset Library
- Debug project issues

Because it speaks MCP, it works with **VS Code Copilot, Cursor, and Claude Code**.

### Setup

1. Install the **Chat Tool Package** from the Asset Library (Lens Studio 5.x required).
2. In Lens Studio: **AI Assistant → MCP → Configure Server → Start Server**.
3. Create a `.vscode/mcp.json` in the project root and paste the configuration from the Lens Studio popup.
4. In your editor, click **Start** to activate the connection, then confirm it in the MCP panel.
5. Begin prompting from the editor's chat — ask it to add objects, write a script, or install an asset, and watch it act on the open Lens Studio project.

For more consistent behaviour, add a `.github/chatmodes/lens-studio.md` file with a custom system prompt that encodes Lens Studio conventions and your project's workflow.

## Caveats

- **Ground the model.** Open the project folder so the `.d.ts` types load, keep the [Lens Scripting API reference](https://developers.snap.com/lens-studio/api/lens-scripting/) handy, and use a chat mode. Without that context an assistant will invent Lens Studio APIs that don't exist.
- **The MCP server controls the editor's Lens Studio instance, not the glasses.** You still pair Spectacles and use **Send to Spectacles** / in-editor preview to test on-device.
- **Lens Studio 5.x and an MCP-capable editor are required.** The integration relies on the editor's native MCP support.

## Useful links

- [Watch: Vibe Coding For Spectacles Tutorial](https://www.youtube.com/watch?v=RzIyVkQfGOI) — Andrew Douglas (covers Cursor and VS Code Copilot)
- [Developer Mode with VS Code (MCP server)](https://developers.snap.com/lens-studio/features/lens-studio-ai/developer-mode-with-vscode)
- [Lens Studio VS Code extension](https://developers.snap.com/lens-studio/features/scripting/vscode-extension)
- [Lens Scripting API reference](https://developers.snap.com/lens-studio/api/lens-scripting/)
- [specs-devs on GitHub](https://github.com/specs-devs) — Spectacles developer community samples
- [Six Lens Studio Assets to Level Up Your Spectacles Projects](/news/lens-studio-assets-spectacles/) — building blocks to vibe-code against
- [Getting Started with Snap Spectacles and Lens Studio](/news/getting-started-snap-spectacles-lens-studio/) — the toolchain from scratch
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

*Community spotlight — Andrew Douglas, whose tutorial demonstrates the Cursor and Copilot workflow; the MCP and scripting specifics here are drawn from Snap's official documentation.* Questions? Reach the team via the [Contact](/contact/) page.
