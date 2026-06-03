---
title: "Spectacles を MIDI コントローラーに — MIDI Bleep Blop スターター"
date: 2026-06-03T14:00:00+09:00
slug: "midi-bleep-blop-spectacles-入門"
tag: "スターター"
summary: "IoTone による、できたばかりの実験的な一次配布スターター。Snap Spectacles のレンズを実機シンセや DAW を鳴らすライブ MIDI コントローラーに変えます。面白いのはアーキテクチャです。Spectacles は端末上でボンディングが必要な BLE-MIDI 機器とペアリングできないため、MIDI をコンパニオン PC の CoreMIDI / ALSA / WinMM へ WebSocket ブリッジ経由で送ります。"
---

[**MIDI Bleep Blop**](https://github.com/IoTone/MIDIBleepBlop)（パッケージ名 `midi-bleep-bop`）は、ハッカソンの[運営パートナー](/sponsors/)である **IoTone** による MIT ライセンスの TypeScript プロジェクトです。[Snap Spectacles](/news/snap-spectacles-lens-studio-入門/) のレンズから MIDI ノートを生成し、実機シンセや DAW（KORG Volca、GarageBand、Logic Pro、Ableton が参照されています）で鳴らせます。これまで扱ってきた視覚系スターターに対する、音楽的でクリエイティブな対の存在で、音にまつわるアイデアならハッカソンの良い起点になります。

先にお断り：これは**できたばかりの実験的なプロジェクト**です。バージョンは `0.1.0`、コミット数はわずか、登場から数日で、活発に開発中です。完成したパッケージではなく、クローンして改造する「これからに注目」のスターターとして捉えてください。

## 面白いのはここ：なぜブリッジがあるのか

このアーキテクチャこそが本当の学びです。Spectacles は**ハードウェアと直接 MIDI を話せません**。理由は具体的です。Spectacles の Bluetooth API には `createBond()` のサポートがなく、市販の BLE-MIDI 機器は例外なくボンディングを必要とするため、ボンディングが必要なペリフェラルは無言でハングします。したがって、レンズからハードウェアへの直接 MIDI は現状では実現できません。

MIDI Bleep Blop はコンパニオンブリッジでこれを回避します。

```
Spectacles レンズ ──ws/wss──► ブリッジ（Node または Bun） ──► CoreMIDI / ALSA / WinMM ──► シンセ
```

レンズは Lens Studio の **`InternetModule`** WebSocket API を基にした `SpectaclesWebSocketTransport` を使い、ブリッジは JZZ ライブラリ経由で OS の MIDI サブシステムと話す小さな Node/Bun サーバーです。これは応用の効くパターンでもあります。Spectacles が直接届かないあらゆるハードウェアに対して使える「レンズが WebSocket でコンパニオンアプリと話す」手法そのものです。

## リポジトリの中身

TypeScript のモノレポです。ハッカソンで重要な部分は次のとおりです。

- **`lens/MidiBleepBop.lspkg`** — 配布用の Lens Studio パッケージ。`MidiClientComponent`、`MidiClient` プレハブ、バンドル済みのコア＋トランスポートスクリプトを含みます。自分のレンズに組み込めます。
- **`lens/TesterLens`** — エンドツーエンドの Spectacles '24 Lens Studio プロジェクト。診断パネルと、受信 MIDI に反応する `NoteCubeFlash` を備えます。
- **`bridge/`** — Node/Bun の WebSocket→MIDI サーバー。
- **`examples/`**・**`docs/`** — 実行可能なサンプルと、規模の割に充実したドキュメント（アーキテクチャ、ブリッジ、ワイヤープロトコル、Spectacles API、グルーヴ）。

上位の構成要素として、`ChordSender` グルーヴジェネレーター（triad、acid、house、trance のパターン）、`PianoKeyboard` コンポーネント、名前付き CC パラメーター用の `DeviceCatalogComponent`（例：Volca Bass の「Cutoff EG intensity」）があります。

## 動かしてみる

1. リポジトリをクローンし、`npm install` と `npm run build`（`npm test` で vitest が走ります）。
2. MIDI の出力先を選びます。macOS でハードウェア不要の経路は、Audio MIDI 設定で **IAC ドライバ**を有効化し、GarageBand/Logic/Ableton へ送ります。ハードウェアなら WIDI Master / KORG BLE-MIDI ドングルでシンセへ。
3. ブリッジを起動します。例：GarageBand のコードループなら `npm run play:gb`、または `node bridge/dist/cli.js --device "IAC Driver Bus 1" --log debug`。`curl http://127.0.0.1:8765/status` で確認します。
4. **TesterLens** を **Lens Studio 5.9 以降**（5.10 推奨）で開き、**Project Settings → Experimental APIs** を有効化して、Bridge URL に**マシンの LAN IP** を設定します。`localhost` は PC ではなくグラス自身を指します。
5. Preview で Play を押し、ステータスが `connecting → open` に変わり、キューブが MIDI に反応するのを確認します。あとは `MidiClientComponent` を自分のレンズに入れ、`sendNoteOn` / `sendCC` / `sendPitchBend` を呼びます。

## 注意点

- **できたばかりで実験的。** `v0.1.0`、コミットは 1 桁、未解決の Issue が 9 件。粗さがある前提で。
- **npm パッケージはまだ公開されていない可能性があります。** リポジトリのルートは `private` のため、`npx` ではなくクローン＆ビルドを起点にしてください。
- **コンパニオン PC が必要**です。ブリッジはグラス上では動きません。Spectacles 実機は最初は任意で、Preview モードで動きます。
- **プラットフォームの注意：** `ws://` は Experimental APIs が必要で**公開できません**（公開レンズは `wss://`/TLS が必要）。デバイス探索はなく（IP は手動設定）、認証もないため LAN 上の誰でも MIDI を送れます。macOS が最も実績のある経路です。

## 関連リンク

- [MIDIBleepBlop リポジトリ](https://github.com/IoTone/MIDIBleepBlop) ・ [アーキテクチャ文書](https://raw.githubusercontent.com/IoTone/MIDIBleepBlop/main/docs/architecture.md) ・ [Spectacles API 文書](https://raw.githubusercontent.com/IoTone/MIDIBleepBlop/main/docs/spectacles-api.md)
- [Snap Spectacles と Lens Studio をはじめよう](/news/snap-spectacles-lens-studio-入門/) — ツールチェーン
- [Spectacles プロジェクトを格上げする Lens Studio アセット 6 選](/news/lens-studio-アセット-spectacles/) — 構成要素
- [Spectacles のバイブコーディング](/news/vibe-coding-spectacles-入門/) — AI 支援のレンズスクリプティング
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
