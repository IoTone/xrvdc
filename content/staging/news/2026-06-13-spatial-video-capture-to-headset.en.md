---
title: "Spatial Video, End to End — Shoot on an iPhone, Play in Every Headset"
date: 2026-06-13T10:00:00+09:00
slug: "spatial-video-capture-to-headset"
tag: "WORKFLOW"
summary: "Spatial video is the most accessible XR format there is — an iPhone in a pocket is a stereoscopic camera. The catch is the format fork: Apple's MV-HEVC plays natively only on Vision Pro, while Quest 3, Spectacles, and WebXR need frame-packed stereo. Here is the full path — capture on iPhone or Vision Pro, convert with one free tool, and play it back on each headset, with WebXR as the one portable viewer that spans them all."
---

Most of the capture pipelines covered here — [photogrammetry splats](/news/scaniverse-3dgs-webxr-godot/), [360° rigs](/news/3dgs-360-camera-workflow/), [AI photo-to-splat](/news/sharp-photo-to-splat-webxr/) — take real effort to produce. **Spatial video** is the exception: if someone on the team owns a recent iPhone, they already carry a stereoscopic 3D camera, and the file it produces plays on Apple Vision Pro with zero processing. The work is not in the capture — it is in getting that one clip to also play on a Quest 3, on Spectacles, or in a browser, because the spatial-video world has a **format fork** that catches everyone the first time. This walks the whole path: capture, convert, and play back per device.

