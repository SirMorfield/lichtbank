const fs = require('fs').promises
const path = require('path')
// const root = process.env.root
const root = '/home/joppe/GitHub/matrix'

async function getAnimation(name) {
	let file = await fs.readFile(path.join(root, `server/animations/${name}.json`))
	file = file.toString()
	file = JSON.parse(file)
	return file
}

async function saveAnimation(arr, name) {
	const savePath = path.join(root, `server/animations/${name}.json`)

	await fs.writeFile(savePath, JSON.stringify(arr))
}

async function getAnalogs(Xpix) {
	let analogs = await fs.readFile(path.join(root, 'server/animations/clock/analog.txt'))
	analogs = analogs.toString()
	analogs = analogs.split('\n')

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

	// converting bitstring ('11110101011011') to a 2d array
	analogs = analogs.map((analog) => {
		analog = splitInChunks(analog, Xpix)
		analog = analog.map((row) => {
			row = row.split('')
			row = row.map((bit) => parseInt(bit))
			return row
		})
		return analog
	})
	return analogs
}
module.exports = {
	getAnimation,
	saveAnimation,
	getAnalogs
}
