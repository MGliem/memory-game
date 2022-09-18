globalVariables = {
  timer: 0,
  timerInterval: null,
  moves: 0,
  gameStarted: 0,
  randomCards: {},
  visibleCards: [],
  totalCards: 0,
  totalFound: 0,
  api: 'http://localhost:5000/scores',
};

selectors = {
  startStop: document.getElementById("startStopGame"),
  timer: document.querySelector(".timer"),
  moves: document.querySelector(".moves"),
  board: document.querySelector(".board"),
  gridSize: document.getElementById("gridSize"),
  scoreBoard: document.getElementById("scoreBoard"),
  scoreTable: document.getElementById('scores'),
};

function shuffleCards() {
  const emojis = [
    "🍏",
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    "🍞",
    "🥖",
    "🥨",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
    "🥞",
    "🧇",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🦴",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🫓",
    "🥪",
    "🥙",
    "🧆",
    "🌮",
    "🌯",
    "🫔",
    "🥗",
    "🥘",
    "🫕",
    "🥫",
    "🍝",
  ];

  const cards = [];

  for (let i = 1; i <= globalVariables.totalCards; i++) {
    cards.push("card" + i);
  }

  globalVariables.randomCards = {};

  for (let i = 0; i < globalVariables.totalCards; i++) {
    const randomCard1 = Math.floor(Math.random() * cards.length);
    const randomEmoji = Math.floor(Math.random() * emojis.length);
    let randomCard2 = Math.floor(Math.random() * cards.length);

    if (randomCard1 === randomCard2 && randomCard1 < cards.length - 1) {
      randomCard2 += 1;
    } else if (randomCard1 === randomCard2 && randomCard1 == cards.length - 1) {
      randomCard2 -= 1;
    }

    globalVariables.randomCards[cards[randomCard1]] = emojis[randomEmoji];
    globalVariables.randomCards[cards[randomCard2]] = emojis[randomEmoji];
    emojis.splice(randomEmoji, 1);
    cards.splice(randomCard1, 1);
    if (randomCard1 < randomCard2) {
      cards.splice(randomCard2 - 1, 1);
    } else {
      cards.splice(randomCard2, 1);
    }
  }
}

function showCard(card) {
  selectedCard = card.parentNode;
  flippedCardId = selectedCard.id;
  for (const child of selectedCard.children) {
    if (child.className === "show") {
      child.textContent = globalVariables.randomCards[flippedCardId];
      globalVariables.visibleCards.push(child);
    }
  }

  selectedCard.classList.add("rotate");

  if (globalVariables.visibleCards.length === 2) {
    checkClickedCards();
  }
}

function hideCards(card) {
  selectedCard = card.parentNode;
  selectedCard.classList.remove("rotate");
  for (const child of selectedCard.children) {
    if (child.className === "show") {
      child.textContent = "";
    }
  }
}

function checkClickedCards() {
  incrementMove();
  if (
    globalVariables.visibleCards[0].textContent !==
    globalVariables.visibleCards[1].textContent
  ) {
    setTimeout(() => {
      hideCards(globalVariables.visibleCards[0]);
      hideCards(globalVariables.visibleCards[1]);
      globalVariables.visibleCards = [];
    }, '1000');
  } else {
    globalVariables.totalFound++;
    globalVariables.visibleCards = [];
    checkWin();
  }
}

function checkWin() {
  if (globalVariables.totalCards == globalVariables.totalFound * 2) {
    clearInterval(globalVariables.timerInterval);
    selectors.startStop.textContent = "Start";
    selectors.gridSize.disabled = false;
    setTimeout(() => {
      showScoreBoard();
    }, '1000');
  }
}

function incrementMove() {
  globalVariables.moves += 1;
  selectors.moves.textContent = `${globalVariables.moves} moves`;
}

function updateTimer() {
  globalVariables.timer += 1;
  selectors.timer.textContent = `time ${globalVariables.timer} sec`;
}

function startGame() {
  resetGame();
  populateBoard();
  selectors.gridSize.disabled = true;
  shuffleCards();
  globalVariables.gameStarted = 1;
  selectors.startStop.textContent = "Stop";
  globalVariables.timerInterval = setInterval(updateTimer, 1000);
}

function stopGame() {
  clearBoard();
  resetGame();
  selectors.gridSize.disabled = false;
  globalVariables.gameStarted = 0;
  selectors.startStop.textContent = "Start";
}

function showScoreBoard() {
  selectors.scoreBoard.style.display = "block";
  const playerScore = document.getElementById('playerScore');
  const scoreText = `${globalVariables.moves} moves in ${globalVariables.timer} secondes`;
  playerScore.appendChild(document.createTextNode(scoreText));
  getScores();
}

