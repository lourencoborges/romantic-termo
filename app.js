const START_DATE = "2026-10-11";
const MAX_GUESSES = 6;
const STORAGE_PREFIX = "palavras-de-amor:";
const WORDS = [
  { word: "AMORA", note: "Você deixa qualquer dia mais doce só por existir. Meu amor por você floresce em cada detalhe." },
  { word: "BEIJO", note: "Ainda escolheria o seu beijo no meio de qualquer multidão. E escolheria de novo, todos os dias." },
  { word: "SONHO", note: "Você é aquela parte bonita dos meus sonhos que eu tive a sorte de encontrar acordado." },
  { word: "RISOS", note: "Seu riso é um dos meus lugares favoritos. Quero colecionar muitos outros ao seu lado." },
  { word: "CALMA", note: "No meio de qualquer correria, pensar em você faz meu coração respirar mais devagar." },
  { word: "TOQUE", note: "Tem carinho seu que fica na pele e também fica guardado no coração." },
  { word: "LINDA", note: "Linda por fora, por dentro e até nos jeitinhos que você nem percebe. Eu vejo todos." },
  { word: "VIVER", note: "Com você, até os dias comuns ganham uma história que eu quero viver outra vez." },
  { word: "MAGIA", note: "Ainda não sei explicar como você faz tudo ficar mais bonito. Talvez seja a sua magia." },
  { word: "LUGAR", note: "Meu lugar preferido não é um endereço. É onde você está." },
  { word: "MUNDO", note: "O mundo fica enorme, mas cabe inteirinho no espaço seguro do seu abraço." },
  { word: "TEMPO", note: "O tempo passa depressa quando estamos juntos. Tomara que a vida tenha muito dele pra nós." },
  { word: "DANCA", note: "Mesmo sem música, meu coração sempre encontra um jeito de dançar com você." },
  { word: "ALMAS", note: "Gosto de imaginar que nossas almas se reconheceram antes mesmo de a gente se conhecer." },
  { word: "UNIAO", note: "Que a gente continue sendo time, abrigo e torcida um do outro, em todos os capítulos." },
  { word: "OLHAR", note: "Às vezes um olhar seu diz tudo aquilo que eu ainda nem consegui colocar em palavras." },
  { word: "AFETO", note: "Amar você também mora nas coisas pequenas: cuidar, escutar, lembrar e ficar." },
  { word: "BRISA", note: "Você chega leve, como uma brisa boa, e muda o clima inteiro do meu dia." },
  { word: "FESTA", note: "Qualquer momento simples vira comemoração quando posso dividir com você." },
  { word: "LACOS", note: "Os nossos laços são feitos de carinho, parceria e de tantas lembranças que ainda vamos criar." },
  { word: "FELIZ", note: "Se me perguntarem o que me faz feliz, vou sorrir antes mesmo de responder: você." },
  { word: "ADORO", note: "Adoro seu jeito, suas ideias, suas manias e a pessoa bonita que você é por inteiro." },
  { word: "TANTO", note: "Eu te amo tanto que até as palavras de cinco letras ficam pequenas para contar." },
  { word: "CASAL", note: "Gosto de nós: das nossas diferenças, da nossa parceria e de tudo que construímos juntos." },
  { word: "PEITO", note: "É no peito que guardo sua voz, seu abraço e a paz gostosa de saber que tenho você." },
  { word: "SORTE", note: "Se amar você é sorte, eu ganhei a loteria mais bonita da vida." },
  { word: "CUIDA", note: "Obrigado por cuidar de mim do seu jeito. Quero cuidar de você com todo o meu carinho." },
  { word: "ZELAR", note: "Quero zelar por esse amor com paciência, presença e muitos gestos de carinho." },
  { word: "CANTO", note: "Em qualquer canto do mundo, meu coração reconheceria o caminho de volta pra você." },
  { word: "FALAR", note: "Eu poderia falar por horas sobre você. Ainda assim, nunca terminaria de dizer o quanto te amo." },
  { word: "NOITE", note: "Até a noite fica mais bonita quando termina com uma mensagem sua e um sonho com nós dois." },
  { word: "AGORA", note: "O agora com você já é meu presente favorito. O futuro pode vir, que eu quero viver ao seu lado." },
  { word: "CHAMA", note: "Tem uma chama mansa e bonita no meu coração, e ela sempre sabe o seu nome." },
  { word: "PARES", note: "A gente não precisa ser igual para combinar. Gosto do jeito que nossas diferenças fazem par." },
  { word: "LEAIS", note: "Que a gente siga leal ao que sente, ao que promete e ao cuidado que tem um pelo outro." },
  { word: "VOTOS", note: "Meu voto de hoje é simples: continuar escolhendo você, com amor, em todos os dias possíveis." },
  { word: "GEMAS", note: "As melhores preciosidades da minha vida não brilham numa caixa. Uma delas está lendo isto." },
  { word: "PRADO", note: "Quero caminhar com você por todos os jardins que a vida ainda tem para a gente." },
  { word: "AROMA", note: "Tem lembrança sua que chega de mansinho e perfuma meu dia inteiro." },
  { word: "AMADA", note: "Que você nunca se esqueça: é muito amada, exatamente assim, em todos os seus jeitos." },
  { word: "GRATA", note: "Sou grato por cada conversa, cada abraço e por você ter cruzado o meu caminho." }
];
const LEVELS = [
  { id: "termo", label: "Termo", count: 1 },
  { id: "dueto", label: "Dueto", count: 2 },
  { id: "quarteto", label: "Quarteto", count: 4 }
];
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const levelsEl = document.querySelector("#levels");
const boardsEl = document.querySelector("#boards");
const messageEl = document.querySelector("#message");
const keyboardEl = document.querySelector("#keyboard");
const hintEl = document.querySelector("#keyboard-hint");
const progressEl = document.querySelector("#challenge-progress");
const noteEl = document.querySelector("#love-note");
const noteTextEl = document.querySelector("#love-note-text");
const shareRowEl = document.querySelector("#share-row");
const helpDialog = document.querySelector("#help-dialog");
const installButton = document.querySelector("#install-button");
let game;
let selectedLevel = 0;
let draft = "";
let installPrompt = null;
let toastTimer = 0;

function todayInSaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const part = type => parts.find(item => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dayNumber(date) {
  const utcDate = value => {
    const [year, month, day] = value.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.floor((utcDate(date) - utcDate(START_DATE)) / 86400000);
}

function progressKey(date) { return `${STORAGE_PREFIX}progress:${date}`; }
function readSavedGame(date) {
  try {
    const raw = localStorage.getItem(progressKey(date));
    if (!raw) return null;
    const value = JSON.parse(raw);
    const valid = value?.date === date
      && Array.isArray(value.levels)
      && value.levels.length === LEVELS.length
      && value.levels.every((level, index) => Array.isArray(level.answers)
        && level.answers.length === LEVELS[index].count
        && level.answers.every(answer => /^[A-Z]{5}$/.test(answer.target)
          && Array.isArray(answer.guesses)
          && answer.guesses.length <= MAX_GUESSES
          && typeof answer.solved === "boolean"
          && typeof answer.failed === "boolean"
          && answer.guesses.every(guess => /^[A-Z]{5}$/.test(guess.word)
            && Array.isArray(guess.feedback)
            && guess.feedback.length === 5
            && guess.feedback.every(mark => ["correct", "present", "absent"].includes(mark)))));
    return valid ? value : null;
  } catch (_) { return null; }
}

function saveGame() {
  try { localStorage.setItem(progressKey(game.date), JSON.stringify(game)); }
  catch (_) { /* O jogo continua nesta sessão se o navegador bloquear o armazenamento. */ }
}

function createGame(date) {
  const offset = Math.max(0, dayNumber(date)) * 7;
  let cursor = 0;
  const levels = LEVELS.map(level => ({
    answers: Array.from({ length: level.count }, () => {
      const target = WORDS[(offset + cursor++) % WORDS.length];
      return { target: target.word, guesses: [], solved: false, failed: false };
    })
  }));
  return { date, levels };
}

function activeLevel() {
  if (!game) return -1;
  return game.levels.findIndex(level => level.answers.some(answer => !answer.solved && !answer.failed));
}

function levelIsDone(level) { return level.answers.every(answer => answer.solved || answer.failed); }
function allDone() { return game.levels.every(levelIsDone); }

function normaliseWord(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/gi, "").toUpperCase().slice(0, 5);
}

function feedbackForGuess(guess, target) {
  const result = Array(5).fill("absent");
  const remaining = target.split("");
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) { result[i] = "correct"; remaining[i] = null; }
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const match = remaining.indexOf(guess[i]);
    if (match !== -1) { result[i] = "present"; remaining[match] = null; }
  }
  return result;
}

