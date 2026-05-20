---
title: "Android XR 入門 — 実機なしで今日から開発"
date: 2026-05-23T10:00:00+09:00
slug: "androidxr-入門"
tag: "スターター"
summary: "Android XR Developer Preview 4 はハードウェアに先行して API を提供中。エミュレータでローカルにビルド／テストする実践ガイド — グラス（API 34）と VR（API 36）の重要な使い分け、Jetpack XR の Gradle 依存をコピペで掲載。"
---

ネイティブプラットフォーム連載の今回は **Android XR**。コンシューマ向けハードは未だ広く出荷されていませんが、SDK は **Developer Preview 4** に到達し、エミュレータで今日から開発・テストできる程度には整っています。実用的なセットアップを示します。

▸ [Dev Preview 4 アナウンス](https://android-developers.googleblog.com/2026/05/android-xr-sdk-developer-preview-4-updates.html) ・ [developer.android.com/xr](https://developer.android.com/xr)

## まずフォームファクタを決める — API レベルが分かれる

Android XR は **一つのブランドの下にある二つのスタック** です。ターゲット API・Jetpack ライブラリ・エミュレータ AVD が変わるため、最初に選択してください：

| | Immersive — VR ヘッドセット／有線 XR グラス | Augmented — オーディオ／ディスプレイグラス |
|---|---|---|
| Target API | **36** | **34** |
| UI ツールキット | Compose for XR + SceneCore | Compose Glimmer + Projected |
| 空間認識 | ARCore for Jetpack XR | ARCore for Jetpack XR（限定的） |
| 用途 | 没入シーン、空間 UI、glTF コンテンツ | 通知チップ、ステータスパネル、音声 HUD |

`androidx.xr.runtime` と ARCore は共通ですが、UI／ランタイムスタックは分岐します。**1 つの Gradle モジュールで両方を兼ねようとしないこと**。ハッカソンで狙うフォームファクタを選び、そのターゲット API に合わせて設定します。

## ローカルセットアップ（ヘッドセット不要）

**1 ・ Canary 版 Android Studio。** **最新の [Android Studio Canary](https://developer.android.com/studio/preview)** を使用。XR API はまず Canary に着地し、Stable は追従が遅れます。

**2 ・ XR システムイメージのインストールと AVD 作成。** SDK Manager から Android XR システムイメージをインストールし、フォームファクタに応じた公式ガイドに従って AVD を作成します：
- [XR ヘッドセット & XR グラス用 AVD](https://developer.android.com/develop/xr/jetpack-xr-sdk/run/create-avds/xr-headsets-glasses)
- [オーディオ／ディスプレイグラス用 AVD](https://developer.android.com/develop/xr/jetpack-xr-sdk/run/create-avds/glasses)

**3 ・ SDK レベルを設定。** [Jetpack XR SDK セットアップ](https://developer.android.com/develop/xr/jetpack-xr-sdk/set-up-sdk) より：

```kotlin
android {
  compileSdk = 36          // 34 以上が必須。VR／immersive には 36 を推奨
  defaultConfig {
    minSdk = 24
    targetSdk = 36         // グラスプロジェクトは 34 を使用
  }
}
```

**4 ・ 適切な Jetpack XR 依存を追加。**

**Immersive（VR ヘッドセット／XR グラス、targetSdk 36）：**

```kotlin
dependencies {
  implementation("androidx.xr.runtime:runtime:1.0.0-alpha14")
  implementation("androidx.xr.scenecore:scenecore:1.0.0-alpha15")
  implementation("androidx.xr.compose:compose:1.0.0-alpha14")
  implementation("androidx.xr.compose.material3:material3:1.0.0-alpha17")
  implementation("androidx.xr.arcore:arcore:1.0.0-alpha14")
  // コード難読化サポート（Jetpack XR alpha05+）— 必ず compileOnly：
  compileOnly("com.android.extensions.xr:extensions-xr:1.3.0")
}
```

**Augmented（オーディオ／ディスプレイグラス、targetSdk 34）：**

```kotlin
dependencies {
  implementation("androidx.xr.runtime:runtime:1.0.0-alpha14")
  implementation("androidx.xr.glimmer:glimmer:1.0.0-alpha12")
  implementation("androidx.xr.glimmer:glimmer-google-fonts:1.0.0-alpha12")
  implementation("androidx.xr.projected:projected:1.0.0-alpha07")
  implementation("androidx.xr.arcore:arcore:1.0.0-alpha13")
}
```

> 公式ドキュメント注記：より新しい Jetpack ライブラリがあっても、これらのバージョンを固定してください — 整合の取れたセットです。

**5 ・ サンプルを動かす。** ゼロから始めず、公式サンプルを開いて改造するのが速いです：
- [Android XR samples](https://developer.android.com/develop/xr/samples)
- [Android XR experiments](https://developer.android.com/develop/xr/experiments)

## Dev Preview 4 の主な新機能

- **XR Runtime、SceneCore、ARCore perception → Beta**（immersive 向け）。
- **Compose for XR で glTF をネイティブサポート** — `SpatialGltfModel` / `SpatialGltfModelState` により、3D モデルを Compose シーンに直接配置可能。
- **`GltfModelNode`** によりランタイムでモデルを調整（姿勢・マテリアル・テクスチャ・アニメーション）。**Custom Meshes（実験的）** でプログラム生成ジオメトリ。
- **Geospatial API プレビュー**（有線 XR グラス向け）— 87 カ国以上で現実世界への高精度アンカリング（[Ray-Ban 向け MultiSet VPS](/ja/news/multiset-vps-meta-glasses-入門/) と方向性が近い）。
- **Device Availability API**（Jetpack Projected）— 装着／接続状態を標準の `Lifecycle.State` で扱え、`ProjectedTestRule` で自動テスト可能。

## その他のエンジンルート

Jetpack／Kotlin でなければ、Android XR は Unity（Android XR Interaction Framework、AXRIF）、Unreal、Godot、OpenXR にも対応します — [Android XR Engine Hub](https://developer.android.com/xr) から各エンジンの手順をたどってください。（一次対応の WebXR／Chrome は現時点でなし — WebXR で今すぐ作るなら、[A-Frame の記事](/ja/news/aframe-webxr-入門/) が Quest 3・Vision Pro・Spectacles をカバーします。）

## ハッカソン向けの注意

- **ハードウェア：** コンシューマ向け Android XR デバイスはまだ広く出荷されていません。プレリリース実機は公式の [Android XR Developer Catalyst プログラム](https://g.co/dev/catalyst) から。
- **プレビュー段階：** API はアルファで変化します。依存バージョンを固定し、後のプレビューに簡単にリビルドできない範囲のものは出さないこと。
- **1 プロジェクト = 1 フォームファクタ** に絞り、AVD・依存・ターゲット API を一貫させましょう。

## 関連リンク

- [developer.android.com/xr](https://developer.android.com/xr) ・ [Jetpack XR SDK セットアップ](https://developer.android.com/develop/xr/jetpack-xr-sdk/set-up-sdk) ・ [サンプル](https://developer.android.com/develop/xr/samples)
- [Android Studio Canary](https://developer.android.com/studio/preview)
- [Dev Preview 4 ブログ](https://android-developers.googleblog.com/2026/05/android-xr-sdk-developer-preview-4-updates.html)
- 関連：[Snap Spectacles と Lens Studio](/ja/news/snap-spectacles-lens-studio-入門/) ・ [Meta Ray-Ban Display Web Apps](/ja/news/meta-wearables-webapp-sdk-入門/) ・ [visionOS の入り口](/ja/news/visionos-2-30日チャレンジ/) ・ [A-Frame / WebXR](/ja/news/aframe-webxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
