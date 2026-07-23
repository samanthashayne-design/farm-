
let angle = 0;
let target = 0;
let font;
let words = "good morning! what would you like to do today?";
let particles = [];
let rain = false;
let scene = 'farm';
let playBtn, prevBtn, plantCropsBtn, tendGardenBtn;
let seedCards = [];
let selectedCrop = '';
let shovelBtn, wateringCanBtn;
let plotStage = 'empty'; // 'empty' -> 'dug' -> 'planted'


function preload(){
  font = loadFont("brown_cookies/Brown-Cookies.otf")
}

function setupSeedCards() {
  const cardW = 340, cardH = 220, gapX = 50, gapY = 40;
  const startX = width / 2 - cardW - gapX / 2;
  const startY = 90; // was 130 — moved up so the bottom row fits on canvas
  const labels = ['sunflower', 'carrots', 'cabbage', 'tomatoes'];

  seedCards = labels.map((label, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    return {
      x: startX + col * (cardW + gapX),
      y: startY + row * (cardH + gapY),
      w: cardW,
      h: cardH,
      label
    };
  });
}


function setup() {
   const c = createCanvas(windowWidth, 600);
  c.parent('sketch2');  // attach canvas inside the <div id="sketch">
  angle = -PI / 2; // set the day-start state here, once p5 is ready
  target = -PI / 2;
select('#rainBtn').mousePressed(toggleRain);
select('#dayNightBtn').mousePressed(toggleDayNight);
playBtn = document.getElementById('playBtn');
  prevBtn = document.getElementById('prev-scene');
  plantCropsBtn = document.getElementById('plantCropsBtn');
  tendGardenBtn = document.getElementById('tendGardenBtn');

setupSeedCards();

if (playBtn) {
    playBtn.addEventListener('click', () => {
      scene = 'scene2';
      updateSceneUI();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scene = 'farm';
      updateSceneUI();
    });
  }

  if (plantCropsBtn) {
    plantCropsBtn.addEventListener('click', () => {
      scene = 'scene3';
      updateSceneUI();
    });

  shovelBtn = document.getElementById('shovelBtn');
wateringCanBtn = document.getElementById('wateringCanBtn');

if (shovelBtn) {
  shovelBtn.addEventListener('click', () => {
    if (plotStage === 'empty') {
      plotStage = 'dug';
    }
  });
}

if (wateringCanBtn) {
  wateringCanBtn.addEventListener('click', () => {
    if (plotStage === 'dug') {
      plotStage = 'planted';
    }
  });
}
  }

  if (tendGardenBtn) {
    tendGardenBtn.addEventListener('click', () => {
      scene = 'scene4';
      updateSceneUI();
    });
  
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
        scene = 'scene2';
        playBtn.style.display = 'none';
        });
    }

    const prevBtn = document.getElementById('prev-scene');
    if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        scene = 'farm'; // not currentScene
        if (playBtn) playBtn.style.display = 'flex';
    });
    }
}
updateSceneUI(); // set correct initial visibility (farm scene)
}



function updateSceneUI() {
  playBtn.style.display = scene === 'farm' ? 'flex' : 'none';
  plantCropsBtn.style.display = scene === 'scene2' ? 'block' : 'none';
  tendGardenBtn.style.display = scene === 'scene2' ? 'block' : 'none';
  shovelBtn.style.display = scene === 'scene5' ? 'block' : 'none';
  wateringCanBtn.style.display = scene === 'scene5' ? 'block' : 'none';

  if (scene === 'scene5') {
    plotStage = 'empty'; // fresh plot every time you arrive
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 600);
  setupSeedCards();
}

function toggleRain() {
  rain = !rain;
}
function toggleDayNight() {
    textFont(font);
    target = target === PI / 2 ? -PI / 2 : PI / 2;
    words = words === "good morning! what would you like to do today?"
  ? "good night!"
  : "good morning! what would you like to do today?";
  }

class Particle {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vy = random(2, 5); // random upward velocity
    this.alpha = 255; // full opacity
  }

  update() {
    this.vy += 0.01; // gravity
    this.y += this.vy; // move the particle upward
    this.alpha -= 3; // fade out
  }

  show() {
    // noStroke();
    stroke(138, 154, 189, this.alpha);
    strokeWeight(2)
    fill(77, 130, 196, this.alpha);
    line(this.x, this.y, this.x, this.y+10);
  }

  isFinished() {
    return this.y > height | this.alpha <= 0; // Particle is finished when it's fully transparent
  }
}


function draw() {
  if (scene === 'farm') {
    drawFarmScene();
  } else if (scene === 'scene2') {
    drawScene2();
  } else if (scene === 'scene3') {
    drawScene3();
  } else if (scene === 'scene4') {
    drawScene4();
  } else if (scene === 'scene5') {
    drawScene5();
  }
}






