module.exports = () => {
	const fs = require('fs').promises
	const path = require('path')
	const root = process.file.root
	const send = require('./send.js')

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

	let pos = 0
	let globalFrames = await getAnimation('standard')
	let globalInterval = 1000
	let timeOut

	async function upload(frames, interval, socket) {
		if (frames) {
			if (timeOut) clearTimeout(timeOut)
			pos = 0
			globalFrames = frames.map(serializeFrame)
			globalInterval = frames.length <= 1 ? 1 : interval
		}

		await send(globalFrames[pos])

		if (socket) socket.emit('upload', globalFrames[pos])

		// do not start loop if there is only 1 frame
		if (globalFrames.length <= 1) return

		timeOut = setTimeout(() => {
			if (++pos == globalFrames.length) pos = 0
			upload()
		}, globalInterval)
	}

	return {
		getAnimation,
		saveAnimation,
		upload
	}
}
