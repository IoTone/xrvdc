---
title: "Godot XR を URL で配る — WebXR エクスポート"
date: 2026-06-09T10:00:00+09:00
slug: "godot-webxr-入門"
tag: "スターター"
summary: "ネイティブの Quest ビルドはサイドロードと開発者モードが要ります。Godot の WebXR エクスポートはどちらも不要——審査員はヘッドセットのブラウザでリンクを開くだけ。同じプロジェクト、別の XR インターフェイス、そして全員がはまるホスティングの落とし穴が一つ。Vision Pro の Safari にも届きます（VR のみ）。"
---

[ネイティブ OpenXR ビルド](/news/godot-xr-quest-3-入門/)は高性能な Godot XR の道ですが、配布には APK、開発者モード、USB ケーブルが要ります。**WebXR エクスポート**は逆の取引です。インストールなし、ストアなし、サイドロードなし——プロジェクトをホストし、人々はヘッドセットのブラウザで **URL** を開く。審査員や仲間が数秒であなたのビルドを試す必要があるハッカソンのデモでは、この到達性こそが要点です。裏側の代償は実在します：性能は低く、入力は貧弱で、初めての人を必ず捕まえるホスティングヘッダーの要件があります。

▸ [WebXRInterface リファレンス](https://docs.godotengine.org/en/stable/classes/class_webxrinterface.html) · [Web 向けエクスポート](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)

## OpenXR とは別のインターフェイス

WebXR は OpenXR では**ありません**。OpenXR では OS／プラットフォームのランタイムがヘッドセットを駆動します。WebXR では **ブラウザ**が WebXR Device API 経由で XR ランタイムになります——だから初期化するのは別のインターフェイス `WebXRInterface` で、土台のブラウザ API が非同期なため、シグナル駆動です。Godot のドキュメントには OpenXR のような専用 WebXR チュートリアルページはなく、正典の手順は [`WebXRInterface` クラスリファレンス](https://docs.godotengine.org/en/stable/classes/class_webxrinterface.html)と [Web エクスポート](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)ページにあります。

## 先に押さえる 2 つの硬い制約

**レンダラー：Compatibility のみ。** Godot 4.6 のエクスポートドキュメントによれば、Web は Compatibility レンダリング方式で WebGL 2.0 を対象にします——Forward+ と Mobile は Web で動かず、WebGPU はまだ使えません。エクスポート前にプロジェクトを **Compatibility** レンダラーに設定を。

**ホスティング：HTTPS、スレッドを使うならヘッダーも。** WebXR はセキュアコンテキストに限定された強力なブラウザ機能なので **HTTPS が必須**（テスト時の localhost は例外）。さらに Godot のスレッド付き Web ビルドは `SharedArrayBuffer` を使い、`index.html` を提供するオリジンに 2 つのクロスオリジン分離ヘッダーを要求します：

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

ハッカソンで最も簡単な道は**シングルスレッドでエクスポート**すること（Godot 4.3 で復活）——`SharedArrayBuffer` なし、特別なヘッダーなし、HTTPS だけ。多少の性能余裕と引き換えに、itch.io や任意の静的ホストに置けます。ヘッダーを制御できるなら（あるいはサービスワーカーが注入する Godot の PWA エクスポート、コミュニティ製 `godot-coi-serviceworker` を使えば）、スレッド付きビルドの方が性能は出ます。

## 初期化コード

WebXR のセットアップはシグナル駆動で、没入セッションは**ユーザージェスチャーから開始**しなければなりません——ブラウザはボタン押下の外での `initialize()` を阻みます。形は次のとおり：

```gdscript
var webxr_interface

func _ready():
    webxr_interface = XRServer.find_interface("WebXR")
    if webxr_interface:
        webxr_interface.session_supported.connect(_on_supported)
        webxr_interface.session_started.connect(_on_started)
        webxr_interface.session_ended.connect(_on_ended)
        webxr_interface.is_session_supported("immersive-vr")  # 非同期 → session_supported を発火

# ボタン押下（必須のユーザージェスチャー）からのみ呼ぶ：
func _on_enter_vr_pressed():
    webxr_interface.session_mode = "immersive-vr"
    webxr_interface.requested_reference_space_types = "bounded-floor, local-floor, local"
    webxr_interface.required_features = "local-floor"
    webxr_interface.optional_features = "bounded-floor, hand-tracking"
    if not webxr_interface.initialize():
        return  # 失敗処理

func _on_started():
    get_viewport().use_xr = true
```

検索は `XRServer.find_interface("WebXR")`——ネイティブ記事の `"OpenXR"` 検索とは別です。ビルド手順：**Web エクスポートテンプレート**を導入（Manage Export Templates）、**Web** プリセットを追加、上記トレードオフに従って Thread Support を設定、エクスポート、そして HTTPS で提供。ローカル反復にはエディタの **Run in Browser** がローカルサーバーを立てます（localhost は HTTPS 例外なので、シングルスレッドビルドは問題なくテストできます）。

## どこで動くか

- **Meta Quest 3 ブラウザ** — 完全な WebXR、90Hz、コントローラーと手。第一の、信頼できる対象。（Wolvic も堅実な代替ブラウザ。）
- **Apple Vision Pro の Safari** — **visionOS 2 以降、既定で** `immersive-vr` をサポート（フラグ不要）。これは注目点：[ネイティブの Godot OpenXR の道は AVP に全く届かない](/news/godot-xr-quest-3-入門/)のに、**WebXR は届きます**——完全没入の VR として。難点：WebXR の **AR モジュール（`immersive-ar`）は visionOS で機能しない**ため、パススルーはなく、不透明な VR のみ。AVP の主入力はアイゲイズ＋ピンチ（`select` イベントとして届く）でコントローラーではありません——その経路を明示的にテストを。
- **Android XR ／ Samsung Galaxy XR** — Chrome が完全な WebXR を出荷。台頭する第三の対象。
- **デスクトップブラウザ**＋テザー接続ヘッドセット — 開発に有用。

## 注意点

- **ヘッダーの落とし穴が最もよく人を止めます。** COOP/COEP なしに HTTPS で提供されたスレッド付きビルドは、`SharedArrayBuffer is not defined` か白画面で失敗します。ヘッダーを制御できない限り、ハッカソンではシングルスレッド＋HTTPS で。
- **性能はネイティブより大きく劣ります。** WebGL 2.0、Compatibility レンダラー、（シングルスレッドでは）ワーカースレッドなし——ネイティブ Quest ビルドに対して厳しく見積もりを。
- **入力は OpenXR より貧弱。** WebXR は入力ソースをマップしますが、OpenXR の完全なアクションマップ抽象を欠きます。ボタン／軸の精度はブラウザがデバイスごとに何を公開するか次第。
- **大半のブラウザ構成でパススルー／AR はなし**、AVP も含めて——不透明な VR を前提に。
- **ネイティブより実戦経験が浅い。** Godot の WebXR インターフェイスは実在し保守もされていますが、ネイティブ OpenXR の道の方が成熟し高性能。WebXR は到達性と手軽さの一手であって、出荷タイトル向けではありません。
- **イベント時に二点を確認。** WebXR がスレッド付きビルドを厳密に要するかは未文書化（シングルスレッドで動き、スレッドは性能を上げるだけ——硬い要件と決めつけない）で、AVP の `immersive-ar` フラグの状態は visionOS のビルド間で変わり得ます。実際にデモする端末／OS で確認を。

## 関連リンク

- [WebXRInterface リファレンス](https://docs.godotengine.org/en/stable/classes/class_webxrinterface.html) — 正典の初期化手順、シグナル、ジェスチャー要件
- [Web 向けエクスポート](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) — レンダラー制約、スレッド、正確な COOP/COEP ヘッダー
- [Web export in 4.3](https://godotengine.org/article/progress-report-web-export-in-4-3/) — シングルスレッドモードとヘッダーのトレードオフ
- [godot-coi-serviceworker](https://github.com/nisovin/godot-coi-serviceworker) — 静的ホストで分離ヘッダーを注入
- 関連：[Godot OpenXR で Quest 3](/news/godot-xr-quest-3-入門/) · [Godot XR Tools インタラクション](/news/godot-xr-tools-入門/) · [A-Frame WebXR](/news/aframe-webxr-入門/) · [Babylon.js WebXR](/news/babylonjs-webxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
