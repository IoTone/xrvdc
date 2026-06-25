# Hackathon Path Tool — Design & Test Plan

> **Status: BUILT & VERIFIED (2026-06-25, site v1.53).** Implemented as a
> client-side ES-module app. Files: `content/path.{en,ja}.md` (layout
> `pathtool`), `themes/xrvdc-neon/layouts/_default/pathtool.html`,
> `static/path/js/{path-data,path-engine,path-app}.js`. Linked from the home
> hero CTA and the top nav (weight 23). Tests: `tests/path/` (`node
> tests/path/run-tests.mjs`). **Source of truth for weights is
> `static/path/js/path-data.js`** — the table below is the design intent; the
> verification loop tuned a few values (student `P1` 2→3; `designer3d` gained
> `P1:1`; `macSilicon` `P4` 3→2 so non-coders aren't pushed into Xcode;
> `phoneBrowser` `P3` 3→2 and gained `P8:2` so phone-capture creatives aren't
> swamped by the WebXR default).
>
> **Verification results:** 18/18 golden personas pass; all invariants hold
> across all 3,744 legal combinations (no dead path, guards intact, every path
> reachable); 62/62 catalog links (31 articles × EN/JA) resolve in the build;
> Hugo build clean; both `/path/` and `/ja/path/` render. Pending: on-device
> mobile/AVP tap-through (manual).


A mobile-first, client-side decision tool linked from the xrvdc.org home page.
It asks a participant a few quick questions and recommends one **primary path**
plus one or two **alternates**, each pointing at our own Starter / Workflow news
articles. No backend — pure static HTML+JS, bilingual (EN/JA), phone-friendly,
shareable result via URL hash.

---

## 1. Goals & constraints

- **Audience:** everyone from pure creatives (3D video, splats, gen-AI) to
  hardcore coders, plus entrepreneurs who want a top-down spec→prompt approach.
- **Outcome:** a recommended path (or paths) that links *our existing starter
  projects*, so the tool feeds people straight into content we already wrote.
- **Surface:** loads on a phone at the venue; readable, one question per screen,
  big tap targets, works offline once loaded.
- **Neutral on AI:** ask about AI familiarity *without* nudging toward it. People
  who opt out of AI must get a viable hand-built path and AI copy stripped.
- **Fits the stack:** Hugo static site, neon theme, bilingual. Mirror the
  existing `layout: xr` + `static/xr/js/*` pattern (a self-contained JS app
  mounted on a content page) so it inherits site chrome and the i18n machinery.

---

## 2. Questions (inputs)

One question per screen. Five questions, ~30 seconds total.

| # | Question | Options | Why |
|---|----------|---------|-----|
| Q1 | Is this your first hackathon? | Yes / No | Friction tolerance. First-timers get gentler on-ramps. |
| Q2 | Which best describes you? | (a) Artist (b) Coder/Engineer (c) Entrepreneur (d) 3D designer (e) UX designer (f) Teacher (g) Student (h) Videographer/Photographer (i) Other | Primary signal for engineer vs non-engineer and toolset familiarity. |
| Q2b | *(only if Q2 = Coder/Engineer or 3D designer)* Do you build games? | Yes, with a game engine / A little / No | Game devs gravitate to engine tools (Unity, Unreal, Godot, Lens Studio); separates the engine track from the web/native-app track. |
| Q3 | How do you feel about using AI tools? | Haven't used them / Used them a little / Use them regularly / Prefer not to use AI | AI affinity — phrased neutrally; the opt-out is a first-class choice, not a downgrade. |
| Q4 | Your experience with AR/VR/XR/MR? | New to me / Used it before / Very experienced | Depth of on-ramp. |
| Q5 | What computer will you build on? | Mac (Apple Silicon — M1 or newer) / Older Intel Mac / Windows or Linux PC / Phone or browser only | **Load-bearing.** *Native* visionOS builds (Xcode RealityKit/ARKit, Unity-PolySpatial→AVP, Unreal→AVP) require an **Apple-Silicon Mac**. The WebXR-on-anything default and the AVP-as-runtime routing also key off this. Skill-neutral — asks about hardware, not ability. |
| Q6 | Are you more drawn to lightweight AR glasses or fully immersive VR/MR? | AR glasses (see-through) / Immersive VR or MR headset / No preference | Form-factor intent. Glasses → Spectacles/Lens, XREAL & Android XR glasses, Meta Ray-Ban wearables, STYLY WebAR. Immersive → Quest 3 (WebXR / Godot / Unity), AVP immersive. Cuts across role, so asked of everyone. |

