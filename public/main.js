const Xpix = 48
const Ypix = 48

const scale = 18 // only natural numbers
const xSize = Xpix * scale
const ySize = Ypix * scale
const pixSize = xSize / Xpix

const colors = {
	red: 'rgb(255, 0, 0)',
	lightRed: 'rgb(255, 165, 165)',
	white: 'rgb(90, 90, 90)'
}

let currentFrame = 0

let pixelVal = 1 // pixel on or off
let clearCanvas = false
let brushSize = 1
let printFrame = {
	print: false,
	color: colors.red,
	framesIndex: 0
}
let frames = []

function getEmptyFrame() {
	let frame = []
	for (let y = 0; y < Ypix; y++) {
		frame.push([])
		for (let x = 0; x < Xpix; x++) {
			frame[y][x] = 0
		}
	}
	return frame
}

frames[0] = getEmptyFrame()

function updatePixelVal(val) {
	pixelVal = val
	document.getElementById('enablePixel').className = val === 0 ? 'bold' : ''
	document.getElementById('disablePixel').className = val === 1 ? 'bold' : ''
}

const maxBrushSize = Math.max(Xpix, Ypix)
function updateBrushSize() {
	let brushSizeVal = document.getElementById('brushSizeVal')
	let input = brushSizeVal.value
	if (input.replace('.', '').match(/\D/i)) {
		brushSizeVal.value = 1
		brushSize = 1
		return
	}
	input = parseInt(input)
	if (input > maxBrushSize) {
		brushSizeVal.value = maxBrushSize
		brushSize = maxBrushSize
		return
	}

	brushSize = input
}
updateBrushSize()

function getFrameInterval() {
	let interval = document.getElementById('frameTimeVal').value
	if (interval.replace('.', '').match(/\D/i)) return 700
	interval = interval.replace(/\,/g, '.')
	interval = parseFloat(interval)
	// if (interval < 0.05) return 1000

	interval *= 1000
	return interval
}

function showOtherFrame(direction) {
	let newFrame = currentFrame + direction
	if (newFrame > frames.length - 1) newFrame = 0
	if (newFrame < 0) newFrame = frames.length - 1
	currentFrame = newFrame

	printFrame = {
		print: true,
		color: colors.red,
		index: newFrame
	}
}

let animationInterval
function playAnimation(animation) {
	let interval
	if (animation) {
		frames = animation.frames
		currentFrame = 0
		interval = animation.interval
		printf(`Showing "${animation.name}"`)
	}
	else interval = getFrameInterval()

	if (animationInterval) clearInterval(animationInterval)
	showOtherFrame(1)
	animationInterval = setInterval(() => {
		showOtherFrame(1)
	}, interval)
}

function stopAnimation() {
	if (animationInterval) clearInterval(animationInterval)
}

function makeNewFrame() {
	frames.push(getEmptyFrame())
	printFrame = {
		print: true,
		color: colors.lightRed,
		index: currentFrame
	}
	currentFrame++
	document.getElementById('numberFrames').innerHTML = `Frame: ${currentFrame + 1} / ${frames.length}`
}

function printf(str) {
	document.getElementById('console').innerHTML += `$ ${str}<br>`
}

function setup() {
	createCanvas(xSize + 1, ySize + 1)
	noStroke()
	fill(colors.red)
}

function draw() {
	if (printFrame.print) {
		clear()
		fill(printFrame.color)

		for (let y = 0; y < Ypix; y++) {
			for (let x = 0; x < Xpix; x++) {
				if (frames[printFrame.index][y][x] === 1) {
					ellipse(x * scale + (0.5 * pixSize), y * scale + (0.5 * pixSize), pixSize)
				}
			}
		}
		printFrame.print = false
	}

	let x = Math.round(mouseX / scale)
	let y = Math.round(mouseY / scale)
	if (
		y >= 0 &&
		y < Ypix &&
		x >= 0 &&
		x < Xpix
	) {
		document.getElementById('matrixPos').innerHTML = `Postition: (${x}, ${y})`
		if (mouseIsPressed) {
			fill(pixelVal === 1 ? colors.red : colors.white)
			if (brushSize === 1) {
				frames[currentFrame][y][x] = pixelVal

				ellipse(x * scale + (0.5 * pixSize), y * scale + (0.5 * pixSize), pixSize)
			} else {
				let left = Math.floor(brushSize / 2)
				let right = Math.ceil(brushSize / 2)

				for (let y2 = Math.max(0, y - left); y2 < Math.min(Ypix, y + right); y2++) {
					for (let x2 = Math.max(0, x - left); x2 < Math.min(Xpix, x + right); x2++) {
						frames[currentFrame][y2][x2] = pixelVal
						ellipse(x2 * scale + (0.5 * pixSize), y2 * scale + (0.5 * pixSize), pixSize)
					}
				}

			}
		}
	} else document.getElementById('matrixPos').innerHTML = 'Postition: (, )'
}
