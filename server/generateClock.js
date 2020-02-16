// let nums = [1, 2, 255, [1, 2]]

// const fs = require('fs').promises;

// (async () => {
// 	await fs.writeFile('buffer', Buffer.from(nums))
// 	const file = await fs.readFile('buffer')

// 	console.log(new Int8Array(file))
// })()

(async () => {
	const frameDB = require('./frameDB.js')
	const convert = await require('./convert.js')()
	const fs = require('fs').promises
	const clock = await frameDB.getClock()
	const Xpix = 48

	function map(x, in_min, in_max, out_min, out_max) {
		return Math.round((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)
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
			})
			return row
		})
		return frame
	}

	let seconds = 0
	let minutes = 0
	let hours = 0
	const maxSeconds = 24 * 60 * 60
	const bitsInFrame = 48 * 72
	let final = []
	// let totalSeconds = 0
	for (let totalSeconds = 0; totalSeconds <= maxSeconds; totalSeconds++) {
		const layers = [
			clock.analogs[map(totalSeconds, 0, maxSeconds, 0, 720 * 2) % 720],
			clock.hours[hours],
			clock.minutes[minutes],
			clock.seconds[seconds],
		]

		let pixels = (new Array(bitsInFrame)).fill('0')
		for (const layer of layers) {
			for (let i = 0; i < layer.length; i++) {
				if (layer[i] === '1') pixels[i] = layer[i]
			}
		}
		pixels = pixels.join('')
		const frame = stringToFrame(pixels)
		const bytes = convert.serializeFrame(frame)
		final.push(Buffer.from(bytes))

		hours = Math.floor(totalSeconds / 3600);
		minutes = Math.floor((totalSeconds % 3600) / 60);
		seconds = (totalSeconds % 3600) % 60
	}

	final = Buffer.concat(final)
	await fs.writeFile('temp', final)


	let buffer = await fs.readFile('temp')
	buffer = new Uint8Array(buffer)
	await convert.writeToArduino(buffer.slice(0, 504))

	const used = process.memoryUsage();
	for (let key in used) {
		console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
	}
})()
