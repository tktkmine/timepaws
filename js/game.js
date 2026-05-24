// ============================================================
// game.js - ゲームロジック全般（修正版）
// ============================================================

// ============================================================
// ゲーム状態管理
// ============================================================
const GameState = {
  screen: "menu",
  character: null,
  selectedCharId: null,
  player: {
    currentHp: 0,
    maxHp: 0,
    atk: 0,
    def: 0,
    ctr: 0,
  },
  floor: 1,
  timeLeft: 180,
  timeSpeedMultiplier: 1.0,
  timerInterval: null,
  enemy: null,
  inBattle: false,
  battleLog: [],
  enemiesDefeated: 0,
  bossesDefeated: 0,
  treasures: [],
  reachedFloor: 1,
  currentEvents: [],
  spacetimeActive: null,
  highScore: parseInt(localStorage.getItem("dungeonHighScore") || "0"),
};

// ============================================================
// 初期化
// ============================================================
function init() {
  showScreen("menu");
  updateHighScoreDisplay();
  buildHelpContent();
}

function showScreen(name) {
  GameState.screen = name;
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(`screen-${name}`);
  if (target) target.classList.add("active");
}

function updateHighScoreDisplay() {
  const el = document.getElementById("high-score-value");
  if (el) el.textContent = GameState.highScore.toLocaleString();
}

// ============================================================
// キャラクター選択
// ============================================================
function selectCharacter(id) {
  document.querySelectorAll(".char-card").forEach((c) => c.classList.remove("selected"));
  const card = document.querySelector(`.char-card[data-id="${id}"]`);
  if (card) card.classList.add("selected");
  GameState.selectedCharId = id;

  const chara = CHARACTERS[id];
  const detail = document.getElementById("char-detail");
  if (detail) {
    detail.innerHTML = `
      <div class="char-detail-inner">
        <h3>${chara.name} <span class="char-sub">${chara.sub}</span></h3>
        <p class="char-desc">${chara.description}</p>
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-label">HP</span>
            <span class="stat-val">${chara.hp}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">ATK</span>
            <span class="stat-val">${chara.atk}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">DEF</span>
            <span class="stat-val">${chara.def}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">CTR</span>
            <span class="stat-val">${chara.ctr}%</span>
          </div>
        </div>
      </div>
    `;
    detail.classList.add("visible");
  }
}

function startGame() {
  const id = GameState.selectedCharId;
  if (!id) {
    showToast("キャラクターを選択してください！");
    return;
  }
  const chara = CHARACTERS[id];
  GameState.character        = chara;
  GameState.player           = {
    currentHp: chara.hp,
    maxHp:     chara.hp,
    atk:       chara.atk,
    def:       chara.def,
    ctr:       chara.ctr,
  };
  GameState.floor              = 1;
  GameState.timeLeft           = 180;
  GameState.timeSpeedMultiplier = 1.0;
  GameState.enemiesDefeated    = 0;
  GameState.bossesDefeated     = 0;
  GameState.treasures          = [];
  GameState.reachedFloor       = 1;
  GameState.spacetimeActive    = null;
  GameState.battleLog          = [];

  showScreen("dungeon");
  updateDungeonUI();
  startTimer();
  generateEvents();
}

// ============================================================
// タイマー
// ============================================================
function startTimer() {
  clearInterval(GameState.timerInterval);
  GameState.timerInterval = setInterval(() => {
    GameState.timeLeft -= 0.1 * GameState.timeSpeedMultiplier;
    if (GameState.timeLeft <= 0) {
      GameState.timeLeft = 0;
      updateTimerUI();
      clearInterval(GameState.timerInterval);
      gameOver("時間切れ");
    } else {
      updateTimerUI();
    }
  }, 100);
}

function stopTimer() {
  clearInterval(GameState.timerInterval);
}

