// Hackathon Path Tool — data layer (questions, paths, starter catalog, weights,
// bilingual strings). Pure data ES module: imported by both the browser app
// (path-app.js) and the headless tests (tests/path/). No DOM, no side effects.

// ───── Starter / Workflow article catalog ─────
// Each entry: en/ja URL + short en/ja label. URLs match the built news pages
// (verified against content/news slugs; JA pages live under /ja/news/…).
export const CATALOG = {
  'styly-sdks':        { en: '/news/styly-sdks-ar-vr/',                        ja: '/ja/news/styly-sdks-ar-vr-入門/',                  t_en: 'Every STYLY SDK for AR & VR',            t_ja: 'STYLY SDK 総覧' },
  'styly-sponsor':     { en: '/news/styly-sponsor/',                           ja: '/ja/news/styly-スポンサー/',                       t_en: 'STYLY sponsor & device access',          t_ja: 'STYLY スポンサー' },
  'snap-lens-start':   { en: '/news/getting-started-snap-spectacles-lens-studio/', ja: '/ja/news/snap-spectacles-lens-studio-入門/',   t_en: 'Getting started with Spectacles & Lens Studio', t_ja: 'Spectacles と Lens Studio 入門' },
  'lens-assets':       { en: '/news/lens-studio-assets-spectacles/',           ja: '/ja/news/lens-studio-アセット-spectacles/',        t_en: 'Six Lens Studio assets',                 t_ja: 'Lens Studio アセット 6 選' },
  'vibe-spectacles':   { en: '/news/vibe-coding-spectacles/',                  ja: '/ja/news/vibe-coding-spectacles-入門/',            t_en: 'Vibe coding for Spectacles',             t_ja: 'Spectacles のバイブコーディング' },
  'midi-bleep':        { en: '/news/midi-bleep-blop-spectacles/',              ja: '/ja/news/midi-bleep-blop-spectacles-入門/',        t_en: 'MIDI Bleep Blop starter',                t_ja: 'MIDI Bleep Blop スターター' },
  'aframe':            { en: '/news/aframe-webxr-starter/',                    ja: '/ja/news/aframe-webxr-入門/',                      t_en: 'A-Frame: fastest way into WebXR',        t_ja: 'A-Frame で WebXR 入門' },
  'babylon':           { en: '/news/babylonjs-webxr-starter/',                 ja: '/ja/news/babylonjs-webxr-入門/',                   t_en: 'Babylon.js engine-grade WebXR',          t_ja: 'Babylon.js で WebXR' },
  'iwsdk':             { en: '/news/immersive-web-sdk-ai-native/',             ja: '/ja/news/immersive-web-sdk-入門/',                 t_en: 'Immersive Web SDK (AI-native)',          t_ja: 'Immersive Web SDK' },
  'avp-realitykit':    { en: '/news/vision-pro-mixed-reality-realitykit-arkit/', ja: '/ja/news/vision-pro-mixed-reality-realitykit-arkit-入門/', t_en: 'First Vision Pro MR scene (RealityKit/ARKit)', t_ja: 'Vision Pro MR 入門 (RealityKit/ARKit)' },
  'visionos-30days':   { en: '/news/visionos-2-30-days/',                      ja: '/ja/news/visionos-2-30日チャレンジ/',              t_en: 'visionOS 30-days on-ramp',               t_ja: 'visionOS 30 日チャレンジ' },
  'avp-manip':         { en: '/news/vision-pro-object-manipulation-visionos26/', ja: '/ja/news/vision-pro-object-manipulation-visionos26-入門/', t_en: 'visionOS 26 object manipulation',      t_ja: 'visionOS 26 オブジェクト操作' },
  'webspatial':        { en: '/news/webspatial-sdk-visionos/',                 ja: '/ja/news/webspatial-sdk-visionos-入門/',           t_en: 'WebSpatial SDK',                         t_ja: 'WebSpatial SDK' },
  'vibe-xr':           { en: '/news/vibe-coding-xr/',                          ja: '/ja/news/vibe-coding-xr-入門/',                    t_en: 'Vibe coding XR (AI agent)',              t_ja: 'Vibe コーディング XR' },
  'androidxr':         { en: '/news/androidxr-getting-started/',               ja: '/ja/news/androidxr-入門/',                         t_en: 'Android XR — no hardware needed',        t_ja: 'Android XR 入門' },
  'agentic-android':   { en: '/news/agentic-coding-android-studio/',           ja: '/ja/news/agentic-coding-android-studio-入門/',     t_en: 'Agentic coding in Android Studio',       t_ja: 'Android Studio のエージェントコーディング' },
  'xreal':             { en: '/news/xreal-android-xr-glasses/',                ja: '/ja/news/xreal-android-xr-glasses-入門/',          t_en: 'XREAL glasses dev',                      t_ja: 'XREAL グラス開発' },
  'meta-wearables':    { en: '/news/meta-wearables-webapp-sdk/',               ja: '/ja/news/meta-wearables-webapp-sdk-入門/',         t_en: 'Meta Ray-Ban wearables web app',         t_ja: 'Meta Ray-Ban ウェアラブル' },
  'unity-polyspatial': { en: '/news/vision-pro-mixed-reality-unity-polyspatial/', ja: '/ja/news/vision-pro-mixed-reality-unity-polyspatial-入門/', t_en: 'Vision Pro MR in Unity (PolySpatial)', t_ja: 'Unity PolySpatial で Vision Pro' },
  'unreal-avp':        { en: '/news/unreal-engine-vision-pro-getting-started/', ja: '/ja/news/unreal-engine-vision-pro-入門/',          t_en: 'Unreal on Vision Pro',                   t_ja: 'Unreal で Vision Pro' },
  'image-blaster':     { en: '/news/image-blaster-xr-pipeline/',               ja: '/ja/news/image-blaster-xr-パイプライン/',          t_en: 'Image → headset scene pipeline',         t_ja: '画像から XR シーン' },
  'godot-quest':       { en: '/news/godot-xr-quest-3/',                        ja: '/ja/news/godot-xr-quest-3-入門/',                  t_en: 'Godot XR on Quest 3',                    t_ja: 'Godot XR で Quest 3' },
  'godot-tools':       { en: '/news/godot-xr-tools-interaction/',              ja: '/ja/news/godot-xr-tools-入門/',                    t_en: 'Godot XR Tools interactions',            t_ja: 'Godot XR Tools 操作' },
  'godot-webxr':       { en: '/news/godot-webxr-browser/',                     ja: '/ja/news/godot-webxr-入門/',                       t_en: 'Ship Godot XR as a URL',                 t_ja: 'Godot XR を URL で公開' },
  'gs-360':            { en: '/news/3dgs-360-camera-workflow/',                ja: '/ja/news/3dgs-360-カメラ-ワークフロー/',           t_en: '3DGS from a 360° camera',                t_ja: '360 カメラで 3DGS' },
  'scaniverse':        { en: '/news/scaniverse-3dgs-webxr-godot/',             ja: '/ja/news/scaniverse-3dgs-webxr-godot-入門/',       t_en: 'Phone-captured splats (Scaniverse)',     t_ja: 'Scaniverse でスプラット' },
  'lito':              { en: '/news/lito-single-image-3dgs-webxr/',            ja: '/ja/news/lito-single-image-3dgs-webxr-入門/',      t_en: 'One photo to a 3D splat (LiTo)',         t_ja: '写真 1 枚から 3D スプラット' },
  'sharp':             { en: '/news/sharp-photo-to-splat-webxr/',              ja: '/ja/news/sharp-photo-to-splat-webxr-入門/',        t_en: 'Photo to splat, fast (SHARP)',           t_ja: 'SHARP で写真からスプラット' },
  'spatial-video':     { en: '/news/spatial-video-capture-to-headset/',        ja: '/ja/news/spatial-video-capture-to-headset-入門/',  t_en: 'Spatial video, end to end',              t_ja: '空間ビデオ 撮影から再生' },
  'make-art':          { en: '/news/make-art-inside-xr/',                      ja: '/ja/news/make-art-inside-xr-入門/',                t_en: 'Make art inside the headset',            t_ja: 'ヘッドセット内でアート制作' },
  'lichtfeld':         { en: '/news/lichtfeld-studio-mcp-xr/',                 ja: '/ja/news/lichtfeld-studio-mcp-xr-入門/',           t_en: 'LichtFeld + MCP (AI splat loop)',        t_ja: 'LichtFeld + MCP' },
};