> Q5 is added beyond the brief's first two questions because the user's own
> stated rule — "if a Mac user it is good to recommend Xcode" — cannot be honored
> without knowing the platform. The Apple-Silicon vs Intel split is required
> because Xcode cannot build/simulate visionOS on Intel. It asks about hardware,
> not skill, so it does not bias toward engineer/non-engineer.

### Apple Vision Pro: build target vs. runtime (important)

AVP must remain a recommendable option for **everyone**, but it has two very
different modes that gate differently:

- **Native visionOS dev** — Xcode (RealityKit/ARKit), Unity PolySpatial→AVP,
  Unreal→AVP. **Requires an Apple-Silicon Mac.** Hard-gated (path P4, and the
  "→ AVP" variant of P6).
- **AVP as a runtime / design surface** — **no Mac required**, just the headset
  (the venue + STYLY provide devices):
  - **Babylon.js / WebXR** in Safari on visionOS → P3
  - **STYLY player** (runs great on AVP) → P1
  - **In-headset / spatial design tools** — design in a tool and submit the
    design itself as the project → P8
  - **3D content viewing** — Matterport, Scaniverse → P8

So a non-Mac participant can still target AVP; the engine routes them to it
through Babylon / STYLY / design / viewer rather than native Xcode. Result
screens carry an **"On Apple Vision Pro"** affordance line on P1, P3, and P8.

### Derived dimensions

- **engineer vs non-engineer:** `coder/engineer` → engineer. `entrepreneur,
  3d designer, ux designer` → maker (technical-adjacent). `artist, teacher,
  student, videographer/photographer, other` → non-engineer by default.
  Disambiguated upward by high AI-familiarity + high XR-experience (a CS student
  reads as engineer-leaning without us asking their major).
- **ai-affinity:** none / low / high, plus an explicit **opt-out** flag.
- **gamedev:** yes / some / no / **n/a** (n/a when Q2b wasn't shown — i.e.
  non-engineer, non-3d-designer roles).
- **formfactor:** glasses / immersive / none.
- **xr-experience:** new / some / experienced.
- **platform:** mac-silicon / mac-intel / pc / phone-browser. Only **mac-silicon**
  unlocks *native* visionOS; all four can target AVP as a runtime via P1/P3/P8.

---

## 3. Paths (recommendation targets)

Nine paths span pure-creative → hardcore-coder. Each links our own articles.

| Path | For whom | Primary articles (our content) | Platform | AI note |
|------|----------|-------------------------------|----------|---------|
| **P1 STYLY (no-code spatial)** | students, artists, teachers, UX, no-code | `/news/styly-sdks-ar-vr/`, `/news/styly-sponsor/` | any (web/mobile) | optional |
| **P2 Lens Studio / Spectacles** | Unity devs *or* non-devs leaning gen-AI | `/news/getting-started-snap-spectacles-lens-studio/`, `/news/lens-studio-assets-spectacles/`, `/news/vibe-coding-spectacles/`, `/news/midi-bleep-blop-spectacles/` | Mac/PC | gen-AI variant |
| **P3 WebXR (browser-first)** | coders without VR yet; any device | `/news/aframe-webxr-starter/`, `/news/babylonjs-webxr-starter/`, `/news/immersive-web-sdk-ai-native/` | any browser | AI-native option |
| **P4 Apple / visionOS native (Xcode)** | Apple-Silicon Mac coders | `/news/vision-pro-mixed-reality-realitykit-arkit/`, `/news/visionos-2-30-days/`, `/news/vision-pro-object-manipulation-visionos26/`, `/news/webspatial-sdk-visionos/`, `/news/vibe-coding-xr/` | **Apple-Silicon Mac only** | Xcode AI assistant |
| **P5 Android XR & AR glasses** | Android devs, AI-curious, glasses-leaning; no headset needed | `/news/androidxr-getting-started/`, `/news/agentic-coding-android-studio/`, `/news/xreal-android-xr-glasses/`, `/news/meta-wearables-webapp-sdk/` | PC/Mac | agentic option |
| **P6 Unity / Unreal (engines)** | experienced devs, 3D designers | `/news/vision-pro-mixed-reality-unity-polyspatial/`, `/news/unreal-engine-vision-pro-getting-started/`, `/news/image-blaster-xr-pipeline/` | Win/Mac | — |
| **P7 Godot XR (free engine)** | students, hobbyists, devs wanting free/open | `/news/godot-xr-quest-3/`, `/news/godot-xr-tools-interaction/`, `/news/godot-webxr-browser/` | any | — |
| **P8 Creative / Capture** | videographers, photographers, 3D/creative, artists | `/news/3dgs-360-camera-workflow/`, `/news/scaniverse-3dgs-webxr-godot/`, `/news/lito-single-image-3dgs-webxr/`, `/news/sharp-photo-to-splat-webxr/`, `/news/spatial-video-capture-to-headset/`, `/news/make-art-inside-xr/`, `/news/lichtfeld-studio-mcp-xr/` | phone + any | AI splat loop |
| **P9 Vibe-coding / Agentic (top-down)** | entrepreneurs, AI-high, ship-fast first-timers | `/news/vibe-coding-xr/`, `/news/vibe-coding-spectacles/`, `/news/agentic-coding-android-studio/`, `/news/immersive-web-sdk-ai-native/` | any | **AI-centric** |

