// const spawn = require('child_process').spawn
// const python = spawn('python', ['-u', 'i2c.py'], { cwd: __dirname })
// python.stdout.on('data', (data) => { if (data.length > 0) console.log(data.toString()) })
// python.stderr.on('data', (data) => { if (data.length > 0) console.error(data.toString()) })
// process.on('exit', () => python.kill())

// const request = require('request-promise-native')
// async function writeToPython(bytes) {
// 	const options = {
// 		url: 'http://localhost:8081',
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify(bytes)
// 	}
// 	const { err, response, body } = await request(options)
// 	if (err) console.error(err)
// 	console.log('send')
// }


const http = require('http')
async function writeToPython(bytes) {

	const data = JSON.stringify(bytes)
	const options = {
		hostname: 'http://localhost',
		port: 8081,
		path: '/',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length
		}
	}

	const req = http.request(options, (res) => {
		console.log(`statusCode: ${res.statusCode}`)

		res.on('data', (d) => {
			process.stdout.write(d)
		})
	})

	req.on('error', (error) => {
		console.error(error)
	})

	req.write(data)
	req.end()
}
// module.exports = writeToPython
writeToPython([1, 2, 3])