▸ [Apple — record spatial video](https://support.apple.com/guide/iphone/record-spatial-videos-iph2ec40c4d1/ios) · [Mike Swanson's `spatial` tool](https://blog.mikeswanson.com/spatial/) · [WebXR Layers](https://developers.meta.com/horizon/documentation/web/webxr-layers/)

## What "spatial video" actually is

Three terms get used interchangeably and should not be. Getting them straight saves a wasted afternoon:

- **Spatial video** — Apple's consumer stereoscopic format: two eye-views packed into one **MV-HEVC** (multiview HEVC) stream inside a QuickTime `.mov`, shown in a floating window with feathered edges. Not wraparound. This is the easy, accessible one.
- **Apple Immersive Video (AIV)** — the pro format: ~180° wraparound, up to 8K per eye, Spatial Audio, a custom projection and an `.aivu` wrapper. It needs a Blackmagic URSA Cine Immersive or a Canon dual-lens rig and an HLS pipeline. Out of scope for a weekend build.
- **Generic 180°/360°** — VR180 / VR360 video in plain H.264/H.265, stereo packed **side-by-side** or **over-under**, with spherical-projection metadata. This is what Quest, DeoVR, and WebXR natively understand.

The distinction that bites: **"spatial" is a metadata label, not just a codec.** An MV-HEVC file is shown as *Spatial* on Vision Pro only when it carries the right stereo metadata — a horizontal field of view plus a camera baseline or disparity adjustment. Strip that, and it is just a stereo clip.

## Capture

**The default, near-zero-cost path is an iPhone.** Spatial capture is supported on **iPhone 15 Pro / 15 Pro Max, the entire iPhone 16 and 17 lines** — using the main and ultrawide rear cameras (a 19.2 mm baseline). Turn it on at **Settings → Camera → Formats → "Spatial Video for Apple Vision Pro"** (added in iOS 17.2), then record in the Camera app's Video mode **held in landscape**. The format is **1080p at 30 fps** — still true on the iPhone 17 Pro — at roughly 130 MB/min. AirDrop the `.mov` and it plays on Vision Pro as-is.

Other capture options, in rough order of accessibility:

- **Apple Vision Pro** records its own spatial video on-device at 2200×2200 per eye, 30 fps.
- **A cheap stereo camera** like the QooCam EGO (~65 mm lens spacing, 3840×1080 SBS) gives a wider, more dramatic 3D baseline than an iPhone — but outputs side-by-side, so it needs the conversion step below.
- **Two-camera rigs** (a pair of action cams on a bar) work but make you solve baseline alignment *and* frame-accurate temporal sync in post — the sync is the real pain.
- **2D→3D conversion apps** (Spatial Media Toolkit, Depthify.ai) synthesize a stereo pair from ordinary footage using depth estimation — a fallback when there is no stereo source, with quality that varies by shot.

One thing the Quest 3 does **not** do is capture Apple-style spatial video — its passthrough recording is flat. It is a playback target, not a capture device, for this format.

## The format fork — and the one tool that bridges it

Here is the catch in one sentence: **Apple MV-HEVC plays only on Apple platforms, and nothing Apple captures plays directly on a Quest or Spectacles.** The rest of the XR world speaks frame-packed stereo — side-by-side or over-under H.264/H.265 — with VR180/360 projection metadata. So there is no single master file that plays everywhere; there is an Apple original and a portable derivative.

The free, reliable bridge on macOS (Apple Silicon) is **[Mike Swanson's `spatial` tool](https://blog.mikeswanson.com/spatial/)**. It has five subcommands (`info`, `export`, `make`, `combine`, `metadata`); two matter here. **Export** an Apple MV-HEVC clip down to an over-under file the rest of the world can read:

```bash
./spatial export -i spatial_test.mov -f ou -o over_under.mov
```

And **make** goes the other way — wrap stereo footage (from that QooCam, a rig, or an over-under export) back into a proper Apple *spatial* MV-HEVC, metadata and all:

```bash
./spatial make -i over_under.mov -f ou -o new_spatial.mov \
  --cdist 19.24 --hfov 63.4 --hadjust 0.02 \
  --primary right --projection rect
```

`--cdist` is the camera baseline in millimetres, `--hfov` the horizontal field of view, `--hadjust` the disparity (convergence) adjustment, `--projection rect` rectilinear, and `--primary` the hero eye. The rule that earns the "spatial" label: set `--hfov` **plus** `--cdist` **or** `--hadjust`. ([SpatialMediaKit](https://github.com/sturmen/SpatialMediaKit) and Apple's built-in `avconvert` cover the same ground; Compressor and DaVinci Resolve Studio do it in a GUI.)

**On FFmpeg — a caveat worth stating plainly.** FFmpeg *decodes* MV-HEVC fine (7.1+ can even select a single view), and x265 4.0 added experimental MV-HEVC *encoding*. But FFmpeg-encoded output **does not carry Apple's `vexu` spatial metadata**, so Vision Pro will not recognise it as spatial. For headset-ready Apple output, stay on the AVFoundation-based tools above.

## Playing it back, per device

### Apple Vision Pro — free, or one component

The no-code path is **Quick Look**: hand the file to `QLPreviewController` / `PreviewApplication` and visionOS handles spatial styling and immersive presentation automatically. For an app with its own UI, **RealityKit's `VideoPlayerComponent`** (backed by an `AVPlayer`) gives full control:

```swift
var component = VideoPlayerComponent(avPlayer: player)
component.desiredImmersiveViewingMode = .portal   // windowed stereo in shared space
component.desiredSpatialVideoMode     = .spatial  // feathered spatial edges
entity.components.set(component)
```

`.portal` shows the clip as a stereo window; for 180°/360° material in visionOS 26+, switch to `.progressive` (Digital-Crown-controlled immersion) inside an `ImmersiveSpace`. The older `VideoMaterial` still works too, for mapping stereo video onto custom curved geometry — see the [RealityKit + ARKit starter](/news/vision-pro-mixed-reality-realitykit-arkit/) for the scene-setup basics.

### Meta Quest 3 — convert, then native or web

The Quest will not read the Apple MV-HEVC directly. Run the `spatial export` step above to get an **over-under MP4**, tag it with VR180/spherical metadata, and it plays in **Meta Quest TV, DeoVR, or Skybox**. Encode at ≥3840×3840 per eye for 360 stereo, H.265 or AV1 to keep the bitrate sane (50–80 Mbps for 3D). For a custom app, map the over-under texture onto an inverted sphere (360) or hemisphere (180) in Unity or Unreal, splitting the UVs per eye onto stereo layers — or, more portably, use WebXR.

### WebXR — the one viewer that spans headsets

For a team that wants a single viewer reachable from a URL, **WebXR is the portable path**, and it is where the cross-headset audience here ([A-Frame](/news/aframe-webxr-starter/), [Babylon.js](/news/babylonjs-webxr-starter/)) already lives. The most efficient route on Quest is the **WebXR Layers API** — the browser composites the video directly, no per-frame WebGL work:

```js
const binding = new XRMediaBinding(xrSession);
const video = document.createElement("video");
video.src = "over_under_180.mp4";
const layer = binding.createEquirectLayer(video, {
  space: xrReferenceSpace,
  layout: "stereo-top-bottom",   // matches the over-under export
});
xrSession.updateRenderState({ layers: [layer] });
```

Use `createQuadLayer` instead for a flat 3D "movie screen," and `layout: "stereo-left-right"` for side-by-side sources. **One important constraint:** Vision Pro Safari runs WebXR in `immersive-vr` only — its AR module is non-functional, and it has **no media-layer binding**. So on Vision Pro you render the video yourself into the WebGL layer: the [three.js `webxr_vr_video` pattern](https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_video.html) (inverted sphere, left eye on `layers.set(1)`, right on `layers.set(2)`, UVs halved for the split) works there, as does A-Frame's `aframe-stereo-component`. Babylon's `VideoDome` (`videoMode: MODE_TOPBOTTOM`, `halfDomeMode: true`) is the one-liner — but test it inside an active session, as there are open reports of it rendering black.

**Codec landmine:** HEVC support in browsers is inconsistent, and MV-HEVC will not decode as stereo in any browser. Encode the portable file as **H.264 (or AV1) over-under MP4** and it plays on the Quest browser and on Vision Pro Safari VR alike.

### Snap Spectacles — not this lane

Spectacles are lightweight AR glasses (a ~46° waveguide), built around Lens Studio AR Lenses, not video viewing. Snap OS 2.0 added a WebXR browser, but it is `immersive-ar`-oriented and explicitly compute-limited, with no documented stereo-video-layer support. Treat Spectacles as an [AR-Lens target](/news/vibe-coding-spectacles/), not a spatial-video player; a plain `<video>` quad in a WebXR-AR scene is the most that is realistic.

## The spatial web, briefly

Apple's [WWDC 2026](/news/wwdc-2026-xr-visionos-27/) work added a declarative, non-WebXR path on Apple devices: a standard `<img src="spatial.heic" controls>` presents a spatial photo (and, in Safari 27, panoramas), and a plain `<video>` pointed at an APMP-conformant 180/360 file goes immersive on `requestFullscreen()`. It is clean and code-free — but it is Apple-only, and does not carry to Quest or Snap. For cross-headset reach, WebXR remains the answer.

## Caveats

- **No universal master file.** Keep the MV-HEVC original for native Vision Pro; ship an H.264/AV1 over-under MP4 for everything else. One does not substitute for the other.
- **Serve over HTTPS with CORS.** WebXR requires a secure context, and a cross-origin `VideoTexture` fails silently without `Access-Control-Allow-Origin`.
- **Budget the bitrate.** Stereo 360 is heavy (≥3840²/eye, 50–80 Mbps) — prefer HLS/adaptive for anything streamed, and AV1/H.265 to cut size on Quest.
- **180 beats 360 for stereo.** Half-dome 180 is the comfort-and-quality sweet spot; 360 stereo doubles the pixel budget and adds pole/seam artifacts. You face forward anyway.
- **FFmpeg won't make Apple-spatial files.** Decode yes; encode strips the metadata Vision Pro needs. Use the AVFoundation tools for Apple output.

## Useful links

- [Record spatial video on iPhone](https://support.apple.com/guide/iphone/record-spatial-videos-iph2ec40c4d1/ios) · [Apple: 180°/360°/wide-FOV on Vision Pro](https://support.apple.com/en-us/125014)
- [`spatial` tool (MV-HEVC ↔ SBS/over-under)](https://blog.mikeswanson.com/spatial/) · [SpatialMediaKit](https://github.com/sturmen/SpatialMediaKit)
- [WebXR Layers (Meta)](https://developers.meta.com/horizon/documentation/web/webxr-layers/) · [`XRMediaBinding.createEquirectLayer` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/XRMediaBinding/createEquirectLayer)
- [three.js `webxr_vr_video`](https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_video.html) · [Babylon VideoDome](https://doc.babylonjs.com/features/featuresDeepDive/environment/360VideoDome) · [A-Frame stereo component](https://github.com/c-frame/aframe-stereo-component)
- Apple WWDC25 sessions: [Immersive video playback (#296)](https://developer.apple.com/videos/play/wwdc2025/296/) · [Apple Projected Media Profile (#297)](https://developer.apple.com/videos/play/wwdc2025/297/)
- Related: [WWDC 2026 for XR builders](/news/wwdc-2026-xr-visionos-27/) · [3DGS from a 360° camera](/news/3dgs-360-camera-workflow/) · [Your first Vision Pro scene (RealityKit + ARKit)](/news/vision-pro-mixed-reality-realitykit-arkit/) · [A-Frame WebXR starter](/news/aframe-webxr-starter/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
