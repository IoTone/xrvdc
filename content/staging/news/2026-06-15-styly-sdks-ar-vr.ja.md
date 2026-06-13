---
title: "AR と VR のための STYLY SDK 総覧 — ツールチェーン全体図"
date: 2026-06-15T10:00:00+09:00
slug: "styly-sdks-ar-vr-入門"
tag: "スターター"
summary: "日本のスペーシャルレイヤープラットフォーム STYLY は、シーンを一度作れば、モバイル AR・ウェブ・Quest・Vision Pro にまたいで再生できます。しかし「STYLY の SDK」とは実際には 4 つのオーサリングツールと、互いに非互換な 2 つの Unity ツールチェーンであり、そのすべてに 1 つの規則が通っています — カスタム C# は使えない。全体図を示します。各 SDK と、それぞれが届く AR・VR ターゲット、そしてハッカソン前に設計で織り込むべき制約を。"
---

[STYLY](https://styly.cc/)（東京の **Psychic VR Lab / STYLY, Inc.** による）は*スペーシャルレイヤー*のプラットフォームです。アセットやシーンをクラウドにアップロードすると、STYLY が自前のランタイムで、多くのデバイス — モバイル AR、ブラウザ、VR ヘッドセット、Apple Vision Pro — にまたいで再生します。バイリンガルのハッカソンにとっては魅力的な近道で、特に STYLY が広く使われている日本ではそうです。しかし「STYLY の SDK」は 1 つではありません。**ノーコードのウェブエディター、互いに非互換な 2 つの Unity プラグイン、そしてブラウザの WebAR ツール**であり、そのすべてに 1 つの規則が通っています — **カスタム C# は配布できない**。これがツールチェーンの全体図で、各ツールの AR・VR の到達範囲を添えます。

> 最初に区別を一つ。これは **styly.cc**（Psychic VR Lab の XR プラットフォーム）であって、**styly.io**（無関係なインテリアデザイン AI）ではありません。本記事はすべて XR プラットフォームの話です。

▸ [STYLY ドキュメント](https://document.styly.cc/) ・ [github.com/styly-dev](https://github.com/styly-dev) ・ [STYLY Studio / Gallery](https://gallery.styly.cc/)

## 考え方のモデル

一度作って、多くの場所で再生する。シーンを**ブラウザ（STYLY Studio）**か **Unity（2 つのプラグインのいずれか）**で作り、**STYLY Gallery** に公開すると、視聴者は — URL、QR コード、あるいはスキャンした STYLY マーカーで — 自分のデバイスに合った STYLY クライアントで開きます。落とし穴は、*オーサリング*側がターゲットで分岐することです。選ぶツールは、Vision Pro に出すのか、それ以外すべてに出すのかで決まります。

## オーサリングツール（実際の SDK 群）

### 1. STYLY Studio — ノーコード、ブラウザ、無料

インストール不要の入口。ブラウザのシーンビルダーで、モデルやメディアを取り込み、**Modifier** で配置・調整し、必要なら VR の中から編集し、ワンクリックで公開します。対応する取り込みは 3D が **glTF（.glb/.zip）・FBX・OBJ・.blend**、画像が **PNG/JPEG/GIF**、音声が **MP3**、動画が **YouTube**。Unity 不要で、AR と VR の両クライアントに届きます。動くデモへの最短経路です。

### 2. STYLY Plugin for Unity（クラシック）— VR・モバイル AR・ウェブ

Vision Pro 以外すべての主力です。Unity の**プレハブとシーン**を STYLY クラウドにアップロードする `.unitypackage`（[styly.cc/download](https://styly.cc/download/) から）で、アップロードしたものは Studio のアセットに合流します。重要な具体点：

- **Unity のバージョンはターゲット依存：** モバイル（iOS/Android）・Web Player・STYLY Studio・**Quest 2/3**・PICO 4 には **2022.3.24f1**、Steam・VIVEPORT・VIVE Flow/XR Elite・XREAL・SR Display には **2019.4.29f1**。
- **レンダーパイプラインは Built-in（レガシー）のみ、カラースペースは Gamma。** URP/HDRP も VFX Graph もなし。
- **アップロードで生き残るもの：** Timeline（音声トラック含む）、Shuriken パーティクルシステム、Animator クリップ、音声、*ベイク済み*ライティングとリフレクションプローブ、スカイボックス、カスタムの **Built-in パイプライン用シェーダー**。
- **生き残らないもの：カスタム C# `MonoBehaviour` スクリプト。** STYLY は「セキュリティ上の理由で」これを除去します。これが最大の制約で、ロジックは下記 2 つのノーコード系のいずれかで作ります。

### 3. クラシック経路のスクリプティング — PlayMaker か Interaction SDK

C# がないので、インタラクションはビジュアルに配線します。

- **PlayMaker**（STYLY が **1.9.2f3** を固定同梱）と、`ChangeStylyScene`・`OpenURL`・`GetHttpRequest` などの STYLY カスタムアクション。STYLY は VR コントローラー入力用に PlayMaker の**グローバルイベント**を注入します — グリップ/トリガー/タッチパッドの `PressDown`/`PressUp`。ただしこれらのコントローラーイベントが発火するのは VR アプリだけで、ウェブやモバイルのプレイヤーでは発火しません。
- **STYLY Interaction SDK** — PlayMaker なしで Unity のイベントシステムに接続する属性コンポーネント群（`STYLY_Attr_Draggable`・`STYLY_Attr_ColliderTrigger`・`STYLY_Action_Spawner`・`STYLY_Action_Mover` など）。**UI Pointer Click** の経路は VR・ウェブ Studio・*そしてスマートフォン*にまたいで動く、唯一の可搬なタップインタラクションです。

### 4. STYLY Spatial Layer Plugin — Apple Vision Pro（別世界）

Vision Pro は、まったく別の現代的なツールチェーンを使います。**レンダーパイプライン・Unity バージョン・ロジックシステムをクラシックプラグインと共有せず**、そのコンテンツは他のプラットフォームで動きません。[github.com/styly-dev](https://github.com/styly-dev/STYLY-Spatial-Layer-Plugin) より：

- **パッケージ：** OpenUPM 経由の `com.styly.styly-spatial-layer-plugin`（`openupm add -f com.styly.styly-spatial-layer-plugin`）、現在おおむね v0.6.x。
- **Unity 6**（6000.0.x）、**URP + Linear** カラースペース — クラシックプラグインの Built-in/Gamma とは正反対。
- **ボリューム：** Bounded（他アプリと共存する 1×1×1 m のボリューム）または Unbounded（占有する MR 空間）。
- **スクリプティング：Unity Visual Scripting のみ** — やはり C# も PlayMaker もなし。カスタム VS ノード（VRM、glTFast、WebRequest、Spectrum）と **STYLY-XR-Rig** を同梱します。
- **コンパニオン：** `STYLY-Hands-Unity`（ハンドジェスチャートラッキング）、`STYLY-NetSync`（マルチユーザー/LBE）、エンタープライズ向けカメラアクセスプラグイン（Vision Pro + PICO 4）。

### 5. STYLY WebAR — ノーコードのブラウザ AR、アプリ不要

最も新しいツール（**2026 年 5 月 19 日**ローンチ）で、STYLY が 2025 年に palan, Inc. と合併して取得した **palanAR** を基盤とします。モバイルブラウザでのアプリ不要 AR を、ノーコードでオーサリングし、**URL/QR** で配布します。**12 種類の AR**（マーカー、画像、平面、マーカーレス、顔、ハンド、GPS、ポータル、ボリュメトリック、空、フォトフレーム、塗り絵）に対応し、本物の無料ティアがあります。*（STYLY WebAR を深掘りするパートナー寄稿記事は別途予定しています。本総覧では概観のみ扱います。）*

混同を避けるための歴史的な注記：**「NEWVIEW SDK」**はクラシック Unity プラグインの旧称で、STYLY の NEWVIEW クリエイティブアワードに結びついたものです — 同じ系譜であり、別個のダウンロードではありません。

## どこで動くか — AR ターゲット

- **STYLY モバイルアプリ（iOS/Android）** — 無料。アプリ内ギャラリー、スキャンした STYLY マーカー、ディープリンク URL で端末に届きます。**マーカーとマーカーレス平面** AR に加え、**Immersal** スキャンと **City Anchor**（生の GPS ではなく **Google VPS** で正確に配置）による**位置 AR** に対応。（ヘッドセットなしの VR ビューアーも兼ねます。）
- **STYLY WebAR** — ブラウザ AR、インストール不要、上記 12 種類。
- **AR グラス** — **XREAL と SR Display が確認済みのターゲット**。STYLY は歴史的に Nreal Light でも動きました。**Snap Spectacles、HoloLens、Magic Leap、Android XR は*確認されていません*** — [Spectacles](/news/vibe-coding-spectacles-入門/) でのビルドを計画するなら、STYLY は文書化された経路ではないので、ギャップとして扱ってください。

## どこで動くか — VR ターゲット

- **Meta Quest 2/3 と PICO 4 / 4 Ultra** — 無料の単体 STYLY アプリ。シーンは Gallery から起動。
- **SteamVR / PCVR** — 2017 年からの無料アプリ（Rift、VIVE、Index、Windows MR）。VIVEPORT も歴史的に。
- **Apple Vision Pro** — **別個の**「STYLY for Vision Pro」アプリ（無料、visionOS 26 以降）。Spatial Layer プラグインのパイプラインが供給します。明示的に*レガシー STYLY とは非互換*で、上記のとおり別世界です。
- **ウェブ** — 任意のデスクトップで動く非没入のブラウザ **Web Player**（WASD/マジックウィンドウ）と、埋め込み可能なシーン。STYLY は **Unity WebXR** を実演していますが、ヘッドセットブラウザでの真の「Enter VR」没入 WebXR は**広くは文書化されていません** — 依存する前に確認を。

## 設計で織り込むべき制約

- **どこでもカスタム C# は不可。** 両 Unity プラグインがこれを除去します。毎フレームの本格的なロジックや外部ライブラリが要るなら、STYLY は適しません — PlayMaker / Interaction SDK / Visual Scripting 向けに設計してください。
- **2 つのツールチェーン、1 つの分岐。** クラシック（Unity 2022.3、Built-in、Gamma、PlayMaker）と Spatial Layer（Unity 6、URP、Linear、Visual Scripting）は何も共有せず、Vision Pro コンテンツは他から隔離されています。まずターゲット端末を決めれば、ツールチェーンが決まります。
- **没入ヘッドセットブラウザの WebXR は未確認。** ウェブの話は Web Player と WebAR です。Quest ブラウザで「Enter VR」が動くと前提せず、テストを。
- **Spectacles は非対応。** 2026 年 6 月時点で STYLY の経路は見つかりません。

## 価格、AI、そして 2026 年の全体像

クリエイターティアは**無料**（STYLY ロゴと非商用の制限付き）、**Business は月 799 ドル**（商用利用、位置合わせ、分析、アクセス制御）、**Enterprise** はカスタム。AI については、STYLY の生成系は**シーン生成ではなくアセット生成**です — テキスト/画像から 3D モデルを作る **Tripo AI** との連携（2026 年 6 月頃に WebAR へ統合を強化）であって、シーン全体を作る機能ではありません。2025〜26 年のより広い流れ：**STYLY World Canvas**（世界中のどの都市にも公開、2025 年 6 月）、**STYLY × palan の合併**（完全統合は 2026 年末目標）、そして **WebAR のリブランド**（2026 年 5 月）。Vision Pro アプリは Unity 6 上で活発に保守されています。

## 関連リンク

- [STYLY ドキュメント](https://document.styly.cc/) ・ [クリエイタープラグイン概要](https://document.styly.cc/doc/docs/en-US/creator/creator_plugin_intro/) ・ [プラグインのダウンロード](https://styly.cc/download/)
- [github.com/styly-dev](https://github.com/styly-dev) ・ [Spatial Layer Plugin（Vision Pro）](https://github.com/styly-dev/STYLY-Spatial-Layer-Plugin) ・ [STYLY WebAR](https://webar-editor.styly.cc/)
- [STYLY Studio / Gallery](https://gallery.styly.cc/) ・ [Business プランと対応端末一覧](https://gallery.styly.cc/business/en) ・ [NEWVIEW アワード](https://newview.design/en/)
- 関連：[XREAL グラスの開発](/news/xreal-android-xr-glasses-入門/) ・ [Immersive Web SDK](/news/immersive-web-sdk-入門/) ・ [visionOS 向け WebSpatial SDK](/news/webspatial-sdk-visionos-入門/) ・ [A-Frame WebXR スターター](/news/aframe-webxr-入門/) ・ [React Native AR の ViroReact](/news/reactvision-react-native-ar-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
