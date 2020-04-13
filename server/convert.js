const Ypix = 72
const Xpix = 48
const serializeFrame = require('./serializeFrame.js')(Xpix, Ypix)
const uploadDuration = 300
const frameDB = require('./frameDB.js')
const isPi = require('detect-rpi')()
const writeToPython = isPi ? require('./writeToPython.js') : async () => { }
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
		serializedFrames = frames.map((frame) => serializeFrame(frame))
	}

	writeToPython(serializedFrames[framePos])

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
	writeToPython(bytes)
	if (loop) timeout = setTimeout(() => writeTime(loop), 5000)
}

module.exports = {
	frameDB,
	loadAnimation,
	writeTime
}