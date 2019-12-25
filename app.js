const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const isPi = require('detect-rpi')()

process.env.root = __dirname

let convert
if (isPi) {
	convert = require('./server/convert.js')
	convert.loadSketch('standard')
}

app.use(express.static(path.join(__dirname, 'public/')))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

io.on('connection', (socket) => {
	socket.on('frames', ({ frames, interval }) => {
		if (isPi) convert.upload(frames, interval)
	})

	socket.on('saveAnimation', ({ arr, name }) => {
	})
})

http.listen(8080, () => {
	console.log('running node')
})
