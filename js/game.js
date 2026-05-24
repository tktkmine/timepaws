const state = {

  selectedCharacter: "woosan",

  player: null,

  time: 180,

  floor: 1,

  kills: 0,

  bossKills: 0,

  treasureScore: 0,

  gameEnded: false,

  timer: null

};

/* ========================= */
/* 画面管理 */
/* ========================= */

const screens = {

  menu: document.getElementById("menu-screen"),

  character: document.getElementById("character-screen"),

  game: document.getElementById("game-screen"),

  result: document.getElementById("result-screen"),

  help: document.getElementById("help-screen"),

  enemy: document.getElementById("enemy-book-screen"),

  treasure: document.getElementById("treasure-book-screen")

};

function switchScreen(target) {

  Object.values(screens).forEach(s => s.classList.remove("active"));

  target.classList.add("active");

}

/* ========================= */
/* 初期化 */
/* ========================= */

window.onload = () => {

  state.selectedCharacter = "woosan";

};

/* ========================= */
/* メニュー */
/* ========================= */

document.getElementById("start-button").onclick = () => {
  switchScreen(screens.character);
};

document.getElementById("help-button").onclick = () => {
  switchScreen(screens.help);
};

document.getElementById("enemy-book-button").onclick = () => {
  openEnemyBook();
};

document.getElementById("treasure-book-button").onclick = () => {
  openTreasureBook();
};

/* ========================= */
/* キャラ選択 */
/* ========================= */

document.querySelectorAll(".character-button").forEach(btn => {

  btn.onclick = () => {

    state.selectedCharacter = btn.dataset.character;

    document.getElementById("confirm-character").disabled = false;

    const c = CHARACTERS[state.selectedCharacter];

    document.getElementById("character-image").src = c.image;

    document.getElementById("character-info").innerHTML = `
      <h3>${c.name}</h3>
      <p>HP ${c.hp} / ATK ${c.atk} / DEF ${c.def} / CTR ${c.ctr}%</p>
    `;

  };

});

/* メインへ戻る */
document.getElementById("back-menu-from-character").onclick = () => {
  switchScreen(screens.menu);
};

/* 開始 */
document.getElementById("confirm-character").onclick = () => {

  state.player = structuredClone(CHARACTERS[state.selectedCharacter]);

  startGame();

  switchScreen(screens.game);

};

/* ========================= */
/* ゲーム開始 */
/* ========================= */

function startGame() {

  state.time = 180;

  state.floor = 1;

  state.kills = 0;

  state.bossKills = 0;

  state.treasureScore = 0;

  state.gameEnded = false;

  updateUI();

  startTimer();

  nextEvent();

}

/* ========================= */
/* タイマー */
/* ========================= */

function startTimer() {

  clearInterval(state.timer);

  state.timer = setInterval(() => {

    if (state.gameEnded) return;

    state.time--;

    updateUI();

    if (state.time <= 0) {
      gameOver();
    }

  }, 1000);

}

/* ========================= */
/* UI更新 */
/* ========================= */

function updateUI() {

  document.getElementById("time-display").textContent = state.time;

  document.getElementById("floor-display").textContent = state.floor;

  document.getElementById("hp-display").textContent = state.player.hp;

  document.getElementById("atk-display").textContent = state.player.atk;

  document.getElementById("def-display").textContent = state.player.def;

  document.getElementById("ctr-display").textContent = state.player.ctr;

  const ratio = state.player.hp / CHARACTERS[state.selectedCharacter].hp;

  document.getElementById("hp-fill").style.width = `${Math.max(0, ratio * 100)}%`;

}

/* ========================= */
/* イベント選択 */
/* ========================= */

function nextEvent() {

  const pool = ["battle", "treasure", "vortex", "rest", "accel"];

  const event = pool[Math.floor(Math.random() * pool.length)];

  executeEvent(event);

}

/* ========================= */
/* イベント実行 */
/* ========================= */

async function executeEvent(type) {

  if (state.gameEnded) return;

  switch (type) {

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

    case "accel":
      await accelerationEvent();
      break;

  }

  state.floor++;

  updateUI();

  nextEvent();

}

/* ========================= */
/* 戦闘 */
/* ========================= */

async function battleEvent() {

  const base = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];

  const enemy = {

    name: base.name,

    hp: base.hp + state.floor * 2,

    atk: base.atk + Math.floor(state.floor / 3),

    def: base.def

  };

  await autoBattle(enemy, false);

}

/* ========================= */
/* ボス戦（10階層） */
/* ========================= */

async function bossBattle() {

  const base = BOSSES[Math.floor(Math.random() * BOSSES.length)];

  const enemy = {

    name: base.name,

    hp: base.hp + state.floor * 5,

    atk: base.atk + Math.floor(state.floor / 2),

    def: base.def

  };

  await autoBattle(enemy, true);

}

/* ========================= */
/* 自動戦闘 */
/* ========================= */

async function autoBattle(enemy, isBoss) {

  while (enemy.hp > 0 && state.player.hp > 0) {

    const dmg = Math.max(1, state.player.atk - enemy.def);

    enemy.hp -= dmg;

    if (enemy.hp <= 0) {

      if (isBoss) state.bossKills++;
      else state.kills++;

      return;

    }

    const edmg = Math.max(1, enemy.atk - state.player.def);

    state.player.hp -= edmg;

    if (state.player.hp <= 0) {
      gameOver();
      return;
    }

  }

}

/* ========================= */
/* お宝 */
/* ========================= */

async function treasureEvent() {

  state.time -= 10;

  const t = TREASURES[Math.floor(Math.random() * TREASURES.length)];

  state.treasureScore += t.value;

}

/* ========================= */
/* 時空 */
/* ========================= */

async function vortexEvent() {

  state.time += Math.floor(Math.random() * 121) - 60;

}

/* ========================= */
/* 休息 */
/* ========================= */

async function restEvent() {

  state.time -= 15;

  state.player.hp = CHARACTERS[state.selectedCharacter].hp;

}

/* ========================= */
/* 加速 */
/* ========================= */

async function accelerationEvent() {

  state.time -= 20;

  state.floor += 3;

}

/* ========================= */
/* GAME OVER */
/* ========================= */

function gameOver() {

  state.gameEnded = true;

  clearInterval(state.timer);

  document.getElementById("result-button").style.display = "block";

}

/* ========================= */
/* リザルト */
/* ========================= */

document.getElementById("result-button").onclick = () => {

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

    <h3>総合スコア: ${score}</h3>

  `;

  switchScreen(screens.result);

};

/* ========================= */
/* 図鑑 */
/* ========================= */

function openEnemyBook() {

  switchScreen(screens.enemy);

  document.getElementById("enemy-book-content").innerHTML =

    ENEMIES.map(e =>
      `<div class="enemy-box">
        <span>${e.name}</span>
        <span>HP:${e.hp} ATK:${e.atk} DEF:${e.def}</span>
      </div>`
    ).join("");

}

function openTreasureBook() {

  switchScreen(screens.treasure);

  document.getElementById("treasure-book-content").innerHTML =

    TREASURES.map(t =>
      `<div class="treasure-box">
        <span>${t.name}</span>
        <span>${t.value}</span>
      </div>`
    ).join("");

}
