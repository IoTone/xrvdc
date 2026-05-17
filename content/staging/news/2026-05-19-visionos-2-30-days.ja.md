---
title: "visionOS の入り口：服部智さんの 30 Days チャレンジ"
date: 2026-05-19T10:00:00+09:00
slug: "visionos-2-30日チャレンジ"
tag: "スターター"
summary: "コミュニティ紹介と Apple Vision Pro スターター。VisionDevCamp Tokyo 2024 登壇者・服部智さん（@satoshi0212）による 30 個の小さな visionOS 2 サンプル。多くは Simulator で動作し、実機不要。"
---

ネイティブプラットフォームの流れ（[Spectacles](/staging/news/snap-spectacles-lens-studio-入門/)、[Meta Ray-Ban Display](/staging/news/meta-wearables-webapp-sdk-入門/) に続く）の今回は **Apple Vision Pro / visionOS**。そして、ぜひ紹介したいコミュニティのつながりがあります。

## コミュニティ紹介

**服部智** さん（[@satoshi0212](https://github.com/satoshi0212)、X は [@shmdevelop](https://x.com/shmdevelop)）は **VisionDevCamp Tokyo 2024** に登壇されました。氏のオープンソース学習プロジェクトは、visionOS を最短で習得する方法のひとつです。

▸ [github.com/satoshi0212/visionOS_2_30Days](https://github.com/satoshi0212/visionOS_2_30Days)

## スターターとして優れている理由

このリポジトリは **30 日間チャレンジ** です。各日が、ひとつの概念に絞った小さな自己完結型の visionOS 2 サンプルになっています。巨大なアプリを解析するのではなく、用途が明確でコピペしやすい例が手に入ります。例：

- **Hello visionOS 2** — 最小構成の RealityKit/SwiftUI シーン
- **Hand Tracking** — 手の関節を空間入力として読み取る
- **Dynamic Light**、**Video to ShaderGraphMaterial**、**Video with Shader** — マテリアルとレンダリング
- **Multiple Portals** — 別世界へのポータル
- **Shinjuku GeoJSON Map** — 実地理データの 3D 表示
- **Pitch Detection**、**Download HLS** — 音声・メディア処理
- **Hold your thumbs up** — ジェスチャー認識

多くは **Simulator 対応** と記されており、Apple Vision Pro 実機がなくても Xcode の **visionOS シミュレータ** で動かせます。ヘッドセットが不足しがちな 2.5 日間のハッカソンでは重要なポイントです。

## はじめかた

1. 最新の **Xcode** と **visionOS** プラットフォーム／シミュレータをインストール。
2. リポジトリをクローンし、見たい日のプロジェクトを開く（各日が独立プロジェクト）。
3. **visionOS シミュレータ**（Simulator 対応の日を選ぶ）で実行、または Apple Vision Pro 実機へデプロイ。
4. 各日は X の [#30_days_visionOS](https://x.com/hashtag/30_days_visionOS?f=live) の短いデモ投稿にリンクしています。

ハッカソンのアイデアに近い概念を選び、まずシミュレータで動かしてから発展させましょう。

## 関連リンク

- [visionOS_2_30Days リポジトリ](https://github.com/satoshi0212/visionOS_2_30Days) — 役立ったら[作者をスポンサー](https://github.com/sponsors/satoshi0212)するのもおすすめ
- [Apple visionOS 開発者ドキュメント](https://developer.apple.com/visionos/)
- 関連：[Snap Spectacles と Lens Studio](/staging/news/snap-spectacles-lens-studio-入門/) ・ [Meta Ray-Ban Display Web Apps](/staging/news/meta-wearables-webapp-sdk-入門/)
- [ハッカソン詳細](/staging/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/staging/contact/) ページからどうぞ。
