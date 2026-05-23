const GameState = {

    version: "0.1",

    currentScreen: "menu",

    selectedDeck: null,

    cpuDeck: null,

    turn: 1,

    currentPlayer: "player",

    player: {
        hp: 20,
        mana: 0,
        maxMana: 0,

        deck: [],
        hand: [],

        field: {
            front: [null, null, null],
            back: [null, null, null]
        }
    },

    enemy: {
        hp: 20,
        mana: 0,
        maxMana: 0,

        deck: [],
        hand: [],

        field: {
            front: [null, null, null],
            back: [null, null, null]
        }
    },

    anomaly: {
        active: false,
        name: "時空安定"
    }

};

/* ========================= */
/* ユーティリティ */
/* ========================= */

function cloneCard(cardId) {

    return structuredClone(
        CARD_DATABASE[cardId]
    );

}

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
            [array[j], array[i]];

    }

    return array;

}
