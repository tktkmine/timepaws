// ============================================================
// data.js - キャラクター・敵・宝・イベントデータ管理
// ============================================================

// ============================================================
// キャラクターデータ
// ============================================================
const CHARACTERS = {
  woosan: {
    id: "woosan",
    name: "ウーサン",
    sub: "子ウサギ",
    img: "img/woosan.png",
    hp: 80,
    atk: 12,
    def: 5,
    ctr: 15,
    description: "素早さが自慢の子ウサギ。戦闘力は低いが、加速イベントを引きやすい。",
    eventWeights: {
      battle: 15,
      treasure: 15,
      vortex: 15,
      rest: 15,
      acceleration: 25, // 加速イベントを引きやすい
      boss: 15,
    },
  },
  gorillin: {
    id: "gorillin",
    name: "ゴリリン",
    sub: "子ゴリラ",
    img: "img/gorillin.png",
    hp: 150,
    atk: 25,
    def: 15,
    ctr: 8,
    description: "圧倒的な戦闘力と耐久力を誇る子ゴリラ。全イベントを均等に引く。",
    eventWeights: {
      battle: 17,
      treasure: 17,
      vortex: 17,
      rest: 17,
      acceleration: 17,
      boss: 15,
    },
  },
  fukkurou: {
    id: "fukkurou",
    name: "フックロウ",
    sub: "子フクロウ",
    img: "img/fukkurou.png",
    hp: 70,
    atk: 10,
    def: 4,
    ctr: 12,
    description: "時空を操る子フクロウ。時空の渦イベントを引きやすく、必ず時間が増える。",
    eventWeights: {
      battle: 12,
      treasure: 12,
      vortex: 30, // 時空の渦を引きやすい
      rest: 13,
      acceleration: 13,
      boss: 15,
    },
    vortexAlwaysPositive: true, // 時空の渦で必ず時間増加
  },
  mongrin: {
    id: "mongrin",
    name: "モングリン",
    sub: "モグラ親父",
    img: "img/mongrin.png",
    hp: 110,
    atk: 18,
    def: 10,
    ctr: 10,
    description: "宝探しの達人モグラ親父。お宝イベントを引きやすく、罠が発生しない。",
    eventWeights: {
      battle: 12,
      treasure: 30, // お宝イベントを引きやすい
      vortex: 13,
      rest: 13,
      acceleration: 12,
      boss: 15,
    },
    noTreasureTrap: true, // お宝探しで罠が発生しない
  },
};

// ============================================================
// 通常敵データ（20種類）時間＋動物テーマ
// ============================================================
const ENEMIES = [
  { id: "e01", name: "時計ネコ",      hp: 40,  atk: 10, def: 3,  ctr: 5,  exp: 1 },
  { id: "e02", name: "砂時計キツネ",  hp: 55,  atk: 13, def: 5,  ctr: 8,  exp: 1 },
  { id: "e03", name: "分針イヌ",      hp: 50,  atk: 12, def: 4,  ctr: 6,  exp: 1 },
  { id: "e04", name: "秒針トカゲ",    hp: 35,  atk: 15, def: 2,  ctr: 10, exp: 1 },
  { id: "e05", name: "時空クマ",      hp: 80,  atk: 16, def: 8,  ctr: 7,  exp: 1 },
  { id: "e06", name: "永遠ヘビ",      hp: 60,  atk: 14, def: 6,  ctr: 9,  exp: 1 },
  { id: "e07", name: "瞬間ネズミ",    hp: 30,  atk: 18, def: 1,  ctr: 15, exp: 1 },
  { id: "e08", name: "過去ペンギン",  hp: 65,  atk: 11, def: 9,  ctr: 5,  exp: 1 },
  { id: "e09", name: "未来タヌキ",    hp: 70,  atk: 17, def: 7,  ctr: 8,  exp: 1 },
  { id: "e10", name: "逆行アリクイ",  hp: 45,  atk: 13, def: 5,  ctr: 12, exp: 1 },
  { id: "e11", name: "時歪みシカ",    hp: 90,  atk: 19, def: 10, ctr: 6,  exp: 1 },
  { id: "e12", name: "刹那ビーバー",  hp: 40,  atk: 20, def: 3,  ctr: 14, exp: 1 },
  { id: "e13", name: "残影ヒョウ",    hp: 75,  atk: 22, def: 8,  ctr: 10, exp: 1 },
  { id: "e14", name: "時縛りカメ",    hp: 100, atk: 10, def: 15, ctr: 4,  exp: 1 },
  { id: "e15", name: "黄昏オオカミ",  hp: 85,  atk: 21, def: 9,  ctr: 11, exp: 1 },
  { id: "e16", name: "夜明けバク",    hp: 60,  atk: 15, def: 6,  ctr: 8,  exp: 1 },
  { id: "e17", name: "時喰いカバ",    hp: 110, atk: 18, def: 12, ctr: 5,  exp: 1 },
  { id: "e18", name: "千年ワニ",      hp: 95,  atk: 20, def: 11, ctr: 7,  exp: 1 },
  { id: "e19", name: "瞬獄コウモリ",  hp: 50,  atk: 24, def: 4,  ctr: 16, exp: 1 },
  { id: "e20", name: "迷宮ライオン",  hp: 105, atk: 23, def: 13, ctr: 9,  exp: 1 },
];

