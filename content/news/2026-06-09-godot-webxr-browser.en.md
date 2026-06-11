---
title: "Ship Godot XR as a URL — the WebXR Export Path"
date: 2026-06-09T10:00:00+09:00
slug: "godot-webxr-browser"
tag: "STARTER"
summary: "The native Quest build needs sideloading and developer mode. Godot's WebXR export needs neither — judges open a link in the headset browser. Same project, a different XR interface, and one hosting gotcha that trips everyone. It even reaches Vision Pro Safari (VR-only)."
---

The [native OpenXR build](/news/godot-xr-quest-3/) is the high-performance Godot XR route, but distributing it means an APK, developer mode, and a USB cable. **WebXR export** is the opposite trade: no install, no store, no sideload — you host the project and people open a **URL** in the headset browser. For a hackathon demo where judges and teammates need to try your build in seconds, that reach is the whole point. The counterweight is real: lower performance, weaker input, and a hosting-headers requirement that catches every first-timer.

▸ [WebXRInterface reference](https://docs.godotengine.org/en/stable/classes/class_webxrinterface.html) · [Exporting for the Web](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)

## A different interface from OpenXR

WebXR is **not** OpenXR. With OpenXR, the OS/platform runtime drives the headset. With WebXR, the **browser** is the XR runtime, via the WebXR Device API — so you initialize a different interface, `WebXRInterface`, and it's signal-driven because the underlying browser API is asynchronous. There is no dedicated WebXR tutorial page in the Godot docs the way OpenXR has one; the canonical walkthrough lives in the [`WebXRInterface` class reference](https://docs.godotengine.org/en/stable/classes/class_webxrinterface.html) plus the [web export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) page.

## Two hard constraints, stated up front

**Renderer: Compatibility only.** Per the Godot 4.6 export docs, web targets WebGL 2.0 via the Compatibility rendering method — Forward+ and Mobile do not run on the web, and WebGPU isn't usable yet. Set your project to the **Compatibility** renderer before you export.

**Hosting: HTTPS, and headers if you use threads.** WebXR is a powerful browser feature gated to secure contexts, so it **requires HTTPS** (localhost is exempt for testing). On top of that, Godot's threaded web build uses `SharedArrayBuffer`, which requires two cross-origin isolation headers on the origin serving your `index.html`:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

For a hackathon, the simplest path is to **export single-threaded** (re-added in Godot 4.3) — no `SharedArrayBuffer`, so no special headers, just HTTPS. You trade some performance headroom for being able to host on itch.io or any static host. If you control the headers (or use Godot's PWA export, whose service worker injects them, or the community `godot-coi-serviceworker`), the threaded build gives more performance.

## The init code

WebXR setup is signal-driven, and immersive sessions **must start from a user gesture** — browsers block `initialize()` outside a button press. The shape:

```gdscript
var webxr_interface

func _ready():
    webxr_interface = XRServer.find_interface("WebXR")
    if webxr_interface:
        webxr_interface.session_supported.connect(_on_supported)
        webxr_interface.session_started.connect(_on_started)
        webxr_interface.session_ended.connect(_on_ended)
        webxr_interface.is_session_supported("immersive-vr")  # async → fires session_supported

# Call ONLY from a button press (the required user gesture):
func _on_enter_vr_pressed():
    webxr_interface.session_mode = "immersive-vr"
    webxr_interface.requested_reference_space_types = "bounded-floor, local-floor, local"
    webxr_interface.required_features = "local-floor"
    webxr_interface.optional_features = "bounded-floor, hand-tracking"
    if not webxr_interface.initialize():
        return  # handle failure

func _on_started():
    get_viewport().use_xr = true
```

Note the lookup is `XRServer.find_interface("WebXR")` — different from the `"OpenXR"` lookup in the native article. Build steps: install the **Web export templates** (Manage Export Templates), add a **Web** preset, set Thread Support per the trade-off above, export, then serve over HTTPS. For local iteration, the editor's **Run in Browser** spins up a local server (localhost is HTTPS-exempt, so single-threaded builds test cleanly).

## Where it runs

- **Meta Quest 3 browser** — full WebXR, 90Hz, controllers and hands. The primary, reliable target. (Wolvic is a solid alternative browser.)
- **Apple Vision Pro Safari** — supports `immersive-vr` **by default since visionOS 2** (no flag). This is notable: the [native Godot OpenXR path can't reach AVP at all](/news/godot-xr-quest-3/), but **WebXR can** — as fully-immersive VR. The catch: the WebXR **AR module (`immersive-ar`) is non-functional** on visionOS, so there's no passthrough — opaque VR only. AVP's primary input is eye-gaze + pinch (delivered as `select` events), not controllers; test that path explicitly.
- **Android XR / Samsung Galaxy XR** — Chrome ships full WebXR; the emerging third target.
- **Desktop browsers** with a tethered headset — useful for development.

## Caveats to plan around

- **The headers gotcha is the #1 thing that breaks people.** A threaded build served without COOP/COEP over HTTPS fails with `SharedArrayBuffer is not defined` or a blank screen. Go single-threaded + HTTPS for a hackathon unless you control the headers.
- **Performance is well below native.** WebGL 2.0, Compatibility renderer, and (single-threaded) no worker threads — budget aggressively versus the native Quest build.
- **Input is thinner than OpenXR.** WebXR maps input sources but lacks OpenXR's full action-map abstraction; button/axis fidelity depends on what the browser exposes per device.
- **No passthrough/AR in most browser configs**, AVP included — plan for opaque VR.
- **Less battle-tested than native.** Godot's WebXR interface is real and maintained, but the native OpenXR path is the more mature, higher-performance route. WebXR is the reach-and-convenience play, not the shipping-title play.
- **Verify a couple of things at event time.** Whether WebXR strictly needs the threaded build isn't documented (it runs single-threaded; threads only help performance — don't assume a hard requirement), and AVP's `immersive-ar` flag status can shift between visionOS builds. Check on the actual device/OS you'll demo on.

## Useful links

- [WebXRInterface reference](https://docs.godotengine.org/en/stable/classes/class_webxrinterface.html) — the canonical init walkthrough, signals, gesture requirement
- [Exporting for the Web](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) — renderer constraint, threads, the exact COOP/COEP headers
- [Web export in 4.3](https://godotengine.org/article/progress-report-web-export-in-4-3/) — single-thread mode and the headers trade-off
- [godot-coi-serviceworker](https://github.com/nisovin/godot-coi-serviceworker) — inject the isolation headers on static hosts
- Related: [Godot OpenXR for Quest 3](/news/godot-xr-quest-3/) · [Godot XR Tools interactions](/news/godot-xr-tools-interaction/) · [A-Frame WebXR](/news/aframe-webxr-starter/) · [Babylon.js WebXR](/news/babylonjs-webxr-starter/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