// ───── Paths (recommendation targets) ─────
// avpRuntime: path runs on Apple Vision Pro WITHOUT a Mac (player/web/viewer/design).
// aiNote_*: AI-emphasis copy that is STRIPPED when the participant opts out of AI.
export const PATHS = {
  P1: {
    id: 'P1', name_en: 'STYLY — no-code spatial', name_ja: 'STYLY — ノーコード空間制作',
    blurb_en: 'Author a scene once and publish it across mobile AR, the web, Quest, and Vision Pro — no engine, no C# required. The strongest on-ramp for artists, designers, students, and teachers.',
    blurb_ja: 'シーンを一度作れば、モバイル AR・ウェブ・Quest・Vision Pro に展開できます — エンジンも C# も不要。アーティスト・デザイナー・学生・教員に最適な入り口です。',
    articles: ['styly-sdks', 'styly-sponsor'], avpRuntime: true,
  },
  P2: {
    id: 'P2', name_en: 'Lens Studio & Snap Spectacles', name_ja: 'Lens Studio と Snap Spectacles',
    blurb_en: 'A visual, asset-driven editor for AR glasses. A natural fit for Unity-minded developers and for non-coders who want to lean on generative AI inside the editor.',
    blurb_ja: 'AR グラス向けのビジュアル中心・アセット駆動のエディタ。Unity 志向の開発者にも、エディタ内で生成 AI を活用したいノンコーダーにも向いています。',
    articles: ['snap-lens-start', 'lens-assets', 'vibe-spectacles', 'midi-bleep'],
    aiNote_en: 'AI option: generate assets and Lenses with AI assistants in the Lens Studio loop.',
    aiNote_ja: 'AI オプション: Lens Studio のワークフロー内で AI アシスタントを使ってアセットや Lens を生成できます。',
  },
  P3: {
    id: 'P3', name_en: 'WebXR in the browser', name_ja: 'ブラウザの WebXR',
    blurb_en: 'Build once, run on almost anything with a browser — including Safari on Apple Vision Pro. The fastest path for coders who are new to XR. A-Frame to start, Babylon.js when you want an engine.',
    blurb_ja: 'いちど作ればブラウザのある端末でほぼ動きます — Apple Vision Pro の Safari も含みます。XR 初心者のコーダーに最速の道。まずは A-Frame、本格的なエンジンが欲しくなれば Babylon.js。',
    articles: ['aframe', 'babylon', 'iwsdk'], avpRuntime: true,
  },
  P4: {
    id: 'P4', name_en: 'Apple visionOS, native (Xcode)', name_ja: 'Apple visionOS ネイティブ (Xcode)',
    blurb_en: 'RealityKit and ARKit in Swift, with Xcode’s built-in AI assistant. The deepest Vision Pro experiences — and it requires an Apple-Silicon Mac to build.',
    blurb_ja: 'Swift の RealityKit と ARKit を、Xcode 内蔵の AI アシスタントとともに。最も作り込める Vision Pro 体験 — ビルドには Apple Silicon Mac が必要です。',
    articles: ['avp-realitykit', 'visionos-30days', 'avp-manip', 'webspatial', 'vibe-xr'],
    aiNote_en: 'AI option: Xcode’s built-in coding assistant scaffolds RealityKit scenes.',
    aiNote_ja: 'AI オプション: Xcode 内蔵のコーディングアシスタントが RealityKit シーンの土台を作ります。',
  },
  P5: {
    id: 'P5', name_en: 'Android XR & AR glasses', name_ja: 'Android XR と AR グラス',
    blurb_en: 'Android Studio with the emulator — no headset required to start — plus paths to XREAL and Meta Ray-Ban display glasses. Comfortable for Android developers.',
    blurb_ja: 'Android Studio とエミュレータ — 開始にヘッドセットは不要 — に加え、XREAL や Meta Ray-Ban ディスプレイグラスへの道も。Android 開発者に馴染みやすい選択肢です。',
    articles: ['androidxr', 'agentic-android', 'xreal', 'meta-wearables'],
    aiNote_en: 'AI option: agentic coding in Android Studio with Claude, Cursor, or Gemini.',
    aiNote_ja: 'AI オプション: Android Studio で Claude・Cursor・Gemini を使ったエージェントコーディング。',
  },
  P6: {
    id: 'P6', name_en: 'Unity & Unreal engines', name_ja: 'Unity と Unreal エンジン',
    blurb_en: 'Full game engines for rich, interactive XR. The home turf for game developers and 3D designers. Targeting Apple Vision Pro natively needs an Apple-Silicon Mac; Quest 3 works from any desktop.',
    blurb_ja: 'リッチでインタラクティブな XR のためのフルゲームエンジン。ゲーム開発者と 3D デザイナーの本拠地。Apple Vision Pro へのネイティブ対応には Apple Silicon Mac が必要ですが、Quest 3 はどの PC からでも可能です。',
    articles: ['unity-polyspatial', 'unreal-avp', 'image-blaster'],
  },
  P7: {
    id: 'P7', name_en: 'Godot XR (free & open)', name_ja: 'Godot XR (無料・オープン)',
    blurb_en: 'A free, open-source engine with built-in OpenXR for Quest 3 — and a WebXR export so you can ship as a URL. Great for students, hobbyists, and developers who want an open toolchain.',
    blurb_ja: 'Quest 3 向け OpenXR を標準搭載した無料・オープンソースのエンジン。WebXR 書き出しで URL として公開もできます。学生・趣味の開発者・オープンなツールチェーンを求める人に最適。',
    articles: ['godot-quest', 'godot-tools', 'godot-webxr'],
  },
  P8: {
    id: 'P8', name_en: 'Creative & capture', name_ja: 'クリエイティブ＆キャプチャ',
    blurb_en: 'Bring the real world in — Gaussian splats, photogrammetry, spatial video, and art made inside the headset. Design in a tool and submit the result as your project. View it all on Apple Vision Pro.',
    blurb_ja: '現実世界を取り込む — ガウシアンスプラット、フォトグラメトリ、空間ビデオ、ヘッドセット内で作るアート。ツールで制作し、その成果物を作品として提出できます。すべて Apple Vision Pro で鑑賞可能。',
    articles: ['gs-360', 'scaniverse', 'lito', 'sharp', 'spatial-video', 'make-art', 'lichtfeld'], avpRuntime: true,
    aiNote_en: 'AI option: keep an AI agent in the splatting loop with LichtFeld Studio + MCP.',
    aiNote_ja: 'AI オプション: LichtFeld Studio + MCP でスプラット制作のループに AI エージェントを組み込めます。',
  },
  P9: {
    id: 'P9', name_en: 'Vibe coding & agentic XR', name_ja: 'バイブコーディングとエージェント XR',
    blurb_en: 'Top-down: write a specification and prompts, and let an AI agent draft the headset app. The fastest way for entrepreneurs to go from idea to a working demo.',
    blurb_ja: 'トップダウン: 仕様とプロンプトを書き、AI エージェントにヘッドセットアプリの下書きを任せます。アイデアから動くデモへ、起業家に最速の道。',
    articles: ['vibe-xr', 'vibe-spectacles', 'agentic-android', 'iwsdk'],
    aiNote_en: 'This path is AI-centric — an agent writes most of the code from your spec.',
    aiNote_ja: 'このパスは AI 中心です — 仕様からエージェントが大半のコードを書きます。',
  },
};