function drawFarmScene() {
  angle = lerp(angle, target, 0.03);

  let sky = lerpColor(color(25, 26, 102), color(130, 210, 255), map(sin(angle), -1, 1, 1, 0));
  if (rain) {
    sky = lerpColor(sky, color(60, 60, 70), 0.6);
  }
  background(sky);

  noStroke();

  let sun = color(255, 227, 43);
  if (rain) {
    sun = color(180, 170, 100);
  }
  fill(sun);
  ellipse(1000 + cos(angle) * 200, 270 + sin(angle) * 200, 90);

  fill(240, 240, 221);
  let mx = 400 - cos(angle) * 200;
  let my = 270 - sin(angle) * 200;
  ellipse(mx, my, 90);
  fill(sky);
  circle(mx + 30, my - 10, 89);

  drawHills(); // behind the ground, in front of the sky

  noStroke();
  fill(111, 237, 104);
  rect(0, 250, 1600, 400);

  drawBarn();
  drawFence();

  // fill(222);
  // noStroke();
  // textFont(font);
  // textSize(18);
  // textAlign(LEFT, BASELINE);
  // text(words, 30, 230);

  if (rain) {
    particles.push(new Particle());
    particles.push(new Particle());
    particles.push(new Particle());
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function drawHills() {
  noStroke();
  fill(90, 180, 90);
  ellipse(width * 0.1, 265, width * 0.35, 160);
  ellipse(width * 0.35, 275, width * 0.4, 180);
  fill(70, 160, 80);
  ellipse(width * 0.6, 270, width * 0.38, 160);
  ellipse(width * 0.85, 278, width * 0.35, 170);
}

function drawFence() {
  const startX = 60;
  const endX = 960;   // spans much further across the field now
  const postY = 280;
  const postH = 60;   // taller posts
  const spacing = 50;

  stroke(90, 60, 30);
  strokeWeight(4);   // thicker rails to match the larger scale

  // horizontal rails
  line(startX, postY + 15, endX, postY + 15);
  line(startX, postY + 35, endX, postY + 35);

  // vertical posts
  for (let x = startX; x <= endX; x += spacing) {
    line(x, postY, x, postY + postH);
  }
}


function drawBarn() {
  const bx = 1100;   // pushed further right, toward the back of the field
  const by = 210;    // higher up (closer to the horizon) reads as farther away
  const bw = 200;    // smaller footprint reinforces the distance
  const bh = 100;

  stroke(255, 241, 219);
  strokeWeight(2);

  // walls
  fill(178, 44, 44);
  rect(bx, by, bw, bh);

  // roof
  fill(135, 34, 34);
  triangle(bx, by, bx + bw, by, bx + bw / 2, by - 40);

  // crossbuck door with an X pattern
  const doorX = bx + bw / 2 - 60;
  const doorY = by + bh -60;
  const doorW = 120;
  const doorH = 60;

  fill(135, 34, 34);
  rect(doorX, doorY, doorW, doorH);

  stroke(255, 241, 219);
  strokeWeight(2);
  line(doorX, doorY, doorX + doorW, doorY + doorH);
  line(doorX + doorW, doorY, doorX, doorY + doorH);
}


function drawScene2() {
angle = lerp(angle, target, 0.03);

  let sky = lerpColor(color(25, 26, 102), color(130, 210, 255), map(sin(angle), -1, 1, 1, 0));
  if (rain) {
    sky = lerpColor(sky, color(60, 60, 70), 0.6);
  }
  background(sky);

  noStroke();

  let sun = color(255, 227, 43);
  if (rain) {
    sun = color(180, 170, 100);
  }
  fill(sun);
  ellipse(1000 + cos(angle) * 200, 270 + sin(angle) * 200, 90);

  fill(240, 240, 221);
  let mx = 400 - cos(angle) * 200;
  let my = 270 - sin(angle) * 200;
  ellipse(mx, my, 90);
  fill(sky);
  circle(mx + 30, my - 10, 89);

  drawHills(); // behind the ground, in front of the sky

  noStroke();
  fill(111, 237, 104);
  rect(0, 250, 1600, 400);

  drawBarn();
  drawFence();

  fill(222);
  noStroke();
  textFont(font);
  textSize(18);
  textAlign(LEFT, BASELINE);
  text(words, 30, 230);

  if (rain) {
    particles.push(new Particle());
    particles.push(new Particle());
    particles.push(new Particle());
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function drawScene3() {
  drawShedBackground();

  fill(255);
  noStroke();
  textFont(font);
  textAlign(CENTER, CENTER- 10);
  textSize(36);
  text('what would you like to plant?', width / 2, 60);

  for (const card of seedCards) {
    drawSeedCard(card);
  }
}

function drawShedBackground() {
  // wood plank wall
  background(139, 98, 61);
  noStroke();
  for (let y = 0; y < height; y += 40) {
    fill(148, 105, 66);
    rect(0, y, width, 38);
    fill(0, 0, 0, 20);
    rect(0, y + 36, width, 2); // plank seam shadow
  }

  // shelves behind each row of cards
  const shelfPositions = [...new Set(seedCards.map(c => c.y + c.h + 15))];
  for (const shelfY of shelfPositions) {
    fill(101, 67, 33);
    rect(40, shelfY, width - 80, 14, 3);
    fill(60, 38, 18);
    rect(40, shelfY + 12, width - 80, 5); // shadow under the lip
  }
}



function drawSeedCard(card) {
  const hovering =
    mouseX > card.x && mouseX < card.x + card.w &&
    mouseY > card.y && mouseY < card.y + card.h;

  noStroke();
  fill(0, 0, 0, 60);
  rect(card.x + 6, card.y + 8, card.w, card.h, 16);

  fill(hovering ? 255 : 250, hovering ? 250 : 245, hovering ? 235 : 225);
  stroke(34, 90, 62);
  strokeWeight(hovering ? 4 : 3);
  rect(card.x, card.y, card.w, card.h, 16);

  noStroke();
  fill(255);
  rect(card.x + 20, card.y + 20, 130, 130, 8);
  stroke(34, 90, 62);
  strokeWeight(1.5);
  noFill();
  rect(card.x + 20, card.y + 20, 130, 130, 8);

  drawCropIcon(card.label, card.x + 85, card.y + 85, 100);

  noStroke();
  fill(34, 90, 62);
  textFont(font);
  textSize(28);
  textAlign(LEFT, CENTER);
  text(card.label, card.x + 165, card.y + 50);

  fill(90, 90, 90);
  textSize(15);
  textAlign(LEFT, CENTER);
  text('tap to plant', card.x + 165, card.y + 90);
  text('grows in ' + guessSeason(card.label), card.x + 165, card.y + 115);
}


function drawCropIcon(label, targetX, targetY, targetSize) {
  push();
  translate(targetX, targetY);

  if (label === 'tomatoes') {
    const s = targetSize / 80; // was /55 — corrected to the shape's actual ~80px width
    scale(s);
    translate(-100, -94); // corrected center — was (-97, -85)
    drawtomato();
  } else if (label === 'carrots') {
    const s = targetSize / 68;
    scale(s);
    translate(-300, -84);
    drawcarrot();
  } else if (label === 'cabbage') {
    const s = targetSize / 80;
    scale(s);
    translate(-100, -300);
    drawcabbage();
  } else if (label === 'sunflower') {
    const s = targetSize / 150;
    scale(s);
    translate(-300, -300);
    angleMode(DEGREES);
    drawsunflower();
    angleMode(RADIANS);
  }

  pop();
}

function guessSeason(label) {
  if (label === 'sunflower') return 'summer';
  if (label === 'carrots') return 'spring';
  if (label === 'cabbage') return 'fall';
  return 'summer'; // tomatoes
}

function mousePressed() {
  if (scene === 'scene3') {
    for (const card of seedCards) {
      if (
        mouseX > card.x && mouseX < card.x + card.w &&
        mouseY > card.y && mouseY < card.y + card.h
      ) {
        selectedCrop = card.label;
        scene = 'scene5'; // wherever picking a seed should lead
        updateSceneUI();
      }
    }
  }
}

function drawScene4() {
  background(90, 150, 110);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  textFont(font);
  text('Tend Garden', width / 2, height / 2);
}

function drawtomato() {
  noStroke();
  fill(222, 80, 80);
  ellipse(170 / 2, 190 / 2, 100 / 2, 120 / 2);
  ellipse(230 / 2, 192 / 2, 100 / 2, 120 / 2);
  fill(237, 85, 85);
  ellipse(200 / 2, 200 / 2, 100 / 2, 120 / 2);
  stroke("green");
  strokeWeight(6);
  strokeJoin(ROUND);
  fill("green");
  triangle(192 / 2, 132 / 2, 230 / 2, 120 / 2, 210 / 2, 140 / 2);
  triangle(210 / 2, 135 / 2, 225 / 2, 165 / 2, 190 / 2, 140 / 2);
  triangle(185 / 2, 130 / 2, 205 / 2, 132 / 2, 174 / 2, 170 / 2);
  triangle(188 / 2, 130 / 2, 160 / 2, 132 / 2, 195 / 2, 140 / 2);
  rect(190 / 2, 114 / 2, 5 / 2, 16 / 2);
}
function drawcarrot() {
  stroke('green');
  strokeWeight(8);
  strokeJoin(ROUND);
  line(300, 50, 300, 80);
  line(290, 55, 300, 80);
  line(310, 55, 300, 80);
  stroke('orange');
  strokeWeight(12);
  fill(227, 148, 48);
  triangle(290, 75, 310, 75, 300, 118);
  fill('blue');
  strokeWeight(8);
  stroke(255, 182, 84);
  triangle(300, 75, 308, 75, 300, 118);
}
function drawcabbage() {
  noStroke();
  fill(90, 155, 75);
  ellipse(90, 300, 60, 60);
  ellipse(110, 290, 60, 60);
  ellipse(110, 310, 60, 60);
  fill(150, 200, 100);
  ellipse(104, 299, 55, 55);
}
function drawsunflower() {
  noStroke();
  fill(247, 202, 79);
  push();
  translate(315, 333);
  rotate(22);
  ellipse(-25, -75, 20, 50);
  ellipse(-25, 25, 20, 50);
  ellipse(25, -25, 50, 20);
  ellipse(-75, -25, 50, 20);
  pop();
  push();
  translate(289, 333);
  rotate(66);
  ellipse(-25, -75, 20, 50);
  ellipse(-25, 25, 20, 50);
  ellipse(25, -25, 50, 20);
  ellipse(-75, -25, 50, 20);
  pop();
  fill(247, 216, 79);
  push();
  translate(300, 335);
  rotate(45);
  ellipse(-25, -75, 20, 50);
  ellipse(-25, 25, 20, 50);
  ellipse(25, -25, 50, 20);
  ellipse(-75, -25, 50, 20);
  pop();
  ellipse(300, 250, 20, 50);
  ellipse(300, 350, 20, 50);
  ellipse(350, 300, 50, 20);
  ellipse(250, 300, 50, 20);
  fill(97, 60, 0);
  ellipse(300, 300, 60, 60);
  fill(120, 79, 13);
  ellipse(300, 300, 45, 45);
}

function drawScene5() {
angle = lerp(angle, target, 0.03);

  let sky = lerpColor(color(25, 26, 102), color(130, 210, 255), map(sin(angle), -1, 1, 1, 0));
  if (rain) {
    sky = lerpColor(sky, color(60, 60, 70), 0.6);
  }
  background(sky);

  noStroke();

  let sun = color(255, 227, 43);
  if (rain) {
    sun = color(180, 170, 100);
  }
  fill(sun);
  ellipse(1000 + cos(angle) * 200, 270 + sin(angle) * 200, 90);

  fill(240, 240, 221);
  let mx = 400 - cos(angle) * 200;
  let my = 270 - sin(angle) * 200;
  ellipse(mx, my, 90);
  fill(sky);
  circle(mx + 30, my - 10, 89);

   drawHills();


  noStroke();
  fill(111, 237, 104);
  rect(0, 230, 1600, 400);

  drawGardenPlot();
 
  if (rain) {
    particles.push(new Particle());
    particles.push(new Particle());
    particles.push(new Particle());
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function drawGardenPlot() {
  const topY = 250;
  const bottomY = 550;
  const topStartX = 250;
  const topEndX = 1400;
  const bottomStartX = 150;
  const bottomEndX = 1300;

  const plotCount = 4;
  const gap = 50; // gap between parallelograms, in top-edge units

  const topTotalWidth = topEndX - topStartX;
  const bottomTotalWidth = bottomEndX - bottomStartX;

  const topSegW = (topTotalWidth - gap * (plotCount - 1)) / plotCount;
  const bottomSegW = (bottomTotalWidth - gap * (plotCount - 1)) / plotCount;

  fill(140, 90, 55);
  noStroke();

  for (let i = 0; i < plotCount; i++) {
    const tx1 = topStartX + i * (topSegW + gap);
    const tx2 = tx1 + topSegW;
    const bx1 = bottomStartX + i * (bottomSegW + gap);
    const bx2 = bx1 + bottomSegW;

    quad(tx1, topY, tx2, topY, bx2, bottomY, bx1, bottomY, );
  }
}

function drawPlants() {

  if (plotStage !== "planted") return;

  for (let i = 0; i < 6; i++) {

    let x = 300 + i * 130;
    let y = 380;

    push();

    if (selectedCrop == "tomatoes") {
      translate(x, y);
      scale(0.5);
      translate(-100,-95);
      drawtomato();
    }

    else if (selectedCrop == "carrots") {
      translate(x,y);
      scale(0.45);
      translate(-300,-90);
      drawcarrot();
    }

    else if (selectedCrop == "cabbage") {
      translate(x,y);
      scale(0.55);
      translate(-100,-300);
      drawcabbage();
    }

    else if (selectedCrop == "sunflower") {
      translate(x,y);
      scale(0.3);
      translate(-300,-300);
      angleMode(DEGREES);
      drawsunflower();
      angleMode(RADIANS);
    }

    pop();
  }
}

