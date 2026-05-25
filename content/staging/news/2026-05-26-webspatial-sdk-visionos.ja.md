---
title: "WebSpatial SDK — Web アプリがネイティブの空間アプリになるとき"
date: 2026-05-26T10:00:00+09:00
slug: "webspatial-sdk-visionos-入門"
tag: "スターター"
summary: "WebSpatial は HTML/CSS/DOM に空間プリミティブを追加するポリフィル型 SDK。React アプリを visionOS のネイティブ空間アプリとしてビルド／配信できる。シリーズ前半の「ブラウザ内 WebXR」ルートとは別の形。"
---

このシリーズで取り上げた WebXR 記事 — [A-Frame](/ja/news/aframe-webxr-入門/)、[Babylon.js](/ja/news/babylonjs-webxr-入門/)、[Immersive Web SDK](/ja/news/immersive-web-sdk-入門/) — はいずれもブラウザの WebXR セッション内で動作します。**WebSpatial** は異なる形を取ります：HTML/CSS/DOM への小さな拡張群＋ポリフィル型 SDK によって、React アプリを **ネイティブ空間アプリ** としてビルド・配信できます。現状の対象は **Apple Vision Pro / visionOS**。慣れた Web フレームワークがヘッドセット上の一級ウィンドウマネージャになります。

▸ [webspatial.dev](https://webspatial.dev/) ・ [github.com/webspatial/webspatial-sdk](https://github.com/webspatial/webspatial-sdk) ・ MIT ・ TypeScript ・ W3C 連携（[TPAC 2025 プロトタイプ](https://tpac2025.webspatial.dev/)）

## 「2D の中に 3D を含む」モデル

ネイティブ空間アプリは通常 RealityKit または Unity PolySpatial でゼロから書きます。WebSpatial はそれを反転させ、Web の 2D レイアウトをホストとして保ちつつ、特定の要素だけが実空間のボリュームに飛び出せるようにします。Web の主流のメンタルモデルとツーリングはそのまま、空間プリミティブが置き換えではなく追加されます。プロジェクトの言葉：*"HTML content on spatial computing platforms can break free from the screen, enter real space, gain real volume, support natural spatial interactions and flexible 3D programming, while preserving the Web's original cross-platform nature, mental model, and development workflow."*

実用的な帰結：既存の React スキルセットがそのまま移行します。学ぶべき新しいエンジン層がありません。

## SDK の構成

WebSpatial は協調する 4 つのパッケージで提供されます：

| パッケージ | 役割 |
|---|---|
| `@webspatial/react-sdk` | React コンポーネント、CSS API、DOM API、イベント、シーンオプション |
| `@webspatial/core-sdk` | ランタイムに近い下位 SDK |
| `@webspatial/builder` | CLI：`run`／`build`／`publish` — Web アプリをバンドルし、対象プラットフォームのアプリシェルを生成 |
| `@webspatial/platform-visionos` | Builder が利用する visionOS ランタイムパッケージ |

アプリは実行時に `@webspatial/react-sdk` の `WebSpatialRuntime.supports(name, tokens?)` で現在のシェルを問い合わせ可能。同一コードベースから現在ホストの対応機能で分岐できます。

## セットアップ

**要件：** Node.js 22 以上、pnpm 9 以上。visionOS への publish には Xcode と Apple Developer アカウント（配信は App Store Connect）も必要です。

典型的なループ：

```bash
# インストール
pnpm add @webspatial/react-sdk @webspatial/core-sdk @webspatial/builder
pnpm add -D @webspatial/platform-visionos

# ブラウザポリフィルで開発
pnpm webspatial run

# visionOS 向けにビルド
pnpm webspatial build

# 配信（Xcode と App Store Connect が必要）
pnpm webspatial publish
```

`run` モードのポリフィルは通常ブラウザで空間シーンを 2D 近似でレンダリングするため、反復のほとんどはデスクトップで完結します。ヘッドセットは空間挙動の確認と仕上げに使います。

## シリーズ内での位置付け

| ルート | 実行場所 | 出力 | 適した用途 |
|---|---|---|---|
| A-Frame ／ Babylon.js ／ IWSDK | ブラウザの WebXR セッション | URL 上のページ | 任意の HTTPS ホストからヘッドセット横断 WebXR |
| [Android XR](/ja/news/androidxr-入門/) | Android XR ランタイム | APK | Jetpack XR ／ Compose XR で AndroidXR を狙うチーム |
| **WebSpatial** | visionOS ランタイム | ネイティブ visionOS の .app | Web 的なメンタルモデルで Apple Vision Pro を狙う React チーム |

## 計画上の注意点

- **現在のプラットフォームパッケージは visionOS。** 公開済みの `@webspatial/platform-*` は現状 visionOS のみ。Android XR・Pico・Quest 等の他ターゲットには別パッケージが必要で、本記事時点では出荷されていません — 多プラットフォーム計画の前にパッケージ一覧を確認してください。
- **ツールチェーンの要件。** Node 22+、pnpm 9+、および visionOS の Xcode 配信フロー。クローンしたチームメンバーが詰まらないよう README にロックしておきましょう。
- **仕様は動いている。** TPAC 2025 プロトタイプおよび W3C 連携は最近の動き。SDK バージョンを固定し、プロジェクトの changelog を追ってください。

## ハッカソンへのポイント

- **チームの既存 React スキルで完結** — エンジンのオンボーディング不要。
- **デスクトップポリフィルで反復** し、ヘッドセットで検証。変更ごとに Xcode をフルリビルドするより短いフィードバックループ。
- **WebXR 記事との併用** — Web 形の UI で Quest 3 をブラウザ経由でも狙う場合は、ブラウザ向けには WebXR ビルド、同じ React UI を WebSpatial Builder で visionOS ネイティブアプリとして配信、という二段構えが取れます。

## 関連リンク

- [webspatial.dev ドキュメント](https://webspatial.dev/docs/introduction/getting-started)
- [WebSpatial SDK の GitHub](https://github.com/webspatial/webspatial-sdk)
- [TPAC 2025 プロトタイプと仕様の方向性](https://tpac2025.webspatial.dev/)
- 関連：[A-Frame WebXR](/ja/news/aframe-webxr-入門/) ・ [Babylon.js WebXR](/ja/news/babylonjs-webxr-入門/) ・ [Immersive Web SDK](/ja/news/immersive-web-sdk-入門/) ・ [Android XR 入門](/ja/news/androidxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
