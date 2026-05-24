const CHARACTERS = {

  woosan: {

    name: "ウーサン",

    image: "img/woosan.png",

    hp: 80,
    atk: 12,
    def: 5,
    ctr: 10,

    weights: {
      battle: 4,
      treasure: 3,
      vortex: 2,
      rest: 1,
      accel: 2
    }

  },

  gorillin: {

    name: "ゴリリン",

    image: "img/gorillin.png",

    hp: 120,
    atk: 18,
    def: 10,
    ctr: 5,

    weights: {
      battle: 6,
      treasure: 2,
      vortex: 1,
      rest: 2,
      accel: 2
    }

  },

  fukkurou: {

    name: "フックロウ",

    image: "img/fukkurou.png",

    hp: 70,
    atk: 10,
    def: 4,
    ctr: 12,

    weights: {
      battle: 3,
      treasure: 2,
      vortex: 6,
      rest: 1,
      accel: 2
    }

  },

  mongrin: {

    name: "モングリン",

    image: "img/mongrin.png",

    hp: 100,
    atk: 14,
    def: 8,
    ctr: 8,

    weights: {
      battle: 3,
      treasure: 5,
      vortex: 2,
      rest: 2,
      accel: 2
    }

  }

};

/* ========================= */
/* 通常敵（10種） */
/* ========================= */

const ENEMIES = [

  { name:"スライムウサギ", hp:30, atk:6, def:2 },
  { name:"クロネズミ", hp:28, atk:5, def:1 },
  { name:"コケ鳥", hp:35, atk:7, def:2 },
  { name:"小牙オオカミ", hp:40, atk:8, def:3 },
  { name:"影ネコ", hp:32, atk:7, def:2 },
  { name:"時渡り虫", hp:25, atk:9, def:1 },
  { name:"石ころゴブリン", hp:45, atk:6, def:4 },
  { name:"ミニドラゴン", hp:50, atk:10, def:3 },
  { name:"霧ウサギ", hp:38, atk:8, def:2 },
  { name:"電気ナメクジ", hp:42, atk:9, def:3 }

];

/* ========================= */
/* ボス（10種） */
/* ========================= */

const BOSSES = [

  { name:"時喰いオオカミ", hp:120, atk:18, def:6 },
  { name:"虚空バイソン", hp:140, atk:20, def:8 },
  { name:"崩壊カラス", hp:110, atk:17, def:5 },
  { name:"深淵トカゲ", hp:150, atk:22, def:10 },
  { name:"古代ゴーレム", hp:180, atk:19, def:12 },
  { name:"雷獣タイガー", hp:130, atk:21, def:7 },
  { name:"氷結フクロウ", hp:125, atk:18, def:6 },
  { name:"影蜘蛛王", hp:160, atk:23, def:9 },
  { name:"終末カメ", hp:200, atk:16, def:15 },
  { name:"時空竜ネブラ", hp:220, atk:25, def:10 }

];

/* ========================= */
/* お宝（18種） */
/* ========================= */

const TREASURES = [

  { name:"古びたコイン", value:100 },
  { name:"時の欠片", value:100 },
  { name:"小さな宝石", value:100 },
  { name:"壊れた指輪", value:100 },
  { name:"謎の歯車", value:100 },

  { name:"銀のメダル", value:500 },
  { name:"時空クリスタル", value:500 },
  { name:"古代の鍵", value:500 },
  { name:"星屑石", value:500 },
  { name:"封印の箱", value:500 },

  { name:"黄金の杯", value:1000 },
  { name:"時王のコイン", value:1000 },
  { name:"竜の牙宝石", value:1000 },
  { name:"天空の羽根", value:1000 },
  { name:"虚空リング", value:1000 },

  { name:"時間核コア", value:2500 },
  { name:"創世の結晶", value:2500 },
  { name:"時空王冠", value:2500 }

];