function updateTimerUI() {
  const el = document.getElementById("timer-value");
  if (!el) return;
  const t = Math.max(0, GameState.timeLeft);
  el.textContent = Math.ceil(t);
  const wrap = document.getElementById("timer-wrap");
  if (wrap) wrap.classList.toggle("danger", t <= 30);
}

// ============================================================
// ダンジョンUI更新
// ============================================================
function updateDungeonUI() {
  setText("floor-value", GameState.floor);
  setText("player-name", GameState.character ? GameState.character.name : "―");

  const p = GameState.player;
  setText("hp-value", `${p.currentHp} / ${p.maxHp}`);
  const hpBar = document.getElementById("hp-bar");
  if (hpBar) {
    const pct = (p.currentHp / p.maxHp) * 100;
    hpBar.style.width = `${pct}%`;
    hpBar.className = "hp-bar-fill";
    if (pct <= 25)      hpBar.classList.add("critical");
    else if (pct <= 50) hpBar.classList.add("low");
  }

  const stEl = document.getElementById("spacetime-status");
  if (stEl) {
    if (GameState.spacetimeActive) {
      stEl.textContent = GameState.spacetimeActive.name;
      stEl.className   = `spacetime-badge active-${GameState.spacetimeActive.id}`;
    } else {
      stEl.textContent = "通常時空";
      stEl.className   = "spacetime-badge";
    }
  }
}

// ============================================================
// イベント生成・選択
// ============================================================
function generateEvents() {
  const events    = pickTwoEvents(GameState.character);
  GameState.currentEvents = events;

  const container = document.getElementById("event-choices");
  if (!container) return;
  container.innerHTML = "";

  events.forEach((ev) => {
    const btn = document.createElement("button");
    btn.className = "event-btn";
    btn.innerHTML = `
      <span class="event-name">${ev.name}</span>
      <span class="event-desc">${ev.description}</span>
    `;
    btn.onclick = () => chooseEvent(ev.id);
    container.appendChild(btn);
  });

  setDungeonMessage(`${GameState.floor}F に到達！どちらのイベントに挑む？`);
}

function chooseEvent(eventId) {
  document.querySelectorAll(".event-btn").forEach((b) => (b.disabled = true));
  switch (eventId) {
    case "battle":       startBattle(false); break;
    case "boss":         startBattle(true);  break;
    case "treasure":     doTreasure();       break;
    case "vortex":       doVortex();         break;
    case "rest":         doRest();           break;
    case "acceleration": doAcceleration();   break;
  }
}

// ============================================================
// 戦闘処理
// ============================================================
function startBattle(isBoss) {
  stopTimer();
  const enemy        = isBoss ? getRandomBoss() : getScaledEnemy(GameState.floor);
  GameState.enemy    = enemy;
  GameState.inBattle = true;
  GameState.battleLog = [];

  showScreen("battle");
  updateBattleUI(isBoss);

  const logEl = document.getElementById("battle-log");
  if (logEl) logEl.innerHTML = "";

  const startBtn = document.getElementById("battle-start-btn");
  if (startBtn) {
    startBtn.style.display = "block";
    startBtn.disabled      = false;
    startBtn.onclick       = () => runAutoBattle(isBoss);
  }
}

function updateBattleUI(isBoss) {
  const enemy  = GameState.enemy;
  const player = GameState.player;

  setText("enemy-name",     enemy.name);
  setText("enemy-hp-value", `${enemy.currentHp} / ${enemy.hp}`);
  updateBar("enemy-hp-bar", enemy.currentHp, enemy.hp);

  setText("battle-title",      isBoss ? "💀 BOSS BATTLE" : "⚔️ BATTLE");
  setText("battle-player-name", GameState.character.name);
  setText("battle-player-hp",  `${player.currentHp} / ${player.maxHp}`);
  updateBar("battle-player-hp-bar", player.currentHp, player.maxHp);
}

