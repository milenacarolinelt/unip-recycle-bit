(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Invader = require("./Invader.js");

var _Invader2 = _interopRequireDefault(_Invader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = function () {
    function Grid(rows, cols) {
        _classCallCheck(this, Grid);

        this.rows = rows;
        this.cols = cols;
        this.direction = "right";
        this.moveDown = false;
        this.boost = 0.1;
        this.invadersVelocity = 1;

        this.invaders = this.init();
    }

    _createClass(Grid, [{
        key: "init",
        value: function init() {
            var array = [];

            for (var row = 0; row < this.rows; row += 1) {
                for (var col = 0; col < this.cols; col += 1) {
                    var invader = new _Invader2.default({
                        x: col * 50 + 20,
                        y: row * 37 + 120
                    }, this.invadersVelocity);

                    array.push(invader);
                }
            }

            return array;
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            this.invaders.forEach(function (invader) {
                return invader.draw(ctx);
            });
        }
    }, {
        key: "update",
        value: function update(playerStatus) {
            var _this = this;

            if (this.reachedRightBoundary()) {
                this.direction = "left";
                this.moveDown = true;
            } else if (this.reachedLeftBoundary()) {
                this.direction = "right";
                this.moveDown = true;
            }

            if (!playerStatus) this.moveDown = false;

            this.invaders.forEach(function (invader) {
                if (_this.moveDown) {
                    invader.moveDown();
                    invader.incrementVelocity(_this.boost);
                    _this.invadersVelocity = invader.velocity;
                }

                if (_this.direction === "right") invader.moveRight();
                if (_this.direction === "left") invader.moveLeft();
            });

            this.moveDown = false;
        }
    }, {
        key: "reachedRightBoundary",
        value: function reachedRightBoundary() {
            return this.invaders.some(function (invader) {
                return invader.position.x + invader.width >= innerWidth;
            });
        }
    }, {
        key: "reachedLeftBoundary",
        value: function reachedLeftBoundary() {
            return this.invaders.some(function (invader) {
                return invader.position.x <= 0;
            });
        }
    }, {
        key: "getRandomInvader",
        value: function getRandomInvader() {
            var index = Math.floor(Math.random() * this.invaders.length);
            return this.invaders[index];
        }
    }, {
        key: "restart",
        value: function restart() {
            this.invaders = this.init();
            this.direction = "right";
        }
    }]);

    return Grid;
}();

exports.default = Grid;

},{"./Invader.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require("../../../utils/constants.js");

var _Projectile = require("./Projectile.js");

var _Projectile2 = _interopRequireDefault(_Projectile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Invader = function () {
    function Invader(position, velocity) {
        _classCallCheck(this, Invader);

        this.position = position;
        this.scale = 0.8;
        this.width = 50 * this.scale;
        this.height = 37 * this.scale;
        this.velocity = velocity;

        this.image = this.getImage(_constants.PATH_INVADER_IMAGE);
    }

    _createClass(Invader, [{
        key: "moveRight",
        value: function moveRight() {
            this.position.x += this.velocity;
        }
    }, {
        key: "moveLeft",
        value: function moveLeft() {
            this.position.x -= this.velocity;
        }
    }, {
        key: "moveDown",
        value: function moveDown() {
            this.position.y += this.height;
        }
    }, {
        key: "incrementVelocity",
        value: function incrementVelocity(boost) {
            this.velocity += boost;
        }
    }, {
        key: "getImage",
        value: function getImage(path) {
            var image = new Image();
            image.src = path;
            return image;
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }, {
        key: "shoot",
        value: function shoot(projectiles) {
            var p = new _Projectile2.default({
                x: this.position.x + this.width / 2 - 2,
                y: this.position.y + this.height
            }, 10);
            projectiles.push(p);
        }
    }, {
        key: "hit",
        value: function hit(projectile) {
            return projectile.position.x >= this.position.x && projectile.position.x <= this.position.x + this.width && projectile.position.y >= this.position.y && projectile.position.y <= this.position.y + this.height;
        }
    }, {
        key: "collided",
        value: function collided(obstacle) {
            return obstacle.position.x >= this.position.x && obstacle.position.x <= this.position.x + this.width && obstacle.position.y >= this.position.y && obstacle.position.y <= this.position.y + this.height || obstacle.position.x + obstacle.width >= this.position.x && obstacle.position.x <= this.position.x && obstacle.position.y >= this.position.y && obstacle.position.y <= this.position.y + this.height;
        }
    }]);

    return Invader;
}();

exports.default = Invader;

},{"../../../utils/constants.js":10,"./Projectile.js":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Particle = function () {
    function Particle(position, velocity, radius, color) {
        _classCallCheck(this, Particle);

        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
    }

    _createClass(Particle, [{
        key: "draw",
        value: function draw(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha = this.opacity;
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }, {
        key: "update",
        value: function update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            this.opacity = this.opacity - 0.008 <= 0 ? 0 : this.opacity - 0.008;
        }
    }]);

    return Particle;
}();

exports.default = Particle;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require("../../../utils/constants.js");

var _Projectile = require("./Projectile.js");

var _Projectile2 = _interopRequireDefault(_Projectile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(canvasWidth, canvasHeight) {
        _classCallCheck(this, Player);

        this.alive = true;
        this.width = 34 * 2;
        this.height = 34 * 2;
        this.velocity = 5;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
            arrowY: canvasHeight - this.height + 20,
            leftX: 0,
            rightX: canvasWidth
        };

        console.log(this.position);

        this.image = this.getImage(_constants.PATH_GARBAGE_IMAGE);
        this.engineImage = this.getImage(_constants.PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(_constants.PATH_ENGINE_SPRITES);
        this.arrowLeft = this.getImage(_constants.PATH_ARROWLEFT_IMAGE);
        this.arrowRight = this.getImage(_constants.PATH_ARROWRIGHT_IMAGE);

        this.sx = 0;
        this.framesCounter = _constants.INITIAL_FRAMES;
    }

    _createClass(Player, [{
        key: "moveLeft",
        value: function moveLeft() {
            this.position.x -= this.velocity;
        }
    }, {
        key: "moveRight",
        value: function moveRight() {
            this.position.x += this.velocity;
        }
    }, {
        key: "getImage",
        value: function getImage(path) {
            var image = new Image();
            image.src = path;
            return image;
        }
    }, {
        key: "draw",
        value: function draw(ctx) {
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

            // ctx.drawImage(
            //     this.arrowLeft,
            //     this.position.leftX,
            //     this.position.arrowY,
            //     80,
            //     80
            // );

            // ctx.drawImage(
            //     this.arrowRight,
            //     this.position.rightX - 80,
            //     this.position.arrowY,
            //     80,
            //     80
            // );

            // ctx.drawImage(
            //     this.engineSprites,
            //     this.sx,
            //     0,
            //     48,
            //     48,
            //     this.position.x,
            //     this.position.y + 10,
            //     this.width,
            //     this.height
            // );

            // ctx.drawImage(
            //     this.engineImage,
            //     this.position.x,
            //     this.position.y + 8,
            //     this.width,
            //     this.height
            // );

            this.update();
        }
    }, {
        key: "update",
        value: function update() {
            if (this.framesCounter === 0) {
                this.sx = this.sx === 96 ? 0 : this.sx + 48;
                this.framesCounter = _constants.INITIAL_FRAMES;
            }

            this.framesCounter--;
        }
    }, {
        key: "shoot",
        value: function shoot(projectiles) {
            var p = new _Projectile2.default({
                x: this.position.x + this.width / 2 - 2,
                y: this.position.y + 2
            }, -10);

            projectiles.push(p);
        }
    }, {
        key: "hit",
        value: function hit(projectile) {
            return projectile.position.x >= this.position.x + 20 && projectile.position.x <= this.position.x + 20 + this.width - 38 && projectile.position.y + projectile.height >= this.position.y + 22 && projectile.position.y + projectile.height <= this.position.y + 22 + this.height - 34;
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../../../utils/constants.js":10,"./Projectile.js":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Projectile = function () {
    function Projectile(position, velocity) {
        _classCallCheck(this, Projectile);

        this.position = position;
        this.width = 2;
        this.height = 20;
        this.velocity = velocity;
    }

    _createClass(Projectile, [{
        key: "draw",
        value: function draw(ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }, {
        key: "update",
        value: function update() {
            this.position.y += this.velocity;
        }
    }]);

    return Projectile;
}();

exports.default = Projectile;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoundEffects = function () {
    function SoundEffects() {
        _classCallCheck(this, SoundEffects);

        this.shootSounds = [new Audio("/audios/shoot.mp3"), new Audio("/audios/shoot.mp3"), new Audio("/audios/shoot.mp3"), new Audio("/audios/shoot.mp3"), new Audio("/audios/shoot.mp3")];

        this.hitSounds = [new Audio("/audios/hit.mp3"), new Audio("/audios/hit.mp3"), new Audio("/audios/hit.mp3"), new Audio("/audios/hit.mp3"), new Audio("/audios/hit.mp3")];

        this.explosionSound = new Audio("/audios/explosion.mp3");
        this.nextLevelSound = new Audio("/audios/next_level.mp3");
        this.gameStartSound = new Audio("/audios/game_start.mp3");

        this.currentShootSound = 0;
        this.currentHitSound = 0;

        this.adjustVolumes();
    }

    _createClass(SoundEffects, [{
        key: "playShootSound",
        value: function playShootSound() {
            this.shootSounds[this.currentShootSound].currentTime = 0;
            this.shootSounds[this.currentShootSound].play();
            this.currentShootSound = (this.currentShootSound + 1) % this.shootSounds.length;
        }
    }, {
        key: "playHitSound",
        value: function playHitSound() {
            this.hitSounds[this.currentHitSound].currentTime = 0;
            this.hitSounds[this.currentHitSound].play();
            this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length;
        }
    }, {
        key: "playExplosionSound",
        value: function playExplosionSound() {
            this.explosionSound.play();
        }
    }, {
        key: "playNextLevelSound",
        value: function playNextLevelSound() {
            this.nextLevelSound.play();
        }
    }, {
        key: "playGameStartSound",
        value: function playGameStartSound() {
            this.gameStartSound.play();
        }
    }, {
        key: "adjustVolumes",
        value: function adjustVolumes() {
            this.hitSounds.forEach(function (sound) {
                return sound.volume = 0.2;
            });
            this.shootSounds.forEach(function (sound) {
                return sound.volume = 0.5;
            });
            this.explosionSound.volume = 0.2;
            this.nextLevelSound.volume = 0.4;
            this.gameStartSound.volume = 0.4;
        }
    }]);

    return SoundEffects;
}();

exports.default = SoundEffects;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Star = function () {
    function Star(canvasWidth, canvasHeight) {
        _classCallCheck(this, Star);

        this.position = {
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight
        };

        this.radius = Math.random() * 1 + 0.3;
        this.velocity = (Math.random() * 0.4 + 0.1) * this.radius;

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.color = "white";
    }

    _createClass(Star, [{
        key: "draw",
        value: function draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }, {
        key: "update",
        value: function update() {
            if (this.position.y > this.canvasHeight + this.radius) {
                this.position.y = -this.radius;
                this.position.x = Math.random() * this.canvasWidth;
                this.velocity = (Math.random() * 0.4 + 0.1) * this.radius;
            }

            this.position.y += this.velocity;
        }
    }]);

    return Star;
}();

exports.default = Star;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trash = function () {
  function Trash(canvasWidth) {
    _classCallCheck(this, Trash);

    this.x = Math.random() * canvasWidth;

    // começa acima da tela
    this.y = -50;

    this.size = 20 + Math.random() * 40;

    // velocidade aleatória
    this.speed = 2 + Math.random() * 4;

    this.color = "hsl(" + Math.random() * 360 + ", 80%, 50%)";
  }

  _createClass(Trash, [{
    key: "init",
    value: function init() {
      var array = [];

      for (var row = 0; row < this.rows; row += 1) {
        for (var col = 0; col < this.cols; col += 1) {
          var invader = new Invader({
            x: col * 50 + 20,
            y: row * 37 + 120
          }, this.invadersVelocity);

          array.push(invader);
        }
      }

      return array;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, {
    key: "update",
    value: function update() {
      this.y += this.speed;
    }
  }]);

  return Trash;
}();

exports.default = Trash;

},{}],9:[function(require,module,exports){
"use strict";

var _Grid = require("./classes/Grid.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _Particle = require("./classes/Particle.js");

var _Particle2 = _interopRequireDefault(_Particle);

var _Player = require("./classes/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _SoundEffects = require("./classes/SoundEffects.js");

var _SoundEffects2 = _interopRequireDefault(_SoundEffects);

var _Star = require("./classes/Star.js");

var _Star2 = _interopRequireDefault(_Star);

var _Trash = require("./classes/Trash.js");

var _Trash2 = _interopRequireDefault(_Trash);

var _constants = require("../../utils/constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var El = {
  canvas: document.querySelector("canvas"),
  timer: document.querySelector("#score-timer"),
  gameScreen: document.querySelector(".game-screen"),
  startScreen: document.querySelector(".start-screen"),
  accessScreen: document.querySelector(".access-screen"),
  registerScreen: document.querySelector(".register-screen"),
  configScreen: document.querySelector(".config-screen"),
  battleScreen: document.querySelector(".battle-screen"),
  gameOverScreen: document.querySelector(".game-over"),
  scoreUi: document.querySelector(".score-ui"),
  scoreElement: document.querySelector(".score-ui .score > span"),
  levelElement: document.querySelector(".score-ui .level > span"),
  highElement: document.querySelector(".score-ui .high > span"),
  buttonPlay: document.querySelector(".button-play-game"),
  buttonMyUser: document.querySelector(".button-my-user"),
  buttonInitBattle: document.querySelector(".button-init-battle"),
  buttonConfig: document.querySelector(".button-configurations"),
  buttonRestart: document.querySelector(".button-restart"),
  buttonRedirectRegister: document.querySelector("#redirect-register-button"),
  buttonRedirectAccess: document.querySelector("#redirect-access-button"),
  buttonBackMenu: document.querySelectorAll(".back-menu"),
  buttonLeft: document.querySelector("#arrow-left"),
  buttonRight: document.querySelector("#arrow-right")
};

var Methods = {
  init: function init() {
    El.gameScreen.classList.add("hide");
    El.accessScreen.classList.add("hide");
    El.registerScreen.classList.add("hide");
    El.gameOverScreen.classList.add("hide");
    El.configScreen.classList.add("hide");
    El.battleScreen.classList.add("hide");
    globalThis.ctx = El.canvas.getContext("2d");
    El.canvas.width = innerWidth;
    El.canvas.height = innerHeight;
    globalThis.ctx.imageSmoothingEnabled = false;

    globalThis.currentState = _constants.GameState.START;
    globalThis.gameData = {
      score: 0,
      level: 1,
      high: 0
    };

    globalThis.soundEffects = new _SoundEffects2.default();
    globalThis.player = new _Player2.default(El.canvas.width, El.canvas.height);
    globalThis.stars = [];
    globalThis.playerProjectiles = [];
    globalThis.invadersProjectiles = [];
    globalThis.particles = [];
    globalThis.obstacles = [];
    globalThis.trash = [];

    globalThis.grid = new _Grid2.default(1, Math.round(Math.random() * 9 + 1));

    globalThis.keys = {
      left: false,
      right: false,
      shoot: {
        pressed: false,
        released: true
      }
    };

    addEventListener("resize", function (event) {
      El.canvas.width = innerWidth;
      El.canvas.height = innerHeight;
    });

    El.buttonPlay.addEventListener("click", function () {
      El.startScreen.classList.add("hide");
      El.gameScreen.classList.remove("hide");
      El.scoreUi.style.display = "block";
      globalThis.currentState = _constants.GameState.PLAYING;

      globalThis.soundEffects.playGameStartSound();
      El.canvas.classList.add("game-start");
      var duration = 60 * 5; // Converter para segundos
      var display = document.querySelector("#score-timer"); // selecionando o timer
      Methods.startTimer(duration, display); // iniciando o timer
      globalThis.trashInterval = setInterval(function () {
        globalThis.trash.push(new _Trash2.default(El.canvas.width));
      }, 1000);
    });

    El.buttonConfig.addEventListener("click", function () {
      El.startScreen.classList.add("hide");
      El.configScreen.classList.remove("hide");
    });

    El.buttonInitBattle.addEventListener("click", function () {
      El.startScreen.classList.add("hide");
      El.battleScreen.classList.remove("hide");
    });

    El.buttonMyUser.addEventListener("click", function () {
      El.startScreen.classList.add("hide");
      El.accessScreen.classList.remove("hide");
    });

    El.buttonRedirectRegister.addEventListener("click", function () {
      El.startScreen.classList.add("hide");
      El.accessScreen.classList.add("hide");
      El.registerScreen.classList.remove("hide");
    });

    El.buttonRedirectAccess.addEventListener("click", function () {
      El.startScreen.classList.add("hide");
      El.registerScreen.classList.add("hide");
      El.accessScreen.classList.remove("hide");
    });

    [].concat(_toConsumableArray(El.buttonBackMenu)).forEach(function (backButton) {
      backButton.addEventListener("click", function () {
        El.startScreen.classList.remove("hide");
        El.registerScreen.classList.add("hide");
        El.battleScreen.classList.add("hide");
        El.accessScreen.classList.add("hide");
      });
    });

    El.buttonRestart.addEventListener("click", Methods.restartGame);
    Methods.controlActions();
    Methods.generateStars();
    Methods.gameLoop();
  },
  startTimer: function startTimer(duration, display) {
    var timer = duration,
        minutes = void 0,
        seconds = void 0;
    setInterval(function () {
      minutes = Number.parseInt(timer / 60, 10);
      seconds = Number.parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      display.textContent = minutes + ":" + seconds;
      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  },
  controlActions: function controlActions() {
    addEventListener("keydown", function (event) {
      if (!event.key) return;
      var key = event.key.toLowerCase();

      if (key === "a") globalThis.keys.left = true;
      if (key === "d") globalThis.keys.right = true;
      if (key === "enter") globalThis.keys.shoot.pressed = true;
    });

    addEventListener("keyup", function (event) {
      if (!event.key) return;
      var key = event.key.toLowerCase();

      if (key === "a") globalThis.keys.left = false;
      if (key === "d") globalThis.keys.right = false;
      if (key === "enter") {
        globalThis.keys.shoot.pressed = false;
        globalThis.keys.shoot.released = true;
      }
    });

    El.buttonLeft.addEventListener("click", function () {
      globalThis.keys.left = true;

      setTimeout(function () {
        globalThis.keys.left = false;
      }, 100);
    });

    El.buttonLeft.addEventListener("pointerdown", function () {
      globalThis.keys.left = true;
    });

    El.buttonLeft.addEventListener("pointerup", function () {
      globalThis.keys.left = false;
    });

    El.buttonLeft.addEventListener("pointerleave", function () {
      globalThis.keys.left = false;
    });

    El.buttonLeft.addEventListener("pointercancel", function () {
      globalThis.keys.left = false;
    });

    El.buttonRight.addEventListener("click", function () {
      globalThis.keys.right = true;

      setTimeout(function () {
        globalThis.keys.right = false;
      }, 100);
    });

    El.buttonRight.addEventListener("pointerdown", function () {
      globalThis.keys.right = true;
    });

    El.buttonRight.addEventListener("pointerup", function () {
      globalThis.keys.right = false;
    });

    El.buttonRight.addEventListener("pointerleave", function () {
      globalThis.keys.right = false;
    });

    El.buttonRight.addEventListener("pointercancel", function () {
      globalThis.keys.right = false;
    });
  },
  showGameData: function showGameData() {
    El.scoreElement.textContent = globalThis.gameData.score;
  },
  incrementScore: function incrementScore(value) {
    globalThis.gameData.score += value;

    if (globalThis.gameData.score > globalThis.gameData.high) {
      globalThis.gameData.high = globalThis.gameData.score;
    }
  },
  incrementLevel: function incrementLevel() {
    gameData.level += 1;
  },
  generateStars: function generateStars() {
    for (var i = 0; i < _constants.NUMBER_STARS; i += 1) {
      globalThis.stars.push(new _Star2.default(El.canvas.width, El.canvas.height));
    }
  },
  drawStars: function drawStars() {
    globalThis.stars.forEach(function (star) {
      star.draw(globalThis.ctx);
      star.update();
    });
  },
  drawProjectiles: function drawProjectiles() {
    var projectiles = [].concat(_toConsumableArray(globalThis.playerProjectiles), _toConsumableArray(globalThis.invadersProjectiles));

    projectiles.forEach(function (projectile) {
      projectile.draw(globalThis.ctx);
      projectile.update();
    });
  },
  drawParticles: function drawParticles() {
    globalThis.particles.forEach(function (particle) {
      particle.draw(globalThis.ctx);
      particle.update();
    });
  },
  drawObstacles: function drawObstacles() {
    globalThis.obstacles.forEach(function (obstacle) {
      return obstacle.draw(globalThis.ctx);
    });
  },
  clearStars: function clearStars() {
    globalThis.stars.forEach(function (star, i) {
      if (star.opacity <= 0) {
        globalThis.stars.splice(i, 1);
      }
    });
  },
  clearProjectiles: function clearProjectiles() {
    globalThis.playerProjectiles.forEach(function (projectile, i) {
      if (projectile.position.y <= 0) {
        globalThis.playerProjectiles.splice(i, 1);
      }
    });

    globalThis.invadersProjectiles.forEach(function (projectile, i) {
      if (projectile.position.y > El.canvas.height) {
        globalThis.invadersProjectiles.splice(i, 1);
      }
    });
  },
  clearParticles: function clearParticles() {
    globalThis.particles.forEach(function (particle, i) {
      if (particle.opacity <= 0) {
        globalThis.particles.splice(i, 1);
      }
    });
  },
  createExplosion: function createExplosion(position, size, color) {
    for (var i = 0; i < size; i += 1) {
      var particle = new _Particle2.default({
        x: position.x,
        y: position.y
      }, {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5
      }, 2, color);

      globalThis.particles.push(particle);
    }
  },
  checkShootInvaders: function checkShootInvaders() {
    globalThis.grid.invaders.forEach(function (invader, invaderIndex) {
      globalThis.playerProjectiles.some(function (projectile, projectileIndex) {
        if (invader.hit(projectile)) {
          globalThis.soundEffects.playHitSound();
          Methods.createExplosion({
            x: invader.position.x + invader.width / 2,
            y: invader.position.y + invader.height / 2
          }, 10, "#941CFF");
          Methods.incrementScore(10);
          globalThis.grid.invaders.splice(invaderIndex, 1);
          globalThis.playerProjectiles.splice(projectileIndex, 1);
          return;
        }
      });
    });
  },
  showGameOverScreen: function showGameOverScreen() {
    El.gameOverScreen.classList.remove("hide");
    El.gameOverScreen.classList.add("zoom-animation");
  },
  gameOver: function gameOver() {
    Methods.createExplosion({
      x: globalThis.player.position.x + globalThis.player.width / 2,
      y: globalThis.player.position.y + globalThis.player.height / 2
    }, 10, "white");

    Methods.createExplosion({
      x: globalThis.player.position.x + globalThis.player.width / 2,
      y: globalThis.player.position.y + globalThis.player.height / 2
    }, 5, "#4D9BE6");

    Methods.createExplosion({
      x: globalThis.player.position.x + globalThis.player.width / 2,
      y: globalThis.player.position.y + globalThis.player.height / 2
    }, 5, "crimson");

    globalThis.player.alive = false;
    globalThis.currentState = _constants.GameState.GAME_OVER;
    Methods.showGameOverScreen();
  },
  checkShootPlayer: function checkShootPlayer() {
    globalThis.invadersProjectiles.some(function (projectile, index) {
      if (globalThis.player.hit(projectile)) {
        globalThis.soundEffects.playExplosionSound();
        globalThis.invadersProjectiles.splice(index, 1);

        Methods.gameOver();
      }
    });
  },
  checkShootObstacles: function checkShootObstacles() {
    globalThis.obstacles.forEach(function (obstacle) {
      globalThis.playerProjectiles.some(function (projectile, index) {
        if (obstacle.hit(projectile)) {
          globalThis.playerProjectiles.splice(index, 1);
          return;
        }
      });

      globalThis.invadersProjectiles.some(function (projectile, index) {
        if (obstacle.hit(projectile)) {
          globalThis.invadersProjectiles.splice(index, 1);
          return;
        }
      });
    });
  },
  checkInvadersCollidedObstacles: function checkInvadersCollidedObstacles() {
    globalThis.obstacles.forEach(function (obstacle, i) {
      globalThis.grid.invaders.some(function (invader) {
        if (invader.collided(obstacle)) {
          globalThis.obstacles.splice(i, 1);
        }
      });
    });
  },
  checkPlayerCollidedInvaders: function checkPlayerCollidedInvaders() {
    globalThis.grid.invaders.some(function (invader) {
      if (invader.position.x >= globalThis.player.position.x && invader.position.x <= globalThis.player.position.x + globalThis.player.width && invader.position.y >= globalThis.player.position.y) {
        Methods.gameOver();
      }
    });
  },
  spawnGrid: function spawnGrid() {
    if (globalThis.grid.invaders.length === 0) {
      globalThis.soundEffects.playNextLevelSound();
      globalThis.grid.rows = Math.round(Math.random() * 9 + 1);
      globalThis.grid.cols = Math.round(Math.random() * 9 + 1);
      globalThis.grid.restart();
      Methods.incrementLevel();
      if (globalThis.obstacles.length === 0) {
        Methods.initArrows();
      }
    }
  },
  gameLoop: function gameLoop() {
    globalThis.ctx.clearRect(0, 0, El.canvas.width, El.canvas.height);

    Methods.drawStars();

    if (globalThis.currentState === _constants.GameState.PLAYING) {
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

      // globalThis.grid.draw(globalThis.ctx);
      // globalThis.grid.update(globalThis.player.alive);

      globalThis.ctx.save();

      globalThis.ctx.translate(globalThis.player.position.x + globalThis.player.width / 2, globalThis.player.position.y + globalThis.player.height / 2);

      if (globalThis.keys.shoot.pressed && globalThis.keys.shoot.released) {
        globalThis.soundEffects.playShootSound();
        globalThis.player.shoot(globalThis.playerProjectiles);
        globalThis.keys.shoot.released = false;
      }

      if (globalThis.keys.left && globalThis.player.position.x >= 0) {
        globalThis.player.moveLeft();
        globalThis.ctx.rotate(-0.15);
      }

      if (globalThis.keys.right && globalThis.player.position.x <= El.canvas.width - globalThis.player.width) {
        globalThis.player.moveRight();
        globalThis.ctx.rotate(0.15);
      }

      globalThis.ctx.translate(-globalThis.player.position.x - globalThis.player.width / 2, -globalThis.player.position.y - globalThis.player.height / 2);

      ctx.clearRect(0, 0, El.canvas.width, El.canvas.height);
      for (var i = 0; i < globalThis.trash.length; i++) {
        globalThis.trash[i].update();
        globalThis.trash[i].draw(globalThis.ctx);
        // remove quando sair da tela
        if (globalThis.trash[i].y > El.canvas.height + 100) {
          globalThis.trash.splice(i, 1);
          i--;
        }
      }

      globalThis.player.draw(globalThis.ctx);
      globalThis.ctx.restore();
    }

    if (globalThis.currentState === _constants.GameState.GAME_OVER) {
      Methods.checkShootObstacles();

      Methods.drawProjectiles();
      Methods.drawParticles();
      Methods.drawObstacles();

      Methods.clearProjectiles();
      Methods.clearParticles();

      clearInterval(globalThis.trashInterval);

      // globalThis.grid.draw(globalThis.ctx);
      // globalThis.grid.update(globalThis.player.alive);
    }

    requestAnimationFrame(Methods.gameLoop);
  },
  restartGame: function restartGame() {
    globalThis.currentState = _constants.GameState.PLAYING;

    globalThis.player.alive = true;

    globalThis.grid.invaders.length = 0;
    globalThis.grid.invadersVelocity = 1;

    globalThis.invadersProjectiles.length = 0;
    globalThis.gameData.score = 0;
    globalThis.gameData.level = 0;

    El.gameOverScreen.classList.add("hide");
  }
};

globalThis.addEventListener("DOMContentLoaded", Methods.init);

},{"../../utils/constants.js":10,"./classes/Grid.js":1,"./classes/Particle.js":3,"./classes/Player.js":4,"./classes/SoundEffects.js":6,"./classes/Star.js":7,"./classes/Trash.js":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var PATH_GARBAGE_IMAGE = exports.PATH_GARBAGE_IMAGE = "/images/garbage_can.png";
var PATH_ARROWLEFT_IMAGE = exports.PATH_ARROWLEFT_IMAGE = "/images/arrow-left.png";
var PATH_ARROWRIGHT_IMAGE = exports.PATH_ARROWRIGHT_IMAGE = "/images/arrow-right.png";

var PATH_ORGANIC_IMAGE = exports.PATH_ORGANIC_IMAGE = "/images/trash/apple.png";
var PATH_METAL_IMAGE = exports.PATH_METAL_IMAGE = "/Zimages/trash/can_soda.png";
var PATH_GLASS_IMAGE = exports.PATH_GLASS_IMAGE = "/images/trash/glass.png";
var PATH_PAPER_IMAGE = exports.PATH_PAPER_IMAGE = "/images/trash/newspaper.png";
var PATH_PLASTIC_IMAGE = exports.PATH_PLASTIC_IMAGE = "/images/trash/plastic_bottle.png";

var PATH_BATTERY_IMAGE = exports.PATH_BATTERY_IMAGE = "/images/trash/not/battery.png";
var PATH_LAMP_IMAGE = exports.PATH_LAMP_IMAGE = "/images/trash/not/lamp.png";

var PATH_ENGINE_IMAGE = exports.PATH_ENGINE_IMAGE = "/images/engine.png";
var PATH_ENGINE_SPRITES = exports.PATH_ENGINE_SPRITES = "/images/engine_sprites.png";
var PATH_INVADER_IMAGE = exports.PATH_INVADER_IMAGE = "/images/invader.png";

var NUMBER_STARS = exports.NUMBER_STARS = 100;
var INITIAL_FRAMES = exports.INITIAL_FRAMES = 8;

var GameState = exports.GameState = {
    START: "start",
    PLAYING: "playing",
    GAME_OVER: "gameOver"
};

},{}]},{},[9]);
