// 計算問題ランダム生成システム
// 毎回異なる数値で問題を生成

/**
 * ランダムな整数を生成
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * ランダムな選択
 */
function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 配列をシャッフル
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 正解と誤答候補から重複のない4択を作る
 * @returns {{ choices: string[], correctAnswer: number }}
 */
function buildUniqueChoices(correct, distractors) {
  const correctStr = String(correct);
  const unique = [];

  const add = (val) => {
    const s = String(val);
    if (s === '' || s === 'NaN' || s === 'undefined' || s === 'Infinity' || s === '-Infinity') return;
    if (!unique.includes(s)) unique.push(s);
  };

  add(correctStr);
  for (const d of distractors) {
    add(d);
    if (unique.length >= 4) break;
  }

  // 足りない場合は数値オフセットで埋める
  let offset = 1;
  const numericMatch = correctStr.match(/^(-?\d+(?:\.\d+)?)(%?)$/);
  while (unique.length < 4 && offset < 500) {
    if (numericMatch) {
      const base = parseFloat(numericMatch[1]);
      const suffix = numericMatch[2] || '';
      add(`${roundNice(base + offset)}${suffix}`);
      if (unique.length >= 4) break;
      add(`${roundNice(base - offset)}${suffix}`);
    } else if (/^[01]+$/.test(correctStr)) {
      // 2進数: ビットをずらした候補
      const n = parseInt(correctStr, 2);
      add((n + offset).toString(2).padStart(correctStr.length, '0').slice(-correctStr.length));
      if (unique.length >= 4) break;
      add(Math.max(0, n - offset).toString(2).padStart(correctStr.length, '0').slice(-correctStr.length));
    } else if (/^[0-9A-F]+$/.test(correctStr) && /[A-F]/.test(correctStr)) {
      const n = parseInt(correctStr, 16);
      add((n + offset).toString(16).toUpperCase());
      if (unique.length >= 4) break;
      add(Math.max(0, n - offset).toString(16).toUpperCase());
    } else {
      // 「10101010 (170)」形式
      const binDec = correctStr.match(/^([01]+)\s*\((\d+)\)$/);
      if (binDec) {
        const n = parseInt(binDec[2], 10);
        const len = binDec[1].length;
        const next = n + offset;
        add(`${(next & ((1 << len) - 1) || next).toString(2).padStart(len, '0')} (${next})`);
        if (unique.length >= 4) break;
        const prev = Math.max(0, n - offset);
        add(`${prev.toString(2).padStart(len, '0')} (${prev})`);
      } else {
        add(`${correctStr}※${offset}`);
      }
    }
    offset++;
  }

  const choices = shuffle(unique.slice(0, 4));
  return {
    choices,
    correctAnswer: choices.indexOf(correctStr)
  };
}

function roundNice(n) {
  return Math.round(n * 1000) / 1000;
}

// ============================================
// 1. 基数変換問題
// ============================================

function fmtBinDec(n, bits = 8) {
  const v = n & ((1 << bits) - 1);
  return `${v.toString(2).padStart(bits, '0')} (${v})`;
}

/**
 * 10進数→2進数変換
 */
function generate10to2() {
  const decimal = randInt(8, 255);
  const binary = decimal.toString(2);
  const { choices, correctAnswer } = buildUniqueChoices(binary, [
    (decimal + 1).toString(2),
    (decimal - 1).toString(2),
    (decimal + 2).toString(2),
    (decimal ^ 1).toString(2),
    (decimal ^ 2).toString(2),
    (decimal + 3).toString(2),
  ]);

  return {
    id: `calc_10to2_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `10進数の ${decimal} を2進数で表すとどれか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】割り算の余り法\n① ${decimal} を2で割り続ける\n② 余り（0か1）を記録\n③ 余りを下から上へ並べると2進数になる`,
    explanation: `【計算方法】10進数 → 2進数（割り算の余り法）\n\n公式イメージ: 2で割った余りを下から読む\n\n手順:\n${generateDivisionSteps(decimal, 2)}\n\n答え: ${binary}`
  };
}

/**
 * 2進数→10進数変換
 */
function generate2to10() {
  const decimal = randInt(8, 255);
  const binary = decimal.toString(2);
  const flipped = parseInt(
    binary.substring(0, binary.length - 1) + (binary[binary.length - 1] === '0' ? '1' : '0'),
    2
  );
  const { choices, correctAnswer } = buildUniqueChoices(String(decimal), [
    String(decimal + 1),
    String(decimal - 1),
    String(decimal + 2),
    String(flipped),
    String(decimal + 4),
    String(Math.max(1, decimal - 2)),
  ]);

  return {
    id: `calc_2to10_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `2進数の ${binary} を10進数で表すとどれか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】位取り記数法\n各桁の値 × 2^(桁の位置) をすべて足す\n右端が 2^0、その左が 2^1、2^2 ...`,
    explanation: `【計算方法】2進数 → 10進数（位取り展開）\n\n公式: Σ (各桁のビット × 2^桁位置)\n\n手順:\n${generateBinaryToDecimalSteps(binary)}\n\n答え: ${decimal}`
  };
}