The result screen shows the primary path with a one-line "why this fits you,"
the linked starter articles, and 1–2 alternates collapsed below.

---

## 4. Recommendation engine (weighted scoring, not a brittle tree)

Each path accrues points from each answer. Highest total = primary; next 1–2 =
alternates. A weighted matrix is chosen over a decision tree because it degrades
gracefully on unusual combinations and is exhaustively testable.

### Weight table (initial; tuned against the golden personas in §6)

**Q2 role → path** (largest signal):
- artist → P8 +3, P1 +3, P2 +2, P9 +1
- coder/engineer → P3 +3, P5 +2, P4 +2, P6 +2, P9 +1
- entrepreneur → P9 +3, P1 +1, P3 +1, P2 +1
- 3d designer → P6 +3, P8 +2, P7 +2, P2 +1
- ux designer → P1 +2, P3 +2, P2 +2, P9 +1
- teacher → P1 +3, P7 +1, P8 +1, P9 +1
- student → P1 +2, P7 +2, P3 +1, P8 +1, P2 +1, P9 +1
- videographer/photographer → P8 +3, P1 +1, P2 +1
- other → P1 +1, P3 +1, P8 +1 (rely on Q3–Q5)

**Q1 first hackathon:**
- yes → P1 +1, P3 +1, P9 +1, P2 +1; P6 −1, P4 −1 (favor low-friction)
- no → P6 +1, P4 +1

**Q3 AI familiarity:**
- use regularly → P9 +2, P5 +1, P4 +1, P2 +1, P8 +1
- a little → P9 +1
- haven't used → 0 (no penalty to non-AI; no push to AI)
- **prefer not to use AI → P9 −5 (suppress); P3 +1, P6 +1, P7 +1** and strip AI copy

**Q2b game dev** (only engineer / 3d-designer):
- yes (engine) → **P6 +3**, P2 +2, P7 +2; P3 −1 (pull toward engines, away from raw web)
- a little → P6 +1, P7 +1, P2 +1
- no → P3 +1, P5 +1, P4 +1 (web/native-app track)
- n/a → 0

**Q6 form-factor:**
- glasses → **P2 +2** (Lens/Spectacles), P5 +2 (XREAL/Android XR glasses, Meta
  Ray-Ban wearables), P1 +1 (STYLY WebAR); P6 −1, P7 −1 (engine VR less apt)
- immersive → **P3 +1**, P7 +2 (Godot Quest), P6 +1, P4 +1 (AVP immersive),
  P1 +1 (STYLY VR)
- none → 0

**Q4 XR experience:**
- new → P1 +1, P3 +1, P9 +1, P2 +1; P6 −1
- some → P3 +1, P6 +1
- experienced → P6 +2, P4 +1, P5 +1, P3 +1

**Q5 platform:**
- mac-silicon → **P4 +3**, P2 +1, P6 +1
- mac-intel → **P4 −5 (no native visionOS)**, P2 +1, P6 +1, P3 +1 (Lens / WebXR /
  Unity-for-Quest fine; AVP reachable via P1/P3/P8 runtime)
