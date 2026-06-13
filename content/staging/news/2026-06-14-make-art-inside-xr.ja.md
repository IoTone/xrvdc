---
title: "ヘッドセットの中でアートを作る — そしてそれを自分のビルドへ"
date: 2026-06-14T10:00:00+09:00
slug: "make-art-inside-xr-入門"
tag: "ワークフロー"
summary: "現実世界をスキャンすることの創造的な逆操作です。ヘッドセットの中で 3D アートを描き、彫り、モデリングし、同じアセットパイプラインで WebXR シーン・Quest アプリ・Vision Pro のビルドに落とし込む。無料でオープンな中心は Open Brush。そして実際につまずくのは書き出しのところで、頂点カラー・アンリットマテリアル・ブラシシェーダーが、対処しなければ静かに壊れます。無料で機能するツール群とパイプラインを示します。"
---

ここで扱ってきた撮影パイプライン — [写真→スプラット](/news/sharp-photo-to-splat-webxr-入門/)、[空間ビデオ](/news/spatial-video-capture-to-headset-入門/)、[360° シーン](/news/3dgs-360-カメラ-ワークフロー/) — はどれも現実世界から始まります。**ヘッドセットの中でアートを作るのはその逆です。** 作り手は空間で手をトラッキングされながら何もないところから 3D ジオメトリを生み出し、その成果はビルドに持ち込める本物のメッシュになります。ハッカソンにとって決め手は、どのツールが描き心地が良いかではなく、**どのツールがエンジンで使えるジオメトリを無料で書き出せるか**、そしてそのジオメトリをシーンに取り込む途中で壊さずに済むか、です。後半こそ、多くのチームが半日を失うところです。

