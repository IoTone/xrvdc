---
title: "Camera to YouTube VR — the No-Code Spatial Video Path"
date: 2026-06-21T10:00:00+09:00
slug: "spatial-video-youtube-vr"
tag: "STARTER"
summary: "Not every XR project needs a build step. Shoot 180° or 360° video, inject the right metadata, and YouTube plays it stereoscopically in the headset — no app, no engine. Here is the zero-code path from a camera to a Quest, PICO, or Vision Pro, and where it hands off to a custom WebXR viewer."
---

For a videographer who wants their footage *in a headset* without writing a line of code, the shortest path is **YouTube VR**. Upload a correctly tagged 180°/360° clip and the YouTube app on a Quest, PICO, or Vision Pro plays it back immersively — stereoscopic, head-tracked, and streamed adaptively. The [end-to-end spatial-video pipeline](/news/spatial-video-capture-to-headset/) covers the build-it-yourself viewers; this is the no-code counterpart, and the fastest way to get a creative's work onto a device on day one.

▸ [YouTube VR (Quest)](https://www.meta.com/experiences/youtube-vr/2002317119880945/) · [Google `spatialmedia` injector](https://github.com/google/spatial-media) · [Upload VR180/360 to YouTube](https://support.google.com/youtube/answer/6178631)

## Pick a capture format

YouTube understands two immersive shapes. **180° (VR180)** is the better choice for most subjects — stereoscopic depth, a forward field of view, half the pixels of 360, and no one standing behind the camera:

- **VR180 cameras** — Canon's EOS VR System (R5 C / R7 + dual-fisheye lens), the QooCam EGO, or older Lenovo Mirage. Native stereoscopic 180.
- **360° cameras** — Insta360 X4/X5, GoPro Max. Monoscopic by default; some shoot stereoscopic 360.
- **iPhone spatial video** — convert the MV-HEVC to an over-under 180 with the tools in the [spatial-video article](/news/spatial-video-capture-to-headset/), then treat it as VR180 here.

## Inject the metadata

This is the one step that trips people up: **YouTube decides a video is immersive from a metadata tag, not the pixels.** A flat-looking equirectangular file with no tag plays as a warped rectangle. Add the spherical/stereo metadata before upload:

- **Camera software does it for you** — Insta360 Studio, GoPro Player, and Canon's EOS VR Utility export with the projection and stereo layout already written.
- **Manual injection** — Google's open-source [`spatialmedia`](https://github.com/google/spatial-media) tool tags a file from the command line or a small GUI:

```bash
python spatialmedia -i --stereo=top-bottom --projection=mesh in.mp4 out.mp4
```

Use `--stereo=top-bottom` (or `left-right`) to match the export; drop `--stereo` for monoscopic 360. `exiftool` can stamp the same `Spherical`/`StereoMode` fields for quick fixes.

## Upload and watch

Upload the tagged file as an unlisted video; YouTube processes the VR versions within a few minutes. Then:

- **Meta Quest 3 / PICO 4 Ultra Enterprise** — the YouTube VR app (or the browser) detects the format and offers the immersive view. Several PICO units are on hand at the event.
- **Apple Vision Pro** — YouTube in Safari, or a third-party client; Apple's own immersive path is covered in the [spatial-video article](/news/spatial-video-capture-to-headset/).
- **Local, no upload** — DeoVR or Pigasus play the same tagged file straight off the headset's storage, which is handy when the venue Wi-Fi is busy.

## Make it a project, not just a clip

A single video is a demo; a little framing turns it into a hackathon submission:

- **Curate** — a themed VR180 playlist of Fukuoka locations, shot and tagged during the event.
- **Wrap it in WebXR** — drop the same file into the [A-Frame](/news/aframe-webxr-starter/) or [three.js](/news/threejs-webxr-starter/) viewer for a branded player with custom hotspots, instead of the stock YouTube chrome.
- **Mix formats** — pair the video with a [Gaussian splat](/news/video-to-gaussian-splats/) of the same place so viewers step from a flat-immersive clip into a walkable capture.

## Caveats

- **No tag, no immersion** — always verify the metadata survived the export; re-inject if YouTube shows it flat.
- **180 over 360 for stereo** — 360 doubles the pixel budget and adds seam and pole artifacts; you face forward anyway.
- **YouTube re-encodes** — expect some quality loss and a few minutes' processing before the VR option appears.
- **It is a viewer, not interaction** — for grabbing, moving, or responding to input, hand off to a [WebXR](/news/threejs-webxr-starter/) build.

## Useful links

- [Upload VR180/360 video to YouTube](https://support.google.com/youtube/answer/6178631) · [YouTube VR app](https://www.meta.com/experiences/youtube-vr/2002317119880945/)
- [Google `spatialmedia` metadata injector](https://github.com/google/spatial-media) · [Canon EOS VR System](https://www.canon.co.jp/eos-vr) · [Insta360](https://www.insta360.com/)
- Related: [Spatial video, end to end](/news/spatial-video-capture-to-headset/) · [Video to Gaussian splats](/news/video-to-gaussian-splats/) · [A-Frame WebXR starter](/news/aframe-webxr-starter/) · [Three.js WebXR starter](/news/threejs-webxr-starter/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
