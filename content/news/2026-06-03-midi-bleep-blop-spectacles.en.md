---
title: "Turn Spectacles into a MIDI Controller — the MIDI Bleep Blop Starter"
date: 2026-06-03T14:00:00+09:00
slug: "midi-bleep-blop-spectacles"
tag: "STARTER"
summary: "A brand-new, first-party experimental starter from IoTone that turns a Snap Spectacles Lens into a live MIDI controller — driving real synths and DAWs. The interesting part is the architecture: because Spectacles can't pair bonded BLE-MIDI devices on-device, it routes MIDI through a WebSocket bridge to a companion computer's CoreMIDI / ALSA / WinMM."
---

[**MIDI Bleep Blop**](https://github.com/IoTone/MIDIBleepBlop) (package `midi-bleep-bop`) is a MIT-licensed TypeScript project from **IoTone** — an [organizing partner](/sponsors/) of the hackathon — that lets a [Snap Spectacles](/news/getting-started-snap-spectacles-lens-studio/) Lens generate MIDI notes and play them on real synths and DAWs (KORG Volca, GarageBand, Logic Pro, Ableton are all referenced). It is a creative, musical counterpoint to the visual starters we've covered, and a good hackathon seed if your idea involves sound.

A note up front: this is **very new and experimental** — version `0.1.0`, a handful of commits, days old, actively developing. Treat it as a "watch this space" starter to clone and remix, not a finished package.

## The interesting part: why there's a bridge

The architecture is the real lesson here. Spectacles **cannot speak MIDI directly to hardware**, and the reason is specific: the Spectacles Bluetooth API lacks `createBond()` support, and commercial BLE-MIDI devices universally require bonding — so a peripheral that needs bonding silently hangs. Direct lens-to-hardware MIDI is therefore infeasible today.

MIDI Bleep Blop routes around this with a companion bridge:

```
Spectacles Lens ──ws/wss──► bridge (Node or Bun) ──► CoreMIDI / ALSA / WinMM ──► synth
```

The Lens uses a `SpectaclesWebSocketTransport` built on Lens Studio's **`InternetModule`** WebSocket API; the bridge is a small Node/Bun server that talks to the OS MIDI subsystem via the JZZ library. This is also a transferable pattern: it's the same "Lens talks to a companion app over WebSocket" trick you'd use for any hardware Spectacles can't reach directly.

## What's in the repo

It is a TypeScript monorepo. The pieces that matter for a hackathon:

- **`lens/MidiBleepBop.lspkg`** — the distributable Lens Studio package: a `MidiClientComponent`, a `MidiClient` prefab, and the bundled core + transport scripts. Drop it into your own Lens.
- **`lens/TesterLens`** — an end-to-end Spectacles '24 Lens Studio project with a diagnostic panel and a `NoteCubeFlash` that reacts to incoming MIDI.
- **`bridge/`** — the Node/Bun WebSocket-to-MIDI server.
- **`examples/`**, **`docs/`** — runnable examples and unusually thorough docs (architecture, bridge, wire protocol, Spectacles API, grooves).

Higher-level building blocks include a `ChordSender` groove generator (triad, acid, house, trance patterns), a `PianoKeyboard` component, and a `DeviceCatalogComponent` for named CC parameters (e.g. a Volca Bass "Cutoff EG intensity").

## Getting it running

1. Clone the repo, then `npm install` and `npm run build` (`npm test` runs the vitest suite).
2. Pick a MIDI destination. The no-hardware path on macOS: enable the **IAC Driver** in Audio MIDI Setup and route into GarageBand/Logic/Ableton. With hardware: a WIDI Master / KORG BLE-MIDI dongle to a synth.
3. Start the bridge — e.g. `npm run play:gb` for a GarageBand chord loop, or `node bridge/dist/cli.js --device "IAC Driver Bus 1" --log debug`. Confirm with `curl http://127.0.0.1:8765/status`.
4. Open **TesterLens** in **Lens Studio 5.9+** (5.10 recommended), enable **Project Settings → Experimental APIs**, and set the Bridge URL to your **machine's LAN IP** — `localhost` resolves to the glasses, not your computer.
5. Press Play in Preview and watch the status go `connecting → open` as the cube reacts to MIDI. From there, drop `MidiClientComponent` into your own Lens and call `sendNoteOn` / `sendCC` / `sendPitchBend`.

## Caveats

- **Brand-new and experimental.** `v0.1.0`, single-digit commits, 9 open issues. Expect rough edges.
- **The npm packages may not be published yet.** The repo root is `private`, so lead with clone-and-build rather than `npx`.
- **A companion computer is required** — the bridge can't run on the glasses. Spectacles hardware itself is optional at first; Preview mode works.
- **Platform notes:** `ws://` needs Experimental APIs and **can't be published** (published Lenses need `wss://`/TLS); there's no device discovery (set the IP manually); no auth, so anyone on the LAN can send MIDI. macOS is the best-trodden path.

## Useful links

- [MIDIBleepBlop repository](https://github.com/IoTone/MIDIBleepBlop) · [architecture doc](https://raw.githubusercontent.com/IoTone/MIDIBleepBlop/main/docs/architecture.md) · [Spectacles API doc](https://raw.githubusercontent.com/IoTone/MIDIBleepBlop/main/docs/spectacles-api.md)
- [Getting Started with Snap Spectacles and Lens Studio](/news/getting-started-snap-spectacles-lens-studio/) — the toolchain
- [Six Lens Studio Assets to Level Up Your Spectacles Projects](/news/lens-studio-assets-spectacles/) — building blocks
- [Vibe coding for Spectacles](/news/vibe-coding-spectacles/) — AI-assisted Lens scripting
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
