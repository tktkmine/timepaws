const state = {

  selectedCharacter: null,

  player: null,

  time: 300,

  floor: 1,

  kills: 0,

  bossKills: 0,

  treasureScore: 0,

  timer: null,

  gameEnded: false

};

/* ========================= */
/* 画面 */
/* ========================= */

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
    ),

  help:
    document.getElementById(
      "help-screen"
    ),

  encyclopedia:
    document.getElementById(
      "encyclopedia-screen"
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

/* ========================= */
/* メニュー */
/* ========================= */

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
  .getElementById(
    "help-button"
  )
  .addEventListener(
    "click",
    () => {

      switchScreen(
        screens.help
      );

    }
  );

document
  .getElementById(
    "encyclopedia-button"
  )
  .addEventListener(
    "click",
    () => {

      openEncyclopedia();

    }
  );

document
  .querySelectorAll(
    ".back-button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        switchScreen(
          screens.menu
        );

      }
    );

  });

/* ========================= */
/* キャラクター選択 */
/* ========================= */

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
            "character-image"
          )
          .src = c.image;

        document
          .getElementById(
            "character-info"
          )
          .innerHTML = `

            <h3>
              ${c.name}
            </h3>

            <p>
              HP:
              ${c.hp}
            </p>

            <p>
              ATK:
              ${c.atk}
            </p>

            <p>
              DEF:
              ${c.def}
            </p>

            <p>
              CTR:
              ${c.ctr}%
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

/* ========================= */
/* ゲーム開始 */
/* ========================= */

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

      if(state.gameEnded){
        return;
      }

      state.time--;

      updateUI();

      if(
        state.time <= 0
      ) {

        gameOver(
          "時間切れ..."
        );

      }

    },1000);

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

  updateHpBar();

}

function updateHpBar() {

  const maxHp =
    CHARACTERS[
      state.selectedCharacter
    ].hp;

  const ratio =
    Math.max(
      0,
      state.player.hp / maxHp
    );

  document
    .getElementById(
      "hp-fill"
    )
    .style.width =
      `${ratio * 100}%`;

}

/* ========================= */
/* イベント生成 */
/* ========================= */

function weightedEvent() {

  const weights =
    state.player.weights;

  const pool = [];

  Object.entries(weights)
    .forEach(([key, value]) => {

      for(
        let i = 0;
        i < value;
        i++
      ){

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

  let e1 =
    weightedEvent();

  let e2 =
    weightedEvent();

  while(e1 === e2){

    e2 =
      weightedEvent();

  }

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
  type
){

  const button =
    document.getElementById(id);

  button.textContent =
    getEventName(type);

  button.onclick =
    async () => {

      disableChoices();

      await executeEvent(type);

    };

}

function disableChoices(){

  document
    .getElementById(
      "choice-1"
    )
    .disabled = true;

  document
    .getElementById(
      "choice-2"
    )
    .disabled = true;

}

function enableChoices(){

  document
    .getElementById(
      "choice-1"
    )
    .disabled = false;

  document
    .getElementById(
      "choice-2"
    )
    .disabled = false;

}

function getEventName(type){

  switch(type){

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

  }

}

/* ========================= */
/* イベント実行 */
/* ========================= */

async function executeEvent(type){

  if(state.gameEnded){
    return;
  }

  if(
    state.floor % 10 === 0
  ){

    await bossBattle();

  } else {

    switch(type){

      case "battle":
        await battleEvent();
        break;

      case "treasure":
        await treasureEvent();
        break;

      case "vortex":
        await vortexEvent();
        break;

      case "rest":
        await restEvent();
        break;

      case "acceleration":
        await accelerationEvent();
        break;

    }

  }

  if(
    !state.gameEnded
  ){

    state.floor++;

    updateUI();

    generateChoices();

    enableChoices();

  }

}

/* ========================= */
/* 通常戦闘 */
/* ========================= */

async function battleEvent(){

  const baseEnemy =
    ENEMIES[
      Math.floor(
        Math.random()
        * ENEMIES.length
      )
    ];

  const enemy = {

    name:
      baseEnemy.name,

    hp:
      baseEnemy.hp
      + state.floor * 3,

    atk:
      baseEnemy.atk
      + Math.floor(
          state.floor / 3
        ),

    def:
      baseEnemy.def
      + Math.floor(
          state.floor / 6
        )

  };

  await autoBattle(
    enemy,
    false
  );

}

/* ========================= */
/* ボス戦 */
/* ========================= */

async function bossBattle(){

  const baseBoss =
    BOSSES[
      Math.floor(
        Math.random()
        * BOSSES.length
      )
    ];

  const enemy = {

    name:
      baseBoss.name,

    hp:
      baseBoss.hp
      + state.floor * 8,

    atk:
      baseBoss.atk
      + Math.floor(
          state.floor / 2
        ),

    def:
      baseBoss.def
      + Math.floor(
          state.floor / 5
        )

  };

  await autoBattle(
    enemy,
    true
  );

}

/* ========================= */
/* 自動戦闘 */
/* ========================= */

async function autoBattle(
  enemy,
  isBoss
){

  clearLog();

  await addLog(
    isBoss
      ? `ボス ${enemy.name} が現れた！`
      : `${enemy.name} が現れた！`
  );

  while(

    enemy.hp > 0
    &&
    state.player.hp > 0

  ){

    /* 主人公攻撃 */

    let playerDamage =
      Math.max(
        1,
        state.player.atk
        - enemy.def
      );

    if(
      Math.random() * 100
      <
      state.player.ctr
    ){

      playerDamage *= 2;

      await addLog(
        "クリティカル！"
      );

    }

    enemy.hp -=
      playerDamage;

    await addLog(
      `${state.player.name}
       の攻撃！
       ${enemy.name}
       に
       ${playerDamage}
       ダメージ！`
    );

    updateUI();

    await wait(700);

    if(enemy.hp <= 0){

      await addLog(
        `${enemy.name}
         を撃破！`
      );

      if(isBoss){
        state.bossKills++;
      } else {
        state.kills++;
      }

      return;

    }

    /* 敵攻撃 */

    let enemyDamage =
      Math.max(
        1,
        enemy.atk
        - state.player.def
      );

    state.player.hp -=
      enemyDamage;

    await addLog(
      `${enemy.name}
       の攻撃！
       ${enemyDamage}
       ダメージ！`
    );

    updateUI();

    await wait(700);

    if(
      state.player.hp <= 0
    ){

      state.player.hp = 0;

      updateUI();

      await addLog(
        `${state.player.name}
         は力尽きた...`
      );

      gameOver(
        "GAME OVER"
      );

      return;

    }

  }

}

/* ========================= */
/* ログ */
/* ========================= */

function clearLog(){

  document
    .getElementById(
      "event-text"
    )
    .innerHTML = "";

}

async function addLog(text){

  const log =
    document.getElementById(
      "event-text"
    );

  log.innerHTML += `
    <p>${text}</p>
  `;

  log.scrollTop =
    log.scrollHeight;

}

function wait(ms){

  return new Promise(resolve => {

    setTimeout(
      resolve,
      ms
    );

  });

}

/* ========================= */
/* お宝探索 */
/* ========================= */

async function treasureEvent(){

  clearLog();

  if(
    state.selectedCharacter
    !== "mongrin"
    &&
    Math.random() < 0.1
  ){

    await addLog(
      "罠が発動した！"
    );

    await wait(700);

    if(
      Math.random() < 0.5
    ){

      const damage = 15;

      state.player.hp -=
        damage;

      if(
        state.player.hp < 0
      ){
        state.player.hp = 0;
      }

      updateUI();

      await addLog(
        `${damage}
         ダメージを受けた！`
      );

      if(
        state.player.hp <= 0
      ){

        await addLog(
          `${state.player.name}
           は力尽きた...`
        );

        gameOver(
          "GAME OVER"
        );

      }

      return;

    } else {

      await addLog(
        "強敵が現れた！"
      );

      await wait(700);

      await battleEvent();

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

  await addLog(
    `${treasure.name}
     を発見！`
  );

  await wait(700);

  await addLog(
    `SCORE
     +${treasure.value}`
  );

}

/* ========================= */
/* 時空の渦 */
/* ========================= */

async function vortexEvent(){

  clearLog();

  let change =
    Math.floor(
      Math.random() * 121
    ) - 60;

  if(
    state.selectedCharacter
    === "fukkurou"
    &&
    change < 0
  ){

    change *= -1;

  }

  state.time += change;

  if(
    state.time < 1
  ){

    state.time = 1;

  }

  updateUI();

  await addLog(
    `時空が歪んだ！`
  );

  await wait(700);

  await addLog(
    `時間 ${
      change >= 0
      ? "+"
      : ""
    }${change} 秒`
  );

}

/* ========================= */
/* 休息 */
/* ========================= */

async function restEvent(){

  clearLog();

  state.time -= 10;

  const maxHp =
    CHARACTERS[
      state.selectedCharacter
    ].hp;

  state.player.hp =
    maxHp;

  updateUI();

  await addLog(
    "休息した"
  );

  await wait(700);

  await addLog(
    "HPが全回復した！"
  );

}

/* ========================= */
/* 時の加速 */
/* ========================= */

async function accelerationEvent(){

  clearLog();

  state.time -= 30;

  state.floor += 3;

  updateUI();

  await addLog(
    "時が加速した！"
  );

  await wait(700);

  await addLog(
    "3階層進んだ！"
  );

}

/* ========================= */
/* GAME OVER */
/* ========================= */

function gameOver(message){

  state.gameEnded = true;

  clearInterval(
    state.timer
  );

  disableChoices();

  document
    .getElementById(
      "event-text"
    )
    .innerHTML += `
      <h3>${message}</h3>
    `;

  document
    .getElementById(
      "result-button"
    )
    .style.display =
      "block";

}

/* ========================= */
/* リザルト */
/* ========================= */

document
  .getElementById(
    "result-button"
  )
  .addEventListener(
    "click",
    showResult
  );

function showResult(){

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

      <hr>

      <h3>
        TOTAL SCORE:
        ${score}
      </h3>

    `;

  switchScreen(
    screens.result
  );

}

