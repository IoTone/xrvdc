---
title: "画像からヘッドセットのシーンへ：image-blaster → Unity/Unreal → Quest 3 & Vision Pro"
date: 2026-05-22T10:00:00+09:00
slug: "image-blaster-xr-パイプライン"
tag: "ワークフロー"
summary: "image-blaster で 1 枚の写真をメッシュ化された 3D ワールドに変換し、エンジン経由で実機へ。アセットを Unity/Unreal/Godot にインポートして Meta Quest 3 や Apple Vision Pro にビルドする手順。"
---

環境を素早く用意したい？ **[image-blaster](https://github.com/neilsonnn/image-blaster)**（MIT）は、1 枚の画像を 5 分以内でメッシュ化 3D ワールドに変える Claude Code スキルセットです。本記事ではヘッドセットへの **エンジン経由ルート** を扱います。手間は大きいものの、実機性能とフル XR 入力で最も優れたルートです。（より軽量なブラウザ経由は [A-Frame / WebXR スターター](/ja/news/aframe-webxr-入門/) を参照。）

## image-blaster の出力

リポジトリで `claude` を実行し、[World Labs](https://platform.worldlabs.ai/) と [FAL](https://fal.ai/) の API キーを渡し、画像を `input/` に置いて *「blast it and confirm each step with me」* と依頼します。出力：

1. *動的* オブジェクトの **`.glb` / `.obj` メッシュ**（FAL 経由の Hunyuan-3D — `--face-count 40000-1500000`、既定 `50000`、`--generate-type Normal|LowPoly|Geometry`）
2. *静的* 環境の **`.spz` ガウシアンスプラット**（World Labs Marble `marble-1.1`）
3. **`.mp3`** アンビエントループ＋オブジェクト別 SFX（ElevenLabs）

> スキルセットは MIT ですが、有料のサードパーティ API（World Labs、FAL/Hunyuan、ElevenLabs）を呼び出します。API キーとクレジットが必要です。この点で [360° カメラからの 3DGS ワークフロー](/ja/news/3dgs-360-カメラ-ワークフロー/) とも相性が良く、どちらも最終的に「実機へ載せる必要のあるガウシアンスプラット」に行き着きます。

## エンジンパイプライン（Path B）

**1 ・ 生成。** 参照画像を `IMAGE-BLAST`。ヘッドセット向けにはメッシュの予算を抑え、`--face-count` を控えめ（約 5 万以下）に、動的プロップは `LowPoly` も検討。

**2 ・ メッシュをインポート。** `.glb`/`.obj` は **Unity・Unreal・Godot** にネイティブで読み込めます。これらがインタラクティブ／動的オブジェクトとコライダーになります。

**3 ・ スプラットの扱い。** `.spz` 環境が最難関です。エンジンはガウシアンスプラットをネイティブ描画しません。`.spz` → `.ply` に変換（SuperSplat / spz ツール）し、スプラットレンダラを追加します：

- **Unity → Quest 3：** ガウシアンスプラッティングパッケージ（例：Aras Pranckevičius 氏の UnityGaussianSplatting）。コンピュートシェーダ方式でモバイル/Quest 対応は実験的 — スプラット数を抑え、早めに検証し、環境用の **メッシュフォールバック** を用意。
- **Unreal → Quest 3：** ガウシアンスプラットプラグイン＋OpenXR、同様に性能管理を徹底。
- **Apple Vision Pro：** 最難ターゲット。RealityKit に **ガウシアンスプラット描画は内蔵されておらず**、Unity **PolySpatial**/visionOS も標準では描画しません。現実的な選択：(a) World Labs Marble に環境の **メッシュ書き出し** を依頼し AVP ではスプラットを使わない、(b) フル没入の Unity/visionOS アプリで Metal ベースのスプラットレンダラを使う。ハッカソンでは AVP は **メッシュのみ** が圧倒的に速い。

**4 ・ オーディオ配線。** `.mp3` アンビエントをループ音源に、オブジェクト SFX を該当プロップに割り当て。

**5 ・ 実機ビルド。**

- **Meta Quest 3** — Unity（URP）または Unreal を **OpenXR** で、Android ビルド、ハンドトラッキング＋コントローラ。最もスムーズなエンジンターゲット。
- **Apple Vision Pro** — Unity **PolySpatial**（共有空間）またはフル没入の visionOS アプリ。性能のためメッシュ環境を優先。

## ハッカソン向けのポイント

- **メッシュは簡単、スプラットがリスク。** `.glb`/`.obj` はどのエンジンにもそのまま入ります。`.spz` 環境は変換 *と* 実験的レンダラが必要 — Quest 3 では慎重に予算化、Vision Pro ではスプラットレンダラを実証済みでない限り **メッシュ環境** を優先。
- **face count は最初に下げる** — 再生成はフラグ 1 つ、後からの再デシメートはそうはいきません。
- **最高の仕上がり／性能** はこのエンジンルート。Quest 3 ＋ Vision Pro で *今日とにかく動かす* なら [WebXR ルート](/ja/news/aframe-webxr-入門/) の方が初描画まで速いです。

## 関連リンク

- [image-blaster リポジトリ](https://github.com/neilsonnn/image-blaster)（MIT）
- [World Labs](https://platform.worldlabs.ai/) ・ [FAL](https://fal.ai/)
- 関連：[360° カメラからの 3DGS](/ja/news/3dgs-360-カメラ-ワークフロー/) ・ [A-Frame / WebXR](/ja/news/aframe-webxr-入門/) ・ [visionOS の入り口](/ja/news/visionos-2-30日チャレンジ/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
