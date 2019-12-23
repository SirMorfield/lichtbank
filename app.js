const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
process.env.root = __dirname

const convert = require('./server/convert.js')
convert.getAnimation('standard')
	.then((frames) => convert.upload(frames))

app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

io.on('connection', (socket) => {
	socket.on('frames', ({ frames, interval }) => {
		convert.upload(frames, interval, socket)
	})

	socket.on('saveAnimation', ({ arr, name }) => {
	})
})

http.listen(8080, () => {
	console.log('running node')
})
