globalVariables = {
  timer: 0,
  timerInterval: null,
  moves: 0,
  gameStarted: 0,
  randomCards: {},
  visibleCards: [],
  totalCards: 0,
  totalFound: 0,
}

selectors = {
  startStop: document.getElementById('startStopGame'),
  timer: document.querySelector(".timer"),
  moves: document.querySelector('.moves'),
  board: document.querySelector('.board'),
  gridSize: document.getElementById('gridSize'),
  scoreBoard: document.getElementById('scoreBoard'),
}

function shuffleCards() {
  const emojis = [
    '🍏', 
    '🍎', 
    '🍐', 
    '🍊', 
    '🍋', 
    '🍌', 
    '🍉', 
    '🍇', 
    '🍓', 
    '🫐', 
    '🍈', 
    '🍒', 
    '🍑', 
    '🥭', 
    '🍍', 
    '🥥', 
    '🥝', 
    '🍅', 
    '🍆', 
    '🥑', 
    '🥦', 
    '🥬', 
    '🥒', 
    '🌶', 
    '🫑', 
    '🌽', 
    '🥕', 
    '🫒', 
    '🧄', 
    '🧅', 
    '🥔', 
    '🍠', 
    '🥐',
    '🥯', 
    '🍞', 
    '🥖', 
    '🥨', 
    '🧀', 
    '🥚', 
    '🍳', 
    '🧈', 
    '🥞', 
    '🧇', 
    '🥓', 
    '🥩', 
    '🍗', 
    '🍖', 
    '🦴', 
    '🌭', 
    '🍔', 
    '🍟', 
    '🍕', 
    '🫓', 
    '🥪', 
    '🥙', 
    '🧆', 
    '🌮', 
    '🌯', 
    '🫔', 
    '🥗', 
    '🥘', 
    '🫕', 
    '🥫', 
    '🍝',
  ];

  const cards = [];

  for (let i = 1; i <= globalVariables.totalCards; i++) {
    cards.push('card' + i);
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
  selectedCard.classList.remove('rotate');
  for (const child of selectedCard.children) {
    if (child.className === "show") {
      child.textContent = '';
    }
  }
}


function checkClickedCards() {
  incrementMove();
  if (globalVariables.visibleCards[0].textContent !== globalVariables.visibleCards[1].textContent) {
    setTimeout(() => {
      hideCards(globalVariables.visibleCards[0]);
      hideCards(globalVariables.visibleCards[1]);
      globalVariables.visibleCards = [];
    }, "1000");
  } else {
    globalVariables.totalFound++;
    globalVariables.visibleCards = [];
    checkWin();
  }
}

function checkWin() {
  if (globalVariables.totalCards == globalVariables.totalFound * 2) {
    clearInterval(globalVariables.timerInterval);
    selectors.startStop.textContent = 'Start';
    selectors.gridSize.disabled = false;
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
  selectors.startStop.textContent = 'Stop';
  globalVariables.timerInterval = setInterval(updateTimer, 1000);
}

function stopGame() {
  clearBoard()
  resetGame();
  selectors.gridSize.disabled = false;
  globalVariables.gameStarted = 0;
  selectors.startStop.textContent = 'Start';
}

function showScoreBoard() {
  selectors.scoreBoard.style.display = 'block';
}

function populateBoard() {
  globalVariables.totalCards = selectors.gridSize.value;

  let boardSize = '';
  switch (globalVariables.totalCards) {
    case '16':
      boardSize = '40vh';
      break;
    case '36':
      boardSize = '60vh';
      break;
    case '64':
      boardSize = '80vh';
      break;
  }

  selectors.board.style.width = boardSize;
  selectors.board.style.height = boardSize;
  selectors.board.style.display = 'grid';

  const rowColumns = `repeat(${Math.sqrt(globalVariables.totalCards)}, 1fr)`;
  selectors.board.style.gridTemplateColumns = rowColumns;
  selectors.board.style.gridTemplateRows = rowColumns;

  for (let i = 1; i <= globalVariables.totalCards; i++) {
    const card = document.createElement('div');
    card.id = 'card' + i;
    card.classList.add('card');

    const hidden = document.createElement('div');
    hidden.classList.add('hidden');

    const show = document.createElement('div');
    show.classList.add('show');

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
  //showScoreBoard()
  if (event.target.id == 'startStopGame') {
    if (globalVariables.gameStarted === 0) {
      startGame();
    } else {
      stopGame();
    }
  }
  if (event.target.className.includes("hidden") && globalVariables.gameStarted === 1 && globalVariables.visibleCards.length < 2) {
    showCard(event.target);
  }
});