/**
 * 16進数→10進数変換
 */
function generate16to10() {
  const decimal = randInt(16, 255);
  const hex = decimal.toString(16).toUpperCase();
  const asDecimalMisread = Number.isNaN(parseInt(hex, 10)) ? decimal + 16 : parseInt(hex, 10);
  const { choices, correctAnswer } = buildUniqueChoices(String(decimal), [
    String(decimal + 1),
    String(decimal - 1),
    String(asDecimalMisread),
    String(decimal + 16),
    String(Math.max(1, decimal - 16)),
    String(decimal + 2),
  ]);

  return {
    id: `calc_16to10_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `16進数の ${hex} を10進数で表すとどれか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】位取り記数法\nA=10,B=11,C=12,D=13,E=14,F=15 に直してから\n各桁 × 16^(桁位置) を合計する`,
    explanation: `【計算方法】16進数 → 10進数（位取り展開）\n\n対応: A=10 B=11 C=12 D=13 E=14 F=15\n公式: Σ (各桁の値 × 16^桁位置)\n\n手順:\n${generateHexToDecimalSteps(hex)}\n\n答え: ${decimal}`
  };
}

/**
 * 2の補数表現
 */
function generateTwoComplement() {
  const positive = randInt(1, 127);
  const binary = positive.toString(2).padStart(8, '0');
  const inverted = binary.split('').map(b => (b === '0' ? '1' : '0')).join('');
  const complementBinary = (parseInt(inverted, 2) + 1).toString(2).padStart(8, '0');

  const { choices, correctAnswer } = buildUniqueChoices(complementBinary, [
    inverted,
    binary,
    (parseInt(inverted, 2) - 1).toString(2).padStart(8, '0'),
    (parseInt(complementBinary, 2) ^ 1).toString(2).padStart(8, '0'),
    (parseInt(complementBinary, 2) ^ 2).toString(2).padStart(8, '0'),
  ]);

  return {
    id: `calc_2comp_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `8ビットの2の補数表現で、-${positive} を表すビット列はどれか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】2の補数\n① 絶対値 ${positive} を8ビット2進数にする\n② 0↔1 でビット反転\n③ 反転結果に +1 する`,
    explanation: `【計算方法】負の数の2の補数表現（8ビット）\n\n手順:\n1. 正の数 ${positive} を2進数にする\n   → ${binary}\n   （計算: ${generateDivisionSteps(positive, 2).split('\n\n')[0]}）\n\n2. ビット反転（0→1、1→0）\n   ${binary}\n   ↓\n   ${inverted}\n\n3. +1 する\n   ${inverted} + 1 = ${complementBinary}\n\n答え: ${complementBinary}`
  };
}

// ============================================
// 2. 論理演算
// ============================================

