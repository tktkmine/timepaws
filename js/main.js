window.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeMenu();

    }
);

/* ========================= */
/* 初期化 */
/* ========================= */

function initializeMenu() {

    setupMenuButtons();

    setupDeckButtons();

}

/* ========================= */
/* 画面切替 */
/* ========================= */

function switchScreen(screenId) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });

    document
        .getElementById(screenId)
        .classList.add("active");

    GameState.currentScreen = screenId;

}

/* ========================= */
/* メニュー */
/* ========================= */

function setupMenuButtons() {

    const pveButton =
        document.getElementById(
            "pve-button"
        );

    pveButton.addEventListener(
        "click",
        () => {

            switchScreen(
                "deck-select"
            );

        }
    );

    const backButton =
        document.getElementById(
            "back-menu-button"
        );

    backButton.addEventListener(
        "click",
        () => {

            switchScreen(
                "main-menu"
            );

        }
    );

}

/* ========================= */
/* デッキ選択 */
/* ========================= */

function setupDeckButtons() {

    const deckButtons =
        document.querySelectorAll(
            ".deck-button"
        );

    deckButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const deckId =
                    button.dataset.deck;

                selectDeck(deckId);

            }
        );

    });

    const confirmButton =
        document.getElementById(
            "confirm-deck-button"
        );

    confirmButton.addEventListener(
        "click",
        () => {

            startBattle();

        }
    );

}

function selectDeck(deckId) {

    GameState.selectedDeck = deckId;

    document
        .querySelectorAll(".deck-button")
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });

    document
        .querySelector(
            `[data-deck="${deckId}"]`
        )
        .classList.add("selected");

    const deck = DECKS[deckId];

    document.getElementById(
        "deck-name"
    ).textContent = deck.name;

    document.getElementById(
        "deck-description"
    ).textContent =
        deck.description;

    renderDeckCards(deck);

    document.getElementById(
        "confirm-deck-button"
    ).disabled = false;

}

/* ========================= */
/* デッキ内容表示 */
/* ========================= */

function renderDeckCards(deck) {

    const container =
        document.getElementById(
            "deck-cards"
        );

    container.innerHTML = "";

    deck.cards.forEach(cardId => {

        const card =
            CARD_DATABASE[cardId];

        const div =
            document.createElement("div");

        div.className =
            "card-preview";

        div.innerHTML = `
            <h4>${card.name}</h4>
            <p>Cost ${card.cost}</p>
            <p>
                ${card.attack}
                /
                ${card.hp}
            </p>
        `;

        container.appendChild(div);

    });

}

/* ========================= */
/* バトル開始 */
/* ========================= */

function startBattle() {

    chooseCpuDeck();

    initializeBattleState();

    switchScreen(
        "battle-screen"
    );

    renderBattleUI();

}

function chooseCpuDeck() {

    const deckIds =
        Object.keys(DECKS);

    const candidates =
        deckIds.filter(
            id =>
                id !==
                GameState.selectedDeck
        );

    const randomIndex =
        Math.floor(
            Math.random()
            * candidates.length
        );

    GameState.cpuDeck =
        candidates[randomIndex];

}

/* ========================= */
/* ゲーム初期化 */
/* ========================= */

function initializeBattleState() {

    resetPlayerState();

    setupDecks();

    startFirstTurn();

}

function resetPlayerState() {

    GameState.turn = 1;

    GameState.currentPlayer =
        "player";

    GameState.player.hp = 20;
    GameState.enemy.hp = 20;

    GameState.player.mana = 0;
    GameState.enemy.mana = 0;

    GameState.player.maxMana = 0;
    GameState.enemy.maxMana = 0;

    GameState.player.hand = [];
    GameState.enemy.hand = [];

    GameState.player.field = {
        front: [null, null, null],
        back: [null, null, null]
    };

    GameState.enemy.field = {
        front: [null, null, null],
        back: [null, null, null]
    };

}

function setupDecks() {

    const playerDeck =
        DECKS[
            GameState.selectedDeck
        ];

    const cpuDeck =
        DECKS[
            GameState.cpuDeck
        ];

    GameState.player.deck =
        shuffleArray(
            playerDeck.cards.map(
                cloneCard
            )
        );

    GameState.enemy.deck =
        shuffleArray(
            cpuDeck.cards.map(
                cloneCard
            )
        );

    for (let i = 0; i < 3; i++) {

        drawCard("player");

        drawCard("enemy");

    }

}

function startFirstTurn() {

    startTurn("player");

}
