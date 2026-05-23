const CARD_DATABASE = {

    /* ========================= */
    /* ウーサン */
    /* ========================= */

    woosan_scout: {
        id: "woosan_scout",
        name: "ウーサン斥候",
        cost: 1,
        attack: 2,
        hp: 1,
        tribe: "woosan",
        row: "front",
        type: "unit",
        rarity: "common",
        abilities: []
    },

    woosan_rabbit: {
        id: "woosan_rabbit",
        name: "ウーサン突撃兵",
        cost: 2,
        attack: 3,
        hp: 2,
        tribe: "woosan",
        row: "front",
        type: "unit",
        rarity: "common",
        abilities: ["rush"]
    },

    woosan_drummer: {
        id: "woosan_drummer",
        name: "ウーサン鼓舞兵",
        cost: 3,
        attack: 2,
        hp: 4,
        tribe: "woosan",
        row: "back",
        type: "unit",
        rarity: "rare",
        abilities: ["buff"]
    },

    /* ========================= */
    /* ゴリリン */
    /* ========================= */

    gorillin_guard: {
        id: "gorillin_guard",
        name: "ゴリリン重戦士",
        cost: 3,
        attack: 3,
        hp: 5,
        tribe: "gorillin",
        row: "front",
        type: "unit",
        rarity: "common",
        abilities: ["guard"]
    },

    gorillin_crusher: {
        id: "gorillin_crusher",
        name: "ゴリリン粉砕兵",
        cost: 5,
        attack: 6,
        hp: 5,
        tribe: "gorillin",
        row: "front",
        type: "unit",
        rarity: "rare",
        abilities: []
    },

    gorillin_elder: {
        id: "gorillin_elder",
        name: "古代ゴリリン",
        cost: 7,
        attack: 8,
        hp: 8,
        tribe: "gorillin",
        row: "front",
        type: "unit",
        rarity: "legend",
        abilities: ["boss"]
    },

    /* ========================= */
    /* フックロウ */
    /* ========================= */

    fukkurou_mage: {
        id: "fukkurou_mage",
        name: "フックロウ魔導士",
        cost: 2,
        attack: 2,
        hp: 2,
        tribe: "fukkurou",
        row: "back",
        type: "unit",
        rarity: "common",
        abilities: ["spellboost"]
    },

    fukkurou_oracle: {
        id: "fukkurou_oracle",
        name: "時読みフックロウ",
        cost: 4,
        attack: 3,
        hp: 4,
        tribe: "fukkurou",
        row: "back",
        type: "unit",
        rarity: "rare",
        abilities: ["draw"]
    },

    time_bolt: {
        id: "time_bolt",
        name: "タイムボルト",
        cost: 3,
        attack: 0,
        hp: 0,
        tribe: "spell",
        row: "none",
        type: "spell",
        rarity: "common",
        abilities: ["damage"]
    }

};

/* ========================= */
/* 初期デッキ */
/* ========================= */

const DECKS = {

    woosan: {
        id: "woosan",

        name: "ウーサン",

        description:
            "高速展開で一気に押し切るアグロデッキ。"
            + "低コストユニットで盤面を制圧する。",

        cards: [
            "woosan_scout",
            "woosan_scout",
            "woosan_scout",

            "woosan_rabbit",
            "woosan_rabbit",
            "woosan_rabbit",

            "woosan_drummer",
            "woosan_drummer"
        ]
    },

    gorillin: {
        id: "gorillin",

        name: "ゴリリン",

        description:
            "高耐久ユニットで盤面を支配する。"
            + "後半になるほど真価を発揮。",

        cards: [
            "gorillin_guard",
            "gorillin_guard",
            "gorillin_guard",

            "gorillin_crusher",
            "gorillin_crusher",

            "gorillin_elder"
        ]
    },

    fukkurou: {
        id: "fukkurou",

        name: "フックロウ",

        description:
            "魔法と後衛支援を中心に戦う"
            + "テクニカルデッキ。",

        cards: [
            "fukkurou_mage",
            "fukkurou_mage",
            "fukkurou_mage",

            "fukkurou_oracle",
            "fukkurou_oracle",

            "time_bolt",
            "time_bolt"
        ]
    }

};
