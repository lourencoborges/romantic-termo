const MAX_GUESSES = 6;
const STORAGE_PREFIX = "palavras-de-amor:";
const WORD_CYCLE_KEY = `${STORAGE_PREFIX}word-cycle:v1`;
const SAO_PAULO_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
});
const SAO_PAULO_CLOCK_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
});
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
  { word: "ALMAS", note: "Gosto de imaginar que nossas almas se reconheceram antes mesmo de a gente se conhecer." },
  { word: "UNIAO", note: "Que a gente continue sendo time, abrigo e torcida um do outro, em todos os capítulos." },
  { word: "OLHAR", note: "Às vezes um olhar seu diz tudo aquilo que eu ainda nem consegui colocar em palavras." },
  { word: "AFETO", note: "Amar você também mora nas coisas pequenas: cuidar, escutar, lembrar e ficar." },
  { word: "BRISA", note: "Você chega leve, como uma brisa boa, e muda o clima inteiro do meu dia." },
  { word: "LACOS", note: "Os nossos laços são feitos de carinho, parceria e de tantas lembranças que ainda vamos criar." },
  { word: "FELIZ", note: "Se me perguntarem o que me faz feliz, vou sorrir antes mesmo de responder: você." },
  { word: "ADORO", note: "Adoro seu jeito, suas ideias, suas manias e a pessoa bonita que você é por inteiro." },
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
  { word: "AROMA", note: "Tem lembrança sua que chega de mansinho e perfuma meu dia inteiro." },
  { word: "AMADA", note: "Que você nunca se esqueça: é muito amada, exatamente assim, em todos os seus jeitos." },
  { word: "GRATA", note: "Sou grato por cada conversa, cada abraço e por você ter cruzado o meu caminho." },
  { word: "LAZER", note: "Lazer é tempo para descansar e aproveitar a vida. Quero que muitos dos nossos momentos bons sejam assim: leves e juntos." },
  { word: "AMIGA", note: "Antes de qualquer romance, gosto de poder chamar você de minha amiga e contar com a sua companhia." },
  { word: "ANJOS", note: "Anjos lembram proteção e cuidado. Você tem um jeito especial de trazer os dois para a minha vida." },
  { word: "APEGO", note: "Apego é o carinho que cria raízes. O meu por você cresce em cada conversa e abraço." },
  { word: "APOIO", note: "Apoio é estar junto quando tudo vai bem e quando pesa. Quero que você sempre saiba que pode contar comigo." },
  { word: "BELAS", note: "Há coisas belas no mundo, mas nenhuma me encanta tanto quanto o seu jeito de ser." },
  { word: "BOCAS", note: "Entre todas as conversas e sorrisos, a sua boca guarda o beijo que eu escolheria sempre." },
  { word: "BRACO", note: "No seu braço encontro carinho e aconchego. É um lugar simples que faz meu coração descansar." },
  { word: "CHUVA", note: "Até os dias de chuva ficam bons quando posso dividir o cobertor, a conversa e o tempo com você." },
  { word: "CORPO", note: "Gosto de você por inteiro: do seu corpo, da sua história e de tudo que faz você ser única." },
  { word: "DENGO", note: "Dengo é carinho cheio de mimo. Adoro quando a gente se cuida desse jeitinho tão nosso." },
  { word: "DEUSA", note: "Deusa é como me parece quando você brilha sendo exatamente quem é: forte, linda e inteira." },
  { word: "FALTA", note: "Quando você não está, sua falta me lembra o quanto sua presença deixa meus dias melhores." },
  { word: "FAVOR", note: "Meu favor preferido é simples: ficar mais um pouquinho ao seu lado." },
  { word: "FICAR", note: "Ficar é escolher presença. Eu gosto de ficar com você, nas conversas longas e nos silêncios bons." },
  { word: "FLORA", note: "Flora lembra flores e vida crescendo. Nosso amor também floresce quando a gente cuida dele." },
  { word: "FORTE", note: "Você é forte até nos dias em que duvida disso. Quero estar perto para lembrar o quanto admiro você." },
  { word: "FOTOS", note: "Gosto das nossas fotos porque elas guardam instantes que meu coração queria poder repetir." },
  { word: "GOSTO", note: "Gosto de você nos detalhes: no jeito de falar, nas manias e em tudo que só você tem." },
  { word: "HUMOR", note: "Seu humor e suas brincadeiras conseguem mudar meu dia. Adoro rir com você." },
  { word: "JOVEM", note: "Quero que a gente mantenha jovem essa alegria de descobrir coisas novas lado a lado." },
  { word: "MEIGA", note: "Seu jeito meigo aparece nos gestos pequenos e faz meu carinho por você crescer ainda mais." },
  { word: "MIMAR", note: "Mimar você é uma das minhas vontades favoritas: cuidar, agradar e fazer você se sentir amada." },
  { word: "MINHA", note: "Minha palavra favorita não é posse: é o carinho de saber que escolhemos caminhar juntos." },
  { word: "MORAR", note: "Morar no seu coração é uma ideia bonita. Enquanto isso, adoro construir um lar em cada abraço seu." },
  { word: "NINHO", note: "Ninho é abrigo. Com você, até um abraço vira um cantinho seguro para descansar." },
  { word: "OLHOS", note: "Nos seus olhos encontro ternura, coragem e um mundo inteiro que adoro conhecer." },
  { word: "OUVIR", note: "Ouvir você é uma forma de estar perto. Quero conhecer seus pensamentos, planos e histórias." },
  { word: "PERTO", note: "Perto de você, meu coração desacelera. É uma distância que eu gostaria de encurtar sempre." },
  { word: "PODER", note: "Você tem o poder de tornar especial um dia comum, só por dividir ele comigo." },
  { word: "POEMA", note: "Se eu escrevesse um poema sobre você, ainda faltariam palavras para contar tudo que sinto." },
  { word: "RINDO", note: "Quando estou rindo com você, até os problemas parecem dar uma pausa." },
  { word: "SABOR", note: "A vida tem outro sabor quando a gente divide as pequenas alegrias e os momentos gostosos." },
  { word: "SINAL", note: "Seu sorriso é meu sinal favorito de que o momento ficou mais bonito." },
  { word: "TARDE", note: "Uma tarde qualquer ao seu lado pode virar uma das minhas lembranças preferidas." },
  { word: "TERNO", note: "Terno é um carinho delicado e sincero. É assim que quero tratar o que existe entre nós." },
  { word: "TESAO", note: "Desejo também faz parte do nosso amor, junto com o respeito, a confiança e o carinho." },
  { word: "UNIDO", note: "Unidos, a gente pode ser diferente e ainda assim formar um time bonito." },
  { word: "VALOR", note: "Você tem um valor imenso, mesmo nos dias em que não consegue enxergar isso. Eu enxergo." },
  { word: "VERSO", note: "Cada verso que eu inventasse sobre você terminaria falando do quanto sou feliz por te amar." },
  { word: "VIDAS", note: "Gosto de imaginar nossas vidas se encontrando e fazendo espaço uma para a outra." },
  { word: "VOZES", note: "No meio de tantas vozes, a sua é uma das que meu coração reconhece e procura." },
  { word: "CONTO", note: "Se nosso amor fosse um conto, eu gostaria de escrever muitos capítulos felizes com você." },
  { word: "CERTO", note: "Não sei tudo sobre o futuro, mas estar com você parece uma escolha certa para o meu coração." },
  { word: "GRATO", note: "Sou grato por quem você é, pelo que vivemos e por cada chance de estar ao seu lado." },
  { word: "UNICA", note: "Única é você: não existe outra pessoa com seu jeito de rir, cuidar, sonhar e fazer meu mundo melhor." },
  { word: "ABRIL", note: "Abril me lembra recomeços bonitos. Quero viver muitos deles ao seu lado." },
  { word: "ARDOR", note: "Ardor é sentir com intensidade. Meu carinho por você cresce assim, com verdade e vontade de estar perto." },
  { word: "AREIA", note: "A areia guarda marcas de cada passo. Quero colecionar muitos caminhos caminhados de mãos dadas com você." },
  { word: "CARTA", note: "Se eu escrevesse uma carta sobre você, ela não teria espaço para contar tudo que admiro." },
  { word: "FALAS", note: "Gosto das suas falas, das histórias e até dos assuntos simples que viram especiais quando vêm de você." },
  { word: "IDEAL", note: "Você não precisa ser ideal para ser incrível. Eu amo a pessoa real, única e linda que você é." },
  { word: "IDEIA", note: "Uma ideia sua já consegue deixar minha cabeça cheia de planos bons para nós dois." },
  { word: "IGUAL", note: "A gente não precisa ser igual para combinar. Nosso carinho encontra um jeito bonito de unir diferenças." },
  { word: "JUNTO", note: "Junto de você, até os dias comuns ficam mais leves. É assim que gosto de seguir: nós dois, lado a lado." },
  { word: "LIVRE", note: "Quero que você se sinta livre para ser quem é. Seu jeito inteiro é o que eu amo." },
  { word: "MACIO", note: "Seu abraço é macio como descanso depois de um dia longo. Nele, meu coração encontra paz." },
  { word: "NOBRE", note: "Seu coração nobre aparece no cuidado que oferece e na beleza com que trata as pessoas." },
  { word: "PAUSA", note: "Você é minha pausa boa no meio da correria: um instante para respirar, sorrir e lembrar do que importa." },
  { word: "PLENO", note: "Ao seu lado, até um momento simples pode deixar meu coração pleno de alegria." },
  { word: "PROSA", note: "Adoro nossa prosa, seja profunda ou boba. Conversar com você sempre vale o tempo." },
  { word: "RAIOS", note: "Você tem raios de sol no sorriso e um jeito de clarear até os meus dias nublados." },
  { word: "TERRA", note: "Com você, tenho raízes e coragem para sonhar alto. Obrigado por ser meu chão seguro." },
  { word: "VISTA", note: "De todas as vistas bonitas, a minha favorita é olhar para você e ver meu amor de perto." }
];
const PORTUGUESE_WORDS = window.PORTUGUESE_WORDS;
WORDS.forEach(({ word }) => PORTUGUESE_WORDS.add(word));
const LEVELS = [
  { id: "termo", label: "Termo", count: 1 },
  { id: "dueto", label: "Dueto", count: 2 },
  { id: "quarteto", label: "Quarteto", count: 4 }
];
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const levelsEl = document.querySelector("#levels");
const modeMenuToggle = document.querySelector("#mode-menu-toggle");
const modeMenuArrow = document.querySelector("#mode-menu-arrow");
const boardsEl = document.querySelector("#boards");
const dailyCountdownEl = document.querySelector("#daily-countdown");
const messageEl = document.querySelector("#message");
const keyboardEl = document.querySelector("#keyboard");
const hintEl = document.querySelector("#keyboard-hint");
const noteEl = document.querySelector("#love-note");
const noteKickerEl = document.querySelector("#love-note .note-kicker");
const noteTextEl = document.querySelector("#love-note-text");
const stageTransitionEl = document.querySelector("#stage-transition");
const nextStageLabelEl = document.querySelector("#next-stage-label");
const shareRowEl = document.querySelector("#share-row");
const installButton = document.querySelector("#install-button");
let game;
let wordCycle;
let selectedLevel = 0;
let modesMenuOpen = false;
let draft = Array(5).fill("");
let cursorPosition = 0;
let positionSelectedByUser = false;
let installPrompt = null;
let toastTimer = 0;
let transitionTimer = 0;
let transitionForLevel = null;

