---
title: "360° カメラから 3D ガウシアンスプラッティング — キャプチャからシーン化まで"
date: 2026-05-18T10:00:00+09:00
slug: "3dgs-360-カメラ-ワークフロー"
tag: "ワークフロー"
summary: "ハッカソン作品向けにフォトリアルな 3D シーンをキャプチャ。360° 動画からの Gaussian Splatting パイプライン（Insta360 撮影・SfM・LichtFeld 学習・書き出し）を要約し、ツールとリポジトリを掲載。"
---

フォトリアルな環境は、XR デモを一気に「本物らしく」する近道です。**3D ガウシアンスプラッティング（3DGS）** は通常の映像を点ベースのレンダリング可能なシーンに変換します。360° カメラを使えばキャプチャも手早く済みます。本記事では、実用的なパイプラインを要約します。

> 本記事は **@Tks_Yoshinaga** 氏の Qiita 記事『[360度画像ガウシアンスプラッティング入門（基本ワークフロー）](https://qiita.com/Tks_Yoshinaga/items/354e9082bd607f3cefee)』を英語向けに凝縮・再構成した派生記事です。詳細とスクリーンショットは原文をご覧ください。すべてのクレジットは原著者に帰属します。要約上の誤りがあれば当方の責任です。

## 必要なもの

- **カメラ：** 360° カメラ — Insta360 X4 Air（8K で撮影）または RICOH THETA。
- **PC：** Windows 11、NVIDIA RTX GPU（原著者は RTX 4070 SUPER）、RAM 32 GB。

## パイプライン

**1 ・ 撮影と書き出し。** 短いクリップを撮影（まずは **1 分未満** から）。カメラ付属ソフト（例：Insta360 Studio）で **正距円筒図法（equirectangular）** に書き出します。重要：手ブレ補正が有効な場合は **水平維持・傾き補正・振動低減を無効化** してください。SfM が依存するカメラ幾何を歪めます。

**2 ・ SfM と点群 — [360° Gaussian](https://laskosvirtuals.gumroad.com/l/360gaussian)。** equirectangular 動画を読み込み、フレーム間隔を設定し、シャープフレーム抽出を有効化。任意で **AutoMasker**（有料）を使い、`person.sky` のようにピリオド区切りのキーワードで移動被写体・低テクスチャ領域をマスク。設定：Training Method `No Training`、SfM `SphereSFM`、Matcher `sequential`、プリセットはカメラ解像度に合わせる（例：Ultra 8K）。大規模屋外シーンでは反復/リファインを増やし、MinInliers を下げ、再投影しきい値を緩めに。実行後、`train_data/sparse` でカメラ位置と点群を確認します。

**3 ・ 学習 — [LichtFeld Studio](https://lichtfeld.io/)。** `train_data` フォルダをドラッグし、学習前に **点群とすべてのキューブマップ面の読み込み完了を待つ**（読み込み中の学習開始はクラッシュの原因）。Strategy `MRNF`、Steps Scaler は 300 枚以下なら `1`、それ以上は `画像数 / 300`、白飛びする場合は 2〜3 倍に。ディテール不足なら Max Gaussians を増やす。学習を開始すると徐々に鮮明になり、ステップ上限で自動停止します。

**4 ・ 書き出しと閲覧。** `.ply` を書き出し、ブラウザベースの **[SuperSplat Editor](https://superspl.at/editor)** で整形・動画化。出力例：[youtube.com/watch?v=n-NL1UisVF4](https://www.youtube.com/watch?v=n-NL1UisVF4)。

## ツールとリポジトリ

| ツール | 用途 |
|---|---|
| [360° Gaussian](https://laskosvirtuals.gumroad.com/l/360gaussian) | フレーム抽出 + SfM 自動化（SphereSFM） |
| AutoMasker | 移動/低テクスチャ領域の自動マスク（有料・約 €46） |
| [LichtFeld Studio](https://lichtfeld.io/) ・ [ソース](https://github.com/MrNeRF/LichtFeld-Studio) | GUI の Gaussian Splatting 学習ツール |
| [SuperSplat Editor](https://superspl.at/editor) | ブラウザビューア / 整形 / 動画書き出し |
| Insta360 Studio | equirectangular 書き出し（Insta360 純正） |

## 知っておきたい落とし穴

- LichtFeld Studio では学習前に **読み込み完了を待つ** — 最も多いクラッシュ要因。
- 撮影時に **手ブレ補正のサブ機能** をオフにしないと SfM 精度が低下。
- 初回実行で即座に **「Failed to process」** が出ることがある — Stop を押して再試行。
- **ライセンス：** ビルド済み **LichtFeld Studio v0.5.2** は無償配布が終了。**v0.4.0** のビルド済みは無償のまま、または v0.5.2 をソースからビルド。ビルドのコツ：`git clone --recursive`（サブモジュール）、Strawberry Perl がシステムの `cmake` を隠すことがあるため、誤って選ばれる場合は `C:\Strawberry\c\bin\cmake.exe` をリネーム。[Windows ビルド Wiki](https://github.com/MrNeRF/LichtFeld-Studio/wiki/Build-Instructions-%E2%80%90-Windows) を参照。

## ハッカソンでの意義

キャプチャしたスプラットシーンは、Spectacles / Quest / WebXR 作品にそのまま使えるフォトリアルな背景・アセットになります。モデリングに何時間もかけず、数分の撮影で。原著者には基本を押さえた後に読みたい「品質改善編」「Metashape 編」もあります。

## 関連リンク

- 原文記事：[qiita.com/Tks_Yoshinaga/items/354e9082bd607f3cefee](https://qiita.com/Tks_Yoshinaga/items/354e9082bd607f3cefee)
- [LichtFeld Studio](https://lichtfeld.io/) ・ [SuperSplat Editor](https://superspl.at/editor)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
