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

// ============================================
// 1. 基数変換問題
// ============================================

/**
 * 10進数→2進数変換
 */
function generate10to2() {
  const decimal = randInt(8, 255);
  const binary = decimal.toString(2);
  
  // 間違い選択肢を生成
  const wrong1 = (decimal + randInt(1, 3)).toString(2);
  const wrong2 = (decimal - randInt(1, 3)).toString(2);
  const wrong3 = (decimal ^ randInt(1, 7)).toString(2);
  
  const choices = shuffle([binary, wrong1, wrong2, wrong3]);
  const correctAnswer = choices.indexOf(binary);
  
  return {
    id: `calc_10to2_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `10進数の ${decimal} を2進数で表すとどれか。`,
    choices,
    correctAnswer,
    hint: '2で割り続けて余りを下から読む方法で計算できます。',
    explanation: `10進数 ${decimal} を2進数に変換:\n\n計算過程:\n${generateDivisionSteps(decimal, 2)}\n\n答え: ${binary}`
  };
}

/**
 * 2進数→10進数変換
 */
function generate2to10() {
  const decimal = randInt(8, 255);
  const binary = decimal.toString(2);
  
  const wrong1 = decimal + randInt(1, 5);
  const wrong2 = decimal - randInt(1, 5);
  const wrong3 = parseInt(binary.substring(0, binary.length - 1) + (binary[binary.length - 1] === '0' ? '1' : '0'), 2);
  
  const choices = shuffle([String(decimal), String(wrong1), String(wrong2), String(wrong3)]);
  const correctAnswer = choices.indexOf(String(decimal));
  
  return {
    id: `calc_2to10_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `2進数の ${binary} を10進数で表すとどれか。`,
    choices,
    correctAnswer,
    hint: '各桁の位置に応じた2のべき乗を掛けて合計します。',
    explanation: `2進数 ${binary} を10進数に変換:\n\n${generateBinaryToDecimalSteps(binary)}\n\n答え: ${decimal}`
  };
}

/**
 * 16進数→10進数変換
 */
function generate16to10() {
  const decimal = randInt(16, 255);
  const hex = decimal.toString(16).toUpperCase();
  
  const wrong1 = decimal + randInt(1, 5);
  const wrong2 = decimal - randInt(1, 5);
  const wrong3 = parseInt(hex, 10); // よくある間違い
  
  const choices = shuffle([String(decimal), String(wrong1), String(wrong2), String(wrong3)]);
  const correctAnswer = choices.indexOf(String(decimal));
  
  return {
    id: `calc_16to10_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `16進数の ${hex} を10進数で表すとどれか。`,
    choices,
    correctAnswer,
    hint: '16進数は0-9とA-Fを使います。各桁に16のべき乗を掛けます。',
    explanation: `16進数 ${hex} を10進数に変換:\n\n${generateHexToDecimalSteps(hex)}\n\n答え: ${decimal}`
  };
}

/**
 * 2の補数表現
 */
function generateTwoComplement() {
  const positive = randInt(1, 127);
  const binary = positive.toString(2).padStart(8, '0');
  
  // 2の補数を計算（ビット反転 + 1）
  const inverted = binary.split('').map(b => b === '0' ? '1' : '0').join('');
  let complementBinary = (parseInt(inverted, 2) + 1).toString(2).padStart(8, '0');
  
  // 間違い選択肢
  const wrong1 = inverted; // ビット反転のみ
  const wrong2 = binary; // 元の数
  const wrong3 = (parseInt(inverted, 2) - 1).toString(2).padStart(8, '0');
  
  const choices = shuffle([complementBinary, wrong1, wrong2, wrong3]);
  const correctAnswer = choices.indexOf(complementBinary);
  
  return {
    id: `calc_2comp_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `8ビットの2の補数表現で、-${positive} を表すビット列はどれか。`,
    choices,
    correctAnswer,
    hint: '2の補数は、元の数をビット反転して1を加えます。',
    explanation: `8ビットで -${positive} の2の補数:\n\n1. ${positive}の2進数: ${binary}\n2. ビット反転: ${inverted}\n3. 1を加える: ${complementBinary}\n\n答え: ${complementBinary}`
  };
}