- pc → **P4 −5 (no native visionOS)**, P5 +1, P6 +1, P3 +1
- phone-browser → **P3 +3**, P1 +2, P9 +1; P4 −3, P6 −1

> AVP-runtime affordance (independent of score): whenever P1, P3, or P8 appears
> in the result, attach the "On Apple Vision Pro" line — so non-Mac users still
> see AVP as a live option.

### Guards (applied after scoring)

1. **Native visionOS requires an Apple-Silicon Mac.** Unless platform =
   mac-silicon, P4 is removed from primary candidacy and the "→ AVP" variant of
   P6 is suppressed; P4 may appear only as an alternate tagged "needs an
   Apple-Silicon Mac." This never removes AVP as an option — P1/P3/P8 still carry
   the "On Apple Vision Pro" runtime affordance for non-Mac users.
2. **AI opt-out suppresses P9** and removes AI-emphasis sentences from any
   surviving path's copy.
3. **Tie-break** by fixed priority order: P3, P1, P8, P9, P5, P7, P2, P6, P4
   (low-friction / broadest-reach first), so results are deterministic.
4. **Floor:** if the top score ≤ 0 (degenerate input), fall back to P3 (WebXR)
   for engineers / P1 (STYLY) for non-engineers.

---

## 5. Implementation shape

- **Page:** `content/path.en.md` + `content/path.ja.md`, `layout: pathtool`.
  Menu link (weight ~23, after Hackathon) **and** a hero CTA button on the home
  landing page (`landing.html`, alongside About / Schedule).
- **Layout:** `themes/xrvdc-neon/layouts/_default/pathtool.html` — container +
  mount point, includes the JS.
- **JS (static, no build step):**
  - `static/path/js/path-data.js` — questions, paths, the starter-article
    catalog, and the EN/JA string tables (keyed by lang).
  - `static/path/js/path-engine.js` — **pure** `score(answers) → ranked paths`.
    No DOM. This is the unit under test.
  - `static/path/js/path-app.js` — state machine, rendering, hash routing.
- **Styling:** reuse neon theme CSS variables; one small `static/path/css/path.css`
  for the quiz cards and progress dots. Min 44px tap targets; single column.
- **Bilingual:** page `.Lang` selects the string set; article links built
  lang-aware (`/news/...` vs `/ja/news/...-入門/`).
- **Shareable / resumable:** answers encoded in `location.hash` so a result is
  linkable and back/restart work without a server.
- **Version bump:** `params.staging.version` in `hugo.toml` on each change
  (deploy-verification signal).

---

## 6. Test plan — proving it recommends *well*

Three layers. Layer A is the core "scoring" mechanism the brief asks for.

### A. Golden-persona unit tests (authoritative)

A `personas.json` of `{answers, expectPrimary, expectAlternatesInclude}` run
through `path-engine.js` headless (node) and asserted. These encode the user's
explicit expectations as pass/fail gates:

| # | Persona (Q1/Q2/Q3/Q4/Q5) | Expect primary | Expect alternate incl. |
|---|--------------------------|----------------|------------------------|
| G1 | yes / student / haven't / new / browser | **P1 STYLY** | P9 or P2 |
| G2 | yes / student / regularly / new / browser | P1 STYLY | **P9 vibe**, P2 |
| G3 | no / coder / a little / new / pc | **P3 WebXR** | P5 |
| G4 | no / coder / a little / new / **mac-silicon** | **P4 Apple/Xcode** | P3 |
| G5 | no / 3d designer / regularly / experienced / pc | **P6 Unity/Unreal** | **P2 Lens**, P8 |
| G6 | yes / artist / regularly / new / android | P8 or **P1** | **P2 Lens**, P9 |
| G7 | yes / entrepreneur / regularly / new / browser | **P9 vibe** | P1, P3 |
| G8 | no / videographer / haven't / some / android | **P8 Creative** | P1 |
| G9 | yes / coder / **prefer not / new / pc** | **P3 WebXR** (no P9, no AI copy) | P7, P6 |
| G10 | yes / teacher / haven't / new / browser | **P1 STYLY** | P7 |
| G11 | yes / ux designer / a little / new / mac | P1 or P3 | **P2 Lens** |
| G12 | no / coder / regularly / experienced / pc | **P5/P6** | P3, P9 |
| G13 | no / coder / a little / experienced / **mac-intel** (wants AVP) | **P3 WebXR** *not* P4; "On Apple Vision Pro" line shown | P6, P1 |
| G14 | yes / 3d designer / a little / new / **phone-browser** (wants AVP) | **P1 STYLY** w/ AVP line | P8, P3 |
| G15 | no / coder / a little / experienced / pc / **gamedev=yes / immersive** | **P6 Unity/Unreal** | P7, P3 |
| G16 | no / 3d designer / regularly / some / mac-silicon / **gamedev=yes / glasses** | **P2 Lens** | P6, P5 |
| G17 | no / coder / a little / some / pc / **gamedev=no / immersive** | **P3 WebXR** | P5, P7 |
| G18 | yes / student / haven't / new / android / **glasses** | **P1 STYLY** or P5 | P2 |

