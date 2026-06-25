---
title: "ビデオからガウシアンスプラット — クリップを歩けるシーンに変える"
date: 2026-06-20T10:00:00+09:00
slug: "video-to-gaussian-splats-入門"
tag: "ワークフロー"
summary: "ビデオクリップはすでにマルチビューの撮影リグです — 被写体の周りをスマホで一周すれば、そのフレームには 3D ガウシアンスプラットを学習させるのに十分な視差が含まれます。実用的な週末向けの道筋を紹介します：フレーム抽出、Postshot または Nerfstudio で学習、.ply / .splat を書き出し、WebXR で鑑賞 — さらに 4D（動く）スプラットの現状も。"
---

ビデオグラファーや写真家にとって、映像から XR シーンへの最短ルートは **ガウシアンスプラッティング** です。先に取り上げた [写真からスプラット](/ja/news/sharp-photo-to-splat-webxr-入門/) や [スマホスキャン](/ja/news/scaniverse-3dgs-webxr-godot-入門/) のパイプラインは静止画や専用スキャナから始まりますが、こちらは多くのクリエイターがすでに撮っている **ビデオクリップ** から始めます。被写体の周りをゆっくり一周する動きは、フレーム単位で見ればフォトグラメトリのリグが生み出すマルチビュー入力と同じです — そして最新のツールは、それをキャンプの他の参加者も使う [WebXR ビューア](/ja/news/threejs-webxr-入門/) にそのまま読み込めるスプラットに変えてくれます。

▸ [Postshot](https://www.jawset.com/) · [Nerfstudio + gsplat](https://docs.nerf.studio/) · [Brush（クロスプラットフォーム）](https://github.com/ArthurBrussee/brush) · [SuperSplat エディタ/ビューア](https://superspl.at/)

## 2 つの領域：静止シーン vs 動く被写体

誰もが最初につまずく分岐：**被写体は静止しているか、動いているか？**

- **静止シーン（3DGS）** — カメラが動き、世界は静止。像、部屋、製品の周回撮影。これは解決済みで週末向きのケースです。写真セットと同じ、通常の 3D ガウシアンスプラッティング。
- **動く被写体（4DGS）** — 話す人、水、フレーム間で変化するもの。これには **4D ガウシアンスプラッティング**（時間次元を持つスプラット）が必要で、まだ研究段階です：[4DGaussians](https://github.com/hustvl/4DGaussians)、[Deformable-3DGS](https://github.com/ingra14m/Deformable-3D-Gaussians)、Luma 系のボリュメトリックキャプチャ。学習は重く、鑑賞も難しい。ストレッチゴールとして扱いましょう。

2.5 日のビルドなら、**静止ケースを狙ってください**。動かない被写体を選んで周回します。

## スプラット向けの撮影

学習が気にするのは映像美ではなく、視差とカバレッジです:

- **ズームせず、動く。** 焦点距離は固定で、物理的に被写体を回り込む。
- **あらゆる角度をカバー** — 高い位置と低い位置のパスも。隙間はスプラットの穴になります。
- **均一で拡散した光**。途中で露出を変えない — 不整合が焼き付きます。
- **ゆっくり一定速度** が速い動きに勝ります — モーションブラーは大敵。歩く速さで 30〜60 秒あれば十分です。

## フレーム抽出

スプラット学習器は画像を取ります。`ffmpeg` でクリップをサンプリング — 毎秒 3〜6 フレームが良い出発点です:

```bash
ffmpeg -i orbit.mov -vf "fps=4,scale=1600:-1" frames/%04d.jpg
```

ほぼ同一のフレームが多すぎると、ディテールを増やさず学習を遅くします。少なすぎると structure-from-motion が情報不足になります。鮮明でよく分散した 150〜300 枚が健全な目安です。

## スプラットを学習する

セットアップの少ない順に、3 つの実用的な選択肢:

- **[Postshot](https://www.jawset.com/)**（Windows、無料）— ビデオまたはフレームフォルダをドラッグするだけで、structure-from-motion と 3DGS 学習を端から端まで実行し、`.ply` を書き出します。最も手間が少ない道。
- **[Nerfstudio](https://docs.nerf.studio/)** + `gsplat` バックエンド — `ns-process-data video --data orbit.mov` で COLMAP がカメラ姿勢を求め、`ns-train splatfacto` が学習します。クロスプラットフォームでスクリプタブル、CUDA 向き。
- **[Brush](https://github.com/ArthurBrussee/brush)** — macOS・Windows・Linux、さらにブラウザでも動く wgpu 製の学習器。CUDA 不要で、ラップトップ構成が混在するチームに向きます。

3 つとも標準的なガウシアンスプラットの `.ply` を書き出します。[SuperSplat](https://superspl.at/) でコンパクトな `.splat`/`.spz` 形式に変換すると読み込みが速くなります。

## WebXR で鑑賞する

ここでスプラットがヘッドセットと出会います。キャンプですでに使われている 1 ファイルの WebXR エンジンが、スプラットを直接読み込みます:

- **Babylon.js** は一次サポートあり — `await SceneLoader.ImportMeshAsync(null, "", "scene.splat", scene)` で、[Babylon WebXR スターター](/ja/news/babylonjs-webxr-入門/) のシーンにスプラットを落とし込みます。
- **Three.js** は [`GaussianSplats3D`](https://github.com/mkkellogg/GaussianSplats3D)（mkkellogg）経由で [three.js スターター](/ja/news/threejs-webxr-入門/) に読み込みます。
- **PlayCanvas / SuperSplat** はコードなしでビューアを URL として公開します — Quest、PICO、Vision Pro のブラウザで開くだけ。

静止スプラットはインタラクティブなジオメトリではなく固定シーンですが、自分のキャプチャの中に Quest 3 で立つだけでも強いデモになり、注釈用に [ヘッドセット内アートツール](/ja/news/make-art-inside-xr-入門/) とも自然に組み合わさります。

## 注意点

- **静止被写体のみ** — 4DGS の沼に踏み込まない限り。動く人物は素の 3DGS でひどくゴースト化します。
- **学習のボトルネックは VRAM** — クラウド GPU や Brush の軽さが控えめなラップトップでの代替策です。
- **スプラットは転送が重い** — 標準型ヘッドセットに送る前に SuperSplat で間引き、快適な WebXR フレームレートのため 100 万スプラットを十分下回ることを目標に。
- **反射・透明な面は解法を惑わせます** — ガラス、クロム、水はフローターを生みます。

## 関連リンク

- [Postshot（Jawset）](https://www.jawset.com/) · [Nerfstudio ドキュメント](https://docs.nerf.studio/) · [gsplat](https://github.com/nerfstudio-project/gsplat) · [Brush](https://github.com/ArthurBrussee/brush)
- [SuperSplat エディタ/ビューア](https://superspl.at/) · [three.js 向け GaussianSplats3D](https://github.com/mkkellogg/GaussianSplats3D) · [Babylon Gaussian Splatting](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting)
- 4D / 動的: [4DGaussians](https://github.com/hustvl/4DGaussians) · [Deformable-3DGS](https://github.com/ingra14m/Deformable-3D-Gaussians)
- 関連: [スマホ撮影スプラット（Scaniverse）](/ja/news/scaniverse-3dgs-webxr-godot-入門/) · [写真からスプラット（SHARP）](/ja/news/sharp-photo-to-splat-webxr-入門/) · [360 カメラで 3DGS](/ja/news/3dgs-360-カメラ-ワークフロー/) · [LichtFeld + MCP](/ja/news/lichtfeld-studio-mcp-xr-入門/) · [Three.js WebXR スターター](/ja/news/threejs-webxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
