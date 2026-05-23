const CHARACTERS = {

  woosan: {

    name: "ウーサン",

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

    name: "ゴリリン",

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

    name: "フックロウ",

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

    name: "モングリン・モングラン",

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

const TREASURES = [

  {name:"古代コイン", value:100},
  {name:"小型歯車", value:100},
  {name:"壊れた懐中時計", value:100},
  {name:"古い巻物", value:100},
  {name:"銀の欠片", value:100},

  {name:"時空宝石", value:500},
  {name:"未来金貨", value:500},
  {name:"浮遊結晶", value:500},
  {name:"幻影リング", value:500},
  {name:"蒼晶石", value:500},

  {name:"王家の砂時計", value:1000},
  {name:"時渡りの剣", value:1000},
  {name:"星屑コア", value:1000},
  {name:"黄金歯車", value:1000},
  {name:"天空宝珠", value:1000},

  {name:"時空王の懐中時計", value:2500},
  {name:"永遠結晶", value:2500},
  {name:"クロノクラウン", value:2500}

];

const BOSSES = [

  "クロノウルフ",
  "ギガントベア",
  "サンドヴァイパー",
  "ライトニングフォックス",
  "クロックタイガー",
  "アイアンタスク",
  "ミストディア",
  "アビスキャット",
  "スカイホーク",
  "カオスリザード"

];
