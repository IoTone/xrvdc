---
title: "Building for Meta Ray-Ban Display Glasses with the Wearables Web App Toolkit"
date: 2026-05-17T10:00:00+09:00
slug: "meta-wearables-webapp-sdk"
tag: "STARTER"
summary: "Part two of the native-platform starter series: build experiences for Meta Ray-Ban Display glasses with plain HTML/CSS/JS and an AI-assisted toolkit — from install to on-glasses deploy."
---

Second in our **native-platform starter series** for XR VisionDevCamp Fukuoka 2026. After [Snap Spectacles and Lens Studio](/news/getting-started-snap-spectacles-lens-studio/), we turn to another headset: **Meta Ray-Ban Display glasses**, where the on-ramp is the web stack you already know.

## Web Apps, not a new engine

Apps for Meta Ray-Ban Display (MRBD) glasses are standard **HTML / CSS / JavaScript** rendered on the glasses — a familiar, fast path to a working demo, especially with AI-assisted coding tools. Meta ships an open-source **Wearables Web App AI Toolkit** with plugins for **Claude Code, Codex, Cursor, and GitHub Copilot** that scaffold apps against the glasses' design system.

▸ [meta-wearables-webapp on GitHub](https://github.com/facebookincubator/meta-wearables-webapp) · [Web Apps developer docs](https://wearables.developer.meta.com/docs/develop/webapps)

## The constraints that shape every app

The display is a **600×600dp additive waveguide** — design to it from the first line:

- **Black is transparent.** Use dark gray `#1C1E21` as the background and white `#FFFFFF` for text/icons; aim for ≥4.5:1 contrast.
- **No touch, no cursor.** Input is a **D-pad** (an EMG wristband or captouch translates gestures to arrow keys). Enter selects, Escape goes back. Every interactive element needs a `.focusable` class and must be reachable by sequential navigation — keep flows ≤3 steps.
- **Safe zone:** 8dp margin (584×584dp usable). Button height 88dp; minimum 14dp for interactive type.
- **Performance budget:** <3s load, <500KB gzipped JS, 60fps, <128MB memory, <10 network requests. Vanilla JS or lightweight frameworks; CSS transitions over JS animation; no idle intervals.
- **Sensors:** accelerometer, gyroscope, magnetometer and orientation via the W3C Generic Sensor API.

## Quick start

**1. Install the AI skills** (Claude Code shown; Codex/Cursor/Copilot supported):

```bash
# Plugin marketplace (recommended)
/plugin marketplace add https://github.com/facebookincubator/meta-wearables-webapp
/plugin install meta-wearables-webapp@meta-wearables

# …or the install script
git clone https://github.com/facebookincubator/meta-wearables-webapp.git
./install-skills.sh claude     # or: cursor | copilot | all
```

**2. Describe the app.** In your AI editor: *"Create a weather app that shows the 5-day forecast with D-pad navigation."* The toolkit scaffolds `index.html`, `styles.css`, and `app.js` following the display design system. Included skills: `create-webapp`, `add-screen`, `add-button`, `connect-api`, `add-sensors`.

**3. Test in the browser.** Run it locally and use the **arrow keys** to simulate the D-pad. For location/IMU, open Chrome DevTools → ⋮ → More tools → **Sensors** to override location and orientation.

**4. Deploy to glasses.** Host at a **public HTTPS URL** (Vercel or any provider). Then either generate a QR code with the publish skill and scan it to deep-link into the Meta AI app, or add it manually: **Meta AI app → Devices → Display Glasses settings → App connections → Web apps → Add a web app**.

## Why this fits a 2.5-day hackathon

- **Zero engine ramp-up** — if you can ship a web page, you can ship a glasses app.
- **AI-assisted scaffolding** that already encodes the display, input, and performance rules so you spend time on the idea, not the constraints.
- **Real sensors and APIs** — connect REST/WebSocket services and read device motion for genuinely spatial interactions.

Start from the bundled **Snake** example in `examples/` to see D-pad navigation and state handling end to end, then remix.

## Useful links

- [meta-wearables-webapp repository](https://github.com/facebookincubator/meta-wearables-webapp) (BSD-licensed)
- [Web Apps developer documentation](https://wearables.developer.meta.com/docs/develop/webapps)
- [Full API reference](https://wearables.developer.meta.com/llms.txt?full=true)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Next in the series: capturing photoreal scenes for your XR project. Questions? Reach us via the [Contact](/contact/) page.
