---
title: "Android Studio でエージェント開発 — Claude・Cursor・Gemini で Android XR"
date: 2026-06-10T10:00:00+09:00
slug: "agentic-coding-android-studio-入門"
tag: "スターター"
summary: "Android Studio には、複数ファイルを横断して編集し、Gradle を回し、ビルドエラーを自力で直すエージェントが組み込まれています——そして Otter 3 以降は Gemini だけでなく Claude でも駆動できます。3 つのセットアップ（Gemini Agent Mode、Claude Code、Cursor）、効率的なエージェント開発のためのプロジェクトメモリとスキルの組み方、そしてそれを Jetpack XR に向ける方法——落とし穴は、アルファ API がモデルの学習時期より新しいため、エージェントを接地させる必要があることです。"
---

[Jetpack XR](/news/androidxr-入門/) はただの Kotlin と Compose です。これには便利な帰結があります——通常の Android 開発を速くするエージェント開発ツールが、そのまま **Android XR** に効くのです。覚えるべき専用の「XR エージェント」はありません。スマホアプリを組むのと同じセットアップで、空間アプリも組めます。そこへの道は 3 つ、いずれも Android Studio の中か周りにあり、同じ Claude／Cursor のワークフローがそのどれも駆動できます。XR に固有の落とし穴は最後に一つ、そしてそれが効いてきます。

