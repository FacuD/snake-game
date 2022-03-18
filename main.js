// HTML Elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

// Game Settings
const boardSize = 10; //10x10
const gameSpeed = 120;
const squareTypes = {
  emptySquare: 0,
  foodSquare: 1,
  bodySnakeSquare: 2,
  headSnakeSquare: 3,
};
const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};

// Game Variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
  snakeBody = snake.slice(1, snake.length);
  snakeHead = snake.slice(-1)[0];
  snakeBody.forEach((square) => drawSquare(square, "bodySnakeSquare"));
  drawSquare(snakeHead, "headSnakeSquare");
};

// squareTypes = emptySquares, headSnakeSquare, bodySnakeSquare or foodSquare
const drawSquare = (squarePosition, squareType) => {
  const [row, column] = squarePosition.split("");
  boardSquares[row][column] = squareTypes[squareType];
  const squareElement = document.getElementById(squarePosition);
  squareElement.setAttribute("class", `square ${squareType}`);

  if (squareType === "headSnakeSquare") {
    changeSnakeHeadDirection(`${direction}`);
  } else {
    squareElement.style.removeProperty("transform");
  }
  if (squareType === "emptySquare") {
    emptySquares.push(squarePosition);
  } else {
    if (emptySquares.indexOf(squarePosition) !== -1) {
      emptySquares.splice(emptySquares.indexOf(squarePosition), 1);
    }
  }
};

const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0"); // Le agrega un 0 adelante si es un solo digito (primera fila)
  const [row, column] = newSquare.split("");
  if (
    newSquare < 0 || // Toca el techo
    newSquare >= boardSize * boardSize || // Toca el piso
    (direction === "ArrowRight" && column == 0) || // Toca el borde derecho
    (direction === "ArrowLeft" && column == 9) || // Toca el borde izquierdo
    boardSquares[row][column] === squareTypes.bodySnakeSquare || // Se choca consigo misma
    boardSquares[row][column] === squareTypes.headSnakeSquare // Se choca consigo misma
  ) {
    gameOver();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, "emptySquare");
    }
    drawSnake();
  }
};

const addFood = () => {
  score++;
  updateScore();
  createRandomFood();
};

const gameOver = () => {
  gameOverSign.style.display = "block";
  clearInterval(moveInterval);
  startButton.disabled = false;
};

const setDirection = (newDirection) => {
  direction = newDirection;
};

const rotateElement = (squareType, degrees) => {
  document.getElementsByClassName(
    `${squareType}`
  )[0].style.transform = `rotate(${degrees}deg)`;
};

const changeSnakeHeadDirection = (arrow) => {
  switch (arrow) {
    case "ArrowUp":
      rotateElement("headSnakeSquare", 180);
      break;
    case "ArrowDown":
      rotateElement("headSnakeSquare", 360);
      break;
    case "ArrowRight":
      rotateElement("headSnakeSquare", 270);
      break;
    case "ArrowLeft":
      rotateElement("headSnakeSquare", 90);
      break;
  }
};

const directionEvent = (key) => {
  switch (key.code) {
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowLeft" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
  }
};

const createRandomFood = () => {
  const randomEmptySquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, "foodSquare");
};

const updateScore = () => {
  scoreBoard.innerText = score;
};

// Inicializar el tablero
const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

const setGame = () => {
  snake = ["00", "01", "02", "03"];
  score = snake.length;
  direction = "ArrowRight";
  //  Crea un array del tamaño del tablero cuyos elementos
  //  tambien son arrays del mismo tamaño pero inicializados en 0 (cuadrados vacios)
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );
  console.log(boardSquares);
  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

const startGame = () => {
  setGame();
  gameOverSign.style.display = "none";
  startButton.disabled = true;
  drawSnake();
  updateScore();
  createRandomFood();
  document.addEventListener("keydown", directionEvent);
  moveInterval = setInterval(moveSnake, gameSpeed);
};

const restartGame = () => {
  clearInterval(moveInterval);
  startGame();
};

startButton.addEventListener("click", startGame);
document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    restartGame();
  }
});
