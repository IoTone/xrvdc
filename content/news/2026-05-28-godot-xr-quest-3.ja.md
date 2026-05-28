---
title: "Godot XR — Meta Quest 3 向け OpenXR を内蔵"
date: 2026-05-28T10:00:00+09:00
slug: "godot-xr-quest-3-入門"
tag: "スターター"
summary: "Godot 4.6 は OpenXR をコアインターフェースとして同梱 — サードパーティプラグイン不要。プロジェクト設定 2 つ、6 ノードのシーン、5 行の初期化スクリプトで、新規 Godot プロジェクトから Meta Quest 3 ビルドまで届きます。"
---

エンジンルート編の締めくくり。[Unity / Unreal 向け image-blaster](/ja/news/image-blaster-xr-パイプライン/) と [Android XR の Jetpack XR](/ja/news/androidxr-入門/) に続き、**Godot 4.6** は **OpenXR をエンジンに一次対応** で同梱したオープンソースルートです。プラグインマーケットも SDK ダウンロードも不要 — プロジェクト設定を 2 つオンにし、`XROrigin3D` リグを配置すれば、ヘッドセットが手の内に。

▸ [Godot XR セットアップガイド](https://docs.godotengine.org/en/stable/tutorials/xr/setting_up_xr.html) ・ [godotengine.org](https://godotengine.org/) ・ MIT

## セットアップチェックリスト

**エンジン：** Godot **4.6** 以降 — このリリースで OpenXR はコアインターフェース。別途プラグイン不要です。

**プロジェクト設定：**

| 設定 | 値 |
|---|---|
| `XR > OpenXR > Enabled` | ON |
| `XR > Shaders > Enabled` | ON |
| `Rendering > Rendering Driver` | Quest 3 スタンドアロンには **Compatibility**、PC テザリング VR には **Mobile** |

プロジェクトを保存し、レンダラ変更を反映するため **Save & Restart** でエディタを再起動します。

## 最小シーン

ハンドコントローラ付きのステレオビューを描画するのに 6 ノードで十分：

```
Main（Node3D ＋ スクリプト）
├── XROrigin3D
│   ├── XRCamera3D
│   ├── XRController3D（tracker="left_hand"）
│   └── XRController3D（tracker="right_hand"）
├── DirectionalLight3D
└── WorldEnvironment
```

## 初期化スクリプト

ルートの `Node3D` にアタッチします。OpenXR インターフェースを取得し、vsync を無効化（XR ランタイムが提示を駆動）、ビューポートを XR に渡します。

```gdscript
extends Node3D

var xr_interface: XRInterface

func _ready():
    xr_interface = XRServer.find_interface("OpenXR")
    if xr_interface and xr_interface.is_initialized():
        DisplayServer.window_set_vsync_mode(DisplayServer.VSYNC_DISABLED)
        get_viewport().use_xr = true
        # ヘッドセットのネイティブリフレッシュレートに合わせる。Quest 3 は既定 90Hz。
        # デバイスプロファイルにより 72 / 80 / 120 も有効。
        Engine.physics_ticks_per_second = 90
```

エディタで実行してテザリングヘッドセットで検証。Quest 3 スタンドアロンには Android ビルドが必要です。

## Quest 3 へのデプロイ（Android エクスポート）

[Deploying to Android](https://docs.godotengine.org/en/stable/tutorials/xr/deploying_to_android.html) ガイドに従います。経路概要：

1. エディタから **Android Build Template** をインストール（Project → Install Android Build Template）。
2. Android Studio ＋ Android SDK をインストールし、Godot の Editor Settings で SDK パスを設定（`export/android/android_sdk_path`）。
3. **Android エクスポートプリセット** を追加し、Min SDK 29、Target SDK 34 を設定。Meta Horizon OS 向けに OpenXR メタプラグインを有効化。
4. ヘッドセットを USB 接続（開発者モード ＋ adb 認証済み）し、**One-click deploy** を実行。

初回ビルドは数分。以降のリビルドは差分のみ。

## シリーズ内での位置付け

| ルート | エンジン／ランタイム | ターゲット |
|---|---|---|
| A-Frame ／ Babylon ／ IWSDK | ブラウザ ＋ WebXR | Quest 3（ブラウザ）、Vision Pro（Safari）、Spectacles（Browser Lens） |
| [Android XR](/ja/news/androidxr-入門/) | Jetpack XR | Android XR ヘッドセット ＆ グラス |
| [WebSpatial](/ja/news/webspatial-sdk-visionos-入門/) | React ＋ Web 標準 → ネイティブ | visionOS / Apple Vision Pro |
| [ViroReact](/ja/news/reactvision-react-native-ar-入門/) | React Native ＋ ネイティブ AR | iOS、Android、Meta Horizon OS |
| **Godot 4.6 ＋ OpenXR** | **ネイティブエンジン、GDScript ／ C#** | **Meta Quest 3（スタンドアロン）、OpenXR ランタイム経由の PC VR** |

物理・レンダリング・シーンツール・アニメーションといったエンジン深度が必要で、Unity や Unreal のライセンス条件やメモリフットプリントを避けたいチームに向きます。

## Apple Vision Pro：Godot のターゲット外

最初に明示しておく必要があります。**AVP は OpenXR を公開しておらず**、Godot の OpenXR ルートは届きません。Godot 財団は別途ネイティブの Apple プラットフォーム対応を検討中です。AVP の現実的なルートは：

- [WebSpatial SDK](/ja/news/webspatial-sdk-visionos-入門/) — React → ネイティブ visionOS アプリ
- Unity PolySpatial — C# エンジンによるネイティブ visionOS
- visionOS の Safari による WebXR — [A-Frame 記事](/ja/news/aframe-webxr-入門/) と [Babylon.js 記事](/ja/news/babylonjs-webxr-入門/) で扱っています

## 計画上の注意点

- **アプリあたり主 OpenXR インターフェースは 1 つ** — エンジンは同時に 1 つの XR ランタイムのみ受け付けます。
- **一部ポストエフェクトにステレオ非対応の隙間** — 採用前に各ポストプロセスが右目で正しく描画されることを確認。
- **サイレント初期化失敗** — ランタイム未インストールやヘッドセット未接続時に `is_initialized()` が false を返します。ログを出力してユーザーに通知し、2D シーンを誤って「VR」体験として表示しないように。
- **vsync OFF ＋ 物理 90+** — vsync オンや物理 60Hz のままだとヘッドセットで視認可能なマイクロスタッターが出ます。デバイスのリフレッシュレートに合わせます。

## 関連リンク

- [Godot XR セットアップ](https://docs.godotengine.org/en/stable/tutorials/xr/setting_up_xr.html) ・ [OpenXR 設定リファレンス](https://docs.godotengine.org/en/stable/tutorials/xr/openxr_settings.html) ・ [Deploying to Android](https://docs.godotengine.org/en/stable/tutorials/xr/deploying_to_android.html)
- [Godot XR 機能一覧](https://docs.godotengine.org/en/stable/about/list_of_features.html#xr-support)
- 関連：[Android XR](/ja/news/androidxr-入門/) ・ [WebSpatial（AVP）](/ja/news/webspatial-sdk-visionos-入門/) ・ [A-Frame WebXR](/ja/news/aframe-webxr-入門/) ・ [ViroReact（RN AR）](/ja/news/reactvision-react-native-ar-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
