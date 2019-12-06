const Gpio = require('onoff').Gpio
const pin = new Gpio(21, 'out')
const i2c = require('i2c-bus')
const fs = require('fs').promises
const path = require('path')
const root = process.file.root

const Ypix = 48
const Xpix = 48

async function getAnimation(name) {
	let file = await fs.readFile(path.join(root, `server/animations/${name}.json`))
	file = file.toString()
	file = JSON.parse(file)
	return file
}

async function saveAnimation(arr, name) {
	const savePath = path.join(root, `server/animations/${name}.json`)

	arr = arr.map(serializeFrame)
	await fs.writeFile(savePath, JSON.stringify(arr))
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

	// this replaces the array of bits with an array of bytes
	// so [1,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1](16 bits) becomes [200,145](two bytes in base 10 format because js doesnt want to store bits)
	let byteArray = [];
	for (let i = 0; i < bitArray.length; i += 8) {
		let byte = '';
		for (let bit = 0; bit < 8; bit++) {
			byte += String(bitArray[bit + i]);
		}
		byte = parseInt(byte, 2);
		byteArray.push(byte);
	}

	return byteArray;
}

async function sendPulse() {
	for (let i = 1; i >= 0; i++) {
		await new Promise((resolve) => {
			pin.write(i, (err) => {
				if (err) console.log(err)
				resolve()
			})
		})
		await new Promise((resolve) => setTimeout(resolve, 0.001))
	}
}

let i2cArduino
async function sendToArduino(bytes) {
	if (!i2cArduino) i2cArduino = await i2c.openPromisified(1)
	await sendPulse()
	for (const byte of bytes) {
		await i2c1.writeByte(0x04, byte)
	}
}

let pos = 0
let globalFrames = 1
let globalInterval = 1000
let timeOut

async function upload(frames, interval, socket) {
	if (frames) {
		if (timeOut) clearTimeout(timeOut)
		pos = 0
		globalFrames = frames.map(serializeFrame)
		globalInterval = frames.length <= 1 ? 1 : interval
	}

	await sendToArduino(globalFrames[pos])

	if (socket) socket.emit('upload', globalFrames[pos])

	// do not start loop if there is only 1 frame
	if (globalFrames.length <= 1) return

	timeOut = setTimeout(() => {
		pos++
		if (pos == globalFrames.length) pos = 0
		upload()
	}, globalInterval)
}

exports = {
	getAnimation,
	saveAnimation,
	upload
}
