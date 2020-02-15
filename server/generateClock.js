const frameDB = require('./frameDB.js')

const clock = await frameDB.getClock()
console.log(Object.keys(clock))
async function writeTime(loop = false, timeStamp = Date.now()) {
	clearPendingUploads()

	const d = new Date(timeStamp)
	const date = {
		analogs: (((d.getHours() + 1) * 60) + d.getMinutes()) % 720,
		hours: d.getHours(),
		minutes: d.getMinutes(),
		seconds: Math.round(d.getSeconds() + (1e-3 * d.getMilliseconds()))
	}
	// if (date.analogs === 0) date.analogs = 1
	// if (date.hours === 0) date.hours = 1
	// if (date.minutes === 0) date.minutes = 1
	// if (date.seconds === 0) date.seconds = 1

	let string = date.analogs[0]
	for (const time of Object.keys(date).slice(1)) {
		console.log(date[time])
		for (let i = 0; i < clock[time][date[time]].length; i++) {
			const bit = clock[time][date[time]][i]
			if (string[i] !== bit) string[i] = bit
		}
	}
	console.log('string', string.length, clock.analogs[0].length)
	const frame = stringToFrame(string)
	frame = serializeFrame(frame)

	await writeToArduino(frame)

	if (loop) {
		writeTimeTimeout = setTimeout(() => {
			writeTime(true)
		}, Math.max(0, 10000 - uploadDuration / 2))
	}
}