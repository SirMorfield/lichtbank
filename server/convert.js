const Ypix = 72
const Xpix = 48
const serializeFrame = require('./serializeFrame.js')(Xpix, Ypix)
const uploadDuration = 250
const frameDB = require('./frameDB.js')
const isPi = require('detect-rpi')()
const writeToPython = isPi ? require('./writeToPython.js') : async () => { }
const getTimeFrame = require('./clock/getTimeFrame.js')

let writeTimeTimeout
async function writeTime(loop = false, timestamp = Date.now()) {
	if (writeTimeTimeout) clearTimeout(writeTimeTimeout)
	const frame = getTimeFrame(timestamp)
	const bytes = serializeFrame(frame)
	await writeToPython(bytes)
	if (loop) writeTimeTimeout = setTimeout(() => writeTime(loop), Math.max(2000, uploadDuration))
}

async function stopWriteTime(loadStandardFrame) {
	if (writeTimeTimeout) clearTimeout(writeTimeTimeout)
	if (loadStandardFrame) await loadAnimation({ id: 'standard' })
}

let animationTimeout
async function loadAnimation({ id, frames, serializedFrames, interval = 0, private = false, framePos = 0 }) {
	await stopWriteTime(false)
	// requires either id, frames, or serializedFrames
	// case id: 1. retrieve animation from db 2. serialize 3. upload
	// case frames 1. serialize 2. upload
	// case serializedFra,es 1. upload

	clearTimeout(animationTimeout)
	let animation
	if (id) {
		animation = await frameDB.getAnimation(id, private)
		frames = animation.frames
		interval = animation.interval
	}
	if (frames) {
		serializedFrames = frames.map((frame) => serializeFrame(frame))
	}

	await writeToPython(serializedFrames[framePos])

	if (serializedFrames.length > 1) {
		if (++framePos > serializedFrames.length - 1) framePos = 0
		animationTimeout = setTimeout(() => {
			loadAnimation({ serializedFrames, interval, framePos })
		}, Math.max(0, interval - uploadDuration / 2))
	}

	return animation
}

module.exports = {
	frameDB,
	loadAnimation,
	writeTime,
	stopWriteTime,
}