async function runAutoBattle(isBoss) {
  const startBtn = document.getElementById("battle-start-btn");
  if (startBtn) startBtn.style.display = "none";

  const player = GameState.player;
  const enemy  = GameState.enemy;

  while (player.currentHp > 0 && enemy.currentHp > 0) {
    // プレイヤー攻撃
    const playerCrit = chance(player.ctr);
    let playerDmg    = Math.max(1, player.atk - enemy.def);
    if (playerCrit) playerDmg *= 2;
    enemy.currentHp  = Math.max(0, enemy.currentHp - playerDmg);

    addBattleLog(
      `${GameState.character.name} の攻撃！${playerCrit ? "【クリティカル！】" : ""}` +
      ` ${enemy.name} に ${playerDmg} ダメージ！`
    );
    updateBattleUI(isBoss);
    await sleep(600);
    if (enemy.currentHp <= 0) break;

    // 敵攻撃
    const enemyCrit = chance(enemy.ctr);
    let enemyDmg    = Math.max(1, enemy.atk - player.def);
    if (enemyCrit) enemyDmg *= 2;
    player.currentHp = Math.max(0, player.currentHp - enemyDmg);

    addBattleLog(
      `${enemy.name} の攻撃！${enemyCrit ? "【クリティカル！】" : ""}` +
      ` ${GameState.character.name} に ${enemyDmg} ダメージ！`
    );
    updateBattleUI(isBoss);
    await sleep(600);
  }

  if (player.currentHp <= 0) {
    addBattleLog(`${GameState.character.name} は倒れた…`);
    await sleep(800);
    gameOver("戦闘敗北");
  } else {
    addBattleLog(`${enemy.name} を倒した！`);
    if (isBoss) GameState.bossesDefeated++;
    else        GameState.enemiesDefeated++;
    await sleep(800);
    showScreen("dungeon");
    advanceFloor();
  }
}

// ============================================================
// イベント処理
// ============================================================
function doTreasure() {
  const noTrap      = GameState.character.noTreasureTrap;
  const foundTreasure = getRandomTreasure();
  GameState.treasures.push(foundTreasure);
  let message = `💎 ${foundTreasure.name}（${foundTreasure.value}pt）を発見！\n`;

  if (!noTrap && chance(10)) {
    message += `⚠️ 罠が発動！\n`;
    if (chance(50)) {
      const dmg = Math.floor(GameState.player.maxHp * 0.3);
      GameState.player.currentHp = Math.max(1, GameState.player.currentHp - dmg);
      message += `💥 ${dmg} のダメージを受けた！`;
      showEventResult("お宝探し", message, () => {
        updateDungeonUI();
        advanceFloor();
      });
    } else {
      message += `👹 強敵が現れた！`;
      showEventResult("お宝探し", message, () => {
        updateDungeonUI();
        startBattle(false);
      });
    }
  } else {
    showEventResult("お宝探し", message, () => {
      updateDungeonUI();
      advanceFloor();
    });
  }
}

function doVortex() {
  let timeDelta;
  if (GameState.character.vortexAlwaysPositive) {
    timeDelta = randInt(1, 60);
  } else {
    timeDelta = randInt(-60, 60);
  }
  GameState.timeLeft = Math.max(1, GameState.timeLeft + timeDelta);
  const sign = timeDelta >= 0 ? "+" : "";
  const msg  = `🌀 時空の渦に飲まれた！\n時間が ${sign}${timeDelta} 秒変動した！\n残り時間: ${Math.ceil(GameState.timeLeft)} 秒`;
  showEventResult("時空の渦", msg, () => {
    updateDungeonUI();
    advanceFloor();
  });
}

function doRest() {
  const cost = 10;
  if (GameState.timeLeft <= cost) {
    showEventResult("休息", "⏳ 時間が足りず休息できなかった…", () => advanceFloor());
    return;
  }
  GameState.timeLeft -= cost;
  GameState.player.currentHp = GameState.player.maxHp;
  const msg = `🏕️ 安全な場所で休息した。\n時間を ${cost} 秒消費し、HPが全回復した！`;
  showEventResult("休息", msg, () => {
    updateDungeonUI();
    advanceFloor();
  });
}

