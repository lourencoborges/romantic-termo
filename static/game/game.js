const SYNC_URL = "/api/sync/";
const BANK_KEY = "palavras-amor:bank";
const CONFIG_KEY = "palavras-amor:config";
const PROGRESS_PREFIX = "palavras-amor:progress:";
const WORDS_PER_DAY = 7;
const LEVEL_COUNTS = [1, 2, 4];
const MAX_GUESSES = 6;
const levelsEl = document.querySelector("#levels");
const boardsEl = document.querySelector("#boards");
const titleEl = document.querySelector("#stage-title");
const badgeEl = document.querySelector("#daily-badge");
const messageEl = document.querySelector("#message");
const keyboardEl = document.querySelector("#keyboard");
const syncStatusEl = document.querySelector("#sync-status");
const dialog = document.querySelector("#help-dialog");
const installButton = document.querySelector("#install-button");
let wordBank = readLocal(BANK_KEY, []);
let config = readLocal(CONFIG_KEY, null);
let game = null;
let screen = "loading";
let selectedLevel = 0;
let draft = "";
let sending = false;
let installPrompt = null;
let observedDate = saoPauloDate();
const names = ["termo", "dueto", "quarteto"];
const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (_) { return fallback; }
}

function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (_) { syncStatusEl.textContent = "SEM ESPAÇO"; return false; }
}

function saoPauloDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const part = type => parts.find(item => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dayDifference(start, current) {
  const dateValue = value => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.floor((dateValue(current) - dateValue(start)) / 86400000);
}

function progressKey(date) { return `${PROGRESS_PREFIX}${date}`; }

function activeLevel() {
  if (!game?.levels) return -1;
  return game.levels.findIndex(level => !level.answers.every(answer => answer.solved || answer.failed));
}

function prepareToday() {
  const today = saoPauloDate();
  if (!config?.start_date) {
    screen = wordBank.length ? "needs-sync" : "needs-first-sync";
    game = null;
    return;
  }
  const dayNumber = dayDifference(config.start_date, today);
  if (dayNumber < 0) { screen = "not-started"; game = null; return; }
  if (wordBank.length < WORDS_PER_DAY) { screen = "empty"; game = null; return; }
  const targets = wordBank.slice(dayNumber * WORDS_PER_DAY, dayNumber * WORDS_PER_DAY + WORDS_PER_DAY);
  if (targets.length < WORDS_PER_DAY) { screen = "finished"; game = null; return; }

  const saved = readLocal(progressKey(today), null);
  if (saved?.levels?.length === LEVEL_COUNTS.length && saved.date === today) {
    game = saved;
  } else {
    let cursor = 0;
    const levels = LEVEL_COUNTS.map(count => ({
      answers: targets.slice(cursor, cursor += count).map(target => ({ target: target.word, guesses: [], solved: false, failed: false }))
    }));
    game = { date: today, levels };
    saveGame();
  }
  screen = "playing";
  const current = activeLevel();
  selectedLevel = current < 0 ? 2 : current;
}

function saveGame() {
  if (game) writeLocal(progressKey(game.date), game);
}

async function syncWords() {
  if (!navigator.onLine) {
    syncStatusEl.textContent = wordBank.length ? `OFFLINE · ${wordBank.length} SALVAS` : "OFFLINE";
    return false;
  }
  syncStatusEl.textContent = "SINCRONIZANDO…";
  try {
    const response = await fetch(SYNC_URL, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error("sync failed");
    const data = await response.json();
    if (!Array.isArray(data.words) || !data.start_date) throw new Error("bad sync data");
    wordBank = data.words.map(item => ({ id: item.id, word: item.word })).sort((a, b) => a.id - b.id);
    config = { start_date: data.start_date, timezone: data.timezone, synced_at: new Date().toISOString() };
    writeLocal(BANK_KEY, wordBank);
    writeLocal(CONFIG_KEY, config);
    syncStatusEl.textContent = `ONLINE · ${wordBank.length} PALAVRAS`;
    prepareToday();
    render();
    return true;
  } catch (_) {
    syncStatusEl.textContent = wordBank.length ? `OFFLINE · ${wordBank.length} SALVAS` : "SEM CONEXÃO";
    return false;
  }
}

function feedbackForLetter(letter) {
  let status = "";
  if (!game?.levels) return status;
  for (const level of game.levels) for (const answer of level.answers) {
    for (const guess of answer.guesses) guess.word.split("").forEach((char, index) => {
      if (char !== letter) return;
      const color = guess.feedback[index];
      if (color === "correct") status = "correct";
      else if (color === "present" && status !== "correct") status = "present";
      else if (color === "absent" && !status) status = "absent";
    });
  }
  return status;
}

function renderKeyboard() {
  keyboardEl.replaceChildren();
  keyboardRows.forEach((row, rowIndex) => {
    const rowEl = document.createElement("div");
    rowEl.className = "key-row";
    if (rowIndex === 2) addKey(rowEl, "⌫", "wide", removeLetter);
    [...row].forEach(letter => addKey(rowEl, letter, feedbackForLetter(letter), () => addLetter(letter)));
    if (rowIndex === 2) addKey(rowEl, "ENTER", "wide", submitGuess);
    keyboardEl.append(rowEl);
  });
}

function addKey(parent, label, style, action) {
  const key = document.createElement("button");
  key.type = "button";
  key.className = `key ${style || ""}`;
  key.textContent = label;
  key.setAttribute("aria-label", label === "⌫" ? "Apagar letra" : label === "ENTER" ? "Enviar palavra" : label);
  key.addEventListener("click", action);
  parent.append(key);
}

function drawBoard(answer, isCurrent) {
  const board = document.createElement("div");
  board.className = "board";
  for (let row = 0; row < MAX_GUESSES; row++) {
    const rowEl = document.createElement("div");
    rowEl.className = "board-row";
    const guess = answer.guesses[row];
    for (let column = 0; column < 5; column++) {
      const tile = document.createElement("div");
      const letter = guess ? guess.word[column] : isCurrent && row === answer.guesses.length ? draft[column] : "";
      tile.className = "tile" + (guess ? ` ${guess.feedback[column]}` : letter ? " filled" : "");
      tile.textContent = letter || "";
      rowEl.append(tile);
    }
    board.append(rowEl);
  }
  return board;
}

function renderUnavailable() {
  levelsEl.replaceChildren();
  keyboardEl.replaceChildren();
  messageEl.textContent = "";
  if (screen === "not-started") {
    titleEl.textContent = "♥";
    badgeEl.textContent = `COMEÇA EM ${config.start_date}`;
    boardsEl.innerHTML = '<p class="empty-state">A primeira palavra está guardada para você. ♥</p>';
  } else if (screen === "empty" || screen === "needs-sync" || screen === "needs-first-sync") {
    titleEl.textContent = "♥";
    badgeEl.textContent = "PREPARE AS PALAVRAS";
    const message = screen === "needs-first-sync"
      ? "Conecte-se uma vez para baixar o jogo. Depois, as palavras ficam salvas para jogar offline. ♥"
      : screen === "needs-sync"
        ? "Conecte-se para atualizar a lista e liberar os desafios deste dia. ♥"
        : "Adicione pelo menos 7 palavras na área de edição e conecte-se para sincronizar. ♥";
    boardsEl.innerHTML = `<p class="empty-state">${message}</p>`;
  } else {
    titleEl.textContent = "♥";
    badgeEl.textContent = "FIM DA LISTA";
    boardsEl.innerHTML = `<p class="empty-state">As ${wordBank.length} palavras salvas já foram usadas. Conecte-se depois que novas palavras forem adicionadas para sincronizá-las. ♥</p>`;
  }
}

function render() {
  if (!game?.levels) { renderUnavailable(); return; }
  levelsEl.replaceChildren();
  const current = activeLevel();
  game.levels.forEach((level, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `mode-tab${selectedLevel === index ? " active" : ""}${level.answers.every(a => a.solved || a.failed) ? " done" : ""}`;
    tab.textContent = names[index];
    tab.disabled = index > (current < 0 ? 2 : current);
    tab.addEventListener("click", () => { selectedLevel = index; draft = ""; render(); });
    levelsEl.append(tab);
  });

  const level = game.levels[selectedLevel];
  const isPlaying = current === selectedLevel;
  titleEl.textContent = names[selectedLevel].toUpperCase();
  const done = level.answers.filter(answer => answer.solved || answer.failed).length;
  badgeEl.textContent = current < 0 ? "VOCÊ COMPLETOU O DESAFIO ♥" : `ETAPA ${selectedLevel + 1} DE 3  ·  ${done}/${level.answers.length}`;
  boardsEl.replaceChildren();
  const grid = document.createElement("div");
  grid.className = `board-grid${selectedLevel === 1 ? " duo" : selectedLevel === 2 ? " quartet" : ""}`;
  level.answers.forEach((answer, index) => {
    const wrap = document.createElement("div");
    const tag = document.createElement("div");
    tag.className = "answer-tag";
    tag.textContent = level.answers.length > 1 ? `PALAVRA ${index + 1}` : "";
    wrap.append(tag, drawBoard(answer, isPlaying && !answer.solved && !answer.failed));
    if (answer.solved || answer.failed) {
      const result = document.createElement("div");
      result.className = "answer-tag";
      result.textContent = answer.solved ? "♥" : `RESPOSTA: ${answer.target}`;
      wrap.append(result);
    }
    grid.append(wrap);
  });
  boardsEl.append(grid);
  renderKeyboard();
  keyboardEl.hidden = !isPlaying || current < 0;
  messageEl.textContent = current < 0 ? "Desafio de hoje concluído. Volte amanhã para novas palavras. ♥" : !isPlaying ? "Você pode rever esta etapa. ♥" : "";
}

function addLetter(letter) {
  if (sending || activeLevel() !== selectedLevel || draft.length >= 5) return;
  draft += letter;
  render();
}

function removeLetter() {
  if (sending || activeLevel() !== selectedLevel) return;
  draft = draft.slice(0, -1);
  render();
}

function normaliseGuess(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/gi, "").toUpperCase().slice(0, 5);
}

function wordFeedback(guess, target) {
  const result = Array(5).fill("absent");
  const remaining = target.split("");
  for (let i = 0; i < 5; i++) if (guess[i] === target[i]) { result[i] = "correct"; remaining[i] = null; }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const index = remaining.indexOf(guess[i]);
    if (index !== -1) { result[i] = "present"; remaining[index] = null; }
  }
  return result;
}