> Persona columns list the core answers; **Q2b defaults to n/a and Q6 to none**
> unless the row names them (in bold). Q2b is only legal for coder/3d-designer
> rows.

These directly verify the brief's named cases: student-no-code→STYLY (G1),
coder-no-VR→WebXR / Mac→Xcode (G3/G4), Lens→Unity-devs *or* gen-AI-non-devs
(G5/G6), entrepreneur→vibe/top-down (G7), pure-creative→capture (G8), AI-opt-out
respected (G9).

### B. Full cross-product audit (catches what the golden set misses)

Programmatically enumerate **all legal answer combinations** — Q2b only branches
for the two engine-track roles, so the space is
`(7 roles × 2×4×3×4×3) + (2 roles × 2×4×3×4×3×3) = 2016 + 1728 = 3,744` — through
the engine and flag any that violate an invariant:

1. No primary with score ≤ 0 (every persona gets a real recommendation).
2. **Guard integrity:** P4 never primary unless platform=mac-silicon; the
   "→ AVP" variant of P6 never shown off mac-silicon; P9 never present when AI
   opt-out chosen. **Conversely:** AVP must remain reachable — every platform
   value must yield at least one result carrying the "On Apple Vision Pro"
   affordance (via P1/P3/P8), so non-Mac users are never told AVP is off-limits.
3. **Reachability:** every one of P1–P9 is the primary for *at least one* legal
   persona (no dead path; no path that can never win).
4. **No unresolved ties** (tie-break always produces a single primary).
5. **Sanity bands:** non-engineer roles never get P4/P6 as *primary* on a
   first-hackathon; engineer roles always get a code-capable path in top 2.

Output a coverage matrix (role × platform → primary) for human review — a quick
visual check that the spread looks right.

### C. Manual / UX / integration tests

- **Mobile:** 360px and 390px widths; one question per screen; 44px targets;
  no horizontal scroll; thumb-reachable Next/Back.
- **Bilingual:** every string renders in EN and JA; JA result links resolve to
  `…-入門/` slugs.
- **Link integrity:** all recommended article URLs exist — reuse the existing
  build link-check (`hugo` build + crawl) so a renamed/removed article fails CI.
- **AI opt-out copy:** confirm AI sentences are actually stripped, not just P9
  hidden.
- **Flow:** back, restart, deep-link to a result via hash, reload mid-quiz.
- **A11y:** keyboard navigation, focus order, contrast against the neon theme,
  `prefers-reduced-motion`.
- **Offline:** loads and completes with network disabled after first load.

### D. Tuning loop

Run A+B, read the coverage matrix, adjust weights in `path-data.js`, re-run.
The matrix is the scoreboard: the system "recommends well" when all golden
personas pass, all invariants hold, and the role×platform spread reads sensibly
to a human reviewer. Weights live in data (not code) so tuning is a one-file edit
re-validated by the same harness.

---

## 7. Open questions for sign-off

1. **Question count** — now Q1, Q2, *Q2b (conditional game-dev)*, Q3, Q4, Q5, Q6:
   five taps for most people, six for engine-track roles. OK, or trim? Q5
   (platform) and Q2b/Q6 are each load-bearing for a named routing rule.
2. **Placement** — home hero CTA *and* a top-nav "Path" link, or hero only?
3. **Scope of v1** — ship all 9 paths, or start with the 5–6 highest-traffic and
   add the rest after the tuning loop?
4. **Result depth** — single primary + 2 alternates (proposed), or show a full
   ranked list?
