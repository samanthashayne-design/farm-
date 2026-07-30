
let angle = 0;
let target = 0;
let font;
let words = "good morning! what would you like to do today?";
let particles = [];
let rain = false;
let scene = 'farm';
let prevBtn, plantCropsBtn, tendGardenBtn, tendFromPlantBtn;
let seedCards = [];
let selectedCrop = '';
let shovelBtn, wateringCanBtn;
let plotStage = 'empty'; 
let startTag = 175

let dirtProgress = [0, 0, 0, 0];   // how many mounds are currently drawn, per plot
let leafProgress = [0, 0, 0, 0];

const plotCrops = ['sunflower', 'carrots', 'cabbage', 'tomatoes'];

let startX, endX, squareSize;
const y = 275;
const plotCount = 4;
const gap = 60;


let dirtGap = 50;
let totalDirt = 5;
let frameDelay = 5

let counts = [0, 0, 0, 0];
let leafcounts = [0, 0, 0, 0];

let columnStops = 4; 
let growth = [0, 0, 0, 0];  
let maxGrowth = 100;
let growthPerColumn = maxGrowth / columnStops;
  

let selectedPlotIndex = -1;

let dugPlots = [false, false, false, false];
let wateredPlots = [false, false, false, false];

let wateringCanActive = false;   
let hoveredPlot = -1;       

 
let farmNamed = false;   // becomes true once they submit a name
let farmName = 'My Farm';

let dirtAlpha = [255, 255, 255, 255];

let wheelbarrowBtn;
let inventory = { sunflower: 0, carrots: 0, cabbage: 0, tomatoes: 0 };

let seenScenes = {};
let lastHintScene = null;
let hintTimeout;
let seenWheelbarrowHint = false;
let seenHarvestHint = false;

let keepPlayingBtn, returnHomeBtn;
let seenWinModal = false;

let helpBtn;

const sceneHints = {
  scene2: [
    { text: "plant new crops here", top: '81%', left: '34%' },
    { text: "check on crops you've already planted", top: '81%', left: '54%' },
    { text: "always brings you back to this home screen", top: '70px', left: '1%' },
    { text: "make it rain! helps crops grow gradually + independently", top: '88%', left: '8px' },
    { text: "make it day or night! also helps crops grow", top: '94.5%', left: '7.5%' },
  ],
  scene3: [
    { text: "tap a card to plant that crop in its matching plot", top: '27%', left: '76%' },
  ],
  scene5: [
    { text: "click to dig a spot for each of your seed!", top: '510px', left: '110px' },
    { text: "click to water your seed + watch it sprout", top: '590px', left: '110px' },
  ],
  scene4: [
    { text: "click to pick up the watering can, then hover over a plot + watch it grow!", top: '590px', left: '110px' },
    { text: "you can also use these to help your plants grow!", top: '92%', left: '50px' },
  ],
  scene6: [
    { text: "here's everything you've harvested so far!", top: '60%', left: '65%' },
  ],
  
};

function createHintBubble(text, top, left) {
  const bubble = document.createElement('div');
  bubble.className = 'hint-bubble';
  bubble.textContent = text;
  bubble.style.top = top;
  bubble.style.left = left;
  document.getElementById('sketch2').appendChild(bubble);
  setTimeout(() => bubble.remove(), 6000);
}

function subColumnX(plotIndex, colIndex) {
  const plotX = startX + plotIndex * (squareSize + gap);
  return plotX + (colIndex + 1) * (squareSize / (columnStops + 1));
}



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
  c.parent('sketch2');  
  angle = -PI / 2; 
  target = -PI / 2;
  computePlotLayout();
select('#rainBtn').mousePressed(toggleRain);
select('#dayNightBtn').mousePressed(toggleDayNight);
  prevBtn = document.getElementById('prev-scene');
  helpBtn = document.getElementById('helpBtn');
  plantCropsBtn = document.getElementById('plantCropsBtn');
  tendGardenBtn = document.getElementById('tendGardenBtn');
  backBtn = document.getElementById('back-scene');
  tendFromPlantBtn = document.getElementById('tend-from-plant');
  wheelbarrowBtn = document.getElementById('wheelbarrowBtn');
  keepPlayingBtn = document.getElementById('keepPlayingBtn');