// ============================================================
// ボスデータ（10種類）時間＋動物テーマ
// ============================================================
const BOSSES = [
  { id: "b01", name: "時空王カイオウ",      hp: 200, atk: 28, def: 15, ctr: 10 },
  { id: "b02", name: "永劫龍ジカーン",      hp: 250, atk: 32, def: 18, ctr: 12 },
  { id: "b03", name: "歴史喰いマンモス",    hp: 300, atk: 25, def: 22, ctr: 8  },
  { id: "b04", name: "刹那神ファルコーン",  hp: 180, atk: 35, def: 12, ctr: 18 },
  { id: "b05", name: "時縛り大公クロノス",  hp: 270, atk: 30, def: 20, ctr: 10 },
  { id: "b06", name: "亜空間皇テンポラ",    hp: 220, atk: 33, def: 16, ctr: 14 },
  { id: "b07", name: "逆行獣レグレス",      hp: 240, atk: 27, def: 19, ctr: 11 },
  { id: "b08", name: "無限蛇エターナル",    hp: 350, atk: 22, def: 25, ctr: 7  },
  { id: "b09", name: "時流王バスト",        hp: 190, atk: 38, def: 14, ctr: 20 },
  { id: "b10", name: "時の覇者クロニクル",  hp: 400, atk: 35, def: 28, ctr: 15 },
];

// ============================================================
// 宝データ（18種類）
// ============================================================
const TREASURES = [
  // 低級宝（100pt × 5種）
  { id: "t01", name: "錆びた懐中時計",   value: 100, rank: "低級" },
  { id: "t02", name: "古びた砂時計",     value: 100, rank: "低級" },
  { id: "t03", name: "割れた時計盤",     value: 100, rank: "低級" },
  { id: "t04", name: "曇ったガラス玉",   value: 100, rank: "低級" },
  { id: "t05", name: "色あせたコイン",   value: 100, rank: "低級" },
  // 中級宝（500pt × 5種）
  { id: "t06", name: "銀の時計",         value: 500, rank: "中級" },
  { id: "t07", name: "時空の欠片",       value: 500, rank: "中級" },
  { id: "t08", name: "古代の宝珠",       value: 500, rank: "中級" },
  { id: "t09", name: "精霊の羽根",       value: 500, rank: "中級" },
  { id: "t10", name: "魔法の羅針盤",     value: 500, rank: "中級" },
  // 高級宝（1000pt × 5種）
  { id: "t11", name: "黄金の砂時計",     value: 1000, rank: "高級" },
  { id: "t12", name: "時の宝玉",         value: 1000, rank: "高級" },
  { id: "t13", name: "龍の時計石",       value: 1000, rank: "高級" },
  { id: "t14", name: "永遠の水晶",       value: 1000, rank: "高級" },
  { id: "t15", name: "星の記憶石",       value: 1000, rank: "高級" },
  // 伝説級宝（2500pt × 3種）
  { id: "t16", name: "時空覇王の冠",     value: 2500, rank: "伝説" },
  { id: "t17", name: "永劫龍の心臓石",   value: 2500, rank: "伝説" },
  { id: "t18", name: "始原の時計塔の鍵", value: 2500, rank: "伝説" },
];