function generateLogicalAND() {
  const a = randInt(128, 255);
  const b = randInt(128, 255);
  const result = a & b;
  const aBin = a.toString(2).padStart(8, '0');
  const bBin = b.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  const correct = `${resultBin} (${result})`;

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    fmtBinDec(a | b),
    fmtBinDec(a ^ b),
    fmtBinDec(result + 1),
    fmtBinDec(result + 2),
    fmtBinDec(Math.max(0, result - 1)),
    fmtBinDec(a),
  ]);

  return {
    id: `calc_and_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `次の2つの8ビット2進数の論理積（AND）を求めよ。\nA: ${aBin}\nB: ${bBin}`,
    choices,
    correctAnswer,
    hint: `【計算方法】論理積 AND\n同じ桁を見て「両方とも1 → 1、それ以外 → 0」\n右端から1ビットずつ比較する`,
    explanation: `${generateBitwiseSteps(aBin, bBin, resultBin, 'AND: 1∧1=1 / それ以外=0', '両方1のときだけ1')}\n\n10進数でも確認: ${a} AND ${b} = ${result}\n\n答え: ${resultBin} (${result})`
  };
}

function generateLogicalOR() {
  const a = randInt(64, 127);
  const b = randInt(64, 127);
  const result = a | b;
  const aBin = a.toString(2).padStart(8, '0');
  const bBin = b.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  const correct = `${resultBin} (${result})`;

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    fmtBinDec(a & b),
    fmtBinDec(a ^ b),
    fmtBinDec(result + 1),
    fmtBinDec(Math.max(0, result - 1)),
    fmtBinDec(result + 2),
    fmtBinDec(a),
  ]);

  return {
    id: `calc_or_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `次の2つの8ビット2進数の論理和（OR）を求めよ。\nA: ${aBin}\nB: ${bBin}`,
    choices,
    correctAnswer,
    hint: `【計算方法】論理和 OR\n同じ桁を見て「どちらかが1 → 1、両方0 → 0」\n右端から1ビットずつ比較する`,
    explanation: `${generateBitwiseSteps(aBin, bBin, resultBin, 'OR: 0∨0=0 / それ以外=1', 'どちらかが1なら1')}\n\n10進数でも確認: ${a} OR ${b} = ${result}\n\n答え: ${resultBin} (${result})`
  };
}

function generateLogicalXOR() {
  const a = randInt(64, 200);
  const b = randInt(64, 200);
  const result = a ^ b;
  const aBin = a.toString(2).padStart(8, '0');
  const bBin = b.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  const correct = `${resultBin} (${result})`;

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    fmtBinDec(a & b),
    fmtBinDec(a | b),
    fmtBinDec(result + 1),
    fmtBinDec(Math.max(0, result - 1)),
    fmtBinDec(result + 2),
    fmtBinDec(a),
  ]);

  return {
    id: `calc_xor_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `次の2つの8ビット2進数の排他的論理和（XOR）を求めよ。\nA: ${aBin}\nB: ${bBin}`,
    choices,
    correctAnswer,
    hint: `【計算方法】排他的論理和 XOR\n同じ桁を見て「違う → 1、同じ → 0」\n右端から1ビットずつ比較する`,
    explanation: `${generateBitwiseSteps(aBin, bBin, resultBin, 'XOR: 同じ=0 / 異なる=1', 'ビットが異なるときだけ1')}\n\n10進数でも確認: ${a} XOR ${b} = ${result}\n\n答え: ${resultBin} (${result})`
  };
}

// ============================================
// 3. シフト演算
// ============================================

function generateLogicalLeftShift() {
  const value = randInt(8, 63);
  const shift = randInt(1, 3);
  const result = (value << shift) & 0xFF;
  const valueBin = value.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  const correct = `${resultBin} (${result})`;

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    fmtBinDec((value << (shift + 1)) & 0xFF),
    fmtBinDec(value >> shift),
    fmtBinDec((value * shift) & 0xFF),
    fmtBinDec((result + 1) & 0xFF),
    fmtBinDec(Math.max(0, result - 1)),
    fmtBinDec(value),
  ]);

  return {
    id: `calc_lshift_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `8ビットの値 ${valueBin} を論理左シフト${shift}ビット行った結果はどれか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】論理左シフト ${shift} ビット\n① ビット列を左に ${shift} つずらす\n② 右端に 0 を ${shift} 個入れる\n③ または 元の値 × 2^${shift}（8ビットに収める）`,
    explanation: `【計算方法】論理左シフト ${shift} ビット\n\n公式: 結果 ≒ 元の値 × 2^シフト数（はみ出しは捨てる）\n\n手順:\n1. 元の値: ${valueBin} (${value})\n2. 左へ ${shift} ビット移動し、右に0を詰める\n3. 計算: ${value} × 2^${shift} = ${value} × ${2 ** shift} = ${value * (2 ** shift)}\n4. 8ビットにマスク → ${result} = ${resultBin}\n\n答え: ${resultBin} (${result})`
  };
}

