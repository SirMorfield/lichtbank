const scale = 12; //only whole numbers
const Ypix = 72; //72
const Xpix = 48;
const xSize = Xpix * scale;
const ySize = Ypix * scale;
const pixSize = xSize / Xpix;
const maxFrames = 20;
const socket = io();
let currentFrame = 0;
let pixel = 1;
var p5 = new p5();
let newFrame = false;
let fillGridWithPixels = false;

const emptyframeArray = () => {
  let arr = [];
  for (let i = 0; i < Ypix; i++) arr.push(new Array(Xpix).fill(0)) //filling frame array with 0s
  return arr;
}

let frames = [emptyframeArray()]

const exportFrame = () => {
  let res = `const PROGMEM int frame1[${Ypix}][${Xpix}] = `;
  res += JSON.stringify(frames).replace(/\[/g, '{').replace(/\]/g, '}')
  res += ';'
  console.log(res);
  socket.emit('frame', res);
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
  document.getElementById('numberFrames').innerHTML = `Frame:  ${currentFrame + 1} / ${maxFrames}`;
}

let prevX;
let prevY;
function draw() {
  if (newFrame) {
    if (currentFrame + 1 < maxFrames) {
      clear();
      stroke(0, 0, 0);
      for (let i = 0; i <= xSize; i += pixSize) line(i, 0, i, ySize);
      for (let i = 0; i <= ySize; i += pixSize) line(0, i, xSize, i);
      noStroke();
      currentFrame++
      frames.push(emptyframeArray())
      newFrame = false;
      document.getElementById('numberFrames').innerHTML = `Frame:  ${currentFrame + 1} / ${maxFrames}`;
    } else { }
  }

  if (fillGridWithPixels) {
    fill(color(255, 117, 117));
    // debugger
    frames[currentFrame - 1].forEach((y, indexY) => {
      y.forEach((x, indexX) => {
        if (x) {
          rect(indexX * pixSize + 1, indexY * pixSize + 1, pixSize - 1, pixSize - 1);
          // debugger;
        }
      });
    });
    fillGridWithPixels = false;
  }

  if (mouseIsPressed) {
    if (mouseX <= xSize || mouseY <= ySize) {
      let x = Math.floor(mouseX / scale);
      let y = Math.floor(mouseY / scale);
      if (
        y >= 0 &&
        y < Ypix &&
        x >= 0 &&
        x < Xpix
      ) {
        if (pixel) fill(color(255, 0, 0));
        else {
          if (frames[currentFrame - 1][y][x]) fill(color(255, 117, 117))
          else fill(color(255, 255, 255))
        }
        frames[currentFrame][y][x] = pixel;
        x *= pixSize;
        y *= pixSize;
        rect(x + 1, y + 1, pixSize - 1, pixSize - 1);
      }
    }
  }
}
