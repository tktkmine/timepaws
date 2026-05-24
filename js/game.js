// ============================================================
// game.js - ゲームロジック全般
// ============================================================

// ============================================================
// ゲーム状態管理
// ============================================================
const GameState = {
  // 画面管理
  screen: "menu", // menu | select | dungeon | battle | result | score

  // プレイヤー
  character: null,
  player: {
    currentHp: 0,
    maxHp: 0,
    atk: 0,
    def: 0,
    ctr: 0,
  },

  // ダンジョン進行
  floor: 1,
  timeLeft: 180,
  timeSpeedMultiplier: 1.0,
  timerInterval: null,

  // 戦闘
  enemy: null,
  inBattle: false,
  battleLog: [],

  // スコア関連
  enemiesDefeated: 0,
  bossesDefeated: 0,
  treasures: [],
  reachedFloor: 1,

  // イベント
  currentEvents: [],
  spacetimeActive: null,

  // ハイスコア
  highScore: parseInt(localStorage.getItem("dungeonHighScore") || "0"),
};

// ============================================================
// 初期化・画面制御
// ============================================================

function init() {
  showScreen("menu");
  updateHighScoreDisplay();
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

  // 詳細表示
  const chara = CHARACTERS[id];
  const detail = document.getElementById("char-detail");
  if (detail) {
    detail.innerHTML = `
      <div class="char-detail-inner">
        <h3>${chara.name} <span class="char-sub">${chara.sub}</span></h3>
        <p class="char-desc">${chara.description}</p>
        <div class="stat-grid">
          <div class="stat-item"><span class="stat-label">HP</span><span class="stat-val">${chara.hp}</span></div>
          <div class="stat-item"><span class="stat-label">ATK</span><span class="stat-val">${chara.atk}</span></div>
          <div class="stat-item"><span class="stat-label">DEF</span><span class="stat-val">${chara.def}</span></div>
          <div class="stat-item"><span class="stat-label">CTR</span><span class="stat-val">${chara.ctr}%</span></div>
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
  GameState.character = chara;
  GameState.player = {
    currentHp: chara.hp,
    maxHp: chara.hp,
    atk: chara.atk,
    def: chara.def,
    ctr: chara.ctr,
  };
  GameState.floor = 1;
  GameState.timeLeft = 180;
  GameState.timeSpeedMultiplier = 1.0;
  GameState.enemiesDefeated = 0;
  GameState.bossesDefeated = 0;
  GameState.treasures = [];
  GameState.reachedFloor = 1;
  GameState.spacetimeActive = null;
  GameState.battleLog = [];

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
  const secs = Math.ceil(t);
  el.textContent = secs;
  // 残り30秒以下で赤く
  el.parentElement.classList.toggle("danger", t <= 30);
}

// ============================================================
// ダンジョンUI更新
// ============================================================

function updateDungeonUI() {
  // フロア
  const floorEl = document.getElementById("floor-value");
  if (floorEl) floorEl.textContent = GameState.floor;

  // HP
  const hpEl = document.getElementById("hp-value");
  const hpBarEl = document.getElementById("hp-bar");
  if (hpEl) hpEl.textContent = `${GameState.player.currentHp} / ${GameState.player.maxHp}`;
  if (hpBarEl) {
    const pct = (GameState.player.currentHp / GameState.player.maxHp) * 100;
    hpBarEl.style.width = `${pct}%`;
    hpBarEl.className = "hp-bar-fill";
    if (pct <= 25) hpBarEl.classList.add("critical");
    else if (pct <= 50) hpBarEl.classList.add("low");
  }

  // キャラ名
  const nameEl = document.getElementById("player-name");
  if (nameEl && GameState.character) nameEl.textContent = GameState.character.name;

  // 時空状態
  const stEl = document.getElementById("spacetime-status");
  if (stEl) {
    if (GameState.spacetimeActive) {
      stEl.textContent = GameState.spacetimeActive.name;
      stEl.className = `spacetime-badge active-${GameState.spacetimeActive.id}`;
    } else {
      stEl.textContent = "通常時空";
      stEl.className = "spacetime-badge";
    }
  }
}

// ============================================================
// イベント生成・選択
// ============================================================

function generateEvents() {
  const events = pickTwoEvents(GameState.character);
  GameState.currentEvents = events;

  const container = document.getElementById("event-choices");
  if (!container) return;
  container.innerHTML = "";

  events.forEach((ev, i) => {
    const btn = document.createElement("button");
    btn.className = "event-btn";
    btn.innerHTML = `
      <span class="event-name">${ev.name}</span>
      <span class="event-desc">${ev.description}</span>
    `;
    btn.onclick = () => chooseEvent(ev.id);
    container.appendChild(btn);
  });

  // メッセージ
  setDungeonMessage(`${GameState.floor}F に到達！どちらのイベントに挑む？`);
}

function chooseEvent(eventId) {
  // ボタン無効化
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
  const enemy = isBoss ? getRandomBoss() : getScaledEnemy(GameState.floor);
  GameState.enemy = enemy;
  GameState.inBattle = true;
  GameState.battleLog = [];

  showScreen("battle");
  updateBattleUI(isBoss);
  setMessage("battle-message", `${enemy.name} があらわれた！`);

  // バトル開始ボタンを表示
  const startBtn = document.getElementById("battle-start-btn");
  if (startBtn) {
    startBtn.style.display = "block";
    startBtn.onclick = () => runAutoBattle(isBoss);
  }
}

function updateBattleUI(isBoss) {
  const enemy = GameState.enemy;
  const player = GameState.player;

  // 敵情報
  setText("enemy-name", enemy.name);
  setText("enemy-hp-value", `${enemy.currentHp} / ${enemy.hp}`);
  updateBar("enemy-hp-bar", enemy.currentHp, enemy.hp);
  document.getElementById("battle-title").textContent = isBoss ? "💀 BOSS BATTLE" : "⚔️ BATTLE";

  // プレイヤー情報
  setText("battle-player-name", GameState.character.name);
  setText("battle-player-hp", `${player.currentHp} / ${player.maxHp}`);
  updateBar("battle-player-hp-bar", player.currentHp, player.maxHp);
}

async function runAutoBattle(isBoss) {
  const startBtn = document.getElementById("battle-start-btn");
  if (startBtn) startBtn.style.display = "none";

  const player = GameState.player;
  const enemy = GameState.enemy;

  while (player.currentHp > 0 && enemy.currentHp > 0) {
    // プレイヤー攻撃
    const playerCrit = chance(player.ctr);
    let playerDmg = Math.max(1, player.atk - enemy.def);
    if (playerCrit) playerDmg *= 2;
    enemy.currentHp = Math.max(0, enemy.currentHp - playerDmg);

    addBattleLog(
      `${GameState.character.name} の攻撃！${playerCrit ? "【クリティカル！】" : ""} ${enemy.name} に ${playerDmg} ダメージ！`
    );
    updateBattleUI(isBoss);
    await sleep(600);

    if (enemy.currentHp <= 0) break;

    // 敵攻撃
    const enemyCrit = chance(enemy.ctr);
    let enemyDmg = Math.max(1, enemy.atk - player.def);
    if (enemyCrit) enemyDmg *= 2;
    player.currentHp = Math.max(0, player.currentHp - enemyDmg);

    addBattleLog(
      `${enemy.name} の攻撃！${enemyCrit ? "【クリティカル！】" : ""} ${GameState.character.name} に ${enemyDmg} ダメージ！`
    );
    updateBattleUI(isBoss);
    await sleep(600);
  }

  // 結果判定
  if (player.currentHp <= 0) {
    addBattleLog(`${GameState.character.name} は倒れた…`);
    await sleep(800);
    gameOver("戦闘敗北");
  } else {
    addBattleLog(`${enemy.name} を倒した！`);
    if (isBoss) GameState.bossesDefeated++;
    else GameState.enemiesDefeated++;
    await sleep(800);
    battleVictory(isBoss);
  }
}

function battleVictory(isBoss) {
  showScreen("dungeon");
  advanceFloor();
}

// ============================================================
// イベント処理
// ============================================================

function doTreasure() {
  const noTrap = GameState.character.noTreasureTrap;
  let message = "";
  let foundTreasure = null;

  // 宝発見（必ず試みる）
  foundTreasure = getRandomTreasure();
  GameState.treasures.push(foundTreasure);
  message += `💎 ${foundTreasure.name}（${foundTreasure.value}pt）を発見！\n`;

  // 罠判定（モングリンは罠なし）
  if (!noTrap && chance(10)) {
    message += `⚠️ 罠が発動！\n`;
    if (chance(50)) {
      // ダメージ
      const dmg = Math.floor(GameState.player.maxHp * 0.3);
      GameState.player.currentHp = Math.max(1, GameState.player.currentHp - dmg);
      message += `💥 ${dmg} のダメージを受けた！`;
      showEventResult("お宝探し", message, () => {
        updateDungeonUI();
        advanceFloor();
      });
    } else {
      // 強敵との戦闘
      message += `👹 強敵が現れた！`;
      showEventResult("お宝探し", message, () => {
        updateDungeonUI();
        startBattle(false); // 強敵は通常敵スケール（高フロア補正あり）
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
    // フックロウは必ず時間増加
    timeDelta = randInt(1, 60);
  } else {
    timeDelta = randInt(-60, 60);
  }

  GameState.timeLeft = Math.max(1, GameState.timeLeft + timeDelta);
  const sign = timeDelta >= 0 ? "+" : "";
  const msg = `🌀 時空の渦に飲まれた！\n時間が ${sign}${timeDelta} 秒変動した！\n残り時間: ${Math.ceil(GameState.timeLeft)} 秒`;

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
  const cost = 20;
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
    GameState.spacetimeActive = ev;
    GameState.timeSpeedMultiplier = ev.speedMultiplier;
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

  setText("result-reason", reason === "時間切れ" ? "⏰ 時間切れ…" : "💀 戦闘敗北…");
  setText("result-floor", `${GameState.reachedFloor} F`);
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

  // ハイスコア更新
  let isNewRecord = false;
  if (total > GameState.highScore) {
    GameState.highScore = total;
    localStorage.setItem("dungeonHighScore", total);
    isNewRecord = true;
  }

  showScreen("score");

  setText("score-floor",    `${GameState.reachedFloor}F × 1000 = ${floorScore.toLocaleString()} pt`);
  setText("score-enemy",    `${GameState.enemiesDefeated}体 × 500 = ${enemyScore.toLocaleString()} pt`);
  setText("score-boss",     `${GameState.bossesDefeated}体 × 2000 = ${bossScore.toLocaleString()} pt`);
  setText("score-treasure", `${treasureScore.toLocaleString()} pt`);
  setText("score-total",    total.toLocaleString());
  setText("score-highscore", GameState.highScore.toLocaleString());

  const newRecordEl = document.getElementById("new-record");
  if (newRecordEl) newRecordEl.style.display = isNewRecord ? "block" : "none";

  // 獲得宝一覧
  const treasureList = document.getElementById("treasure-list");
  if (treasureList) {
    if (GameState.treasures.length === 0) {
      treasureList.innerHTML = "<li>なし</li>";
    } else {
      treasureList.innerHTML = GameState.treasures
        .map((t) => `<li><span class="t-rank rank-${t.rank}">${t.rank}</span> ${t.name} <span class="t-val">+${t.value}pt</span></li>`)
        .join("");
    }
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
  const modal = document.getElementById("event-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMsg = document.getElementById("modal-message");
  const modalBtn = document.getElementById("modal-btn");

  if (!modal) { callback(); return; }

  modalTitle.textContent = title;
  modalMsg.innerHTML = message.replace(/\n/g, "<br>");
  modal.classList.add("visible");

  modalBtn.onclick = () => {
    modal.classList.remove("visible");
    callback();
  };
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
  const pct = Math.max(0, (current / max) * 100);
  el.style.width = `${pct}%`;
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

// 起動
window.addEventListener("DOMContentLoaded", init);
