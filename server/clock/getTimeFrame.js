const fs = require('fs')
const path = require('path')
const Xpix = 48
const Ypix = 72

let numbersArr = fs.readFileSync(path.join(__dirname, 'numbers.json'))
numbersArr = numbersArr.toString()
numbersArr = JSON.parse(numbersArr)

let analogs = fs.readFileSync(path.join(__dirname, 'analogs'))
analogs = analogs.toString()
analogs = analogs.split('\n')

const digitalLayer = {
	xOffsets: [0, 8, 17, 25, 34, 42],
	yOffset: 49,

	getSeparators() {
		// let separatorOffset = this.yOffset + 2
		// return [
		// 	{ x: 15, y: separatorOffset },
		// 	{ x: 15, y: separatorOffset + 6 },
		// 	{ x: 32, y: separatorOffset },
		// 	{ x: 32, y: separatorOffset + 6 },
		// ]

		let separatorOffset = this.yOffset + 3
		return [
			{ x: 15, y: separatorOffset },
			{ x: 15, y: separatorOffset + 4 },
			{ x: 32, y: separatorOffset },
			{ x: 32, y: separatorOffset + 4 },
		]
	},

	getNumbers(hour, minute, second) {
		let res = [
			hour < 10 ? 0 : Math.floor(hour / 10),
			hour % 10,
			minute < 10 ? 0 : Math.floor(minute / 10),
			minute % 10,
			second < 10 ? 0 : Math.floor(second / 10),
			second % 10,
		]
		res = res.map(num => numbersArr[num])
		return res
	},

	getDigitalLayer(hour, minute, second) {
		let canvas = []
		for (let i = 0; i < Ypix; i++) {
			canvas.push(new Array(Xpix).fill(0))
		}

		const numbers = this.getNumbers(hour, minute, second)

		for (let i = 0; i < numbers.length; i++) {
			let number = numbers[i]
			let xOffset = this.xOffsets[i]
			for (let y = 0; y < number.length; y++) {
				for (let x = 0; x < number[y].length; x++) {
					canvas[this.yOffset + y][xOffset + x] = number[y][x]
				}
			}
		}

		for (const point of this.getSeparators()) {
			canvas[point.y][point.x] = 1
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
		const row = this.map(totalSeconds, 0, this.maxSeconds, 0, 720 * 2) % 720
		return analogs[row]
	},
}

const layersToFrame = {
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
		let frame = this.splitInChunks(string, Xpix)
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
		pixels = layersToFrame.stringToFrame(pixels)
		return pixels
	},
}

function getFrame(timestamp) {
	const d = new Date(timestamp)
	const hour = d.getHours()
	const minute = d.getMinutes()
	const second = Math.round(d.getSeconds() + 1e-3 * d.getMilliseconds())

	const layers = [
		analogLayer.getAnalogLayer(hour, minute, second),
		digitalLayer.getDigitalLayer(hour, minute, second),
	]
	const layer = layersToFrame.mergeLayersToFrame(layers)
	return layer
}

module.exports = getFrame