// ============================================================
// イベント種類定義
// ============================================================
const EVENT_TYPES = {
  battle:       { id: "battle",       name: "⚔️ 戦闘",       description: "敵と遭遇した！" },
  treasure:     { id: "treasure",     name: "💎 お宝探し",   description: "宝の予感がする…" },
  vortex:       { id: "vortex",       name: "🌀 時空の渦",   description: "時空の歪みを感じる…" },
  rest:         { id: "rest",         name: "🏕️ 休息",       description: "安全な場所を発見した。" },
  acceleration: { id: "acceleration", name: "⚡ 時の加速",   description: "時間が歪み、前方へ飛ばされる！" },
  boss:         { id: "boss",         name: "💀 ボス戦",     description: "強大な気配を感じる…！" },
};

// ============================================================
// 時空イベント定義（階層移動時5%で発生）
// ============================================================
const SPACETIME_EVENTS = [
  {
    id: "fast",
    name: "⚡ 神速空間",
    description: "時間の流れが加速した！制限時間の減少が50%速くなる。",
    speedMultiplier: 1.5,
  },
  {
    id: "slow",
    name: "🐢 亜空間",
    description: "時間の流れが緩やかになった。制限時間の減少が50%遅くなる。",
    speedMultiplier: 0.5,
  },
  {
    id: "normal",
    name: "🌐 通常時空",
    description: "時空が安定した。制限時間の減少速度が通常に戻る。",
    speedMultiplier: 1.0,
  },
];

// ============================================================
// ユーティリティ関数
// ============================================================

/** 重み付きランダム選択 */
function weightedRandom(weights) {
  const keys = Object.keys(weights);
  const total = keys.reduce((sum, k) => sum + weights[k], 0);
  let rand = Math.random() * total;
  for (const key of keys) {
    rand -= weights[key];
    if (rand <= 0) return key;
  }
  return keys[keys.length - 1];
}

/** 配列からランダムに1つ取得 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 重複なしで配列からn個取得 */
function randomPickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/** ランダム整数（min以上max以下） */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 確率判定（rate: 0〜100） */
function chance(rate) {
  return Math.random() * 100 < rate;
}

/** 宝のランクに応じた重みでランダム取得 */
function getRandomTreasure() {
  const weights = { 低級: 55, 中級: 30, 高級: 12, 伝説: 3 };
  const rank = weightedRandom(weights);
  const pool = TREASURES.filter((t) => t.rank === rank);
  return randomPick(pool);
}

/** フロアに応じてスケールした通常敵を取得 */
function getScaledEnemy(floor) {
  const base = randomPick(ENEMIES);
  const scale = 1 + (floor - 1) * 0.08; // 階層毎に8%強化
  return {
    ...base,
    hp:  Math.round(base.hp  * scale),
    atk: Math.round(base.atk * scale),
    def: Math.round(base.def * scale),
    currentHp: Math.round(base.hp * scale),
  };
}

/** ボス敵をランダム取得 */
function getRandomBoss() {
  const boss = randomPick(BOSSES);
  return { ...boss, currentHp: boss.hp };
}

/** イベントを2つランダム選出（重み付き、重複なし） */
function pickTwoEvents(character) {
  const weights = { ...character.eventWeights };
  const first = weightedRandom(weights);
  // 1つ目と同じイベントを除外して2つ目を選ぶ
  const weightsWithout = { ...weights };
  delete weightsWithout[first];
  const second = weightedRandom(weightsWithout);
  return [EVENT_TYPES[first], EVENT_TYPES[second]];
}
