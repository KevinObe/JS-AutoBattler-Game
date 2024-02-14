// game data
let gameSwitch = false;
const game = document.querySelector('#game');
const viewport = document.getElementById('viewport');
const controlUnit = document.querySelector('.controlUnit');

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

let gameInterval;

// create player
const player = {
  range: 20,
  height: 30,
  width: 30,
}

// create enemies
let enemyWidth = 30;
let enemyHeight = 30;

class Enemy {
  constructor([xAxis, yAxis]){
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + enemyWidth, yAxis];
    this.topLeft = [xAxis, yAxis + enemyHeight];
    this.topRight = [xAxis + enemyWidth, yAxis + enemyHeight];
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

let enemies = []

// player spwan / start game
function spawnPlayer() {
  if(gameSwitch){
    player.id = document.createElement('div');
    player.currentPosition = playerStartPosition;
    player.health = 100;
    player.lifeTime = () => {
      let lifeTimeInterval = setInterval(() => {
        if(player.health <= 0){
          gameSwitch = false;
          resetGame();
          clearInterval(lifeTimeInterval)
          return;
        }
      }, 50);
    };
    let enemieNumber = 10;
    for(let i = 0; i <= enemieNumber; i++){
      enemies.push(new Enemy(randomSpawnPoint()));
    };
    dialog.close();
    drawPlayer();
    spawnEnemy();
    gameInterval = setInterval(() => {
      getDistanceToPlayer();
    }, 500);
    player.lifeTime();
    game.appendChild(player.id);
  } else {
    dialog.showModal();
    return;
  }
}

function drawPlayer() {
  player.id.className = 'player';
  player.id.style.left = `${playerCurrentPosition[0]}px`;
  player.id.style.bottom = `${playerCurrentPosition[1]}px`;
  viewport.style.transform = `translate(${viewportCurrentPosition[0]}px, ${viewportCurrentPosition[1]}px)`;
  game.style.transform = `translate(${gameCurrentPosition[0]}px, ${gameCurrentPosition[1]}px)`;
}

startBtn.addEventListener('click', () => {
  gameSwitch = true;
  spawnPlayer();
});



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


//spawn enemies
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
  enemy.id.style.left = `${enemy.bottomLeft[0]}px`;
  enemy.id.style.bottom = `${enemy.bottomLeft[1]}px`;
  enemy.bottomRight = [(enemy.bottomLeft[0] + enemyWidth), (enemy.bottomLeft[1])];
  enemy.topLeft = [enemy.bottomLeft[0], (enemy.bottomLeft[1] + enemyHeight)];
  enemy.topRight = [(enemy.bottomLeft[0] + enemyWidth), (enemy.bottomLeft[1] + enemyHeight)];
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
    if(enemy.bottomLeft[1] > playerCurrentPosition[1] - player.range
      &&
      enemy.bottomLeft[1] < playerCurrentPosition[1] + player.range
      &&
      enemy.bottomLeft[0] > playerCurrentPosition[0]){
      enemy.direction = 'left';
    } else if(enemy.bottomLeft[1] > playerCurrentPosition[1] - player.range
      &&
      enemy.bottomLeft[1] < playerCurrentPosition[1] + player.range
      &&
      enemy.bottomLeft[0] < playerCurrentPosition[0]){
      enemy.direction = 'right';
    } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] + player.range
      &&
      enemy.bottomLeft[0] > playerCurrentPosition[0] - player.range
      &&
      enemy.bottomLeft[1] > playerCurrentPosition[1]){
      enemy.direction = 'down';
    } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] + player.range
      &&
      enemy.bottomLeft[0] > playerCurrentPosition[0] - player.range
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
      moveToPlayer(enemy);
     }, 100);
  }
}

// enemy collisions with map border or player character;

function checkCollision(enemy) {
  //keeps enemies inside the map in case the try to break out;
  if(enemy.bottomLeft[0] < 0 || enemy.bottomLeft[0] > 2000 || enemy.bottomLeft[1] < 0 || enemy.bottomLeft[1] > 2000){
    clearInterval(enemy.interval);
    getDistanceToPlayer();
    return;
  }

  //logic if the enemies collide with the player;
  if((enemy.bottomLeft[0] > playerCurrentPosition[0]
      &&
      (enemy.bottomLeft[0] < playerCurrentPosition[0] + player.width))
    && (enemy.bottomLeft[1] > playerCurrentPosition[1]
       &&
       enemy.bottomLeft[1] < (playerCurrentPosition[1] + player.height))
    ) {
      console.log('collision bottomLeft')
      player.health -= 5;
      return;
    } else if((enemy.topLeft[0] > playerCurrentPosition[0]
      &&
      (enemy.topLeft[0] < playerCurrentPosition[0] + player.width))
    && (enemy.topLeft[1] > playerCurrentPosition[1]
       &&
       enemy.topLeft[1] < (playerCurrentPosition[1] + player.height))
    )  {
      console.log('collision topLeft')
      player.health -= 5;
      return;
    } else if((enemy.bottomRight[0] > playerCurrentPosition[0]
      &&
      (enemy.bottomRight[0] < playerCurrentPosition[0] + player.width))
    && (enemy.bottomRight[1] > playerCurrentPosition[1]
       &&
       enemy.bottomRight[1] < (playerCurrentPosition[1] + player.height))
    )  {
      console.log('collision bottomRight')
      player.health -= 5;
      return;
    } else if((enemy.topRight[0] > playerCurrentPosition[0]
      &&
      (enemy.topRight[0] < playerCurrentPosition[0] + player.width))
    && (enemy.topRight[1] > playerCurrentPosition[1]
       &&
       enemy.topRight[1] < (playerCurrentPosition[1] + player.height))
    )  {
      console.log('collision topRight')
      player.health -= 5;
      return;
    } else {
      return;
    }
}

// score counter

// evaluate win or loss
function resetGame() {

  //game
  clearInterval(gameInterval);
  gameSwitch = false;

  //player
  player.id.remove();
  delete player.id;
  clearInterval(player.lifeTime);
  delete player.lifeTime;

  //enemies
  for(const enemy of enemies) {
    clearInterval(enemy.interval);
    enemy.id.remove();
  }
  console.log(enemies)
  enemies = [];

  spawnPlayer();
  return;
}

spawnPlayer();
