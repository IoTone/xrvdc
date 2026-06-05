---
title: "Unity で Vision Pro のミックスドリアリティ — PolySpatial 入門"
date: 2026-06-06T10:00:00+09:00
slug: "vision-pro-mixed-reality-unity-polyspatial-入門"
tag: "スターター"
summary: "Swift なしで Apple Vision Pro のパススルー型ミックスドリアリティを Unity で作ります。PolySpatial と visionOS XR プラグインを使い、まず最初に決めるのはアプリのモード。本記事は 4 つのモードと、チームがよく間違える 2 点——Unity Pro ライセンスの壁と Shader Graph / MaterialX の制約——を解説します。"
---

Swift ではなく Unity で開発するチームにとって、Apple Vision Pro のミックスドリアリティは [**Unity PolySpatial**](https://docs.unity3d.com/Manual/visionOS.html) と visionOS XR プラグインを通る道になります。RealityKit を一行も書かずに、実機のテーブルに仮想物体を——パススルーごと——置けます。注意点は、初日の決断が「どの**アプリモード**を狙うか」だということ。その一択でパッケージ、ライセンス階層、レンダリング経路が固定されます。本記事はその決断を肩代わりするスターターです。

## 肝心な考え方：Unity でシミュレートし、RealityKit で描画する

ミックスドリアリティでは、**Unity はフレームを描画しません**。シーンをシミュレートし、コマンドを visionOS のシステムレンダラー RealityKit に送り、RealityKit がパススルーの上に描きます。この 1 点が、以下のほぼすべての制約の根です——カスタムシェーダーやスクリーンスペース効果がそのまま移らない理由でもあります。

## アプリモードを選ぶ

1. **ウィンドウ** — 共有スペースで他アプリと並ぶ 2D/3D。PolySpatial 不要、Pro ライセンス不要。
2. **境界あり（Bounded）ボリューム（MR）** — 他アプリと共存する固定の箱の中に RealityKit 描画の 3D。
3. **境界なし（Unbounded）ボリューム（MR）** — **パススルー**と完全な ARKit アクセス（平面、メッシュ、手、画像）を伴う RealityKit。これがミックスドリアリティの狙い目です。
4. **完全没入（VR）** — Unity が **Metal** コンポジターサーフェスで直接描画。既定ではパススルーなし。

**ハイブリッド**アプリは実行時に RealityKit ⇄ Metal を切り替えられますが、Metal カメラと Unbounded の RealityKit カメラを**同時にアクティブにはできません**。（Metal モードでパススルーを得るには `ImmersionStyle = Mixed`、カメラの `Clear Flags = Solid Color`、その色の**アルファ = 0** にします。）

MR のハッカソンビルドなら、答えはほぼ常に **Unbounded ボリューム**です。

## パッケージと入力

MR には 3 つのパッケージが要ります——`com.unity.xr.visionos`、`com.unity.polyspatial.visionos`、`com.unity.polyspatial.xr`。（VR のみなら最初の 1 つだけ。）iOS の `com.unity.xr.arkit` パッケージは**使いません**。ARKit 機能は visionOS XR プラグインと **AR Foundation** 経由で来ます——平面検出、シーン再構成メッシュ、画像トラッキング、（XR Hands による）ハンドトラッキング。

コントローラーはありません。インタラクションは**視線＋ピンチ**（「インダイレクトピンチ」）と、腕の届く範囲での直接のつつき・ピンチで、新 Input System の `SpatialPointerDevice` から取得します。3D タッチを受けるにはオブジェクトに **PolySpatial Input** レイヤーのコライダーが必要です。XR Interaction Toolkit は `XRSpatialPointerInteractor` 経由で動きます。

## 注意点

- **MR・VR アプリは Unity Pro / Enterprise / Industry が必要。** これは実在し、いまも有効です。**Unity Personal/Free のチームはパススルー型 MR アプリを出荷できません。** 唯一の無料経路は **Student または Educator** プラン——2025 年 1 月以降、Student ライセンスは visionOS 向けに Pro 相当のエディタアクセスを自動で得ます。イベント前に全員のライセンスを確認してください。これが実務上いちばんのつまずきです。
- **任意のカスタムシェーダーは持ち込めません。** MR モードで ShaderLab/HLSL は非対応。**Shader Graph** で書き、これが **MaterialX** に変換されます——しかも MaterialX 対応のノードは*一部*のみ（非対応ノードはエディタで `#` 印が付きます）。グラブパス、カスタムレンダーパス、ポストプロセスに依存する効果は概して RealityKit に移りません。「自分の Unity シェーダーはそのまま動く」は最もよくある誤解です。
- **シミュレーターは面白い MR 部分を動かせません。** 平面検出、シーンメッシュ、画像トラッキング、本物の手／ワールドデータは**実機**が要ります。チームあたり最低 1 台の Vision Pro、または共有スケジュールを見込んでください。
- **MR と完全没入は本当のトレードオフ。** RealityKit の MR はパススルーと ARKit 機能を与える代わりに、Unity レンダリングの*変換された一部*。Metal/VR は Unity の描画力をフルに使える代わりに、ネイティブのパススルーの手軽さを失います。ハイブリッドは橋渡ししますが、同時にはできません。
- **UV／マテリアルの細部に注意。** RealityKit の MaterialX は最初の 2 つの UV チャンネルしか使わず、visionOS のマテリアルはグローバルシェーダープロパティをネイティブに持ちません（PolySpatial がインスタンスごとにパッチします——性能上の考慮点）。
- **ハードウェアコスト／バージョンの流動性。** Apple Vision Pro は約 3,499 米ドルで、入手も容易ではありません。PolySpatial の更新は速く（約 2 年で 0.x → 3.x）、パッケージと Unity LTS のバージョンを固定し（現行は Unity 6.x LTS。Apple Silicon Mac、Xcode 16 以上、visionOS 2.0 SDK 以上、Linear カラースペース、URP 推奨）、古いチュートリアルの正確なメニュー操作を鵜呑みにしないでください。

## 関連リンク

- [Unity マニュアル — visionOS](https://docs.unity3d.com/Manual/visionOS.html) — アプリ種別、ライセンスの壁、パッケージ
- [PolySpatial visionOS — Getting started](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@3.1/manual/GettingStarted.html) ・ [Requirements](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@2.4/manual/Requirements.html)
- [ハイブリッドアプリ — bounded/unbounded/Metal とパススルー](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@2.4/manual/PolySpatialHybridApps.html)
- [Shader Graph → MaterialX の制約](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@1.0/manual/ShaderGraph.html) ・ [入力 / 空間ポインター](https://docs.unity3d.com/Packages/com.unity.polyspatial.visionos@1.1/manual/Input.html)
- [Unity Learn — Developing for visionOS](https://learn.unity.com/tutorial/developing-for-vision-os-with-unity) — 実践チュートリアル
- [Image-blaster → エンジン → ヘッドセット](/news/image-blaster-xr-パイプライン/) — AI 生成ワールドの Unity/Unreal/Godot 配信ルート
- [はじめての Vision Pro ミックスドリアリティ](/news/vision-pro-mixed-reality-realitykit-arkit-入門/) — ネイティブ Swift の代替路
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