▸ [Open Brush](https://openbrush.app/) ・ [Open Brush Toolkit（Unity）](https://github.com/icosa-foundation/open-brush-toolkit) ・ [`three-icosa`（WebXR）](https://github.com/icosa-foundation/three-icosa)

## 無料でオープンな中心：Open Brush

[**Open Brush**](https://openbrush.app/) は Google の Tilt Brush のコミュニティ版後継で、**Icosa Foundation** が保守する**無料・オープンソース（Apache-2.0）**のツールであり、**2026 年も活発にリリース**されています。**Quest 単体で**（PC 不要）動き、**PCVR/SteamVR** でも動きます。そして本記事全体の起点になる理由がこれです — エンジン向けフォーマットを一式で書き出せます：**GLB**（バイナリ glTF 2.0）、**FBX**、**OBJ**、**USD**、加えてストロークごとの生の **JSON** とストローク交換用の **LATK**。Vision Pro 向けのネイティブビルドはまだありませんが、その出力は変換を経て Vision Pro に届きます（後述）。

書き出しを正しく着地させるのが 2 つの関連プロジェクトです。ブラシストロークは普通のメッシュではないからです。

- [**Open Brush Toolkit**](https://github.com/icosa-foundation/open-brush-toolkit) — Unity SDK（UnitySDK v24.x、Unity 2019.4 以降）。書き出した GLB を Unity プロジェクトにコピーすると、取り込み時に正しいブラシマテリアルとシェーダーを割り当て直します。
- [**`three-icosa`**](https://github.com/icosa-foundation/three-icosa) — **three.js / WebXR** 向けに `GOOGLE_tilt_brush_material` glTF 拡張を実装する npm パッケージ。`GLTFLoader` に登録してブラシディレクトリを指せば、Open Brush のストロークが平らなポリゴンではなく本来のシェーダーで描画されます。

この組み合わせ — 無料でオープンなペインターに、Unity とウェブ向けの拡張対応ローダー — が、Open Brush を安全な既定にしています。

## 残りの無料ツール群を、用途別に

雰囲気ではなく出力で選びます。以下はすべて週末に無料で現実的に使え、注記がない限り本物のジオメトリを生みます。

- **ローポリモデリング — [Open Blocks](https://github.com/icosa-foundation/open-blocks)**（Icosa Foundation、オープンソース、Quest 単体）。Google Blocks の後継で、**OBJ** を書き出します。
- **プロ向け 3D デザイン／CAD 寄り — [Gravity Sketch](https://www.gravitysketch.com/)**（Quest 単体 + PCVR）。**無料ティアは本物で恒久的**（2026 年 2 月に改定）。ヘッドセット内の書き出しは **OBJ・FBX・glTF/GLB** をカバーし、**IGES**（NURBS/CAD の受け渡し）は有料ティア向け。VR に再び入らずウェブインスペクターから書き出せます。
- **VR の中で AI テキスト→3D — [Masterpiece X](https://www.masterpiecex.com/)**（Quest 単体、無料アプリ + 250 スタータークレジット）。プロンプトから**リグ・アニメーション付き**モデルを生成し、**GLB** を書き出します。
- **イラスト + アニメーション — [Quill](https://quill.art/)**（無料、PCVR — Windows PC とテザー接続のヘッドセットが必要）。**USD・FBX・Alembic** を書き出します。**glTF はない**こと、そしてフレーム単位のアニメーションは **Alembic** でしか保てないことに注意（レシピ参照）。
- **建築／空間デザイン — [Arkio](https://www.arkio.is/)**（Quest 3 MR 単体 + PCVR）。無料の **Starter** ティアで **glTF/GLB と OBJ** を書き出します。
- **彫刻（デジタル粘土）— [Adobe Substance 3D Modeler](https://www.adobe.com/products/substance3d/apps/modeler.html)**（VR + デスクトップ）。USD/glTF/FBX/OBJ の書き出しは随一ですが、**無料ティアはなく**、30 日間の試用のみ — 計画すれば週末には間に合います。

パイプラインの観点で**避ける**べきものについて一言：VR の 2D ペイントアプリ（Vermillion、Painting VR、Kingspray）は使って楽しいものの、出力は**メッシュではなく平らな画像**です。塗ったテクスチャが欲しいときだけ出番があります。

## 書き出しの作法 — 実際につまずくところ

ファイルを出すのは簡単です。本当の仕事は、それをエンジンで*正しく見せる*ことです。描いた・彫ったアセットは、既定のパイプラインで静かに失敗する機能に依存しているからです。半日を救う規則：

- **GLB が万能の鍵、USDZ が Vision Pro の鍵。** GLB を書き出せるものは three.js・Babylon.js・Godot・A-Frame・`<model-viewer>` に落ちます。**ネイティブ Vision Pro 向けは USDZ にしなければなりません。**
- **`KHR_materials_unlit` を使う。** 描いたアートは色をストロークに持ちます。メタリック/ラフネスの PBR シェーダーの下では、その色は飛ぶか消えます。アンリットなら、塗った色がそのまま最終的な見た目になります。three.js・Babylon・Godot・`<model-viewer>` で対応。
- **マテリアルを両面に。** ブラシストロークはしばしば一枚平面です — `doubleSided=true`（Blender ではバックフェースカリングを外す）がないと、浅い角度で消えます。
- **描いたアセットに Draco 圧縮を使わない** — 見た目が依存する頂点カラーを壊しかねません。テクスチャは代わりに KTX2 で圧縮します。
- **ブラシシェーダーには拡張対応のローダーが要る。** `three-icosa`（ウェブ）や Open Brush Toolkit（Unity）がないと、アニメーション/カスタムブラシは素の glTF 取り込みで見た目を失います。**パーティクルや半透明のブラシはそれでも欠落します** — テスト用スケッチはシンプルなブラシに留めるか、JSON/LATK を残して自分でジオメトリを再構築してください。
- **Godot には既知の頂点カラーのバグ**（4.3〜4.4.x）があります。Compatibility レンダラーで頂点カラーが黒く取り込まれることがあります。「Use Vertex Colors as Albedo」を有効にし、Forward+ か Mobile レンダラーを使ってください。

**glTF↔USDZ** の変換そのものには、無料で信頼できる経路が 2 つあります。**Blender**（glTF を取り込み、USD/USDZ をネイティブに書き出す — 堅実な経路）と、Google の **`usd_from_gltf`**（2024 年 6 月から読み取り専用でアーカイブ済みですが、`KHR_materials_unlit` 対応で GLB→USDZ を今も変換できます）。

## ターゲット別レシピ

- **Quest 3 ネイティブアプリ：** Open Brush か Masterpiece X → **GLB** → Meta **Spatial SDK** で直接取り込み（GLB/OBJ/FBX を変換なしで読みます）。
- **WebXR デモ：** Open Brush → **GLB** → three.js + **`three-icosa`**（または [A-Frame](/news/aframe-webxr-入門/) の `gltf-model`）。アンリット + 両面を適用し、Draco は避けます。最も可搬なターゲットで、Quest 3 でも Vision Pro Safari でも動き、ここの [Babylon.js](/news/babylonjs-webxr-入門/) と A-Frame 勢がすでに暮らす場所です。
- **ネイティブ Vision Pro：** 任意のツール → **GLB** → Blender か `usd_from_gltf` → **USDZ** → Quick Look・Reality Composer Pro・Safari の **`<model>`** 要素。シーン側は [RealityKit + ARKit スターター](/news/vision-pro-mixed-reality-realitykit-arkit-入門/)を参照。
- **Quill のアニメーション → Unreal/Unity：** **Alembic（`.abc`）**を書き出し → Unreal の **Geometry Cache**（または Unity の Alembic パッケージ）に取り込み、Alembic の頂点カラーを**アンリットのエミッシブ**マテリアルに配線して手描きの見た目を保ちます。（FBX は Quill のフレーム単位の変形を運べません — Alembic が必須です。）

## Vision Pro の入力の転換 — それがアートに効く理由

Vision Pro は既定で手と視線の入力で、精密な描画には不向きです — しかし **visionOS 26（2025）**でそれが変わり、**6DoF の空間アクセサリ**に対応しました。創作向けなのが **[Logitech Muse](https://www.logitech.com/)** スタイラス（129.95 ドル、2025 年 10 月）です。筆圧チップ、力検知のサイドボタン、ハプティクスを備え、描画と彫刻のために作られた空間トラッキングのペンです。ソニーの **PSVR2 Sense コントローラー**（249.95 ドル、2025 年 11 月）も対応しますが、こちらはゲーム寄りです。visionOS 26.2 では Apple 自身の Freeform と Notes も Muse 入力を受け付け、サードパーティの創作アプリも続きました。

つまりコントローラーやスタイラスによる Vision Pro でのアートは本当に存在するようになりました。ただしアプリのエコシステムはまだ若く、看板格の VR ペインター（Open Brush、Gravity Sketch）は **visionOS ネイティブ版がまだありません**。当面、ネイティブ AVP のアート経路は、USDZ を書き出す小さなアプリ（Spatial Drawing、VoxScan — 後者は glTF/OBJ も）か、クロスプラットフォームのツールに変換ステップを足す形になります。

## 共有、そして馴染まない 1 台

ホスティングと再利用には、Icosa Foundation が **[Icosa Gallery](https://icosa.gallery/)** も運営しています — 閉鎖した Google Poly の、オープンソースで自己ホスト可能な代替で、モデルを取得する公開 API もあります。Open Brush はアプリ内から**スケッチを直接アップロード**できます。ビルドの素材にする無料の CC0/CC-BY アセットには、**[poly.pizza](https://poly.pizza/)** にも API があります。

例外が **[Snap Spectacles](/news/vibe-coding-spectacles-入門/)** です。Lens の中で作ったアートはロックされた Lens コンテンツ（Snap Cloud の JSON）のまま残り、glTF や USDZ への**標準的なメッシュ書き出しがありません**。Lens Studio は glTF/FBX/OBJ を喜んで取り込むので、Spectacles は他所で作ったアートを*見せる*には良い場所ですが、アセットパイプラインの供給源ではなく、作って表示するターゲットです。

## 注意点

- **無料は摩擦ゼロを意味しません。** ツールは無料ですが、書き出しの破綻（頂点カラー、アンリット、両面、Draco、Godot のバグ）が本当のコストです。量産の前に、1 つのアセットを正しく見せる時間を見積もってください。
- **ブラシの忠実度は欠落します。** 単純なブラシは glTF の往復に耐えますが、パーティクルやアニメーションブラシはツールキットを使っても耐えません。そこを織り込んで設計を。
- **Vision Pro のネイティブアートは黎明期。** コントローラー/スタイラス対応は新しく（visionOS 26 以降）、主要ペインターは未移植です — 変換ステップを前提にし、小さなアプリの価格と書き出しは事前に確認を。
- **最新の細部を確認。** 無料ティアの上限、アプリ価格、ストアの掲載は動きます。イベント前に確認を。Open Brush と Open Blocks はオープンソースゆえ最も安定した賭けです。

## 関連リンク

- [Open Brush](https://openbrush.app/) ・ [書き出しガイド](https://docs.openbrush.app/user-guide/exporting-open-brush-sketches-to-other-apps) ・ [Open Brush Toolkit（Unity）](https://github.com/icosa-foundation/open-brush-toolkit) ・ [`three-icosa`（WebXR）](https://github.com/icosa-foundation/three-icosa)
- [Open Blocks](https://github.com/icosa-foundation/open-blocks) ・ [Gravity Sketch](https://www.gravitysketch.com/) ・ [Masterpiece X](https://www.masterpiecex.com/) ・ [Quill](https://quill.art/) ・ [Arkio](https://www.arkio.is/)
- [Icosa Gallery（Poly の後継）](https://icosa.gallery/) ・ [poly.pizza（CC0 モデル）](https://poly.pizza/) ・ [Blender の USD/USDZ 書き出し](https://docs.blender.org/manual/en/latest/addons/import_export/scene_universal_scene_description.html) ・ [`usd_from_gltf`](https://github.com/google/usd_from_gltf)
- 関連：[SHARP で写真からスプラットへ](/news/sharp-photo-to-splat-webxr-入門/) ・ [空間ビデオを端から端まで](/news/spatial-video-capture-to-headset-入門/) ・ [XR 開発者のための WWDC 2026](/news/wwdc-2026-xr-visionos-27-入門/) ・ [A-Frame WebXR スターター](/news/aframe-webxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
