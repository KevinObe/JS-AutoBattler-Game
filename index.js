// game html elements that need are used during the game;
let gameSwitch = false;
const game = document.querySelector('#game');
const viewport = document.getElementById('viewport');
const controlUnit = document.querySelector('.controlUnit');
const score = document.querySelector('#score');
const playerHealth = document.querySelector('#health-bar');

// game settings that are necessary for the game mechanics;
const playerStartPosition = [160, 1780];
const playerCurrentPosition = playerStartPosition;

const viewportStartPosition = [0, 0];
let viewportCurrentPosition = viewportStartPosition;

const gameStartPosition = [0, 0];
let gameCurrentPosition = gameStartPosition;

const dialog = document.querySelector('dialog');
const startBtn = document.querySelector('#startBtn');

const gameSettings = {
  counter: 0,
}

const gameWidth = 2000;
const gameHeight = 2000;

let gameInterval;
let shotsFired = true;

// create player with all infos needed;
const player = {
  range: 20,
  height: 48,
  width: 48,
  speed: 30,
  firingRate: 500,
  damage: 100,
  perception: 500,
  class: 'player',
}

//draw the player into the html;
function drawPlayer() {
  player.id.className = player.class;
  player.id.style.left = `${playerCurrentPosition[0]}px`;
  player.id.style.bottom = `${playerCurrentPosition[1]}px`;
  viewport.style.transform = `translate(${viewportCurrentPosition[0]}px, ${viewportCurrentPosition[1]}px)`;
  game.style.transform = `translate(${gameCurrentPosition[0]}px, ${gameCurrentPosition[1]}px)`;
}

// create enemy spwan points and give them their start location when the game starts;
let enemyWidth = 50;
let enemyHeight = 50;

const randomSpawnPoint = () => {
  let x = Math.floor(Math.random() * 1960);
  let y = Math.floor(Math.random() * 1960);

  if(x > 1960 || x < 5 || y > 1960 || y < 5){
    return [995, 1000];
  }
  return [x, y];
}
let enemieNumber = 10;
let enemies = [];

class Enemy {
  constructor([xAxis, yAxis]){
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + enemyWidth, yAxis];
    this.topLeft = [xAxis, yAxis + enemyHeight];
    this.topRight = [xAxis + enemyWidth, yAxis + enemyHeight];
    this.startPosition = this.bottomLeft;
    this.middle = [xAxis + enemyWidth / 2, yAxis + enemyHeight / 2];
    this.health = 100;
    this.protection = false;
    this.speed = 75;
    this.withinPlayerPerception = false;
  }
}

//spawn enemies into the game with all information needed;
function spawnEnemy() {
  for(let i = 0; i < enemies.length; i++){
    let enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemies[i].id = enemy;
    drawEnemy(enemies[i]);
    game.appendChild(enemy);
  }
}

//draw the html and set up enemies
function drawEnemy(enemy) {
  enemy.id.style.left = `${enemy.bottomLeft[0]}px`;
  enemy.id.style.bottom = `${enemy.bottomLeft[1]}px`;
  enemy.bottomRight = [(enemy.bottomLeft[0] + enemyWidth), (enemy.bottomLeft[1])];
  enemy.topLeft = [enemy.bottomLeft[0], (enemy.bottomLeft[1] + enemyHeight)];
  enemy.topRight = [(enemy.bottomLeft[0] + enemyWidth), (enemy.bottomLeft[1] + enemyHeight)];
}

// enemy auto movement
// at this point the game is up and running, player and enemy spawning is done;
//this function checks where the player is atm and moves into this direction; this way the enemies always follow the player;
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