// ============================================
// 2. 論理演算
// ============================================

/**
 * 論理積（AND）演算
 */
function generateLogicalAND() {
  const a = randInt(128, 255);
  const b = randInt(128, 255);
  const result = a & b;
  
  const aBin = a.toString(2).padStart(8, '0');
  const bBin = b.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  
  const wrong1 = a | b; // OR
  const wrong2 = a ^ b; // XOR
  const wrong3 = result + randInt(1, 10);
  
  const choices = shuffle([
    `${resultBin} (${result})`,
    `${(wrong1).toString(2).padStart(8, '0')} (${wrong1})`,
    `${(wrong2).toString(2).padStart(8, '0')} (${wrong2})`,
    `${(wrong3).toString(2).padStart(8, '0')} (${wrong3})`
  ]);
  const correctAnswer = choices.indexOf(`${resultBin} (${result})`);
  
  return {
    id: `calc_and_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `次の2つの8ビット2進数の論理積（AND）を求めよ。\nA: ${aBin}\nB: ${bBin}`,
    choices,
    correctAnswer,
    hint: '論理積は両方が1のときだけ1になります。',
    explanation: `論理積（AND）演算:\n\nA: ${aBin}\nB: ${bBin}\n結果: ${resultBin}\n\n10進数: ${result}\n\n各ビットで両方が1のときのみ1になります。`
  };
}

/**
 * 論理和（OR）演算
 */
function generateLogicalOR() {
  const a = randInt(64, 127);
  const b = randInt(64, 127);
  const result = a | b;
  
  const aBin = a.toString(2).padStart(8, '0');
  const bBin = b.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  
  const wrong1 = a & b;
  const wrong2 = a ^ b;
  const wrong3 = result + randInt(1, 10);
  
  const choices = shuffle([
    `${resultBin} (${result})`,
    `${(wrong1).toString(2).padStart(8, '0')} (${wrong1})`,
    `${(wrong2).toString(2).padStart(8, '0')} (${wrong2})`,
    `${(wrong3).toString(2).padStart(8, '0')} (${wrong3})`
  ]);
  const correctAnswer = choices.indexOf(`${resultBin} (${result})`);
  
  return {
    id: `calc_or_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `次の2つの8ビット2進数の論理和（OR）を求めよ。\nA: ${aBin}\nB: ${bBin}`,
    choices,
    correctAnswer,
    hint: '論理和はどちらか一方でも1なら1になります。',
    explanation: `論理和（OR）演算:\n\nA: ${aBin}\nB: ${bBin}\n結果: ${resultBin}\n\n10進数: ${result}`
  };
}

/**
 * 排他的論理和（XOR）演算
 */
