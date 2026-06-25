---
title: "カメラから YouTube VR へ — ノーコードの空間ビデオの道"
date: 2026-06-21T10:00:00+09:00
slug: "spatial-video-youtube-vr-入門"
tag: "スターター"
summary: "すべての XR プロジェクトにビルド工程が要るわけではありません。180° または 360° のビデオを撮り、正しいメタデータを付与すれば、YouTube がヘッドセットでステレオ再生します — アプリもエンジンも不要。カメラから Quest・PICO・Vision Pro までのゼロコードの道筋と、カスタム WebXR ビューアへの引き継ぎ方を紹介します。"
---

ヘッドセットに映像を、しかも一行もコードを書かずに届けたいビデオグラファーにとって、最短の道は **YouTube VR** です。正しくタグ付けした 180°/360° クリップをアップロードすれば、Quest・PICO・Vision Pro の YouTube アプリが没入再生します — ステレオで、ヘッドトラッキング付き、アダプティブ配信。[端から端までの空間ビデオパイプライン](/ja/news/spatial-video-capture-to-headset-入門/) は自作ビューアを扱いますが、こちらはそのノーコード版であり、初日にクリエイターの作品をデバイスへ載せる最速の方法です。

▸ [YouTube VR（Quest）](https://www.meta.com/experiences/youtube-vr/2002317119880945/) · [Google `spatialmedia` インジェクタ](https://github.com/google/spatial-media) · [VR180/360 を YouTube にアップロード](https://support.google.com/youtube/answer/6178631)

## 撮影フォーマットを選ぶ

YouTube は 2 つの没入形状を理解します。ほとんどの被写体には **180°（VR180）** が適しています — ステレオの奥行き、前方視野、360 の半分のピクセル数、そしてカメラの後ろに誰も立たずに済みます:

- **VR180 カメラ** — Canon EOS VR システム（R5 C / R7 + デュアル魚眼レンズ）、QooCam EGO、旧 Lenovo Mirage。ネイティブのステレオ 180。
- **360° カメラ** — Insta360 X4/X5、GoPro Max。既定ではモノスコピック。一部はステレオ 360 を撮影。
- **iPhone 空間ビデオ** — [空間ビデオの記事](/ja/news/spatial-video-capture-to-headset-入門/) のツールで MV-HEVC を over-under 180 に変換し、ここでは VR180 として扱います。

## メタデータを付与する

ここが多くの人を引っかける唯一の工程：**YouTube は映像が没入かどうかをピクセルではなくメタデータのタグで判断します。** タグのないフラットな正距円筒の映像は、歪んだ長方形として再生されます。アップロード前に球面/ステレオのメタデータを追加します:

- **カメラソフトが自動で付与** — Insta360 Studio、GoPro Player、Canon EOS VR Utility は、投影とステレオレイアウトを書き込んだ状態で書き出します。
- **手動インジェクション** — Google のオープンソース [`spatialmedia`](https://github.com/google/spatial-media) がコマンドラインや小さな GUI からファイルにタグ付けします:

```bash
python spatialmedia -i --stereo=top-bottom --projection=mesh in.mp4 out.mp4
```

書き出しに合わせて `--stereo=top-bottom`（または `left-right`）を指定。モノスコピック 360 なら `--stereo` を外します。`exiftool` でも同じ `Spherical`/`StereoMode` フィールドを手早く付けられます。

## アップロードして観る

タグ付けしたファイルを限定公開でアップロードすると、YouTube は数分で VR 版を処理します。その後:

- **Meta Quest 3 / PICO 4 Ultra Enterprise** — YouTube VR アプリ（またはブラウザ）が形式を検出し、没入ビューを提示します。会場には PICO を複数台用意しています。
- **Apple Vision Pro** — Safari の YouTube、またはサードパーティクライアント。Apple 独自の没入ルートは [空間ビデオの記事](/ja/news/spatial-video-capture-to-headset-入門/) を参照。
- **ローカル、アップロード不要** — DeoVR や Pigasus が同じタグ付きファイルをヘッドセットのストレージから直接再生します。会場の Wi-Fi が混んでいるときに便利。

## 単なるクリップでなく「作品」にする

1 本のビデオはデモですが、少し枠組みを与えればハッカソンの提出物になります:

- **キュレーション** — イベント中に撮影・タグ付けした福岡各所の VR180 プレイリスト。
- **WebXR で包む** — 同じファイルを [A-Frame](/ja/news/aframe-webxr-入門/) や [three.js](/ja/news/threejs-webxr-入門/) のビューアに入れ、標準の YouTube UI ではなくカスタムのホットスポット付きブランドプレーヤーに。
- **形式を混ぜる** — 同じ場所の [ガウシアンスプラット](/ja/news/video-to-gaussian-splats-入門/) と組み合わせ、平面没入のクリップから歩けるキャプチャへ踏み込ませる。

## 注意点

- **タグがなければ没入なし** — メタデータが書き出しで残ったか必ず確認し、YouTube がフラット表示なら再注入します。
- **ステレオは 360 より 180** — 360 はピクセル予算を倍にし、継ぎ目と極の歪みを足します。どのみち前を向くものです。
- **YouTube は再エンコードします** — 多少の画質低下と、VR オプションが現れるまで数分の処理を見込んでください。
- **ビューアであって操作ではない** — 掴む・動かす・入力に反応させるには [WebXR](/ja/news/threejs-webxr-入門/) ビルドへ引き継ぎます。

## 関連リンク

- [VR180/360 ビデオを YouTube にアップロード](https://support.google.com/youtube/answer/6178631) · [YouTube VR アプリ](https://www.meta.com/experiences/youtube-vr/2002317119880945/)
- [Google `spatialmedia` メタデータインジェクタ](https://github.com/google/spatial-media) · [Canon EOS VR システム](https://www.canon.jp/eos-vr) · [Insta360](https://www.insta360.com/)
- 関連: [空間ビデオ 撮影から再生](/ja/news/spatial-video-capture-to-headset-入門/) · [ビデオからガウシアンスプラット](/ja/news/video-to-gaussian-splats-入門/) · [A-Frame WebXR スターター](/ja/news/aframe-webxr-入門/) · [Three.js WebXR スターター](/ja/news/threejs-webxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
