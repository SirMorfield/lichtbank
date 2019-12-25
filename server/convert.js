const writeToArduino = require('./writeToArduino.js')
const frameDB = require('./frameDB.js')

const Ypix = 48
const Xpix = 48
const uploadDuration = 300

let analogs
async function init() {
	analogs = await frameDB.getAnalogs(Xpix)
	analogs = analogs.map(serializeFrame)
}

function serializeFrame(frame) {
	let bitArray = []
	for (let column = 0; column < 8; column++) {
		for (let panel = Ypix / 8 - 1; panel >= 0; panel--) {
			if (panel % 2 == 1) {
				for (let block = 0; block < 6; block++) {
					for (let y = 0; y < 8; y++) {
						let x = (7 - column) + (block * 8)
						bitArray.push(frame[y + (panel * 8)][x])
					}
				}
			} else {
				for (let block = 0; block < 6; block++) {
					for (let y = 7; y >= 0; y--) {
						let x = Xpix - 1 - (7 - column) - (block * 8)
						bitArray.push(frame[y + (panel * 8)][x])
					}
				}
			}
			for (let i = 0; i < 8; i++) {
				if (i == column) bitArray.push(0)
				else bitArray.push(1)
			}
		}
	}

	let byteArray = [];
	for (let i = 0; i < bitArray.length; i += 8) {
		let byte = ''
		for (let bit = 0; bit < 8; bit++) {
			byte += String(bitArray[bit + i])
		}
		byte = parseInt(byte, 2)
		byteArray.push(byte)
	}

	return byteArray;
}

let writeTimeTimeout
async function writeTime(loop = false, timeStamp = Date.now()) {
	if (writeTimeTimeout) clearTimeout(writeTimeTimeout)

	const d = new Date(timeStamp)
	let minsIntoDay = ((d.getHours() + 1) * 60) + d.getMinutes()
	let index = minsIntoDay % 720
	await writeToArduino(analogs[index])

	if (loop) {
		writeTimeTimeout = setTimeout(() => {
			writeTime(true)
		}, 10000 - uploadDuration)
	}
}

async function playAnimation(bytes, interval, framePos = 0) {
	await writeToArduino(bytes[framePos])

	if (bytes.length > 1) {
		if (++framePos > serializedFrames.length - 1) framePos = 0
		animationTimeout = setTimeout(() => {
			playAnimation(bytes, interval, framePos)
		}, interval);
	}
}

let animationTimeout
async function loadAnimation({ id, frames, serializedFrames, interval = 0, framePos = 0 }) {
	if (animationTimeout) clearTimeout(timeOut)

	if (id) {
		serializedFrames = await frameDB.getAnimation(id)
		serializedFrames = serializedFrames.map(serializeFrame)
	}
	if (frames) {
		serializedFrames = frames.map(serializeFrame)
	}

	await writeToArduino(serializedFrames[framePos])

	if (serializedFrames.length > 1) {
		if (++framePos > serializedFrames.length - 1) framePos = 0
		animationTimeout = setTimeout(() => {
			playAnimation({ serializedFrames, interval, framePos })
		}, interval);
	}
}

module.exports = {
	init,
	frameDB,
	writeToArduino,
	writeTime,
	loadAnimation
}