function doAcceleration() {
  const cost    = 20;
  const advance = 3;
  if (GameState.timeLeft <= cost) {
    showEventResult("時の加速", "⏳ 時間が足りず加速できなかった…", () => advanceFloor());
    return;
  }
  GameState.timeLeft -= cost;
  const msg = `⚡ 時の加速が発動！\n時間を ${cost} 秒消費し、${advance} 階層先へ飛んだ！`;
  showEventResult("時の加速", msg, () => {
    updateDungeonUI();
    advanceFloorBy(advance);
  });
}

// ============================================================
// 階層進行
// ============================================================
function advanceFloor() {
  advanceFloorBy(1);
}

function advanceFloorBy(n) {
  GameState.floor += n;
  GameState.reachedFloor = Math.max(GameState.reachedFloor, GameState.floor);
  checkSpacetimeEvent();
  showScreen("dungeon");
  updateDungeonUI();
  startTimer();
  generateEvents();
}

function checkSpacetimeEvent() {
  if (chance(5)) {
    const ev = randomPick(SPACETIME_EVENTS);
    GameState.spacetimeActive      = ev;
    GameState.timeSpeedMultiplier  = ev.speedMultiplier;
    showToast(`✨ 時空イベント発生！\n${ev.name}\n${ev.description}`, 3000);
  }
}

// ============================================================
// ゲームオーバー・スコア
// ============================================================
function gameOver(reason) {
  stopTimer();
  GameState.reachedFloor = GameState.floor;
  showScreen("result");
  setText("result-reason",    reason === "時間切れ" ? "⏰ 時間切れ…" : "💀 戦闘敗北…");
  setText("result-floor",     `${GameState.reachedFloor} F`);
  setText("result-character", GameState.character ? GameState.character.name : "");

  const btn = document.getElementById("go-score-btn");
  if (btn) btn.onclick = showScore;
}

function showScore() {
  const floorScore    = GameState.reachedFloor * 1000;
  const enemyScore    = GameState.enemiesDefeated * 500;
  const bossScore     = GameState.bossesDefeated * 2000;
  const treasureScore = GameState.treasures.reduce((sum, t) => sum + t.value, 0);
  const total         = floorScore + enemyScore + bossScore + treasureScore;

  let isNewRecord = false;
  if (total > GameState.highScore) {
    GameState.highScore = total;
    localStorage.setItem("dungeonHighScore", total);
    isNewRecord = true;
  }

  showScreen("score");
  setText("score-floor",     `${GameState.reachedFloor}F × 1000 = ${floorScore.toLocaleString()} pt`);
  setText("score-enemy",     `${GameState.enemiesDefeated}体 × 500 = ${enemyScore.toLocaleString()} pt`);
  setText("score-boss",      `${GameState.bossesDefeated}体 × 2000 = ${bossScore.toLocaleString()} pt`);
  setText("score-treasure",  `${treasureScore.toLocaleString()} pt`);
  setText("score-total",     total.toLocaleString());
  setText("score-highscore", GameState.highScore.toLocaleString());

  const newRecordEl = document.getElementById("new-record");
  if (newRecordEl) newRecordEl.style.display = isNewRecord ? "block" : "none";

  const treasureList = document.getElementById("treasure-list");
  if (treasureList) {
    treasureList.innerHTML = GameState.treasures.length === 0
      ? "<li>なし</li>"
      : GameState.treasures.map((t) =>
          `<li>
            <span class="t-rank rank-${t.rank}">${t.rank}</span>
            ${t.name}
            <span class="t-val">+${t.value}pt</span>
          </li>`
        ).join("");
  }

  const btn = document.getElementById("back-menu-btn");
  if (btn) btn.onclick = backToMenu;
}

