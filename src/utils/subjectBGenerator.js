// 科目B（アルゴリズム・プログラミング / 情報セキュリティ）問題生成
// 参考: IPA 基本情報技術者試験 シラバス Ver.9.2
// 科目B構成: アルゴリズム・プログラミング約8割、情報セキュリティ約2割

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildUniqueChoices(correct, distractors) {
  const correctStr = String(correct);
  const unique = [];
  const add = (val) => {
    const s = String(val);
    if (!s || s === 'NaN' || s === 'undefined') return;
    if (!unique.includes(s)) unique.push(s);
  };
  add(correctStr);
  for (const d of distractors) {
    add(d);
    if (unique.length >= 4) break;
  }
  let offset = 1;
  while (unique.length < 4 && offset < 200) {
    const n = Number(correctStr);
    if (!Number.isNaN(n) && /^-?\d+(\.\d+)?$/.test(correctStr)) {
      add(String(n + offset));
      if (unique.length >= 4) break;
      add(String(n - offset));
    } else {
      add(`${correctStr}（別案${offset}）`);
    }
    offset++;
  }
  const choices = shuffle(unique.slice(0, 4));
  return { choices, correctAnswer: choices.indexOf(correctStr) };
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${randInt(1000, 9999)}`;
}

function base(subcategory, question, choices, correctAnswer, hint, explanation) {
  return {
    id: uid('subjB'),
    category: '科目B',
    subcategory,
    isSubjectB: true,
    question,
    choices,
    correctAnswer,
    hint,
    explanation
  };
}

// ============================================
// アルゴリズム・プログラミング（約8割）
// ============================================

/** 配列の合計を求めるプログラムの実行結果 */
function genArraySum() {
  const arr = Array.from({ length: randInt(4, 6) }, () => randInt(1, 20));
  const sum = arr.reduce((a, b) => a + b, 0);
  const { choices, correctAnswer } = buildUniqueChoices(String(sum), [
    String(sum + arr[0]),
    String(sum - arr[0]),
    String(arr.length),
    String(Math.max(...arr)),
  ]);
  return base(
    'アルゴリズム',
    `次の擬似言語を実行したとき、変数 sum の値はいくつになるか。\n\n整数型の配列: data = [${arr.join(', ')}]\n整数型: sum ← 0\ni を 1 から ${arr.length} まで 1 ずつ増やしながら繰り返す\n　sum ← sum + data[i]\n繰り返し終了\n\n※配列の要素番号は 1 から始まる`,
    choices,
    correctAnswer,
    'ループで各要素を順に足し合わせます。',
    `実行トレース:\ndata = [${arr.join(', ')}]\nsum = ${arr.join(' + ')} = ${sum}\n\n答え: ${sum}`
  );
}

/** 配列の最大値 */
function genArrayMax() {
  const arr = Array.from({ length: randInt(5, 7) }, () => randInt(10, 99));
  const max = Math.max(...arr);
  const { choices, correctAnswer } = buildUniqueChoices(String(max), [
    String(Math.min(...arr)),
    String(arr[0]),
    String(arr[arr.length - 1]),
    String(max - 1),
  ]);
  return base(
    'アルゴリズム',
    `次のプログラムを実行したとき、変数 max の最終値はどれか。\n\n整数型の配列: data = [${arr.join(', ')}]\n整数型: max ← data[1]\ni を 2 から ${arr.length} まで 1 ずつ増やしながら繰り返す\n　もし data[i] > max ならば\n　　max ← data[i]\n　終わり\n繰り返し終了`,
    choices,
    correctAnswer,
    '最初の要素を仮の最大値とし、より大きい値が出たら更新します。',
    `配列: [${arr.join(', ')}]\n最大値: ${max}\n\n答え: ${max}`
  );
}

/** 条件を満たす要素の個数 */
function genArrayCount() {
  const arr = Array.from({ length: randInt(6, 8) }, () => randInt(1, 30));
  const threshold = randInt(10, 20);
  const count = arr.filter((x) => x >= threshold).length;
  const { choices, correctAnswer } = buildUniqueChoices(String(count), [
    String(arr.filter((x) => x > threshold).length),
    String(arr.filter((x) => x <= threshold).length),
    String(arr.length),
    String(count + 1),
  ]);
  return base(
    'アルゴリズム',
    `次のプログラムを実行したとき、変数 cnt の値はいくつになるか。\n\n整数型の配列: data = [${arr.join(', ')}]\n整数型: cnt ← 0\ni を 1 から ${arr.length} まで 1 ずつ増やしながら繰り返す\n　もし data[i] ≧ ${threshold} ならば\n　　cnt ← cnt + 1\n　終わり\n繰り返し終了`,
    choices,
    correctAnswer,
    `${threshold}以上の要素を数えます。`,
    `条件: data[i] ≧ ${threshold}\n該当要素: [${arr.filter((x) => x >= threshold).join(', ')}]\n個数: ${count}\n\n答え: ${count}`
  );
}

/** 線形探索の比較回数 */
function genLinearSearch() {
  const arr = Array.from({ length: 7 }, () => randInt(10, 50));
  // 重複を避ける
  const uniqueArr = [...new Set(arr)];
  while (uniqueArr.length < 6) uniqueArr.push(randInt(51, 90));
  const data = uniqueArr.slice(0, 6);
  const targetIndex = randInt(0, data.length - 1);
  const target = data[targetIndex];
  const comparisons = targetIndex + 1; // 1-indexed find position
  const { choices, correctAnswer } = buildUniqueChoices(String(comparisons), [
    String(data.length),
    String(targetIndex),
    String(comparisons + 1),
    String(1),
  ]);
  return base(
    'アルゴリズム',
    `次の配列を先頭から線形探索し、値 ${target} を見つけるまでに行う比較の回数はいくつか。\n\n配列: [${data.join(', ')}]\n（要素番号は左から 1 始まり）`,
    choices,
    correctAnswer,
    '先頭から順に比較し、見つかった時点までの回数です。',
    `配列: [${data.join(', ')}]\n${target} は位置 ${targetIndex + 1} にあるため、比較は ${comparisons} 回。\n\n答え: ${comparisons}`
  );
}

/** 二分探索の比較回数（ソート済み） */
function genBinarySearch() {
  const sorted = [10, 20, 30, 40, 50, 60, 70];
  const targets = [
    { t: 10, c: 3 }, // mid 40,20,10
    { t: 40, c: 1 },
    { t: 70, c: 3 },
    { t: 30, c: 2 },
    { t: 50, c: 2 },
  ];
  // Recalculate properly
  function binComparisons(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    let count = 0;
    while (low <= high) {
      count++;
      const mid = Math.floor((low + high) / 2);
      if (arr[mid] === target) return count;
      if (arr[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return count;
  }
  const pick = choice(targets.map((x) => x.t).concat([20, 60]));
  const comparisons = binComparisons(sorted, pick);
  const { choices, correctAnswer } = buildUniqueChoices(String(comparisons), [
    String(sorted.length),
    String(comparisons + 1),
    String(Math.max(1, comparisons - 1)),
    String(Math.ceil(Math.log2(sorted.length))),
  ]);
  return base(
    'アルゴリズム',
    `昇順に整列された次の配列に対し、2分探索法で ${pick} を探すとき、比較回数はいくらか。\n\n配列: [${sorted.join(', ')}]\n※中央の要素との比較を1回と数える。見つかり次第終了。`,
    choices,
    correctAnswer,
    '中央値と比較して探索範囲を半分にします。',
    `2分探索で ${pick} を探す比較回数: ${comparisons}\n\n答え: ${comparisons}`
  );
}

/** スタック操作の結果 */
function genStack() {
  const ops = [];
  const stack = [];
  const values = [];
  // Generate a sequence: push a few, pop some
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const c = randInt(1, 9);
  ops.push(`push(${a})`);
  stack.push(a);
  ops.push(`push(${b})`);
  stack.push(b);
  ops.push('pop()');
  const popped1 = stack.pop();
  ops.push(`push(${c})`);
  stack.push(c);
  ops.push('pop()');
  const popped2 = stack.pop();
  const top = stack[stack.length - 1];
  values.push(popped1, popped2, top);

  const ask = choice(['top', 'pop2', 'pop1']);
  let correct;
  let questionExtra;
  if (ask === 'top') {
    correct = String(top);
    questionExtra = '最終的にスタックの先頭（次に pop される値）はどれか。';
  } else if (ask === 'pop2') {
    correct = String(popped2);
    questionExtra = '2回目の pop() で取り出される値はどれか。';
  } else {
    correct = String(popped1);
    questionExtra = '1回目の pop() で取り出される値はどれか。';
  }

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    String(a),
    String(b),
    String(c),
    String(popped1),
    String(popped2),
    String(top),
  ]);

  return base(
    'データ構造',
    `空のスタックに対して次の操作を行った。${questionExtra}\n\n操作順:\n${ops.join('\n')}\n\n※スタックは LIFO（後入れ先出し）`,
    choices,
    correctAnswer,
    'スタックは最後に入れたものが最初に出ます。',
    `操作トレース:\n${ops.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\n1回目pop: ${popped1}\n2回目pop: ${popped2}\n最終先頭: ${top}\n\n答え: ${correct}`
  );
}

/** キュー操作の結果 */
function genQueue() {
  const a = randInt(1, 9);
  const b = randInt(1, 9);
  const c = randInt(1, 9);
  const ops = [`enqueue(${a})`, `enqueue(${b})`, 'dequeue()', `enqueue(${c})`, 'dequeue()'];
  // simulate
  const q = [];
  q.push(a);
  q.push(b);
  const d1 = q.shift();
  q.push(c);
  const d2 = q.shift();
  const front = q[0];

  const ask = choice(['d1', 'd2', 'front']);
  let correct;
  let questionExtra;
  if (ask === 'd1') {
    correct = String(d1);
    questionExtra = '1回目の dequeue() で取り出される値はどれか。';
  } else if (ask === 'd2') {
    correct = String(d2);
    questionExtra = '2回目の dequeue() で取り出される値はどれか。';
  } else {
    correct = String(front);
    questionExtra = '最終的にキューの先頭の値はどれか。';
  }

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    String(a), String(b), String(c), String(d1), String(d2), String(front),
  ]);

  return base(
    'データ構造',
    `空のキューに対して次の操作を行った。${questionExtra}\n\n操作順:\n${ops.join('\n')}\n\n※キューは FIFO（先入れ先出し）`,
    choices,
    correctAnswer,
    'キューは最初に入れたものが最初に出ます。',
    `1回目dequeue: ${d1}\n2回目dequeue: ${d2}\n最終先頭: ${front}\n\n答え: ${correct}`
  );
}

/** バブルソート1回の走査後 */
function genBubbleSortPass() {
  let arr = Array.from({ length: 5 }, () => randInt(1, 20));
  // ensure not already sorted
  arr = shuffle(arr);
  const original = [...arr];
  // one pass bubble sort (ascending)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    }
  }
  const result = `[${arr.join(', ')}]`;
  const wrong1 = `[${original.join(', ')}]`;
  const wrong2 = `[${[...original].sort((a, b) => a - b).join(', ')}]`;
  const reversed = [...original].reverse();
  const wrong3 = `[${reversed.join(', ')}]`;

  const { choices, correctAnswer } = buildUniqueChoices(result, [wrong1, wrong2, wrong3]);

  return base(
    'アルゴリズム',
    `次の配列に対して、バブルソート（昇順）の外側ループを1回だけ実行した直後の配列はどれか。\n\n初期配列: [${original.join(', ')}]\n\n※隣接する要素を比較し、左が大きいとき交換する。左端から右端まで1走査。`,
    choices,
    correctAnswer,
    '1回の走査で最大値が右端に移動します。',
    `初期: [${original.join(', ')}]\n1走査後: ${result}\n（最大値 ${Math.max(...original)} が右端へ）\n\n答え: ${result}`
  );
}

/** ループ変数の最終値 */
function genLoopTrace() {
  const start = randInt(1, 3);
  const end = randInt(5, 8);
  const step = choice([1, 2]);
  let x = 0;
  const values = [];
  for (let i = start; i <= end; i += step) {
    x = x + i;
    values.push(i);
  }
  const { choices, correctAnswer } = buildUniqueChoices(String(x), [
    String(values.reduce((a, b) => a + b, 0) - values[0]),
    String(end),
    String(values.length),
    String(x + start),
  ]);
  return base(
    'アルゴリズム',
    `次の擬似言語を実行したとき、変数 x の最終値はいくらか。\n\n整数型: x ← 0\ni を ${start} から ${end} まで ${step} ずつ増やしながら繰り返す\n　x ← x + i\n繰り返し終了`,
    choices,
    correctAnswer,
    `i = ${values.join(', ')} を順に加算します。`,
    `i の値: ${values.join(', ')}\nx = ${values.join(' + ')} = ${x}\n\n答え: ${x}`
  );
}

/** 入れ子ループの実行回数 */
function genNestedLoop() {
  const n = randInt(3, 5);
  const m = randInt(2, 4);
  const count = n * m;
  const { choices, correctAnswer } = buildUniqueChoices(String(count), [
    String(n + m),
    String(n),
    String(m),
    String(n * m + 1),
  ]);
  return base(
    'アルゴリズム',
    `次のプログラムで、印字処理は何回実行されるか。\n\ni を 1 から ${n} まで 1 ずつ増やしながら繰り返す\n　j を 1 から ${m} まで 1 ずつ増やしながら繰り返す\n　　「*」を印字する\n　繰り返し終了\n繰り返し終了`,
    choices,
    correctAnswer,
    '外側 × 内側 の回数が総実行回数です。',
    `外側 ${n} 回 × 内側 ${m} 回 = ${count} 回\n\n答え: ${count}`
  );
}

/** 計算量オーダー */
function genComplexity() {
  const items = [
    {
      q: '要素数 n の配列を先頭から順に1回走査する処理の計算量として適切なものはどれか。',
      a: 'O(n)',
      wrong: ['O(1)', 'O(n²)', 'O(log n)'],
      exp: '配列全体を1回走査するので線形時間 O(n)。',
    },
    {
      q: '要素数 n の整列済み配列に対する2分探索の計算量として適切なものはどれか。',
      a: 'O(log n)',
      wrong: ['O(n)', 'O(n²)', 'O(1)'],
      exp: '探索範囲が半分になるので O(log n)。',
    },
    {
      q: '二重ループで、外側・内側とも 1〜n を回る処理の計算量として適切なものはどれか。',
      a: 'O(n²)',
      wrong: ['O(n)', 'O(log n)', 'O(n log n)'],
      exp: 'n×n 回なので O(n²)。',
    },
    {
      q: '配列の先頭要素を参照する処理の計算量として適切なものはどれか。',
      a: 'O(1)',
      wrong: ['O(n)', 'O(log n)', 'O(n²)'],
      exp: 'インデックスで直接アクセスできるので定数時間 O(1)。',
    },
    {
      q: 'マージソートの平均計算量として適切なものはどれか。',
      a: 'O(n log n)',
      wrong: ['O(n)', 'O(n²)', 'O(log n)'],
      exp: '分割統治により平均・最悪とも O(n log n)。',
    },
  ];
  const item = choice(items);
  const { choices, correctAnswer } = buildUniqueChoices(item.a, item.wrong);
  return base('アルゴリズム', item.q, choices, correctAnswer, 'オーダー記法で支配的な項を見ます。', `${item.exp}\n\n答え: ${item.a}`);
}

/** 再帰（階乗） */
function genFactorial() {
  const n = randInt(4, 6);
  const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
  const result = fact(n);
  const { choices, correctAnswer } = buildUniqueChoices(String(result), [
    String(n * n),
    String(fact(n - 1)),
    String(n + fact(n - 1)),
    String(result / n),
  ]);
  return base(
    'アルゴリズム',
    `次の再帰関数 fact を呼び出したときの戻り値はいくらか。\n\n○整数型: fact(整数型: n)\n　もし n ≦ 1 ならば\n　　return 1\n　否则\n　　return n × fact(n - 1)\n　終わり\n\n呼び出し: fact(${n})`,
    choices,
    correctAnswer,
    `${n}! = ${n}×${n - 1}×…×1`,
    `fact(${n}) = ${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = ${result}\n\n答え: ${result}`
  );
}

/** 文字列処理：文字数カウント */
function genStringCount() {
  const chars = 'ABCDEFGH';
  const len = randInt(5, 8);
  const s = Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('');
  const target = s[randInt(0, s.length - 1)];
  const count = [...s].filter((c) => c === target).length;
  const { choices, correctAnswer } = buildUniqueChoices(String(count), [
    String(s.length),
    String(count + 1),
    String(Math.max(0, count - 1)),
    String([...new Set(s)].length),
  ]);
  return base(
    'アルゴリズム',
    `文字列 S = "${s}" について、文字 '${target}' が出現する回数はいくらか。`,
    choices,
    correctAnswer,
    '先頭から1文字ずつ比較して数えます。',
    `S = "${s}"\n'${target}' の出現回数: ${count}\n\n答え: ${count}`
  );
}

/** 配列の逆順 */
function genArrayReverse() {
  const arr = Array.from({ length: 5 }, () => randInt(1, 30));
  const reversed = [...arr].reverse();
  const result = `[${reversed.join(', ')}]`;
  const { choices, correctAnswer } = buildUniqueChoices(result, [
    `[${arr.join(', ')}]`,
    `[${[...arr].sort((a, b) => a - b).join(', ')}]`,
    `[${arr.slice(1).concat(arr[0]).join(', ')}]`,
  ]);
  return base(
    'アルゴリズム',
    `次の配列を左右反転した結果はどれか。\n\n配列: [${arr.join(', ')}]`,
    choices,
    correctAnswer,
    '先頭と末尾を入れ替えていきます。',
    `元: [${arr.join(', ')}]\n逆順: ${result}\n\n答え: ${result}`
  );
}

/** 選択ソートの特徴 */
function genSortConcept() {
  const items = [
    {
      q: '整列アルゴリズムのうち、ピボットを基準に分割統治する方式はどれか。',
      a: 'クイックソート',
      wrong: ['バブルソート', '挿入ソート', '選択ソート'],
      exp: 'クイックソートはピボットで分割し再帰的に整列する。',
    },
    {
      q: 'すでにほぼ整列しているデータに対して効率が良いことが多い整列法はどれか。',
      a: '挿入ソート',
      wrong: ['選択ソート', 'ヒープソート', 'マージソート'],
      exp: '挿入ソートはほぼ整列済みだと交換・移動が少なく高速。',
    },
    {
      q: '整列済みの2つの配列を1つの整列済み配列にまとめる処理を何というか。',
      a: '併合（マージ）',
      wrong: ['分割', '探索', 'ハッシュ'],
      exp: 'マージソートの基本操作が併合（マージ）。',
    },
    {
      q: 'LIFO の性質をもつデータ構造はどれか。',
      a: 'スタック',
      wrong: ['キュー', '配列', 'ハッシュ表'],
      exp: 'スタックは後入れ先出し（LIFO）。',
    },
    {
      q: 'FIFO の性質をもつデータ構造はどれか。',
      a: 'キュー',
      wrong: ['スタック', 'ヒープ', '2分探索木'],
      exp: 'キューは先入れ先出し（FIFO）。',
    },
  ];
  const item = choice(items);
  const { choices, correctAnswer } = buildUniqueChoices(item.a, item.wrong);
  return base('データ構造', item.q, choices, correctAnswer, '用語の定義を思い出す。', `${item.exp}\n\n答え: ${item.a}`);
}

// ============================================
// 情報セキュリティ（約2割）
// ============================================

const SECURITY_BANK = [
  {
    q: '公開鍵暗号方式の説明として適切なものはどれか。',
    a: '暗号化と復号に異なる鍵を用いる',
    wrong: ['暗号化と復号に同じ鍵を用いる', '暗号化だけに鍵が必要で復号には不要', '復号だけに鍵が必要で暗号化には不要'],
    hint: '公開鍵と秘密鍵のペアを使います。',
    exp: '公開鍵暗号は暗号化鍵と復号鍵が異なる（非対称暗号）。共通鍵暗号は同じ鍵を使う。',
  },
  {
    q: 'ディジタル署名の主な目的として適切なものはどれか。',
    a: '改ざん検知と送信者の認証',
    wrong: ['通信の暗号化のみ', '通信速度の向上', 'データの圧縮'],
    hint: '署名は本人性と完全性に関わります。',
    exp: 'ディジタル署名は改ざん検知（完全性）と送信者証明（認証・否認防止）に用いる。',
  },
  {
    q: 'SQLインジェクション対策として最も適切なものはどれか。',
    a: 'プレースホルダ（バインド機構）を用いてSQLを組み立てる',
    wrong: ['入力文字列をそのままSQL文に連結する', 'エラーメッセージにSQL全文を表示する', '管理者権限でDB接続する'],
    hint: '入力とSQL構文を分離します。',
    exp: 'プレースホルダによりユーザ入力がSQL構文として解釈されないようにする。',
  },
  {
    q: 'クロスサイトスクリプティング（XSS）対策として適切なものはどれか。',
    a: '出力時にHTMLエスケープを行う',
    wrong: ['Cookieに認証情報を平文で保存する', 'すべてのページで同一オリジンを無効化する', 'HTTPSをやめてHTTPにする'],
    hint: 'ブラウザがスクリプトと誤認しないようにします。',
    exp: 'ユーザ入力をHTMLへ出す際にエスケープし、スクリプト実行を防ぐ。',
  },
  {
    q: 'ファイアウォールの基本的な役割として適切なものはどれか。',
    a: '許可されていない通信を遮断する',
    wrong: ['ウイルスをすべて自動除去する', 'パスワードを暗号化する', 'バックアップを取得する'],
    hint: 'ネットワーク境界のアクセス制御です。',
    exp: 'ファイアウォールはルールに基づき通過/遮断を制御する。',
  },
  {
    q: 'ハッシュ関数の特徴として適切なものはどれか。',
    a: '入力から一方向にダイジェストを生成し、元データへの逆変換は困難',
    wrong: ['必ず元のデータに復号できる', '入力が違っても同じ出力になることは絶対にない保証がある', '出力長は入力長に比例して増える'],
    hint: 'パスワード保存などで使われます。',
    exp: 'ハッシュは一方向性があり、パスワード検証や改ざん検知に使う。衝突は理論上あり得る。',
  },
  {
    q: '多要素認証の例として適切なものはどれか。',
    a: 'パスワードとワンタイムパスワードの併用',
    wrong: ['同じパスワードを2回入力する', 'ユーザIDだけを使う', '生年月日だけを使う'],
    hint: '知識・所持・生体など異なる要素を組み合わせます。',
    exp: '知識情報（パスワード）と所持情報（OTP端末）など複数要素を組み合わせる。',
  },
  {
    q: '最小権限の原則の説明として適切なものはどれか。',
    a: '業務に必要な最小限のアクセス権限だけを与える',
    wrong: ['全員に管理者権限を与える', '権限は一度与えたら変更しない', '外部公開サーバには全ポートを開放する'],
    hint: 'need-to-know とも呼ばれます。',
    exp: '必要最小限の権限付与により、侵害時の被害を抑える。',
  },
  {
    q: 'HTTPSで主に用いられるプロトコルの組合せとして適切なものはどれか。',
    a: 'TLS による暗号化通信の上で HTTP を用いる',
    wrong: ['FTP と Telnet を組み合わせる', 'SMTP のみを用いる', '平文の HTTP にチェックサムを付けるだけ'],
    hint: 'HTTP over TLS です。',
    exp: 'HTTPSはTLS（旧SSL）で暗号化した上でHTTP通信を行う。',
  },
  {
    q: 'ソーシャルエンジニアリングの説明として適切なものはどれか。',
    a: '人の心理的な隙を突いて情報を不正に入手する手法',
    wrong: ['OSの脆弱性を突く攻撃のみを指す', '暗号アルゴリズムの数学的解読のみを指す', 'ハードウェア故障を引き起こす手法'],
    hint: '技術ではなく人を標的にします。',
    exp: '電話・メール等で信頼を装い機密情報を聞き出すなど。',
  },
  {
    q: 'ランサムウェアの特徴として適切なものはどれか。',
    a: 'データを暗号化し、復号と引き換えに金銭を要求する',
    wrong: ['表示広告を大量に出すだけ', 'CPUを計算資源として勝手に使うだけ', 'メールの開封確認だけを行う'],
    hint: '身代金（ransom）に由来します。',
    exp: 'ファイルを暗号化し身代金を要求するマルウェア。',
  },
  {
    q: 'WAF（Web Application Firewall）の役割として適切なものはどれか。',
    a: 'Webアプリケーションへの不正リクエストを検知・遮断する',
    wrong: ['OSのカーネルを置き換える', 'データベースの物理バックアップを取る', 'キーボード入力を暗号化する'],
    hint: 'Webアプリ層の防御です。',
    exp: 'WAFはSQLインジェクションやXSS等の攻撃パターンを検知・遮断する。',
  },
  {
    q: '情報セキュリティの3要素（CIA）に含まれないものはどれか。',
    a: '拡張性（Extensibility）',
    wrong: ['機密性（Confidentiality）', '完全性（Integrity）', '可用性（Availability）'],
    hint: 'C・I・A です。',
    exp: '機密性・完全性・可用性の3要素。拡張性は含まれない。',
  },
  {
    q: 'VPNの主な目的として適切なものはどれか。',
    a: '公衆ネットワーク上に仮想的な専用回線を作り通信を保護する',
    wrong: ['CPUのクロックを上げる', 'ハードディスク容量を増やす', 'プログラムのバグを自動修正する'],
    hint: 'Virtual Private Network。',
    exp: 'インターネット等を経由しつつ暗号化トンネルで安全に通信する。',
  },
  {
    q: 'ブルートフォース攻撃の説明として適切なものはどれか。',
    a: '考えられる組合せを総当たりで試して突破を試みる',
    wrong: ['正規の証明書を偽る攻撃', 'DNSのキャッシュを書き換える攻撃', 'ARPテーブルを改ざんする攻撃'],
    hint: '力ずくの総当たりです。',
    exp: 'パスワード等を片っ端から試す総当たり攻撃。',
  },
];

function genSecurity() {
  const item = choice(SECURITY_BANK);
  const { choices, correctAnswer } = buildUniqueChoices(item.a, item.wrong);
  return base(
    '情報セキュリティ',
    item.q,
    choices,
    correctAnswer,
    item.hint,
    `${item.exp}\n\n答え: ${item.a}`
  );
}

const ALGO_GENERATORS = [
  genArraySum,
  genArrayMax,
  genArrayCount,
  genLinearSearch,
  genBinarySearch,
  genStack,
  genQueue,
  genBubbleSortPass,
  genLoopTrace,
  genNestedLoop,
  genComplexity,
  genFactorial,
  genStringCount,
  genArrayReverse,
  genSortConcept,
];

/**
 * 科目B問題を count 問生成（アルゴ約80% / セキュリティ約20%）
 */
export function generateSubjectBProblems(count = 20) {
  const problems = [];
  const securityCount = Math.max(1, Math.round(count * 0.2));
  const algoCount = count - securityCount;

  for (let i = 0; i < algoCount; i++) {
    problems.push(ALGO_GENERATORS[i % ALGO_GENERATORS.length]());
  }
  for (let i = 0; i < securityCount; i++) {
    problems.push(genSecurity());
  }

  return shuffle(problems);
}

export function generateRandomSubjectBProblem() {
  return Math.random() < 0.8
    ? choice(ALGO_GENERATORS)()
    : genSecurity();
}