function generateLogicalRightShift() {
  const value = randInt(64, 255);
  const shift = randInt(1, 3);
  const result = value >>> shift;
  const valueBin = value.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  const correct = `${resultBin} (${result})`;

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    fmtBinDec(value >> (shift + 1)),
    fmtBinDec((value << shift) & 0xFF),
    fmtBinDec(Math.floor(value / shift)),
    fmtBinDec(result + 1),
    fmtBinDec(Math.max(0, result - 1)),
    fmtBinDec(value),
  ]);

  return {
    id: `calc_rshift_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `8ビットの値 ${valueBin} を論理右シフト${shift}ビット行った結果はどれか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】論理右シフト ${shift} ビット\n① ビット列を右に ${shift} つずらす\n② 左端に 0 を ${shift} 個入れる\n③ または 元の値 ÷ 2^${shift}（小数切捨て）`,
    explanation: `【計算方法】論理右シフト ${shift} ビット\n\n公式: 結果 = floor(元の値 ÷ 2^シフト数)\n\n手順:\n1. 元の値: ${valueBin} (${value})\n2. 右へ ${shift} ビット移動し、左に0を詰める\n3. 計算: ${value} ÷ 2^${shift} = ${value} ÷ ${2 ** shift} = ${value / (2 ** shift)}\n4. 小数切捨て → ${result} = ${resultBin}\n\n答え: ${resultBin} (${result})`
  };
}

// ============================================
// 4. 確率・統計
// ============================================

function generatePermutation() {
  const n = randInt(5, 8);
  const r = randInt(2, Math.min(4, n - 1));
  const result = factorial(n) / factorial(n - r);

  const { choices, correctAnswer } = buildUniqueChoices(String(result), [
    String(factorial(n)),
    String(combination(n, r)),
    String(Math.pow(n, r)),
    String(result + n),
    String(Math.max(1, result - n)),
    String(n * r),
  ]);

  return {
    id: `calc_perm_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `${n}個の異なるものから${r}個を選んで並べる順列 P(${n},${r}) の総数はいくつか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】順列 P(n,r)\n公式: P(n,r) = n! / (n-r)!\nまたは: n × (n-1) × … を r 個かける\nここでは P(${n},${r}) = ${permutationProduct(n, r)}`,
    explanation: `【計算方法】順列 P(n,r)（並べ方の総数）\n\n公式:\n  P(n,r) = n! / (n-r)!\n  または P(n,r) = n × (n-1) × … × (n-r+1)\n\n手順:\n1. 掛け算で求める\n   P(${n},${r}) = ${permutationProduct(n, r)} = ${result}\n\n2. 階乗でも確認\n   ${n}! = ${factorialExpand(n)} = ${factorial(n)}\n   (${n}-${r})! = ${factorial(n - r)}\n   P = ${factorial(n)} ÷ ${factorial(n - r)} = ${result}\n\n答え: ${result}`
  };
}

