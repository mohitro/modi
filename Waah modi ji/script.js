const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//  Resize canvas fullscreen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Images
const birdImg = document.getElementById("bird");
const pipeImg = document.getElementById("pipe");

// 🕹 Game variables
let birdX = 100;
let birdY = canvas.height / 2;
let birdWidth = 60;
let birdHeight = 45;
let gravity = 0.13;    
let jumpForce = -4;     
let velocity = 0;

let pipes = [];
let frame = 0;
let score = 0;
let gameRunning = false;  
let gameOver = false;

// 🎵 Music & Sound
let musicOn = true;
let soundOn = true;
const music = new Audio("./urtaa hee firu.mp3");
music.loop = true;
const flapSound = new Audio("./");
const deathSound = new Audio("./aag-meme-memes-memesdaily-gk-kashyap-1_hxEHJHnL.mp3"); 

//  Music toggle
document.getElementById("toggleMusic").addEventListener("click", () => {
  musicOn = !musicOn;
  document.getElementById("toggleMusic").textContent = `Music: ${musicOn ? "ON" : "OFF"}`;
  if (musicOn && gameRunning) music.play();
  else music.pause();
});

//  Sound toggle
document.getElementById("toggleSound").addEventListener("click", () => {
  soundOn = !soundOn;
  document.getElementById("toggleSound").textContent = `Sound: ${soundOn ? "ON" : "OFF"}`;
});

//  Reset game variables
function resetGame() {
  birdY = canvas.height / 2;
  velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  gameRunning = true;
  if (musicOn) {
    music.currentTime = 0;
    music.play(); 
  }
}


function drawBird() {
  ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
}


function drawPipes() {
  pipes.forEach((pipe) => {
    ctx.drawImage(pipeImg, pipe.x, pipe.top - pipeImg.height, pipe.width, pipeImg.height); 
    ctx.drawImage(pipeImg, pipe.x, pipe.top + pipe.gap, pipe.width, pipeImg.height); 
  });
}

 
function updatePipes() {
  if (frame % 120 === 0) {
    let top = Math.random() * (canvas.height / 2);
    pipes.push({
      x: canvas.width,
      width: 100,
      top: top + 100,
      gap: 350 
    });
  }
  pipes.forEach((pipe) => (pipe.x -= 2));

  if (pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
    score++;
  }
}

//  Collision detection
function detectCollision() {
  for (let pipe of pipes) {
    if (
      birdX + birdWidth > pipe.x &&
      birdX < pipe.x + pipe.width &&
      (birdY < pipe.top || birdY + birdHeight > pipe.top + pipe.gap)
    ) {
      endGame();
    }
  }
  if (birdY + birdHeight > canvas.height || birdY < 0) {
    endGame();
  }
}

//  End game
function endGame() {
  if (!gameOver) {
    gameOver = true;
    gameRunning = false;
    music.pause(); 
    if (soundOn) {
      deathSound.currentTime = 0;
      deathSound.play(); 
    }
  }
}

// 🎮 Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameRunning && !gameOver) {
    velocity += gravity;
    birdY += velocity;
    updatePipes();
    detectCollision();
    frame++;
  } else if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 120, canvas.height / 2 - 20);
    ctx.font = "24px Arial";
    ctx.fillText("press space Mohit ka game ", canvas.width / 2 - 150, canvas.height / 2 + 30);
  } else {
    // Before start
    ctx.fillStyle = "#fff";
    ctx.font = "28px Arial";
    ctx.fillText("Press Space mohit ka game", canvas.width / 2 - 130, canvas.height / 2);
  }

  drawPipes();
  drawBird();
  document.getElementById("score").textContent = `Score: ${score}`;
  requestAnimationFrame(gameLoop);
}

//  Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameRunning && !gameOver) {
      // Start game first time
      gameRunning = true;
      if (musicOn) music.play();
    } else if (gameOver) {
      resetGame();
    } else {
      velocity = jumpForce;
      if (soundOn) {
        flapSound.currentTime = 0;
        flapSound.play();
      }
    }
  }
});

// Start loop
gameLoop();