function submitGuess() {
  if (sending || activeLevel() !== selectedLevel) return;
  if (draft.length !== 5) { messageEl.textContent = "A palavra precisa ter cinco letras."; return; }
  for (const answer of game.levels[selectedLevel].answers) {
    if (answer.solved || answer.failed) continue;
    const feedback = wordFeedback(draft, answer.target);
    answer.guesses.push({ word: draft, feedback });
    if (draft === answer.target) answer.solved = true;
    else if (answer.guesses.length >= MAX_GUESSES) answer.failed = true;
  }
  draft = "";
  saveGame();
  const next = activeLevel();
  selectedLevel = next < 0 ? 2 : next;
  render();
}

document.addEventListener("keydown", event => {
  if (dialog && !dialog.hidden) return;
  if (event.key === "Enter") { event.preventDefault(); submitGuess(); }
  else if (event.key === "Backspace") { event.preventDefault(); removeLetter(); }
  else if (/^[a-z]$/i.test(event.key)) addLetter(normaliseGuess(event.key));
});
document.querySelector("#help").addEventListener("click", () => { dialog.hidden = false; });
document.querySelector("#close-help").addEventListener("click", () => { dialog.hidden = true; });
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.hidden = true; });

window.addEventListener("online", syncWords);
window.addEventListener("offline", () => {
  syncStatusEl.textContent = wordBank.length ? `OFFLINE · ${wordBank.length} SALVAS` : "OFFLINE";
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && navigator.onLine) syncWords();
});

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});
window.addEventListener("appinstalled", () => { installButton.hidden = true; });

async function start() {
  prepareToday();
  render();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }
  if (navigator.onLine) await syncWords();
  else syncStatusEl.textContent = wordBank.length ? `OFFLINE · ${wordBank.length} SALVAS` : "OFFLINE";
  window.setInterval(() => {
    const date = saoPauloDate();
    if (date === observedDate) return;
    observedDate = date;
    draft = "";
    prepareToday();
    render();
    if (navigator.onLine) syncWords();
  }, 15000);
  window.setInterval(() => {
    if (navigator.onLine && !document.hidden) syncWords();
  }, 15 * 60 * 1000);
}

start();