//checking if the enemy is inside the range of the players shots;
function getNearestEnemy(enemy) {
  enemy.attackDirection = null;
  enemy.withinPlayerPerception = false;
  if(enemy.bottomLeft[1] > playerCurrentPosition[1] - player.range
    &&
    enemy.bottomLeft[1] < playerCurrentPosition[1] + player.range
    &&
    enemy.bottomLeft[0] > playerCurrentPosition[0] && enemy.bottomLeft[0] < playerCurrentPosition[0] + player.perception){
    enemy.attackDirection = 'right';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else if(enemy.bottomLeft[1] > playerCurrentPosition[1] - player.range
    &&
    enemy.bottomLeft[1] < playerCurrentPosition[1] + player.range
    &&
    enemy.bottomLeft[0] < playerCurrentPosition[0] && enemy.bottomLeft[0] > playerCurrentPosition[0] - player.perception){
    enemy.attackDirection = 'left';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] + player.range
    &&
    enemy.bottomLeft[0] > playerCurrentPosition[0] - player.range
    &&
    enemy.bottomLeft[1] > playerCurrentPosition[1] && enemy.bottomLeft[1] < playerCurrentPosition[1] + player.perception){
    enemy.attackDirection = 'down';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] + player.range
    &&
    enemy.bottomLeft[0] > playerCurrentPosition[0] - player.range
    &&
    enemy.bottomLeft[1] < playerCurrentPosition[1] && enemy.bottomLeft[1] > playerCurrentPosition[1] - player.perception){
    enemy.attackDirection = 'up';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else if(enemy.bottomLeft[0] > playerCurrentPosition[0] && enemy.bottomLeft[0] < (playerCurrentPosition[0] + player.width + player.perception)
    &&
    enemy.bottomLeft[1] > playerCurrentPosition[1] && enemy.bottomLeft[1] < (playerCurrentPosition[1] + player.height + player.perception)
    ){
    enemy.attackDirection = 'topRight';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] && enemy.bottomLeft[0] > playerCurrentPosition[0] - player.perception
    &&
    enemy.bottomLeft[1] < playerCurrentPosition[1] && enemy.bottomLeft[1] > playerCurrentPosition[1] - player.perception
    ){
    enemy.attackDirection = 'bottomLeft';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else if(enemy.bottomLeft[0] > playerCurrentPosition[0] && enemy.bottomLeft[0] < playerCurrentPosition[0] + player.perception
    &&
    enemy.bottomLeft[1] < playerCurrentPosition[1] && enemy.bottomLeft[1] > playerCurrentPosition[1] - player.perception
    ){
    enemy.attackDirection = 'bottomRight';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] && enemy.bottomLeft[0] > playerCurrentPosition[0] - player.perception
    &&
    enemy.bottomLeft[1] > playerCurrentPosition[1] && enemy.bottomLeft[1] < playerCurrentPosition[1] + player.perception
    ){
    enemy.attackDirection = 'topLeft';
    enemy.withinPlayerPerception = true;
    createPlayerFire(enemy);
  } else {
    enemy.attackDirection = null;
    enemy.withinPlayerPerception = false;
    return;
    //console.log(enemy, 'was removed');
    //remove enemy from html and enemies array;
  }
}

//logic to check where the enemy comes from in players reach and which direction the auto-firing needs to shoot its next shot to;
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
     }, enemy.speed);
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
      playerHealth.style.width = `${player.health}px`;
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
      playerHealth.style.width = `${player.health}px`;
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
      playerHealth.style.width = `${player.health}px`;
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
      playerHealth.style.width = `${player.health}px`;
      return;
    } else {
      return;
    }
}


// player movement on mobile devices using control unit;
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
  }, player.speed);
}

//controll events to move the player character on a mobile device;

arrowLeft.addEventListener('touchstart', (e) => {
  e.preventDefault();
  player.class = 'player-left';
  startMoving('left');
});

arrowRight.addEventListener('touchstart', (e) => {
  e.preventDefault();
  player.class = 'player';
  startMoving('right');
});

arrowDown.addEventListener('touchstart', (e) => {
  e.preventDefault();
  player.direction = 'down';
  startMoving('down');
});

arrowUp.addEventListener('touchstart', (e) => {
  e.preventDefault();
  player.direction = 'up';
  startMoving('up');
});

document.ontouchend = () => {
  clearInterval(moveInterval)
}

// player movement desktop version using arrows on keyboard;
let keyIsPressed = false;

document.addEventListener('keydown', (e) => {
  if(keyIsPressed === true) return;
  e.preventDefault();
  if(e.key === 'ArrowUp'){
    keyIsPressed = true;
    player.direction = 'up';
    startMoving('up');
  } else if(e.key === 'ArrowDown'){
    keyIsPressed = true;
    player.direction = 'down';
    startMoving('down');
  } else if(e.key === 'ArrowLeft'){
    keyIsPressed = true;
    player.direction = 'left';
    player.class = 'player-left';
    startMoving('left');
  } else if(e.key === 'ArrowRight'){
    keyIsPressed = true;
    player.direction = 'right';
    player.class = 'player';
    startMoving('right');
  } else {
    return;
  }
});