returnHomeBtn = document.getElementById('returnHomeBtn');

if (helpBtn) {
  helpBtn.addEventListener('click', () => {
    showAllHintsForCurrentScene();
  });
}
 
if (keepPlayingBtn) {
  keepPlayingBtn.addEventListener('click', () => {
    const winModal = document.getElementById('winModal');
    if (winModal) winModal.style.display = 'none';
  });
}
 
if (returnHomeBtn) {
  returnHomeBtn.addEventListener('click', () => {
    const winModal = document.getElementById('winModal');
    if (winModal) winModal.style.display = 'none';
    resetFarm();
  });
}
setupSeedCards();

if (backBtn) {
  backBtn.addEventListener('click', () =>{
    scene = 'scene3';
    updateSceneUI();
  })
}

if (tendFromPlantBtn) {
  tendFromPlantBtn.addEventListener('click', () => {
    scene = 'scene4';
    updateSceneUI();
  });
}

 
if (wheelbarrowBtn) {
  wheelbarrowBtn.addEventListener('click', () => {
    scene = 'scene6';
    updateSceneUI();
  });
}

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scene = 'scene2';
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
    if (scene === 'scene5') {
      if (selectedPlotIndex !== -1 && counts[selectedPlotIndex] < columnStops) {
        counts[selectedPlotIndex]++;
        dugPlots[selectedPlotIndex] = true;
      }
    } else if (scene === 'scene4') {
      if (selectedPlotIndex !== -1 && growth[selectedPlotIndex] > 80) {
        harvestColumn(selectedPlotIndex);
      }
    }
    updateSceneUI();
  });
 
  const nameModal = document.getElementById('nameModal');
  const farmNameInput = document.getElementById('farmNameInput');
  const nameSubmitBtn = document.getElementById('nameSubmitBtn');
  const farmTitleEl = document.getElementById('farmTitle');
 
  function submitFarmName() {
    const typed = farmNameInput.value.trim();
    if (typed.length > 0) {
      farmName = typed;
      if (farmTitleEl) farmTitleEl.textContent = farmName;
    }
    farmNamed = true;
    if (nameModal) nameModal.style.display = 'none';
    scene = 'scene2';
    updateSceneUI();
  }
 
 
  if (nameSubmitBtn) {
    nameSubmitBtn.addEventListener('click', submitFarmName);
  }
  if (farmNameInput) {
    farmNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitFarmName();
    });
  }
}

if (wateringCanBtn) {
  wateringCanBtn.addEventListener('click', () => {
    if (scene === 'scene5') {
      if (selectedPlotIndex === -1) return;
      if (dugPlots[selectedPlotIndex] && leafcounts[selectedPlotIndex] < columnStops) {
        leafcounts[selectedPlotIndex]++;
        wateredPlots[selectedPlotIndex] = true;
      }
     updateSceneUI();
    } else if (scene === 'scene4') {
      // pick up / put down the can instead of an instant one-shot bump
      wateringCanActive = !wateringCanActive;
      wateringCanBtn.classList.toggle('active', wateringCanActive);
    }
  });
renderWheelbarrowIcon();
}
 

  if (tendGardenBtn) {
    tendGardenBtn.addEventListener('click', () => {
  scene = 'scene4';
  updateSceneUI();
});
   
    const prevBtn = document.getElementById('prev-scene');
    if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        scene = 'farm';
    });
    }
  }
updateSceneUI(); 
  }
}




