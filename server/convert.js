const Ypix = 72
const Xpix = 48
const serializeFrame = require('./serializeFrame.js')
const uploadDuration = 300
const frameDB = require('./frameDB.js')
const isPi = require('detect-rpi')()
const writeToArduino = isPi ? require('./writeToPython.js') : () => { }
const getTimeFrame = require('./clock/getTimeFrame.js')

let animationTimeout
async function loadAnimation({ id, frames, serializedFrames, interval = 0, private = false, framePos = 0 }) {
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
		serializedFrames = frames.map((frame) => serializeFrame(frame, Xpix, Ypix))
	}

	writeToArduino(serializedFrames[framePos])

	if (serializedFrames.length > 1) {
		if (++framePos > serializedFrames.length - 1) framePos = 0
		animationTimeout = setTimeout(() => {
			loadAnimation({ serializedFrames, interval, framePos })
		}, Math.max(10, interval - uploadDuration / 2))
	}

	return animation
}

let timeout
function writeTime(loop = false, timestamp = Date.now()) {
	if (timeout) clearTimeout(timeout)
	const frame = getTimeFrame(timestamp)
	const bytes = serializeFrame(frame)
	writeToArduino(bytes)
	if (loop) timeout = setTimeout(() => writeTime(loop), 5000)
}

module.exports = {
	frameDB,
	writeToArduino,
	loadAnimation,
	serializeFrame,
	writeTime
}