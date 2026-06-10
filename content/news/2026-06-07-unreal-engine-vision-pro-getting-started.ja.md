---
title: "Unreal Engine で Vision Pro — ネイティブ visionOS と Polyarc フォーク"
date: 2026-06-07T10:00:00+09:00
slug: "unreal-engine-vision-pro-入門"
tag: "スターター"
summary: "はい、Unreal Engine 5 で Apple Vision Pro アプリは今日つくれます——ネイティブに、ピクセルストリーミングなしで。Epic の対応は実験的（完全没入の VR は堅実、ミックスドリアリティのパススルーは新しく脆い）で、Polyarc の UE 5.6 visionOS フォークが性能差を埋めます。EULA ゲートのソースとカスタムエンジンのビルドは覚悟を。"
---

Unreal Engine は、VisionDevCamp における Vision Pro のエンジン像を、[Unity PolySpatial](/news/vision-pro-mixed-reality-unity-polyspatial-入門/) と[ネイティブ Swift](/news/vision-pro-mixed-reality-realitykit-arkit-入門/) のルートと並んで完成させます。「Unreal に Vision Pro 対応はなく、フォークだけ」という通説は 2026 年時点で**過去のもの**です。そして正確な像が重要なのは、ハッカソンチームが現実的に狙うべき的を変えるからです。

## 2026 年の現況

- **Epic はメインラインの UE に visionOS ネイティブ対応を出荷済み**——**UE 5.4** 以降で実験的（完全没入のみ）、**UE 5.5** で**ミックスイマージョン／パススルーが実験的に追加**（Metal レンダリング、visionOS 2.0 が道を開いた後）。本当に実験的で、バグ、性能の崖、破壊的変更を見込んでください。
- **目立つフォークは Polyarc の visionOS フォーク**（2026 年 2 月公開）、ベースは **UE 5.6**。レンダリングのバグを修正し、メインラインにない性能機能を加えます——固定フォービエイテッドレンダリング、モバイルマルチビュー、レイヤードレンダーターゲット、レンダーターゲットメモリの削減、Crown ボタンでのサスペンド／レジューム——Polyarc のテストで実効 GPU 出力が約 2 倍になりました。Polyarc は実際の商用 AVP タイトル（*Glassbreakers*）をこのフォークで出荷し、変更を Epic メインラインへ取り込む PR を提出しました（2026 年 4 月ごろ）。年内に差は縮まるかもしれません。

## 現実的なハッカソンの的

週末のプロジェクトなら、**完全没入の VR** を狙ってください。堅実でよく踏み固められた道です——UE5 のシーンをヘッドセットにパッケージし、Metal デスクトップレンダラーで描画します。**ミックスドリアリティのパススルー**は可能ですが新しく脆い——5.5/visionOS 2.0 でようやく登場し、土台の Metal-Compositor-Services のパススルーは一部の最近の visionOS ベータで壊れたと報告されています。パススルーはベースラインではなくストレッチ目標として扱ってください。

## ビルドの流れ（ネイティブ経路）

1. **ツールチェーン：** **Apple Silicon Mac**、**Xcode 15.3 以上**（Polyarc フォークは Xcode 26 まで対応）、Apple Developer アカウント、Mac とペアリングした Vision Pro。
2. **エンジン：** ネイティブ経路は素の UE 5.4/5.5 で動きます。フォークは**ソースからのカスタムエンジンのビルド**が必要——バイナリ導入ではなく、数時間のコンパイルです。
3. **レンダラー：** **Metal デスクトップレンダラー**を使い、iOS モバイルレンダリングは無効化。**TSR（テンポラルスーパーレゾリューション）のアンチエイリアスは Apple Silicon では重すぎる**——既知の性能の落とし穴です。
4. **デプロイ：** Package Project → Platforms → **Vision OS**、続いて Xcode の *Window → Devices and Simulators* で Apple Vision Pro を選んでデプロイ。

## 注意点

- **ネイティブ対応は実在するが実験的**——5.4 でも 5.5 でも。製品レベルの安定性は期待しないこと。
- **完全没入が堅実な的、MR パススルーは脆い。** パススルーは 5.5/visionOS 2.0 でようやく登場し、最近の OS ベータで壊れています。ハッカソンでは完全没入を勧め、パススルーは「壊れることがある」と明記を。
- **実際のビルドはつらい。** Apple Silicon Mac＋Xcode＋Apple Developer アカウント＋ペアリングした Vision Pro、しかもフォークはソースからのカスタムエンジンのコンパイルが要ります。
- **アクセスはゲートされています。** Unreal Engine のソース——そして任意の UE フォーク——は Epic のアクセス制御つき GitHub の背後にあります。参加者は Epic アカウントを連携し、UE EULA に同意し、**事前に**アクセス権を得る必要があります。フォークのリポジトリが公開ブラウズできないのはこのためです。
- **オープンソースではありません。** UE フォークは **Unreal Engine EULA**（Epic 独自ライセンス）を継承します——フォークを「オープンソース」と呼ばないこと。
- **ピクセルストリーミングは別の、代替経路。** UE コンテンツを WebXR で AVP にストリーミングするのはネイティブ描画ではなく、従来からステレオ収束や入力の固着の問題がありました——ネイティブビルドと混同しないでください。
- **動く標的。** Polyarc のメインライン PR が保留中のため、バージョンの細部は 2026 年を通じて変わります——イベント直前に現行の UE と visionOS のバージョンを確認してください。

## 関連リンク

- [Polyarc visionOS フォーク](https://polyarcgames.github.io/) — 機能一覧、イマージョンモード、Xcode 対応
- Epic フォーラム — [Polyarc visionOS Fork is Out](https://forums.unrealengine.com/t/polyarc-visionos-fork-is-out/2699827) — ブランチ `polyarc-visionos-5.6`、ビルドノート、メインライン PR
- Epic — [Unreal Engine Apple Vision Pro Quick Start Guide](https://dev.epicgames.com/community/learning/tutorials/1JWr/unreal-engine-apple-vision-pro-quick-start-guide) — ネイティブのパッケージ／デプロイ手順
- [UploadVR — Glassbreakers](https://www.uploadvr.com/glassbreakers-champions-of-moss-release-date/) — Vision Pro に出荷された初の UE 製 VR ゲーム
- [Unity で Vision Pro のミックスドリアリティ（PolySpatial）](/news/vision-pro-mixed-reality-unity-polyspatial-入門/) ・ [はじめての Vision Pro ミックスドリアリティ（Swift）](/news/vision-pro-mixed-reality-realitykit-arkit-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
