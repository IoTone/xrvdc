---
title: "Babylon.js：エンジン級の WebXR ルート"
date: 2026-05-24T10:00:00+09:00
slug: "babylonjs-webxr-入門"
tag: "スターター"
summary: "WebXR デモに PBR マテリアル、物理、GUI、または AR 機能（ヒットテスト、ハンドトラッキング）が必要なとき、Babylon.js はそれらを最初から内包したノービルドのルートです。Quest 3、Vision Pro、Snap Spectacles 向けのスターター。"
---

[Babylon.js](https://www.babylonjs.com/) は WebXR を一次サポートする本格的な TypeScript 製 3D エンジンです。動作ブラウザは [A-Frame スターター](/ja/news/aframe-webxr-入門/) と同じ — Meta Quest Browser、visionOS の Safari、Snap Spectacles の Browser Lens — であり、同じ「HTML 1 ファイル」のパターンでそれらに届きます。違いは深さです。Babylon は PBR マテリアル、物理、2D/3D GUI、Inspector デバッガ、リミックス向けの Playground を標準装備し、すべてを単一の WebXR フィーチャーマネージャに統合しています。

▸ [babylonjs.com](https://www.babylonjs.com/) ・ [doc.babylonjs.com](https://doc.babylonjs.com/) ・ [Playground](https://playground.babylonjs.com/) ・ [GitHub](https://github.com/BabylonJS/Babylon.js)（Apache-2.0、**v9.8.0**、25.5k★）

## A-Frame と Babylon.js の使い分け

| | A-Frame | Babylon.js |
|---|---|---|
| 記述スタイル | 宣言的（`<a-scene>`、コンポーネント） | 命令的（TypeScript / JavaScript） |
| 得意領域 | 簡潔なシーン、エンティティ・コンポーネント | エンジン級デモ：PBR、物理、GUI、ポストエフェクト |
| AR 機能 | コミュニティコンポーネント経由 | 一次対応の `WebXRFeaturesManager`（hit-test、anchors、planes、meshes、hand input、light estimation、depth） |
| ツール | プラグインで Inspector | 内蔵 Inspector ＋ ブラウザ Playground |
| TypeScript | 可能 | ネイティブ |

数個の `<a-entity>` で十分なら A-Frame を選びます。物理駆動のオブジェクト、PBR ライティング、シーン内 GUI、AR アンカーやヒットテストといったエンジン表面が必要なら Babylon を選びます。

## スターター — HTML 1 ファイル、ビルド不要

```html
<!DOCTYPE html>
<html><body style="margin:0">
  <canvas id="c" style="width:100%;height:100vh"></canvas>
  <script src="https://cdn.babylonjs.com/babylon.js"></script>
  <script>
    const canvas = document.getElementById('c');
    const engine = new BABYLON.Engine(canvas, true);
    const scene  = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 1.6, -3), scene);
    camera.attachControl(canvas, true);
    new BABYLON.HemisphericLight('h', new BABYLON.Vector3(0, 1, 0), scene);
    BABYLON.MeshBuilder.CreateBox('b', { size: 0.4 }, scene).position.y = 1.5;

    // この 1 行で VR を有効化（コントローラ・ハンド・テレポート・ポインタ込み）：
    scene.createDefaultXRExperienceAsync({
      uiOptions: { sessionMode: 'immersive-vr' }
    });

    engine.runRenderLoop(() => scene.render());
    addEventListener('resize', () => engine.resize());
  </script>
</body></html>
```

`createDefaultXRExperienceAsync` は Enter VR/AR ボタンの挿入、XR カメラの構成、コントローラ＋テレポートの配線を 1 回で行います。AR パススルーには `sessionMode: 'immersive-ar'` を（通常は `referenceSpaceType: 'local-floor'` と共に）渡します。本番では CDN を npm パッケージへ — `npm i babylonjs`、またはツリーシェイク可能な ES6 パッケージへ差し替えます。

ローカル環境のセットアップなしで素早く反復したいなら [Playground](https://playground.babylonjs.com/) が最短経路です — ブラウザでコードを書き、URL で共有し、コミュニティ例をフォークできます。

## フィーチャーマネージャから AR 機能を有効化

Babylon は WebXR の各モジュールを単一 API で公開します。XR 体験の作成後、必要な機能を有効化します：

```javascript
const xr = await scene.createDefaultXRExperienceAsync({
  uiOptions: { sessionMode: 'immersive-ar', referenceSpaceType: 'local-floor' }
});
const fm = xr.baseExperience.featuresManager;
const hitTest      = fm.enableFeature(BABYLON.WebXRFeatureName.HIT_TEST,         'latest');
const anchors      = fm.enableFeature(BABYLON.WebXRFeatureName.ANCHOR_SYSTEM,    'latest');
const planes       = fm.enableFeature(BABYLON.WebXRFeatureName.PLANE_DETECTION,  'latest');
const handTracking = fm.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING,    'latest', { xrInput: xr.input });
```

ヒットテスト、アンカー、プレーン／メッシュ検出、ライト推定、深度センシング、画像トラッキング、ハンドトラッキング（WebXR Hand Input）、DOM オーバーレイ、レイヤーは、いずれもこのマネージャ経由のオプトイン機能です。

## デプロイと対象デバイス

WebXR には **HTTPS** が必須です。静的ホスト（GitHub Pages、Vercel、Cloudflare Pages）と、[A-Frame の記事](/ja/news/aframe-webxr-入門/) で紹介したローカルトンネルの選択肢がそのまま使えます — ヘッドセットでの素早い反復に便利な `cloudflared` クイックトンネル 1 行を含めて：

```bash
cloudflared tunnel --url http://localhost:8080
```

WebXR の対象デバイスも同じ 3 種：

- **Meta Quest 3** — Meta Quest Browser：フル WebXR（immersive-vr、immersive-ar パススルー、ハンドトラッキング、AR 機能）。最もスムーズなターゲット。
- **Apple Vision Pro** — visionOS の Safari：immersive-vr とハンド／transient-pointer 入力。Enter VR の動作を早めに確認し、インタラクションはシンプルに。
- **Snap Spectacles** — [Browser Lens](https://developers.snap.com/spectacles/about-spectacles-features/webxr)：immersive-ar とハンドトラッキング。ヒットテストは現在エミュレーション。ゲームパッドではなく手の入力を前提に設計してください。

## なぜ 2.5 日間のハッカソンに向くのか

- **エンジン級の表面をセットアップ不要で** — PBR・物理・GUI・AR 機能はいずれも小さな命令的呼び出しの背後に。ビルドもプラグイン導入も不要。
- **共同作業向け Playground** — 例をフォークし、URL を共有し、数秒でチームに見せられます。
- **1 コードベースで 3 ターゲット** — 同じ Vite／CDN バンドルが Quest 3・Vision Pro・Spectacles の同一 URL で動作。
- **TypeScript ファースト** — API の大部分が型付き。プロジェクトが 1 ファイルを超えて成長したときに効きます。

## 関連リンク

- [Babylon.js ドキュメント](https://doc.babylonjs.com/) ・ [Playground](https://playground.babylonjs.com/) ・ [GitHub](https://github.com/BabylonJS/Babylon.js)
- [Babylon WebXR 詳細](https://doc.babylonjs.com/features/featuresDeepDive/webXR) ・ [WebXR Device API](https://immersiveweb.dev/)
- 関連：[A-Frame / WebXR スターター](/ja/news/aframe-webxr-入門/) ・ [Snap Spectacles と Lens Studio](/ja/news/snap-spectacles-lens-studio-入門/) ・ [Android XR 入門](/ja/news/androidxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
