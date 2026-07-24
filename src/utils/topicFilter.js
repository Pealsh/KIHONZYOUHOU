// 出題優先度に基づくトピック定義・問題フィルタ
import { generateCalculationProblems } from './calculationGenerator';
import { generateSubjectBProblems } from './subjectBGenerator';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function textOf(q) {
  return [
    q.category || '',
    q.subcategory || '',
    q.question || '',
    q.hint || '',
    q.explanation || '',
    ...(q.choices || []),
  ].join('\n');
}

function matchesKeywords(q, keywords) {
  const t = textOf(q);
  return keywords.some((kw) => t.includes(kw));
}

/**
 * 優先度付きトピック定義
 * stars: 5 = ★★★★★, 4 = ★★★★☆, 3 = ★★★☆☆
 * source: 'bank' | 'calculation' | 'algorithm' | 'mixed'
 */
export const PRIORITY_TOPICS = [
  // ★★★★★
  {
    id: 'security',
    name: 'セキュリティ',
    icon: '🔐',
    stars: 5,
    source: 'mixed',
    keywords: [
      'セキュリティ', '暗号', '認証', '署名', 'ファイアウォール', 'VPN', 'TLS', 'SSL',
      'ハッシュ', 'マルウェア', 'ランサム', 'XSS', 'SQLインジェクション', 'WAF',
      '脆弱', '攻撃', 'リスク', 'ISMS', '機密性', '完全性', '可用性', '多要素',
      'ソーシャルエンジニアリング', 'ブルートフォース', '公開鍵', '共通鍵',
    ],
    defaultCount: 25,
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: '🗃️',
    stars: 5,
    source: 'bank',
    keywords: [
      'SQL', 'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'WHERE', 'GROUP BY',
      'HAVING', 'ORDER BY', 'トランザクション', 'COMMIT', 'ROLLBACK', '正規化',
      '主キー', '外部キー', 'インデックス', 'ビュー', 'ストアド',
    ],
    defaultCount: 20,
  },
  {
    id: 'network',
    name: 'ネットワーク',
    icon: '🌐',
    stars: 5,
    source: 'bank',
    keywords: [
      'ネットワーク', 'TCP', 'UDP', 'IP', 'OSI', 'HTTP', 'HTTPS', 'DNS', 'DHCP',
      'ルーティング', 'スイッチ', 'ルータ', 'LAN', 'WAN', 'MAC', 'ARP', 'ICMP',
      'プロトコル', 'ポート', 'サブネット', 'NAT', 'プロキシ', 'SMTP', 'FTP',
    ],
    defaultCount: 25,
  },
  {
    id: 'os',
    name: 'OS',
    icon: '🖥️',
    stars: 5,
    source: 'bank',
    keywords: [
      'オペレーティング', 'OS', 'プロセス', 'スレッド', 'スケジューリング',
      '仮想記憶', 'ページング', 'セマフォ', 'デッドロック', '割り込み',
      'カーネル', 'ファイルシステム', 'ディレクトリ', 'マルチタスク',
      '排他制御', 'コンテキストスイッチ',
    ],
    defaultCount: 20,
  },
  {
    id: 'cpu',
    name: 'CPU',
    icon: '⚙️',
    stars: 5,
    source: 'bank',
    keywords: [
      'CPU', 'プロセッサ', 'クロック', 'パイプライン', 'キャッシュメモリ',
      'レジスタ', '命令', 'MIPS', 'クロック周波数', 'マルチコア',
      'アセンブラ', '機械語', 'ALU', '制御装置', '演算装置',
    ],
    defaultCount: 20,
  },
  {
    id: 'database',
    name: 'データベース',
    icon: '🗄️',
    stars: 5,
    source: 'bank',
    keywords: [
      'データベース', 'DBMS', 'RDB', 'E-R', '正規化', 'トランザクション',
      'ACID', 'ロック', 'デッドロック', 'スキーマ', 'テーブル', 'リレーション',
      '参照整合', 'インデックス', 'バックアップ', 'レプリケーション',
      'OLAP', 'OLTP', 'NoSQL',
    ],
    defaultCount: 25,
  },

  // ★★★★☆
  {
    id: 'algorithm',
    name: 'アルゴリズム',
    icon: '🧩',
    stars: 4,
    source: 'algorithm',
    keywords: [
      'アルゴリズム', 'ソート', '探索', 'スタック', 'キュー', '再帰',
      '計算量', 'オーダー', '整列', '2分探索', 'データ構造', '擬似言語',
    ],
    defaultCount: 20,
  },
  {
    id: 'calculation',
    name: '計算問題',
    icon: '🧮',
    stars: 4,
    source: 'calculation',
    keywords: [],
    defaultCount: 30,
  },
  {
    id: 'software',
    name: 'ソフトウェア開発',
    icon: '🛠️',
    stars: 4,
    source: 'bank',
    keywords: [
      'ソフトウェア', '開発', 'テスト', 'ウォーターフォール', 'アジャイル',
      'モジュール', '結合', '単体テスト', '結合テスト', 'システムテスト',
      '要件定義', '設計', '保守', 'レビュー', 'デバッグ', 'UML',
      'オブジェクト指向', '継承', 'カプセル化', 'デザインパターン',
      'DevOps', 'CI', 'CD', 'バージョン管理',
    ],
    defaultCount: 25,
  },

  // ★★★☆☆
  {
    id: 'management',
    name: 'マネジメント',
    icon: '📊',
    stars: 3,
    source: 'bank',
    categoryExact: 'マネジメント',
    keywords: ['マネジメント', 'プロジェクト', 'サービスマネジメント', 'SLA', 'WBS', 'EVM'],
    defaultCount: 25,
  },
  {
    id: 'strategy',
    name: 'ストラテジ',
    icon: '🎯',
    stars: 3,
    source: 'bank',
    categoryExact: 'ストラテジー',
    keywords: ['ストラテジ', '経営', 'マーケティング', 'ビジネス', '法務', '知的財産'],
    defaultCount: 25,
  },
];