function updateSceneUI() {
  plantCropsBtn.style.display = scene === 'scene2' ? 'block' : 'none';
  tendGardenBtn.style.display = scene === 'scene2' ? 'block' : 'none';
  shovelBtn.style.display = (scene === 'scene5' || scene === 'scene4') ? 'block' : 'none';
  wateringCanBtn.style.display = (scene === 'scene5' || scene === 'scene4') ? 'block' : 'none';
  const hasHarvested = Object.values(inventory).some(count => count > 0);
  wheelbarrowBtn.style.display = (scene === 'scene4' && hasHarvested) ? 'flex' : 'none';
  if (wheelbarrowBtn.style.display === 'flex' && !seenWheelbarrowHint) {
    seenWheelbarrowHint = true;
    createHintBubble("collect your harvest here", '28%', '86%');
  }
  backBtn.style.display = (scene === 'scene5') ? 'block' : 'none';
  tendFromPlantBtn.style.display =
  (scene === 'scene5' && selectedPlotIndex !== -1 && leafcounts[selectedPlotIndex] >= columnStops)
    ? 'block' : 'none';
 
 
  if (scene === 'scene5') plotStage = 'empty';
 
  if (scene !== 'scene4') {
    wateringCanActive = false;
    if (wateringCanBtn) wateringCanBtn.classList.remove('active');
  }

  if (scene !== lastHintScene) {
    showSceneHints(scene);
    lastHintScene = scene;
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
  for (let i = 0; i < plotCount; i++) {
    if (dugPlots[i]) {
      growth[i] = min(growth[i] + 10, maxGrowth);
    }
  }
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
  updateRainGrowth();
 
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
  } else if (scene === 'scene6') {
    drawScene6();
  }
}

