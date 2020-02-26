module.exports = async (convert) => {
	const fs = require('fs').promises
	const path = require('path')
	const Xpix = 48
	const Ypix = 72

	let numbersArr = await fs.readFile(path.join(__dirname, 'numbers.json'))
	numbersArr = numbersArr.toString()
	numbersArr = JSON.parse(numbersArr)

	let analogs = await fs.readFile(path.join(__dirname, 'analogs'))
	analogs = analogs.toString()
	analogs = analogs.split('\n')

	const digitalLayer = {
		xOffsets: [0, 8, 17, 25, 34, 42],
		yOffset: 49,

		getNumbers(hour, minute, second) {
			let res = []
			hour = `${hour}`.padStart(2, '0')
			res[0] = hour[0]
			res[1] = hour[1]

			minute = `${minute}`.padStart(2, '0')
			res[2] = minute[0]
			res[3] = minute[1]

			second = `${second}`.padStart(2, '0')
			res[4] = second[0]
			res[5] = second[1]

			res = res.map(num => parseInt(num))
			res = res.map(num => numbersArr[num])

			return res
		},

		getDigitalLayer(hour, minute, second) {
			let canvas = []
			for (let i = 0; i < Ypix; i++) {
				canvas.push(new Array(Xpix).fill(0))
			}

			const numbers = digitalLayer.getNumbers(hour, minute, second)

			for (let i = 0; i < numbers.length; i++) {
				let number = numbers[i]
				let xOffset = digitalLayer.xOffsets[i]
				for (let y = 0; y < number.length; y++) {
					for (let x = 0; x < number[y].length; x++) {
						canvas[digitalLayer.yOffset + y][xOffset + x] = number[y][x]
					}
				}
			}

			canvas = canvas.flat(2).join('')
			return canvas
		},
	}

	const analogLayer = {
		maxSeconds: 24 * 60 * 60,
		map(x, inMin, inMax, outMin, outMax) {
			return Math.round((x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin)
		},

		getAnalogLayer(hour, minute, second) {
			const totalSeconds = (hour * 60 * 60) + (minute * 60) + second
			const row = analogLayer.map(totalSeconds, 0, analogLayer.maxSeconds, 0, 720 * 2) % 720
			return analogs[row]
		},
	}

	const layersToBytes = {
		splitInChunks(str, len) {
			const size = Math.ceil(str.length / len)
			const r = Array(size)
			let offset = 0

			for (let i = 0; i < size; i++) {
				r[i] = str.substr(offset, len)
				offset += len
			}
			return r
		},

		stringToFrame(string) {
			let frame = layersToBytes.splitInChunks(string, Xpix)
			frame = frame.map((row) => {
				row = row.split('')
				row = row.map(bit => {
					if (bit === '1') return 1
					if (bit === '0') return 0
				})
				return row
			})
			return frame
		},

		mergeLayersToFrame(layers) {
			let pixels = (new Array(Xpix * Ypix)).fill('0')
			for (const layer of layers) {
				for (let i = 0; i < layer.length; i++) {
					if (layer[i] === '1') pixels[i] = layer[i]
				}
			}
			pixels = pixels.join('')
			pixels = layersToBytes.stringToFrame(pixels)
			return pixels
		},

		getBytes(timestamp) {

			const d = new Date(timestamp)
			const hour = d.getHours()
			const minute = d.getMinutes()
			const second = Math.round(d.getSeconds() + 1e-3 * d.getMilliseconds())

			const layers = [
				analogLayer.getAnalogLayer(hour, minute, second),
				digitalLayer.getDigitalLayer(hour, minute, second),
			]
			const frame = layersToBytes.mergeLayersToFrame(layers)
			const bytes = convert.serializeFrame(frame)
			return bytes
		},
	}

	let timeout
	async function writeTime() {
		if (timeout) clearTimeout(timeout)
		console.time('getBytes')
		const bytes = layersToBytes.getBytes(Date.now())
		console.timeEnd('getBytes')
		await convert.writeToArduino(bytes)
		timeout = setTimeout(writeTime, 5000)
	}

	return writeTime
}