function backToMenu() {
  showScreen("menu");
  updateHighScoreDisplay();
}

// ============================================================
// イベント結果モーダル
// ============================================================
function showEventResult(title, message, callback) {
  stopTimer();
  const modal    = document.getElementById("event-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMsg   = document.getElementById("modal-message");
  const modalBtn   = document.getElementById("modal-btn");
  if (!modal) { callback(); return; }

  modalTitle.textContent = title;
  modalMsg.innerHTML     = message.replace(/\n/g, "<br>");
  modal.classList.add("visible");

  modalBtn.onclick = () => {
    modal.classList.remove("visible");
    callback();
  };
}

// ============================================================
// ヘルプ
// ============================================================
function buildHelpContent() {
  // 敵テーブル（通常敵）
  const enemyBody = document.getElementById("enemy-table-body");
  if (enemyBody) {
    enemyBody.innerHTML = ENEMIES.map((e) =>
      `<tr>
        <td>${e.name}</td>
        <td>${e.hp}</td>
        <td>${e.atk}</td>
        <td>${e.def}</td>
        <td>${e.ctr}%</td>
      </tr>`
    ).join("");
  }

  // ボステーブル
  const bossBody = document.getElementById("boss-table-body");
  if (bossBody) {
    bossBody.innerHTML = BOSSES.map((b) =>
      `<tr class="boss-row">
        <td>${b.name}</td>
        <td>${b.hp}</td>
        <td>${b.atk}</td>
        <td>${b.def}</td>
        <td>${b.ctr}%</td>
      </tr>`
    ).join("");
  }

  // お宝一覧
  const treasureHelp = document.getElementById("treasure-help-list");
  if (treasureHelp) {
    const ranks = ["低級", "中級", "高級", "伝説"];
    treasureHelp.innerHTML = ranks.map((rank) => {
      const items = TREASURES.filter((t) => t.rank === rank);
      return `
        <div class="treasure-rank-group">
          <div class="treasure-rank-label rank-label-${rank}">${rank}宝（${items[0].value}pt）</div>
          ${items.map((t) =>
            `<div class="treasure-help-item">
              <span class="t-rank rank-${t.rank}">${t.rank}</span>
              <span>${t.name}</span>
              <span class="t-val">+${t.value}pt</span>
            </div>`
          ).join("")}
        </div>
      `;
    }).join("");
  }
}

function openHelp() {
  const modal = document.getElementById("help-modal");
  if (modal) {
    modal.classList.add("visible");
    switchHelpTab("actions");
  }
}

function closeHelp() {
  const modal = document.getElementById("help-modal");
  if (modal) modal.classList.remove("visible");
}

function switchHelpTab(tab) {
  document.querySelectorAll(".help-tab").forEach((t) => t.classList.remove("active"));
  document.querySelectorAll(".help-panel").forEach((p) => p.classList.remove("active"));

  const activeTab = document.querySelector(`.help-tab[onclick="switchHelpTab('${tab}')"]`);
  const activePanel = document.getElementById(`help-${tab}`);
  if (activeTab)  activeTab.classList.add("active");
  if (activePanel) activePanel.classList.add("active");
}

// ============================================================
// バトルログ
// ============================================================
function addBattleLog(text) {
  GameState.battleLog.push(text);
  const logEl = document.getElementById("battle-log");
  if (!logEl) return;
  const p = document.createElement("p");
  p.textContent = text;
  logEl.appendChild(p);
  logEl.scrollTop = logEl.scrollHeight;
}

// ============================================================
// ユーティリティ
// ============================================================
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setMessage(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = text.replace(/\n/g, "<br>");
}

function setDungeonMessage(text) {
  setMessage("dungeon-message", text);
}

function updateBar(id, current, max) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.width = `${Math.max(0, (current / max) * 100)}%`;
}

function showToast(message, duration = 2500) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = message.replace(/\n/g, "<br>");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

window.addEventListener("DOMContentLoaded", init);
