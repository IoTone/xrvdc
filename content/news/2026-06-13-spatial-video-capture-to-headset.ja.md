---
title: "空間ビデオを端から端まで — iPhone で撮り、あらゆるヘッドセットで再生する"
date: 2026-06-13T10:00:00+09:00
slug: "spatial-video-capture-to-headset-入門"
tag: "ワークフロー"
summary: "空間ビデオは存在する中で最も手軽な XR フォーマットです — ポケットの中の iPhone がそのまま立体カメラだからです。落とし穴はフォーマットの分岐にあります。Apple の MV-HEVC はネイティブには Vision Pro でしか再生できず、Quest 3・Spectacles・WebXR はフレームパック方式のステレオを必要とします。本記事はその全経路を通します — iPhone か Vision Pro で撮影し、無料ツール 1 つで変換し、各ヘッドセットで再生する。そしてそれらすべてをまたぐ唯一の可搬ビューアーとしての WebXR まで。"
---

ここで扱ってきた撮影パイプラインの多く — [フォトグラメトリのスプラット](/news/scaniverse-3dgs-webxr-godot-入門/)、[360° リグ](/news/3dgs-360-カメラ-ワークフロー/)、[AI による写真→スプラット](/news/sharp-photo-to-splat-webxr-入門/) — は、成果物を得るのに相応の手間がかかります。**空間ビデオ**はその例外です。チームの誰かが最近の iPhone を持っていれば、その人はすでに立体 3D カメラを携えており、生成されるファイルは一切の処理なしで Apple Vision Pro で再生できます。手間は撮影にではなく、その 1 本のクリップを Quest 3 でも、Spectacles でも、ブラウザでも再生させるところにあります。空間ビデオの世界には、誰もが最初につまずく**フォーマットの分岐**があるからです。本記事はその全経路 — 撮影、変換、デバイスごとの再生 — をたどります。