function generateCombination() {
  const n = randInt(5, 10);
  const r = randInt(2, Math.min(5, n - 1));
  const result = combination(n, r);

  const { choices, correctAnswer } = buildUniqueChoices(String(result), [
    String(factorial(n) / factorial(n - r)),
    String(factorial(n)),
    String(n * r),
    String(result + 1),
    String(Math.max(1, result - 1)),
    String(combination(n, Math.max(1, r - 1))),
  ]);

  return {
    id: `calc_comb_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `${n}個の異なるものから${r}個を選ぶ組合せ C(${n},${r}) の総数はいくつか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】組合せ C(n,r)\n公式: C(n,r) = n! / (r! × (n-r)!)\nまたは: C = P(n,r) / r!\n順番は区別しない点に注意`,
    explanation: `【計算方法】組合せ C(n,r)（選び方の総数・順序なし）\n\n公式: C(n,r) = n! / (r! × (n-r)!) = P(n,r) / r!\n\n手順:\n${combinationSteps(n, r)}\n\n答え: ${result}`
  };
}

function generateExpectedValue() {
  const values = [randInt(1, 3) * 100, randInt(4, 6) * 100, randInt(7, 9) * 100];
  const probabilities = [0.2, 0.3, 0.5];
  const expected = values.reduce((sum, val, i) => sum + val * probabilities[i], 0);

  const { choices, correctAnswer } = buildUniqueChoices(String(expected), [
    String(Math.round((values[0] + values[1] + values[2]) / 3)),
    String(values[2]),
    String(expected + 50),
    String(expected + 100),
    String(Math.max(0, expected - 50)),
    String(values[0] + values[1]),
  ]);

  return {
    id: `calc_expect_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `ある抽選で、${values[0]}円が当たる確率が${probabilities[0]}、${values[1]}円が当たる確率が${probabilities[1]}、${values[2]}円が当たる確率が${probabilities[2]}のとき、期待値はいくらか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】期待値\n公式: E = Σ (値 × その確率)\n各パターンごとに「金額×確率」を出して全部足す`,
    explanation: `【計算方法】期待値（加重平均）\n\n公式: 期待値 = Σ (値ᵢ × 確率ᵢ)\n\n手順:\n1. ${values[0]} × ${probabilities[0]} = ${values[0] * probabilities[0]}\n2. ${values[1]} × ${probabilities[1]} = ${values[1] * probabilities[1]}\n3. ${values[2]} × ${probabilities[2]} = ${values[2] * probabilities[2]}\n4. 合計 = ${values[0] * probabilities[0]} + ${values[1] * probabilities[1]} + ${values[2] * probabilities[2]} = ${expected}\n\n答え: ${expected}円`
  };
}

function generateAverage() {
  const count = randInt(4, 6);
  const data = Array.from({ length: count }, () => randInt(10, 99));
  const sum = data.reduce((a, b) => a + b, 0);
  const avgRounded = Math.round((sum / count) * 10) / 10;

  const { choices, correctAnswer } = buildUniqueChoices(String(avgRounded), [
    String(Math.round((sum / (count + 1)) * 10) / 10),
    String(Math.round((sum / (count - 1)) * 10) / 10),
    String(Math.round((avgRounded + 1) * 10) / 10),
    String(Math.round((avgRounded + 2) * 10) / 10),
    String(Math.round(Math.max(0, avgRounded - 1) * 10) / 10),
    String(Math.round(sum * 10) / 10),
  ]);

  return {
    id: `calc_avg_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `次のデータの平均値を求めよ（小数第1位まで）。\nデータ: ${data.join(', ')}`,
    choices,
    correctAnswer,
    hint: `【計算方法】平均値（相加平均）\n公式: 平均 = 合計 ÷ 個数\n① 全部足す ② データの個数で割る ③ 小数第1位まで丸める`,
    explanation: `【計算方法】平均値\n\n公式: 平均 = (x₁ + x₂ + … + xₙ) / n\n\n手順:\n1. 合計 = ${data.join(' + ')} = ${sum}\n2. 個数 n = ${count}\n3. ${sum} ÷ ${count} = ${sum / count}\n4. 小数第1位まで → ${avgRounded}\n\n答え: ${avgRounded}`
  };
}

function generateMedian() {
  const count = choice([5, 7]);
  const data = Array.from({ length: count }, () => randInt(10, 99)).sort((a, b) => a - b);
  const median = data[Math.floor(count / 2)];
  const avg = Math.round(data.reduce((a, b) => a + b, 0) / count);

  const { choices, correctAnswer } = buildUniqueChoices(String(median), [
    String(data[0]),
    String(data[count - 1]),
    String(avg),
    String(median + 1),
    String(Math.max(1, median - 1)),
    String(data[1]),
  ]);

  return {
    id: `calc_median_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `次のデータの中央値（メジアン）を求めよ。\nデータ: ${data.join(', ')}`,
    choices,
    correctAnswer,
    hint: `【計算方法】中央値（メジアン）\n① 小さい順に並べる\n② 個数が奇数なので真ん中（${Math.floor(count / 2) + 1}番目）の値を取る`,
    explanation: `【計算方法】中央値（メジアン）\n\n手順:\n1. 昇順に並べる: ${data.join(', ')}\n2. データ数 = ${count}（奇数）\n3. 中央の位置 = (${count}+1)/2 = ${Math.floor(count / 2) + 1} 番目\n4. ${Math.floor(count / 2) + 1} 番目の値 = ${median}\n\n※平均値（${avg}）と混同しないこと\n\n答え: ${median}`
  };
}

