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

document
  .getElementById(
    "back-menu"
  )
  .addEventListener(
    "click",
    () => {

      location.reload();

    }
  );

function startGame() {

  const base =
    CHARACTERS[
      state.selectedCharacter
    ];

  state.player =
    structuredClone(base);

  switchScreen(
    screens.game
  );

  updateUI();

  startTimer();

  generateChoices();

}

/* ========================= */
/* タイマー */
/* ========================= */

function startTimer() {

  state.timer =
    setInterval(() => {

      state.time--;

      updateUI();

      if (
        state.time <= 0
      ) {

        endGame();

      }

    }, 1000);

}

/* ========================= */
/* UI更新 */
/* ========================= */

function updateUI() {

  document
    .getElementById(
      "time-display"
    )
    .textContent =
      state.time;

  document
    .getElementById(
      "floor-display"
    )
    .textContent =
      state.floor;

  document
    .getElementById(
      "hp-display"
    )
    .textContent =
      state.player.hp;

  document
    .getElementById(
      "atk-display"
    )
    .textContent =
      state.player.atk;

  document
    .getElementById(
      "def-display"
    )
    .textContent =
      state.player.def;

  document
    .getElementById(
      "ctr-display"
    )
    .textContent =
      state.player.ctr;

}

/* ========================= */
/* イベント抽選 */
/* ========================= */

function weightedEvent() {

  const weights =
    state.player.weights;

  const pool = [];

  Object.entries(weights)
    .forEach(([key, value]) => {

      for (
        let i = 0;
        i < value;
        i++
      ) {

        pool.push(key);

      }

    });

  return pool[
    Math.floor(
      Math.random()
      * pool.length
    )
  ];

}

function generateChoices() {

  const e1 =
    weightedEvent();

  const e2 =
    weightedEvent();

  setupChoice(
    "choice-1",
    e1
  );

  setupChoice(
    "choice-2",
    e2
  );

}

function setupChoice(
  id,
  eventType
) {

  const button =
    document.getElementById(id);

  button.textContent =
    getEventName(eventType);

  button.onclick = () => {

    executeEvent(eventType);

  };

}

function getEventName(type) {

  switch(type) {

    case "battle":
      return "戦闘";

    case "treasure":
      return "お宝探し";

    case "vortex":
      return "時空の渦";

    case "rest":
      return "休息";

    case "acceleration":
      return "時の加速";

    default:
      return "イベント";

  }

}

function executeEvent(type) {

  if (
    state.floor % 10 === 0
  ) {

    bossBattle();

    return;

  }

  switch(type) {

    case "battle":
      battleEvent();
      break;

    case "treasure":
      treasureEvent();
      break;

    case "vortex":
      vortexEvent();
      break;

    case "rest":
      restEvent();
      break;

    case "acceleration":
      accelerationEvent();
      break;

  }

  nextFloor();

}

function nextFloor() {

  state.floor++;

  updateUI();

  generateChoices();

}

/* ========================= */
/* 通常戦闘 */
/* ========================= */

function battleEvent() {

  const enemy = {

    hp:
      20
      + state.floor * 3,

    atk:
      4
      + Math.floor(
          state.floor / 2
        ),

    def:
      1
      + Math.floor(
          state.floor / 5
        )

  };

  autoBattle(
    enemy,
    false
  );

}

/* ========================= */
/* ボス戦 */
/* ========================= */

function bossBattle() {

  const enemy = {

    name:
      BOSSES[
        Math.floor(
          Math.random()
          * BOSSES.length
        )
      ],

    hp:
      100
      + state.floor * 5,

    atk:
      12
      + Math.floor(
          state.floor / 2
        ),

    def:
      5
      + Math.floor(
          state.floor / 5
        )

  };

  autoBattle(
    enemy,
    true
  );

  nextFloor();

}

