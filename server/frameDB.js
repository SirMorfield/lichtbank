const fs = require('fs').promises
const path = require('path')
const root = __dirname

async function getAnimation(name) {
	let file = await fs.readFile(path.join(root, `animations/${name}.json`))
	file = file.toString()
	file = JSON.parse(file)
	return file
}

async function saveAnimation(animation) {
	const savePath = path.join(root, `animations/${name}.json`)
	animation.name = animation.name.replace(/\s/g, '_')
	animation.name = animation.name.replace(/\\/g, '')

	await fs.writeFile(savePath, JSON.stringify(animation))
}

async function getClock() {
	let analogs = await fs.readFile(path.join(root, 'animations/clock/analog'))
	analogs = analogs.toString()

	return {
		analogs
	}
}

module.exports = {
	getAnimation,
	saveAnimation,
	getClock
}
