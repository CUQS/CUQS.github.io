// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Back to top smooth behavior is provided by CSS scroll-behavior.
// Theme toggle (light / dark / system)
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

function setTheme(t) {
  if (t === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', t);
  }
  localStorage.setItem('theme', t);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (!saved || saved === 'system') {
    setTheme('system');
  } else {
    setTheme(saved);
  }
}
initTheme();

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'system';
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    setTheme(next);
    themeBtn.title = `主题：${next}`;
  });
}

// Improve external link security
for (const a of document.querySelectorAll('a[target="_blank"]')) {
  a.rel = 'noreferrer noopener';
}

// Auto-expand research section when clicking a chip link pointing to a research card
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.chip[href^="#card-"]');
  if (!link) return;
  const targetId = link.getAttribute('href').slice(1);
  const target = document.getElementById(targetId);
  const research = document.getElementById('research');
  if (target && research && research.contains(target) && research.classList.contains('collapsed')) {
    e.preventDefault();
    research.classList.remove('collapsed');
    const header = research.querySelector('h2');
    if (header) header.setAttribute('aria-expanded', 'true');
    // Wait for the expand transition to finish so layout is stable
    const cards = research.querySelector('.cards');
    const scrollToTarget = () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (cards) {
      cards.addEventListener('transitionend', scrollToTarget, { once: true });
      // Fallback in case no transition fires (e.g. prefers-reduced-motion)
      setTimeout(scrollToTarget, 400);
    } else {
      setTimeout(scrollToTarget, 400);
    }
  }
});

// Floating back-to-top button visibility
const floatingTop = document.getElementById('floating-top');
function updateFloatingTop() {
  if (!floatingTop) return;
  if (window.scrollY > 200) {
    floatingTop.classList.add('visible');
  } else {
    floatingTop.classList.remove('visible');
  }
}
updateFloatingTop();
window.addEventListener('scroll', updateFloatingTop);

// Research section: default collapsed; header toggles collapse/expand; clicking a card will expand it
const researchSection = document.getElementById('research');
if (researchSection) {
  const researchHeader = researchSection.querySelector('h2');
  const cards = researchSection.querySelector('.cards');

  if (cards && !cards.id) {
    cards.id = 'research-cards';
  }

  // Sync initial aria state with class
  if (researchHeader) {
    researchHeader.setAttribute('aria-controls', cards ? cards.id : 'research-cards');
    if (researchSection.classList.contains('collapsed')) {
      researchHeader.setAttribute('aria-expanded', 'false');
    } else {
      researchHeader.setAttribute('aria-expanded', 'true');
    }

    const toggleResearch = () => {
      const collapsed = researchSection.classList.toggle('collapsed');
      researchHeader.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    };

    researchHeader.addEventListener('click', toggleResearch);
    researchHeader.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleResearch(); }
    });

    // Clicking any card expands the section (but doesn't collapse)
    if (cards) {
      cards.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
          if (researchSection.classList.contains('collapsed')) {
            researchSection.classList.remove('collapsed');
            researchHeader.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }
  }
}

