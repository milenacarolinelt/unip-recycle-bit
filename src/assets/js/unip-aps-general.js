import Grid from "./classes/Grid.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import SoundEffects from "./classes/SoundEffects.js";
import Star from "./classes/Star.js";
import { GameState, NUMBER_STARS } from "../../utils/constants.js";

const El = {
  canvas: document.querySelector("canvas"),
  startScreen: document.querySelector(".start-screen"),
  accessScreen: document.querySelector(".access-screen"),
  registerScreen: document.querySelector(".register-screen"),
  gameOverScreen: document.querySelector(".game-over"),
  scoreUi: document.querySelector(".score-ui"),
  scoreElement: document.querySelector(".score-ui .score > span"),
  levelElement: document.querySelector(".score-ui .level > span"),
  highElement: document.querySelector(".score-ui .high > span"),
  buttonPlay: document.querySelector(".button-play"),
  buttonRestart: document.querySelector(".button-restart"),
};

const Methods = {
  init() {
    El.startScreen.remove();
    El.accessScreen.remove();
    El.gameOverScreen.remove();
    globalThis.ctx = El.canvas.getContext("2d");
    El.canvas.width = innerWidth;
    El.canvas.height = innerHeight;
    globalThis.ctx.imageSmoothingEnabled = false;

    globalThis.currentState = GameState.START;
    globalThis.gameData = {
      score: 0,
      level: 1,
      high: 0,
    };

    globalThis.soundEffects = new SoundEffects();
    globalThis.player = new Player(El.canvas.width, El.canvas.height);
    globalThis.stars = [];
    globalThis.playerProjectiles = [];
    globalThis.invadersProjectiles = [];
    globalThis.particles = [];
    globalThis.obstacles = [];

    Methods.initObstacles();

    globalThis.grid = new Grid(
      Math.round(Math.random() * 9 + 1),
      Math.round(Math.random() * 9 + 1),
    );

    globalThis.keys = {
      left: false,
      right: false,
      shoot: {
        pressed: false,
        released: true,
      },
    };

    addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (key === "a") keys.left = true;
      if (key === "d") keys.right = true;
      if (key === "enter") keys.shoot.pressed = true;
    });

    addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();

      if (key === "a") keys.left = false;
      if (key === "d") keys.right = false;
      if (key === "enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
      }
    });

    addEventListener("resize", (event) => {
      El.canvas.width = innerWidth;
      El.canvas.height = innerHeight;
    });

    El.buttonPlay.addEventListener("click", () => {
      El.startScreen.remove();
      El.scoreUi.style.display = "block";
      globalThis.currentState = GameState.PLAYING;

      setInterval(() => {
        const invader = globalThis.grid.getRandomInvader();

        if (invader) {
          invader.shoot(globalThis.invadersProjectiles);
        }
      }, 1000);
    });

    El.buttonRestart.addEventListener("click", Methods.restartGame);

    Methods.generateStars();
    Methods.gameLoop();
  },

  showGameData() {
    El.scoreElement.textContent = globalThis.gameData.score;
    El.levelElement.textContent = globalThis.gameData.level;
    El.highElement.textContent = globalThis.gameData.high;
  },

  initObstacles() {
    const x = El.canvas.width / 2 - 50;
    const y = El.canvas.height - 250;
    const offset = El.canvas.width * 0.15;
    const color = "crimson";

    const obstacle1 = new Obstacle({ x: x - offset, y }, 100, 20, color);
    const obstacle2 = new Obstacle({ x: x + offset, y }, 100, 20, color);

    globalThis.obstacles.push(obstacle1);
    globalThis.obstacles.push(obstacle2);
  },

  incrementScore(value) {
    globalThis.gameData.score += value;

    if (globalThis.gameData.score > globalThis.gameData.high) {
      globalThis.gameData.high = globalThis.gameData.score;
    }
  },

  incrementLevel() {
    gameData.level += 1;
  },

  generateStars() {
    for (let i = 0; i < NUMBER_STARS; i += 1) {
      globalThis.stars.push(new Star(El.canvas.width, El.canvas.height));
    }
  },

  drawStars() {
    globalThis.stars.forEach((star) => {
      star.draw(globalThis.ctx);
      star.update();
    });
  },

  drawProjectiles() {
    const projectiles = [
      ...globalThis.playerProjectiles,
      ...globalThis.invadersProjectiles,
    ];

    projectiles.forEach((projectile) => {
      projectile.draw(globalThis.ctx);
      projectile.update();
    });
  },

  drawParticles() {
    globalThis.particles.forEach((particle) => {
      particle.draw(globalThis.ctx);
      particle.update();
    });
  },

  drawObstacles() {
    globalThis.obstacles.forEach((obstacle) => obstacle.draw(globalThis.ctx));
  },

  clearProjectiles() {
    globalThis.playerProjectiles.forEach((projectile, i) => {
      if (projectile.position.y <= 0) {
        globalThis.playerProjectiles.splice(i, 1);
      }
    });

    globalThis.invadersProjectiles.forEach((projectile, i) => {
      if (projectile.position.y > El.canvas.height) {
        globalThis.invadersProjectiles.splice(i, 1);
      }
    });
  },

  clearParticles() {
    globalThis.particles.forEach((particle, i) => {
      if (particle.opacity <= 0) {
        globalThis.particles.splice(i, 1);
      }
    });
  },

  createExplosion(position, size, color) {
    for (let i = 0; i < size; i += 1) {
      const particle = new Particle(
        {
          x: position.x,
          y: position.y,
        },
        {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5,
        },
        2,
        color,
      );

      globalThis.particles.push(particle);
    }
  },

  checkShootInvaders() {
    globalThis.grid.invaders.forEach((invader, invaderIndex) => {
      globalThis.playerProjectiles.some((projectile, projectileIndex) => {
        if (invader.hit(projectile)) {
          globalThis.soundEffects.playHitSound();

          Methods.createExplosion(
            {
              x: invader.position.x + invader.width / 2,
              y: invader.position.y + invader.height / 2,
            },
            10,
            "#941CFF",
          );

          Methods.incrementScore(10);

          globalThis.grid.invaders.splice(invaderIndex, 1);
          globalThis.playerProjectiles.splice(projectileIndex, 1);

          return;
        }
      });
    });
  },

  showGameOverScreen() {
    document.body.append(El.gameOverScreen);
    El.gameOverScreen.classList.add("zoom-animation");
  },

  gameOver() {
    Methods.createExplosion(
      {
        x: globalThis.player.position.x + globalThis.player.width / 2,
        y: globalThis.player.position.y + globalThis.player.height / 2,
      },
      10,
      "white",
    );

    Methods.createExplosion(
      {
        x: globalThis.player.position.x + globalThis.player.width / 2,
        y: globalThis.player.position.y + globalThis.player.height / 2,
      },
      5,
      "#4D9BE6",
    );

    Methods.createExplosion(
      {
        x: globalThis.player.position.x + globalThis.player.width / 2,
        y: globalThis.player.position.y + globalThis.player.height / 2,
      },
      5,
      "crimson",
    );

    globalThis.player.alive = false;
    globalThis.currentState = GameState.GAME_OVER;
    Methods.showGameOverScreen();
  },

  checkShootPlayer() {
    globalThis.invadersProjectiles.some((projectile, index) => {
      if (globalThis.player.hit(projectile)) {
        globalThis.soundEffects.playExplosionSound();
        globalThis.invadersProjectiles.splice(index, 1);

        Methods.gameOver();
      }
    });
  },

  checkShootObstacles() {
    globalThis.obstacles.forEach((obstacle) => {
      globalThis.playerProjectiles.some((projectile, index) => {
        if (obstacle.hit(projectile)) {
          globalThis.playerProjectiles.splice(index, 1);
          return;
        }
      });

      globalThis.invadersProjectiles.some((projectile, index) => {
        if (obstacle.hit(projectile)) {
          globalThis.invadersProjectiles.splice(index, 1);
          return;
        }
      });
    });
  },

  checkInvadersCollidedObstacles() {
    globalThis.obstacles.forEach((obstacle, i) => {
      globalThis.grid.invaders.some((invader) => {
        if (invader.collided(obstacle)) {
          globalThis.obstacles.splice(i, 1);
        }
      });
    });
  },

  checkPlayerCollidedInvaders() {
    globalThis.grid.invaders.some((invader) => {
      if (
        invader.position.x >= globalThis.player.position.x &&
        invader.position.x <=
          globalThis.player.position.x + globalThis.player.width &&
        invader.position.y >= globalThis.player.position.y
      ) {
        Methods.gameOver();
      }
    });
  },

  spawnGrid() {
    if (globalThis.grid.invaders.length === 0) {
      globalThis.soundEffects.playNextLevelSound();

      globalThis.grid.rows = Math.round(Math.random() * 9 + 1);
      globalThis.grid.cols = Math.round(Math.random() * 9 + 1);
      globalThis.grid.restart();

      Methods.incrementLevel();

      if (globalThis.obstacles.length === 0) {
        Methods.initObstacles();
      }
    }
  },

  gameLoop() {
    globalThis.ctx.clearRect(0, 0, El.canvas.width, El.canvas.height);

    Methods.drawStars();

    if (globalThis.currentState === GameState.PLAYING) {
      Methods.showGameData();
      Methods.spawnGrid();

      Methods.drawProjectiles();
      Methods.drawParticles();
      Methods.drawObstacles();

      Methods.clearProjectiles();
      Methods.clearParticles();

      Methods.checkShootInvaders();
      Methods.checkShootPlayer();
      Methods.checkShootObstacles();
      Methods.checkInvadersCollidedObstacles();
      Methods.checkPlayerCollidedInvaders();

      globalThis.grid.draw(globalThis.ctx);
      globalThis.grid.update(globalThis.player.alive);

      globalThis.ctx.save();

      globalThis.ctx.translate(
        globalThis.player.position.x + globalThis.player.width / 2,
        globalThis.player.position.y + globalThis.player.height / 2,
      );

      if (globalThis.keys.shoot.pressed && globalThis.keys.shoot.released) {
        globalThis.soundEffects.playShootSound();
        globalThis.player.shoot(globalThis.playerProjectiles);
        globalThis.keys.shoot.released = false;
      }

      if (globalThis.keys.left && globalThis.player.position.x >= 0) {
        globalThis.player.moveLeft();
        globalThis.ctx.rotate(-0.15);
      }

      if (
        globalThis.keys.right &&
        globalThis.player.position.x <=
          El.canvas.width - globalThis.player.width
      ) {
        globalThis.player.moveRight();
        globalThis.ctx.rotate(0.15);
      }

      globalThis.ctx.translate(
        -globalThis.player.position.x - globalThis.player.width / 2,
        -globalThis.player.position.y - globalThis.player.height / 2,
      );

      globalThis.player.draw(globalThis.ctx);
      globalThis.ctx.restore();
    }

    if (globalThis.currentState === GameState.GAME_OVER) {
      Methods.checkShootObstacles();

      Methods.drawProjectiles();
      Methods.drawParticles();
      Methods.drawObstacles();

      Methods.clearProjectiles();
      Methods.clearParticles();

      globalThis.grid.draw(globalThis.ctx);
      globalThis.grid.update(globalThis.player.alive);
    }

    requestAnimationFrame(Methods.gameLoop);
  },

  restartGame() {
    globalThis.currentState = GameState.PLAYING;

    globalThis.player.alive = true;

    globalThis.grid.invaders.length = 0;
    globalThis.grid.invadersVelocity = 1;

    globalThis.invadersProjectiles.length = 0;
    globalThis.gameData.score = 0;
    globalThis.gameData.level = 0;

    El.gameOverScreen.remove();
  },
};

globalThis.addEventListener("DOMContentLoaded", Methods.init);
