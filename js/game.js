const state = {

  selectedCharacter: null,

  player: null,

  time: 180,

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

  enemyBook:
    document.getElementById(
      "enemy-book-screen"
    ),

  treasureBook:
    document.getElementById(
      "treasure-book-screen"
    )

};

function switchScreen(screen){

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
    "enemy-book-button"
  )
  .addEventListener(
    "click",
    openEnemyBook
  );

document
  .getElementById(
    "treasure-book-button"
  )
  .addEventListener(
    "click",
    openTreasureBook
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

function startGame(){

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

function startTimer(){

  state.timer =
    setInterval(() => {

      if(state.gameEnded){
        return;
      }

      state.time--;

      updateUI();

      if(
        state.time <= 0
      ){

        gameOver(
          "時間切れ..."
        );

      }

    },1000);

}

/* ========================= */
/* UI */
/* ========================= */

function updateUI(){

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

function updateHpBar(){

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
/* イベント */
/* ========================= */

function weightedEvent(){

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

function generateChoices(){

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

function setupChoice(id,type){

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
/* お宝イベント */
/* ========================= */

async function treasureEvent(){

  clearLog();

  if(
    state.selectedCharacter !== "mongrin"
    &&
    Math.random() < 0.1
  ){

    await addLog("罠が発動した！");
    await wait(600);

    if(Math.random() < 0.5){

      const damage = 15;

      state.player.hp -= damage;

      if(state.player.hp < 0){
        state.player.hp = 0;
      }

      updateUI();

      await addLog(`HPが${damage}減少！`);

      if(state.player.hp <= 0){
        await addLog("力尽きた...");
        gameOver("GAME OVER");
      }

      return;

    } else {

      await addLog("強敵が出現！");
      await wait(600);

      await battleEvent();

      return;

    }

  }

  const treasure =
    TREASURES[
      Math.floor(Math.random() * TREASURES.length)
    ];

  state.treasureScore += treasure.value;

  await addLog(`${treasure.name}を発見！`);
  await wait(600);
  await addLog(`+${treasure.value} SCORE`);

}

/* ========================= */
/* 時空の渦 */
/* ========================= */

async function vortexEvent(){

  clearLog();

  let change =
    Math.floor(Math.random() * 121) - 60;

  if(
    state.selectedCharacter === "fukkurou"
    && change < 0
  ){
    change *= -1;
  }

  state.time += change;

  if(state.time < 1){
    state.time = 1;
  }

  updateUI();

  await addLog("時空が歪んだ！");
  await wait(600);
  await addLog(`時間変動 ${change > 0 ? "+" : ""}${change}秒`);

}

/* ========================= */
/* 休息 */
/* ========================= */

async function restEvent(){

  clearLog();

  state.time -= 30;

  const maxHp =
    CHARACTERS[state.selectedCharacter].hp;

  state.player.hp = maxHp;

  updateUI();

  await addLog("休息した");
  await wait(600);
  await addLog("HP全回復！");

}

/* ========================= */
/* 時の加速 */
/* ========================= */

async function accelerationEvent(){

  clearLog();

  state.time -= 30;

  state.floor += 3;

  updateUI();

  await addLog("時が加速した！");
  await wait(600);
  await addLog("3階層進んだ！");

}

/* ========================= */
/* 戦闘イベント */
/* ========================= */

async function battleEvent(){

  const base =
    ENEMIES[Math.floor(Math.random() * ENEMIES.length)];

  const enemy = {
    name: base.name,
    hp: base.hp + state.floor * 3,
    atk: base.atk + Math.floor(state.floor / 3),
    def: base.def + Math.floor(state.floor / 6)
  };

  await autoBattle(enemy, false);

}

/* ========================= */
/* ボス戦 */
/* ========================= */

async function bossBattle(){

  const base =
    BOSSES[Math.floor(Math.random() * BOSSES.length)];

  const enemy = {
    name: base.name,
    hp: base.hp + state.floor * 8,
    atk: base.atk + Math.floor(state.floor / 2),
    def: base.def + Math.floor(state.floor / 5)
  };

  await autoBattle(enemy, true);

}

/* ========================= */
/* 自動戦闘 */
/* ========================= */

async function autoBattle(enemy, isBoss){

  clearLog();

  await addLog(isBoss ? `ボス ${enemy.name} 出現！` : `${enemy.name} 出現！`);

  while(enemy.hp > 0 && state.player.hp > 0){

    let dmg = Math.max(1, state.player.atk - enemy.def);

    if(Math.random() < state.player.ctr / 100){
      dmg *= 2;
      await addLog("クリティカル！");
    }

    enemy.hp -= dmg;
    await addLog(`${enemy.name}に${dmg}ダメージ`);
    updateUI();
    await wait(500);

    if(enemy.hp <= 0){
      await addLog(`${enemy.name}撃破！`);

      if(isBoss) state.bossKills++;
      else state.kills++;

      return;
    }

    let edmg = Math.max(1, enemy.atk - state.player.def);

    state.player.hp -= edmg;

    await addLog(`${edmg}ダメージを受けた`);
    updateUI();
    await wait(500);

    if(state.player.hp <= 0){
      state.player.hp = 0;
      updateUI();
      await addLog("力尽きた...");
      gameOver("GAME OVER");
      return;
    }

  }

}

/* ========================= */
/* ログ */
/* ========================= */

function clearLog(){
  document.getElementById("event-text").innerHTML = "";
}

async function addLog(text){
  const log = document.getElementById("event-text");
  log.innerHTML += `<p>${text}</p>`;
  log.scrollTop = log.scrollHeight;
}

function wait(ms){
  return new Promise(res => setTimeout(res, ms));
}

/* ========================= */
/* GAME OVER */
/* ========================= */

function gameOver(msg){

  state.gameEnded = true;

  clearInterval(state.timer);

  disableChoices();

  document.getElementById("event-text").innerHTML += `<h3>${msg}</h3>`;

  document.getElementById("result-button").style.display = "block";

}

/* ========================= */
/* リザルト */
/* ========================= */

document.getElementById("result-button").addEventListener("click", showResult);

function showResult(){

  const score =
    state.floor * 1000 +
    state.kills * 500 +
    state.bossKills * 2000 +
    state.treasureScore;

  document.getElementById("result-info").innerHTML = `
    <p>階層: ${state.floor}</p>
    <p>撃破: ${state.kills}</p>
    <p>ボス: ${state.bossKills}</p>
    <p>お宝: ${state.treasureScore}</p>
    <hr>
    <h3>SCORE: ${score}</h3>
  `;

  switchScreen(screens.result);

}

/* ========================= */
/* 図鑑 */
/* ========================= */

function openEnemyBook(){

  switchScreen(screens.enemyBook);

  const area =
    document.getElementById("enemy-book-content");

  let html = "<h3>通常敵</h3>";

  ENEMIES.forEach(e => {
    html += `<div class="enemy-box"><b>${e.name}</b><p>HP:${e.hp}</p><p>ATK:${e.atk}</p><p>DEF:${e.def}</p></div>`;
  });

  html += "<h3>ボス</h3>";

  BOSSES.forEach(e => {
    html += `<div class="enemy-box"><b>${e.name}</b><p>HP:${e.hp}</p><p>ATK:${e.atk}</p><p>DEF:${e.def}</p></div>`;
  });

  area.innerHTML = html;

}

function openTreasureBook(){

  switchScreen(screens.treasureBook);

  const area =
    document.getElementById("treasure-book-content");

  let html = "";

  TREASURES.forEach(t => {
    html += `<div class="treasure-box"><b>${t.name}</b><p>VALUE:${t.value}</p></div>`;
  });

  area.innerHTML = html;

}
