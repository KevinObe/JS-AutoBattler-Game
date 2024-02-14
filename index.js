// game data
const game = document.querySelector('#game');
const viewport = document.getElementById('viewport');
const controlUnit = document.querySelector('.controlUnit');

const elementWidth = 30;
const elementHeight = 30;
const gameWidth = 2000;
const gameHeight = 2000;

// game settings
const playerStartPosition = [160, 1800];
const playerCurrentPosition = playerStartPosition;

const viewportStartPosition = [0, 0];
let viewportCurrentPosition = viewportStartPosition;

const gameStartPosition = [0, 0];
let gameCurrentPosition = gameStartPosition;

const dialog = document.querySelector('dialog');
const startBtn = document.querySelector('#startBtn');
dialog.showModal();

// game start / stop
const player = document.createElement('div');
player.className = 'player';

function drawPlayer() {
  player.style.left = `${playerCurrentPosition[0]}px`;
  player.style.bottom = `${playerCurrentPosition[1]}px`;
  viewport.style.transform = `translate(${viewportCurrentPosition[0]}px, ${viewportCurrentPosition[1]}px)`;
  game.style.transform = `translate(${gameCurrentPosition[0]}px, ${gameCurrentPosition[1]}px)`
}


startBtn.addEventListener('click', spawnPlayer);
let gameInterval;

// player spwan
function spawnPlayer() {
  dialog.close();
  drawPlayer();
  spawnEnemy();
  gameInterval = setInterval(() => {
    getDistanceToPlayer();
  }, 500);
  game.appendChild(player);
}

//game is ready at this point
// player movement
const arrowLeft = document.querySelector('#leftArrow');
const arrowRight = document.querySelector('#rightArrow');
const arrowUp = document.querySelector('#upArrow');
const arrowDown = document.querySelector('#downArrow');
let moveInterval;

function movePlayer(direction) {
    switch (direction) {
        case 'left':
          if(playerCurrentPosition[0] > 5){
            viewportCurrentPosition[0] -= 10;
            playerCurrentPosition[0] -= 10;
            gameCurrentPosition[0] += 10;
            drawPlayer();
          }
            break;
        case 'up':
          if(playerCurrentPosition[1] < 1960){
            viewportCurrentPosition[1] -= 10;
            playerCurrentPosition[1] += 10;
            gameCurrentPosition[1] += 10;
            drawPlayer();
          }
            break;
        case 'down':
          if(playerCurrentPosition[1] > 0){
            viewportCurrentPosition[1] += 10;
            playerCurrentPosition[1] -= 10;
            gameCurrentPosition[1] -= 10;
            drawPlayer();
          }
            break;
        case 'right':
          if(playerCurrentPosition[0] < 1965){
            viewportCurrentPosition[0] += 10;
            playerCurrentPosition[0] += 10;
            gameCurrentPosition[0] -= 10;
            drawPlayer();
          }
            break;
        default:
            break;
    }
}

function startMoving(direction) {
  moveInterval = setInterval(() => {
    movePlayer(direction);
  }, 50);
}


arrowLeft.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startMoving('left');
});

arrowRight.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startMoving('right');
});

arrowDown.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startMoving('down');
});

arrowUp.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startMoving('up');
});

document.ontouchend = () => {
  clearInterval(moveInterval)
}

// player firing

// target hit collisions

// enemy spawns
class Enemy {
  constructor([xAxis, yAxis]){
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + elementWidth, yAxis];
    this.topLeft = [xAxis, yAxis + elementHeight];
    this.topRight = [xAxis + elementWidth, yAxis + elementHeight];
    this.startPosition = this.bottomLeft;
  }
}

const randomSpawnPoint = () => {
  let x = Math.floor(Math.random() * 1960);
  let y = Math.floor(Math.random() * 1960);

  if(x > 1960 || x < 5 || y > 1960 || y < 5){
    return [995, 1000];
  }
  return [x, y];
}

const enemies = [
  new Enemy(randomSpawnPoint()),
]

