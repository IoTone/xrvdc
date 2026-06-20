---
title: "XR のバイブコーディング — ヘッドセットアプリを AI エージェントに書かせる"
date: 2026-06-18T10:00:00+09:00
slug: "vibe-coding-xr-入門"
tag: "スターター"
summary: "空間シーンを自然言語で説明し、AI エージェントに組ませる。ドイツテレコムの Terry Schussler による AWE 系の 2 つの講演が、その実践版を見せます——Cursor と Windsurf を Claude と Grok で駆動し、意図から VR・AR アプリを、ネイティブの visionOS と Android XR まで作る。Google XR Labs の XR Blocks + Gemini は、同じループの研究版です——意図、計画、デスクトップシミュレータでのプレビュー、ヘッドセットへのデプロイ、改善。ループの仕組み、XR がなぜその難所なのか、そしてハッカソンでの組み方を解説します。"
---

「バイブコーディング」——**Andrej Karpathy** が 2025 年 2 月に名付けた、コードはモデルに書かせ、人は意図のレベルで舵を取るやり方——は、XR と相性が良い。空間アプリはボイラープレート（シーングラフ、アンカー、レンダー設定）が重く、人が手で書くべきビジネスロジックは軽い——まさに AI コーディングエージェントが得意とする形です。問われるのは「動くか」ではなく、**エージェントのループ**がどこで閉じるか——意図を入れ、動くヘッドセットアプリが出て、その間にエージェントがビルドを回し、結果を読み、自分で直す、というループです。

これを具体にする筋が二つあります。一つは実践寄り——**Terry Schussler**（ドイツテレコム、次世代デバイス担当シニアディレクター）による AWE 系の 2 講演。もう一つは研究寄り——**Google XR Labs の「Vibe Coding XR」**で、大規模言語モデルを専用の XR フレームワークに配線し、出力を計測します。

