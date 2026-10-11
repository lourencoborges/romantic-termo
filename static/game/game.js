const stateUrl = "/api/partida/";
const guessUrl = "/api/chute/";
const levelsEl = document.querySelector("#levels");
const boardsEl = document.querySelector("#boards");
const titleEl = document.querySelector("#stage-title");
const badgeEl = document.querySelector("#daily-badge");
const messageEl = document.querySelector("#message");
const keyboardEl = document.querySelector("#keyboard");
const dialog = document.querySelector("#help-dialog");
let game = null;
let selectedLevel = 0;
let draft = "";
let sending = false;
const names = ["termo", "dueto", "quarteto"];
const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function activeLevel() {
  if (!game?.levels) return null;
  return game.levels.findIndex(level => !level.answers.every(a => a.solved || a.failed));
}

function feedbackForLetter(letter) {
  let status = "";
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
  for (let row = 0; row < 6; row++) {
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

function render() {
  levelsEl.replaceChildren();
  if (!game?.levels) {
    titleEl.textContent = "♥";
    keyboardEl.replaceChildren();
    if (game?.status === "not_started") {
      badgeEl.textContent = `COMEÇA EM ${game.start_date}`;
      boardsEl.innerHTML = '<p class="empty-state">A primeira palavra está guardada para você. ♥</p>';
    } else if (game?.status === "empty") {
      badgeEl.textContent = "PREPARE AS PALAVRAS";
      boardsEl.innerHTML = '<p class="empty-state">Adicione pelo menos 7 palavras na área de edição para começar. ♥</p>';
    } else {
      badgeEl.textContent = "FIM DA LISTA";
      boardsEl.innerHTML = `<p class="empty-state">Você preparou ${game?.available_words || 0} palavras. Adicione mais para continuar. ♥</p>`;
    }
    return;
  }

  const current = activeLevel();
  game.levels.forEach((level, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `mode-tab${selectedLevel === index ? " active" : ""}${level.answers.every(a => a.solved || a.failed) ? " done" : ""}`;
    tab.textContent = names[index];
    tab.disabled = index > (current ?? 2);
    tab.addEventListener("click", () => { selectedLevel = index; draft = ""; render(); });
    levelsEl.append(tab);
  });

  const level = game.levels[selectedLevel];
  const isPlaying = current === selectedLevel;
  titleEl.textContent = names[selectedLevel].toUpperCase();
  const solved = level.answers.filter(a => a.solved || a.failed).length;
  badgeEl.textContent = game.status === "complete" ? "VOCÊ COMPLETOU O DESAFIO ♥" : `ETAPA ${selectedLevel + 1} DE 3  ·  ${solved}/${level.answers.length}`;
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
      result.textContent = answer.solved ? "♥" : `RESPOSTA: ${answer.answer}`;
      wrap.append(result);
    }
    grid.append(wrap);
  });
  boardsEl.append(grid);
  messageEl.textContent = "";
  renderKeyboard();
  keyboardEl.hidden = !isPlaying || game.status === "complete";
  if (!isPlaying && current !== null) messageEl.textContent = "Você pode rever esta etapa. ♥";
  if (game.status === "complete") messageEl.textContent = "Volte amanhã para novas palavras. ♥";
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

async function submitGuess() {
  if (sending || activeLevel() !== selectedLevel) return;
  if (draft.length !== 5) {
    messageEl.textContent = "A palavra precisa ter cinco letras.";
    return;
  }
  sending = true;
  const submitted = draft;
  try {
    const response = await fetch(guessUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
      body: JSON.stringify({ guess: submitted, level: selectedLevel })
    });
    const result = await response.json();
    if (!response.ok) {
      messageEl.textContent = result.error || "Não foi possível enviar.";
      return;
    }
    game = result.state;
    draft = "";
    selectedLevel = activeLevel() ?? 2;
    render();
    messageEl.textContent = activeLevel() === null ? "Você completou o desafio de hoje! ♥" : "";
  } catch (_) {
    messageEl.textContent = "Sem conexão. Tente novamente.";
  } finally {
    sending = false;
  }
}

function getCookie(name) {
  const parts = `; ${document.cookie}`.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : "";
}

document.addEventListener("keydown", event => {
  if (dialog && !dialog.hidden) return;
  if (event.key === "Enter") { event.preventDefault(); submitGuess(); }
  else if (event.key === "Backspace") { event.preventDefault(); removeLetter(); }
  else if (/^[a-z]$/i.test(event.key)) addLetter(event.key.toUpperCase());
});
document.querySelector("#help").addEventListener("click", () => { dialog.hidden = false; });
document.querySelector("#close-help").addEventListener("click", () => { dialog.hidden = true; });
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.hidden = true; });

async function refresh() {
  const response = await fetch(stateUrl, { headers: { Accept: "application/json" } });
  game = await response.json();
  selectedLevel = activeLevel() ?? 0;
  render();
}

refresh().catch(() => {
  badgeEl.textContent = "ERRO AO ABRIR";
  boardsEl.innerHTML = '<p class="empty-state">Atualize a página para tentar novamente.</p>';
});
