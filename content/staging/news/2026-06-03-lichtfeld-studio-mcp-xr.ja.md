---
title: "LichtFeld Studio + MCP — ガウシアンスプラットの工程に AI エージェントを"
date: 2026-06-03T13:00:00+09:00
slug: "lichtfeld-studio-mcp-xr-入門"
tag: "ワークフロー"
summary: "LichtFeld Studio v0.5 は、3D ガウシアンスプラットの学習・編集・書き出しを行うネイティブのデスクトップワークステーションです。本物の Model Context Protocol サーバーを備えており、AI アシスタントが UI と同じコードパスを通じて学習やシーン編集を操作できます。そのワークフローと、Quest 3 / Vision Pro への書き出し配信を率直に解説します。"
---

[360 度カメラの 3DGS パイプライン](/news/3dgs-360-カメラ-ワークフロー/)では [**LichtFeld Studio**](https://github.com/MrNeRF/LichtFeld-Studio) を GUI の学習ツールとして使いました。プロジェクトはその先へ進んでいます。**v0.5** は 3D ガウシアンスプラッティングのための本格的なネイティブワークステーションで、学習・確認・編集・自動化・書き出しを 1 つのアプリで行えます。そしてこの読者層にとっての目玉は、本物の **Model Context Protocol（MCP）サーバー**を備えていることです。これにより AI アシスタントがスプラット工程の第一級のオペレーターになります。

## 現在の LichtFeld Studio

**Janusch Patas 氏（MrNeRF）**が開発する LichtFeld Studio は C++23 / CUDA のワークステーションで、現行は **v0.5.2**（2026 年 4 月）、GPL-3.0 です。入力は **COLMAP データセット**（歪み補正済み画像、点群、カメラ姿勢）で、**PLY・SOG・SPZ・USD・スタンドアロン HTML ビューアー**を書き出します。v0.5 では、分離されたプラグイン環境を持つ組み込み Python ランタイム、MCMC 最適化、歪みカメラ向けの 3DGUT、スプラットと並ぶメッシュ描画が加わりました。

ビルド済みの v0.5.2 は Lichtfeld Portal を通じた寄付制ですが、**v0.4.0 のビルドは無料**で、v0.5.2 はソースからビルドもできます。学習には **NVIDIA CUDA GPU**（CUDA 12.8 以上）が**必要**で、Apple Silicon や AMD での学習経路はありません。Mac やヘッドセットのユーザーは別マシンやクラウド GPU で学習します。

## MCP サーバー — 実際にあるもの

これは宣伝文句ではなく実在します。リポジトリには専用の [`src/mcp/` モジュール](https://github.com/MrNeRF/LichtFeld-Studio/tree/master/src/mcp)があり、HTTP MCP サーバー、プロトコル、ツール登録が含まれます。README は MCP を「外部ツールやエージェントが、GUI と同じ内部コードパスを使って LichtFeld Studio とやり取りできる」ものと説明しており、エージェントは人間のオペレーターに匹敵する操作能力を得ます。

[登録されているツール](https://raw.githubusercontent.com/MrNeRF/LichtFeld-Studio/master/src/mcp/mcp_tools.cpp)には、学習の内部状態を読む `training.get_state`・`training.get_loss_history`・`training.list_operations` に加え、アプリの CommandCenter から `{target}.{operation}` 形式（`model.*`・`optimizer.*`・`session.*`）で自動生成されるツール、シーン編集ツール、ビューポート/レンダーのキャプチャがあります。つまり MCP クライアントとして接続したアシスタントは、次のことができます。

- 学習を開始・監視し、損失履歴や状態を読む
- モデル / オプティマイザー / セッションの操作を実行する
- シーンを操作する
- 実行結果を確認するためにレンダー画像をキャプチャする

正直な制約が 1 つあります。この機能はソースと README で確認できますが、**MCP の wiki ページや「アシスタントを接続する」手順のチュートリアルはまだありません**。ソースに裏づけられた実在の機能として説明しつつ、接続は公式レシピに従うのではなく自分で組む前提でいてください。

## XR への書き出し配信

MCP が操作するのは*スタジオ*であり、ヘッドセットへの配備は行いません。配信は別の、よく知られた手順です。

- **Quest 3** — **SPZ**（Niantic の MIT 圧縮形式、PLY の約 10 分の 1）または PLY を書き出し、Quest 3 ブラウザの WebXR スプラットビューアーで表示します。[SuperSplat](https://superspl.at/editor) は WebXR 対応ビューアーを公開でき、その SplatTransform CLI は PLY・SPLAT・SOGS などを相互変換します。Quest 3 は中程度のシーンを十分扱えます。大きなシーンではガウシアン数と圧縮を抑えてください。
- **Apple Vision Pro** — より弱い対象です。Safari の WebXR は動きますが、ジッターやフレーム落ちが報告されています。品質を求めるなら [MetalSplatter](https://github.com/scier/MetalSplatter) のようなネイティブ Metal レンダラーや専用の visionOS ビューアーが適します。RealityKit/PolySpatial には依然ネイティブのスプラットプリミティブがなく、ドラッグ＆ドロップ経路はありません。

## 注意点

- **学習は NVIDIA CUDA のみ。** Mac やヘッドセットでの学習は不可。別 GPU マシンかクラウドを使います。
- **MCP が操作するのはスタジオで、グラスではありません。** XR の配信工程（書き出し＋ビューアー）はエージェントの操作とは別です。
- **MCP のドキュメントは最小限。** ソースには実在しますが公式セットアップ手順はまだなく、洗練された UX は期待できません。
- **初期段階のソフトウェア。** v0.5.x は安定化修正が頻繁で、前回の記事の「シーンの読み込み完了を待ってから学習」のクラッシュ注意点は依然有効です。
- **Vision Pro の再生は滑らかではありません**（Safari の WebXR 経由）。過度な期待は禁物です。

## 関連リンク

- [LichtFeld Studio リポジトリ](https://github.com/MrNeRF/LichtFeld-Studio) ・ [リリース（v0.5.2）](https://github.com/MrNeRF/LichtFeld-Studio/releases) ・ [wiki / ビルド](https://github.com/MrNeRF/LichtFeld-Studio/wiki/)
- [MCP モジュールのソース](https://github.com/MrNeRF/LichtFeld-Studio/tree/master/src/mcp) ・ [MCP ツール](https://raw.githubusercontent.com/MrNeRF/LichtFeld-Studio/master/src/mcp/mcp_tools.cpp)
- [spz 形式（Niantic、MIT）](https://github.com/nianticlabs/spz) ・ [SuperSplat](https://superspl.at/editor)
- [MetalSplatter（visionOS ネイティブ）](https://github.com/scier/MetalSplatter)
- [360 度カメラからの 3D ガウシアンスプラッティング](/news/3dgs-360-カメラ-ワークフロー/) — 撮影パイプラインの学習ツールとしての LichtFeld
- [スマホで撮るガウシアンスプラット — Scaniverse から WebXR と Godot へ](/news/scaniverse-3dgs-webxr-godot-入門/) — 同じ XR 配信課題、スマホ撮影
- [Spectacles のバイブコーディング](/news/vibe-coding-spectacles-入門/) — もう一つの MCP 駆動の制作ワークフロー
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