function keyFeedback(letter) {
  let best = "";
  const priority = { absent: 1, present: 2, correct: 3 };
  const level = game.levels[selectedLevel];
  for (const answer of level.answers) {
    for (const guess of answer.guesses) {
      guess.word.split("").forEach((value, index) => {
        if (value === letter && priority[guess.feedback[index]] > (priority[best] || 0)) best = guess.feedback[index];
      });
    }
  }
  return best;
}

function showMessage(text) {
  messageEl.textContent = text;
  window.clearTimeout(toastTimer);
  if (text) toastTimer = window.setTimeout(() => { messageEl.textContent = ""; }, 2400);
}

function addLetter(letter) {
  if (activeLevel() !== selectedLevel || draft.length >= 5 || allDone()) return;
  const value = normaliseWord(letter);
  if (value.length !== 1) return;
  draft += value;
  showMessage("");
  render();
}

function removeLetter() {
  if (activeLevel() !== selectedLevel || allDone()) return;
  draft = draft.slice(0, -1);
  showMessage("");
  render();
}

function submitGuess() {
  if (activeLevel() !== selectedLevel || allDone()) return;
  if (draft.length !== 5) { showMessage("Faltam letrinhas: complete cinco para enviar. ♥"); return; }
  const level = game.levels[selectedLevel];
  for (const answer of level.answers) {
    if (answer.solved || answer.failed) continue;
    const feedback = feedbackForGuess(draft, answer.target);
    answer.guesses.push({ word: draft, feedback });
    if (draft === answer.target) answer.solved = true;
    else if (answer.guesses.length >= MAX_GUESSES) answer.failed = true;
  }
  draft = "";
  const next = activeLevel();
  selectedLevel = next < 0 ? LEVELS.length - 1 : next;
  saveGame();
  render();
}

function makeRows(answer, isCurrent) {
  const board = document.createElement("div");
  board.className = "board";
  for (let row = 0; row < MAX_GUESSES; row++) {
    const rowEl = document.createElement("div");
    rowEl.className = "board-row";
    const guess = answer.guesses[row];
    for (let column = 0; column < 5; column++) {
      const tile = document.createElement("div");
      const letter = guess ? guess.word[column] : isCurrent && row === answer.guesses.length ? draft[column] : "";
      tile.className = `tile${guess ? ` ${guess.feedback[column]}` : letter ? " filled" : ""}`;
      tile.textContent = letter || "";
      rowEl.append(tile);
    }
    board.append(rowEl);
  }
  return board;
}

function renderBoards() {
  boardsEl.replaceChildren();
  const level = game.levels[selectedLevel];
  const current = activeLevel() === selectedLevel;
  const grid = document.createElement("div");
  grid.className = `board-grid${selectedLevel === 1 ? " duet" : selectedLevel === 2 ? " quartet" : ""}`;
  level.answers.forEach((answer, index) => {
    const card = document.createElement("div");
    card.className = "answer-card";
    const label = document.createElement("p");
    label.className = "answer-label";
    label.textContent = level.answers.length > 1 ? `PALAVRA ${index + 1}` : "SEU PALPITE";
    card.append(label, makeRows(answer, current && !answer.solved && !answer.failed));
    if (answer.solved || answer.failed) {
      const result = document.createElement("p");
      result.className = "answer-result";
      result.textContent = answer.solved ? "ACERTOU · ♡" : answer.target;
      card.append(result);
    }
    grid.append(card);
  });
  boardsEl.append(grid);
}

function createKey(label, ariaLabel, style, action) {
  const key = document.createElement("button");
  key.type = "button";
  key.className = `key${style ? ` ${style}` : ""}`;
  key.textContent = label;
  key.setAttribute("aria-label", ariaLabel);
  key.addEventListener("click", action);
  return key;
}

function renderKeyboard() {
  keyboardEl.replaceChildren();
  KEYBOARD_ROWS.forEach((row, index) => {
    const rowEl = document.createElement("div");
    rowEl.className = "key-row";
    if (index === 2) rowEl.append(createKey("⌫", "Apagar letra", "wide", removeLetter));
    for (const letter of row) rowEl.append(createKey(letter, letter, keyFeedback(letter), () => addLetter(letter)));
    if (index === 2) rowEl.append(createKey("Enviar", "Enviar palavra", "wide", submitGuess));
    keyboardEl.append(rowEl);
  });
  const isPlaying = activeLevel() === selectedLevel && !allDone();
  keyboardEl.hidden = !isPlaying;
  hintEl.hidden = !isPlaying;
}