function todayInSaoPaulo() {
  const parts = SAO_PAULO_DATE_FORMATTER.formatToParts(new Date());
  const part = type => parts.find(item => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function saoPauloWallClockEpoch(date) {
  const parts = SAO_PAULO_CLOCK_FORMATTER.formatToParts(date);
  const value = type => Number(parts.find(item => item.type === type).value);
  return Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second"));
}

function nextSaoPauloMidnight(now = new Date()) {
  const parts = SAO_PAULO_DATE_FORMATTER.formatToParts(now);
  const value = type => Number(parts.find(item => item.type === type).value);
  const targetWallTime = Date.UTC(value("year"), value("month") - 1, value("day") + 1);
  const offsetAt = timestamp => saoPauloWallClockEpoch(new Date(timestamp)) - Math.floor(timestamp / 1000) * 1000;
  let target = targetWallTime - offsetAt(now.getTime());
  for (let attempt = 0; attempt < 3; attempt++) {
    const adjusted = targetWallTime - offsetAt(target);
    if (adjusted === target) break;
    target = adjusted;
  }
  return target;
}

function updateDailyCountdown() {
  const remainingSeconds = Math.max(0, Math.floor((nextSaoPauloMidnight() - Date.now()) / 1000));
  const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  dailyCountdownEl.textContent = `Novo desafio em ${hours}:${minutes}:${seconds}`;
}

function progressKey(date) { return `${STORAGE_PREFIX}progress:${date}`; }
function newWordCycleId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function createWordCycle() {
  const order = WORDS.map(({ word }) => word);
  for (let index = order.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [order[index], order[other]] = [order[other], order[index]];
  }
  return { id: newWordCycleId(), order, solved: [] };
}

function migrateWordCycle() {
  const cycle = createWordCycle();
  const validWords = new Set(WORDS.map(({ word }) => word));
  const completed = new Set();
  const pending = new Set();
  let progressKeys = [];
  try {
    progressKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(`${STORAGE_PREFIX}progress:`))
      .sort()
      .reverse();
  } catch (_) { /* Começa um ciclo novo se o navegador bloquear o armazenamento. */ }

  for (const key of progressKeys) {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      for (const answer of (saved?.levels || []).flatMap(level => level.answers || [])) {
        if (!validWords.has(answer.target)) continue;
        if (answer.solved) completed.add(answer.target);
        else if (!completed.has(answer.target)) pending.add(answer.target);
      }
    } catch (_) { /* Ignora partidas antigas inválidas. */ }
  }

  cycle.solved = [...completed];
  cycle.order = [
    ...[...pending].filter(word => !completed.has(word)),
    ...cycle.order.filter(word => !completed.has(word) && !pending.has(word)),
    ...cycle.order.filter(word => completed.has(word))
  ];
  return cycle.solved.length === WORDS.length ? createWordCycle() : cycle;
}

