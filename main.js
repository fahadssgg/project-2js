let canvas,
  ctx,
  w,
  h,
  trees,
  stars = [],
  meteors = [];
let branchChance = [0.4, 0.5, 0.23, 0.43, 2];
let branchAngles = [25, 24, 32, 20];

function init() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  treeDie();

  for (let a = 0; a < w * h * 0.0001; a++) {
    stars.push(new Star());
  }
  animationLoop();
}

// function addTree(e) {
//   trees.push(new Tree(e.x));
// }

function resizeReset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  trees = [];
  drawGround();
  trees.push(new Tree());
}

function treeDie() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  trees = [];
  drawGround();
}

function drawGround() {
  ctx.fillStyle = `rgb(51,135,39)`;
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
    this.addBranch(this.x, this.y - 110, getRandomInt(5, 7), 180);
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
    this.length = this.radius * 30;
    this.progress = 0;
    this.branchChance = branchChance[7 - this.radius];
    this.branchCount = 0;
    this.branchDirection = Math.random() < 0.5 ? -1 : 1;
  }
  updateLength(newLength) {
    this.length = newLength;
  }
  draw() {
    if (this.progress > 1 || this.radius <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    const my_gradient = ctx.createLinearGradient(0, 0, 0, 500);
    my_gradient.addColorStop(0, `rgb(48,172,81)`);
    my_gradient.addColorStop(1, `rgba(50,38,26,1)`);

    ctx.fillStyle = my_gradient;
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// الثلاث ازرار الاخيره//////////////////////////////////////////////////////
let pot = document.getElementById("pot");
let waterBtn = document.getElementById("waterBtn");
let oliBtn = document.getElementById("oliBtn");
function smad() {
  pot.style.display = "flex";
  oliBtn.style.display = "inline";
  waterBtn.style.display = "inline";
}

function water() {
  resizeReset();
  pot.style.display = "none";
}

function oli() {
  alert("the tree is died");
  treeDie();
  pot.style.display = "none";
  waterBtn.style.display = "none";
  oliBtn.style.display = "none";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////الشمس والشهب//////////////////////////////////////////////////////
let canvas2,
  ctx2,
  w2,
  h2,
  sun,
  stars2 = [],
  meteors2 = [];

function init2() {
  canvas2 = document.querySelector("#canvas2");
  ctx2 = canvas2.getContext("2d");
  resizeReset2();
  sun = new Sun();
  for (let a = 0; a < w2 * h2 * 0.0001; a++) {
    stars2.push(new Star2());
  }
  for (let b = 0; b < 2; b++) {
    meteors2.push(new Meteor());
  }
  animationLoop2();
}

function resizeReset2() {
  w2 = canvas2.width = window.innerWidth;
  h2 = canvas2.height = window.innerHeight;
}

function animationLoop2() {
  ctx2.clearRect(0, 0, w2, h2);
  drawScene2();
  requestAnimationFrame(animationLoop2);
}

function drawScene2() {
  sun.draw();
  stars2.map((star) => {
    star.update();
    star.draw();
  });
  meteors2.map((meteor) => {
    meteor.update();
    meteor.draw();
  });
}

class Sun {
  constructor() {
    this.x = 150;
    this.y = 170;
    this.size = 200;
  }
  draw() {
    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx2.shadowColor = "rgba(254, 247, 144, .7)";
    ctx2.shadowBlur = 70;
    ctx2.fillStyle = "rgba(254, 247, 144, 1)";
    ctx2.fill();
    ctx2.closePath();
    ctx2.restore();
  }
}

class Star2 {
  constructor() {
    this.x = Math.random() * w2;
    this.y = Math.random() * h2;
    this.size = Math.random() + 0.5;
    this.blinkChance = 0.003;
    this.alpha = 1;
    this.alphaChange = 0;
  }
  draw() {
    ctx2.beginPath();
    ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx2.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx2.fill();
    ctx2.closePath();
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

class Meteor {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w2 + 300;
    this.y = -100;
    this.size = Math.random() * 2 + 0.5;
    this.speed = (Math.random() + 0.5) * 15;
  }
  draw() {
    ctx2.save();
    ctx2.strokeStyle = "rgba(255, 255, 255, .1)";
    ctx2.lineCap = "round";
    ctx2.shadowColor = "rgba(255, 255, 255, 1)";
    ctx2.shadowBlur = 10;
    for (let i = 0; i < 10; i++) {
      ctx2.beginPath();
      ctx2.moveTo(this.x, this.y);
      ctx2.lineWidth = this.size;
      ctx2.lineTo(this.x + 10 * (i + 1), this.y - 10 * (i + 1));
      ctx2.stroke();
      ctx2.closePath();
    }
    ctx2.restore();
  }
  update() {
    this.x -= this.speed;
    this.y += this.speed;
    if (this.y >= h2 + 100) {
      this.reset();
    }
  }
}

window.addEventListener("DOMContentLoaded", init2);
window.addEventListener("resize", resizeReset2);