// ===================== Language Switching (EN ↔ JA) =====================
const i18nJA = {
  // Skip link
  'skip-link': 'メインコンテンツへスキップ',

  // Brand / Header
  'brand-subtitle': '電気通信大学 博士課程',

  // Navigation
  'nav-about': '紹介',
  'nav-education': '学歴',
  'nav-internships': 'インターンシップ',
  'nav-awards': '受賞歴',
  'nav-research': '研究業績',
  'nav-skills': 'スキル',
  'nav-hobbies': '趣味',

  // Hero
  'hero-lead': '電気通信大学 博士課程 · 東京都',
  'hero-intro': 'はじめまして、陳俊文（チン シュンブン）と申します。中国四川省出身です。現在、電気通信大学の柳井研究室に所属し、博士課程に在籍しています。主な研究テーマは「人物-物体インタラクション検出」、「MLLM（マルチモーダル大規模言語モデル）」および「AIGC（AI生成コンテンツ）」です。',
  'hero-contact': 'お問い合わせ',

  // Meta info
  'meta-email': 'メール',
  'meta-location': '所在地',
  'meta-location-val': '東京都',
  'meta-github-personal': '個人GitHub',
  'meta-github-research': '研究GitHub',
  'meta-scholar': 'Google Scholar',
  'meta-scholar-link': 'Scholar プロフィール',

  // Visitor map
  'visitor-map-title': '🌍 訪問者マップ',

  // About
  'about-title': '紹介',
  'about-desc': '修士課程から博士課程にかけて、<strong class="keyword">コンピュータビジョン</strong>分野における<strong class="keyword">深層学習</strong>の研究を行い、<strong class="keyword">人-物体インタラクション（HOI）検出</strong>手法の<strong class="keyword">精度</strong>と<strong class="keyword">汎化性能</strong>の向上に取り組んでいます。最近は、マルチモーダル大規模言語モデル（<strong class="keyword">MLLM</strong>）やAI生成コンテンツ（<strong class="keyword">AIGC</strong>）の研究への統合を探求しています。',
  'about-interests-title': '研究テーマ',
  'about-interests-1': '機械学習、深層学習',
  'about-interests-2': 'コンピュータビジョン：物体検出、画像セグメンテーション、視覚的質問応答、動画行動認識',
  'about-interests-3': 'MLLM：マルチモーダル大規模言語モデル',
  'about-interests-4': 'AIGC：テキストから画像生成、マルチレイヤー画像生成、画像編集',
  'about-looking-title': '希望する職種',
  'about-looking-desc': '2026年冬季 研究インターン / フルタイム 研究開発エンジニア / フルタイム 研究員',

  // Education
  'edu-title': '学歴',
  'edu-phd-title': '電気通信大学 · 博士後期課程',
  'edu-phd-major': '専攻：情報学',
  'edu-phd-theme': '研究テーマ：人-物体インタラクション検出手法の効率性と汎用性の向上',
  'edu-ms-title': '電気通信大学 · 修士課程',
  'edu-ms-major': '専攻：情報学',
  'edu-ms-degree': '学位：情報学修士',
  'edu-ms-theme': '研究テーマ：人-物体インタラクション検出手法の改良及び食事行動分析への応用',
  'edu-bs-title': '北方工業大学（中国，北京） · 学士課程',
  'edu-bs-major': '専攻：オートメーション',
  'edu-bs-degree': '学位：電気・制御工学学士',
  'edu-bs-theme': '研究テーマ：深層検出モデルとグラフ畳み込みネットワークによる自動運転シーンセグメンテーション',
  'edu-achievement': '主な業績：',

  // Experience
  'exp-title': 'インターンシップ',
  'exp-msra-title': 'Microsoft Research Asia · フルタイム研究インターン',
  'exp-msra-desc': 'レイアウトベースのマルチレイヤー画像生成および知識グラフベースの画像生成ベンチマークに関する研究。',
  'exp-project-link': 'プロジェクトリンク',
  'exp-report-link': 'レポート/スライド',
  'exp-casia-title': '中国科学院自動化研究所 · フルタイム研究インターン',
  'exp-casia-desc': 'インタラクティブなインスタンスセグメンテーション手法の改良および Huawei Atlas 200 DK AI Kit 向けアプリケーション開発。',

  // Awards
  'awards-title': '受賞歴',
  'award-mva-title': 'Best paper awards in the 18th International Conference on Machine Vision Applications (MVA2023)',
  'award-mva-desc': 'This award has been given since 2011 to the authors of an paper that was most excellent from the viewpoint of machine vision applications.',
  'award-ipsj-pres': '発表タイトル：画像認識技術を活用した冷蔵庫内食材自動判別システムの開発',
  'award-ipsj-role': 'ティーチングアシスタントとして、受講生のプロジェクトをサポートしました。',

  // Research
  'research-title': '研究業績 <small class="note" data-i18n="research-note">クリックで展開/折りたたみ</small>',
  'research-note': 'クリックで展開/折りたたみ',

  // Skills
  'skills-title': 'スキル',
  'skills-prog-title': 'プログラミング',
  'skills-fw-title': 'フレームワーク/ツール',
  'skills-lang-title': '言語能力',
  'skills-lang-zh': '中国語（母語）',
  'skills-lang-en': '英語（TOEFL 82、TOEIC 845）',
  'skills-lang-ja': '日本語（N1）',

  // Projects
  'projects-title': '個人プロジェクト',
  'proj-words-title': '日本語単語学習アプリ',
  'proj-words-desc': 'Kotlinで開発された、インタラクティブなクイズとフラッシュカードで日本語単語を学習するモバイルアプリケーション。',
  'proj-ski-title': '日本スキー場情報サイト',
  'proj-ski-desc': '日本のスキー場の場所、施設、ユーザーレビューなどの情報を提供するウェブサイト。',
  'proj-ai-desc': 'デプロイが簡単な<strong>リアルタイム</strong>多言語AIアシスタント。音声認識に<strong>Qwen3-ASR</strong>、LLMにOllama + <strong>Qwen3-30B-A3B</strong>、音声合成に<strong>Qwen3-TTS</strong> / <strong>Kokoro</strong>、スマートデバイス制御に<strong>MCP</strong>を統合。',

  // Hobbies
  'hobbies-title': '趣味',
  'hobbies-list': 'テニス、風景撮影、旅行',
  // Business Card
  'biz-name': '<ruby>陳<rp>(</rp><rt>チン</rt><rp>)</rp></ruby> <ruby>俊文<rp>(</rp><rt>シュンブン</rt><rp>)</rp></ruby>',
  'biz-name-sub': 'Junwen Chen',
  'biz-title': '博士後期課程',
  'biz-org': '電気通信大学 柳井研究室',
  'biz-location': '東京都',
  'biz-qr-label': '個人ページ',
  // Research Cards
  // HOI-R1
  'rc-hoir1-1': 'HOI-R1を提案。外部検出モジュールに依存しない、強化学習ベースの初のMLLMフレームワークで人物-物体インタラクション検出（HOID）を実現。',
  'rc-hoir1-2': 'テキストベースの推論プロセスとHOID専用の報酬関数を導入し、純粋な言語駆動型インタラクション検出を可能にした。',
  'rc-hoir1-3': 'HICO-DETにおける実験で、HOI-R1はベースラインの2倍の精度を達成し、高い汎化能力を示した。',

  // Hybrid-SOV
  'rc-hybridsov-1': 'Hybrid-SOVは、効率的なハイブリッドエンコーダとクエリ選択メカニズムを組み込み、視覚特徴量から直接HOIクエリを構築することで、事前定義された埋め込みを排除し、より解釈しやすいデコーディングを実現した。',
  'rc-hybridsov-2': 'DINO-v3の基盤特徴量と組み合わせることで、Hybrid-SOVは優れた推論効率で最先端の精度を達成した。',

  // Hybrid Layout
  'rc-hybridlayout-1': '拡散トランスフォーマー向けのハイブリッドレイアウトフレームワークを提案。大規模なセマンティックレイアウトアノテーションへの依存を低減しつつ、テキストから画像生成における空間精度を維持。',
  'rc-hybridlayout-2': 'レイアウト制御を匿名レイアウト生成とセマンティック精緻化の2段階に分割し、品質チューニングフェーズで最小限の追加計算で視覚的美しさを向上。',
  'rc-hybridlayout-3': '実験により、本手法はSiamLayoutをレイアウト忠実度と視覚品質で上回り、限られたセマンティックレイアウトデータで10倍以上のデータ効率を達成。',

  // Kuzushiji
  'rc-kuzushiji-1': '日本の歴史的文書の保存を支援するため、特にくずし字の古代手書きフォント生成に焦点を当てた。',
  'rc-kuzushiji-2': 'ベクター画像を用いた少数ショット・学習不要の手法を提案し、現代フォントをくずし字スタイルに変換。',
  'rc-kuzushiji-3': '実験により、提案手法が高品質なくずし字フォントを効果的に生成し、従来手法を上回ることを示した。',

  // PosBridge
  'rc-posbridge-1': '局所的なサブジェクト駆動型画像編集に取り組み、学習不要でスケーラブルなフレームワークPosBridgeを提案。カスタムオブジェクトをターゲットシーンに挿入可能。',
  'rc-posbridge-2': '位置埋め込みトランスプラントとCorner Centered Layout戦略を活用し、拡散モデルの構造的・外観的一貫性を維持。',
  'rc-posbridge-3': '実験結果により、PosBridgeは構造保存、視覚的忠実度、計算効率において既存手法を上回ることを示した。',

  // MMMG
  'rc-mmmg-1': '知識画像生成を新しいタスクとして導入し、複数の学問分野・レベルにわたる4,456件の専門家検証済み知識画像プロンプトペアからなる大規模ベンチマークMMMGを提案。',
  'rc-mmmg-2': 'MMMGは統一的な知識グラフ（KG）表現と、事実の忠実性と視覚的明瞭度を測定する新しいMMMG-Scoreによる体系的評価を可能にする。',
  'rc-mmmg-3': '16の主要テキストから画像生成モデルの実験により重大な推論上の限界が明らかになり、提案するFLUX-Reasonベースラインは今後の研究に向けた有望な性能を示した。',

  // PrismLayers
  'rc-prismlayers-1': 'テキストから画像生成のための正確なアルファマットを持つ、初の大規模・高忠実度マルチレイヤー透明画像データセットPrismLayersおよびPrismLayersProを紹介。',
  'rc-prismlayers-2': '学習不要の合成パイプラインと、LayerFLUXおよびMultiLayerFLUXに基づく強力なマルチレイヤー生成モデルART+を提案。',
  'rc-prismlayers-3': '実験およびユーザースタディにより、ART+はオリジナルのARTを上回り、FLUX.1-[dev]に匹敵する視覚品質を達成。編集可能なマルチレイヤー画像生成の基盤を確立。',

  // SOV-STG-VLA
  'rc-sovstgvla-1': '人-物体インタラクション検出（HOID）のためのTransformerベースのフレームワークSOV-STG-VLAを提案。物体検出と動詞認識を分離。',
  'rc-sovstgvla-2': 'Subject-Object-Verb（SOV）デコーディング、Specific Target Guided（STG）デノイジング、Vision-Language Advisor（VLA）を導入し、表現学習と学習効率を向上。',
  'rc-sovstgvla-3': '実験により、SOV-STG-VLAは最近のTransformerベース手法の6倍速い収束で最先端の性能を達成。',

  // RecipeSD
  'rc-recipesd-1': 'Stable Diffusionベースの手法RecipeSDを提案。レシピテキスト情報を取り込み、食品画像合成を強化。',
  'rc-recipesd-2': '事前学習済みレシピエンコーダとImage-like Recipe Transformation（IRT）およびCookNetモデルを使用し、詳細なレシピセマンティクスを拡散プロセスに効果的に注入。',
  'rc-recipesd-3': '実験により、RecipeSDは高品質でレシピに整合した食品画像を生成し、既存のクロスモーダル合成手法を上回ることを示した。',

  // Cross Decoder
  'rc-crossdecoder-1': 'クロスモーダルレシピ検索を強化するためのCross-Modal Embedding Fusing Decoder（Cross Decoder）を提案。',
  'rc-crossdecoder-2': 'Cross DecoderをGAN-Transformerフレームワークに統合し、動的マージン損失を使用して埋め込みの信頼性と検索性能を向上。',
  'rc-crossdecoder-3': 'Recipe1Mデータセットでの実験により、本手法が検索精度と画像生成品質の両方で最先端手法を上回ることを示した。',

  // CATQ
  'rc-catq-1': '既存のPanoptic Scene Graph（PSG）手法の限界に対処し、Contextual Associated Triplet Queries（CATQ）と呼ばれる新しいワンステージフレームワークを提案。',
  'rc-catq-2': 'CATQは主語、目的語、関係の特徴量を別々のブランチでデコードし、インスタンス情報とTriplet Context Fusion Blockにより強化。',
  'rc-catq-3': '実験により、CATQは最先端手法を大幅に上回り、半分の学習時間でRecall@20 34.8、mRecall@20 20.9を達成。',

  // HowToEat
  'rc-howtoeat-1': '食事・食生活マルチメディア分析に焦点を当て、動画・画像における食事行動検出の必要性を強調。',
  'rc-howtoeat-2': '食事に特化したデータの不足に対処するため、66日分の動画と12の食事シーンにわたる95k枚のアノテーション画像からなる大規模データセットHowToEatを構築。',
  'rc-howtoeat-3': 'このデータセットに基づき、単一モデルで手-物体インタラクションと食事行動を同時検出する食事分析システムを開発。',

  // QAHOI
  'rc-qahoi-1': 'クエリベースアンカーを用いたTransformerベースの手法QAHOIを提案し、エンドツーエンドのHOI予測を実現。',
  'rc-qahoi-2': 'QAHOIはマルチスケールアーキテクチャを採用し、物体のサイズと位置の空間的変動を捉え、インタラクション認識精度を向上。',
  'rc-qahoi-3': 'HICO-DETベンチマークでの実験により、Transformerバックボーンを用いたQAHOIが最先端手法を大幅に上回ることを示した。',

  // TNLBT
  'rc-tnlbt-1': 'クロスモーダルレシピ検索と画像生成のためのシンプルかつ効果的なフレームワークTNLBT（Transformer-based Network for Large Batch Training）を提案。',
  'rc-tnlbt-2': 'TNLBTは画像とテキストの両方にTransformerベースのエンコーダを採用し、自己教師あり損失とコントラスティブ損失を組み合わせ、大バッチ学習でクロスモーダル学習を強化。',
  'rc-tnlbt-3': 'Recipe1Mでの実験により、TNLBTが最先端手法を大幅に上回ることを示し、大バッチ学習がレシピ埋め込み学習を改善することを確認。',

  // PQNet
  'rc-pqnet-1': '人-物体インタラクション（HOI）検出のためのParallel Query Network（PQNet）を提案。人物と物体の位置特定を並列デコーディングブランチに分離。',
  'rc-pqnet-2': 'PQNetは主語と目的語の埋め込みに2つのTransformerデコーダを使用し、アテンションメカニズムで表現を融合する動詞デコーダを導入。',
  'rc-pqnet-3': '実験により、PQNetは半分の学習エポックで従来手法を上回る性能を達成。',

  // ContourRend
  'rc-contourrend-1': '物体の輪郭を精緻化し、より鮮明で完全なセグメンテーション結果を達成するセグメンテーション手法ContourRendを提案。',
  'rc-contourrend-2': 'ContourRendは輪郭レンダラーとGCNベースのセグメンテーションモデルを統合し、輪郭ピクセル周辺の高解像度予測に焦点を当てた。',
  'rc-contourrend-3': 'Cityscapesデータセットでの実験により、ContourRendは72.41% mIoUを達成し、ベースラインのPolygon-GCNを1.22%上回った。',
};