// ============================================
// 5. MIPS・性能計算
// ============================================

function generateMIPS() {
  const clockMHz = randInt(500, 3000);
  const cpi = choice([2, 3, 4, 5]);
  const mips = (clockMHz / cpi).toFixed(0);

  const { choices, correctAnswer } = buildUniqueChoices(mips, [
    (clockMHz * cpi).toFixed(0),
    (clockMHz / (cpi + 1)).toFixed(0),
    cpi > 1 ? (clockMHz / (cpi - 1)).toFixed(0) : (clockMHz / (cpi + 2)).toFixed(0),
    String(Number(mips) + 10),
    String(Math.max(1, Number(mips) - 10)),
    String(clockMHz),
  ]);

  return {
    id: `calc_mips_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `クロック周波数が${clockMHz}MHz、CPI（クロック当たりの命令数）が${cpi}のプロセッサの性能は何MIPSか。`,
    choices,
    correctAnswer,
    hint: `【計算方法】MIPS\n公式: MIPS = クロック周波数(MHz) ÷ CPI\nここでは ${clockMHz} ÷ ${cpi}`,
    explanation: `【計算方法】MIPS（Million Instructions Per Second）\n\n公式: MIPS = クロック周波数[MHz] / CPI\n\n意味:\n・クロック周波数: 1秒あたりのクロック数（百万単位）\n・CPI: 1命令あたり平均何クロックかかるか\n\n手順:\n1. MIPS = ${clockMHz} ÷ ${cpi}\n2. = ${mips}\n\n答え: ${mips} MIPS`
  };
}

function generateProcessingTime() {
  const instructions = randInt(100, 500) * 1000;
  const mips = randInt(50, 200);
  const timeMs = (instructions / (mips * 1000)).toFixed(2);

  const { choices, correctAnswer } = buildUniqueChoices(timeMs, [
    (instructions / mips).toFixed(2),
    ((mips / instructions) * 1000).toFixed(2),
    ((instructions * mips) / 1000).toFixed(2),
    (Number(timeMs) + 0.5).toFixed(2),
    Math.max(0.01, Number(timeMs) - 0.5).toFixed(2),
    (Number(timeMs) + 1).toFixed(2),
  ]);

  return {
    id: `calc_ptime_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `性能が${mips}MIPSのプロセッサで、${instructions / 1000}K命令のプログラムを実行するのに必要な時間は何ミリ秒か。`,
    choices,
    correctAnswer,
    hint: `【計算方法】実行時間\n公式: 時間[秒] = 命令数 ÷ (MIPS × 10^6)\nミリ秒にするなら ×1000\n命令数 = ${instructions / 1000}K = ${instructions}`,
    explanation: `【計算方法】プログラム実行時間\n\n公式:\n  実行時間[秒] = 命令数 / (MIPS × 10^6)\n  実行時間[ms] = 命令数 / (MIPS × 10^3)\n\n手順:\n1. 命令数 = ${instructions / 1000} × 1000 = ${instructions}\n2. 秒単位: ${instructions} / (${mips} × 1,000,000) = ${parseFloat(timeMs) / 1000} 秒\n3. ミリ秒: ${parseFloat(timeMs) / 1000} × 1000 = ${timeMs} ms\n   （または ${instructions} / (${mips} × 1000) = ${timeMs}）\n\n答え: ${timeMs} ms`
  };
}

// ============================================
// 6. 稼働率の計算
// ============================================

