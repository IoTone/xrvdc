---
title: "Immersive Web SDK — Meta の AI ネイティブ WebXR ツールキット"
date: 2026-05-25T10:00:00+09:00
slug: "immersive-web-sdk-入門"
tag: "スターター"
summary: "Meta のオープンソース Immersive Web SDK は WebXR にエージェント向けインターフェイスを内蔵 — スクリーンショット、シーン検査、入力シミュレーション、ステートスナップショット。Claude Code や Codex などの AI コーディングツールが実行中シーンを読み取り反復するための設計。"
---

WebXR シリーズではこれまで軽量な [A-Frame](/staging/news/aframe-webxr-入門/) とエンジン級の [Babylon.js](/staging/news/babylonjs-webxr-入門/) を取り上げました。**Immersive Web SDK（IWSDK）** は第三の方向性、**AI ネイティブ** を加えます。WebXR を狙うコードを書かせるだけでなく、AI コーディングエージェントが実行中シーンを「見て」「動かして」「デバッグできる」ように設計された SDK です。

▸ [iwsdk.dev](https://iwsdk.dev/) ・ [github.com/facebook/immersive-web-sdk](https://github.com/facebook/immersive-web-sdk) ・ MIT ・ Meta Platforms ・ パッケージ `@iwsdk/core`

## 「AI ネイティブ」の意味

IWSDK は **32 個のツール** を AI エージェント向けに公開しています。スクリーンショット撮影、コントローラ入力シミュレーション、シーングラフ検査、エンジンレベルのデバッグ、ステートスナップショット。プロジェクト自身の表現：*"AI agents can see, interact with, and debug your 3D scenes."*

開発上の実効：WebXR シーンを扱う Claude Code・Codex・Cursor のセッションが、現在のカメラ視点のスクリーンショットを取得し、シーングラフのノードを列挙し、合成コントローラクリックを発火し、マテリアル／トランスフォームを読み取れる — そして、ソースの推測ではなく実際のレンダリング状態に基づいて反復します。これは [Meta Wearables Web App AI ツールキット](/staging/news/meta-wearables-webapp-sdk-入門/) と同じ方向性を、Ray-Ban Display グラスではなく汎用 WebXR に適用したものです。

## クイックスタート

新規プロジェクトのブートストラップはコマンド 1 行：

```bash
npm create @iwsdk@latest
```

スキャフォールドは `@iwsdk/core` を導入し、WebXR シーンのセットアップと並んでエージェントツールインターフェイスを配線します。反復ループ：

1. プロジェクトをローカルで起動し、トンネル化します（[A-Frame の記事](/staging/news/aframe-webxr-入門/) と同じ Cloudflare クイックトンネル）：

   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```

2. 出力された HTTPS URL を Quest 3（Meta Quest Browser）または Vision Pro の Safari で開きます。
3. AI エージェントに実行中シーンの検査・スクリーンショット・入力シミュレーションを依頼し、ソースを反復させます。

## シリーズ内での位置付け

| ルート | 記述スタイル | 得意領域 |
|---|---|---|
| A-Frame | 宣言的な `<a-scene>` | 簡潔な宣言的 WebXR、ビルド不要 |
| Babylon.js | 命令的 TS エンジン | PBR・物理・AR フィーチャーマネージャ |
| **IWSDK** | 命令的＋エージェント内省 | AI 駆動の WebXR シーン反復 |

すでに AI アシスタントを使ってプロトタイピングしているチームに最も効きます。アシスタントが自分の出力を実シーンで検証できるため、状況説明をチームに頼らずに済みます。

## ハッカソンでの確認事項

プロジェクトのホームページはエージェント面と導入手順を強調しており、ヘッドセット対応（`immersive-vr` か `immersive-ar` か、ハンド入力対応）は明示されていません。最初に確認すべき項目として扱ってください：

- 対象ブラウザ（Meta Quest Browser、Safari/visionOS、Snap Spectacles Browser Lens）での `immersive-vr` ／ `immersive-ar` セッションの動作。
- ハンドトラッキングおよびコントローラ入力の期待動作。
- SDK のバージョン固定（`@iwsdk/core@0.4.x`）— アルファ的なバージョニングが想定されます。

## 関連リンク

- [Immersive Web SDK ホームページ](https://iwsdk.dev/) ・ [GitHub リポジトリ](https://github.com/facebook/immersive-web-sdk)
- 関連（同シリーズ）：[A-Frame WebXR スターター](/staging/news/aframe-webxr-入門/) ・ [Babylon.js WebXR](/staging/news/babylonjs-webxr-入門/) ・ [Meta Wearables Web App AI ツールキット](/staging/news/meta-wearables-webapp-sdk-入門/)
- [ハッカソン詳細](/staging/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/staging/contact/) ページからどうぞ。
