const board = document.getElementById("board");
const diceResult = document.getElementById("diceResult");
const rollDiceBtn = document.getElementById("rollDice");
const currentPlayerDisplay = document.getElementById("currentPlayer");
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const options = document.getElementById("options");
const timer = document.getElementById("timer");
const winnerPopup = document.getElementById("winnerPopup");
const winnerText = document.getElementById("winnerText");

let squares = [];
let players = [
  { pos: 0, el: createPawn("p1"), name: "Pemain 1" },
  { pos: 0, el: createPawn("p2"), name: "Pemain 2" },
];
let currentPlayer = 0;
let rolling = false;
let timeLeft;
let timerInterval;

const questionPoints = [3, 7, 15, 22, 30, 37, 45, 58, 67, 88];
const questions = [
  { q: "Apa ibu kota Indonesia?", a: "Jakarta", o: ["Surabaya", "Bandung", "Jakarta"] },
  { q: "Siapa presiden pertama Indonesia?", a: "Soekarno", o: ["Soekarno", "Soeharto", "Habibie"] },
  { q: "Apa mata uang Indonesia?", a: "Rupiah", o: ["Rupiah", "Dollar", "Ringgit"] },
  { q: "Berapa warna bendera Indonesia?", a: "2", o: ["3", "2", "4"] },
  { q: "Gunung tertinggi di Indonesia?", a: "Puncak Jaya", o: ["Puncak Jaya", "Merapi", "Semeru"] },
  { q: "Hari Kemerdekaan Indonesia?", a: "17 Agustus", o: ["17 Juli", "17 Agustus", "17 September"] },
  { q: "Bahasa resmi Indonesia?", a: "Bahasa Indonesia", o: ["Jawa", "Sunda", "Bahasa Indonesia"] },
  { q: "Lagu kebangsaan Indonesia?", a: "Indonesia Raya", o: ["Garuda Pancasila", "Indonesia Raya", "Tanah Airku"] },
  { q: "Pulau terbesar di Indonesia?", a: "Kalimantan", o: ["Bali", "Kalimantan", "Sumatera"] },
  { q: "Lambang negara Indonesia?", a: "Garuda", o: ["Garuda", "Merpati", "Elang"] },
];

function createBoard() {
  for (let i = 99; i >= 0; i--) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.textContent = i + 1;
    if (questionPoints.includes(i)) {
      square.classList.add("question-square");
    }
    board.appendChild(square);
    squares.push(square);
  }
  players.forEach(p => board.appendChild(p.el));
  updatePawn();
}

function createPawn(className) {
  const el = document.createElement("div");
  el.classList.add("pawn", className);
  return el;
}

function rollDice() {
  if (rolling || questionBox.style.display !== "none") return;
  rolling = true;
  const dice = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = dice;
  movePlayer(dice);
}

function movePlayer(steps) {
  const player = players[currentPlayer];
  player.pos = Math.min(player.pos + steps, 99);
  updatePawn();
  setTimeout(() => {
    if (questionPoints.includes(player.pos)) {
      showQuestion();
    } else if (player.pos === 99) {
      showWinner();
    } else {
      switchTurn();
    }
  }, 600);
}

function updatePawn() {
  players.forEach(p => {
    const square = squares[p.pos];
    p.el.style.left = square.offsetLeft + "px";
    p.el.style.top = square.offsetTop + "px";
  });
}

function showQuestion() {
  questionBox.classList.remove("hidden");
  let q = questions[Math.floor(Math.random() * questions.length)];
  questionText.textContent = q.q;
  options.innerHTML = "";
  q.o.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => answerQuestion(opt === q.a);
    options.appendChild(btn);
  });
  timeLeft = 10;
  timer.textContent = `Waktu: ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timer.textContent = `Waktu: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      answerQuestion(false);
    }
  }, 1000);
}

function answerQuestion(correct) {
  clearInterval(timerInterval);
  if (!correct) {
    players[currentPlayer].pos = Math.max(players[currentPlayer].pos - 3, 0);
    updatePawn();
  }
  questionBox.classList.add("hidden");
  if (players[currentPlayer].pos === 99) {
    showWinner();
  } else {
    switchTurn();
  }
}

function switchTurn() {
  currentPlayer = (currentPlayer + 1) % 2;
  currentPlayerDisplay.textContent = players[currentPlayer].name;
  rolling = false;
}

function showWinner() {
  winnerPopup.classList.remove("hidden");
  winnerText.textContent = `${players[currentPlayer].name} Menang!`;
}

rollDiceBtn.addEventListener("click", rollDice);
createBoard();