function renderTabs() {
  levelsEl.replaceChildren();
  const active = activeLevel();
  LEVELS.forEach((level, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `mode-tab${selectedLevel === index ? " active" : ""}${levelIsDone(game.levels[index]) ? " done" : ""}`;
    tab.textContent = level.label;
    tab.disabled = index > (active < 0 ? LEVELS.length - 1 : active);
    tab.setAttribute("aria-current", selectedLevel === index ? "page" : "false");
    tab.addEventListener("click", () => { selectedLevel = index; draft = ""; showMessage(""); render(); });
    levelsEl.append(tab);
  });
}

function updateNote() {
  const dailyTarget = game.levels[0].answers[0];
  if (dailyTarget.solved || dailyTarget.failed) {
    const entry = WORDS.find(item => item.word === dailyTarget.target);
    noteTextEl.textContent = entry?.note || "Que o seu dia tenha um pouquinho do carinho que você merece.";
    noteEl.hidden = false;
  } else noteEl.hidden = true;
  shareRowEl.hidden = !allDone();
}

function render() {
  renderTabs();
  renderBoards();
  renderKeyboard();
  const active = activeLevel();
  const finishedCount = game.levels.filter(levelIsDone).length;
  progressEl.textContent = allDone() ? "DESAFIO CONCLUÍDO · ♡" : `ETAPA ${active + 1} DE 3 · ${finishedCount}/3 CONCLUÍDAS`;
  if (allDone()) showMessage("Você completou o desafio de hoje. Meu coração comemora com você. ♥");
  else if (active !== selectedLevel) showMessage("Essa etapa já foi resolvida. Pode rever seus palpites. ♥");
  updateNote();
}

function newDayIfNeeded() {
  const today = todayInSaoPaulo();
  if (game?.date === today) return;
  game = readSavedGame(today) || createGame(today);
  selectedLevel = 0;
  draft = "";
  saveGame();
  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo", weekday: "long", day: "numeric", month: "long"
  }).format(new Date()).toLocaleUpperCase("pt-BR");
  render();
}

function shareResult() {
  const blocks = game.levels.map((level, levelIndex) => {
    const name = LEVELS[levelIndex].label;
    return `${name}:\n` + level.answers.map(answer => answer.guesses.map(guess => guess.feedback.map(mark => ({ correct: "🟩", present: "🟨", absent: "⬛" })[mark]).join("")).join("\n")).join("\n\n");
  }).join("\n\n");
  const text = `Palavras de Amor · ${game.date}\n${blocks}\n\nFeito com carinho, só pra você. ♥`;
  if (navigator.share) navigator.share({ title: "Palavras de Amor", text }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => showMessage("Resultado copiado. Agora manda um carinho junto. ♥")).catch(() => showMessage("Não consegui copiar por aqui."));
}

function openHelp() {
  helpDialog.hidden = false;
  document.querySelector("#close-help").focus();
}
function closeHelp() {
  helpDialog.hidden = true;
  document.querySelector("#help-button").focus();
}

document.addEventListener("keydown", event => {
  if (!helpDialog.hidden) {
    if (event.key === "Escape") closeHelp();
    return;
  }
  if (event.key === "Enter") { event.preventDefault(); submitGuess(); }
  else if (event.key === "Backspace") { event.preventDefault(); removeLetter(); }
  else if (event.key.length === 1 && /[a-zA-Záàâãéêíóôõúç]/i.test(event.key)) addLetter(event.key);
});
document.querySelector("#help-button").addEventListener("click", openHelp);
document.querySelector("#close-help").addEventListener("click", closeHelp);
document.querySelector("#got-it").addEventListener("click", closeHelp);
helpDialog.addEventListener("click", event => { if (event.target === helpDialog) closeHelp(); });
document.querySelector("#share-button").addEventListener("click", shareResult);
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
document.addEventListener("visibilitychange", () => { if (!document.hidden) newDayIfNeeded(); });

function start() {
  const today = todayInSaoPaulo();
  game = readSavedGame(today) || createGame(today);
  selectedLevel = Math.max(0, activeLevel());
  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo", weekday: "long", day: "numeric", month: "long"
  }).format(new Date()).toLocaleUpperCase("pt-BR");
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  window.setInterval(newDayIfNeeded, 30000);
}
start();
