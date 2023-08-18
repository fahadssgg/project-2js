let canvas,
  ctx,
  w,
  h,
  trees,
  moon,
  stars = [],
  meteors = [];
let branchChance = [0.08, 0.09, 0.1, 0.11, 0.12, 0.15, 0.3];
let branchAngles = [20, 25, 30, 35];

function init() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  resizeReset();

  for (let a = 0; a < w * h * 0.0001; a++) {
    stars.push(new Star());
  }
  animationLoop();
}

function addTree(e) {
  trees.push(new Tree(e.x));
}

function resizeReset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  trees = [];
  drawGround();
  trees.push(new Tree());
}

function drawGround() {
  ctx.fillStyle = `rgba(54, 121, 38, 1)`;
  ctx.fillRect(0, h - 100, w, h);
}

function animationLoop() {
  drawScene();
  requestAnimationFrame(animationLoop);
}

function drawScene() {
  trees.map((t) => {
    t.update();
    t.draw();
  });

  // moon.draw();
  stars.map((star) => {
    star.update();
    star.draw();
  });
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

class Tree {
  constructor(x) {
    this.x = x ? x : w * 0.5;
    this.y = h;
    this.branchs = [];
    this.addBranch(this.x, this.y - 150, getRandomInt(5, 7), 180);
  }
  addBranch(x, y, radius, angle) {
    this.branchs.push(new Branch(x, y, radius, angle));
  }
  draw() {
    this.branchs.map((b) => {
      b.draw();
    });
  }
  update() {
    this.branchs.map((b) => {
      b.update();

      // Add branch when conditions are true
      if (
        b.radius > 0 &&
        b.progress > 0.4 &&
        Math.random() < b.branchChance &&
        b.branchCount < 3
      ) {
        let newBranch = {
          x: b.x,
          y: b.y,
          radius: b.radius - 1,
          angle:
            b.angle +
            branchAngles[Math.floor(Math.random() * branchAngles.length)] *
              b.branchDirection,
        };
        this.addBranch(
          newBranch.x,
          newBranch.y,
          newBranch.radius,
          newBranch.angle
        );

        b.branchCount++;
        b.branchDirection *= -1;
      }
    });
  }
}

class Branch {
  constructor(x, y, radius, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = angle;
    this.branchReset();
  }
  branchReset() {
    this.sx = this.x;
    this.sy = this.y;
    this.length = this.radius * 20;
    this.progress = 0;
    this.branchChance = branchChance[7 - this.radius];
    this.branchCount = 0;
    this.branchDirection = Math.random() < 0.5 ? -1 : 1;
  }
  draw() {
    if (this.progress > 1 || this.radius <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(25,38,26,1)`;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    let radian = (Math.PI / 180) * this.angle;
    this.x = this.sx + this.length * this.progress * Math.sin(radian);
    this.y = this.sy + this.length * this.progress * Math.cos(radian);

    if (this.radius == 1) {
      this.progress += 0.05;
    } else {
      this.progress += 0.1 / this.radius;
    }

    if (this.progress > 1) {
      this.radius -= 1;
      this.angle += (Math.floor(Math.random() * 3) - 1) * 10;
      this.branchReset();
    }
  }
}

class Star {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() + 0.5;
    this.blinkChance = 0.005;
    this.alpha = 1;
    this.alphaChange = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y - 100, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    if (this.alphaChange === 0 && Math.random() < this.blinkChance) {
      this.alphaChange = -1;
    } else if (this.alphaChange !== 0) {
      this.alpha += this.alphaChange * 0.05;
      if (this.alpha <= 0) {
        this.alphaChange = 1;
      } else if (this.alpha >= 1) {
        this.alphaChange = 0;
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resizeReset);
