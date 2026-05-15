---
title: "Snap Spectacles と Lens Studio をはじめよう"
date: 2026-05-15T10:00:00+09:00
slug: "snap-spectacles-lens-studio-入門"
tag: "スターター"
summary: "ハッカソン向けネイティブプラットフォーム スターターシリーズ第 1 回。Lens Studio の入手方法、Spectacles のペアリング、そして公式 Spectacles サンプル 34 種すべてを紹介します。"
---

XR VisionDevCamp Fukuoka 2026 でスムーズにスタートを切るための **スタータープロジェクト ガイド** シリーズ、その第 1 回です。まずは **ネイティブプラットフォーム** から。ウェアラブル AR への入り口として、**Snap Spectacles** と **Lens Studio** ほど最適なものはありません。

![Snap Spectacles](https://raw.githubusercontent.com/Snapchat/Spectacles-Sample/main/_README-ref/spectacles-2024-hero.png)

Spectacles はハンドトラッキング、ワールドメッシュ、オンデバイス ML を備えたスタンドアロン型 AR グラスです。レンズは Snap の無料オーサリングツール **Lens Studio** で、ビジュアルなシーンエディタと TypeScript / JavaScript を使って制作します。2.5 日間のハッカソンで動くデモに最短で到達するには、公式サンプルを出発点にしてリミックスするのが近道です。本ガイドではツールチェーンと、Snap の公式サンプルリポジトリの全プロジェクトを紹介します。

## Lens Studio を入手する

Lens Studio は macOS / Windows 向けに無料でダウンロードできます。

▸ [Lens Studio をダウンロード](https://ar.snap.com/lens-studio)

インストール後：

- Snap アカウントでサインインします。
- **Spectacles** プロジェクトテンプレート、または下記のサンプルプロジェクトを開くと、Spectacles 向けのシーン設定が利用できます。
- Spectacles をペアリングし、**Send to Spectacles** やエディタ内プレビューで実機テストします。ペアリング、開発者プログラム、API リファレンスは [Spectacles 開発者ドキュメント](https://developers.snap.com/spectacles) を参照してください。

## 前提条件：Git LFS

Snap のサンプルリポジトリは 3D モデル・テクスチャ・メディアを **Git LFS（Large File Storage）** で管理しています。クローンする *前* にインストールして有効化してください。そうしないと大容量アセットがダウンロードされません。

```bash
# macOS
brew install git-lfs
git lfs install

# LFS を有効にしてクローン
git clone https://github.com/Snapchat/Spectacles-Sample.git
cd Spectacles-Sample

# LFS なしで既にクローン済みの場合：
git lfs install && git lfs pull
```

任意のプロジェクトフォルダを Lens Studio で直接開けば、開発を始められます。

## Spectacles サンプルリポジトリ

以下のサンプルはすべて 1 つのリポジトリにあります。

▸ [github.com/Snapchat/Spectacles-Sample](https://github.com/Snapchat/Spectacles-Sample)

> **注：** リポジトリの README は *非推奨（deprecated）* と記載されています。プロジェクト自体は問題なくビルドでき、学習リソースとして引き続き有用ですが、継続的なサポートについては Snap は [specs-devs org](https://github.com/orgs/specs-devs) と [r/Spectacles](https://www.reddit.com/r/Spectacles/) コミュニティを案内しています。

各カードはサンプルのソースフォルダにリンクしています。**view demo GIF** をクリックすると、GitHub 上のアニメーションプレビュー（大容量のため別タブで開きます）を表示できます。

## サンプルを見ていく

{{< spectacles-samples >}}

## ハッカソンにおすすめの出発点

Lens Studio が初めてなら、**Getting Started** カテゴリから始めましょう。

- **Essentials** — インタラクション、物理、アニメーション、レイキャストなど基礎概念が 1 つにまとまっています。最初の一歩に最適。
- **Fetch** — レンズから任意の Web API を呼び出します。クラウドや AI を使う機能の土台になります。
- **Spatial Image Gallery** / **Throw Lab** — 小さく完結したシーンで、デモ用に作り替えやすいサンプルです。

そこから、アイデアに合うカテゴリを選びましょう — **AI**（Remote Service Gateway・LLM・ビジョン）、**Connected Lenses**（マルチプレイヤー）、**SnapML**（オンデバイスのカスタムモデル）、**Navigation**（ロケーション AR）。

## 関連リンク

- [Lens Studio ダウンロード](https://ar.snap.com/lens-studio)
- [Spectacles 開発者ドキュメント](https://developers.snap.com/spectacles)
- [空間デザインガイドライン](https://developers.snap.com/spectacles/best-practices/design-for-spectacles/introduction-to-spatial-design)
- [Spectacles-Sample リポジトリ](https://github.com/Snapchat/Spectacles-Sample)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申込](https://luma.com/i5gerreb)

ネイティブプラットフォームシリーズ次回は、別のヘッドセットとそのスタータープロジェクトを取り上げます。ご質問は [お問い合わせ](/contact/) ページからどうぞ。