// ───── Questions (Q2b is conditional on role) ─────
export const QUESTIONS = [
  { id: 'firstHack', options: ['yes', 'no'] },
  { id: 'role', options: ['artist', 'coder', 'entrepreneur', 'designer3d', 'uxdesigner', 'teacher', 'student', 'videographer', 'other'] },
  { id: 'gamedev', options: ['yes', 'some', 'no'], showIf: (a) => a.role === 'coder' || a.role === 'designer3d' },
  { id: 'ai', options: ['none', 'low', 'high', 'optout'] },
  { id: 'xr', options: ['new', 'some', 'exp'] },
  { id: 'platform', options: ['macSilicon', 'macIntel', 'pc', 'phoneBrowser'] },
  { id: 'formfactor', options: ['glasses', 'immersive', 'none'] },
];

// ───── Weight table (data-only; tune here, re-run tests/path) ─────
export const WEIGHTS = {
  role: {
    artist:       { P8: 3, P1: 3, P2: 2, P9: 1 },
    coder:        { P3: 3, P5: 2, P4: 2, P6: 2, P9: 1 },
    entrepreneur: { P9: 3, P1: 1, P3: 1, P2: 1 },
    designer3d:   { P6: 3, P8: 2, P7: 2, P2: 1, P1: 1 },
    uxdesigner:   { P1: 2, P3: 2, P2: 2, P9: 1 },
    teacher:      { P1: 3, P7: 1, P8: 1, P9: 1 },
    student:      { P1: 3, P7: 2, P3: 1, P8: 1, P2: 1, P9: 1 },
    videographer: { P8: 3, P1: 1, P2: 1 },
    other:        { P1: 1, P3: 1, P8: 1 },
  },
  firstHack: {
    yes: { P1: 1, P3: 1, P9: 1, P2: 1, P6: -1, P4: -1 },
    no:  { P6: 1, P4: 1 },
  },
  gamedev: {
    yes:  { P6: 3, P2: 2, P7: 2, P3: -1 },
    some: { P6: 1, P7: 1, P2: 1 },
    no:   { P3: 1, P5: 1, P4: 1 },
    na:   {},
  },
  formfactor: {
    glasses:   { P2: 2, P5: 2, P1: 1, P6: -1, P7: -1 },
    immersive: { P3: 1, P7: 2, P6: 1, P4: 1, P1: 1 },
    none:      {},
  },
  ai: {
    high:   { P9: 2, P5: 1, P4: 1, P2: 1, P8: 1 },
    low:    { P9: 1 },
    none:   {},
    optout: { P9: -5, P3: 1, P6: 1, P7: 1 },
  },
  xr: {
    new:  { P1: 1, P3: 1, P9: 1, P2: 1, P6: -1 },
    some: { P3: 1, P6: 1 },
    exp:  { P6: 2, P4: 1, P5: 1, P3: 1 },
  },
  platform: {
    macSilicon:   { P4: 2, P2: 1, P6: 1 },
    macIntel:     { P4: -5, P2: 1, P6: 1, P3: 1 },
    pc:           { P4: -5, P5: 1, P6: 1, P3: 1 },
    phoneBrowser: { P3: 2, P1: 2, P8: 2, P9: 1, P4: -3, P6: -1 },
  },
};

