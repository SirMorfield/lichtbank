const spawn = require('child_process').spawn
const python = spawn('python', ['-u', 'i2c.py'], { cwd: __dirname })
python.stdout.on('data', (data) => { if (data.toString().length > 0) console.log(data.toString()) })
python.stderr.on('data', (data) => { if (data.toString().length > 0) console.error(data.toString()) })
process.on('exit', () => python.kill())

const request = require('request-promise-native')
async function writeToPython(bytes) {
	const options = {
		url: 'http://localhost:8081',
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bytes)
	}
	const { err, response, body } = await request(options)
	if (err) console.error(err)
}

module.exports = writeToPython