function generateSerialAvailability() {
  const a1 = (randInt(90, 98) / 100).toFixed(2);
  const a2 = (randInt(90, 98) / 100).toFixed(2);
  const result = (parseFloat(a1) * parseFloat(a2) * 100).toFixed(1);
  const correct = `${result}%`;

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    `${((parseFloat(a1) + parseFloat(a2)) * 50).toFixed(1)}%`,
    `${((1 - (1 - parseFloat(a1)) * (1 - parseFloat(a2))) * 100).toFixed(1)}%`,
    `${(((parseFloat(a1) + parseFloat(a2)) / 2) * 100).toFixed(1)}%`,
    `${(Number(result) + 1).toFixed(1)}%`,
    `${Math.max(0, Number(result) - 1).toFixed(1)}%`,
    `${(Number(result) + 2.5).toFixed(1)}%`,
  ]);

  return {
    id: `calc_avail_serial_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `稼働率${a1}のシステムAと稼働率${a2}のシステムBを直列に接続したとき、システム全体の稼働率は何%か。`,
    choices,
    correctAnswer,
    hint: `【計算方法】直列接続の稼働率\n公式: 全体 = A × B\nどちらも動いていないと全体が止まるので「掛け算」\n${a1} × ${a2}`,
    explanation: `【計算方法】直列システムの稼働率\n\n公式: 稼働率 = 装置Aの稼働率 × 装置Bの稼働率\n\n理由: 直列では1台でも止まると全体停止 → 両方が稼働している確率の積\n\n手順:\n1. ${a1} × ${a2} = ${(parseFloat(a1) * parseFloat(a2)).toFixed(4)}\n2. 百分率にする: ${(parseFloat(a1) * parseFloat(a2)).toFixed(4)} × 100 = ${result}%\n\n※並列の公式「1-(1-A)(1-B)」と混同しないこと\n\n答え: ${result}%`
  };
}

function generateParallelAvailability() {
  const a1 = (randInt(80, 95) / 100).toFixed(2);
  const a2 = (randInt(80, 95) / 100).toFixed(2);
  const result = ((1 - (1 - parseFloat(a1)) * (1 - parseFloat(a2))) * 100).toFixed(1);
  const correct = `${result}%`;

  const { choices, correctAnswer } = buildUniqueChoices(correct, [
    `${(parseFloat(a1) * parseFloat(a2) * 100).toFixed(1)}%`,
    `${(((parseFloat(a1) + parseFloat(a2)) / 2) * 100).toFixed(1)}%`,
    `${((parseFloat(a1) + parseFloat(a2)) * 50).toFixed(1)}%`,
    `${(Number(result) + 1).toFixed(1)}%`,
    `${Math.max(0, Number(result) - 1).toFixed(1)}%`,
    `${(Number(result) + 2.5).toFixed(1)}%`,
  ]);

  return {
    id: `calc_avail_parallel_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `稼働率${a1}のシステムAと稼働率${a2}のシステムBを並列（冗長化）に接続したとき、システム全体の稼働率は何%か。`,
    choices,
    correctAnswer,
    hint: `【計算方法】並列（冗長）の稼働率\n公式: 全体 = 1 - (1-A)×(1-B)\n「両方とも故障」の余事象\n1 - (1-${a1})×(1-${a2})`,
    explanation: `【計算方法】並列システムの稼働率\n\n公式: 稼働率 = 1 - (1-A) × (1-B)\n\n理由: 両方とも故障したときだけ全体停止\n　　　 → 全体稼働 = 1 − 両方故障の確率\n\n手順:\n1. Aが止まる確率 = 1 - ${a1} = ${(1 - parseFloat(a1)).toFixed(2)}\n2. Bが止まる確率 = 1 - ${a2} = ${(1 - parseFloat(a2)).toFixed(2)}\n3. 両方止まる = ${(1 - parseFloat(a1)).toFixed(2)} × ${(1 - parseFloat(a2)).toFixed(2)} = ${((1 - parseFloat(a1)) * (1 - parseFloat(a2))).toFixed(4)}\n4. 全体稼働 = 1 - ${((1 - parseFloat(a1)) * (1 - parseFloat(a2))).toFixed(4)} = ${(parseFloat(result) / 100).toFixed(4)}\n5. 百分率 = ${result}%\n\n※直列の「A×B」と混同しないこと\n\n答え: ${result}%`
  };
}