export function starsLabel(stars) {
  if (stars >= 5) return '★★★★★';
  if (stars === 4) return '★★★★☆';
  return '★★★☆☆';
}

export function getTopicsByStars(stars) {
  return PRIORITY_TOPICS.filter((t) => t.stars === stars);
}

/** 既存問題バンクからトピックに合う問題を抽出 */
export function filterQuestionsByTopic(allQuestions, topic) {
  if (!topic) return [];

  if (topic.categoryExact) {
    const byCat = allQuestions.filter((q) => q.category === topic.categoryExact);
    // カテゴリ一致があればそれを優先、なければキーワード
    if (byCat.length > 0) return byCat;
  }

  if (!topic.keywords || topic.keywords.length === 0) return [];

  return allQuestions.filter((q) => matchesKeywords(q, topic.keywords));
}

/**
 * トピック用の問題セットを用意（足りない場合は生成で補完）
 */
export function buildTopicQuiz(allQuestions, topicId, count) {
  const topic = PRIORITY_TOPICS.find((t) => t.id === topicId);
  if (!topic) return { questions: [], topic: null, useMemo: false };

  const n = count || topic.defaultCount;
  let questions = [];
  let useMemo = false;

  if (topic.source === 'calculation') {
    questions = generateCalculationProblems(n);
    useMemo = true;
  } else if (topic.source === 'algorithm') {
    // 科目Bからアルゴリズム寄りを生成し、セキュリティ比率を下げたセット
    const generated = generateSubjectBProblems(Math.ceil(n * 1.25));
    const algo = generated.filter((q) => q.subcategory !== '情報セキュリティ');
    const bank = filterQuestionsByTopic(allQuestions, topic);
    questions = shuffle([...algo, ...bank]).slice(0, n);
    useMemo = true;
  } else if (topic.source === 'mixed') {
    // セキュリティ：バンク + 科目Bセキュリティ問題
    const bank = filterQuestionsByTopic(allQuestions, topic);
    const fromB = generateSubjectBProblems(Math.max(8, Math.ceil(n * 0.4)))
      .filter((q) => q.subcategory === '情報セキュリティ');
    questions = shuffle([...bank, ...fromB]).slice(0, n);
    useMemo = false;
  } else {
    questions = shuffle(filterQuestionsByTopic(allQuestions, topic)).slice(0, n);
    useMemo = false;
  }

  // まだ足りない場合のフォールバック
  if (questions.length < Math.min(5, n) && topic.source !== 'calculation') {
    const extra = generateSubjectBProblems(n);
    questions = shuffle([...questions, ...extra]).slice(0, n);
    useMemo = true;
  }

  return { questions, topic, useMemo };
}

/** 同一優先度のトピックをまとめて出題 */
export function buildPriorityMixQuiz(allQuestions, stars, perTopic = 8) {
  const topics = getTopicsByStars(stars);
  let questions = [];
  let useMemo = false;

  for (const topic of topics) {
    const { questions: qs, useMemo: memo } = buildTopicQuiz(allQuestions, topic.id, perTopic);
    questions = questions.concat(qs);
    if (memo) useMemo = true;
  }

  return { questions: shuffle(questions), useMemo, topics };
}

/** ホーム画面用のトピック別問題数 */
export function getTopicStats(allQuestions) {
  const stats = {};
  for (const topic of PRIORITY_TOPICS) {
    if (topic.source === 'calculation') {
      stats[topic.id] = '毎回生成';
    } else if (topic.source === 'algorithm') {
      const bank = filterQuestionsByTopic(allQuestions, topic).length;
      stats[topic.id] = `生成+${bank}`;
    } else if (topic.source === 'mixed') {
      stats[topic.id] = filterQuestionsByTopic(allQuestions, topic).length + '+生成';
    } else {
      stats[topic.id] = filterQuestionsByTopic(allQuestions, topic).length;
    }
  }
  return stats;
}
