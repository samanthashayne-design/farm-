
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
let plotStage = 'empty'; 
let startTag = 175

const plotCrops = ['sunflower', 'carrots', 'cabbage', 'tomatoes'];

let startX, endX, squareSize;
const y = 275;
const plotCount = 4;
const gap = 60;

// const startX = 150;
//   const endX = 1400;
//   const y = 275;

  // const plotCount = 4;
  // const gap = 60; // gap between squares
  // const squareSize = (endX - startX - gap * (plotCount - 1)) / plotCount;

let dirtGap = 50;
let totalDirt = 5;
// let count1 = 0;
// let count2 = 0;
// let count3 = 0;
// let count4 = 0;
let frameDelay = 5

// let leafcount1 = 0;
// let leafcount2 = 0;
// let leafcount3 = 0;
// let leafcount4 = 0;

let counts = [0, 0, 0, 0];
let leafcounts = [0, 0, 0, 0];
  

// let clickCount = 0;
// let clickCount2 = 0;
let selectedPlotIndex = -1;

let dugPlots = [false, false, false, false];
let wateredPlots = [false, false, false, false];




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
  computePlotLayout();
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

// if (shovelBtn) {
//   shovelBtn.addEventListener('click', () => {
//     if (clickCount < 4) {
//       clickCount++;
//     }
//   });
// }

// if (wateringCanBtn) {
//   wateringCanBtn.addEventListener('click', () => {
//     if (clickCount2 < 4) {
//       clickCount2++;
//     }
//   });
// }
if (shovelBtn) {
  shovelBtn.addEventListener('click', () => {
    if (selectedPlotIndex !== -1) {
      dugPlots[selectedPlotIndex] = true;
    }
  });
}

if (wateringCanBtn) {
  wateringCanBtn.addEventListener('click', () => {
    if (selectedPlotIndex !== -1) {
      wateredPlots[selectedPlotIndex] = true;
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
   computePlotLayout();
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
    const s = targetSize / 80; 
    scale(s);
    translate(-100, -94); 
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
        selectedPlotIndex = plotCrops.indexOf(card.label); // which plot this crop belongs to
        scene = 'scene5';
        updateSceneUI();
      }
    }
  }
}

function drawScene4() {
  // background(90, 150, 110);
  // fill(255);
  // textSize(32);
  // textAlign(CENTER, CENTER);
  // textFont(font);
  // text('Tend Garden', width / 2, height / 2);
  drawFarmScene();
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
  ellipse(300, 300, 70, 70);
  fill(120, 79, 13);
  ellipse(300, 300, 55, 55);
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

//   drawGardenPlot();
// if (clickCount >= 1) shovel1();
// if (clickCount >= 2) shovel2();
// if (clickCount >= 3) shovel3();
// if (clickCount >= 4) shovel4();

// if (clickCount2 >= 1) leaf1();
// if (clickCount2 >= 2) leaf2();
// if (clickCount2 >= 3) leaf3();
// if (clickCount2 >= 4) leaf4();
// drawGardenPlot();
// if (dugPlots[0]) shovel1();
// if (dugPlots[1]) shovel2();
// if (dugPlots[2]) shovel3();
// if (dugPlots[3]) shovel4();

// if (wateredPlots[0]) leaf1();
// if (wateredPlots[1]) leaf2();
// if (wateredPlots[2]) leaf3();
// if (wateredPlots[3]) leaf4();
drawGardenPlot();
for (let i = 0; i < plotCount; i++) {
  if (dugPlots[i]) drawDirtMound(i);
  if (wateredPlots[i]) growLeaves(i);
}

 
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
  

  fill(140, 90, 55);
  noStroke();

  for (let i = 0; i < plotCount; i++) {
    const x = startX + i * (squareSize + gap);
    rect(x, y, squareSize, squareSize, 10); // 10px rounded corners
    const tag = startTag + i * (squareSize + gap);
    fill(250, 242, 215)
    stroke(250, 242, 215);
    strokeWeight(6);
    strokeJoin(ROUND);
    rect(tag, 250, 20, 20);
    triangle(tag, 270, tag+20, 270, tag+10, 285)
    noStroke();
    drawCropIcon(plotCrops[i], tag + 10, 260, 20);
    fill(140, 90, 55);
  }
}
// drawGardenPlot();
// for (let i = 0; i < plotCount; i++) {
//   if (dugPlots[i]) drawDirtMound(i);
//   if (wateredPlots[i]) growLeaves(i);
// }