function getScores() {
  fetch(globalVariables.api)
  .then((res) => res.json())
  .then((json) => createScoreTable(json));
}

function createScoreTable(json) {
  json.sort((a, b) => a.time - b.time);

  const table = document.createElement('table')
  const trHead = document.createElement('tr');
  const thNickname = document.createElement('th');
  const textNickname = document.createTextNode('Nickname');
  const thTime = document.createElement('th');
  const textTime = document.createTextNode('Time');
  const thMoves = document.createElement('th');
  const textMoves = document.createTextNode('Moves');
  const thGrid = document.createElement('th');
  const textGrid = document.createTextNode('Grid size');

  thNickname.appendChild(textNickname);
  thTime.appendChild(textTime);
  thMoves.appendChild(textMoves);
  thGrid.appendChild(textGrid);

  trHead.appendChild(thNickname);
  trHead.appendChild(thTime);
  trHead.appendChild(thMoves);
  trHead.appendChild(thGrid);

  table.appendChild(trHead);

  for (let i = 0; i < json.length; i++) {
    const tr = document.createElement('tr');
    const tdNickname = document.createElement('td');
    const textPlayer = document.createTextNode(json[i].nickname);
    const tdTime = document.createElement('td');
    const textPlayerTime = document.createTextNode(json[i].time);
    const tdNMoves = document.createElement('td');
    const textPlayerMoves = document.createTextNode(json[i].move);
    const tdGrid = document.createElement('td');
    const textPlayerGrid = document.createTextNode(json[i].grid);

    tdNickname.appendChild(textPlayer);
    tdTime.appendChild(textPlayerTime);
    tdNMoves.appendChild(textPlayerMoves);
    tdGrid.appendChild(textPlayerGrid);

    tr.appendChild(tdNickname);
    tr.appendChild(tdTime);
    tr.appendChild(tdNMoves);
    tr.appendChild(tdGrid);

    table.appendChild(tr);
  }
  selectors.scoreTable.appendChild(table);
}

function closeScoreBoard() {
  selectors.scoreBoard.style.display = "none";
  selectors.scoreTable.firstChild.remove();
  document.getElementById('playerScore').textContent = '';
  stopGame();
}

function addScore() {
  const nickname = document.getElementById('nickname');
  fetch(globalVariables.api, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: document.getElementById('nickname').value,
      time: globalVariables.timer,
      move: globalVariables.moves,
      grid: `${Math.sqrt(globalVariables.totalCards)}x${Math.sqrt(globalVariables.totalCards)}`,
    })
  })
    .then(closeScoreBoard());
}

function populateBoard() {
  globalVariables.totalCards = selectors.gridSize.value;

  let boardSize = "";
  switch (globalVariables.totalCards) {
    case "16":
      boardSize = "40vh";
      break;
    case "36":
      boardSize = "60vh";
      break;
    case "64":
      boardSize = "80vh";
      break;
  }

  selectors.board.style.width = boardSize;
  selectors.board.style.height = boardSize;
  selectors.board.style.display = "grid";

  const rowColumns = `repeat(${Math.sqrt(globalVariables.totalCards)}, 1fr)`;
  selectors.board.style.gridTemplateColumns = rowColumns;
  selectors.board.style.gridTemplateRows = rowColumns;

  for (let i = 1; i <= globalVariables.totalCards; i++) {
    const card = document.createElement("div");
    card.id = "card" + i;
    card.classList.add("card");

    const hidden = document.createElement("div");
    hidden.classList.add("hidden");

    const show = document.createElement("div");
    show.classList.add("show");

    card.appendChild(hidden);
    card.appendChild(show);

    selectors.board.appendChild(card);
  }
}

function clearBoard() {
  selectors.board.style.display = 'none';
  while (selectors.board.firstChild) {
    selectors.board.removeChild(selectors.board.firstChild);
  }
}

function resetGame() {
  globalVariables.timer = 0;
  clearInterval(globalVariables.timerInterval);
  selectors.timer.textContent = `time ${globalVariables.timer} sec`;
  globalVariables.moves = 0;
  selectors.moves.textContent = `${globalVariables.moves} moves`;
  globalVariables.randomCards = {};
  globalVariables.totalFound = 0;
}

document.addEventListener("click", (event) => {
  if (event.target.id == "startStopGame") {
    if (globalVariables.gameStarted === 0) {
      startGame();
    } else {
      stopGame();
    }
  };
  if (
    event.target.className.includes("hidden") &&
    globalVariables.gameStarted === 1 &&
    globalVariables.visibleCards.length < 2
  ) {
    showCard(event.target);
  };
  if (event.target.id === "addScore") {
    addScore();
  };
  if (event.target.id === "closeScore") {
    closeScoreBoard();
  };
});
