const CHARACTERS = {

  woosan: {

    id: "woosan",

    name: "ウーサン",

    image: "img/woosan.png",

    hp: 70,

    atk: 8,

    def: 2,

    ctr: 15,

    weights: {

      battle: 20,

      treasure: 20,

      vortex: 20,

      rest: 15,

      acceleration: 40

    }

  },

  gorillin: {

    id: "gorillin",

    name: "ゴリリン",

    image: "img/gorillin.png",

    hp: 120,

    atk: 14,

    def: 5,

    ctr: 10,

    weights: {

      battle: 40,

      treasure: 15,

      vortex: 10,

      rest: 15,

      acceleration: 20

    }

  },

  fukkurou: {

    id: "fukkurou",

    name: "フックロウ",

    image: "img/fukkurou.png",

    hp: 65,

    atk: 7,

    def: 2,

    ctr: 20,

    weights: {

      battle: 15,

      treasure: 15,

      vortex: 50,

      rest: 10,

      acceleration: 10

    }

  },

  mongrin: {

    id: "mongrin",

    name: "モングリン・モングラン",

    image: "img/mongrin.png",

    hp: 90,

    atk: 10,

    def: 3,

    ctr: 12,

    weights: {

      battle: 20,

      treasure: 50,

      vortex: 10,

      rest: 10,

      acceleration: 10

    }

  }

};

/* ========================= */
/* 通常敵 */
/* ========================= */

const ENEMIES = [

  {
    name: "タイムラット",
    hp: 20,
    atk: 5,
    def: 1
  },

  {
    name: "クロノバット",
    hp: 24,
    atk: 6,
    def: 1
  },

  {
    name: "ギアドッグ",
    hp: 28,
    atk: 7,
    def: 2
  },

  {
    name: "スチームキャット",
    hp: 32,
    atk: 8,
    def: 2
  },

  {
    name: "ブレイズフォックス",
    hp: 36,
    atk: 9,
    def: 3
  },

  {
    name: "シャドウディア",
    hp: 40,
    atk: 10,
    def: 3
  },

  {
    name: "サンダーボア",
    hp: 44,
    atk: 11,
    def: 4
  },

  {
    name: "テンペストホーク",
    hp: 48,
    atk: 12,
    def: 4
  },

  {
    name: "アビススネーク",
    hp: 52,
    atk: 13,
    def: 5
  },

  {
    name: "カオスリス",
    hp: 56,
    atk: 14,
    def: 5
  }

];

/* ========================= */
/* ボス */
/* ========================= */

const BOSSES = [

  {
    name: "クロノウルフ",
    hp: 120,
    atk: 14,
    def: 5
  },

  {
    name: "ギガントベア",
    hp: 140,
    atk: 16,
    def: 6
  },

  {
    name: "サンドヴァイパー",
    hp: 150,
    atk: 18,
    def: 6
  },

  {
    name: "ライトニングフォックス",
    hp: 160,
    atk: 20,
    def: 7
  },

  {
    name: "クロックタイガー",
    hp: 180,
    atk: 22,
    def: 8
  },

  {
    name: "アイアンタスク",
    hp: 200,
    atk: 24,
    def: 8
  },

  {
    name: "ミストディア",
    hp: 220,
    atk: 25,
    def: 9
  },

  {
    name: "アビスキャット",
    hp: 240,
    atk: 27,
    def: 10
  },

  {
    name: "スカイホーク",
    hp: 260,
    atk: 29,
    def: 10
  },

  {
    name: "カオスリザード",
    hp: 300,
    atk: 32,
    def: 12
  }

];

/* ========================= */
/* お宝 */
/* ========================= */

const TREASURES = [

  {
    name: "古代コイン",
    value: 100
  },

  {
    name: "小型歯車",
    value: 100
  },

  {
    name: "壊れた懐中時計",
    value: 100
  },

  {
    name: "古い巻物",
    value: 100
  },

  {
    name: "銀の欠片",
    value: 100
  },

  {
    name: "時空宝石",
    value: 500
  },

  {
    name: "未来金貨",
    value: 500
  },

  {
    name: "浮遊結晶",
    value: 500
  },

  {
    name: "幻影リング",
    value: 500
  },

  {
    name: "蒼晶石",
    value: 500
  },

  {
    name: "王家の砂時計",
    value: 1000
  },

  {
    name: "時渡りの剣",
    value: 1000
  },

  {
    name: "星屑コア",
    value: 1000
  },

  {
    name: "黄金歯車",
    value: 1000
  },

  {
    name: "天空宝珠",
    value: 1000
  },

  {
    name: "時空王の懐中時計",
    value: 2500
  },

  {
    name: "永遠結晶",
    value: 2500
  },

  {
    name: "クロノクラウン",
    value: 2500
  }

];
