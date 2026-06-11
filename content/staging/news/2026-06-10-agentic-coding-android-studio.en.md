---
title: "Agentic Coding in Android Studio — Claude, Cursor, and Gemini for Android XR"
date: 2026-06-10T10:00:00+09:00
slug: "agentic-coding-android-studio"
tag: "STARTER"
summary: "Android Studio now has a built-in agent that edits across files, runs Gradle, and fixes build errors on its own — and since the Otter 3 drop it can be driven by Claude, not only Gemini. Three setups (Gemini Agent Mode, Claude Code, Cursor), how to wire project memory and skills for efficient agentic coding, and how to point all of it at Jetpack XR — where the catch is that the alpha APIs post-date the models, so the agent has to be grounded."
---

[Jetpack XR](/news/androidxr-getting-started/) is plain Kotlin and Compose, which has a useful consequence: the agentic coding tools that speed up ordinary Android work apply directly to **Android XR**. There is no separate "XR agent" to learn — the same setup that builds a phone app builds a spatial one. Three routes lead there, all in or around Android Studio, and the same Claude or Cursor workflow can drive any of them. The one catch specific to XR comes at the end, and it matters.

▸ [Gemini Agent Mode](https://developer.android.com/studio/gemini/agent-mode) · [Claude Code for JetBrains](https://code.claude.com/docs/en/jetbrains) · [Android XR samples](https://github.com/android/xr-samples)

## Route 1 — Gemini in Android Studio, Agent Mode

The agent is already in the IDE. **Agent Mode** — distinct from plain chat — has been in the stable channel since the Narwhal Feature Drop (July 2025) and was substantially expanded in **Otter 3** (January 2026). Given a high-level goal in natural language, it plans, edits across multiple files (changes land in a review drawer for per-edit approval), runs Gradle to verify its own work, and **detects and fixes build errors, iterating until the build passes**. It also generates Compose UI, unit tests, and mock data, and can interact with a connected device or emulator: deploy, take a screenshot, read Logcat, and drive the app via `adb shell input`.

The pivotal change for this article shipped in Otter 3: Agent Mode is now **model-flexible**. Beyond the default Gemini model, it can be backed by **Anthropic Claude** or OpenAI GPT through custom endpoints, or by a local model via **Ollama or LM Studio**. So "use Claude with Android Studio" has a first answer that needs no extra tool — point Agent Mode at a Claude endpoint and the built-in agent runs on Claude.

▸ [Agent Mode docs](https://developer.android.com/studio/gemini/agent-mode) · [LLM flexibility + Agent Mode (Otter 3)](https://android-developers.googleblog.com/2026/01/llm-flexibility-agent-mode-improvements.html)

## Route 2 — Claude Code, wired into Android Studio

[Claude Code](https://www.anthropic.com/product/claude-code) is Anthropic's terminal agent, and it has an **official JetBrains plugin that lists Android Studio** as a supported IDE (currently labeled Beta). Installed, it adds a quick-launch shortcut, renders diffs in the IDE's diff viewer instead of the terminal, auto-shares the current selection or tab as context, and — the useful part for Android — feeds the IDE's own lint and syntax **diagnostics back to Claude** so it can fix what the IDE flags. An external terminal can attach with `/ide`.

For Kotlin specifically, an official **Kotlin LSP plugin for Claude Code** wraps JetBrains' Kotlin Language Server, giving the agent IDE-grade `.kt`/`.kts` intelligence rather than plain-text guessing. Under the hood Claude Code still works the terminal: it runs `./gradlew` tasks and `adb` like any shell command, edits Kotlin/XML, and self-corrects against build output.

▸ [Claude Code for JetBrains](https://code.claude.com/docs/en/jetbrains) · [Kotlin LSP plugin](https://claude.com/plugins/kotlin-lsp)

## Route 3 — Cursor alongside Android Studio

[Cursor](https://cursor.com/) is an AI-first editor (a VS Code fork) and is multi-provider — it can run on a Claude model just as easily as on its own. It has **no native Android tooling**, so the working pattern is split: Cursor for AI-driven code changes plus the **Gradle CLI** and **ADB** for build-and-run, with **Android Studio kept open alongside** for the emulator, debugger, Logcat, layout inspector, and — the reason it matters here — the XR tooling. Both edit the same files on disk; Android Studio picks up Cursor's edits through Gradle sync. Expect occasional false import squiggles from the community Kotlin language server on large Android builds — trust the Gradle build over the editor's red underlines.

## Wiring it for efficient agentic coding

The difference between an agent that flails and one that ships is mostly grounding and a tight feedback loop. The same three levers apply across all three routes:

- **Project memory.** Put the exact build and run commands, the stack, and the project's conventions in a memory file the agent reads on every prompt — `CLAUDE.md` for Claude Code, `AGENTS.md` for Gemini in Android Studio (Narwhal 4 Canary and later; `GEMINI.md` takes precedence if present). State the real commands, e.g. `./gradlew installDebug`, `./gradlew testDebugUnitTest`, and the package/activity to launch. This is the single highest-leverage file in the repo.
- **Skills and MCP.** Both Gemini Agent Mode and Claude Code support reusable **Skills** for repeated tasks and **MCP servers** for new capabilities — a community ADB/device MCP, for instance, lets the agent drive the emulator directly. Verify any community MCP package before trusting it with a device.
- **Let it close the loop.** The point of the agent is that it runs `./gradlew`, reads the failure, and fixes it without a human relaying the error. Use plan mode for multi-file refactors, then let the build be the judge.

A minimal `AGENTS.md` / `CLAUDE.md` to anchor an Android XR project:

```markdown
# Build & run
- Build:   ./gradlew :app:assembleDebug
- Install: ./gradlew :app:installDebug
- Test:    ./gradlew :app:testDebugUnitTest
- Launch:  adb shell am start -n com.example.xr/.MainActivity

# Stack
- Kotlin + Jetpack Compose. Target an Android XR emulator (no headset).
- Jetpack XR SDK — APIs are 1.0.0-alphaNN and post-date your training data.
  Do NOT invent androidx.xr.* APIs. Use only names confirmed in the docs
  linked below or present in the Hello Android XR sample.

# Pinned, coordinated versions — do not bump
- androidx.xr.runtime:runtime:1.0.0-alpha14
- androidx.xr.scenecore:scenecore:1.0.0-alpha15
- androidx.xr.compose:compose:1.0.0-alpha14
- androidx.xr.arcore:arcore:1.0.0-alpha14
```

## Pointing it at Android XR

Because Jetpack XR is Kotlin and Compose, the spatial UI is the same composition model with spatial primitives layered on — `Subspace`, `SpatialPanel`, `Orbiter`, `SpatialRow`/`SpatialColumn`, and `SpatialGltfModel` to drop a glTF model straight into a Compose scene; SceneCore's `Session` + `GltfModelEntity` for the scene graph; ARCore for Jetpack XR (`Session`, `Anchor`/`AnchorEntity`, `Hand`) for perception. An agent fluent in Compose is most of the way there.

The setup is the standard Android XR setup, which the [getting-started piece](/news/androidxr-getting-started/) covers in full: the latest **Android Studio Canary** (Quail 2 Canary as of June 2026), an **Android XR system image and AVD** so the whole loop runs on the **emulator with no headset**, and the **pinned alpha dependencies** — with the [form-factor split](/news/androidxr-getting-started/) (API 36 immersive vs API 34 glasses) decided up front. Android Studio's own XR tooling rounds it out: the **XR emulator launches embedded in the IDE**, there is a **Jetpack XR project template**, and the **Layout Inspector supports XR apps** — all IDE features the agent operates beside, not agent features themselves.

A realistic hackathon loop: open the **Hello Android XR** sample from [android/xr-samples](https://github.com/android/xr-samples), point the agent's memory file at it and at the docs, and drive changes by prompt — add a `SpatialPanel`, load a glTF with `SpatialGltfModel`, anchor it with ARCore — letting the agent rebuild against the XR emulator each turn.

## The one catch that actually bites

**The XR APIs outrun the models, so an ungrounded agent will hallucinate them.** Every Jetpack XR library is still `1.0.0-alphaNN` and the surface churns between previews — models know the *early* alphas, not the current coordinated set, which is arguably worse than knowing nothing: asked to recall the API from memory, even the newest models confidently name composables that have since been renamed or removed, alongside ones that are still real. (We tested this — Claude's latest model rated a long-gone early-alpha composable "confident," missed the current glTF composable entirely, and estimated its own no-docs compile rate at 30–50%.) There is no documented XR-specific knowledge in any of them — Agent Mode, Claude Code, and Cursor all treat XR as ordinary Compose. The fix is grounding, and it is not optional: pin the coordinated alpha versions, put the real API surface and doc links in the memory file, keep an [official sample](https://github.com/android/xr-samples) open as a reference the agent can read, and let the **build be the backstop** — a hallucinated API fails to compile, and a closed-loop agent will see that and correct.

## Caveats to plan around

- **Ground the agent, or it invents XR APIs.** The alpha, post-training Jetpack XR surface is the whole risk; the memory file, pinned versions, an open sample, and the compile loop are the mitigation.
- **Pin coordinated versions.** The `androidx.xr.*` libraries are a matched set on different alpha numbers ([SceneCore leads at `alpha15`](/news/androidxr-getting-started/)); an agent that "helpfully" bumps one will break the build. Lock them in `libs.versions.toml`.
- **Channel and status flags.** Agent Mode's model-flexibility and the Claude Code Android Studio plugin (Beta) are current but moving; Cursor's Android support is a community workaround, not first-party. The XR SDK is still Developer Preview 4 (alpha), with core libraries flagged to reach Beta "soon."
- **Filesystem hygiene with two tools open.** Keep the project under `/Users/<name>/…` (macOS Gradle file-watching skips `/System/Volumes/Data`); trigger a Gradle sync after the agent edits `build.gradle.kts` or `libs.versions.toml`; `./gradlew --stop` if an IDE and a CLI daemon collide.
- **Verify a few things at event time.** Android Studio's Canary codename rolls fast (Quail today, something newer tomorrow — install the *latest* Canary, not a fixed name); Gemini CLI's consumer tiers end 18 June 2026 in favor of Antigravity CLI; and the model lineups inside Agent Mode and Cursor change often. Check on the day.

## Useful links

- [Gemini Agent Mode](https://developer.android.com/studio/gemini/agent-mode) · [Agent files (AGENTS.md)](https://developer.android.com/studio/gemini/agent-files) · [LLM flexibility (Otter 3)](https://android-developers.googleblog.com/2026/01/llm-flexibility-agent-mode-improvements.html)
- [Claude Code for JetBrains / Android Studio](https://code.claude.com/docs/en/jetbrains) · [Kotlin LSP plugin](https://claude.com/plugins/kotlin-lsp)
- [Jetpack XR SDK](https://developer.android.com/develop/xr/jetpack-xr-sdk) · [android/xr-samples — Hello Android XR](https://github.com/android/xr-samples)
- Related: [Getting Started with Android XR](/news/androidxr-getting-started/) — the XR setup this builds on · [Vibe Coding for Spectacles](/news/vibe-coding-spectacles/) — the Lens Studio analog
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
