let card = document.getElementsByClassName("card");
let cards = [...card];
const deck = document.getElementById("card-deck");
let openedCards = [];
let matchedCard = document.getElementsByClassName("match");
let moves = 0;
let counter = document.querySelector(".moves");
const stars = document.querySelectorAll(".fa-star");
let sec = 0;
let min = 0;
let timer = document.querySelector(".timer");
let interval;
let modal = document.getElementById("popup1");
let starList = document.querySelectorAll(".stars li");
let closeIcon = document.querySelector(".close");

// Добавляем addEventLictener к каждой карте
for (let i = 0; i < cards.length; i += 1) {
  card = cards[i];
  card.addEventListener("click", displayCard);
  card.addEventListener("click", cardOpen);
  card.addEventListener("click", congrats);
}

// Перемешивание карт. Алгоритм "Тасование Кнута", см. Википедию, его реализация взята с habr'а
function shuffle(arr) {
  let j, temp;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

document.body.onload = startGame();

// Перемешиваем карты и отображем карты на игровом поле
// Убираем все классы у карт, обновляем счетчик ходов, время и рейтинг
function startGame() {
  openedCards = [];
  cards = shuffle(cards);
  // После перемешивания перебираем сгенерированный массив для отображения каждой карты
  for (let i = 0; i < cards.length; i += 1) {
    deck.innerHTML = "";
    [].forEach.call(cards, function(item) {
      deck.appendChild(item);
    });
    cards[i].classList.remove("show", "open", "match", "disabled");
  }

  moves = 0;
  counter.innerHTML = moves;

  document.getElementById("highscore").innerHTML = localStorage.getItem(
    "highscore"
  );
  document.getElementById("previousscore").innerHTML = localStorage.getItem(
    "previous"
  );

  for (let i = 0; i < stars.length; i += 1) {
    stars[i].style.color = "#FFD700";
    stars[i].style.visibility = "visible";
  }

  sec = 0;
  min = 0;
  let timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);
}

// Переключаем соответствующие классы для карт
function displayCard() {
  this.classList.toggle("open");
  this.classList.toggle("show");
  this.classList.toggle("disabled");
}

// Помещаем в массив открытые карты, при открытии второй карты производится проверка на их соответствие
function cardOpen() {
  openedCards.push(this);
  if (openedCards.length === 2) {
    moveCounter();
    if (openedCards[0].type === openedCards[1].type) {
      matched();
    } else {
      unmatched();
    }
  }
}

// Добавляем и убираем соответствующие классы при совпадении, обнуляем массив открытых карт
function matched() {
  openedCards[0].classList.add("match", "disabled");
  openedCards[1].classList.add("match", "disabled");
  openedCards[0].classList.remove("show", "open", "no-event");
  openedCards[1].classList.remove("show", "open", "no-event");
  openedCards = [];
}

function unmatched() {
  openedCards[0].classList.add("unmatched");
  openedCards[1].classList.add("unmatched");
  disable();
  setTimeout(() => {
    openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
    openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
    enable();
    openedCards = [];
  }, 1200);
}

// Disable и enable - позволяют выбрать только две карты, отключая возможность выбора и потом включая его обратно
function disable() {
  Array.prototype.filter.call(cards, function(card) {
    card.classList.add("disabled");
  });
}

function enable() {
  Array.prototype.filter.call(cards, function(card) {
    card.classList.remove("disabled");
    for (let i = 0; i < matchedCard.length; i += 1) {
      matchedCard[i].classList.add("disabled");
    }
  });
}

// Счетчик ходов, отображение рейтинга в зависимости от количества ходов
function moveCounter() {
  moves += 1;
  counter.innerHTML = moves;

  if (moves === 1) {
    sec = 0;
    min = 0;
    startTimer();
  }

  if (moves > 10 && moves < 18) {
    for (let i = 0; i < 3; i += 1) {
      if (i > 1) {
        stars[i].style.visibility = "collapse";
      }
    }
  } else if (moves > 18) {
    for (let i = 0; i < 3; i += 1) {
      if (i > 0) {
        stars[i].style.visibility = "collapse";
      }
    }
  }
}

function startTimer() {
  interval = setInterval(() => {
    timer.innerHTML = min + "min " + sec + "sec";
    sec += 1;
    if (sec === 60) {
      min += 1;
      sec = 0;
    }
  }, 1000);
}

// Всплывающее окно с результатами  записью результатов в local storage
function congrats() {
  if (matchedCard.length === 16) {
    clearInterval(interval);
    finalTime = timer.innerHTML;
    modal.classList.add("show");
    let starRating = document.querySelector(".stars").innerHTML;
    document.getElementById("finalMove").innerHTML = moves;
    document.getElementById("starRating").innerHTML = starRating;
    document.getElementById("totalTime").innerHTML = finalTime;
    if (moves < +localStorage.getItem("highscore")) {
      localStorage.setItem("highscore", moves);
    }
    localStorage.setItem("previous", moves);
    closeModal();
  }
}

function closeModal() {
  closeIcon.addEventListener("click", e => {
    modal.classList.remove("show");
    startGame();
  });
}

function playAgain() {
  modal.classList.remove("show");
  startGame();
}