// Store original English texts
const i18nEN = {};
let currentLang = localStorage.getItem('lang') || 'ja';

function collectEnglishTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!i18nEN[key]) {
      i18nEN[key] = el.innerHTML;
    }
  });
}

function switchLang(lang, animate) {
  const dict = lang === 'ja' ? i18nJA : i18nEN;
  const elements = document.querySelectorAll('[data-i18n]');

  if (!animate) {
    // No animation on initial load
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });
    document.documentElement.lang = lang === 'ja' ? 'ja' : 'en';
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateLangBtn();
    return;
  }

  // Phase 1: fade out
  elements.forEach(el => {
    el.classList.add('i18n-out');
    el.classList.remove('i18n-in');
  });

  // Phase 2: after fade out, swap text and fade in
  setTimeout(() => {
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
      el.classList.remove('i18n-out');
      el.classList.add('i18n-in');
    });
    document.documentElement.lang = lang === 'ja' ? 'ja' : 'en';
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateLangBtn();

    // Clean up animation class
    setTimeout(() => {
      elements.forEach(el => el.classList.remove('i18n-in'));
    }, 450);
  }, 350);
}

function updateLangBtn() {
  const btn = document.getElementById('langBtn');
  if (btn) {
    btn.textContent = currentLang === 'en' ? '日本語' : 'English';
  }
}

// Initialize
collectEnglishTexts();
switchLang(currentLang, false);
updateLangBtn();

const langBtn = document.getElementById('langBtn');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    const next = currentLang === 'en' ? 'ja' : 'en';
    switchLang(next, true);
  });
}

// Business Card Modal
const cardBtn = document.getElementById('cardBtn');
const cardModal = document.getElementById('card-modal');
const cardModalClose = document.getElementById('cardModalClose');

if (cardBtn && cardModal) {
  cardBtn.addEventListener('click', () => {
    cardModal.classList.add('active');
    cardModal.setAttribute('aria-hidden', 'false');
  });

  cardModalClose.addEventListener('click', () => {
    cardModal.classList.remove('active');
    cardModal.setAttribute('aria-hidden', 'true');
  });

  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) {
      cardModal.classList.remove('active');
      cardModal.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cardModal.classList.contains('active')) {
      cardModal.classList.remove('active');
      cardModal.setAttribute('aria-hidden', 'true');
    }
  });
}