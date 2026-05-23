const state = {

  selectedCharacter: null,

  time: 300,

  floor: 1,

  kills: 0,

  bossKills: 0,

  treasureScore: 0,

  timer: null,

  player: null

};

const screens = {

  menu:
    document.getElementById(
      "menu-screen"
    ),

  character:
    document.getElementById(
      "character-screen"
    ),

  game:
    document.getElementById(
      "game-screen"
    ),

  result:
    document.getElementById(
      "result-screen"
    )

};

function switchScreen(screen) {

  Object.values(screens)
    .forEach(s => {

      s.classList.remove(
        "active"
      );

    });

  screen.classList.add(
    "active"
  );

}

document
  .getElementById(
    "start-button"
  )
  .addEventListener(
    "click",
    () => {

      switchScreen(
        screens.character
      );

    }
  );

document
  .querySelectorAll(
    ".character-button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const id =
          button.dataset.character;

        state.selectedCharacter =
          id;

        const c =
          CHARACTERS[id];

        document
          .getElementById(
            "character-info"
          )
          .innerHTML = `
            <h3>${c.name}</h3>

            <p>
              HP:${c.hp}
              ATK:${c.atk}
              DEF:${c.def}
              CTR:${c.ctr}%
            </p>
          `;

        document
          .getElementById(
            "confirm-character"
          )
          .disabled = false;

      }
    );

  });

document
  .getElementById(
    "confirm-character"
  )
  .addEventListener(
    "click",
    startGame
  );