▸ [Gemini Agent Mode](https://developer.android.com/studio/gemini/agent-mode) · [Claude Code for JetBrains](https://code.claude.com/docs/en/jetbrains) · [Android XR samples](https://github.com/android/xr-samples)

## ルート 1 — Gemini in Android Studio、Agent Mode

エージェントはすでに IDE の中にあります。**Agent Mode**——ただのチャットとは別物——は Narwhal Feature Drop（2025 年 7 月）から安定版にあり、**Otter 3**（2026 年 1 月）で大幅に拡張されました。自然言語で高レベルな目標を与えると、計画を立て、複数ファイルを横断して編集し（変更はレビュードロワーに入り編集ごとに承認）、Gradle を回して自分の仕事を検証し、**ビルドエラーを検出して通るまで反復修正**します。Compose UI、ユニットテスト、モックデータも生成し、接続したデバイスやエミュレータも操作できます——デプロイ、スクリーンショット、Logcat 読み取り、`adb shell input` によるアプリ操作まで。

本記事にとって決定的な変化が Otter 3 で入りました。Agent Mode は **モデル選択が自由**になったのです。既定の Gemini に加え、カスタムエンドポイント経由で **Anthropic Claude** や OpenAI GPT を、あるいは **Ollama／LM Studio** 経由でローカルモデルを背後に据えられます。つまり「Android Studio で Claude を使う」の第一の答えは、追加ツール不要——Agent Mode を Claude のエンドポイントに向ければ、組み込みエージェントが Claude で走ります。

▸ [Agent Mode ドキュメント](https://developer.android.com/studio/gemini/agent-mode) · [LLM 柔軟性 + Agent Mode（Otter 3）](https://android-developers.googleblog.com/2026/01/llm-flexibility-agent-mode-improvements.html)

## ルート 2 — Android Studio に組み込む Claude Code

[Claude Code](https://www.anthropic.com/product/claude-code) は Anthropic のターミナルエージェントで、**Android Studio を対応 IDE として明記した公式 JetBrains プラグイン**があります（現在はベータ表記）。導入すると、クイック起動ショートカット、ターミナルではなく IDE の差分ビューアでの差分表示、現在の選択範囲やタブの自動共有、そして——Android で効くのが——IDE 自身の lint／構文の **診断を Claude に返す**機能が加わり、IDE が指摘したものをそのまま直せます。外部ターミナルは `/ide` で接続できます。

Kotlin 専用には、JetBrains の Kotlin Language Server をラップした公式の **Claude Code 向け Kotlin LSP プラグイン**があり、平文での推測ではなく IDE 級の `.kt`／`.kts` 補完をエージェントに与えます。内部では Claude Code は変わらずターミナルで働きます——`./gradlew` タスクや `adb` をシェルコマンドとして回し、Kotlin／XML を編集し、ビルド出力に対して自己修正します。

▸ [Claude Code for JetBrains](https://code.claude.com/docs/en/jetbrains) · [Kotlin LSP プラグイン](https://claude.com/plugins/kotlin-lsp)

## ルート 3 — Android Studio と並べる Cursor

[Cursor](https://cursor.com/) は AI ファーストのエディタ（VS Code フォーク）で、マルチプロバイダー——自前のモデルと同じ手軽さで Claude モデルでも走ります。**ネイティブの Android ツールは持たない**ため、運用パターンは分担になります——AI 駆動のコード変更は Cursor、ビルドと実行は **Gradle CLI** と **ADB**、そして **Android Studio を並べて開いたまま**にしてエミュレータ、デバッガ、Logcat、レイアウトインスペクタ、そして——ここで肝心なのが——XR ツールを担わせます。両者は同じファイルをディスク上で編集し、Android Studio は Gradle 同期で Cursor の編集を拾います。大きな Android ビルドではコミュニティ製 Kotlin 言語サーバーが偽の import エラーを出すことがあります——エディタの赤い波線より Gradle ビルドを信じてください。

## 効率的なエージェント開発のための配線

迷走するエージェントと出荷するエージェントの差は、ほぼ接地（グラウンディング）とフィードバックループの締め方です。同じ 3 つのレバーが、3 ルートすべてに効きます。

- **プロジェクトメモリ。** 正確なビルド・実行コマンド、スタック、プロジェクトの規約を、エージェントが毎プロンプトで読むメモリファイルに置きます——Claude Code なら `CLAUDE.md`、Gemini in Android Studio なら `AGENTS.md`（Narwhal 4 Canary 以降。`GEMINI.md` があればそちらが優先）。実コマンドを明記を——例：`./gradlew installDebug`、`./gradlew testDebugUnitTest`、起動するパッケージ／アクティビティ。これがリポジトリで最も効くファイル一枚です。
- **スキルと MCP。** Gemini Agent Mode と Claude Code はどちらも、反復作業用の再利用可能な **スキル**と、新機能を足す **MCP サーバー**に対応します——たとえばコミュニティ製の ADB／デバイス MCP は、エージェントにエミュレータを直接操作させます。コミュニティ製 MCP はデバイスを任せる前に検証を。
- **ループを閉じさせる。** エージェントの肝は、`./gradlew` を回し、失敗を読み、人がエラーを中継せずに直すことです。複数ファイルのリファクタには計画モードを使い、あとはビルドに判定させましょう。

Android XR プロジェクトを接地させる最小の `AGENTS.md` / `CLAUDE.md`：

```markdown
# Build & run
- Build:   ./gradlew :app:assembleDebug
- Install: ./gradlew :app:installDebug
- Test:    ./gradlew :app:testDebugUnitTest
- Launch:  adb shell am start -n com.example.xr/.MainActivity

# Stack
- Kotlin + Jetpack Compose. Android XR エミュレータが対象（ヘッドセット不要）。
- Jetpack XR SDK — API は 1.0.0-alphaNN で、学習データより新しい。
  androidx.xr.* の API を捏造しないこと。下記ドキュメントで確認できる名前、
  または Hello Android XR サンプルにある名前のみ使うこと。

# 固定・協調済みバージョン — 上げないこと
- androidx.xr.runtime:runtime:1.0.0-alpha14
- androidx.xr.scenecore:scenecore:1.0.0-alpha15
- androidx.xr.compose:compose:1.0.0-alpha14
- androidx.xr.arcore:arcore:1.0.0-alpha14
```

## Android XR に向ける

Jetpack XR は Kotlin と Compose なので、空間 UI は同じコンポジションモデルに空間プリミティブを重ねたものです——`Subspace`、`SpatialPanel`、`Orbiter`、`SpatialRow`／`SpatialColumn`、そして glTF モデルを Compose シーンに直接落とす `SpatialGltfModel`。シーングラフは SceneCore の `Session` + `GltfModelEntity`、知覚は ARCore for Jetpack XR（`Session`、`Anchor`／`AnchorEntity`、`Hand`）。Compose に堪能なエージェントなら、もう大半はできています。

セットアップは標準的な Android XR のセットアップで、[入門記事](/news/androidxr-入門/)が全部を扱っています——最新の **Android Studio Canary**（2026 年 6 月時点で Quail 2 Canary）、ループ全体を **ヘッドセットなしのエミュレータ**で回すための **Android XR システムイメージと AVD**、そして **固定したアルファ依存**——加えて[フォームファクターの分岐](/news/androidxr-入門/)（没入は API 36、グラスは API 34）を先に決めること。Android Studio 自身の XR ツールが仕上げます——**XR エミュレータが IDE 内に埋め込み起動**し、**Jetpack XR のプロジェクトテンプレート**があり、**Layout Inspector が XR アプリに対応**——いずれもエージェントが横で操作する IDE 機能であって、エージェント機能ではありません。

現実的なハッカソンのループ：[android/xr-samples](https://github.com/android/xr-samples) の **Hello Android XR** サンプルを開き、エージェントのメモリファイルをそれとドキュメントに向け、プロンプトで変更を駆動する——`SpatialPanel` を足す、`SpatialGltfModel` で glTF を読む、ARCore で固定する——毎ターン XR エミュレータに対してリビルドさせます。

## 実際に刺さる唯一の落とし穴

**XR の API はモデルを追い越すので、接地していないエージェントはそれを捏造します。** Jetpack XR のライブラリはすべてまだ `1.0.0-alphaNN` で、プレビュー間で表面が入れ替わります——モデルが知っているのは*初期*のアルファであって現在の協調セットではなく、これは何も知らないより質が悪いとも言えます。記憶から API を答えさせると、最新のモデルでさえ、いまも実在する名前に混ぜて、改名・削除済みのコンポーザブルを自信満々に挙げるのです。（実際に検証しました——Claude の最新モデルは、とうに消えた初期アルファのコンポーザブルを「確信あり」と評価し、現行の glTF コンポーザブルを丸ごと見落とし、ドキュメントなしでのコンパイル成功率を自己申告で 30〜50% と見積もりました。）どれにも文書化された XR 固有の知識はありません——Agent Mode も Claude Code も Cursor も、XR を普通の Compose として扱います。直し方は接地で、それは任意ではありません：協調済みのアルファバージョンを固定し、実際の API 表面とドキュメントリンクをメモリファイルに入れ、[公式サンプル](https://github.com/android/xr-samples)をエージェントが読める参照として開いておき、そして **ビルドを最後の砦に**——捏造された API はコンパイルに失敗し、ループを閉じたエージェントはそれを見て直します。

## 注意点

- **エージェントを接地させよ。さもなくば XR API を捏造する。** アルファかつ学習後の Jetpack XR 表面がリスクのすべて。メモリファイル、固定バージョン、開いたサンプル、コンパイルループが対策です。
- **協調済みバージョンを固定。** `androidx.xr.*` は異なるアルファ番号の一揃いのセットで（[SceneCore が `alpha15` で先行](/news/androidxr-入門/)）、一つだけ「親切に」上げるエージェントはビルドを壊します。`libs.versions.toml` で固定を。
- **チャンネルとステータスの注記。** Agent Mode のモデル柔軟性と Claude Code の Android Studio プラグイン（ベータ）は現行だが流動的。Cursor の Android 対応はコミュニティの回避策で、ファーストパーティではありません。XR SDK はまだ Developer Preview 4（アルファ）で、コアライブラリは「まもなく」ベータへ移行予定。
- **二つのツールを開くときのファイル衛生。** プロジェクトは `/Users/<name>/…` 配下に（macOS の Gradle ファイル監視は `/System/Volumes/Data` を飛ばす）。エージェントが `build.gradle.kts` や `libs.versions.toml` を編集したら Gradle 同期を起動。IDE と CLI のデーモンが衝突したら `./gradlew --stop`。
- **イベント時に数点を確認。** Android Studio の Canary コードネームは速く回ります（今日は Quail、明日はその先——固定名でなく*最新*の Canary を）。Gemini CLI のコンシューマー層は 2026 年 6 月 18 日で終了し Antigravity CLI に移行。Agent Mode と Cursor の中のモデル構成も頻繁に変わります。当日に確認を。

## 関連リンク

- [Gemini Agent Mode](https://developer.android.com/studio/gemini/agent-mode) · [Agent files (AGENTS.md)](https://developer.android.com/studio/gemini/agent-files) · [LLM 柔軟性（Otter 3）](https://android-developers.googleblog.com/2026/01/llm-flexibility-agent-mode-improvements.html)
- [Claude Code for JetBrains / Android Studio](https://code.claude.com/docs/en/jetbrains) · [Kotlin LSP プラグイン](https://claude.com/plugins/kotlin-lsp)
- [Jetpack XR SDK](https://developer.android.com/develop/xr/jetpack-xr-sdk) · [android/xr-samples — Hello Android XR](https://github.com/android/xr-samples)
- 関連：[Android XR 入門](/news/androidxr-入門/) — 本記事が土台にする XR セットアップ · [Spectacles のバイブコーディング](/news/vibe-coding-spectacles-入門/) — Lens Studio 版
- [ハッカソン詳細](/hackathon/) — 参加資格、チーム編成、AI ポリシー
- [Luma で参加登録](https://luma.com/i5gerreb)

ご質問は[お問い合わせ](/contact/)ページからどうぞ。
