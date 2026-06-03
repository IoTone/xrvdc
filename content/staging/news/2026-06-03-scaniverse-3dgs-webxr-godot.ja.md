---
title: "スマホで撮るガウシアンスプラット — Scaniverse から WebXR と Godot へ"
date: 2026-06-03T11:00:00+09:00
slug: "scaniverse-3dgs-webxr-godot-入門"
tag: "ワークフロー"
summary: "360 度カメラの 3DGS パイプラインに対するスマホ撮影版。Niantic の無料アプリ Scaniverse でシーンをスキャンするとガウシアンスプラットが端末上で生成され、.ply または軽量なオープンソース形式 .spz として書き出せます。それを WebXR（Quest 3 ブラウザ、Vision Pro Safari）や Godot に取り込む方法を、各経路の限界も含めて率直に解説します。"
---

[360 度カメラのガウシアンスプラットワークフロー](/news/3dgs-360-カメラ-ワークフロー/)はデスクトップ経路（Insta360 撮影、SphereSFM、LichtFeld Studio での学習）でした。本記事はそのスマホ版です。[**Scaniverse**](https://www.nianticspatial.com/products/capture) を被写体に向けるだけで、3D ガウシアンスプラットが**端末上で数分のうちに、無料で**生成されます。ハッカソンでは、実世界の物体や空間を XR シーンに取り込む最速の方法です。

## 撮影と書き出し

Scaniverse は **Niantic Spatial** が提供する無料の iOS / Android アプリで、端末上でのガウシアンスプラット撮影は無制限です。書き出し形式は次のとおりです。

- **`.ply`** — 汎用のスプラット形式。Lens Studio、SuperSplat、Blender、Unity、Unreal が読み込めます。
- **`.spz`** — Niantic の**オープンソース（MIT）**圧縮スプラット形式。同等の PLY と比べて約 **10 分の 1** のサイズ（250 MB の PLY が約 25 MB）で、知覚できる品質低下はほぼありません。リファレンス実装は [spz リポジトリ](https://github.com/nianticlabs/spz)。SPZ 4（2026 年）では ZSTD ストリームへ移行し、従来の点数上限が撤廃されました。
- メッシュ（OBJ、FBX、GLB、USDZ） — スプラットではなくジオメトリが必要なエンジン向けワークフロー用。

XR への配信では、エディターやコンバーター向けに `.ply` を、レンダラーが直接読める場合は `.spz` を書き出します。

## WebXR へ

最短経路は前回の記事と同じツールを再利用します。`.ply` を [**SuperSplat**](https://superspl.at/editor)（オープンソース、MIT）に取り込んで整え、**Publish** するだけです。生成される PlayCanvas ベースの HTML ビューアーは WebXR に対応しており、**Quest 2/3 と Apple Vision Pro の AR・VR でテスト済み**です。公開 URL をヘッドセットのブラウザで開けば、そのままシーンに入れます。

コードレベルで作るなら、2 つのレンダラーが有力です。

- [**Spark**](https://sparkjs.dev/)（`@sparkjsdev/spark`） — Three.js / WebGL2 の 3DGS レンダラー。（スプラットつながりで誤解されがちですが、Niantic ではなく **World Labs** 製です。）`.ply`、`.spz`、`.splat` などを読み込み、WebXR で動作し、移動コントローラーは Quest 3 でテスト済み。MIT ライセンス。
- [**Babylon.js**](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting) — `SPLATFileLoader` は主要な WebXR レンダラーの中で唯一 **`.spz` をネイティブ読み込み**でき（`.ply`・`.splat` も対応）、球面調和関数もサポートします。

対応デバイス：**Quest 3 / 3S** の Horizon OS ブラウザは没入型 WebXR を標準でサポートします。**Apple Vision Pro の Safari も WebXR に対応していますが、既定では無効**です。設定 → アプリ → Safari → 詳細 → 機能フラグ → WebXR で有効化してください。

## Godot へ

Godot 向けの主要なスプラットアドオンは [**godot-gaussian-splatting (GDGS)**](https://github.com/ReconWorldLab/godot-gaussian-splatting) です（MIT、活発に更新、Godot 4.4 以降）。`.ply`、圧縮 `.ply`、`.splat`、`.sog` を読み込め（`.spz` は事前変換が必要）、`GaussianSplatNode` を追加して描画します。

ただし Godot 経路には大きな注意点があります。**GDGS が対応するのはデスクトップの Forward+ レンダラーのみで、スタンドアロン Quest 3 の OpenXR ビルドが必要とする Mobile/Compatibility レンダラーには対応していません。** 汎用の VR レンダリングは PCVR/Forward+ では動きますが、**スタンドアロン Quest 3 への対応は文書化されていません**。Godot 自体の Quest 対応は成熟しており（コア OpenXR と [Meta ベンダー拡張](https://github.com/GodotVR/godot_openxr_vendors)）、制約はあくまでこのプラグインのレンダラー要件です。

## 注意点

- **Apple Vision Pro のネイティブ描画。** RealityKit と PolySpatial には**ネイティブのガウシアンスプラットプリミティブがない**ため、スプラットを RealityKit オブジェクトとしてそのまま置くことはできません。Godot 4.5 は visionOS 対応を追加しましたが、まずはウィンドウ表示が中心で、AVP は OpenXR を話さないため、Godot 経由の没入型スプラット描画は実用段階にありません。現実的なネイティブ経路は [**MetalSplatter**](https://github.com/scier/MetalSplatter) のような Metal レンダラーで、それ以外は Safari の WebXR を使います。
- **形式変換が要になります。** `.spz` を読めないツール（GDGS、mkkellogg の GaussianSplats3D）には変換が必要です。Niantic のブラウザツール [nianticlabs.github.io/spz](https://nianticlabs.github.io/spz/)、`gsbox` CLI、または SuperSplat 経由で変換します。
- **向き。** スプラットファイルに標準的な座標系はなく、Niantic の `.spz` シーンは上下や左右が反転して読み込まれることが多いため、取り込み時に回転・反転が必要です。
- **パフォーマンス。** スプラットシーンは点数が多いため、スタンドアロン機ではガウシアン数を抑え、`.spz` / 圧縮 PLY でフレームレートを維持します。
- **権利。** `.spz` という*形式*は MIT ですが、*撮影したスキャン*の権利は Scaniverse の利用規約に従います。撮影物を商用利用する前に規約を確認してください。

## 関連リンク

- [Scaniverse / Niantic Spatial Capture](https://www.nianticspatial.com/products/capture)
- [spz 形式（MIT）](https://github.com/nianticlabs/spz) ・ [ブラウザ変換・確認ツール](https://nianticlabs.github.io/spz/)
- [SuperSplat エディター](https://superspl.at/editor) — 取り込み・編集・WebXR ビューアーの公開
- [Spark（Three.js / WebXR）](https://sparkjs.dev/) ・ [Babylon.js ガウシアンスプラッティング](https://doc.babylonjs.com/features/featuresDeepDive/mesh/gaussianSplatting)
- [godot-gaussian-splatting (GDGS)](https://github.com/ReconWorldLab/godot-gaussian-splatting) ・ [MetalSplatter（visionOS ネイティブ）](https://github.com/scier/MetalSplatter)
- [360 度カメラからの 3D ガウシアンスプラッティング](/news/3dgs-360-カメラ-ワークフロー/) — デスクトップ撮影版
- [Image-blaster → エンジン → ヘッドセット](/news/image-blaster-xr-パイプライン/) — AI 生成ワールド、同じ配信課題
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
