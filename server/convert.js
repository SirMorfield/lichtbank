const Ypix = 48
const Xpix = 48

const writeToArduino = require('./writeToArduino.js')
const frameDB = require('./frameDB.js')

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

	// this replaces the array of bits with an array of bytes
	// so [1,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1](16 bits) becomes [200,145](two bytes in base 10 format because js doesnt want to store bits)
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

let timeout
async function playAnimation(frames, interval, framePos = 0) {
	if (timeout) clearTimeout(timeOut)
	await writeToArduino(frames[framePos])

	await new Promise((resolve) => setTimeout(resolve, interval))

	framePos = framePos === frames.length - 1 ? 0 : framePos + 1
	playAnimation(frames, interval, framePos)
}

let analogs
async function writeTimeFrame(timeStamp = Date.now()) {
	const d = new Date(timeStamp)
	let minsIntoDay = ((d.getHours() + 1) * 60) + d.getMinutes()
	let index = minsIntoDay % 720
	// console.log(d.getHours(), d.getMinutes(), minsIntoDay, index)
	if (!analogs) analogs = await frameDB.getAnalogs(Xpix)
	const frame = serializeFrame(analogs[index])
	await writeToArduino(frame)
}

async function loadSketch(id) {
	let animation = await frameDB.getAnimation(id)
	animation = animation.map(serializeFrame)
	await writeToArduino(animation[0])
}

module.exports = {
	frameDB,
	writeToArduino,
	serializeFrame,
	playAnimation,
	writeTimeFrame,
	loadSketch
}
