const fs = require('fs').promises
const path = require('path')
const mainPath = path.join(__dirname, 'frames/')
const publicPath = path.join(mainPath, 'public/')
const sanitize = require("sanitize-filename");

async function getAnimation(name, private) {
	let file = await fs.readFile(path.join(private ? mainPath : publicPath, name))
	file = file.toString()
	file = JSON.parse(file)
	return file
}

async function getAllAnimationNames() {
	return await fs.readdir(publicPath)
}

async function saveAnimation(animation) {
	let name = animation.name
	if (name.length < 2) return 'Choose longer name'
	if (name.length > 30) return 'Choose shorter name'

	name = sanitize(name)

	const existingNames = await getAllAnimationNames()
	if (existingNames.indexOf(name) !== -1) return 'Name already in use, try another'

	const savePath = path.join(publicPath, name)

	await fs.writeFile(savePath, JSON.stringify(animation))
	return `Success, saved "${name}"`
}

async function getClock() {
	let analogs = await fs.readFile(path.join(mainPath, 'clock/analog'))
	analogs = analogs.toString()

	return {
		analogs
	}
}

module.exports = {
	getAnimation,
	getAllAnimationNames,
	saveAnimation,
	getClock
}
