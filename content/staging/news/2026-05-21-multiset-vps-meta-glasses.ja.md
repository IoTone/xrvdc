---
title: "Meta Ray-Ban グラスに正確な位置を：MultiSet VPS"
date: 2026-05-21T10:00:00+09:00
slug: "multiset-vps-meta-glasses-入門"
tag: "ショーケース"
summary: "機能スポットライト。MultiSet の Visual Positioning System が Meta Ray-Ban グラスに 6-DOF の位置情報を付与し、音声ターンバイターン案内や共有空間マルチプレイヤーを実現。試せる iOS サンプル付き。"
---

このシリーズに通底するのは、**AI グラスは「自分が今どこにいるか」を正確に知ると、有用性が劇的に高まる** ということです。MultiSet AI の Nikhil Sawlani 氏の言葉を借りれば、正確な位置コンテキストは、音声ターンバイターン案内、位置連動ゲーム、「Uber の乗車地点を見つける」といった体験を解き放ちます — 必要な情報を、必要なときに、必要な場所で。

**MultiSet の Visual Positioning System（VPS）** はその位置認識を **Meta Ray-Ban スマートグラス** にもたらします。学べる動作サンプル（iOS）も公開されています。

▸ [github.com/MultiSet-AI/wearable-vps-samples](https://github.com/MultiSet-AI/wearable-vps-samples)（iOS）

## サンプルでできること

Meta Ray-Ban グラスとペアリングし、**MultiSet VPS API** と **Meta Wearables Device Access Toolkit**（[Meta Ray-Ban Display の記事](/staging/news/meta-wearables-webapp-sdk-入門/) で触れた DAT SDK）を組み合わせます。

- **ローカライゼーション** — グラスのカメラからフレームを取得し、カメラ内部パラメータと共に送信、マッピング済み空間内の **6-DOF 姿勢**（位置＋向き）と信頼度スコアを取得。
- **ターンバイターン案内** — ウェイポイントグラフ ＋ A* 経路探索、**グラスのスピーカーから流れる音声** で POI まで誘導。
- **マルチプレイヤー** — 装着者のローカライズ済み姿勢を（Multipeer Connectivity で約 20 Hz）MultiSet iOS SDK のホストへ送信し、共有空間 AR を実現。
- **低レイテンシ** — セッション事前ウォームアップ、端末側ダウンスケール、再ローカライズ用の動画フレーム高速パス。

## 試してみる

**前提条件：** iOS 17+、Xcode 15+、**Meta AI アプリで開発者モードを有効化** してペアリングした Meta Ray-Ban スマートグラス、**Meta Wearables DAT SDK 0.6.0**（Swift Package Manager で解決）、[MultiSet 開発者ポータル](https://developer.multiset.ai/credentials) の **VPS API 認証情報**。さらに **マッピング済み環境** が必要で、マップとナビデータは [MultiSet Unity SDK](https://github.com/MultiSet-AI/multiset-unity-sdk)（`NavMeshExport` シーン → `{mapCode}_navigation_data.json`）で生成します。

```bash
git clone https://github.com/MultiSet-AI/wearable-vps-samples.git
cd wearable-vps-samples/iOS/MultisetWearable
open MultisetWearable.xcodeproj
```

Client ID/Secret を設定し（xcconfig ＋ Info.plist が秘匿に安全な推奨方法）、アプリ内設定で Map Code を入力、グラスをペアリングして **Navigation Demo** を実行します。

> 注：本シリーズで先に紹介したオープンソースのツールキットと異なり、MultiSet SDK は **独自ライセンス** で、API 認証情報が必要です。開発者ポータルから無料で試せますが、本番利用は規約を確認してください。

## ハッカソンでの意義

ローカライゼーションは、真に空間的なグラスアプリに欠けていた基本要素です。VPS があれば、**会場ナビゲーター**、**位置固定型ゲーム**、**共有空間マルチプレイヤー** のデモを、実際に装着するハードウェア上で、独自トラッキングを発明せずに作れます。シリーズ前半の Meta Ray-Ban Web アプリのアプローチとも自然に組み合わせられます。

## 関連リンク

- [wearable-vps-samples (iOS)](https://github.com/MultiSet-AI/wearable-vps-samples) ・ [MultiSet ドキュメント](https://docs.multiset.ai/) ・ [開発者ポータル](https://developer.multiset.ai/credentials)
- [MultiSet Unity SDK](https://github.com/MultiSet-AI/multiset-unity-sdk)（マッピング・ナビデータ）
- 関連：[Meta Ray-Ban Display Web Apps](/staging/news/meta-wearables-webapp-sdk-入門/)
- [ハッカソン詳細](/staging/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

この話題を発信された Nikhil Sawlani 氏（MultiSet AI）に感謝します。ご質問は [お問い合わせ](/staging/contact/) ページからどうぞ。