function readWordCycle() {
  try {
    const raw = localStorage.getItem(WORD_CYCLE_KEY);
    if (!raw) return migrateWordCycle();
    const value = JSON.parse(raw);
    const validWords = new Set(WORDS.map(({ word }) => word));
    const validOrder = Array.isArray(value?.order)
      && value.order.length === WORDS.length
      && new Set(value.order).size === WORDS.length
      && value.order.every(word => validWords.has(word));
    if (!validOrder || !Array.isArray(value.solved)) return migrateWordCycle();
    return {
      id: typeof value.id === "string" ? value.id : newWordCycleId(),
      order: value.order,
      solved: [...new Set(value.solved.filter(word => validWords.has(word)))]
    };
  } catch (_) { return migrateWordCycle(); }
}

function saveWordCycle() {
  try { localStorage.setItem(WORD_CYCLE_KEY, JSON.stringify(wordCycle)); }
  catch (_) { /* O jogo continua nesta sessão se o navegador bloquear o armazenamento. */ }
}

function markWordSolved(word) {
  if (game.cycleId !== wordCycle.id) return;
  if (!wordCycle.solved.includes(word)) wordCycle.solved.push(word);
  if (wordCycle.solved.length === WORDS.length) wordCycle = createWordCycle();
  saveWordCycle();
}