document.addEventListener('keyup', (e) => {
  keyIsPressed = false;
  if(e.key === 'ArrowUp'){
    clearInterval(moveInterval)
  } else if(e.key === 'ArrowDown'){
    clearInterval(moveInterval)
  } else if(e.key === 'ArrowLeft'){
    clearInterval(moveInterval)
  } else if(e.key === 'ArrowRight'){
    clearInterval(moveInterval)
  } else {
    return;
  }
});


// create and draw the shots, logic of the player auto firing;
let shots = [];

class Shot {
  constructor(xAxis, yAxis) {
    this.width = 15;
    this.height = 15;
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + this.height, yAxis];
    this.topLeft = [xAxis, yAxis + this.height];
    this.topRight = [xAxis + this.width, yAxis + this.height];
    this.middle = [xAxis + (this.width / 2), yAxis + (this.height / 2)];
    this.startPosition = [xAxis, yAxis];
    this.range = 500;
  }
}

function createPlayerFire(enemy) {
  if(shotsFired) return;
    if(!enemy.withinPlayerPerception) return;
    let shot = new Shot(playerCurrentPosition[0] + (player.width / 4), playerCurrentPosition[1] + (player.height / 4));
    shot.id = document.createElement('div');
    shot.id.className = 'shots';
    shot.id.style.left = `${shot.bottomLeft[0]}px`;
    shot.id.style.bottom = `${shot.bottomLeft[1]}px`;
    shots.push(shot);
    game.appendChild(shot.id);
    playerAutoFiring(shot, enemy);
    shotsFired = true;
    setTimeout(() => {
      shotsFired = false;
      console.log('reloaded')
    }, player.firingRate);
}

function playerAutoFiring(shot, enemy) {
    console.log(enemy, enemy.withinPlayerPerception)
    if(enemy.withinPlayerPerception === false) {
      console.log('no enemy in sight', enemy)
      let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
      shot.id.remove();
      if(index !== -1){
        shots.splice(index, 1);
      }
      return;
    }

    console.log('shot fired')

    // for(const enemy of enemiesWithinPerception){
    //   if(enemy.withinPlayerPerception === false) return;
    //   if(enemy.bottomLeft[0] < playerCurrentPosition[0] && enemy.bottomLeft[1] < playerCurrentPosition[1]){
    //     //links unten
    //   } else if(enemy.bottomLeft[0] < playerCurrentPosition[0] && enemy.bottomLeft[1] > playerCurrentPosition[1]){
    //     //links oben
    //   } else if(enemy.bottomLeft[0] > playerCurrentPosition[0] && enemy.bottomLeft[1] < playerCurrentPosition[1]){
    //     //rechts unten
    //   } else if(enemy.bottomLeft[0] > playerCurrentPosition[0] && enemy.bottomLeft[1] > playerCurrentPosition[1]){
    //     //rechts oben
    //   }
    // }
    console.log(enemy.attackDirection)
    if(enemy.attackDirection === 'right'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[0] += 10;
        drawShot(shot);
      }, 20);
    } else if(enemy.attackDirection === 'left'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[0] -= 10;
        drawShot(shot);
      }, 20);
    } else if(enemy.attackDirection === 'down'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[1] += 10;
        drawShot(shot);
      }, 20);
    } else if(enemy.attackDirection === 'up'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[1] -= 10;
        drawShot(shot);
      }, 20);
    } else if(enemy.attackDirection === 'topRight'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[1] += 10;
        shot.bottomLeft[0] += 10;
        drawShot(shot);
      }, 20);
    } else if(enemy.attackDirection === 'topLeft'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[1] += 10;
        shot.bottomLeft[0] -= 10;
        drawShot(shot);
      }, 20);
    } else if(enemy.attackDirection === 'bottomRight'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[1] -= 10;
        shot.bottomLeft[0] += 10;
        drawShot(shot);
      }, 20);
    } else if(enemy.attackDirection === 'bottomLeft'){
      shot.interval = setInterval(() => {
        shot.bottomLeft[1] -= 10;
        shot.bottomLeft[0] -= 10;
        drawShot(shot);
      }, 20);
    } else {
      let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
      shot.id.remove();
      if(index !== -1){
        shots.splice(index, 1);
      }
      return;
    }
}