// function shovel1(){
//   fill(117, 73, 42);
//   if (frameCount % frameDelay === 0 && count1 < totalDirt) {
//     count1++;
//   }
//   for (let i = 0; i < count1; i++){
//     ellipse(startX+squareSize/5, 513-i*dirtGap, 30, 15)
//   }
// }

// function shovel2(){
//   fill(117, 73, 42);

//   if (frameCount % frameDelay === 0 && count2 < totalDirt) {
//     count2++;
//   }
//   for (let i = 0; i < count2; i++){
//     ellipse(startX+(2*squareSize/5), 513-i*dirtGap, 30, 15)
//   }
// }

// function shovel3(){
//   fill(117, 73, 42);

//   if (frameCount % frameDelay === 0 && count3 < totalDirt) {
//     count3++;
//   }
//   for (let i = 0; i < count3; i++){
//     ellipse(startX+(3*squareSize/5), 513-i*dirtGap, 30, 15)
//   }
// }

// function shovel4(){
//   fill(117, 73, 42);

//   if (frameCount % frameDelay === 0 && count4 < totalDirt) {
//     count4++;
//   }
//   for (let i = 0; i < count4; i++){
//     ellipse(startX+(4*squareSize/5), 513-i*dirtGap, 30, 15)
//   }
// }

 
// function leaf1(){
//   if (frameCount % frameDelay === 0 && leafcount1 < totalDirt) {
//     leafcount1++;
//   }
//   for (let i = 0; i < leafcount1; i++){
//   push();
//   translate(startX+squareSize/5, 510-i*dirtGap);
//   rotate((-5.3));
//   fill('green');
//   ellipse(-5, 0, 18, 7);
//   rotate((-2));
//   fill('green')
//   ellipse(5, 0, 18,7);
//   pop();
//   }
// }

// function leaf2(){
//   if (frameCount % frameDelay === 0 && leafcount2 < totalDirt) {
//     leafcount2++;
//   }
//   for (let i = 0; i < leafcount2; i++){
//   push();
//   translate(startX+2*squareSize/5, 510-i*dirtGap);
//   rotate(-5.3);
//   fill('green');
//   ellipse(-5, 0, 18, 7);
//   rotate(-2);
//   fill('green')
//   ellipse(5, 0, 18,7);
//   pop();
//   }
// }

// function leaf3(){
//   if (frameCount % frameDelay === 0 && leafcount3 < totalDirt) {
//     leafcount3++;
//   }
//   for (let i = 0; i < leafcount3; i++){
//     push();
//   translate(startX+3*squareSize/5, 510-i*dirtGap);
//   rotate(-5.3);
//   fill('green');
//   ellipse(-5, 0, 18, 7);
//   rotate(-2);
//   fill('green')
//   ellipse(5, 0, 18,7);
//   pop();
//   }
// }

// function leaf4(){
//   if (frameCount % frameDelay === 0 && leafcount4 < totalDirt) {
//     leafcount4++;
//   }
//   for (let i = 0; i < leafcount4; i++){
//     push();
//   translate(startX+4*squareSize/5, 510-i*dirtGap);
//   rotate(-5.3);
//   fill('green');
//   ellipse(-5, 0, 18, 7);
//   rotate(-2);
//   fill('green')
//   ellipse(5, 0, 18,7);
//   pop();
//   }
// }

function drawDirtMound(i) {
  fill(117, 73, 42);
  if (frameCount % frameDelay === 0 && counts[i] < totalDirt) {
    counts[i]++;
  }
  const plotX = startX + i * (squareSize + gap);
  const centerX = plotX + squareSize / 2;
  for (let j = 0; j < counts[i]; j++) {
    ellipse(centerX, 513 - j * dirtGap, 30, 15);
  }
}

function growLeaves(i) {
  if (frameCount % frameDelay === 0 && leafcounts[i] < totalDirt) {
    leafcounts[i]++;
  }

  const plotX = startX + i * (squareSize + gap);
  const centerX = plotX + squareSize / 2;

  for (let j = 0; j < leafcounts[i]; j++) {
    push();
    translate(centerX, 510 - j * dirtGap);
    rotate(-5.3);
    fill('green');
    ellipse(-5, 0, 18, 7);
    rotate(-2);
    fill('green');
    ellipse(5, 0, 18, 7);
    pop();
  }
}

function computePlotLayout() {
  startX = width * 0.1;
  endX = width * 0.9;
  squareSize = (endX - startX - gap * (plotCount - 1)) / plotCount;
}