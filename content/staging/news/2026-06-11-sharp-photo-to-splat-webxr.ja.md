---
title: "1 秒未満で写真からスプラットへ — Apple SHARP を WebXR で"
date: 2026-06-11T10:00:00+09:00
slug: "sharp-photo-to-splat-webxr-入門"
tag: "ワークフロー"
summary: "Apple の SHARP は、写真 1 枚を GPU 上で 1 秒未満のうちに 3D ガウシアンスプラットへ変換します — しかも MacBook で動きます。ループ全体を実用的にするのが 2 つの小さなスターターリポジトリ：4 コマンドで SHARP をインストールできる uv ベースのクイックスタートを備えたフォークと、生成された PLY をそのまま WebXR ヘッドセットセッションに配信する Spark + three.js テンプレートです。"
---

このシリーズで扱ってきた写真→スプラットのパイプラインの中で、最速のものは最短のものでもあります。Apple Machine Learning Research のモデル [**SHARP**](https://github.com/apple/ml-sharp)（"Sharp Monocular View Synthesis in Less Than a Second"）は、**写真 1 枚から 3D ガウシアンスプラットを、標準的な GPU 上で 1 秒未満のうちに**予測します — 撮影ウォークも COLMAP も多視点再構成も不要です。出力は素の 3DGS **`.ply`** で、このシリーズですでに整理してきたスプラット→ヘッドセットの配信経路にそのまま載ります。これをエンドツーエンドのループに変えるのが 2 つのコンパクトなスターターリポジトリです。摩擦のない **uv クイックスタート**を提供する [ml-sharp フォーク](https://github.com/IoTone/ml-sharp)と、スプラットを WebXR セッションに載せる **Spark + three.js** テンプレートの [**gsplats-to-webxr**](https://github.com/IoTone/gsplats-to-webxr) です。

▸ [apple/ml-sharp](https://github.com/apple/ml-sharp) ・ [IoTone/ml-sharp（uv クイックスタート）](https://github.com/IoTone/ml-sharp) ・ [IoTone/gsplats-to-webxr](https://github.com/IoTone/gsplats-to-webxr)

## SHARP とは何か — そしてどこに位置づくか

SHARP（[プロジェクトページ](https://apple.github.io/ml-sharp/)、[論文](https://arxiv.org/abs/2512.10685)）は**フィードフォワード型の単眼ビュー合成モデル**です。画像 1 枚を入力すると、1 回の高速な推論パスでガウシアンスプラットのシーンが出力されます。これは、Apple のもう一つの単一画像→スプラット研究プロジェクトである [LiTo](/news/lito-single-image-3dgs-webxr-入門/) の速度特化版の兄弟にあたります — LiTo は視点依存ライティングと引き換えにデータセンター GPU で数秒（ノート PC では数分）かかる拡散モデルですが、SHARP はその精緻さを**サブ秒の応答時間**と引き換えにしています。どちらもスプラットワークフロー地図の生成側に位置し、実在のシーンと撮影パスを必要とする撮影ベースの経路（[スマホの Scaniverse](/news/scaniverse-3dgs-webxr-godot-入門/)、[360° カメラのワークフロー](/news/3dgs-360-カメラ-ワークフロー/)）の対極にあります。

リポジトリには確かな勢いがあります — GitHub スター 8.5k 超、[UploadVR の記事](https://www.uploadvr.com/apple-sharp-open-source-on-device-gaussian-splatting/)、そしてすでに形成されつつあるサードパーティのラッパー群。研究モデルとしては異例なほどプラットフォーム対応が広く、**推論は CPU・CUDA・Apple Silicon（MPS）で動作**します — NVIDIA 搭載の Linux と Windows、または **M1 以降の macOS**。MacBook は十分に SHARP マシンとして使えます。CUDA が必須なのは、オプションのフライスルー動画レンダリング（`--render`）だけです。

## セットアップ：uv で 4 コマンド

ml-sharp の [IoTone フォーク](https://github.com/IoTone/ml-sharp)が存在する理由はただ一つ、インストールを簡単にすることです。アップストリームとの差分は [uv](https://docs.astral.sh/uv/) ベースのクイックスタートと小さな環境修正 — モデルの変更ではなく開発者体験の改善です。セットアップの全体は次のとおりです。

```bash
git clone https://github.com/IoTone/ml-sharp
cd ml-sharp
uv venv
uv python install 3.13
uv pip sync requirements.txt
. ./.venv/bin/activate
```

あとは写真のフォルダを指定するだけです。

```bash
sharp predict -i /path/to/input/images -o /path/to/output/gaussians
```

学習済みチェックポイントは初回実行時に自動ダウンロードされます（`~/.cache/torch/hub/checkpoints/` へ。`-c sharp_2572gikvuh.pt` で明示的に渡すこともできます）。入力フォルダ内の各画像は**独立に**処理されます — これは単一写真からの予測であり、画像セットの多視点再構成ではありません — そして各画像から、標準的な 3DGS レンダラーでそのまま使えるガウシアンスプラットの `.ply` が生成されます。

## 配信：Spark + three.js の WebXR スターター

[**gsplats-to-webxr**](https://github.com/IoTone/gsplats-to-webxr) は「スプラットを XR に持ち込むためのスタータープロジェクト」です。その `spark-threejs-webxr` テンプレートは、このシリーズでも使ってきた three.js のガウシアンスプラットレンダラー [Spark](https://sparkjs.dev/) でスプラットを読み込み、その周りに WebXR セッションを立ち上げます。SHARP が生成した PLY を `models/` に置き、サーブして、その URL を **Quest 3 のブラウザ**または **Vision Pro の Safari**（機能フラグで WebXR を有効化）で開きます。

つまずきやすい運用上のポイントが一つ：**WebXR には HTTPS が必須**です。LAN 内でも例外ではありません。スターターは 2 つの方法を記載しています。

- **手早く済ませる** — 自己署名証明書と `http-server` の組み合わせ：

  ```bash
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout localhost.key -out localhost.crt -subj "/CN=localhost"
  npm install -g http-server
  http-server -S -C localhost.crt -K localhost.key -a 0.0.0.0 -p 8080
  ```

- **推奨** — HTTPS を設定した Vite の vanilla プロジェクト（`npm init vite@latest spark-ply -- --template vanilla`）。シーンを反復しながらホットリロードが使えます。

スプラットをローカルではなく CDN から取得する場合、レスポンスに `Access-Control-Allow-Origin` が必要です — WebXR アセットの標準的な作法です。

組み合わせたループはハッカソンのデモ反復に十分な短さです。スマホで何かを撮影し、ノート PC で `sharp predict` を実行し、PLY をスターターに置いて、ヘッドセットのブラウザをリロードする。**写真からヘッドセット内のスプラットまで 1 分弱**、その大半はファイルの受け渡しです。

## 注意点

- **単眼は単眼です。** SHARP が合成するのは、元のカメラ位置の*周辺*でもっともらしく見える新規視点です。実空間のウォークアラウンド撮影ではなく、視点が写真から離れるほど忠実度は下がります。どの角度から見ても成立する部屋スケールのシーンには、[撮影ベースの経路](/news/scaniverse-3dgs-webxr-godot-入門/)を使ってください。
- **Apple の研究ライセンスであり、MIT ではありません。** LiTo と同様、SHARP は Apple 独自のサンプルコードライセンスで提供され、モデルの重みには別途の条件があります（`LICENSE`、`LICENSE_MODEL`）。ハッカソンのデモを超えて出力を使う前に確認してください。
- **現時点では PLY のみ。** ネイティブの `.splat`/`.spz` 書き出しはなく、[機能リクエスト](https://github.com/apple/ml-sharp/issues/8)がオープン中です。ヘッドセット配信では、素の PLY が重い場合は通常のツール（SuperSplat など）で圧縮・変換してください。
- **スターターリポジトリは若いです。** gsplats-to-webxr テンプレートはコミット数件でライセンスファイルが未整備、フォークの価値はクイックスタートのドキュメントにあります — どちらも固定する依存ではなく、読んで応用する足場として扱ってください。
- **スプラット配信の前提は常に同じ：** ヘッドセットのフレームレートに合わせてガウシアン数を抑え、取り込み時の向き補正に備えます。

## 関連リンク

- [apple/ml-sharp](https://github.com/apple/ml-sharp) ・ [プロジェクトページ](https://apple.github.io/ml-sharp/) ・ [論文（arXiv）](https://arxiv.org/abs/2512.10685)
- [IoTone/ml-sharp — uv クイックスタートのフォーク](https://github.com/IoTone/ml-sharp)
- [IoTone/gsplats-to-webxr — Spark + three.js の WebXR スターター](https://github.com/IoTone/gsplats-to-webxr) ・ [Spark](https://sparkjs.dev/)
- [写真 1 枚から 3D スプラットへ — Apple の LiTo を WebXR で](/news/lito-single-image-3dgs-webxr-入門/) — 視点依存ライティング側の兄弟
- [スマホで撮るガウシアンスプラット — Scaniverse から WebXR と Godot へ](/news/scaniverse-3dgs-webxr-godot-入門/) — 撮影ベースの対になる記事
- [360° カメラからの 3D ガウシアンスプラッティング](/news/3dgs-360-カメラ-ワークフロー/) — 撮影からシーンまでの全ワークフロー
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
