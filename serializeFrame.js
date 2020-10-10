module.exports = (Xpix, Ypix) => {
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
		return byteArray
	}

	return serializeFrame
}
