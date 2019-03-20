const Xpix = 48;
const Ypix = 48;

const scale = 18; // only natural numbers
const xSize = Xpix * scale;
const ySize = Ypix * scale;
const pixSize = xSize / Xpix;
const maxFrames = 20;
const socket = io();
let currentFrame = 0;
let pixel = 1;
let newFrame = false;
let fillGridWithPixels = false;
let fillGridWithPixelsLocation = 0;
let clearCanvas = false;
let updateFramePos = false;
let animation;

const emptyframeArray = () => {
  let arr = [];
  for (let i = 0; i < Ypix; i++) arr.push(new Array(Xpix).fill(0)) //filling frame array with 0s
  return arr;
}

let frames = [emptyframeArray()]

const exportFrame = () => {
  socket.emit('frames', { frames, interval: getFrameInterval() });
}

const makeButtonBold = (button) => {
  Array.from(document.getElementsByClassName('pixel'))[button].id = "bold"
  Array.from(document.getElementsByClassName('pixel'))[Math.abs(button - 1)].id = ""
}

function setup() {
  createCanvas(xSize + 1, ySize + 1);
  for (let i = 0; i <= xSize; i += pixSize) line(i, 0, i, ySize);
  for (let i = 0; i <= ySize; i += pixSize) line(0, i, xSize, i);
  noStroke();
  fill(color(255, 0, 0));
}

window.onload = () => {
  document.getElementById('numberFrames').innerHTML = `Frame: ${currentFrame} / ${maxFrames}`;
}

const otherFrame = (direction, frame) => {
  let res;
  if (!direction) {
    currentFrame = frame;
    clearCanvas = true;
    fillGridWithPixels = true;
    updateFramePos = true;
    fillGridWithPixelsLocation = frame;

  } else {
    res = currentFrame + direction;
    if (res <= frames.length - 1 && res >= 0) {
      currentFrame = res;
      clearCanvas = true;
      fillGridWithPixels = true;
      updateFramePos = true;
      fillGridWithPixelsLocation = res;
    }
  }
}

function getFrameInterval() {
  let interval = document.getElementById("frameTimeVal").value;
  if (interval.match(/[a-z]/i)) return 700
  interval = interval.replace(/\,/g, '.');
  interval = parseFloat(interval);
  if (interval < 0.05) return 700

  interval *= 1000;
  return interval;
}

const playAnimation = () => {
  animation = undefined;
  let interval = getFrameInterval()
  let frameToDisplay = 0;

  animation = setInterval(() => {
    if (frameToDisplay < frames.length) {
      otherFrame(undefined, frameToDisplay);
      frameToDisplay++;
    } else {
      otherFrame(undefined, 0);
      frameToDisplay = 1;
    }
  }, interval);
}


const saveAnimation = () => {
  let res = {
    arr: frames,
    name: prompt('Filename to save', 'Only letters')
  }
  socket.emit('saveAnimation', res)
}

const makeNewFrame = () => {
  clearCanvas = 1;
  newFrame = 1;
  fillGridWithPixels = 1;
  updateFramePos = 2;
  fillGridWithPixelsLocation = currentFrame
}

function draw() {
  if (clearCanvas) {
    clear();
    stroke(0, 0, 0);
    for (let i = 0; i <= xSize; i += pixSize) line(i, 0, i, ySize);
    for (let i = 0; i <= ySize; i += pixSize) line(0, i, xSize, i);
    noStroke();
    clearCanvas = false;
  }

  if (newFrame) {
    if (currentFrame + 1 < maxFrames) { // TODO
      currentFrame++;
      frames.push(emptyframeArray())
    }
    newFrame = false;
  }

  if (updateFramePos) {
    document.getElementById('numberFrames').innerHTML = `Frame:  ${currentFrame} / ${maxFrames}`;
    updateFramePos = false;
  }

  if (fillGridWithPixels) {
    fill(color(255, 165, 165)); // light red
    console.log('fillGridWithPixelsLocation', fillGridWithPixelsLocation);
    frames[fillGridWithPixelsLocation].forEach((y, indexY) => {
      y.forEach((x, indexX) => {
        if (x) {
          rect(indexX * pixSize + 1, indexY * pixSize + 1, pixSize - 1, pixSize - 1);
          // debugger;
        }
      });
    });
    fillGridWithPixels = false;
  }

  if (mouseX <= xSize || mouseY <= ySize) {
    let x = Math.floor(mouseX / scale);
    let y = Math.floor(mouseY / scale);
    if (
      y >= 0 &&
      y < Ypix &&
      x >= 0 &&
      x < Xpix
    ) {
      document.getElementById("matrixPos").innerHTML = `Postition: (${Math.floor(mouseX / scale)}, ${Math.floor(mouseY / scale)})`
      if (mouseIsPressed) {
        if (pixel) fill(color(255, 0, 0));
        else {
          if (frames[currentFrame][y][x]) fill(color(255, 165, 165))
          else fill(color(255, 255, 255))
        }
        frames[currentFrame][y][x] = pixel;
        x *= pixSize;
        y *= pixSize;
        rect(x + 1, y + 1, pixSize - 1, pixSize - 1);
      }
    } else document.getElementById("matrixPos").innerHTML = "Postition: (, )"

  }
}
