function cpuTurn() {

    cpuPlayCards();

    cpuAttack();

    renderBattleUI();

    setTimeout(() => {

        GameState.turn++;

        startTurn("player");

    }, 1000);

}

function cpuPlayCards() {

    let played = true;

    while (played) {

        played = false;

        for (
            let i = 0;
            i < GameState.enemy.hand.length;
            i++
        ) {

            const card =
                GameState.enemy.hand[i];

            if (
                card.cost >
                GameState.enemy.mana
            ) {
                continue;
            }

            if (
                card.type === "spell"
            ) {

                GameState.player.hp -= 3;

                GameState.enemy.mana -=
                    card.cost;

                GameState.enemy.hand.splice(
                    i,
                    1
                );

                played = true;

                break;

            }

            const row = card.row;

            const field =
                GameState.enemy.field[row];

            const emptyIndex =
                field.findIndex(
                    slot => slot === null
                );

            if (
                emptyIndex === -1
            ) {
                continue;
            }

            field[emptyIndex] = card;

            GameState.enemy.mana -=
                card.cost;

            GameState.enemy.hand.splice(
                i,
                1
            );

            played = true;

            break;

        }

    }

}

function cpuAttack() {

    ["front", "back"].forEach(
        row => {

            GameState.enemy.field[row]
            .forEach(card => {

                if (!card) {
                    return;
                }

                attackPlayerUnit(card);

            });

        }
    );

}

function attackPlayerUnit(attacker) {

    const playerFront =
        GameState.player.field.front;

    const frontTarget =
        playerFront.find(
            unit => unit
        );

    if (frontTarget) {

        frontTarget.hp -=
            attacker.attack;

        attacker.hp -=
            frontTarget.attack;

        cleanupDeadUnits();

        return;

    }

    const playerBack =
        GameState.player.field.back;

    const backTarget =
        playerBack.find(
            unit => unit
        );

    if (backTarget) {

        backTarget.hp -=
            attacker.attack;

        attacker.hp -=
            backTarget.attack;

        cleanupDeadUnits();

        return;

    }

    GameState.player.hp -=
        attacker.attack;

    checkVictory();

}

function cleanupDeadUnits() {

    ["front", "back"].forEach(
        row => {

            GameState.player.field[row] =
                GameState.player.field[row]
                .map(card => {

                    if (
                        card &&
                        card.hp <= 0
                    ) {
                        return null;
                    }

                    return card;

                });

            GameState.enemy.field[row] =
                GameState.enemy.field[row]
                .map(card => {

                    if (
                        card &&
                        card.hp <= 0
                    ) {
                        return null;
                    }

                    return card;

                });

        }
    );

}
