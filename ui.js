function renderBattleUI() {

    updateBattleInfo();

    renderHands();

    renderFields();

}

function updateBattleInfo() {

    document.getElementById(
        "player-hp"
    ).textContent =
        GameState.player.hp;

    document.getElementById(
        "enemy-hp"
    ).textContent =
        GameState.enemy.hp;

    document.getElementById(
        "player-mana"
    ).textContent =
        `${GameState.player.mana}/${GameState.player.maxMana}`;

    document.getElementById(
        "enemy-mana"
    ).textContent =
        `${GameState.enemy.mana}/${GameState.enemy.maxMana}`;

    document.getElementById(
        "turn-display"
    ).textContent =
        `TURN ${GameState.turn}`;

    document.getElementById(
        "phase-display"
    ).textContent =
        GameState.currentPlayer === "player"
            ? "PLAYER TURN"
            : "ENEMY TURN";

}

function renderHands() {

    renderPlayerHand();

    renderEnemyHand();

}

function renderPlayerHand() {

    const hand =
        document.getElementById(
            "player-hand"
        );

    hand.innerHTML = "";

    GameState.player.hand.forEach(
        (card, index) => {

            const cardDiv =
                createCardElement(card);

            cardDiv.addEventListener(
                "click",
                () => {

                    playCard(index);

                }
            );

            hand.appendChild(cardDiv);

        }
    );

}

function renderEnemyHand() {

    const hand =
        document.getElementById(
            "enemy-hand"
        );

    hand.innerHTML = "";

    GameState.enemy.hand.forEach(
        () => {

            const back =
                document.createElement(
                    "div"
                );

            back.className =
                "card";

            back.style.background =
                "#444";

            hand.appendChild(back);

        }
    );

}

function createCardElement(card) {

    const div =
        document.createElement("div");

    div.className = "card";

    if (card.type === "spell") {

        div.innerHTML = `
            <div class="card-cost">
                ${card.cost}
            </div>

            <div class="card-name">
                ${card.name}
            </div>

            <div class="card-type">
                SPELL
            </div>
        `;

    } else {

        div.innerHTML = `
            <div class="card-cost">
                ${card.cost}
            </div>

            <div class="card-name">
                ${card.name}
            </div>

            <div class="card-stats">
                <span>
                    ${card.attack}
                </span>

                <span>
                    ${card.hp}
                </span>
            </div>
        `;

    }

    return div;

}

function renderFields() {

    renderSideField("player");

    renderSideField("enemy");

}

function renderSideField(side) {

    const field =
        GameState[side].field;

    ["front", "back"].forEach(row => {

        field[row].forEach(
            (card, index) => {

                const slot =
                    document.querySelector(
                        `.field-slot[data-side="${side}"][data-row="${row}"][data-index="${index}"]`
                    );

                slot.innerHTML = "";

                if (!card) {
                    return;
                }

                const cardDiv =
                    createCardElement(card);

                if (side === "player") {

                    cardDiv.addEventListener(
                        "click",
                        () => {

                            selectAttacker(
                                row,
                                index
                            );

                        }
                    );

                } else {

                    cardDiv.addEventListener(
                        "click",
                        () => {

                            attackTarget(
                                row,
                                index
                            );

                        }
                    );

                }

                slot.appendChild(cardDiv);

            }
        );

    });

}
