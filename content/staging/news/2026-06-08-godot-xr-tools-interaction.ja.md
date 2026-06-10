---
title: "グラブ・テレポート・ポインター — Godot XR Tools で VR インタラクション"
date: 2026-06-08T10:00:00+09:00
slug: "godot-xr-tools-入門"
tag: "スターター"
summary: "Godot の OpenXR セットアップでヘッドセットに描画はできても、シーンは動きません。Godot XR Tools はその足りない半分——グラブ、テレポート、移動、ポインター UI——を、自分で書くスクリプトではなく、配置するプレハブシーンとして埋めるコミュニティ製ツールキットです。"
---

[Godot OpenXR スターター](/news/godot-xr-quest-3-入門/)は、6 ノードのリグで Meta Quest 3 にステレオ表示を出します——が、その時点でシーンは動きません。グラブできるコントローラーも、移動手段も、ポイントできる UI もない。**Godot XR Tools** がその穴を埋めます。ピックアップ、テレポート、移動、レーザーポインター、3D 内 2D UI——これらをプレハブシーンとしてリグに配置し、インタラクションのコードを手書きする代わりにします。本記事は OpenXR 記事の「次は動かす」続編です。

▸ [github.com/GodotVR/godot-xr-tools](https://github.com/GodotVR/godot-xr-tools) · [ドキュメント](https://godotvr.github.io/godot-xr-tools/) · MIT

## 何であって、何でないか

Godot XR Tools は Godot XR チーム（Bastiaan Olij、Malcolm Nixon ／ GodotVR org）が保守する**コミュニティアドオン**です。エンジン**内蔵ではなく**、Asset Library か GitHub リリースから導入します。そして**フレームワークではなくスキャフォールド**——すぐ動き出すための既製シーンとクラスの集まりであって、完成したインタラクションシステムではありません。グルーコードは結局書くことになります。

先にバージョンの注意を一つ。これがチームをつまずかせます。最新のタグ付き安定版は **4.5.1** で、明記された最小要件は **Godot 4.4**。4.6 専用のタグはまだありません——が、公式の [`godot-xr-template`](https://github.com/GodotVR/godot-xr-template) は XR Tools 4.5.1 を Godot 4.6 上で動かし、Quest エクスポートまで設定済みで出荷しています。摩擦の最も少ない出発点が欲しいなら、ゼロから組むよりこのテンプレートをクローンしてください。

## 導入

Godot 4.6 で **AssetLib** タブを開き、「Godot XR Tools for Godot 4」（アセット 1698）を検索・ダウンロードし、`addons/godot-xr-tools` フォルダをインポート。または [`godot-xr-template`](https://github.com/GodotVR/godot-xr-template) を取得すれば、ツールキット、OpenXR ベンダープラグイン、Android/Quest エクスポートプリセットが揃っています。

## StartXR か手動初期化か——どちらか一方

ツールキットは `addons/godot-xr-tools/xr/start_xr.tscn` を同梱し、OpenXR（または WebXR）を自動で立ち上げます——[OpenXR 記事](/news/godot-xr-quest-3-入門/)が 5 行の `_ready()` で手動でやったのと同じ仕事です。**両方は走らせないこと**。さもないとランタイムを二重初期化します。あの記事から続けるなら、手動初期化をそのままに、以下のインタラクションシーンだけ足すのが最も低摩擦。新規なら `start_xr.tscn` とツールキットのステージングシステムを採用しましょう。

## 移動：プレイヤーボディと移動プロバイダー

`XROrigin3D` に**移動プロバイダー**を追加すると、ツールキットが物理と接地判定を担う `XRToolsPlayerBody` を自動追加します。最小構成は **Direct Movement**（スティック滑走）＋ **Turn**（スムーズかスナップ）。グライド、ジャンプ、クライム、フライト、グラップル、しゃがみ、風のプロバイダーも揃い、設計に応じて同じプレイヤーボディに重ねられます。

## グラブ：ピックアップ、グラブポイント、スナップゾーン

- 各 `XRController3D` の子として **`XRToolsFunctionPickup`** を追加。
- オブジェクトをつかめるようにするには、`objects/pickable.tscn` を継承したシーンを作るか、既存の `RigidBody3D` に `XRToolsPickable` スクリプトを付与。
- 任意で**グラブポイント**（カスタム手ポーズ付き）を足すと自然な握りにスナップし、**`XRToolsSnapZone`** はピックアブルを所定位置に保持します——ソケット、ホルスター、「鍵を鍵穴へ」パズルの土台です。

## テレポートとポインター UI

- **`function_teleport`** シーンを手のコントローラー下にインスタンス化し、アクション（トリガーまたはグリップ）に割り当ててアーク型テレポート移動に。
- UI には **`Viewport2Din3D`** ノードを追加し、ふつうの Godot 2D シーン——ボタン、スライダー、通常のコントロール配置——を割り当てます。コントローラーに **`XRToolsFunctionPointer`** を足せば、レーザーがその 2D ビューポートをマウスのように操作します。注意：標準ではポインターは主に `Viewport2Din3D` パネル向け。任意の 3D オブジェクトを指すには `StaticBody3D` ＋衝突形状と少しのコードが要ります。

手堅いハッカソンの的：Direct Movement ＋ Turn のプレイヤーリグ、ピックアブルのキューブ 1 つ、テレポートエリア、デモを開始するためにポイントする浮遊 `Viewport2Din3D` メニュー。これでネイティブの手触りの VR ループ一式が、半日で組めます。

## 注意点

- **バージョンを固定。** XR Tools のマイナー更新は、これまで常に最小 Godot バージョンを引き上げ、破壊的変更を伴ってきました（4.5.0 は下限を Godot 4.4 へ）。特定のツールキットのタグを特定の Godot パッチに固定し——テンプレートの Godot 4.6 ＋ XR Tools 4.5.1 の組み合わせが既知の良好ペア——イベント中に更新しないこと。
- **4.6 専用タグはまだない。** 4.5.1 安定版は Godot 4.6 より前で、README はいまも最小 4.4 と記載。4.6 で動きます（公式テンプレートが証明）が、「公式タグ付き」ではなく「テンプレートで検証済み」と捉えてください。イベント時に[リリースページ](https://github.com/GodotVR/godot-xr-tools/releases)を再確認を。
- **GDScript です。** インタラクションのロジックはすべて GDScript で、Quest 単体機のモバイルチップでは効いてきます。ツールキットはシェーダーを事前キャッシュしてヒッチを避けますが、重いインタラクションシーンはなおフレームを食います——実機でプロファイルを。
- **ハンドトラッキングは弱点。** XR Tools の機能は概ねコントローラー前提。OpenXR のハンドトラッキングをこれらに橋渡しするには別アドオン [`GodotXRHandPoseDetector`](https://github.com/Malcolmnixon/GodotXRHandPoseDetector) が要り、手トラッカーのデータを仮想コントローラーに変換します。ハンドトラッキングそのものが目的でない限り、コントローラーを既定に。
- **フレームワークではなくスキャフォールド。** グルーは書く前提で——ポインターが 3D オブジェクトに触れるには衝突体とコード、テレポートは起動の割り当て、ピックアブルはしばしば調整が要ります。ツールキットが消すのは定型作業であって、設計作業ではありません。

## 関連リンク

- [Godot XR Tools リポジトリ](https://github.com/GodotVR/godot-xr-tools) · [ドキュメント](https://godotvr.github.io/godot-xr-tools/) · [Asset Library (1698)](https://godotengine.org/asset-library/asset/1698)
- [godot-xr-template](https://github.com/GodotVR/godot-xr-template) — Godot 4.6 ＋ XR Tools 4.5.1 ＋ Quest エクスポート、クローンしてすぐ
- [Introducing XR Tools](https://docs.godotengine.org/en/stable/tutorials/xr/introducing_xr_tools.html) — 公式 Godot チュートリアル
- [GodotXRHandPoseDetector](https://github.com/Malcolmnixon/GodotXRHandPoseDetector) — ハンドトラッキングを XR Tools へ橋渡し
- 関連：[Godot OpenXR で Quest 3](/news/godot-xr-quest-3-入門/) — 本記事が土台にするセットアップ
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