function generateLogicalXOR() {
  const a = randInt(64, 200);
  const b = randInt(64, 200);
  const result = a ^ b;
  
  const aBin = a.toString(2).padStart(8, '0');
  const bBin = b.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  
  const wrong1 = a & b;
  const wrong2 = a | b;
  const wrong3 = result + randInt(1, 10);
  
  const choices = shuffle([
    `${resultBin} (${result})`,
    `${(wrong1).toString(2).padStart(8, '0')} (${wrong1})`,
    `${(wrong2).toString(2).padStart(8, '0')} (${wrong2})`,
    `${(wrong3).toString(2).padStart(8, '0')} (${wrong3})`
  ]);
  const correctAnswer = choices.indexOf(`${resultBin} (${result})`);
  
  return {
    id: `calc_xor_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `次の2つの8ビット2進数の排他的論理和（XOR）を求めよ。\nA: ${aBin}\nB: ${bBin}`,
    choices,
    correctAnswer,
    hint: 'XORは2つのビットが異なるときだけ1になります。',
    explanation: `排他的論理和（XOR）演算:\n\nA: ${aBin}\nB: ${bBin}\n結果: ${resultBin}\n\n10進数: ${result}\n\n異なるビットの位置で1になります。`
  };
}

// ============================================
// 3. シフト演算
// ============================================

/**
 * 論理左シフト
 */
function generateLogicalLeftShift() {
  const value = randInt(8, 63);
  const shift = randInt(1, 3);
  const result = (value << shift) & 0xFF; // 8ビットマスク
  
  const valueBin = value.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  
  const wrong1 = value << (shift + 1);
  const wrong2 = value >> shift;
  const wrong3 = value * shift;
  
  const choices = shuffle([
    `${resultBin} (${result})`,
    `${(wrong1 & 0xFF).toString(2).padStart(8, '0')} (${wrong1 & 0xFF})`,
    `${(wrong2).toString(2).padStart(8, '0')} (${wrong2})`,
    `${(wrong3 & 0xFF).toString(2).padStart(8, '0')} (${wrong3 & 0xFF})`
  ]);
  const correctAnswer = choices.indexOf(`${resultBin} (${result})`);
  
  return {
    id: `calc_lshift_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `8ビットの値 ${valueBin} を論理左シフト${shift}ビット行った結果はどれか。`,
    choices,
    correctAnswer,
    hint: '左シフトは2倍を繰り返す操作です。右側に0が入ります。',
    explanation: `論理左シフト${shift}ビット:\n\n元の値: ${valueBin} (${value})\n結果: ${resultBin} (${result})\n\n左に${shift}ビットシフトし、右側に0を詰めます。\n${value} × 2^${shift} = ${value * (2 ** shift)} → 8ビットで ${result}`
  };
}

/**
 * 論理右シフト
 */
function generateLogicalRightShift() {
  const value = randInt(64, 255);
  const shift = randInt(1, 3);
  const result = value >>> shift;
  
  const valueBin = value.toString(2).padStart(8, '0');
  const resultBin = result.toString(2).padStart(8, '0');
  
  const wrong1 = value >> (shift + 1);
  const wrong2 = value << shift;
  const wrong3 = Math.floor(value / shift);
  
  const choices = shuffle([
    `${resultBin} (${result})`,
    `${(wrong1).toString(2).padStart(8, '0')} (${wrong1})`,
    `${(wrong2 & 0xFF).toString(2).padStart(8, '0')} (${wrong2 & 0xFF})`,
    `${(wrong3).toString(2).padStart(8, '0')} (${wrong3})`
  ]);
  const correctAnswer = choices.indexOf(`${resultBin} (${result})`);
  
  return {
    id: `calc_rshift_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '離散数学',
    isCalculation: true,
    question: `8ビットの値 ${valueBin} を論理右シフト${shift}ビット行った結果はどれか。`,
    choices,
    correctAnswer,
    hint: '右シフトは2で割る操作です。左側に0が入ります。',
    explanation: `論理右シフト${shift}ビット:\n\n元の値: ${valueBin} (${value})\n結果: ${resultBin} (${result})\n\n右に${shift}ビットシフトし、左側に0を詰めます。\nほぼ ${value} ÷ 2^${shift} = ${Math.floor(value / (2 ** shift))} と同じ`
  };
}

// ============================================
// 4. 確率・統計
// ============================================

/**
 * 順列の計算
 */
function generatePermutation() {
  const n = randInt(5, 8);
  const r = randInt(2, Math.min(4, n - 1));
  
  const result = factorial(n) / factorial(n - r);
  
  const wrong1 = factorial(n);
  const wrong2 = combination(n, r);
  const wrong3 = Math.pow(n, r);
  
  const choices = shuffle([String(result), String(wrong1), String(wrong2), String(wrong3)]);
  const correctAnswer = choices.indexOf(String(result));
  
  return {
    id: `calc_perm_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `${n}個の異なるものから${r}個を選んで並べる順列 P(${n},${r}) の総数はいくつか。`,
    choices,
    correctAnswer,
    hint: '順列は P(n,r) = n!/(n-r)! で計算します。',
    explanation: `順列 P(${n},${r}) の計算:\n\nP(${n},${r}) = ${n}! / (${n}-${r})!\n= ${n}! / ${n - r}!\n= ${factorial(n)} / ${factorial(n - r)}\n= ${result}\n\n答え: ${result}`
  };
}