function spawnEnemy() {
  for(let i = 0; i < enemies.length; i++){
    let enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemies[i].id = enemy;
    drawEnemy(enemies[i]);
    game.appendChild(enemy);
  }
}
// enemy auto movement
// at this point the game is up and running, player and enemy spawning is done;

function drawEnemy(enemy) {
  enemy.id.style.left = `${enemy.startPosition[0]}px`;
  enemy.id.style.bottom = `${enemy.startPosition[1]}px`;
}

function moveToPlayer(enemy) {
  switch(enemy.direction){
    case 'downLeft':
      enemy.bottomLeft[0] -= 10;
      enemy.bottomLeft[1] -= 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    case 'upRight':
      enemy.bottomLeft[0] += 10;
      enemy.bottomLeft[1] += 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    case 'upLeft':
      enemy.bottomLeft[0] -= 10;
      enemy.bottomLeft[1] += 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    case 'downRight':
      enemy.bottomLeft[0] += 10;
      enemy.bottomLeft[1] -= 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    case 'down':
      enemy.bottomLeft[1] -= 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    case 'up':
      enemy.bottomLeft[1] += 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    case 'left':
      enemy.bottomLeft[0] -= 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    case 'right':
      enemy.bottomLeft[0] += 10;
      drawEnemy(enemy);
      checkCollision(enemy);
      break;
    default:
      break;
  }
}

function getDistanceToPlayer(){
  for(let enemy of enemies){
    if(enemy.interval){
      clearInterval(enemy.interval);
    }
    if(enemy.bottomLeft[1] > playerCurrentPosition[1] - elementHeight
      &&
      enemy.bottomLeft[1] < playerCurrentPosition[1] + elementHeight
      &&
      enemy.bottomLeft[0] > playerCurrentPosition[0]){
      enemy.direction = 'left';
    } else if(enemy.bottomLeft[1] > playerCurrentPosition[1] - elementHeight
      &&
      enemy.bottomLeft[1] < playerCurrentPosition[1] + elementHeight
      &&
      enemy.bottomLeft[0] < playerCurrentPosition[0]){
      enemy.direction = 'right';
    } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] + elementWidth
      &&
      enemy.bottomLeft[0] > playerCurrentPosition[0] - elementWidth
      &&
      enemy.bottomLeft[1] > playerCurrentPosition[1]){
      enemy.direction = 'down';
    } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] + elementWidth
      &&
      enemy.bottomLeft[0] > playerCurrentPosition[0] - elementWidth
      &&
      enemy.bottomLeft[1] < playerCurrentPosition[1]){
      enemy.direction = 'up';
    } else if(enemy.bottomLeft[0] > playerCurrentPosition[0]
      &&
      enemy.bottomLeft[1] > playerCurrentPosition[1]
      ){
      enemy.direction = 'downLeft';
    } else if(enemy.bottomLeft[0] < playerCurrentPosition[0]
      &&
      enemy.bottomLeft[1] < playerCurrentPosition[1]
      ){
      enemy.direction = 'upRight';
    } else if(enemy.bottomLeft[0] > playerCurrentPosition[0]
      &&
      enemy.bottomLeft[1] < playerCurrentPosition[1]
      ){
      enemy.direction = 'upLeft';
    } else if(enemy.bottomLeft[0] < playerCurrentPosition[0]
      &&
      enemy.bottomLeft[1] > playerCurrentPosition[1]
      ){
      enemy.direction = 'downRight';
    } else {
      console.log(enemy, 'was removed');
      //remove enemy from html and enemies array;
    }
    enemy.interval = setInterval(() => {
      console.log(enemy.direction)
      moveToPlayer(enemy);
     }, 100);
  }
}

// enemy collisions with map border or player character;

function checkCollision(enemy) {
  if(enemy.bottomLeft[0] < 0 || enemy.bottomLeft[0] > 1970 || enemy.bottomLeft[1] < 0 || enemy.bottomLeft[1] > 1970){
    clearInterval(enemy.interval);
    getDistanceToPlayer();
  } else {
    return;
  }
  console.log(enemy.bottomLeft, enemy.direction);
}

// score counter

// evaluate win or loss