▸ [Apple — 空間ビデオを撮影する](https://support.apple.com/ja-jp/guide/iphone/iph2ec40c4d1/ios) ・ [Mike Swanson の `spatial` ツール](https://blog.mikeswanson.com/spatial/) ・ [WebXR Layers](https://developers.meta.com/horizon/documentation/web/webxr-layers/)

## 「空間ビデオ」とは実際に何か

3 つの用語が混同されがちですが、区別すべきです。整理しておくと無駄な半日を節約できます。

- **空間ビデオ（Spatial video）** — Apple のコンシューマー向け立体フォーマット。2 つの視点を 1 本の **MV-HEVC**（マルチビュー HEVC）ストリームに収め、QuickTime `.mov` に格納し、縁をぼかした浮遊ウィンドウで表示します。ラップアラウンドではありません。これが手軽でアクセスしやすいものです。
- **Apple Immersive Video（AIV）** — プロ向けフォーマット。約 180° のラップアラウンド、片目あたり最大 8K、Spatial Audio、独自の投影方式と `.aivu` ラッパー。Blackmagic URSA Cine Immersive か Canon のデュアルレンズリグ、そして HLS パイプラインが必要です。週末の制作には範囲外です。
- **汎用の 180°/360°** — VR180 / VR360 のビデオ。素の H.264/H.265 で、ステレオを**サイドバイサイド**か**オーバーアンダー**で詰め、球面投影のメタデータを付けます。Quest・DeoVR・WebXR がネイティブに理解するのはこれです。

効いてくる区別は、**「空間」はコーデックそのものではなくメタデータのラベルだ**ということです。MV-HEVC ファイルが Vision Pro で*空間*として表示されるのは、適切なステレオメタデータ — 水平視野角に加えてカメラ基線または視差調整 — を持つときだけです。それを取り除けば、ただのステレオクリップになります。

## 撮影

**既定の、ほぼゼロコストの経路は iPhone です。** 空間撮影は **iPhone 15 Pro / 15 Pro Max、iPhone 16 と 17 の全ライン**で対応し、背面のメインと超広角カメラ（基線 19.2 mm）を使います。**設定 → カメラ → フォーマット → 「Apple Vision Pro 用の空間ビデオ」**（iOS 17.2 で追加）でオンにし、カメラアプリのビデオモードで**横向きに構えて**録画します。フォーマットは **1080p 30 fps** — iPhone 17 Pro でも依然そうです — で、毎分およそ 130 MB。`.mov` を AirDrop すれば、そのまま Vision Pro で再生できます。

その他の撮影手段を、おおよそアクセスしやすい順に。

- **Apple Vision Pro** は端末上で片目 2200×2200、30 fps の空間ビデオを録画します。
- **安価なステレオカメラ**、例えば QooCam EGO（レンズ間隔約 65 mm、3840×1080 の SBS）は iPhone より広く劇的な 3D 基線を与えますが、サイドバイサイド出力なので下記の変換ステップが必要です。
- **2 台カメラのリグ**（バーに 2 台のアクションカメラ）は使えますが、基線合わせ*と*フレーム精度の時間同期を後工程で解く必要があります — 同期が本当の難所です。
- **2D→3D 変換アプリ**（Spatial Media Toolkit、Depthify.ai）は、深度推定で通常映像からステレオペアを合成します — ステレオ素材がないときの代替で、品質はショットによります。

Quest 3 が**しない**ことの一つが、Apple 方式の空間ビデオの撮影です — そのパススルー録画は平面です。このフォーマットにとっては再生先であって、撮影機ではありません。

## フォーマットの分岐 — そしてそれを橋渡しする唯一のツール

落とし穴を一文で言えば、**Apple MV-HEVC は Apple プラットフォームでしか再生できず、Apple が撮ったものは Quest や Spectacles で直接は再生できない**ということです。XR の世界の他の部分はフレームパックのステレオ — サイドバイサイドかオーバーアンダーの H.264/H.265 — を VR180/360 の投影メタデータ付きで話します。つまり、どこでも再生できる単一のマスターファイルは存在せず、Apple のオリジナルと可搬の派生物があるのです。

macOS（Apple Silicon）上の無料で信頼できる橋渡しが **[Mike Swanson の `spatial` ツール](https://blog.mikeswanson.com/spatial/)** です。5 つのサブコマンド（`info`・`export`・`make`・`combine`・`metadata`）があり、ここで重要なのは 2 つ。Apple の MV-HEVC クリップを、他の世界が読めるオーバーアンダーファイルへ**書き出す（export）**：

```bash
./spatial export -i spatial_test.mov -f ou -o over_under.mov
```

そして**作る（make）**は逆方向です — ステレオ素材（その QooCam、リグ、あるいはオーバーアンダーの書き出し）を、メタデータも含めて正しい Apple の*空間* MV-HEVC に包み直します：

```bash
./spatial make -i over_under.mov -f ou -o new_spatial.mov \
  --cdist 19.24 --hfov 63.4 --hadjust 0.02 \
  --primary right --projection rect
```

`--cdist` はカメラ基線（mm）、`--hfov` は水平視野角、`--hadjust` は視差（輻輳）調整、`--projection rect` は直線投影、`--primary` は主となる目です。「空間」ラベルを得る規則は、`--hfov` に加えて `--cdist` **または** `--hadjust` を設定すること。（[SpatialMediaKit](https://github.com/sturmen/SpatialMediaKit) と Apple 内蔵の `avconvert` も同じ領域をカバーし、Compressor や DaVinci Resolve Studio は GUI で行えます。）

**FFmpeg について — はっきり述べておくべき注意点。** FFmpeg は MV-HEVC を問題なく*デコード*し（7.1 以降は単一ビューの選択も可能）、x265 4.0 は実験的な MV-HEVC *エンコード*を追加しました。しかし FFmpeg がエンコードした出力は **Apple の `vexu` 空間メタデータを持たない**ため、Vision Pro はそれを空間として認識しません。ヘッドセット対応の Apple 出力には、上記の AVFoundation ベースのツールを使ってください。

## デバイスごとの再生

### Apple Vision Pro — 無料、またはコンポーネント 1 つ

ノーコードの経路は **Quick Look** です。ファイルを `QLPreviewController` / `PreviewApplication` に渡せば、visionOS が空間スタイルと没入表示を自動で処理します。独自 UI を持つアプリには、**RealityKit の `VideoPlayerComponent`**（`AVPlayer` が背後）が完全な制御を与えます：

```swift
var component = VideoPlayerComponent(avPlayer: player)
component.desiredImmersiveViewingMode = .portal   // 共有空間内のウィンドウ型ステレオ
component.desiredSpatialVideoMode     = .spatial  // 空間的なぼかし縁
entity.components.set(component)
```

`.portal` はクリップをステレオウィンドウとして表示します。visionOS 26 以降の 180°/360° 素材には `ImmersiveSpace` 内で `.progressive`（Digital Crown で没入度を制御）に切り替えます。古い `VideoMaterial` も、ステレオビデオを独自の曲面ジオメトリにマッピングするのに引き続き使えます — シーン構築の基礎は [RealityKit + ARKit スターター](/news/vision-pro-mixed-reality-realitykit-arkit-入門/)を参照。

### Meta Quest 3 — 変換してから、ネイティブかウェブで

Quest は Apple の MV-HEVC を直接は読みません。上記の `spatial export` を実行して**オーバーアンダー MP4** を得て、VR180/球面メタデータを付ければ、**Meta Quest TV・DeoVR・Skybox** で再生できます。360 ステレオなら片目 ≥3840×3840 でエンコードし、ビットレートを抑えるために H.265 か AV1 を使います（3D で 50〜80 Mbps）。独自アプリなら、オーバーアンダーのテクスチャを Unity か Unreal で反転球（360）か半球（180）にマッピングし、UV を目ごとにステレオレイヤーへ分割します — あるいは、より可搬な WebXR を使います。

### WebXR — ヘッドセットをまたぐ唯一のビューアー

URL から到達できる単一のビューアーが欲しいチームには、**WebXR が可搬の経路**であり、ここのヘッドセット横断の読者（[A-Frame](/news/aframe-webxr-入門/)、[Babylon.js](/news/babylonjs-webxr-入門/)）がすでに暮らす場所です。Quest 上で最も効率的なのは **WebXR Layers API** — ブラウザがビデオを直接合成し、フレームごとの WebGL 処理が要りません：

```js
const binding = new XRMediaBinding(xrSession);
const video = document.createElement("video");
video.src = "over_under_180.mp4";
const layer = binding.createEquirectLayer(video, {
  space: xrReferenceSpace,
  layout: "stereo-top-bottom",   // オーバーアンダーの書き出しに対応
});
xrSession.updateRenderState({ layers: [layer] });
```

平面の 3D「映画スクリーン」には代わりに `createQuadLayer` を、サイドバイサイド素材には `layout: "stereo-left-right"` を使います。**重要な制約が一つ：** Vision Pro Safari は WebXR を `immersive-vr` のみで動かし、その AR モジュールは機能せず、**メディアレイヤーのバインディングもありません**。そのため Vision Pro ではビデオを自分で WebGL レイヤーに描画します。[three.js の `webxr_vr_video` パターン](https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_video.html)（反転球、左目を `layers.set(1)`、右目を `layers.set(2)`、分割のため UV を半分に）がそこで動き、A-Frame の `aframe-stereo-component` も同様です。Babylon の `VideoDome`（`videoMode: MODE_TOPBOTTOM`、`halfDomeMode: true`）は一行で済みますが、黒く描画されるという未解決の報告があるので、実際のセッション内でテストしてください。

**コーデックの地雷：** ブラウザの HEVC 対応は一貫せず、MV-HEVC はどのブラウザでもステレオとしてデコードされません。可搬ファイルは **H.264（または AV1）のオーバーアンダー MP4** でエンコードすれば、Quest ブラウザでも Vision Pro Safari の VR でも再生できます。

### Snap Spectacles — ここは畑違い

Spectacles は軽量の AR グラス（約 46° の導波路）で、ビデオ視聴ではなく Lens Studio の AR レンズを中心に作られています。Snap OS 2.0 は WebXR ブラウザを追加しましたが、`immersive-ar` 志向で計算資源も明示的に限られ、ステレオビデオレイヤーのサポートは文書化されていません。Spectacles は[AR レンズの対象](/news/vibe-coding-spectacles-入門/)として扱い、空間ビデオの再生機とは見なさないでください。WebXR-AR シーン内の素の `<video>` クアッドが現実的な上限です。

## 空間ウェブ、手短に

Apple の [WWDC 2026](/news/wwdc-2026-xr-visionos-27-入門/) の取り組みは、Apple デバイス上に宣言的で非 WebXR の経路を加えました。素の `<img src="spatial.heic" controls>` は空間写真（Safari 27 ではパノラマも）を表示し、APMP 準拠の 180/360 ファイルを指した素の `<video>` は `requestFullscreen()` で没入します。すっきりしてコード不要ですが、Apple 専用で、Quest や Snap には引き継がれません。ヘッドセットをまたぐ到達には、WebXR が引き続き答えです。

## 注意点

- **万能のマスターファイルはありません。** ネイティブの Vision Pro 用に MV-HEVC のオリジナルを保ち、それ以外すべてには H.264/AV1 のオーバーアンダー MP4 を配ります。一方が他方の代わりにはなりません。
- **HTTPS と CORS で配信する。** WebXR はセキュアコンテキストを要し、クロスオリジンの `VideoTexture` は `Access-Control-Allow-Origin` がないと無言で失敗します。
- **ビットレートを見積もる。** ステレオ 360 は重く（片目 ≥3840²、50〜80 Mbps）、ストリーミングするものは HLS/アダプティブを、Quest ではサイズを抑えるため AV1/H.265 を優先します。
- **ステレオは 360 より 180。** 半ドームの 180 が快適性と品質のスイートスポット。360 ステレオはピクセル予算を倍にし、極・継ぎ目のアーティファクトを足します。どのみち前を向いているのですから。
- **FFmpeg は Apple 空間ファイルを作れません。** デコードは可、しかしエンコードは Vision Pro が必要とするメタデータを落とします。Apple 出力には AVFoundation のツールを。

## 関連リンク

- [iPhone で空間ビデオを撮影する](https://support.apple.com/ja-jp/guide/iphone/iph2ec40c4d1/ios) ・ [Apple：Vision Pro での 180°/360°/広視野](https://support.apple.com/en-us/125014)
- [`spatial` ツール（MV-HEVC ↔ SBS/オーバーアンダー）](https://blog.mikeswanson.com/spatial/) ・ [SpatialMediaKit](https://github.com/sturmen/SpatialMediaKit)
- [WebXR Layers（Meta）](https://developers.meta.com/horizon/documentation/web/webxr-layers/) ・ [`XRMediaBinding.createEquirectLayer`（MDN）](https://developer.mozilla.org/en-US/docs/Web/API/XRMediaBinding/createEquirectLayer)
- [three.js `webxr_vr_video`](https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_video.html) ・ [Babylon VideoDome](https://doc.babylonjs.com/features/featuresDeepDive/environment/360VideoDome) ・ [A-Frame ステレオコンポーネント](https://github.com/c-frame/aframe-stereo-component)
- Apple WWDC25 セッション：[没入型ビデオの再生 (#296)](https://developer.apple.com/videos/play/wwdc2025/296/) ・ [Apple Projected Media Profile (#297)](https://developer.apple.com/videos/play/wwdc2025/297/)
- 関連：[XR 開発者のための WWDC 2026](/news/wwdc-2026-xr-visionos-27-入門/) ・ [360° カメラからの 3DGS](/news/3dgs-360-カメラ-ワークフロー/) ・ [はじめての Vision Pro シーン（RealityKit + ARKit）](/news/vision-pro-mixed-reality-realitykit-arkit-入門/) ・ [A-Frame WebXR スターター](/news/aframe-webxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
