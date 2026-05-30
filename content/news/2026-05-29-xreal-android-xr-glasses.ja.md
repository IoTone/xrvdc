---
title: "XREAL グラス向け開発 — 今日は XREAL SDK、明日は Android XR"
date: 2026-05-29T10:00:00+09:00
slug: "xreal-android-xr-glasses-入門"
tag: "スターター"
summary: "XREAL の光学シースルーグラス向けの 2 つのスターター経路。出荷中のハードには Unity ベースの XREAL SDK 3.0 で今日から、そして XREAL 初の Android XR グラス Project Aura には Android XR SDK とエミュレータで備える。"
---

XREAL の光学シースルーグラスは興味深い局面にあります — 現行ハードウェア向けの成熟した出荷済み SDK と、**Project Aura** で形になりつつある Android XR の未来。ハッカソンのチームは今日、どちらの経路からでも始められます。本記事では両方を整理します。

## 経路 1 — XREAL SDK 3.0（Unity）で今日から

今買えるグラス（Air 2 Ultra、Air 2、Air、Light、One Pro）向けの開発経路は **Unity + XREAL SDK 3.0** です。

▸ [developer.xreal.com](https://developer.xreal.com/) ・ [docs.xreal.com](https://docs.xreal.com/)

- **エンジン：** Unity。**Unity XRI** と **AR Foundation** に対応 — 既存の AR Foundation プロジェクトを移行しやすく、同じ入力抽象が引き継げます。
- **機能：** 6DoF 空間認識、平面検出（水平＋垂直）、画像トラッキング、ハンドトラッキング（ピンチ／グラブ／スワイプ）、オクルージョンと衝突のためのデプスメッシュ、永続・マルチユーザー向け空間アンカー。
- **コンピュートモデル：** グラスは USB-C／HDMI でホストにテザリング。完全な空間コンピューティングには現状、対応 Snapdragon Android スマートフォン（Samsung S22／S23 クラス、OneUI 5.1+）が必要。表示出力のみなら iPhone・Mac・Steam Deck・ROG Ally・Windows PC からも可能。

チームに Unity スキルと現行 XREAL ハードウェアがあり、イベント中に動くビルドが欲しい場合に最適な経路です。

## 経路 2 — Project Aura（Android XR グラス）に備える

**Project Aura** は XREAL 初の **Android XR** グラスです。光学シースルー設計、約 70° の視野、分離コンピュートの外部パック、XREAL X1S 空間チップ ＋ Qualcomm Snapdragon XR プラットフォームプロセッサ。

開発者にとっての要点：Aura は **Android XR デバイス** なので、別個の XREAL SDK ではなく **Android XR SDK** — [Android XR 入門ガイド](/ja/news/androidxr-入門/) で扱った Jetpack XR スタック — で開発します。同ガイドのエミュレータワークフローなら、ヘッドセットなしで今日から始められます：

- グラス型デバイスには **グラスフォームファクタのスタック**（Jetpack Compose Glimmer ＋ Projected、ターゲット API 34）を使用。
- 最新の Android Studio Canary の **Android XR エミュレータ** で開発・テスト。
- **[Android XR Developer Catalyst プログラム](https://g.co/dev/catalyst)** に応募して Project Aura 開発キットを入手 — キットは 2026 年夏より限定の第一コホートに出荷開始、コンシューマ向けは 2026 年末までを目標。

▸ [Project Aura](https://www.xreal.com/us/aura) ・ [Android XR 開発者向け](https://developer.android.com/xr)

## ハッカソンではどちらの経路？

| 状況／希望 | 経路 |
|---|---|
| Unity スキル ＋ 現行 XREAL グラス、日曜までに動くビルド | **経路 1 — XREAL SDK 3.0** |
| Kotlin／Jetpack XR スキル、Android XR の未来狙い、エミュレータのみで可 | **経路 2 — Android XR SDK** |
| XREAL ハードウェアが手元にない | **経路 2** をエミュレータで — デバイス不要 |

両者は排他的ではありません。現行 XREAL ハードウェア ＋ XREAL SDK で検証したコンセプトは、Aura キット到着後の Android XR 移植の確かな土台になります。

## 注意点

- **Project Aura は未出荷。** 開発キットは 2026 年夏・限定コホート・Catalyst 経由の申請制。コンシューマ向けは 2026 年末目標。価格・重量・バッテリー駆動時間は未確定。
- **XREAL SDK の空間コンピューティングはホスト依存。** 完全な 6DoF／空間機能は現状、対応 Snapdragon Android スマートフォンを前提とします。機能に依存する前に [XREAL ドキュメント](https://docs.xreal.com/) でデバイスを確認してください。
- **2 つの異なる SDK。** 現行 XREAL グラスは XREAL SDK（Unity）、Project Aura は Android XR SDK。移植なしにコードが移ると仮定しないでください。

## 関連リンク

- [XREAL 開発者ハブ](https://developer.xreal.com/) ・ [XREAL ドキュメント](https://docs.xreal.com/) ・ [Project Aura](https://www.xreal.com/us/aura)
- [Android XR 開発者向け](https://developer.android.com/xr) ・ [Catalyst プログラム](https://g.co/dev/catalyst)
- 関連：[Android XR 入門](/ja/news/androidxr-入門/) ・ [ViroReact（Meta Horizon OS）](/ja/news/reactvision-react-native-ar-入門/) ・ [WebSpatial（visionOS）](/ja/news/webspatial-sdk-visionos-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