/**
 * 組合せの計算
 */
function generateCombination() {
  const n = randInt(5, 10);
  const r = randInt(2, Math.min(5, n - 1));
  
  const result = combination(n, r);
  
  const wrong1 = factorial(n) / factorial(n - r);
  const wrong2 = factorial(n);
  const wrong3 = n * r;
  
  const choices = shuffle([String(result), String(wrong1), String(wrong2), String(wrong3)]);
  const correctAnswer = choices.indexOf(String(result));
  
  return {
    id: `calc_comb_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `${n}個の異なるものから${r}個を選ぶ組合せ C(${n},${r}) の総数はいくつか。`,
    choices,
    correctAnswer,
    hint: '組合せは C(n,r) = n! / (r!(n-r)!) で計算します。順序は関係ありません。',
    explanation: `組合せ C(${n},${r}) の計算:\n\nC(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!)\n= ${factorial(n)} / (${factorial(r)} × ${factorial(n - r)})\n= ${result}\n\n答え: ${result}`
  };
}

/**
 * 期待値の計算
 */
function generateExpectedValue() {
  const values = [randInt(1, 3) * 100, randInt(4, 6) * 100, randInt(7, 9) * 100];
  const probabilities = [0.2, 0.3, 0.5];
  
  const expected = values.reduce((sum, val, i) => sum + val * probabilities[i], 0);
  
  const wrong1 = (values[0] + values[1] + values[2]) / 3;
  const wrong2 = values[2];
  const wrong3 = expected + randInt(10, 50);
  
  const choices = shuffle([
    String(expected),
    String(Math.round(wrong1)),
    String(wrong2),
    String(Math.round(wrong3))
  ]);
  const correctAnswer = choices.indexOf(String(expected));
  
  return {
    id: `calc_expect_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `ある抽選で、${values[0]}円が当たる確率が${probabilities[0]}、${values[1]}円が当たる確率が${probabilities[1]}、${values[2]}円が当たる確率が${probabilities[2]}のとき、期待値はいくらか。`,
    choices,
    correctAnswer,
    hint: '期待値 = Σ(値 × 確率) で計算します。',
    explanation: `期待値の計算:\n\n期待値 = ${values[0]} × ${probabilities[0]} + ${values[1]} × ${probabilities[1]} + ${values[2]} × ${probabilities[2]}\n= ${values[0] * probabilities[0]} + ${values[1] * probabilities[1]} + ${values[2] * probabilities[2]}\n= ${expected}円\n\n答え: ${expected}円`
  };
}

/**
 * 平均値の計算
 */