function drawShot(shot) {
  shot.id.style.left = `${shot.bottomLeft[0]}px`;
  shot.id.style.bottom = `${shot.bottomLeft[1]}px`;
  shot.bottomRight = [shot.bottomLeft[0] + shot.width, shot.bottomLeft[1]];
  shot.topLeft = [shot.bottomLeft[0], shot.bottomLeft[1] + shot.height];
  shot.topRight = [shot.bottomLeft[0] + shot.width, shot.bottomLeft[1] + shot.height];
  shot.middle = [shot.bottomLeft[0] + (shot.width / 2), shot.bottomLeft[1] + (shot.height / 2)];
  for(const enemy of enemies){
    checkTargetHits(enemy, shot);
  }
}

// target hit collisions, check if an enemy is hit or not;
function checkTargetHits(enemy, shot) {
  if(shot.bottomLeft[0] > 2000 || shot.bottomLeft[0] < 0 || shot.bottomLeft[1] > 2000 || shot.bottomLeft[1] < 0){
    let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
    clearInterval(shot.interval);
    shot.id.remove();
    if(index !== -1){
      shots.splice(index, 1);
    }
    return;
  }

  if(shot.bottomLeft[0] > shot.startPosition[0] + shot.range || shot.bottomLeft[0] < shot.startPosition[0] - shot.range
    ||
    shot.bottomLeft[1] > shot.startPosition[1] + shot.range || shot.bottomLeft[1] < shot.startPosition[1] - shot.range
    ){
    let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
    clearInterval(shot.interval);
    shot.id.remove();
    if(index !== -1){
      shots.splice(index, 1);
    }
    return;
  }

  //logic if the enemies collide with the player fire;
  if((enemy.bottomRight[0] > shot.bottomLeft[0]
    &&
    (enemy.bottomLeft[0] < shot.bottomLeft[0]))
  &&
    (enemy.bottomLeft[1] < shot.bottomLeft[1]
      &&
      enemy.topLeft[1] > (shot.bottomLeft[1]))
    ) {
      console.log('shot collision bottomLeft')
      let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
      clearInterval(shot.interval);
      shot.id.remove();
      if(index !== -1){
        shots.splice(index, 1);
      }
      enemy.health -= player.damage;
      enemy.protection = true;
      setTimeout(() => {
        enemy.protection = false;
      }, 3000);
      if(enemy.health <= 0){
        killEnemy(enemy);
      };
      return;
  } else if((enemy.bottomLeft[0] < shot.topLeft[0]
    &&
    (enemy.bottomRight[0] > shot.topLeft[0]))
  &&
    (enemy.topLeft[1] > shot.topLeft[1]
    &&
    enemy.bottomLeft[1] < (shot.topLeft[1]))
    )  {
      console.log('shot collision topLeft')
      let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
      clearInterval(shot.interval);
      shot.id.remove();
      if(index !== -1){
        shots.splice(index, 1);
      }
      enemy.health -= player.damage;
      enemy.protection = true;
      setTimeout(() => {
        enemy.protection = false;
      }, 3000);
      if(enemy.health <= 0){
        killEnemy(enemy);
      };
      return;
  } else if((enemy.bottomLeft[0] < shot.topRight[0]
    &&
    (enemy.bottomRight[0] > shot.topRight[0]))
  &&
    (enemy.bottomLeft[1] < shot.topRight[1]
    &&
    enemy.topLeft[1] > shot.topRight[1])
    )  {
      console.log('shot collision topRight')
      let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
      clearInterval(shot.interval);
      shot.id.remove();
      if(index !== -1){
        shots.splice(index, 1);
      }
      enemy.health -= player.damage;
      enemy.protection = true;
      setTimeout(() => {
        enemy.protection = false;
      }, 3000);
      if(enemy.health <= 0){
        killEnemy(enemy);
      };
      return;
  } else if((enemy.bottomLeft[0] < shot.bottomRight[0]
    &&
    (enemy.bottomRight[0] > shot.bottomRight[0]))
  &&
    (enemy.bottomLeft[1] < shot.bottomRight[1]
    &&
    enemy.topLeft[1] > shot.bottomRight[1])
    )  {
      console.log('shot collision bottomRight')
      let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
      clearInterval(shot.interval);
      shot.id.remove();
      if(index !== -1){
        shots.splice(index, 1);
      }
      enemy.health -= player.damage;
      enemy.protection = true;
      setTimeout(() => {
        enemy.protection = false;
      }, 3000);
      if(enemy.health <= 0){
        killEnemy(enemy);
      };
      return;
  } else if((enemy.bottomLeft[0] < shot.middle[0]
    &&
    (enemy.bottomRight[0] > shot.middle[0]))
  &&
    ((enemy.bottomLeft[1] < shot.middle[1])
    &&
    (enemy.topLeft[1] > shot.middle[1]))
    ) {
      console.log('shot collision middle')
      let index = shots.findIndex((arrayShot) => arrayShot.id === shot.id);
      clearInterval(shot.interval);
      shot.id.remove();
      if(index !== -1){
        shots.splice(index, 1);
      }
      enemy.health -= player.damage;
      enemy.protection = true;
      setTimeout(() => {
        enemy.protection = false;
      }, 3000);
      if(enemy.health <= 0){
        killEnemy(enemy);
      };
      return;
  } else {
    return;
  }
}