function readSavedGame(date) {
  try {
    const raw = localStorage.getItem(progressKey(date));
    if (!raw) return null;
    const value = JSON.parse(raw);
    const valid = value?.date === date
      && Array.isArray(value.levels)
      && value.levels.length === LEVELS.length
      && value.levels.every((level, index) => Array.isArray(level.answers)
        && level.answers.length <= LEVELS[index].count
        && level.answers.every(answer => WORDS.some(item => item.word === answer.target)
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
  const solved = new Set(wordCycle.solved);
  let available = wordCycle.order.filter(word => !solved.has(word));
  if (!available.length) {
    wordCycle = createWordCycle();
    saveWordCycle();
    available = wordCycle.order;
  }
  let cursor = 0;
  const levels = LEVELS.map(level => ({
    answers: Array.from({ length: Math.min(level.count, Math.max(0, available.length - cursor)) }, () => {
      const target = available[cursor++];
      return { target, guesses: [], solved: false, failed: false };
    })
  }));
  return { date, cycleId: wordCycle.id, levels };
}

function activeLevel() {
  if (!game) return -1;
  return game.levels.findIndex(level => level.answers.some(answer => !answer.solved && !answer.failed));
}

function levelIsDone(level) { return level.answers.every(answer => answer.solved || answer.failed); }
function allDone() { return game.levels.every(levelIsDone); }
function waitingForNextStage() {
  return Number.isInteger(game.pendingStage)
    && game.pendingStage === selectedLevel
    && selectedLevel < LEVELS.length - 1
    && levelIsDone(game.levels[selectedLevel]);
}

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

function setModesMenuOpen(open) {
  modesMenuOpen = open;
  levelsEl.classList.toggle("open", open);
  levelsEl.setAttribute("aria-hidden", String(!open));
  modeMenuToggle.setAttribute("aria-expanded", String(open));
  modeMenuToggle.setAttribute("aria-label", open ? "Fechar modos de jogo" : "Abrir modos de jogo");
  modeMenuArrow.textContent = open ? "↑" : "↓";
}

function nextEmptyPosition(from) {
  for (let step = 1; step <= draft.length; step++) {
    const position = (from + step) % draft.length;
    if (!draft[position]) return position;
  }
  return from;
}

function selectPosition(position) {
  if (activeLevel() !== selectedLevel || allDone()) return;
  cursorPosition = position;
  positionSelectedByUser = true;
  showMessage("");
  render();
}

function addLetter(letter) {
  if (activeLevel() !== selectedLevel || allDone()) return;
  if (draft.every(Boolean) && !positionSelectedByUser) return;
  const value = normaliseWord(letter);
  if (value.length !== 1) return;
  draft[cursorPosition] = value;
  positionSelectedByUser = false;
  cursorPosition = nextEmptyPosition(cursorPosition);
  showMessage("");
  render();
}

function removeLetter() {
  if (activeLevel() !== selectedLevel || allDone()) return;
  let position = cursorPosition;
  if (!draft[position]) {
    for (let step = 1; step <= draft.length; step++) {
      const previous = (cursorPosition - step + draft.length) % draft.length;
      if (draft[previous]) { position = previous; break; }
    }
  }
  if (draft[position]) {
    draft[position] = "";
    cursorPosition = position;
  }
  positionSelectedByUser = false;
  showMessage("");
  render();
}

function submitGuess() {
  if (activeLevel() !== selectedLevel || allDone()) return;
  if (!draft.every(Boolean)) { showMessage("Complete as cinco posições para enviar. ♥"); return; }
  const word = draft.join("");
  if (!PORTUGUESE_WORDS.has(word)) {
    showMessage("Essa palavra não foi encontrada em português. Tente outra. ♥");
    return;
  }
  const level = game.levels[selectedLevel];
  for (const answer of level.answers) {
    if (answer.solved || answer.failed) continue;
    const feedback = feedbackForGuess(word, answer.target);
    answer.guesses.push({ word, feedback });
    if (word === answer.target && !answer.solved) {
      answer.solved = true;
      markWordSolved(answer.target);
    }
    else if (answer.guesses.length >= MAX_GUESSES) answer.failed = true;
  }
  draft = Array(5).fill("");
  cursorPosition = 0;
  positionSelectedByUser = false;
  if (levelIsDone(level)) {
    if (selectedLevel < LEVELS.length - 1 && activeLevel() > selectedLevel) game.pendingStage = selectedLevel;
    else delete game.pendingStage;
  } else {
    delete game.pendingStage;
  }
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
      const isActiveRow = isCurrent && row === answer.guesses.length;
      const letter = guess ? guess.word[column] : isActiveRow ? draft[column] : "";
      tile.className = `tile${guess ? ` ${guess.feedback[column]}` : ""}${isActiveRow ? " current" : ""}${isActiveRow && cursorPosition === column ? " cursor" : ""}${!guess && letter ? " filled" : ""}`;
      tile.textContent = letter || "";
      if (isActiveRow) {
        tile.setAttribute("role", "button");
        tile.setAttribute("tabindex", "0");
        tile.setAttribute("aria-label", `Selecionar posição ${column + 1}${letter ? `, letra ${letter}` : ", vazia"}`);
        tile.setAttribute("aria-pressed", String(cursorPosition === column));
        tile.addEventListener("click", () => selectPosition(column));
        tile.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            selectPosition(column);
          }
        });
      }
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
  const waiting = waitingForNextStage();
  LEVELS.forEach((level, index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `mode-tab${selectedLevel === index ? " active" : ""}${levelIsDone(game.levels[index]) ? " done" : ""}`;
    tab.textContent = level.label.toLowerCase();
    tab.disabled = game.levels[index].answers.length === 0
      || (waiting ? index > selectedLevel : index > (active < 0 ? LEVELS.length - 1 : active));
    tab.setAttribute("aria-current", selectedLevel === index ? "page" : "false");
    tab.addEventListener("click", () => {
      selectedLevel = index;
      setModesMenuOpen(false);
      draft = Array(5).fill("");
      cursorPosition = 0;
      positionSelectedByUser = false;
      showMessage("");
      render();
    });
    levelsEl.append(tab);
  });
}

