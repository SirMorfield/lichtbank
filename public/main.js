const Xpix = 48;
const Ypix = 48;

const scale = 18; // only natural numbers
const xSize = Xpix * scale;
const ySize = Ypix * scale;
const pixSize = xSize / Xpix;

const socket = io();
let currentFrame = 0;
let pixel = 1;
let newFrame = false;
let fillGridWithPixels = false;
let fillGridWithPixelsLocation = 0;
let clearCanvas = false;
let updateFramePos = false;
let animation;
let brushSize = 1

socket.on('upload', (i2cArray) => {
	console.log('uploading', JSON.stringify(i2cArray))
})

const emptyFrameArray = () => {
	let arr = []
	for (let i = 0; i < Ypix; i++) arr.push(new Array(Xpix).fill(0)) //filling frame array with 0s
	return arr
}

let frames = [emptyFrameArray()]

const exportFrame = () => {
	socket.emit('frames', { frames, interval: getFrameInterval() });
}

const makeButtonBold = (button) => {
	Array.from(document.getElementsByClassName('pixel'))[button].id = "bold"
	Array.from(document.getElementsByClassName('pixel'))[Math.abs(button - 1)].id = ""
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
		name: prompt('Filename to save', 'Only letters'),
		interval
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

function setup() {
	createCanvas(xSize + 1, ySize + 1);
	noStroke();
	fill(color(255, 0, 0));
}

function draw() {
	if (clearCanvas) {
		clear();
		noStroke();
		clearCanvas = false;
	}

	if (newFrame) {
		currentFrame++;
		frames.push(emptyFrameArray())
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
					ellipse(indexX * pixSize + 1 + (0.5 * pixSize), indexY * pixSize + 1 + (0.5 * pixSize), pixSize);
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
			document.getElementById("matrixPos").innerHTML = `Postition: (${x}, ${y})`
			if (mouseIsPressed) {
				fill(color(255, 0, 0));
				if (frames[currentFrame][y][x] === 1) fill(color(255, 165, 165))
				else fill(color(255, 255, 255))

				x *= pixSize;
				y *= pixSize;
				if (brushSize > 1) {
					let offset = Math.floor(brushSize / 2)
					for (let y2 = y - offset; y2 < brushSize; y2++) {
						for (let x2 = x - offset; x2 < brushSize; x2++) {
							frames[currentFrame][y2][x2] = 1;
							ellipse(x2 + 1 + (0.5 * pixSize), y2 + 1 + (0.5 * pixSize), pixSize - 1);
						}
					}
				} else {
					frames[currentFrame][y][x] = 1;
					ellipse(x + 1 + (0.5 * pixSize), y + 1 + (0.5 * pixSize), pixSize - 1);
				}
			}
		} else document.getElementById("matrixPos").innerHTML = "Postition: (, )"

	}
}
