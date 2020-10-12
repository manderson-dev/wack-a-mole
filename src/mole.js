// define the game manager object
const GameManager = function () {
  this.setup();
};

GameManager.prototype.setup = function () {
  // capture dom references
  this.containerDiv = document.querySelector(".container");
  this.timeDiv = document.querySelector("#timeCounter");
  this.hitDiv = document.querySelector("#hitCounter");
  this.missDiv = document.querySelector("#missCounter");
  this.btnStart = document.getElementById("btnStart");
  this.btnStop = document.getElementById("btnStop");
  this.btnReset = document.getElementById("btnReset");

  // set initial button states
  this.btnStop.disabled = true;
  this.btnReset.disabled = true;

  // setup click handlers for buttons
  this.btnStart.addEventListener("click", () => {
    this.btnStart.disabled = true;
    this.btnStart.textContent = "Start";
    this.btnStop.disabled = false;
    this.btnReset.disabled = true;
    this.start();
  });

  this.btnStop.addEventListener("click", () => {
    this.btnStart.disabled = false;
    this.btnStart.textContent = "Resume";
    this.btnStop.disabled = true;
    this.btnReset.disabled = false;
    this.stop();
  });

  this.btnReset.addEventListener("click", () => {
    this.btnStart.disabled = false;
    this.btnStart.textContent = "Start";
    this.btnStop.disabled = true;
    this.btnReset.disabled = true;
    this.reset();
  });

  // reference to image paths
  this.images = {
    moleUp: "images/mole-up.png",
    moleHit: "images/mole-hit.png",
  };

  // set initial values for game state
  this.running = false;
  this.time = 0;
  this.maxTime = 30;
  this.hits = 0;
  this.misses = 0;
  this.moles = [];

  // remove any children from the container div before setting up (for reset)
  this.containerDiv.innerHTML = "";
  this.containerDiv.classList.remove("game-over");

  // populate the container div with the mole blocks
  for (let i = 0; i < 9; i++) {
    const div = document.createElement("div");
    div.id = `block_${i}`;
    div.className = "mole-block";
    div.dataset.moleIndex = i;
    this.moles.push({
      id: `block_${i}`,
      timer: Math.round(Math.random() * 8),
      status: "hidden",
    });
    this.containerDiv.appendChild(div);
  }

  // update scoreboard with initial values
  this.updateHits();
  this.updateTime();
  this.updateMisses();
};

GameManager.prototype.createMole = function (moleId) {
  const mole = document.createElement("div");
  const moleImage = document.createElement("img");
  mole.className = "clickable";
  moleImage.src = this.images.moleUp;
  mole.appendChild(moleImage);
  mole.addEventListener("click", () => {
    if (this.running) {
      if (mole.dataset.hit !== "1") {

        // indicate the mole has been hit, poor guy
        mole.dataset.hit = "1";

        // increment hit counter and update display
        this.hits++;
        this.updateHits();

        // remove image of mole and replace with closed eyes
        mole.removeChild(mole.firstChild);
        const moleHit = document.createElement("img");
        moleHit.src = this.images.moleHit;
        mole.appendChild(moleHit);

        // lets set the mole to hide on the next tick after being hit
        const moleData = this.moles.find((m) => m.id === moleId);
        moleData.timer = this.time + 1;
      }
    }
  });
  return mole;
};

GameManager.prototype.updateTime = function () {
  this.timeDiv.textContent = this.maxTime - this.time;
};
GameManager.prototype.updateHits = function () {
  this.hitDiv.textContent = this.hits;
};

GameManager.prototype.updateMisses = function () {
  this.missDiv.textContent = this.misses;
};

GameManager.prototype.start = function () {
  // already running, so do nothing
  if (this.running) {
    return;
  }

  // if start is pressed after game ends, let's reset first
  if (this.time >= this.maxTime) {
    this.setup();
  }

  // set running flag to true and remove the game-over style
  this.running = true;
  this.containerDiv.classList.remove("game-over");

  const update = () => {
    if (this.running) {
      // increment timer and update display
      this.time++;
      this.updateTime();

      // iterate through moles that are set to perform an event
      this.moles
        .filter((moleData) => moleData.timer === this.time)
        .forEach((moleData) => {
          // grab a dom ref to the current mole block
          const moleDiv = document.getElementById(moleData.id);

          // if current mole is visible, then we need to remove it
          if (moleData.mole === "visible") {

            // if the mole was never hit, add to the miss counter
            if (moleDiv.firstChild.dataset.hit !== "1") {
              this.misses++;
              this.updateMisses();
            }

            // set mole as hidden and remove the element
            moleData.mole = "hidden";
            moleDiv.removeChild(moleDiv.firstChild);

            // randomly determine the next time the mole will appear (0-9 seconds)
            moleData.timer += Math.round(Math.random() * 9);
          } else {
            // otherwise display a new mole
            moleData.mole = "visible";
            moleDiv.appendChild(this.createMole(moleData.id));

            // randomly determine how long the mole will stay visible (1-5 seconds)
            moleData.timer += Math.round(Math.random() * 4 + 1);
          }
        });

      if (this.time < this.maxTime) {
        // if we're not at max time, resume ticks
        setTimeout(update, 1000);
      } else {
        // we're at max time, game over
        this.btnStart.disabled = false;
        this.btnStop.disabled = true;
        this.btnReset.disabled = false;
        this.stop();
      }
    }
  };

  // start the tick of the game loop
  setTimeout(update, 1000);
};

GameManager.prototype.stop = function () {
  this.running = false;
  this.containerDiv.classList.add("game-over");
};

GameManager.prototype.reset = function (difficulty) {
  this.stop();
  this.setup();
};

const game = new GameManager();
game.setup();
