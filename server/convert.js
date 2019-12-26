module.exports = async () => {
	const Ypix = 48
	const Xpix = 48
	const uploadDuration = 300

	const frameDB = require('./frameDB.js')

	const isPi = require('detect-pi')()
	let writeToArduino
	if (!isPi) {
		writeToArduino = new Promise((resolve) => {
			setTimeout(resolve, uploadDuration)
		})
	} else {
		writeToArduino = require('./writeToArduino.js')
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

	function stringToFrame(string) {
		function splitInChunks(str, len) {
			const size = Math.ceil(str.length / len)
			const r = Array(size)
			let offset = 0

			for (let i = 0; i < size; i++) {
				r[i] = str.substr(offset, len)
				offset += len
			}
			return r
		}

		let frame = splitInChunks(string, Xpix)
		frame = frame.map((row) => {
			row = row.split('')
			row = row.map(bit => {
				if (bit === '1') return 1
				if (bit === '0') return 0
				console.error('err', bit)
			})
			return row
		})
		return frame
	}

	let clock = await frameDB.getClock()
	let analogs = clock.analogs.split('\n')
	analogs = analogs.map(stringToFrame)
	analogs = analogs.map(serializeFrame)

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
				loadAnimation({ serializedFrames, interval, framePos })
			}, interval);
		}
	}

	return {
		frameDB,
		writeToArduino,
		writeTime,
		loadAnimation
	}
}