//kill the enemy that gets hit by the player and its health is down to 0;
//count score for each kill the player makes;
// evaluate win or loss; check if limit reach or all enemies are gone;
function killEnemy(enemy){
  let index = enemies.findIndex((remainingEnemies) => remainingEnemies.id === enemy.id)
  if(index === -1) return;
  enemy.id.remove();
  clearInterval(enemy.interval);
  enemies.splice(index, 1);
  gameSettings.counter ++;
  gameSettings.highscore = gameSettings.counter;
  score.textContent = `Score: ${gameSettings.counter}`;

  if(enemies.length <= 0 || gameSettings.counter >= 500) {
    resetGame();
  } else {
    let enemy = new Enemy(randomSpawnPoint());
    enemy.id = document.createElement('div');
    enemy.id.className = 'enemy';
    enemies.push(enemy);
    drawEnemy(enemy);
    game.appendChild(enemy.id);
  }
  return;
}

// player spwan / start game with all necessary settings;
function spawnPlayer() {
  if(gameSwitch){
    shotsFired = false;
    player.id = document.createElement('div');
    player.currentPosition = playerStartPosition;
    player.direction = 'right';
    player.health = 100;
    playerHealth.style.width = '100px';
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
    player.checkSurroundings = () => {
      let checkingForEnemies = setInterval(() => {
        if(!gameSwitch){
          clearInterval(checkingForEnemies);
        }
        for(const enemy of enemies){
          getNearestEnemy(enemy);
        }
      }, player.firingRate);
    }

    for(let i = 0; i < enemieNumber; i++){
      enemies.push(new Enemy(randomSpawnPoint()));
    };
    dialog.close();
    gameSettings.counter = 0;
    score.textContent = `Score: ${gameSettings.counter}`;
    drawPlayer();
    spawnEnemy();
    gameInterval = setInterval(() => {
      getDistanceToPlayer();
    }, 500);
    player.lifeTime();
    player.checkSurroundings();
    game.appendChild(player.id);
  } else {
    dialog.showModal();
    return;
  }
}

spawnPlayer();

startBtn.addEventListener('click', () => {
  gameSwitch = true;
  spawnPlayer();
});

// Game over, show summary, reset all players and enemies and give option to restart the game.
function resetGame() {

  //game
  clearInterval(gameInterval);
  gameSwitch = false;

  //player
  player.id.remove();
  delete player.id;
  clearInterval(player.lifeTime);
  delete player.checkSurroundings;
  delete player.lifeTime;
  delete player.direction;

  //shots
  for(const shot of shots) {
    clearInterval(shot.interval);
    shot.id.remove();
  }
  shots = [];

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

function preventScroll(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function disableScroll() {
  document.addEventListener('wheel', preventScroll, {passive: false});
  document.addEventListener('touchmove', preventScroll, {passive: false});
}

disableScroll();