function autoBattle(
  enemy,
  boss
) {

  let log =
    boss
      ? `ボス ${enemy.name} が現れた！<br>`
      : "敵が現れた！<br>";

  while (
    enemy.hp > 0
    &&
    state.player.hp > 0
  ) {

    let playerDamage =
      Math.max(
        1,
        state.player.atk
        - enemy.def
      );

    if (
      Math.random() * 100
      <
      state.player.ctr
    ) {

      playerDamage *= 2;

      log +=
        "クリティカル！<br>";

    }

    enemy.hp -=
      playerDamage;

    log += `
      主人公が
      ${playerDamage}
      ダメージ！
      <br>
    `;

    if (
      enemy.hp <= 0
    ) {
      break;
    }

    let enemyDamage =
      Math.max(
        1,
        enemy.atk
        - state.player.def
      );

    state.player.hp -=
      enemyDamage;

    log += `
      敵が
      ${enemyDamage}
      ダメージ！
      <br>
    `;

  }

  if (
    state.player.hp <= 0
  ) {

    document
      .getElementById(
        "event-text"
      )
      .innerHTML = log;

    updateUI();

    endGame();

    return;

  }

  if (boss) {

    state.bossKills++;

  } else {

    state.kills++;

  }

  document
    .getElementById(
      "event-text"
    )
    .innerHTML = log;

  updateUI();

}

/* ========================= */
/* お宝探索 */
/* ========================= */

function treasureEvent() {

  const text =
    document.getElementById(
      "event-text"
    );

  if (
    state.selectedCharacter
    !== "mongrin"
    &&
    Math.random() < 0.1
  ) {

    if (
      Math.random() < 0.5
    ) {

      const damage = 15;

      state.player.hp -=
        damage;

      text.innerHTML = `
        罠が発動！
        ${damage}
        ダメージ！
      `;

      updateUI();

      if (
        state.player.hp <= 0
      ) {

        endGame();

      }

      return;

    } else {

      text.innerHTML =
        "罠の奥から強敵が現れた！";

      battleEvent();

      return;

    }

  }

  const treasure =
    TREASURES[
      Math.floor(
        Math.random()
        * TREASURES.length
      )
    ];

  state.treasureScore +=
    treasure.value;

  text.innerHTML = `
    ${treasure.name}
    を発見！
    <br>

    +${treasure.value}
    SCORE
  `;

}

/* ========================= */
/* 時空の渦 */
/* ========================= */

function vortexEvent() {

  let change =
    Math.floor(
      Math.random() * 121
    ) - 60;

  if (
    state.selectedCharacter
    === "fukkurou"
    &&
    change < 0
  ) {

    change *= -1;

  }

  state.time += change;

  if (
    state.time < 1
  ) {

    state.time = 1;

  }

  document
    .getElementById(
      "event-text"
    )
    .innerHTML = `
      時空が歪んだ！
      <br>

      時間
      ${
        change >= 0
          ? "+"
          : ""
      }
      ${change}
      秒
    `;

  updateUI();

}

/* ========================= */
/* 休息 */
/* ========================= */

function restEvent() {

  state.time -= 10;

  const maxHp =
    CHARACTERS[
      state.selectedCharacter
    ].hp;

  state.player.hp = maxHp;

  document
    .getElementById(
      "event-text"
    )
    .innerHTML =
      "休息してHPを全回復した";

  updateUI();

}

/* ========================= */
/* 時の加速 */
/* ========================= */

function accelerationEvent() {

  state.time -= 30;

  state.floor += 3;

  document
    .getElementById(
      "event-text"
    )
    .innerHTML = `
      時が加速した！
      <br>

      3階層進んだ
    `;

  updateUI();

}

/* ========================= */
/* ゲーム終了 */
/* ========================= */

function endGame() {

  clearInterval(
    state.timer
  );

  const score =

    state.floor * 1000

    +

    state.kills * 500

    +

    state.bossKills * 2000

    +

    state.treasureScore;

  document
    .getElementById(
      "result-info"
    )
    .innerHTML = `

      <p>
        到達階層:
        ${state.floor}
      </p>

      <p>
        敵撃破数:
        ${state.kills}
      </p>

      <p>
        ボス撃破数:
        ${state.bossKills}
      </p>

      <p>
        お宝スコア:
        ${state.treasureScore}
      </p>

      <h3>
        TOTAL SCORE:
        ${score}
      </h3>

    `;

  switchScreen(
    screens.result
  );

}
