const fs = require('fs').promises
const path = require('path')
const mainPath = path.join(__dirname, 'frames/')
const publicPath = path.join(mainPath, 'public/')
const sanitize = require("sanitize-filename");

async function getAnimation(name, private) {
	try {
		let file = await fs.readFile(path.join(private ? mainPath : publicPath, name))
		file = file.toString()
		file = JSON.parse(file)
		file.error = undefined
		return file
	} catch (err) { return { error: err } }
}

async function getAllAnimationNames() {
	return await fs.readdir(publicPath)
}

async function saveAnimation(animation) {
	let name = animation.name
	if (name.length == 0) return 'Choose longer name'
	if (name.length > 30) return 'Choose shorter name'

	name = sanitize(name) || `${Date.now()}`

	const existingNames = await getAllAnimationNames()
	if (existingNames.indexOf(name) !== -1) return 'Name already in use, try another'

	const savePath = path.join(publicPath, name)

	await fs.writeFile(savePath, JSON.stringify(animation))
	return `Success, saved "${name}"`
}

async function getClock() {
	let res = {}
	for (const time of ['analogs', 'hours', 'minutes', 'seconds']) {
		const file = await fs.readFile(path.join(mainPath, `clock/${time}`))
		res[time] = file.toString().split('\n')
	}
	return res
}

module.exports = {
	getAnimation,
	getAllAnimationNames,
	saveAnimation,
	getClock
}
