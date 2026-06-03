---
title: "Spectacles プロジェクトを格上げする Lens Studio アセット 6 選"
date: 2026-06-02T10:00:00+09:00
slug: "lens-studio-アセット-spectacles"
tag: "スターター"
summary: "Lens Studio アセットライブラリの見落とされがちな 6 つのコンポーネント — Surface Placement、3D Hand Hints、Spectacles UI Kit、Interactable Helper、Access Components、Marker Tracking — を紹介。AR 開発者 Lafiya Watson 氏（Bad Chick Studios）が、ハッカソンの Spectacles レンズに役立つ実用的な部品として取り上げています。"
---

[Lens Studio](https://ar.snap.com/lens-studio) のアセットライブラリには、多くのプロジェクトで使われないほど豊富なコンポーネントが揃っており、最も時間を節約できる部品ほど見落とされがちです。AR 開発者の **Lafiya Watson** 氏（[Bad Chick Studios](https://badchickstudios.com/)）は、短い解説動画 [*6 Lens Studio Assets to Level Up Your Spectacles Projects*](https://youtu.be/piNmt2kqih8) でそのうちの 6 つを紹介しています。いずれも [Snap Spectacles](/news/snap-spectacles-lens-studio-入門/) レンズから定型コードを取り除く、すぐに使える部品です。2.5 日間のハッカソンでは、こうしたコンポーネントが、配線を自前で書くことなくプロトタイプを完成形のデモへと押し上げてくれます。

6 つすべては Lens Studio のアセットライブラリからインストールできます。**Window → Asset Library** を開き、各コンポーネントをプロジェクトに追加してください。

## 6 つのアセット

**Surface Placement** — 装着者が空間内の場所を選び、体験をその位置に固定できます。コンテンツが現れる前に、ワールド上のアンカーを定めます。着座やテーブル上のレンズの定番の起点です。

**Spectacles 3D Hand Hints** — ジェスチャーを示すアニメーション付きの 3D ハンド。たとえばボタンを押すためのピンチ操作を正確に提示します。グラスを初めて装着するユーザーを手軽にオンボーディングできます。

**Spectacles UI Kit** — Spectacles 向けに設計された既製の UI コンポーネント。操作を駆動するボタンコンポーネントを含みます。プラットフォームの空間デザインに合致した、そのまま使えるウィジェットです。

**Interactable Helper** — インタラクションの応答を処理します。ボタン押下をそれが引き起こすアクションへとつなぎ、手作業のイベント配線なしに入力と挙動を結び付けます。Spectacles Interaction Kit（SIK）と併用できます。

**Access Components** — マテリアルや見た目のプロパティをスクリプトから制御します。たとえば押すたびにオブジェクトの色を切り替えます。シーンを入力に応じて動的に反応させるためのフックです。

**Marker Tracking** — 特定の画像を認識し、それを起点にコンテンツを表示します。デモでは、マーカーを検出するとアート作品の上にアニメーションキャラクターが重ねて現れます。ポスターやカード、作品で起動する AR の基盤です。

## 6 つを組み合わせて動かす

Watson 氏はこの 6 つを 1 つのギャラリーレンズに組み合わせています。シーンを面に設置し、ハンドヒントがピンチを示し、UI Kit のボタンが Access Components 経由でマテリアルを切り替え、Marker Tracking が認識した作品にアニメーションキャラクターを重ねます。デモプロジェクト一式は GitHub で公開されています。

▸ [github.com/badchickstudios/LSAssetDemo](https://github.com/badchickstudios/LSAssetDemo)

## 関連リンク

- [動画：6 Lens Studio Assets to Level Up Your Spectacles Projects](https://youtu.be/piNmt2kqih8) — Bad Chick Studios
- [GitHub のデモプロジェクト](https://github.com/badchickstudios/LSAssetDemo)
- [Lens Studio アセットライブラリ概要](https://developers.snap.com/lens-studio/assets-pipeline/asset-library/asset-library-overview)
- [Snap Spectacles と Lens Studio をはじめよう](/news/snap-spectacles-lens-studio-入門/) — ネイティブプラットフォーム スターターガイド
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

*コミュニティスポットライト — Lafiya Watson 氏（[Bad Chick Studios](https://badchickstudios.com/)）。アセットの選定とデモプロジェクトは同氏によるもので、本記事はそれを要約しリンクしています。* ご質問は[お問い合わせ](/contact/)ページからどうぞ。