function updateNote() {
  const phase = game.levels[selectedLevel];
  const revealedAnswer = phase.answers.find(answer => answer.failed)
    || phase.answers.find(answer => answer.solved)
    || (levelIsDone(phase) ? phase.answers[0] : null);
  if (revealedAnswer) {
    const entry = WORDS.find(item => item.word === revealedAnswer.target);
    noteKickerEl.textContent = revealedAnswer.failed ? "NÃO FOI DESSA VEZ, AMOR" : "UM BILHETINHO PRA VOCÊ";
    noteTextEl.textContent = entry?.note || "Que o seu dia tenha um pouquinho do carinho que você merece.";
    noteEl.hidden = false;
  } else {
    noteKickerEl.textContent = "UM BILHETINHO PRA VOCÊ";
    noteEl.hidden = true;
  }
  shareRowEl.hidden = !allDone();
}

function updateStageTransition() {
  if (!waitingForNextStage()) {
    window.clearTimeout(transitionTimer);
    transitionTimer = 0;
    transitionForLevel = null;
    stageTransitionEl.hidden = true;
    return;
  }

  nextStageLabelEl.textContent = `Ir para ${LEVELS[activeLevel()].label}`;
  if (transitionForLevel === selectedLevel) return;
  transitionForLevel = selectedLevel;
  stageTransitionEl.hidden = true;
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => {
    if (waitingForNextStage() && transitionForLevel === selectedLevel) stageTransitionEl.hidden = false;
  }, 2500);
}

