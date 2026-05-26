---
title: "ViroReact — React Native AR for iOS, Android, and Meta Quest 3"
date: 2026-05-27T10:00:00+09:00
slug: "reactvision-react-native-ar"
tag: "STARTER"
summary: "One TypeScript codebase, three native targets: ViroReact lets a React Native team ship AR to iOS (ARKit), Android (ARCore), and Meta Horizon OS (Quest 3/3S) without an engine onboarding step."
---

A pivot in the series. The earlier posts covered browser WebXR ([A-Frame](/news/aframe-webxr-starter/), [Babylon.js](/news/babylonjs-webxr-starter/), [Immersive Web SDK](/news/immersive-web-sdk-ai-native/)) and Web-as-native ([WebSpatial](/news/webspatial-sdk-visionos/)). **ViroReact** comes from a different audience entirely: a **React Native** team that wants AR on the mobile devices in everyone's pocket — plus, in the same codebase, the Meta Quest 3 headset.

▸ [github.com/ReactVision/viro](https://github.com/ReactVision/viro) · [npm `@reactvision/react-viro`](https://www.npmjs.com/package/@reactvision/react-viro) · MIT · 1.8k★ · maintained by [ReactVision](https://www.reactvision.xyz/)

## Platforms

The currently-shipping support matrix from the README:

| Platform | Backend |
|---|---|
| iOS | ARKit |
| Android | ARCore |
| Meta Horizon OS (Quest 3 / 3S) | Native |

Apple Vision Pro and Android XR are **not** in the supported list yet — for those targets, the [WebSpatial article](/news/webspatial-sdk-visionos/) covers AVP and the [Android XR getting-started](/news/androidxr-getting-started/) covers AXR.

ViroReact works with both **React Native CLI** projects and **Expo**, with one caveat: it requires native code, so Expo Go can't host it — use Expo development builds or prebuild.

## Quick start — Expo + TypeScript

The official Expo starter kit is the fastest path:

```bash
git clone https://github.com/ReactVision/expo-starter-kit-typescript.git
cd expo-starter-kit-typescript
npm install
npx expo prebuild
npx expo run:ios       # or run:android
```

For a fresh project, add the package directly:

```bash
npm install @reactvision/react-viro
```

The full installation guide (iOS permissions, Android Gradle, dev-build setup) lives in the [community docs](https://viro-community.readme.io/docs/installation-instructions).

## The component surface

A minimal AR scene with plane detection and a draggable 3D model:

```tsx
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroARPlane,
  Viro3DObject,
  ViroAmbientLight,
} from '@reactvision/react-viro';

function ARScene() {
  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={300} />
      <ViroARPlane minHeight={0.1} minWidth={0.1} alignment="Horizontal">
        <Viro3DObject
          source={require('./assets/robot.glb')}
          type="GLB"
          position={[0, 0, 0]}
          scale={[0.2, 0.2, 0.2]}
          dragType="FixedToPlane"
          dragPlane={{ planePoint: [0, 0, 0], planeNormal: [0, 1, 0], maxDistance: 5 }}
        />
      </ViroARPlane>
    </ViroARScene>
  );
}

export default function App() {
  return <ViroARSceneNavigator initialScene={{ scene: ARScene }} />;
}
```

`ViroARSceneNavigator` manages scene transitions with `push` / `pop`. `ViroARPlane` auto-anchors to detected horizontal planes. `Viro3DObject` loads GLB/GLTF/OBJ/FBX models, and the `dragType="FixedToPlane"` constraint keeps interaction natural.

## Feature highlights

All of the following are first-party in the OSS package (no extra plugins):

- **Tracking & anchoring** — horizontal + vertical plane detection, image and object recognition triggers
- **Rendering** — PBR lighting, HDR environment maps, real-time shadows, 360° photo/video environments, portals
- **Models** — OBJ, FBX, GLTF/GLB with embedded animations; custom procedural geometry; custom GPU shaders
- **Interaction & motion** — built-in physics, particle system, declarative animations, full event set (`onClick`, `onDrag`, `onPinch`, `onRotate`, `onFuse`, `onHover`)
- **Audio** — spatial audio, 360° sound fields, positioned 3D audio

## Cloud features — ReactVision Platform

Cloud Anchors (persistent / shared AR content), Geospatial Anchors (lat/lng/altitude pinning), and AI-powered 3D asset generation are gated behind **ReactVision Platform**. Add `rvApiKey` and `rvProjectId` to the app config and the managed service handles hosting, resolution, and geospatial infrastructure. A free Studio account at [studio.reactvision.xyz](https://studio.reactvision.xyz) includes Platform access.

## Where it fits in the series

| Path | Stack | Targets |
|---|---|---|
| A-Frame / Babylon / IWSDK | Browser + WebXR | Quest 3 (browser), Vision Pro (Safari), Spectacles (Browser Lens) |
| [Android XR](/news/androidxr-getting-started/) | Jetpack XR / Compose XR | Android XR headsets + glasses |
| [WebSpatial](/news/webspatial-sdk-visionos/) | React + Web standards → native | visionOS |
| [Meta Wearables Web App](/news/meta-wearables-webapp-sdk/) | Plain HTML/CSS/JS | Meta Ray-Ban Display glasses |
| **ViroReact** | **React Native + TypeScript** | **iOS (ARKit), Android (ARCore), Quest 3 (Horizon OS)** |

ViroReact is the path when the team already has React Native skills and the demo needs to run on the mobile phones every attendee has, plus optionally the Quest 3 — no new engine layer to learn.

## Caveats

- **Not Expo Go.** Use Expo dev builds or React Native CLI.
- **No Vision Pro / Android XR yet** in the supported-platform matrix.
- **Platform credentials** are required for Cloud / Geospatial Anchors (free Studio tier covers it).
- **Permissions** — iOS requires `NSCameraUsageDescription`; Android requires `CAMERA` and (for Cloud / Geospatial Anchors) location. Set these up before the first build.

## Useful links

- [ViroReact docs](https://viro-community.readme.io/docs/overview) · [Get-started tutorial](https://updates.reactvision.xyz/get-started-with-the-viroreact-and-expo-starter-kit-a9ca88803e5a)
- [Expo + TS starter kit](https://github.com/ReactVision/expo-starter-kit-typescript) · [React Native CLI starter kit](https://github.com/ReactVision/starter-kit)
- [ReactVision Studio](https://studio.reactvision.xyz) · [Discord](https://discord.gg/A6TaFNqwVc)
- Related: [WebSpatial (visionOS)](/news/webspatial-sdk-visionos/) · [Android XR](/news/androidxr-getting-started/) · [A-Frame WebXR](/news/aframe-webxr-starter/)
- [Hackathon details](/hackathon/) — eligibility, team formation, AI policy
- [Register on Luma](https://luma.com/i5gerreb)

Questions? Reach the team via the [Contact](/contact/) page.