▸ [Vibe Coding for XR — Schussler, AWE USA 2025](https://www.youtube.com/watch?v=-GE_CpRvY4o) · [Dual Reality: Native XR for visionOS & Android XR — Schussler](https://www.youtube.com/watch?v=pmsVCwAeVKk) · [XR Blocks (Google XR Labs)](https://xrblocks.github.io/)

## 実践の視点 — Schussler の 2 講演

**「Vibe Coding for XR」**（AWE USA 2025、2025 年 6 月）で Schussler は、XR プロトタイピングを圧縮する手段として AI 駆動開発を辿ります。構成は、ありふれた AI エディタを空間ターゲットに向けたもの——**Cursor** と **Windsurf** をエージェント型エディタとして、背後に **Claude Sonnet**（3.5 → 4.x 系）と **Grok** を据え、自然言語——そして音声——のプロンプトを機能する VR・AR アプリに変えます。講演はツールのデモというより手法です——効くプロンプトのパターン、AI 生成コードの troubleshoot のしかた、そしてモデルの限界が実際どこにあるか——開発者が舵を取り戻すべき頃合いを知るために。

対になる講演 **「Dual Reality: Vibe Coding Native XR for visionOS and Android XR」** は、同じ手法を二つのネイティブプラットフォームに同時に向けます——Apple の visionOS と Google の Android XR。この組み合わせがこの読者には有用です——本シリーズがネイティブに扱ってきた [Vision Pro](/news/vision-pro-mixed-reality-realitykit-arkit-入門/) と [Android XR](/news/androidxr-入門/) のスタックに、単一エンジンではなく、同じ意図駆動のループを当てたものだからです。

両講演を貫くのは——開発者は意図と判断を、エージェントはタイピングを供給する、ということ。「デモ」から「出荷」へ移す技能は、エージェントを接地させ続ける術にあります——研究の筋が具体的になるのが、まさにそこです。

## ループを具体に — XR Blocks + Gemini

Google XR Labs の **「Vibe Coding XR」**（論文＋オープンなフレームワーク [xrblocks.github.io](https://xrblocks.github.io/)）は、同じ発想を計測できるよう作ったものです。効かせる要素は二つ：

- **XR Blocks** — オープンソースで LLM ネイティブな **WebXR** フレームワーク（内部は three.js + WebXR）で、意図的に簡潔な「Reality Model」を露出します——環境知覚、ハンドトラッキング、物理・衝突、レンダリングという小さな空間語彙で、自然言語に綺麗に対応し、**モデルのコンテキストウィンドウに収まります**。従来のゲームエンジンの階層は収まりません——その簡潔さこそが肝です。
- **Gemini** に、XR Blocks の表面を教え、厳選したサンプルコードを種として与えるシステムプロンプトを渡し、API を捏造する代わりにシーンを計画させます。

ループはこう回ります——プロンプト（「手に反応するタンポポ」）→ モデルがシーン・知覚・インタラクションを計画して XR Blocks コードを出す → **デスクトップの「シミュレートされた現実」プレビュー**でヘッドセットなしに確認 → **Android XR ヘッドセットへデプロイ**し体とハンドのインタラクション → 改善して再共有。著者らは 60 プロンプトのパイロットセット（**VCXR60**）で評価し、高いワンショット成功率を報告しています——**Gemini Flash** は約 20 秒で返り、**Pro** は遅いがより信頼できます。率直な留保も彼ら自身のものです——XR の評価は本当に難しい、アプリが*動く*ことの確認には、やはり実機での手作業のテストが要りがちだからです。

## XR がバイブコーディングの難所である理由

空間アプリが、ふつうのウェブやスマホアプリよりエージェントに難しい摩擦が二つあり、どちらも本シリーズが [Android Studio のエージェント開発](/news/agentic-coding-android-studio-入門/)で当たった教訓そのものです：

- **API がモデルより新しい。** XR プラットフォームは速く動き、SDK の表面は入れ替わります——Jetpack XR はまだ `1.0.0-alphaNN`、visionOS は操作系 API をバージョンごとに足します。学習データから API を思い出すモデルは、改名・削除済みの呼び出しを自信満々に挙げます。直し方は接地——バージョンを固定し、実際の API 表面とドキュメントリンクをエージェントが読む場所に置き、公式サンプルを参照として開いておく。XR Blocks はモデルに小さく現行の語彙を直接与えることでこれを回避します。フルエンジンでは、その接地を開発者が供給せねばなりません。
- **ビルドログだけでは判定しきれない。** コンパイルが通るウェブアプリはおそらく描画されます。コンパイルが通る XR アプリは、それでもアンカーが違う場所にあったり、パネルが手の届かない位置にあったり、インタラクションがヘッドセットの中でだけ妙に感じられたりします。エージェントは*コンパイル*のループは自力で閉じられます。*感触が正しいか*のループには、ヘッドセットを着けた人がまだ要ります。デスクトップシミュレータ（XR Blocks のプレビュー、あるいは [Android XR エミュレータ](/news/androidxr-入門/)）はそのループを短くしますが、実機確認をなくしはしません。

## ハッカソンでの組み方

手法はエンジン非依存で、どのスタックを選んでもレシピは同じです：

- **ターゲットを決めてからツールを。** 意図からヘッドセットまで最速のループなら、**XR Blocks + 有能なモデル**は崩しにくい——WebXR で、ブラウザで走り、デスクトップでプレビューできます。ネイティブビルドなら、エージェント型エディタ（**Cursor**、**Windsurf**、**Claude Code**、または **Gemini in Android Studio**）を [Vision Pro](/news/vision-pro-mixed-reality-realitykit-arkit-入門/) や [Android XR](/news/androidxr-入門/) のスタックに向けます。
- **エージェントを接地させる。** 正確なビルド／実行／デプロイのコマンド、固定した SDK バージョン、実際の API 名を、エージェントが毎ターン読むメモリファイル（`CLAUDE.md` / `AGENTS.md`）に置きます。XR ではこれは任意ではありません——コンパイルが通るコードと API を捏造するコードの分かれ目です。
- **まずシミュレータでループを閉じる。** エージェントにビルドさせ、デスクトップシミュレータかエミュレータでプレビューし、結果を読んで反復させ——それからヘッドセットへ移し、着けた人にしかできない判断を下します。
- **人は意図と感触に専念する。** エージェントはシーングラフが速く、センスが遅い。浮いた時間を、それが評価できないもの——快適さ、リーチ、奥行き、そしてそのインタラクションが本当に楽しいか——に使いましょう。

## 注意点

- **ワンショット成功は「良い」とは別物。** 高い初回コンパイル率は実在し有用ですが、「ビルドが通った」は天井ではなく床です——空間アプリが本当に判定されるのは実機での通過です。
- **フレームワークとモデル構成は動く。** XR Blocks は若く、版が進みます（現行リリースまで多くの反復を経ています）。エディタのモデルメニュー（Claude、Grok、Gemini）も頻繁に変わります。特定のバージョンはスナップショットと捉え、当日に確認を。
- **WebXR とネイティブは本物の分岐。** XR Blocks は最速の道だがブラウザ内に住みます（そして WebXR の AR 対応はヘッドセット間でばらつきます）。ネイティブの visionOS／Android XR はフルなプラットフォーム機能を買えますが、より重く接地を要するループが代償です。
- **講演は実践デモであって仕様ではない。** Schussler のセッションは手法とライブビルドであり、保守された API ではありません——ワークフローとプロンプトのパターンに使い、現行の詳細はフレームワークのドキュメントに頼りましょう。

## 関連リンク

- [Vibe Coding for XR — Terry Schussler, AWE USA 2025](https://www.youtube.com/watch?v=-GE_CpRvY4o) · [Dual Reality: Vibe Coding Native XR for visionOS and Android XR](https://www.youtube.com/watch?v=pmsVCwAeVKk)
- [XR Blocks (Google XR Labs)](https://xrblocks.github.io/) · [Vibe Coding XR — Google Research ブログ](https://research.google/blog/vibe-coding-xr-accelerating-ai-xr-prototyping-with-xr-blocks-and-gemini/)
- 関連：[Android Studio でエージェント開発](/news/agentic-coding-android-studio-入門/) — Android XR 版の同じループ · [Spectacles のバイブコーディング](/news/vibe-coding-spectacles-入門/) — Lens Studio 版 · [はじめての Vision Pro MR シーン](/news/vision-pro-mixed-reality-realitykit-arkit-入門/) · [Android XR 入門](/news/androidxr-入門/)
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
