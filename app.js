(async () => {
	console.time('loadTime')
	const path = require('path')
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const io = require('socket.io')(http)
	process.env.root = __dirname

	const convert = await require('./server/convert.js')()
	// await convert.loadSketch({ id: 'standard' })

	app.use(express.static(path.join(__dirname, 'public/')))
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public/index.html'))
	})

	io.on('connection', (socket) => {
		socket.on('frames', async ({ frames, interval }) => {
			if (isPi) await convert.upload(frames, interval)
		})

		socket.on('saveAnimation', async (animation) => {
			if (isPi) await convert.saveAnimation(animation)
		})
	})

	http.listen(8080, () => {
		console.timeEnd('loadTime')
	})
})()