function generateAverage() {
  const count = randInt(4, 6);
  const data = Array.from({ length: count }, () => randInt(10, 99));
  
  const sum = data.reduce((a, b) => a + b, 0);
  const avg = sum / count;
  const avgRounded = Math.round(avg * 10) / 10;
  
  const wrong1 = Math.round((sum / (count + 1)) * 10) / 10;
  const wrong2 = Math.round((sum / (count - 1)) * 10) / 10;
  const wrong3 = Math.round((sum / count + randInt(1, 5)) * 10) / 10;
  
  const choices = shuffle([
    String(avgRounded),
    String(wrong1),
    String(wrong2),
    String(wrong3)
  ]);
  const correctAnswer = choices.indexOf(String(avgRounded));
  
  return {
    id: `calc_avg_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `次のデータの平均値を求めよ（小数第1位まで）。\nデータ: ${data.join(', ')}`,
    choices,
    correctAnswer,
    hint: '平均値 = データの合計 ÷ データの個数',
    explanation: `平均値の計算:\n\n合計 = ${data.join(' + ')} = ${sum}\n平均 = ${sum} ÷ ${count} = ${avgRounded}\n\n答え: ${avgRounded}`
  };
}

/**
 * 中央値の計算
 */
function generateMedian() {
  const count = choice([5, 7]);
  const data = Array.from({ length: count }, () => randInt(10, 99)).sort((a, b) => a - b);
  
  const median = data[Math.floor(count / 2)];
  
  const wrong1 = data[0];
  const wrong2 = data[count - 1];
  const wrong3 = Math.round(data.reduce((a, b) => a + b, 0) / count);
  
  const choices = shuffle([String(median), String(wrong1), String(wrong2), String(wrong3)]);
  const correctAnswer = choices.indexOf(String(median));
  
  return {
    id: `calc_median_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '応用数学',
    isCalculation: true,
    question: `次のデータの中央値（メジアン）を求めよ。\nデータ: ${data.join(', ')}`,
    choices,
    correctAnswer,
    hint: 'データを小さい順に並べて真ん中の値を取ります。',
    explanation: `中央値の計算:\n\nソート済みデータ: ${data.join(', ')}\nデータ数: ${count}個\n中央値: ${median}（真ん中の値）\n\n答え: ${median}`
  };
}

// ============================================
// 5. MIPS・性能計算
// ============================================

/**
 * MIPS計算
 */
function generateMIPS() {
  const clockMHz = randInt(500, 3000);
  const cpi = choice([2, 3, 4, 5]);
  
  const mips = (clockMHz / cpi).toFixed(0);
  
  const wrong1 = (clockMHz * cpi).toFixed(0);
  const wrong2 = (clockMHz / (cpi + 1)).toFixed(0);
  const wrong3 = (clockMHz / (cpi - 1)).toFixed(0);
  
  const choices = shuffle([mips, wrong1, wrong2, wrong3]);
  const correctAnswer = choices.indexOf(mips);
  
  return {
    id: `calc_mips_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `クロック周波数が${clockMHz}MHz、CPI（クロック当たりの命令数）が${cpi}のプロセッサの性能は何MIPSか。`,
    choices,
    correctAnswer,
    hint: 'MIPS = クロック周波数(MHz) / CPI',
    explanation: `MIPS の計算:\n\nMIPS = クロック周波数 / CPI\n= ${clockMHz} / ${cpi}\n= ${mips} MIPS\n\n答え: ${mips} MIPS`
  };
}

/**
 * 処理時間の計算
 */
function generateProcessingTime() {
  const instructions = randInt(100, 500) * 1000; // K命令
  const mips = randInt(50, 200);
  
  const timeMs = (instructions / (mips * 1000)).toFixed(2);
  
  const wrong1 = (instructions / mips).toFixed(2);
  const wrong2 = (mips / instructions * 1000).toFixed(2);
  const wrong3 = (instructions * mips / 1000).toFixed(2);
  
  const choices = shuffle([timeMs, wrong1, wrong2, wrong3]);
  const correctAnswer = choices.indexOf(timeMs);
  
  return {
    id: `calc_ptime_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `性能が${mips}MIPSのプロセッサで、${instructions / 1000}K命令のプログラムを実行するのに必要な時間は何ミリ秒か。`,
    choices,
    correctAnswer,
    hint: '実行時間(秒) = 命令数 / (MIPS × 10^6)',
    explanation: `処理時間の計算:\n\n実行時間 = 命令数 / (MIPS × 10^6)\n= ${instructions} / (${mips} × 1,000,000)\n= ${parseFloat(timeMs) / 1000} 秒\n= ${timeMs} ミリ秒\n\n答え: ${timeMs} ms`
  };
}

// ============================================
// 6. 稼働率の計算
// ============================================

/**
 * 直列システムの稼働率
 */
