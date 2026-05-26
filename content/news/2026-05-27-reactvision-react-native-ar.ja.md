---
title: "ViroReact — React Native による iOS・Android・Meta Quest 3 向け AR"
date: 2026-05-27T10:00:00+09:00
slug: "reactvision-react-native-ar-入門"
tag: "スターター"
summary: "1 つの TypeScript コードベースで 3 つのネイティブターゲット。ViroReact は React Native チームが iOS（ARKit）、Android（ARCore）、Meta Horizon OS（Quest 3/3S）向けに、エンジンのオンボーディングなしで AR を提供できます。"
---

シリーズの方向転換。これまでブラウザ WebXR（[A-Frame](/ja/news/aframe-webxr-入門/)、[Babylon.js](/ja/news/babylonjs-webxr-入門/)、[Immersive Web SDK](/ja/news/immersive-web-sdk-入門/)）と Web-as-Native（[WebSpatial](/ja/news/webspatial-sdk-visionos-入門/)）を取り上げました。**ViroReact** はまったく別の読者層、**React Native** チーム向けです — 全員のポケットにあるモバイルデバイスで AR を動かし、同じコードベースで Meta Quest 3 ヘッドセットも狙う。

▸ [github.com/ReactVision/viro](https://github.com/ReactVision/viro) ・ [npm `@reactvision/react-viro`](https://www.npmjs.com/package/@reactvision/react-viro) ・ MIT ・ 1.8k★ ・ メンテナ：[ReactVision](https://www.reactvision.xyz/)

## 対応プラットフォーム

README に記載の現在の対応一覧：

| プラットフォーム | バックエンド |
|---|---|
| iOS | ARKit |
| Android | ARCore |
| Meta Horizon OS（Quest 3 / 3S） | ネイティブ |

Apple Vision Pro と Android XR は **未対応**（公開済みリスト上）。それらのターゲットには、[WebSpatial の記事](/ja/news/webspatial-sdk-visionos-入門/) が AVP を、[Android XR 入門](/ja/news/androidxr-入門/) が AXR を扱います。

ViroReact は **React Native CLI** プロジェクトと **Expo** の両方で動作します。注意点が 1 つ：ネイティブコードを必要とするため Expo Go では動きません。Expo の development build もしくは prebuild を使用してください。

## クイックスタート — Expo + TypeScript

公式 Expo スターターキットが最短経路：

```bash
git clone https://github.com/ReactVision/expo-starter-kit-typescript.git
cd expo-starter-kit-typescript
npm install
npx expo prebuild
npx expo run:ios       # または run:android
```

新規プロジェクトへ直接導入する場合：

```bash
npm install @reactvision/react-viro
```

iOS の権限、Android の Gradle、dev build セットアップなどの完全なインストールガイドは [コミュニティドキュメント](https://viro-community.readme.io/docs/installation-instructions) を参照。

## コンポーネント面

平面検出と 3D モデルのドラッグを含む最小限の AR シーン：

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

`ViroARSceneNavigator` は `push`／`pop` でシーン遷移を管理。`ViroARPlane` は検出された水平面に自動アンカリング。`Viro3DObject` は GLB／GLTF／OBJ／FBX モデルを読み込み、`dragType="FixedToPlane"` 制約により自然なインタラクションが得られます。

## 主要機能

すべてオープンソースパッケージに一次対応（追加プラグイン不要）：

- **トラッキング & アンカリング** — 水平・垂直平面検出、画像・オブジェクト認識トリガー
- **レンダリング** — PBR ライティング、HDR 環境マップ、リアルタイム影、360° 写真／動画環境、ポータル
- **モデル** — OBJ、FBX、GLTF／GLB（埋め込みアニメーション対応）、プロシージャルジオメトリ、カスタム GPU シェーダ
- **インタラクション & モーション** — 内蔵物理、パーティクル、宣言的アニメーション、完全イベント（`onClick`、`onDrag`、`onPinch`、`onRotate`、`onFuse`、`onHover`）
- **オーディオ** — 空間音声、360° 音場、定位 3D オーディオ

## クラウド機能 — ReactVision Platform

Cloud Anchors（永続化／共有 AR コンテンツ）、Geospatial Anchors（緯度／経度／標高でのピン留め）、AI による 3D アセット生成は **ReactVision Platform** 経由です。アプリ設定に `rvApiKey` と `rvProjectId` を追加すれば、マネージドサービスがホスティング・解決・地理空間インフラを処理します。[studio.reactvision.xyz](https://studio.reactvision.xyz) の無料 Studio アカウントに Platform アクセスが含まれます。

## シリーズ内での位置付け

| ルート | スタック | ターゲット |
|---|---|---|
| A-Frame ／ Babylon ／ IWSDK | ブラウザ ＋ WebXR | Quest 3（ブラウザ）、Vision Pro（Safari）、Spectacles（Browser Lens） |
| [Android XR](/ja/news/androidxr-入門/) | Jetpack XR ／ Compose XR | Android XR ヘッドセット ＆ グラス |
| [WebSpatial](/ja/news/webspatial-sdk-visionos-入門/) | React ＋ Web 標準 → ネイティブ | visionOS |
| [Meta Wearables Web App](/ja/news/meta-wearables-webapp-sdk-入門/) | 素の HTML/CSS/JS | Meta Ray-Ban Display グラス |
| **ViroReact** | **React Native ＋ TypeScript** | **iOS（ARKit）、Android（ARCore）、Quest 3（Horizon OS）** |

ViroReact は、チームに React Native スキルが既にあり、参加者全員のスマートフォン上で動作するデモが必要で、加えて任意で Quest 3 も狙いたい場合のルートです。新しいエンジン層を学ぶ必要がありません。

## 注意点

- **Expo Go では不可。** Expo dev build か React Native CLI を使用。
- **Vision Pro ／ Android XR は対応プラットフォーム外**（公開リスト上）。
- **Platform 認証情報** が Cloud／Geospatial Anchors に必要（無料 Studio で取得可）。
- **権限** — iOS は `NSCameraUsageDescription`、Android は `CAMERA`（Cloud／Geospatial Anchors なら位置情報も）。最初のビルド前に設定。

## 関連リンク

- [ViroReact ドキュメント](https://viro-community.readme.io/docs/overview) ・ [入門チュートリアル](https://updates.reactvision.xyz/get-started-with-the-viroreact-and-expo-starter-kit-a9ca88803e5a)
- [Expo + TS スターターキット](https://github.com/ReactVision/expo-starter-kit-typescript) ・ [React Native CLI スターターキット](https://github.com/ReactVision/starter-kit)
- [ReactVision Studio](https://studio.reactvision.xyz) ・ [Discord](https://discord.gg/A6TaFNqwVc)
- 関連：[WebSpatial（visionOS）](/ja/news/webspatial-sdk-visionos-入門/) ・ [Android XR](/ja/news/androidxr-入門/) ・ [A-Frame WebXR](/ja/news/aframe-webxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
