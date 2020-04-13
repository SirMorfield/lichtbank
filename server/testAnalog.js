const convert = require('./convert.js');
(async () => {
	let timestamp = Date.now()
	timestamp = 1577141348000
	while (true) {
		timestamp += 60000 + 1000
		// console.time('write')
		await convert.writeTime(false, timestamp)
		// console.timeEnd('write')
		await new Promise((resolve) => setTimeout(resolve, 1000))
	}
})()