function generateSerialAvailability() {
  const a1 = (randInt(90, 98) / 100).toFixed(2);
  const a2 = (randInt(90, 98) / 100).toFixed(2);
  
  const result = (parseFloat(a1) * parseFloat(a2) * 100).toFixed(1);
  
  const wrong1 = (parseFloat(a1) + parseFloat(a2)) * 50;
  const wrong2 = ((1 - (1 - parseFloat(a1)) * (1 - parseFloat(a2))) * 100).toFixed(1);
  const wrong3 = ((parseFloat(a1) + parseFloat(a2)) / 2 * 100).toFixed(1);
  
  const choices = shuffle([result + '%', wrong1.toFixed(1) + '%', wrong2 + '%', wrong3 + '%']);
  const correctAnswer = choices.indexOf(result + '%');
  
  return {
    id: `calc_avail_serial_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `稼働率${a1}のシステムAと稼働率${a2}のシステムBを直列に接続したとき、システム全体の稼働率は何%か。`,
    choices,
    correctAnswer,
    hint: '直列システムの稼働率 = 各システムの稼働率の積',
    explanation: `直列システムの稼働率:\n\n全体の稼働率 = ${a1} × ${a2}\n= ${(parseFloat(a1) * parseFloat(a2)).toFixed(4)}\n= ${result}%\n\n答え: ${result}%`
  };
}

/**
 * 並列システムの稼働率
 */
function generateParallelAvailability() {
  const a1 = (randInt(80, 95) / 100).toFixed(2);
  const a2 = (randInt(80, 95) / 100).toFixed(2);
  
  const result = ((1 - (1 - parseFloat(a1)) * (1 - parseFloat(a2))) * 100).toFixed(1);
  
  const wrong1 = (parseFloat(a1) * parseFloat(a2) * 100).toFixed(1);
  const wrong2 = ((parseFloat(a1) + parseFloat(a2)) / 2 * 100).toFixed(1);
  const wrong3 = ((parseFloat(a1) + parseFloat(a2)) * 50).toFixed(1);
  
  const choices = shuffle([result + '%', wrong1 + '%', wrong2 + '%', wrong3 + '%']);
  const correctAnswer = choices.indexOf(result + '%');
  
  return {
    id: `calc_avail_parallel_${Date.now()}_${randInt(1000, 9999)}`,
    category: 'テクノロジー',
    subcategory: '性能計算',
    isCalculation: true,
    question: `稼働率${a1}のシステムAと稼働率${a2}のシステムBを並列（冗長化）に接続したとき、システム全体の稼働率は何%か。`,
    choices,
    correctAnswer,
    hint: '並列システムの稼働率 = 1 - (1-A)×(1-B)',
    explanation: `並列システムの稼働率:\n\n全体の稼働率 = 1 - (1-${a1}) × (1-${a2})\n= 1 - ${(1 - parseFloat(a1)).toFixed(2)} × ${(1 - parseFloat(a2)).toFixed(2)}\n= 1 - ${((1 - parseFloat(a1)) * (1 - parseFloat(a2))).toFixed(4)}\n= ${(parseFloat(result) / 100).toFixed(4)}\n= ${result}%\n\n答え: ${result}%`
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

function generateDivisionSteps(num, base) {
  let steps = [];
  let n = num;
  while (n > 0) {
    steps.push(`${n} ÷ ${base} = ${Math.floor(n / base)} ... ${n % base}`);
    n = Math.floor(n / base);
  }
  return steps.join('\n');
}

function generateBinaryToDecimalSteps(binary) {
  const bits = binary.split('').reverse();
  const steps = bits.map((bit, i) => `${bit} × 2^${i} = ${bit * Math.pow(2, i)}`);
  return steps.reverse().join('\n') + '\n合計: ' + parseInt(binary, 2);
}

function generateHexToDecimalSteps(hex) {
  const digits = hex.split('').reverse();
  const values = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15 };
  const steps = digits.map((digit, i) => {
    const val = values[digit] || parseInt(digit);
    return `${digit} × 16^${i} = ${val * Math.pow(16, i)}`;
  });
  return steps.reverse().join('\n') + '\n合計: ' + parseInt(hex, 16);
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