/* ========================= */
/* 図鑑 */
/* ========================= */

function openEncyclopedia(){

  switchScreen(
    screens.encyclopedia
  );

  const area =
    document.getElementById(
      "encyclopedia-content"
    );

  let html =
    "<h3>通常敵</h3>";

  ENEMIES.forEach(enemy => {

    html += `

      <div class="enemy-box">

        <strong>
          ${enemy.name}
        </strong>

        <p>
          HP:
          ${enemy.hp}
        </p>

        <p>
          ATK:
          ${enemy.atk}
        </p>

        <p>
          DEF:
          ${enemy.def}
        </p>

      </div>

    `;

  });

  html +=
    "<h3>ボス</h3>";

  BOSSES.forEach(enemy => {

    html += `

      <div class="enemy-box">

        <strong>
          ${enemy.name}
        </strong>

        <p>
          HP:
          ${enemy.hp}
        </p>

        <p>
          ATK:
          ${enemy.atk}
        </p>

        <p>
          DEF:
          ${enemy.def}
        </p>

      </div>

    `;

  });

  html +=
    "<h3>お宝</h3>";

  TREASURES.forEach(treasure => {

    html += `

      <div class="treasure-box">

        <strong>
          ${treasure.name}
        </strong>

        <p>
          VALUE:
          ${treasure.value}
        </p>

      </div>

    `;

  });

  area.innerHTML =
    html;

}
