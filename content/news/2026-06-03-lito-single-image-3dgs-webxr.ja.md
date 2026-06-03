---
title: "写真 1 枚から 3D スプラットへ — Apple の LiTo を WebXR で"
date: 2026-06-03T12:00:00+09:00
slug: "lito-single-image-3dgs-webxr-入門"
tag: "ワークフロー"
summary: "Apple の研究プロジェクト LiTo は、写真 1 枚から視点依存のライティングを保持した 3D ガウシアンスプラットを生成し、PLY として書き出せます。現実的な「1 枚の画像 → スプラット → WebXR」パイプラインを紹介するとともに、これが Vision Pro 用ツールではなく PyTorch の研究モデルである理由と、Apple Vision Pro に載せる際の実際のコストを率直に説明します。"
---

[**LiTo**](https://machinelearning.apple.com/research/lito)（Surface Light Field Tokenization）は ICLR 2026 に採択された Apple Machine Learning Research のプロジェクトで、**写真 1 枚から 3D オブジェクトを生成**します。多くの画像→3D 手法と異なり、*視点依存の見え方* — 鏡面ハイライト、反射、フレネル効果 — を、ジオメトリとライティングを明確に分離したまま捉えます。ネイティブ出力は **3D ガウシアンスプラット**で、これまで扱ってきたスプラット→XR のパイプラインと自然に噛み合います。

## 実態を正しく押さえる

何かを積み上げる前に、ツールの正体を正確に押さえます。LiTo は **PyTorch の研究用コードベース**で、2 つのモデル（点群トークナイザーと画像→3D の拡散トランスフォーマー）に加え、学習済みチェックポイントと実行可能な FastAPI デモを含みます（[リポジトリ](https://github.com/apple/ml-lito)、[論文](https://arxiv.org/abs/2603.11047)）。Apple が公開しているものの、**Swift ライブラリでも Core ML モデルでも visionOS コンポーネントでもなく**、リポジトリに Apple プラットフォーム向けのコードは含まれていません。

また GPU 負荷が高く、1 枚あたり H100 で約 5 秒、M4 Max で約 160 秒です。Apple Silicon でも動きますが、端末上ではなくワークステーション/クラウド向けのモデルです。

**ライセンス：** LiTo は Apple の研究用サンプルコードライセンス（MIT/BSD/Apache では**ない**）で提供され、モデルの重み（`LICENSE_MODEL`）と生成サンプル（`LICENSE_generated_samples`）には別途の条件があります。条件を確認しない限り出力は研究用途とみなし、そのまま製品に載せられると考えないでください。

## 現実的なパイプライン：画像 → スプラット → WebXR

XR との誠実な接点は、Apple プラットフォーム統合ではなく**出力形式**を経由します。

1. LiTo のデモをローカル（Apple Silicon でも、遅いながら動作）またはレンタルの NVIDIA GPU で実行し、画像 1 枚を入力します。
2. 結果をガウシアンスプラットの **`.ply`** として書き出します。再構成ノートブックは PLY を直接保存し、コミュニティ製の [ComfyUI ラッパー](https://github.com/PozzettiAndrea/ComfyUI-LiTo)は「PLY 書き出し」ノードを追加して 1 枚の画像→スプラットの流れを提供します。
3. その PLY を WebXR スプラットレンダラーで読み込みます。ヘッドセット対応ビューアーを公開するなら [SuperSplat](https://superspl.at/editor)、コードレベルで作るなら [Spark](https://sparkjs.dev/) や [Babylon.js](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting)。いずれも **Quest 3 ブラウザ**と **Vision Pro Safari**（機能フラグで WebXR を有効化）で動作します。

これは具体的に作れるデモです。1 枚の写真が、LiTo の視点依存ライティングを保ったまま、ヘッドセットの中で歩き回れるスプラットになります。

## Vision Pro の注意点

LiTo のコンテンツを Apple Vision Pro に*ネイティブ*で載せるのは、難しく、損失を伴う部分です。RealityKit と PolySpatial には**ネイティブのガウシアンスプラットレンダラーがなく**、LiTo も変換を提供しません。2 つの経路はどちらもコストを伴います。

- **サードパーティの Metal スプラットレンダラー**（例：[MetalSplatter](https://github.com/scier/MetalSplatter)） — スプラットを保てますが、Apple 標準フレームワークの外で Swift/Metal の実装が必要です。
- **スプラットをテクスチャ付きメッシュ → USDZ に変換** — RealityKit にきれいに載りますが、**LiTo の核心である視点依存ライティングを捨てることになります。**

したがって Vision Pro は注意付きのストレッチ目標と捉えてください。確実で実演可能な成果は **1 枚の画像 → LiTo スプラット → WebXR** で、これはヘッドセットのブラウザで今日動きます。

## 注意点

- **Apple Vision Pro / Core ML 用ツールではありません。** Apple Research のリポジトリだからといって AVP 用ツールにはなりません。端末上で動く経路を持たないサーバー級の PyTorch です。
- **研究ライセンスであり、オープンソースではありません。** 出力を再利用する前に `LICENSE`・`LICENSE_MODEL`・`LICENSE_generated_samples` を確認してください。
- **重いです。** データセンター GPU で数秒、ノート PC で数分。計算資源を見越して計画してください。
- **スプラット配信の前提は常に同じ：** ヘッドセットのフレームレートに合わせてガウシアン数を抑え、取り込み時の向き補正に備えます。

## 関連リンク

- [LiTo プロジェクトページ（インタラクティブ 3DGS デモ）](https://apple.github.io/ml-lito/) ・ [Apple ML Research](https://machinelearning.apple.com/research/lito)
- [apple/ml-lito リポジトリ](https://github.com/apple/ml-lito) ・ [論文（arXiv）](https://arxiv.org/abs/2603.11047)
- [ComfyUI-LiTo（1 枚の画像 → スプラット → PLY）](https://github.com/PozzettiAndrea/ComfyUI-LiTo)
- [SuperSplat](https://superspl.at/editor) ・ [Spark](https://sparkjs.dev/) ・ [Babylon.js ガウシアンスプラッティング](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting)
- [MetalSplatter（visionOS ネイティブ）](https://github.com/scier/MetalSplatter)
- [スマホで撮るガウシアンスプラット — Scaniverse から WebXR と Godot へ](/news/scaniverse-3dgs-webxr-godot-入門/) — 撮影ベースの対になる記事
- [Image-blaster → エンジン → ヘッドセット](/news/image-blaster-xr-パイプライン/) — もう一つの AI アセット→XR 経路
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
