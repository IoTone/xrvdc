---
title: "はじめての Vision Pro ミックスドリアリティ — Swift で RealityKit と ARKit"
date: 2026-06-04T10:00:00+09:00
slug: "vision-pro-mixed-reality-realitykit-arkit-入門"
tag: "スターター"
summary: "Apple Vision Pro のミックスドリアリティへのネイティブな入口です。RealityKit で `.mixed` の ImmersiveSpace を作り、ARKit のハンドトラッキングとシーン再構成で仮想コンテンツを現実の部屋にアンカーします。シミュレーターではなく実機でしか動かない機能も率直に整理します。"
---

Apple Vision Pro のネイティブ開発は、Swift・[**RealityKit**](https://developer.apple.com/documentation/realitykit)・[**ARKit**](https://developer.apple.com/documentation/arkit/arkit-in-visionos) で行います。本記事は、空の Xcode プロジェクトから本物の**ミックスドリアリティ**シーン——部屋のカメラパススルーに仮想コンテンツを合成し、しかも*物理世界にアンカーする*——までを案内するスターターです。まず広く全体像を掴みたい方は、対となる [visionOS 30 日チャレンジの入口](/news/visionos-2-30日チャレンジ/)をどうぞ。本記事は中核となる RealityKit + ARKit のスタックを扱います。

## visionOS の「ミックスドリアリティ」とは

visionOS アプリはコンテンツを 2 か所のいずれかに表示します。**ウィンドウ**（他アプリと並ぶ共有スペース）か、**`ImmersiveSpace`**（自分のアプリが空間を占有）です。ミックスドリアリティは `.mixed` のイマージョンスタイルで開いた没入空間に存在します。

```swift
.immersionStyle(selection: $style, in: .mixed)
```

`.mixed` は仮想コンテンツを現実のパススルー映像の上に合成します。簡単なのは、その中に 3D モデルを置くこと。これを*ミックスドリアリティ*たらしめる本当の学びは、コンテンツを**現実の部屋を認識させ、アンカーする**こと——実機のテーブルに置く、実際の壁で隠す、本物の手に反応させる——です。その認識を与えるのが ARKit です。

## 考え方：RealityKit はエンティティとコンポーネント

RealityKit は**エンティティ・コンポーネント・システム**です。シーンは `Entity` の木構造で、振る舞いはコンポーネントとして付与します——`ModelComponent`（メッシュ）、`Transform`（位置・回転・スケール）、`CollisionComponent`、`InputTargetComponent`（タップ可能にする）など。表示は SwiftUI の `RealityView` で行います。

```swift
RealityView { content in
    let model = try? await Entity(named: "Globe", in: realityKitContentBundle)
    if let model { content.add(model) }
}
```

標準のオーサリングツール **Reality Composer Pro** は Xcode に同梱されています。USD シーン、マテリアル（Shader Graph）、パーティクルを編集し、コードが名前で読み込む Swift パッケージ（`RealityKitContent`）にコンパイルします——上の例のとおりです。

## テンプレートから始める

Xcode の **File → New → Project → visionOS → App** が一式を生成します。ウィンドウ（`ContentView`）、`RealityView` を含む `ImmersiveView`、没入空間を開くトグル、リンク済みの `RealityKitContent` パッケージ。これが事実上の「Hello World」です。シミュレーターで実行すれば、没入シーンを開くウィンドウがもう手元にあります。

## ARKit で現実世界にアンカーする

visionOS の ARKit は iOS の ARKit と**別物**です。`ARView` も `ARSession` も `ARConfiguration` もありません。代わりに [`ARKitSession`](https://developer.apple.com/documentation/arkit/arkit-in-visionos) を作り、**データプロバイダー**を走らせます。

- `WorldTrackingProvider` — デバイス姿勢とワールドアンカー
- `HandTrackingProvider` — 片手あたり最大約 27 関節をワールド座標で
- `SceneReconstructionProvider` — 部屋のライブメッシュ（`MeshAnchor`）。仮想物体が実面と衝突できる
- `PlaneDetectionProvider` — 床・壁・テーブル
- `ImageTrackingProvider`・`ObjectTrackingProvider`・`RoomTrackingProvider`

最小限のハンドトラッキングのループ：

```swift
let session = ARKitSession()
let handTracking = HandTrackingProvider()

try await session.run([handTracking])

for await update in handTracking.anchorUpdates {
    let hand = update.anchor
    // hand.handSkeleton の関節位置にエンティティを置く／触れる
}
```

忘れがちですが必須の設定が 2 つあります。

1. **認可。** visionOS の ARKit 認可は 2 種類——`worldSensing`（ワールドトラッキング、シーン再構成、平面・画像・オブジェクトトラッキング）と `handTracking`。セッションで要求します。
2. **Info.plist の用途文字列**——`NSWorldSensingUsageDescription` と `NSHandTrackingUsageDescription`。これがないとプロバイダーは何も返しません。

週末の良い目標：`.mixed` の没入空間を開き、RealityKit のエンティティを置き、**シーン再構成**で実機のテーブルに載せる、あるいは**ハンドトラッキング**でピンチして配置させる。これは浮いたモデルではなく、本物のミックスドリアリティのインタラクションです。

## visionOS 26 の新機能

visionOS 26（WWDC 2025）は、このスタックの上に高水準の便利機能を重ねます——グラブ／回転／スケールの `ManipulationComponent`、実物が仮想物を隠す環境オクルージョン、90Hz のハンドトラッキング、SwiftUI・RealityKit・ARKit 間の統一座標変換 API。これらは別途じっくり扱う価値があります——次の記事、[visionOS 26 のオブジェクト操作でグラブ・回転・スケール](/news/vision-pro-object-manipulation-visionos26-入門/)をご覧ください。上記の基礎が、その土台になります。

## 注意点

- **シミュレーターはミックスドリアリティの核を動かせません。** visionOS シミュレーターには**パススルーカメラがなく**、ハンドトラッキングは使えず、`PlaneDetectionProvider` / `SceneReconstructionProvider` は非対応（エラーになります）。SwiftUI のレイアウト、ウィンドウ、RealityKit コンテンツのプレビューには十分ですが、実機の部屋にアンカーする本物の MR は**実機限定**です。これはネット上で最も誤解されている点です。
- **有料ハードウェアが必要**です——MR の出荷とテストには、実機の Apple Vision Pro、Xcode を動かす Mac、実機インストール用の Apple Developer アカウント。
- **ARKit データは `ImmersiveSpace` の中**で、自分のアプリがフォーカスにあるときだけ流れます——ウィンドウや共有スペースでは流れません。普通のウィンドウアプリで手やシーンのデータが空になり、初心者がよく戸惑います。
- **iOS の ARKit コードをそのまま移植しないこと。** プロバイダーモデルは API の形が異なり、iOS の `ARSession` のサンプルは移りません。
- **機能のバージョンに注意。** ハンド／ワールドトラッキング、シーン再構成、平面・画像トラッキングは visionOS 1.0 以降。オブジェクトトラッキングとルームトラッキングは **visionOS 2.0 以降**。`ManipulationComponent` 系は **visionOS 26 以降**です。
- **エンタープライズ限定 API はハッカソンの対象外。** メインカメラアクセスや生のカメラフレーム（`CameraFrameProvider`）には Apple 承認のエンタープライズエンタイトルメントが要ります。標準のハンド／ワールド／シーン／平面／画像／オブジェクトの各プロバイダーはゲートされておらず、初心者に適した範囲です。

## 関連リンク

- [ARKit in visionOS](https://developer.apple.com/documentation/arkit/arkit-in-visionos) ・ [ARKit データへのアクセス設定](https://developer.apple.com/documentation/visionos/setting-up-access-to-arkit-data)
- [ARKit アプリを visionOS へ](https://developer.apple.com/documentation/visionos/bringing-your-arkit-app-to-visionos/) — iOS との違い
- [RealityKit](https://developer.apple.com/documentation/realitykit) ・ [visionOS — Get started](https://developer.apple.com/visionos/get-started/)
- WWDC23 [Develop your first immersive app](https://developer.apple.com/videos/play/wwdc2023/10203/) ・ [Meet ARKit for spatial computing](https://developer.apple.com/videos/play/wwdc2023/10082/)
- [visionOS 26 のオブジェクト操作でグラブ・回転・スケール](/news/vision-pro-object-manipulation-visionos26-入門/) — 次の一歩
- [visionOS の入口 — 30 日チャレンジ](/news/visionos-2-30日チャレンジ/) — プラットフォーム全体の概観
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