// Deterministic tie-break: low-friction / broadest-reach first.
export const TIE_ORDER = ['P3', 'P1', 'P8', 'P9', 'P5', 'P7', 'P2', 'P6', 'P4'];

// ───── Bilingual UI strings ─────
export const STRINGS = {
  en: {
    intro_title: 'Find your hackathon path',
    intro_body: 'Five quick questions. The tool points you at starter projects that fit how you work — from no-code spatial design to hardcore engine coding.',
    start: 'Start ▸',
    back: '◂ Back',
    restart: '↺ Start over',
    progress: 'Question {n} of {total}',
    result_title: 'Your recommended path',
    result_primary: 'Start here',
    result_alts: 'Also worth a look',
    result_articles: 'Starter projects',
    result_matched: 'Based on your answers',
    avp_footer_title: 'Targeting Apple Vision Pro?',
    avp_footer_body: 'No Mac needed to use the headset: run STYLY scenes, open WebXR in Safari, or view 3D captures and design in-headset. (Building native visionOS in Xcode needs an Apple-Silicon Mac.)',
    needs_mac: 'Needs an Apple-Silicon Mac to build.',
    q: {
      firstHack: { title: 'Is this your first hackathon?', opts: { yes: 'Yes, my first', no: 'No, I’ve done one before' } },
      role: { title: 'Which best describes you?', opts: { artist: 'Artist', coder: 'Coder / Engineer', entrepreneur: 'Entrepreneur', designer3d: '3D designer', uxdesigner: 'UX designer', teacher: 'Teacher', student: 'Student', videographer: 'Videographer / Photographer', other: 'Something else' } },
      gamedev: { title: 'Do you build games?', opts: { yes: 'Yes, with a game engine', some: 'A little', no: 'Not really' } },
      ai: { title: 'How do you feel about using AI tools?', opts: { none: 'Haven’t used them', low: 'Used them a little', high: 'I use them regularly', optout: 'I’d rather not use AI' } },
      xr: { title: 'Your experience with AR / VR / XR / MR?', opts: { new: 'New to me', some: 'Used it before', exp: 'Very experienced' } },
      platform: { title: 'What will you build on?', opts: { macSilicon: 'Mac (Apple Silicon — M1 or newer)', macIntel: 'Older Intel Mac', pc: 'Windows or Linux PC', phoneBrowser: 'A phone or just a browser' } },
      formfactor: { title: 'Which are you more drawn to?', opts: { glasses: 'Lightweight AR glasses', immersive: 'Fully immersive VR / MR', none: 'No preference yet' } },
    },
  },
  ja: {
    intro_title: 'あなたのハッカソンの進み方を見つける',
    intro_body: '5 つの簡単な質問。あなたの取り組み方に合ったスタータープロジェクトを案内します — ノーコードの空間デザインから本格的なエンジン開発まで。',
    start: 'はじめる ▸',
    back: '◂ 戻る',
    restart: '↺ 最初から',
    progress: '質問 {n} / {total}',
    result_title: 'おすすめのパス',
    result_primary: 'ここから始める',
    result_alts: 'こちらも検討',
    result_articles: 'スタータープロジェクト',
    result_matched: 'あなたの回答に基づく',
    avp_footer_title: 'Apple Vision Pro を狙う？',
    avp_footer_body: 'ヘッドセットの利用に Mac は不要です: STYLY シーンの再生、Safari での WebXR、3D キャプチャの鑑賞、ヘッドセット内でのデザインが可能。(Xcode でのネイティブ visionOS ビルドには Apple Silicon Mac が必要です。)',
    needs_mac: 'ビルドには Apple Silicon Mac が必要です。',
    q: {
      firstHack: { title: 'ハッカソンは初めてですか？', opts: { yes: 'はい、初めてです', no: 'いいえ、経験があります' } },
      role: { title: 'あなたに最も近いのは？', opts: { artist: 'アーティスト', coder: 'コーダー / エンジニア', entrepreneur: '起業家', designer3d: '3D デザイナー', uxdesigner: 'UX デザイナー', teacher: '教員', student: '学生', videographer: 'ビデオグラファー / 写真家', other: 'その他' } },
      gamedev: { title: 'ゲームを作りますか？', opts: { yes: 'はい、ゲームエンジンで', some: '少し', no: 'あまり' } },
      ai: { title: 'AI ツールの利用についてどう感じますか？', opts: { none: '使ったことがない', low: '少し使った', high: '日常的に使う', optout: 'できれば AI は使いたくない' } },
      xr: { title: 'AR / VR / XR / MR の経験は？', opts: { new: '初めて', some: '使ったことがある', exp: 'とても慣れている' } },
      platform: { title: '何で開発しますか？', opts: { macSilicon: 'Mac (Apple Silicon — M1 以降)', macIntel: '旧 Intel Mac', pc: 'Windows / Linux PC', phoneBrowser: 'スマホ、またはブラウザだけ' } },
      formfactor: { title: 'より惹かれるのは？', opts: { glasses: '軽量な AR グラス', immersive: '没入型の VR / MR', none: 'まだ決めていない' } },
    },
  },
};
