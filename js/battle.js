let selectedAttacker = null;

/* ========================= */
/* ターン開始 */
/* ========================= */

function startTurn(side) {

    GameState.currentPlayer = side;

    const player =
        GameState[side];

    player.maxMana =
        Math.min(
            player.maxMana + 1,
            10
        );

    player.mana =
        player.maxMana;

    drawCard(side);

    renderBattleUI();

    if (side === "enemy") {

        setTimeout(() => {

            cpuTurn();

        }, 1000);

    }

}

/* ========================= */
/* ドロー */
/* ========================= */

function drawCard(side) {

    const player =
        GameState[side];

    if (
        player.deck.length <= 0
    ) {
        return;
    }

    const card =
        player.deck.shift();

    player.hand.push(card);

}

/* ========================= */
/* カード使用 */
/* ========================= */

function playCard(handIndex) {

    if (
        GameState.currentPlayer
        !== "player"
    ) {
        return;
    }

    const card =
        GameState.player.hand[
            handIndex
        ];

    if (
        GameState.player.mana
        < card.cost
    ) {
        return;
    }

    if (card.type === "spell") {

        castSpell(card);

        GameState.player.hand.splice(
            handIndex,
            1
        );

        GameState.player.mana -=
            card.cost;

        renderBattleUI();

        return;

    }

    const row = card.row;

    const field =
        GameState.player.field[row];

    const emptyIndex =
        field.findIndex(
            slot => slot === null
        );

    if (emptyIndex === -1) {
        return;
    }

    GameState.player.mana -=
        card.cost;

    card.canAttack = true;

    field[emptyIndex] = card;

    GameState.player.hand.splice(
        handIndex,
        1
    );

    renderBattleUI();

}

/* ========================= */
/* スペル */
/* ========================= */

function castSpell(card) {

    if (
        card.id === "time_bolt"
    ) {

        GameState.enemy.hp -= 3;

        checkVictory();

    }

}

/* ========================= */
/* 攻撃 */
/* ========================= */

function selectAttacker(
    row,
    index
) {

    if (
        GameState.currentPlayer
        !== "player"
    ) {
        return;
    }

    const attacker =
        GameState.player
        .field[row][index];

    if (!attacker) {
        return;
    }

    selectedAttacker = {
        row,
        index
    };

}

function attackTarget(
    targetRow,
    targetIndex
) {

    if (!selectedAttacker) {
        return;
    }

    const attacker =
        GameState.player.field[
            selectedAttacker.row
        ][selectedAttacker.index];

    const target =
        GameState.enemy.field[
            targetRow
        ][targetIndex];

    if (!attacker || !target) {
        return;
    }

    const enemyFrontAlive =
        GameState.enemy.field.front
        .some(card => card);

    if (
        enemyFrontAlive
        && targetRow === "back"
    ) {
        return;
    }

    target.hp -= attacker.attack;

    attacker.hp -= target.attack;

    if (target.hp <= 0) {

        GameState.enemy.field[
            targetRow
        ][targetIndex] = null;

    }

    if (attacker.hp <= 0) {

        GameState.player.field[
            selectedAttacker.row
        ][selectedAttacker.index] = null;

    }

    selectedAttacker = null;

    renderBattleUI();

    checkVictory();

}

/* ========================= */
/* ターン終了 */
/* ========================= */

document
    .getElementById(
        "end-turn-button"
    )
    .addEventListener(
        "click",
        endPlayerTurn
    );

function endPlayerTurn() {

    if (
        GameState.currentPlayer
        !== "player"
    ) {
        return;
    }

    startTurn("enemy");

}

/* ========================= */
/* 勝敗 */
/* ========================= */

function checkVictory() {

    if (
        GameState.player.hp <= 0
    ) {

        alert("敗北...");
        location.reload();

    }

    if (
        GameState.enemy.hp <= 0
    ) {

        alert("勝利！");
        location.reload();

    }

}
