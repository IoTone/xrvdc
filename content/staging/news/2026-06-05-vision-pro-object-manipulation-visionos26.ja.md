---
title: "グラブ・回転・スケール — Swift で visionOS 26 のオブジェクト操作"
date: 2026-06-05T10:00:00+09:00
slug: "vision-pro-object-manipulation-visionos26-入門"
tag: "スターター"
summary: "visionOS 26 は RealityKit の上に高水準のインタラクション層を加えます。ManipulationComponent で、任意の 3D オブジェクトを数行で物理的にグラブ・回転・スケール可能にし、SwiftUI のパネルやジェスチャーをエンティティに直接貼り付けます——手の関節計算は不要です。"
---

[最初の Vision Pro ミックスドリアリティ解説](/news/vision-pro-mixed-reality-realitykit-arkit-入門/)では、配管にあたる部分——RealityKit のエンティティと ARKit の生のトラッキングプロバイダー——を扱いました。**visionOS 26**（WWDC 2025）は、その配管の*上*に高水準のインタラクション層を加え、たいていのアプリで手の関節計算を自分で書く必要をなくします。目玉は `ManipulationComponent`。任意のエンティティを物理的にグラブ・回転・スケール可能にし、両手操作や手から手への受け渡しまで、数行で実現します。ハッカソンチームが出せるものの中で、最も「おっ」と言わせやすく、最も手間の少ない機能の一つです。

## なんでもグラブ可能にする

機能のすべては 1 つの設定呼び出しです。

```swift
ManipulationComponent.configureEntity(
    subject,
    collisionShapes: [.generateBox(width: 0.25, height: 0.25, depth: 0.25)]
)
```

`configureEntity` は、エンティティをインタラクティブにするのに必要なものを自動で追加します——`InputTargetComponent`、`CollisionComponent`、`HoverEffectComponent`、そして `ManipulationComponent` 自身。その瞬間から、オブジェクトは自然なジェスチャーでグラブ・移動・回転・スケールでき、ホバー時にハイライトし、物理的にモデル化された離し際の慣性を持ちます。

SwiftUI 版はビューや `Model3D` に効きます。

```swift
Model3D(named: "Teapot")
    .manipulable(operations: [.translation, .primaryRotation, .secondaryRotation],
                 inertia: .high)
```

インタラクションに反応するには `ManipulationEvents` を購読します——`WillBegin`、`DidUpdateTransform`、`WillRelease`、`WillEnd`、`DidHandOff`——アプリの状態を駆動したり、つかんだ／離した瞬間に独自の効果音を差し込んだりできます。

## SwiftUI をエンティティに直接貼る

visionOS 26 は SwiftUI と RealityKit を統合し、UI を別の attachments クロージャではなくオブジェクト*の上*に置けるようにします。

- **`ViewAttachmentComponent`** — SwiftUI ビューをエンティティにインラインで貼る：`Entity(components: ViewAttachmentComponent(rootView: InfoCard()))`。
- **`GestureComponent`** — SwiftUI のジェスチャー（例：`TapGesture`）をエンティティに直接付与。
- **`PresentationComponent`** — シーン内のエンティティにアンカーした SwiftUI のポップオーバーやシートを提示。
- **オブザーバブルなエンティティ** — `entity.observable` がプロパティ（`.position` など）を SwiftUI の観測トラッキングに公開し、SwiftUI ↔ RealityKit の双方向データフローを実現。

統一**座標変換 API**（`CoordinateSpace3D`）は SwiftUI と RealityKit 空間の間で点を変換し、これまで手書きしていた計算を不要にします。良いハッカソンの目標：USDZ を読み込み、操作可能にし、タップジェスチャー付きの浮遊する SwiftUI 情報カードを貼る——ネイティブの感触を持つ、調べられる 3D 製品モデルや解剖モデルが、数時間で作れます。

## 補足

visionOS 26 の追加機能のうち、操作とよく合うものが 2 つあります。**環境オクルージョン**（静的な実物が仮想物を隠し、「部屋の中にある」感覚が格段に強まる）と、コード変更不要の **90Hz ハンドトラッキング**。また `content.animate { }` / `Entity.animate()` で、RealityKit のトランスフォームを SwiftUI のアニメーションカーブで駆動できます。

## 注意点

- **visionOS 26 / Xcode 26 限定。** `ManipulationComponent`、`.manipulable`、`ViewAttachmentComponent`、`GestureComponent`、`PresentationComponent`、オブザーバブルなエンティティは **visionOS 1.x/2.x には存在しません**——古いデプロイメントターゲットではコンパイルすら通りません。チームを動かす前に全員の Xcode と OS を確認してください。
- **実テストは実機限定。** 操作は本物の手入力で駆動され、シミュレーターはそれを与えられません（粗い仮想ハンドポーズのみ）。実機の Apple Vision Pro でデモしてください。ヘッドセットのないチームは実質的に作れません。
- **「数行」であって「ゼロ行」ではありません。** コード変更不要なのは空間*ウィジェット*の方。操作はわずかなコードですが、衝突形状・許可する操作・イベントハンドラの設定は要ります。グラブしても動かないときは、衝突形状がメッシュを覆っているか確認を——初期ベータでよくあるつまずきです。
- **手のデータは抽象化されます。** これは関節ごとの手データへの経路ではありません。生の関節が必要なチームは、[中核の RealityKit + ARKit 記事](/news/vision-pro-mixed-reality-realitykit-arkit-入門/)の `HandTrackingProvider` を使ってください。

## 関連リンク

- WWDC25 [Better together: SwiftUI and RealityKit](https://developer.apple.com/videos/play/wwdc2025/274/) — 上記すべての一次ソース
- WWDC25 [What's new in RealityKit](https://developer.apple.com/videos/play/wwdc2025/287/) ・ [What's new in visionOS 26](https://developer.apple.com/videos/play/wwdc2025/317/)
- [ManipulationComponent.configureEntity(...)](https://developer.apple.com/documentation/realitykit/manipulationcomponent/configureentity(_:hovereffect:allowedinputtypes:collisionshapes:)) — シグネチャと自動追加されるコンポーネント
- [What's new in visionOS](https://developer.apple.com/visionos/whats-new/) — 機能、Xcode 26 / visionOS 26 / Vision Pro の要件
- [はじめての Vision Pro ミックスドリアリティ](/news/vision-pro-mixed-reality-realitykit-arkit-入門/) — RealityKit + ARKit の基礎
- [visionOS の入口 — 30 日チャレンジ](/news/visionos-2-30日チャレンジ/) — プラットフォーム全体の概観
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
