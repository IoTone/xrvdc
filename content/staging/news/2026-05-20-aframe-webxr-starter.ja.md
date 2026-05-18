---
title: "A-Frame：WebXR への最短ルート（Quest 3・Vision Pro・Spectacles）"
date: 2026-05-20T10:00:00+09:00
slug: "aframe-webxr-入門"
tag: "スターター"
summary: "HTML 1 ファイル、ビルド不要、ヘッドセット横断で動作。A-Frame の WebXR スターターと、Meta Quest 3・Apple Vision Pro・Snap Spectacles をターゲットにする実践ガイド。"
---

**ツールチェーン不要** で動くヘッドセットデモが欲しいなら、**A-Frame** による WebXR が最短ルートです。three.js + WebXR の上に乗った宣言的な Web フレームワークで、HTML ライクなタグでシーンを記述すれば、あとはブラウザがヘッドセットを処理します。

▸ [aframe.io](https://aframe.io/) ・ [github.com/aframevr/aframe](https://github.com/aframevr/aframe)（MIT、v1.7.1）

## スターターのすべて

完全な WebXR シーンは HTML 1 ファイル — npm もバンドラも不要：

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://aframe.io/releases/1.7.1/aframe.min.js"></script>
  </head>
  <body>
    <a-scene>
      <a-box position="0 1.5 -3" color="#ff006e"></a-box>
      <a-sphere position="1 1.5 -4" color="#00d4ff"></a-sphere>
      <a-sky color="#1a0f08"></a-sky>
    </a-scene>
  </body>
</html>
```

A-Frame は **Enter VR / Enter AR** ボタンを自動的に挿入します。整理された出発点としては、公式 [aframe-boilerplate](https://github.com/aframevr/aframe-boilerplate) をフォークするか、ドキュメントの [Building a Basic Scene](https://aframe.io/docs/1.7.0/guides/building-a-basic-scene.html) を進めてください。コンポーネントのエコシステム（物理、ハンドコントロール、environment、マルチプレイヤー向け networked-aframe）でハッカソンの大半のニーズをカバーできます。

## デプロイとデバイス対応

WebXR には **HTTPS** が必須です。静的ホスティング（GitHub Pages、Vercel、Cloudflare Pages）にデプロイするか、より素早い反復にはローカルで編集を続けつつ、トンネルで開発サーバーを公開 HTTPS URL として公開します — [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)、[ngrok](https://ngrok.com/)、または [Tailscale Funnel](https://tailscale.com/kb/1223/funnel)。その URL をヘッドセットのブラウザで開きます：

- **Meta Quest 3** — Meta Quest Browser は WebXR をフルサポート：`immersive-vr`、`immersive-ar`（パススルー）、ハンドトラッキング。URL を開いて **Enter VR/AR** をタップ。最もスムーズなターゲット。
- **Apple Vision Pro** — visionOS の Safari が WebXR（`immersive-vr`）をサポート、手／transient-pointer 入力に対応。Quest より新しい対応のため、**Enter VR** の動作を早めに確認し、インタラクションはシンプルに。
- **Snap Spectacles** — **[Spectacles Browser Lens](https://developers.snap.com/spectacles/about-spectacles-features/webxr)** 経由でサポートされます。WebXR アプリは Lens Studio 不要でそのブラウザ上で直接、`immersive-ar` モード・**ハンドトラッキング** を主入力として動作します。Snap のドキュメント上の注意点：ヒットテストは現在エミュレーション（ネイティブ対応は将来予定）、WebXR ゲームパッドは実用的でないため、手の入力前提で設計してください。より深い *ネイティブ* 連携には Lens Studio ルートも選べます — [Spectacles & Lens Studio スターター](/ja/news/snap-spectacles-lens-studio-入門/) を参照。

## なぜ 2.5 日間のハッカソンに向くのか

- **ビルド不要** — HTML を編集してヘッドセットのブラウザを更新、数秒で反復。
- **1 コードベースで 3 ターゲット** — 同じ URL が Quest 3・Vision Pro・Spectacles で動作（上記の各プラットフォームの入力／モードに留意）。
- **巨大なコンポーネント群** — エンジンコードを書かず、物理・ネットワーク・コントローラを追加。

## 関連リンク

- [A-Frame ドキュメント](https://aframe.io/docs/) ・ [aframe-boilerplate](https://github.com/aframevr/aframe-boilerplate)
- [WebXR Device API](https://immersiveweb.dev/)
- Spectacles：[WebXR / Browser Lens（Snap 公式）](https://developers.snap.com/spectacles/about-spectacles-features/webxr) ・ [Spectacles と Lens Studio（ネイティブ）](/ja/news/snap-spectacles-lens-studio-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
