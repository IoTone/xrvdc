---
title: "Meta Ray-Ban Display グラス向け開発 — Wearables Web App ツールキット"
date: 2026-05-17T10:00:00+09:00
slug: "meta-wearables-webapp-sdk-入門"
tag: "スターター"
summary: "ネイティブプラットフォーム スターターシリーズ第 2 回。Meta Ray-Ban Display グラス向けの体験を、使い慣れた HTML/CSS/JS と AI 支援ツールキットで構築 — 導入からグラスへのデプロイまで。"
---

XR VisionDevCamp Fukuoka 2026 **ネイティブプラットフォーム スターターシリーズ** 第 2 回。[Snap Spectacles と Lens Studio](/ja/news/snap-spectacles-lens-studio-入門/) に続き、今回は別のヘッドセット **Meta Ray-Ban Display グラス** を取り上げます。入り口は、すでに知っている Web スタックです。

## 新しいエンジンではなく Web アプリ

Meta Ray-Ban Display（MRBD）グラス向けアプリは、グラス上でレンダリングされる標準的な **HTML / CSS / JavaScript** です。特に AI 支援コーディングツールと組み合わせると、動くデモへの最短ルートになります。Meta は **Claude Code・Codex・Cursor・GitHub Copilot** 向けプラグインを含むオープンソースの **Wearables Web App AI ツールキット** を公開しており、グラスのデザインシステムに沿ってアプリを雛形生成します。

▸ [GitHub: meta-wearables-webapp](https://github.com/facebookincubator/meta-wearables-webapp) · [Web Apps 開発者ドキュメント](https://wearables.developer.meta.com/docs/develop/webapps)

## すべてのアプリを規定する制約

ディスプレイは **600×600dp の加法型導波路（additive waveguide）** です。最初の 1 行から、これに合わせて設計します。

- **黒は透明。** 背景にはダークグレー `#1C1E21`、テキスト/アイコンには白 `#FFFFFF` を使い、コントラスト比 4.5:1 以上を目指します。
- **タッチもカーソルもなし。** 入力は **D-pad**（EMG リストバンドまたは captouch がジェスチャーを矢印キーに変換）。Enter で選択、Escape で戻る。インタラクティブ要素には `.focusable` クラスが必要で、順次ナビゲーションで到達可能であること。フローは 3 ステップ以内に。
- **セーフゾーン：** 余白 8dp（実効 584×584dp）。ボタン高 88dp、操作可能な文字は最小 14dp。
- **パフォーマンス予算：** 読込 3 秒未満、gzip 後 JS 500KB 未満、60fps、メモリ 128MB 未満、ネットワークリクエスト 10 件未満。バニラ JS か軽量フレームワーク、JS アニメより CSS トランジション、アイドル時のインターバル処理は不可。
- **センサー：** 加速度・ジャイロ・地磁気・方位を W3C Generic Sensor API 経由で取得。

## クイックスタート

**1. AI スキルをインストール**（例は Claude Code。Codex / Cursor / Copilot にも対応）：

```bash
# プラグインマーケットプレイス（推奨）
/plugin marketplace add https://github.com/facebookincubator/meta-wearables-webapp
/plugin install meta-wearables-webapp@meta-wearables

# …またはインストールスクリプト
git clone https://github.com/facebookincubator/meta-wearables-webapp.git
./install-skills.sh claude     # または: cursor | copilot | all
```

**2. アプリを説明する。** AI エディタで：*「5 日間予報を D-pad ナビゲーションで表示する天気アプリを作って」*。ツールキットがディスプレイのデザインシステムに沿って `index.html`・`styles.css`・`app.js` を雛形生成します。同梱スキル：`create-webapp`・`add-screen`・`add-button`・`connect-api`・`add-sensors`。

**3. ブラウザでテスト。** ローカルで実行し、**矢印キー** で D-pad を再現。位置情報/IMU は Chrome DevTools → ⋮ → その他のツール → **センサー** で位置と向きをオーバーライドします。

**4. グラスへデプロイ。** **公開 HTTPS URL**（Vercel など任意のホスティング）で配信します。publish スキルで QR コードを生成してスキャンし Meta AI アプリへディープリンクするか、手動で **Meta AI アプリ → デバイス → Display Glasses 設定 → アプリ接続 → Web apps → Web アプリを追加** から登録します。

## なぜ 2.5 日間のハッカソンに向くのか

- **エンジンの習得が不要** — Web ページを公開できれば、グラスアプリも公開できます。
- **AI による雛形生成** がディスプレイ・入力・パフォーマンスのルールを既に織り込んでおり、制約ではなくアイデアに時間を使えます。
- **実センサーと実 API** — REST/WebSocket に接続し、デバイスの動きを読み取って真に空間的なインタラクションを実現。

`examples/` に同梱の **Snake** から始めると、D-pad ナビゲーションと状態管理が一通り把握できます。そこからリミックスしましょう。

## 関連リンク

- [meta-wearables-webapp リポジトリ](https://github.com/facebookincubator/meta-wearables-webapp)（BSD ライセンス）
- [Web Apps 開発者ドキュメント](https://wearables.developer.meta.com/docs/develop/webapps)
- [API リファレンス全文](https://wearables.developer.meta.com/llms.txt?full=true)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加申し込み](https://luma.com/i5gerreb)

次回は、XR プロジェクト向けにフォトリアルなシーンをキャプチャする方法を取り上げます。ご質問は [お問い合わせ](/contact/) ページからどうぞ。
