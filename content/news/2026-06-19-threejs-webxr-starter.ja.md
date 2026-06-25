---
title: "Three.js：WebXR の標準ライブラリ"
date: 2026-06-19T10:00:00+09:00
slug: "threejs-webxr-入門"
tag: "スターター"
summary: "Three.js は A-Frame の土台であり、ほとんどの WebXR サンプルが書かれているライブラリです。WebXRManager により、フラットな WebGL シーンが 2 行 — renderer.xr.enabled とVR ボタン — でヘッドセットアプリになります。Quest 3、PICO 4 Ultra Enterprise、Vision Pro、Spectacles 向けの 1 ファイル・スターター。"
---

[Three.js](https://threejs.org/) は Web 上で最も広く使われている WebGL ライブラリであり、WebXR エコシステムの多くの土台でもあります — [A-Frame](/ja/news/aframe-webxr-入門/) はこれをラップし、[WebXR サンプル](https://immersive-web.github.io/webxr-samples/) の多くは直接 three.js で書かれています。A-Frame が宣言的で [Babylon.js](/ja/news/babylonjs-webxr-入門/) が全部入りのエンジンであるのに対し、three.js はその中間に位置します。シーングラフを完全に制御できる、無駄のない命令的なツールキットでありながら、WebXR の配線は数行で済みます。

▸ [threejs.org](https://threejs.org/) · [ドキュメント](https://threejs.org/docs/) · [WebXR 例](https://threejs.org/examples/#webxr_xr_ballshooter) · [GitHub](https://github.com/mrdoob/three.js) (MIT, **r170**, 105k★)

## three.js が XR にもたらすもの

WebXR サポートのすべては **`renderer.xr`**（three.js の `WebXRManager`）に存在します。有効化はプロパティ 1 つ、セッション開始はボタンヘルパー 1 つです:

- `renderer.xr.enabled = true` でレンダリングがヘッドセットのステレオビューと両眼投影を通るようになります。
- `VRButton` / `ARButton`（`three/addons/webxr/` 内）が `navigator.xr.requestSession`、機能ネゴシエーション、入退室 UI を処理します。
- `renderer.setAnimationLoop(fn)` が `requestAnimationFrame` を置き換えます — XR を理解し、ヘッドセットのフレームレートで両眼ペアごとに 1 回ティックします。
- `renderer.xr.getController(i)` と `XRHandModelFactory` が、コントローラーと関節付きハンドを通常の `Object3D` としてシーンに登場させます。

## スターター — HTML 1 ファイル、ビルド不要

最新の three.js は ES モジュールとして配布されます。**インポートマップ**で CDN からライブラリを読み込むため、スターター全体がバンドラ不要の 1 ファイルになります:

```html
<!DOCTYPE html>
<html><body style="margin:0">
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
} }
</script>
<script type="module">
  import * as THREE from 'three';
  import { VRButton } from 'three/addons/webxr/VRButton.js';

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.xr.enabled = true;                          // ① WebXR 有効化
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer)); // ② Enter VR

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 3));

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x23f0ff }));
  cube.position.set(0, 1.5, -2);
  scene.add(cube);

  renderer.setAnimationLoop(() => {                    // ③ XR 対応の描画ループ
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  });
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
</script>
</body></html>
```

この印を付けた 3 行が、デスクトップの WebGL ページとヘッドセットアプリの違いのすべてです。`VRButton` を `ARButton` に替える — `ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] })` — だけで、代わりに `immersive-ar` パススルーセッションが始まります。

## コントローラーとハンド

どちらも同じマネージャから得られます。コントローラーをシーンオブジェクトとして追加し、その `select` イベントを購読します。ハンドメッシュはファクトリ経由で読み込みます:

```javascript
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';

const controller = renderer.xr.getController(0);
controller.addEventListener('select', () => { /* トリガー */ });
scene.add(controller);

const hands = new XRHandModelFactory();
const hand = renderer.xr.getHand(0);
hand.add(hands.createHandModel(hand, 'mesh'));
scene.add(hand);
```

グリップやレイポインタには `renderer.xr.getControllerGrip(i)` と `XRControllerModelFactory` を使い、物理コントローラーのモデルを描画します。[`webxr_vr_dragging`](https://threejs.org/examples/#webxr_vr_dragging) と `webxr_xr_ballshooter` の例が定番のリファレンスです。

## デプロイと対象デバイス

WebXR には **HTTPS** が必要です。[A-Frame の記事](/ja/news/aframe-webxr-入門/) と同じ静的ホストと `cloudflared` クイックトンネルのワンライナーがそのまま使えます:

```bash
cloudflared tunnel --url http://localhost:8080
```

イベントで利用できるヘッドセットと、three.js での到達方法:

- **Meta Quest 3** — Meta Quest Browser：フル WebXR — `immersive-vr`、`immersive-ar` パススルー、ハンドトラッキング、AR 機能。最もスムーズな対象です。
- **PICO 4 Ultra Enterprise** — PICO Browser が同じ標準 Android ベースで WebXR を公開します。ハッカソンには複数台を用意しています。標準型ヘッドセットと同様、Enter VR の動作を早めに確認してください。
- **Apple Vision Pro** — visionOS の Safari：ハンドおよび transient-pointer 入力での `immersive-vr`（WebXR の AR モジュールはありません）。操作はハンド中心に。
- **Snap Spectacles** — [Browser Lens](https://developers.snap.com/spectacles/about-spectacles-features/webxr)：ハンドトラッキング付き `immersive-ar`、演算は制限あり。

## なぜ 2.5 日のハッカソンに向くのか

- **共通言語** — ほとんどの WebXR スニペット、Stack Overflow の回答、AI 生成コードは three.js を前提とするため、情報がどこにでもあります。
- **ビルド不要** — インポートマップのスターターは 1 ファイルで動きます。Vite が要るのはプロジェクトが大きくなってから。
- **1 シーンであらゆるヘッドセット** — 同じ URL が Quest 3、PICO、Vision Pro、Spectacles で動きます。
- **スプラットとビデオへの道** — three.js は同じシーングラフで [ガウシアンスプラット](/ja/news/video-to-gaussian-splats-入門/) を読み込み、[ステレオビデオ](/ja/news/spatial-video-capture-to-headset-入門/) を再生します。WebXR ビューアとインタラクティブなデモが 1 つのコードベースを共有できます。

## 関連リンク

- [Three.js ドキュメント](https://threejs.org/docs/) · [WebXR 例](https://threejs.org/examples/#webxr_xr_ballshooter) · [GitHub](https://github.com/mrdoob/three.js)
- [VR コンテンツの作り方（three.js マニュアル）](https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content) · [WebXR Device API](https://immersiveweb.dev/)
- 関連: [A-Frame / WebXR スターター](/ja/news/aframe-webxr-入門/) · [Babylon.js WebXR](/ja/news/babylonjs-webxr-入門/) · [ビデオからガウシアンスプラット](/ja/news/video-to-gaussian-splats-入門/) · [空間ビデオ 撮影から再生](/ja/news/spatial-video-capture-to-headset-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

ご質問は [お問い合わせ](/contact/) ページからどうぞ。