// ============================================
// ヘルパー関数
// ============================================

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function combination(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function factorialExpand(n) {
  if (n <= 1) return '1';
  return Array.from({ length: n }, (_, i) => n - i).join(' × ');
}

/** 10進→n進の割り算手順（余りを下から読む） */
function generateDivisionSteps(num, base) {
  const steps = [];
  const remainders = [];
  let n = num;
  while (n > 0) {
    const q = Math.floor(n / base);
    const r = n % base;
    steps.push(`${n} ÷ ${base} = ${q} 余り ${r}`);
    remainders.push(r);
    n = q;
  }
  const result = remainders.reverse().join('');
  return `${steps.join('\n')}\n\n余りを下から順に並べる → ${result}`;
}

/** 2進→10進の位取り展開 */
function generateBinaryToDecimalSteps(binary) {
  const bits = binary.split('');
  const len = bits.length;
  const steps = bits.map((bit, i) => {
    const power = len - 1 - i;
    return `  第${power}位: ${bit} × 2^${power} = ${Number(bit) * Math.pow(2, power)}`;
  });
  return `位取り記数法で展開:\n${steps.join('\n')}\n合計 = ${parseInt(binary, 2)}`;
}

/** 16進→10進の位取り展開 */
function generateHexToDecimalSteps(hex) {
  const values = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15 };
  const digits = hex.split('');
  const len = digits.length;
  const steps = digits.map((digit, i) => {
    const power = len - 1 - i;
    const val = values[digit] !== undefined ? values[digit] : parseInt(digit, 10);
    return `  第${power}位: ${digit}(= ${val}) × 16^${power} = ${val * Math.pow(16, power)}`;
  });
  return `位取り記数法で展開:\n${steps.join('\n')}\n合計 = ${parseInt(hex, 16)}`;
}

/** ビット演算の桁ごとの表 */
function generateBitwiseSteps(aBin, bBin, resultBin, opLabel, rule) {
  const rows = ['桁:     ' + [...Array(aBin.length).keys()].map((i) => aBin.length - 1 - i).join(' ')];
  rows.push(`A:      ${aBin.split('').join(' ')}`);
  rows.push(`B:      ${bBin.split('').join(' ')}`);
  rows.push(`結果:   ${resultBin.split('').join(' ')}`);
  return `【計算方法】各ビットを右端から1桁ずつ比較（${rule}）\n\n${rows.join('\n')}\n\n判定ルール: ${opLabel}`;
}

/** 順列の掛け算展開 P(n,r)=n×(n-1)×... */
function permutationProduct(n, r) {
  const terms = Array.from({ length: r }, (_, i) => n - i);
  return terms.join(' × ');
}

/** 組合せの計算過程 */
function combinationSteps(n, r) {
  const num = permutationProduct(n, r);
  const den = Array.from({ length: r }, (_, i) => r - i).join(' × ');
  const p = factorial(n) / factorial(n - r);
  const result = combination(n, r);
  return `方法1: C(n,r) = P(n,r) / r!\n  P(${n},${r}) = ${num} = ${p}\n  r! = ${den} = ${factorial(r)}\n  C = ${p} ÷ ${factorial(r)} = ${result}\n\n方法2: C(n,r) = n! / (r! × (n-r)!)\n  = ${factorial(n)} / (${factorial(r)} × ${factorial(n - r)}) = ${result}`;
}

// ============================================
// 問題生成関数のリスト
// ============================================

const GENERATORS = [
  // 基数変換
  generate10to2,
  generate2to10,
  generate16to10,
  generateTwoComplement,
  
  // 論理演算
  generateLogicalAND,
  generateLogicalOR,
  generateLogicalXOR,
  
  // シフト演算
  generateLogicalLeftShift,
  generateLogicalRightShift,
  
  // 確率・統計
  generatePermutation,
  generateCombination,
  generateExpectedValue,
  generateAverage,
  generateMedian,
  
  // 性能計算
  generateMIPS,
  generateProcessingTime,
  
  // 稼働率
  generateSerialAvailability,
  generateParallelAvailability,
];

/**
 * ランダムに計算問題を生成
 */
export function generateRandomCalculationProblem() {
  const generator = choice(GENERATORS);
  return generator();
}

/**
 * 複数の計算問題を生成
 */
export function generateCalculationProblems(count) {
  const problems = [];
  const generatorCounts = new Map();
  
  // 各ジェネレータから均等に問題を生成
  for (let i = 0; i < count; i++) {
    const generator = GENERATORS[i % GENERATORS.length];
    generatorCounts.set(generator, (generatorCounts.get(generator) || 0) + 1);
    
    // 同じジェネレータでもランダムな値で異なる問題を生成
    problems.push(generator());
    
    // 少し待機して一意性を確保
    if (i % 10 === 9) {
      // タイムスタンプベースのIDの一意性を確保
    }
  }
  
  return shuffle(problems);
}