function advanceStage() {
  if (!waitingForNextStage()) return;
  setModesMenuOpen(false);
  delete game.pendingStage;
  selectedLevel = activeLevel();
  draft = Array(5).fill("");
  cursorPosition = 0;
  positionSelectedByUser = false;
  saveGame();
  render();
}

function render() {
  renderTabs();
  renderBoards();
  renderKeyboard();
  const active = activeLevel();
  if (allDone()) showMessage("Você completou o desafio de hoje. Meu coração comemora com você. ♥");
  else if (waitingForNextStage()) showMessage("");
  else if (active !== selectedLevel) showMessage("Essa etapa já foi resolvida. Pode rever seus palpites. ♥");
  updateNote();
  updateStageTransition();
}

function newDayIfNeeded() {
  const today = todayInSaoPaulo();
  if (game?.date === today) return;
  game = readSavedGame(today) || createGame(today);
  selectedLevel = 0;
  draft = Array(5).fill("");
  cursorPosition = 0;
  positionSelectedByUser = false;
  saveGame();
  render();
}

function resetTodaysProgress() {
  if (!window.confirm("Reiniciar o progresso de hoje? As palavras do desafio continuam iguais.")) return;
  game.levels = game.levels.map(level => ({
    answers: level.answers.map(answer => ({
      target: answer.target,
      guesses: [],
      solved: false,
      failed: false
    }))
  }));
  delete game.pendingStage;
  selectedLevel = 0;
  draft = Array(5).fill("");
  cursorPosition = 0;
  positionSelectedByUser = false;
  saveGame();
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

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modesMenuOpen) { setModesMenuOpen(false); return; }
  if (event.key === "Enter") { event.preventDefault(); submitGuess(); }
  else if (event.key === "Backspace") { event.preventDefault(); removeLetter(); }
  else if (event.key.length === 1 && /[a-zA-Záàâãéêíóôõúç]/i.test(event.key)) addLetter(event.key);
});
modeMenuToggle.addEventListener("click", () => setModesMenuOpen(!modesMenuOpen));
document.addEventListener("click", event => {
  if (modesMenuOpen && !event.target.closest(".site-header")) setModesMenuOpen(false);
});
document.querySelector("#share-button").addEventListener("click", shareResult);
document.querySelector("#reset-game-button").addEventListener("click", resetTodaysProgress);
document.querySelector("#next-stage-button").addEventListener("click", advanceStage);
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
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    newDayIfNeeded();
    updateDailyCountdown();
  }
});

function start() {
  const today = todayInSaoPaulo();
  wordCycle = readWordCycle();
  game = readSavedGame(today) || createGame(today);
  if (!game.cycleId) game.cycleId = wordCycle.id;
  if (game.cycleId === wordCycle.id) {
    game.levels.flatMap(level => level.answers).filter(answer => answer.solved)
      .forEach(answer => { if (!wordCycle.solved.includes(answer.target)) wordCycle.solved.push(answer.target); });
  }
  saveWordCycle();
  saveGame();
  const pending = game.pendingStage;
  const validPending = Number.isInteger(pending)
    && pending >= 0
    && pending < LEVELS.length - 1
    && levelIsDone(game.levels[pending]);
  selectedLevel = validPending ? pending : Math.max(0, activeLevel());
  render();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  updateDailyCountdown();
  window.setInterval(() => {
    newDayIfNeeded();
    updateDailyCountdown();
  }, 1000);
}
start();
