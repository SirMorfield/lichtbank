(async () => {
	console.time('loadTime')
	const path = require('path')
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const io = require('socket.io')(http)
	process.env.root = __dirname

	const convert = await require('./server/convert.js')()
	await convert.loadAnimation({ id: 'standard', private: true })

	app.use(express.static(path.join(__dirname, 'public/')))
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public/index.html'))
	})

	io.on('connection', (socket) => {
		socket.on('loadAnimation', async ({ frames, interval }) => {
			await convert.loadAnimation({ frames, interval })
			socket.emit('message', 'Upload successful')
		})

		socket.on('saveAnimation', async (animation) => {
			const message = await convert.frameDB.saveAnimation(animation)
			socket.emit('message', message)
		})

		socket.on('reqAnimationNames', async () => {
			const names = await convert.frameDB.getAllAnimationNames()
			socket.emit('resAnimationNames', names)
		})

		socket.on('loadSavedAnimation', async (id) => {
			await convert.loadAnimation({ id })
		})
	})

	http.listen(8080, () => {
		console.timeEnd('loadTime')
	})
})()
