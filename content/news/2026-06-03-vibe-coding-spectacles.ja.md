---
title: "Spectacles のバイブコーディング — Lens Studio を AI アシスタントで動かす"
date: 2026-06-03T10:00:00+09:00
slug: "vibe-coding-spectacles-入門"
tag: "スターター"
summary: "Cursor、VS Code Copilot、Claude Code といった AI コーディングアシスタントで Lens Studio を動かす方法。TypeScript スクリプティング、自動生成される型定義、そして Lens Studio の MCP サーバー（シーングラフの照会、オブジェクト生成、アセットのインストールをアシスタントが直接実行）を解説します。Andrew Douglas 氏の Spectacles チュートリアルに着想を得ています。"
---

「バイブコーディング」— やりたいことを自然言語で伝え、AI アシスタントにコードの記述と配線を任せる手法 — は [Snap Spectacles](/news/snap-spectacles-lens-studio-入門/) のレンズ制作にも使えます。AR 開発者の **Andrew Douglas** 氏は、[*Vibe Coding For Spectacles Tutorial*](https://www.youtube.com/watch?v=RzIyVkQfGOI) で [Lens Studio](https://ar.snap.com/lens-studio) を **Cursor** と **VS Code の GitHub Copilot** と組み合わせるワークフローを実演しています。本記事では、その背後にあるツールチェーンと、ハッカソン向けのセットアップ方法を整理します。

レイヤーは 2 つあります。AI 支援による**スクリプティング**（アシスタントが Lens Scripting API に対して TypeScript を書く）と、AI 支援による**シーン制御**（アシスタントが MCP サーバー経由で Lens Studio 自体を操作する）です。後者こそが、このワークフローを単なる入力補完ではなくバイブコーディングらしいものにしています。

## レイヤー 1：外部エディターでの TypeScript スクリプティング

Lens Studio 5.0 以降、スクリプトは **TypeScript または JavaScript** で記述できます。内蔵エディターは TypeScript の自動補完に対応していないため、Snap は外部エディターの利用を推奨しています。Asset Browser でスクリプトを右クリックし、**Open in External Editor** を選びます。

AI 支援の精度を左右する要点は、Lens Studio がプロジェクトの `Support` フォルダーに **TypeScript 定義ファイル（`.d.ts`）** を書き出すことです。保存済みのプロジェクトフォルダーを VS Code や Cursor など `.d.ts` を読み取るエディターで開けば、開発者**と AI アシスタントの両方**が実際の Lens Scripting API を型補完として得られ、存在しない API の捏造を大幅に抑えられます。

任意の [Lens Studio VS Code 拡張機能](https://developers.snap.com/lens-studio/features/scripting/vscode-extension)を入れると、コードスニペット（`ls_` を入力するとインプット宣言、イベント、UI ウィジェット、コンポーネントアクセス、数値ヘルパーが呼び出せます）、IntelliSense、ブレークポイントデバッグが加わります。

## レイヤー 2：Developer Mode と MCP サーバー

[Developer Mode with VS Code](https://developers.snap.com/lens-studio/features/lens-studio-ai/developer-mode-with-vscode) は、Lens Studio 内で **MCP（Model Context Protocol）サーバー**を起動します。AI アシスタントを接続すると、テキストを提案するだけでなく、プロジェクトに対して直接操作を行えます。サーバーが公開するツールは次のとおりです。

- シーン構造の照会（`GetLensStudioSceneGraph`）
- シーンオブジェクトの生成・変更（`CreateLensStudioSceneObject`）
- プロジェクトのコンポーネントとアセットの管理
- インタラクティブ要素のためのスクリプト生成・統合
- アセットライブラリからのアセット検索・インストール
- プロジェクトの問題のデバッグ

MCP に対応しているため、**VS Code Copilot、Cursor、Claude Code** で利用できます。

### セットアップ

1. アセットライブラリから **Chat Tool Package** をインストールします（Lens Studio 5.x が必要）。
2. Lens Studio で **AI Assistant → MCP → Configure Server → Start Server** を実行します。
3. プロジェクトルートに `.vscode/mcp.json` を作成し、Lens Studio のポップアップに表示される設定を貼り付けます。
4. エディター側で **Start** をクリックして接続を有効化し、MCP パネルで確認します。
5. エディターのチャットからプロンプトを送ります。オブジェクトの追加、スクリプトの記述、アセットのインストールを依頼すると、開いている Lens Studio プロジェクトに対して実行されます。

挙動をより安定させるには、`.github/chatmodes/lens-studio.md` を追加し、Lens Studio の作法やプロジェクトのワークフローを記したカスタムシステムプロンプトを与えます。

## 注意点

- **モデルに文脈を与えること。** プロジェクトフォルダーを開いて `.d.ts` の型を読み込ませ、[Lens Scripting API リファレンス](https://developers.snap.com/lens-studio/api/lens-scripting/)を参照できるようにし、チャットモードを使います。文脈がないと、存在しない Lens Studio API を捏造します。
- **MCP サーバーが操作するのはエディター側の Lens Studio インスタンスであり、グラス本体ではありません。** Spectacles のペアリングを行い、**Send to Spectacles** やエディター内プレビューで実機テストする必要があります。
- **Lens Studio 5.x と MCP 対応エディターが必要です。** この連携はエディターのネイティブ MCP サポートに依存します。

## 関連リンク

- [動画：Vibe Coding For Spectacles Tutorial](https://www.youtube.com/watch?v=RzIyVkQfGOI) — Andrew Douglas 氏（Cursor と VS Code Copilot を解説）
- [Developer Mode with VS Code（MCP サーバー）](https://developers.snap.com/lens-studio/features/lens-studio-ai/developer-mode-with-vscode)
- [Lens Studio VS Code 拡張機能](https://developers.snap.com/lens-studio/features/scripting/vscode-extension)
- [Lens Scripting API リファレンス](https://developers.snap.com/lens-studio/api/lens-scripting/)
- [GitHub の specs-devs](https://github.com/specs-devs) — Spectacles 開発者コミュニティのサンプル
- [Spectacles プロジェクトを格上げする Lens Studio アセット 6 選](/news/lens-studio-アセット-spectacles/) — バイブコーディングの素材になる部品
- [Snap Spectacles と Lens Studio をはじめよう](/news/snap-spectacles-lens-studio-入門/) — ツールチェーンを一から
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

*コミュニティスポットライト — Andrew Douglas 氏。Cursor と Copilot のワークフローは同氏のチュートリアルによるもので、MCP とスクリプティングの詳細は Snap の公式ドキュメントに基づいています。* ご質問は[お問い合わせ](/contact/)ページからどうぞ。