function updateRainGrowth() {
  if (rain && frameCount % frameDelay === 0) {
    for (let i = 0; i < plotCount; i++) {
      if (dugPlots[i]) growth[i] = min(growth[i] + 1, maxGrowth);
    }
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

  drawHills(); 

  noStroke();
  fill(111, 237, 104);
  rect(0, 250, 1600, 400);

  drawBarn();
  drawFence();
 
  drawFenceSign(510, 330, 160, 40, farmName);
  drawBarnSign(1203, 230, 110, 30, farmName);
 

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

function drawFenceSign(x, y, w, h, signText) {
  push();
  translate(x, y);
  noStroke();
 

 
  // board
  fill(90, 60, 30);
  rect(-w / 2, -h, w, h, 2);
 
  // text
  noStroke();
  fill(224, 200, 157);
  textFont(font);
  textSize(17);
  textAlign(CENTER, CENTER);
  text(signText.toUpperCase(), 0, -h / 2);
 
  pop();
}
 

function drawBarnSign(x, y, w, h, signText) {
  push();
  translate(x, y);
  noStroke();
 
  fill(89, 16, 1);
  strokeWeight(3);
  rect(-w / 2, -h / 2, w, h, 2);
 
  noStroke();
  fill(224, 200, 157);
  textFont(font);
  textSize(15);
  textAlign(CENTER, CENTER);
  text(signText.toUpperCase(), 0, 0);
 
  pop();
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
  const endX = 960;   
  const postY = 280;
  const postH = 60;   
  const spacing = 50;

  stroke(90, 60, 30);
  strokeWeight(4);  

  // horizontal rails
  line(startX, postY + 15, endX, postY + 15);
  line(startX, postY + 35, endX, postY + 35);

  // vertical posts
  for (let x = startX; x <= endX; x += spacing) {
    line(x, postY, x, postY + postH);
  }
}


function drawBarn() {
  const bx = 1100;   
  const by = 210;    
  const bw = 200;  
  const bh = 100;

  stroke(255, 241, 219);
  strokeWeight(2);


  fill(178, 44, 44);
  rect(bx, by, bw, bh);


  fill(135, 34, 34);
  triangle(bx, by, bx + bw, by, bx + bw / 2, by - 40);


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

  drawHills();

  noStroke();
  fill(111, 237, 104);
  rect(0, 250, 1600, 400);

  drawBarn();
  drawFence();

  drawFenceSign(510, 330, 160, 40, farmName);
  drawBarnSign(1203, 230, 110, 30, farmName);
 

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
 
  background(139, 98, 61);
  noStroke();
  for (let y = 0; y < height; y += 40) {
    fill(148, 105, 66);
    rect(0, y, width, 38);
    fill(0, 0, 0, 20);
    rect(0, y + 36, width, 2); // plank seam shadow
  }

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


function drawCropIcon(label, targetX, targetY, targetSize, rotation = 0) {
  push();
  translate(targetX, targetY);
  rotate(rotation);

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

  if (scene === 'scene4') {
    for (let i = 0; i < plotCount; i++) {
      const px = startX + i * (squareSize + gap);
      if (mouseX > px && mouseX < px + squareSize && mouseY > y && mouseY < y + squareSize) {
        selectedPlotIndex = i;
      }
    }
  }
}



function drawScene4() {
  angle = lerp(angle, target, 0.03);
  let sky = lerpColor(color(25, 26, 102), color(130, 210, 255), map(sin(angle), -1, 1, 1, 0));
  if (rain) sky = lerpColor(sky, color(60, 60, 70), 0.6);
  background(sky);
 
  noStroke();
  fill(rain ? color(180, 170, 100) : color(255, 227, 43));
  ellipse(1000 + cos(angle) * 200, 270 + sin(angle) * 200, 90);
  fill(240, 240, 221);
  let mx = 400 - cos(angle) * 200, my = 270 - sin(angle) * 200;
  ellipse(mx, my, 90);
  fill(sky);
  circle(mx + 30, my - 10, 89);
 
  drawHills();
  noStroke();
  fill(111, 237, 104);
  rect(0, 230, 1600, 400);
 
  drawGardenPlot();
 
  hoveredPlot = getHoveredPlot();
 
  
  if (wateringCanActive && hoveredPlot !== -1 && dugPlots[hoveredPlot]) {
    const px = startX + hoveredPlot * (squareSize + gap);
    noFill();
    stroke(120, 200, 255, 180);
    strokeWeight(4);
    rect(px, y, squareSize, squareSize, 10);
    noStroke();
 

    if (frameCount % frameDelay === 0) {
      growth[hoveredPlot] = min(growth[hoveredPlot] + 1, maxGrowth);
    }
  }
 
  for (let i = 0; i < plotCount; i++) {
    if (dugPlots[i]) drawDirtMound(i);
    if (wateredPlots[i]) growLeaves(i);
    if (dugPlots[i]) drawMaturePlant(i);
  }
 
  if (rain) { particles.push(new Particle()); particles.push(new Particle()); particles.push(new Particle()); }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(); particles[i].show();
    if (particles[i].isFinished()) particles.splice(i, 1);
  }
 
  if (wateringCanActive) {
    push();
    stroke(1)
    strokeWeight(0.8);
    fill(94, 171, 84);
   ellipse(mouseX+12, mouseY+12, 11);
    rect(mouseX + 12, mouseY + 12, 14, 15,2);
    push();
    translate(mouseX + 20, mouseY + 15);
    rotate(-0.5)
    rect(0, 0, 14, 5, 2);
    pop();
    pop();

  }
  if (!seenHarvestHint && growth.some(g => g > 80)) {
    seenHarvestHint = true;
    createHintBubble("select a completed plot, then dig to harvest it!", '510px', '110px');
  }
}
 
function getHoveredPlot() {
  for (let i = 0; i < plotCount; i++) {
    const px = startX + i * (squareSize + gap);
    if (mouseX > px && mouseX < px + squareSize && mouseY > y && mouseY < y + squareSize) {
      return i;
    }
  }
  return -1;
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
  if (rain) sky = lerpColor(sky, color(60, 60, 70), 0.6);
  background(sky);
 
  noStroke();
  let sun = rain ? color(180, 170, 100) : color(255, 227, 43);
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
  for (let i = 0; i < plotCount; i++) {
    if (dugPlots[i]) drawDirtMound(i);
    if (wateredPlots[i]) growLeaves(i);
    if (dugPlots[i]) drawMaturePlant(i);   // <-- added: keeps growth in sync with scene4
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



function drawDirtMound(i) {
  const target = counts[i] * totalDirt;
 
  if (counts[i] > 0) {
  
    if (frameCount % frameDelay === 0 && dirtProgress[i] < target) {
      dirtProgress[i]++;
    }
    dirtAlpha[i] = 255; 
 
  } else {
    if (frameCount % frameDelay === 0 && dirtAlpha[i] > 0) {
      dirtAlpha[i] = max(dirtAlpha[i] - 25, 0);
    }
  }
 
  fill(117, 73, 42, dirtAlpha[i]);
 
  for (let n = 0; n < dirtProgress[i]; n++) {
    const col = Math.floor(n / totalDirt);
    const row = n % totalDirt;
    const cx = subColumnX(i, col);
    ellipse(cx, 505 - row * dirtGap, 30, 15);
  }
 
  
  if (counts[i] === 0 && dirtAlpha[i] === 0 && leafProgress[i] === 0 && dugPlots[i]) {
    dugPlots[i] = false;
    wateredPlots[i] = false;
    growth[i] = 0;
    dirtProgress[i] = 0;
    dirtAlpha[i] = 255;
  }
}
 
 


function growLeaves(i) {
  const target = leafcounts[i] * totalDirt;
  if (frameCount % frameDelay === 0) {
    if (leafProgress[i] < target) leafProgress[i]++;
    else if (leafProgress[i] > target) leafProgress[i]--;
  }
 
  for (let n = 0; n < leafProgress[i]; n++) {
    const col = Math.floor(n / totalDirt);
    const row = n % totalDirt;
    const cx = subColumnX(i, col);
    push();
    translate(cx, 502 - row * dirtGap);
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



function drawMaturePlant(i) {
  const g = growth[i];
  if (g <= 0) return;

  const combos = [];
  for (let n = 0; n < leafProgress[i]; n++) {
    const col = Math.floor(n / totalDirt);
    const row = n % totalDirt;
    combos.push({
      cx: subColumnX(i, col),
      baseY: 502 - row * dirtGap
    });
  }
 

  combos.sort((a, b) => a.baseY - b.baseY);
 
  for (const combo of combos) {
    drawGrowthStage(combo.cx, combo.baseY, g, i);
  }
}
 
 

function drawGrowthStage(cx, baseY, g, plotIndex) {
  const crop = plotCrops[plotIndex];
 
  if (crop === 'tomatoes') {
    drawTomatoGrowth(cx, baseY, g);
  } else if (crop === 'carrots') {
    drawCarrotGrowth(cx, baseY, g);
  } else if (crop === 'cabbage') {
    drawCabbageGrowth(cx, baseY, g);
  } else if (crop === 'sunflower') {
    drawSunflowerGrowth(cx, baseY, g);
  }
}

function drawTomatoGrowth(cx, baseY, g) {
  if (g <= 20) {
    fill('green');
    ellipse(cx, baseY - 14, 3, 20);
 
  } else if (g <= 40) {
    fill('green');
    ellipse(cx, baseY - 14, 3, 20);
    fill(90, 189, 79);
    ellipse(cx, baseY - 18, 8, 9);
 
  } else if (g <= 60) {
    fill('green');
    ellipse(cx, baseY - 14, 4, 30);
    fill(90, 189, 79);
    ellipse(cx, baseY - 27, 9, 10);
 
  } else if (g <= 80) {
    fill('green');
    ellipse(cx, baseY - 12, 4, 34);
    fill(150, 200, 120);
    ellipse(cx, baseY - 34, 14, 18);
 
  } else {
    fill('green');
    ellipse(cx, baseY - 12, 4, 34);
    fill(150, 200, 120);
     drawCropIcon('tomatoes', cx, baseY-35, 20);
    drawCropIcon('tomatoes', cx+5, baseY -20, 20);
  }
}
 
 
 

function drawCarrotGrowth(cx, baseY, g) {
  if (g <= 20) {
    fill(90, 189, 79);
    ellipse(cx, baseY - 5, 3, 14);
 
  } else if (g <= 40) {
    fill(90, 189, 79);
    push();
    translate(cx, baseY - 10);
    rotate(0.2);
    ellipse(3, 1, 4, 14);
    rotate(-0.2)
    ellipse(0, 0, 4, 18);
    rotate(-0.2)
    ellipse(-3, 1, 4, 14);
    pop();
 
  } else if (g <= 60) {
    fill(90, 189, 79);
    push();
    translate(cx, baseY - 18);
    ellipse(0, 0, 5, 24)
    rotate(-0.2);
    ellipse(-5, 5, 5, 24);
    rotate(0.4);
    ellipse(5, 5, 5, 24);
    rotate(-0.4);
    ellipse(8, 3, 4, 16);
    rotate(0.4);
    ellipse(-8, 3, 4, 16);
    pop();
 
  } else if (g <= 80) {
     fill(90, 189, 79);
    push();
    translate(cx, baseY - 18);
    ellipse(0, 0, 5, 24)
    rotate(-0.2);
     fill(71, 148, 59);
    ellipse(-5, 5, 5, 24);
    rotate(0.4);
    ellipse(5, 5, 5, 24);
    rotate(-0.4);
     fill(90, 189, 79);
    ellipse(8, 5, 4, 16);
    rotate(0.4);
    ellipse(-8, 5, 4, 16);
    pop();
    fill(227, 148, 48);
    ellipse(cx, baseY, 10, 6);
 
  } else {
    fill(90, 189, 79);
    push();
    translate(cx, baseY - 24);
    ellipse(0, 0, 8, 42)
    rotate(-0.2);
    fill(71, 148, 59);
    ellipse(-5, 5, 8, 36);
    rotate(0.4);
    ellipse(5, 5, 8, 36);
    rotate(-0.4);
    fill(90, 189, 79);
    ellipse(10, -2, 6, 16);
    rotate(0.4);
    ellipse(-10, -2, 6, 16);
    pop();
    fill(227, 148, 48);
    ellipse(cx, baseY + 2, 20, 8);
 
  }
}
 

 
function drawCabbageGrowth(cx, baseY, g) {
  if (g <= 20) {
    fill(90, 155, 75);
    ellipse(cx, baseY - 4, 10, 6);
 
  } else if (g <= 40) {
    fill(90, 155, 75);
    ellipse(cx - 6, baseY - 4, 14, 8);
    ellipse(cx + 6, baseY - 4, 14, 8);
 
  } else if (g <= 60) {
    fill(90, 155, 75);
    ellipse(cx - 10, baseY - 6, 18, 10);
    ellipse(cx + 10, baseY - 6, 18, 10);
    ellipse(cx, baseY - 10, 16, 10);
 
  } else if (g <= 80) {
    fill(90, 155, 75);
    ellipse(cx - 12, baseY - 8, 20, 12);
    ellipse(cx + 12, baseY - 8, 20, 12);
    fill(150, 200, 100);
    ellipse(cx, baseY - 12, 18, 18);
 
  } else {
     fill(90, 155, 75);
    ellipse(cx - 12, baseY - 8, 20, 12);
    ellipse(cx + 12, baseY - 8, 20, 12);
    fill(150, 200, 100);
    ellipse(cx, baseY - 12, 18, 18);
    drawCropIcon('cabbage', cx, baseY - 10, 42);
  }
}
 

function drawSunflowerGrowth(cx, baseY, g) {
  if (g <= 20) {
    fill('green');
    ellipse(cx, baseY - 14, 3, 26);
 
  } else if (g <= 40) {
    fill('green');
    ellipse(cx, baseY - 14, 4, 34);
    fill(90, 189, 79);
    ellipse(cx + 6, baseY - 26, 10, 6);
 
  } else if (g <= 60) {
    fill('green');
    ellipse(cx, baseY - 14, 2, 46);
    fill(90, 189, 79);
    ellipse(cx - 7, baseY - 26, 12, 7);
    ellipse(cx + 7, baseY - 34, 12, 7);
 
  } else if (g <= 80) {
    fill('green');
    ellipse(cx, baseY - 24, 5, 60);
    fill(90, 189, 79);
    ellipse(cx - 7, baseY - 34, 12, 7);
    ellipse(cx + 7, baseY - 46, 12, 7);
    fill(150, 200, 120);
    ellipse(cx, baseY - 50, 12, 18);
    fill(247, 216, 79);
    ellipse(cx - 6, baseY - 56, 8, 5);
    ellipse(cx + 6, baseY - 56, 8, 5);
    ellipse(cx, baseY - 60, 8, 5);
 
  } else {
    fill('green');
    ellipse(cx, baseY - 24, 5, 60);
    fill(90, 189, 79);
    ellipse(cx - 7, baseY - 34, 12, 7);
    ellipse(cx + 7, baseY - 46, 12, 7);
    drawCropIcon('sunflower', cx, baseY - 46, 42);
  }
}



function harvestColumn(i) {
  if (leafcounts[i] > 0) {
    leafcounts[i]--;
    inventory[plotCrops[i]]++; 
  }
 
  if (leafcounts[i] <= 0) {
    leafcounts[i] = 0;
    counts[i] = 0;
  }
}

function drawScene6() {
  drawFarmScene()
  
  drawWheelbarrow(width / 2, 250, 2);
 
  if (!seenWinModal && Object.values(inventory).every(count => count > 0)) {
    seenWinModal = true;
    const winModal = document.getElementById('winModal');
    if (winModal) winModal.style.display = 'block';
  }
  
}
 


function drawWheelbarrow(cx, cy, s = 1) {
  push();
  translate(cx, cy);
  scale(s);
  noStroke();
 
  // wheel
  fill(60, 40, 20);
  ellipse(-33, 115, 42, 65);
  fill(140, 100, 60);
  ellipse(-33, 117, 15, 30)
 
  // legs
  stroke(90, 60, 30);
  strokeWeight(6);
  line(0, 50, 30, 110);
  line(60, 55, 30, 110);
 
  // handles
  stroke(90, 60, 30);
  strokeWeight(8);
  line(85, 5, 120, -30);
  line(5, -3, 35, -48);
 
  // bed (trapezoid)
  stroke(105, 132, 194);
  strokeWeight(12);
  strokeJoin(ROUND);
  fill(105, 132, 194);
 
  beginShape();
  vertex(-110, 30);
  vertex(82, 5);
  vertex(60, 50);
  vertex(-15, 105);
  vertex(-75, 90)
  endShape(CLOSE);
 
  stroke(39, 72, 140);
  strokeWeight(12);
  strokeJoin(ROUND);
  fill(39, 72, 140);
  quad(-110, 30, 3, -5, 82, 5, -15, 55)
 
  
  const pileCenters = {
    sunflower: { x: -50, y: 32 },
    tomatoes:   { x: 8,   y: 30 },
    carrots:   { x: -22, y: 41 },
    cabbage:  { x: -20, y: 15 },
  };
 
  const clusterOffsets = [
    { dx: -8, dy: -6 },
    { dx:  4, dy: -2 },
    { dx: -6, dy:  8 },
    { dx:  7, dy:  7 },
  ];
 

  const drawOrder = ['cabbage', 'tomatoes', 'carrots', 'sunflower'];
 
  const carrotRotations = [0.45, 0.55, 0.45, 0.65];
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(-110, 30);
  drawingContext.lineTo(-5,-20);
  drawingContext.lineTo(82, 5);
  drawingContext.lineTo(-15, 55);
  drawingContext.closePath();
  drawingContext.clip();
 
  for (const crop of drawOrder) {
    if (inventory[crop] <= 0) continue; 
    const center = pileCenters[crop];
    clusterOffsets.forEach((offset, idx) => {
      const rotation = crop === 'carrots' ? carrotRotations[idx] : 0;
      drawCropIcon(crop, center.x + offset.dx, center.y + offset.dy, 22, rotation);
    });
  }
 
  drawingContext.restore();

 
}
 
function renderWheelbarrowIcon() {
  const size = 60;
  const s = 0.22; 
 
  
  const boundsCenterX = 5;
  const boundsCenterY = 51;
 
  const pg = createGraphics(size, size);
  pg.push();
  pg.translate(size / 2 - boundsCenterX * s, size / 2 - boundsCenterY * s);
  pg.scale(s);
  pg.noStroke();
 
  // wheel
  pg.fill(60, 40, 20);
  pg.ellipse(-33, 115, 42, 65);
  pg.fill(140, 100, 60);
  pg.ellipse(-33, 117, 15, 30);
 
  // legs
  pg.stroke(90, 60, 30);
  pg.strokeWeight(6);
  pg.line(0, 50, 30, 110);
  pg.line(60, 55, 30, 110);
 
  // handles
  pg.stroke(90, 60, 30);
  pg.strokeWeight(8);
  pg.line(85, 5, 120, -30);
  pg.line(5, -3, 35, -48);
 
  // bed (trapezoid)
  pg.stroke(105, 132, 194);
  pg.strokeWeight(12);
  pg.strokeJoin(ROUND);
  pg.fill(105, 132, 194);
  pg.beginShape();
  pg.vertex(-110, 30);
  pg.vertex(82, 5);
  pg.vertex(60, 50);
  pg.vertex(-15, 105);
  pg.vertex(-75, 90);
  pg.endShape(CLOSE);
 
  // bed shading (darker blue quad)
  pg.stroke(39, 72, 140);
  pg.strokeWeight(12);
  pg.strokeJoin(ROUND);
  pg.fill(39, 72, 140);
  pg.quad(-110, 30, 3, -5, 82, 5, -15, 55);
 
  pg.pop();
 
  const iconEl = document.getElementById('wheelbarrowIcon');
  if (iconEl) iconEl.src = pg.canvas.toDataURL();
}
 
function showSceneHints(scene) {
  clearSceneHints();
 
  if (seenScenes[scene]) return;
  const hints = sceneHints[scene];
  if (!hints) return;
 
  seenScenes[scene] = true;
 
  for (const hint of hints) {
    const bubble = document.createElement('div');
    bubble.className = 'hint-bubble';
    bubble.textContent = hint.text;
    bubble.style.top = hint.top;
    bubble.style.left = hint.left;
    document.getElementById('sketch2').appendChild(bubble);
  }
 
  hintTimeout = setTimeout(clearSceneHints, 6000);
}
 
function clearSceneHints() {
  document.querySelectorAll('.hint-bubble').forEach(el => el.remove());
  clearTimeout(hintTimeout);
}

function resetFarm() {
  for (let i = 0; i < plotCount; i++) {
    dugPlots[i] = false;
    wateredPlots[i] = false;
    counts[i] = 0;
    leafcounts[i] = 0;
    dirtProgress[i] = 0;
    leafProgress[i] = 0;
    dirtAlpha[i] = 255;
    growth[i] = 0;
  }
 
  inventory = { sunflower: 0, carrots: 0, cabbage: 0, tomatoes: 0 };
 
  farmNamed = false;
  seenWinModal = false;
  seenScenes = {};
  lastHintScene = null;
  seenTendHint = false;
  seenWheelbarrowHint = false;
  seenHarvestHint = false;
 
  scene = 'farm';
 

  const nameModal = document.getElementById('nameModal');
  const farmNameInput = document.getElementById('farmNameInput');
  const farmTitleEl = document.getElementById('farmTitle');
  if (nameModal) nameModal.style.display = 'flex'; // ask for a new farm name
  if (farmNameInput) farmNameInput.value = '';
  if (farmTitleEl) farmTitleEl.textContent = 'my farm';
 
  updateSceneUI();
}

function showAllHintsForCurrentScene() {
  clearSceneHints(); 
 

  const hints = sceneHints[scene];
  if (hints) {
    for (const hint of hints) {
      createHintBubble(hint.text, hint.top, hint.left);
    }
  }
 
 
  }
  if (wheelbarrowBtn.style.display === 'flex') {
    createHintBubble("collect your harvest here", '22%', '86%');
  }
  if (scene === 'scene4' && growth.some(g => g > 80)) {
    createHintBubble("select a completed plot, then dig to harvest it!", '510px', '110px');
  }

 