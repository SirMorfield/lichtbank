const path = require('path')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const jsonfile = require('jsonfile')

const convert = require('./server/convert.js')
app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

io.on('connection', (socket) => {
  socket.on('frames', ({ frames, interval }) => {
    convert.upload(frames, interval, socket)
  })

  socket.on('saveAnimation', ({ arr, name }) => {
    name = name.replace(/\./g, '')
    name += '(' + (new Date()).toLocaleDateString('en-GB').replace(/\//g, '-') + ')'

    let file = path.join(__dirname, 'server/animations', name + '.json')
    jsonfile.writeFile(file, arr, (err) => {
      if (err) console.error(err)
      else console.log('Animation saved')
    })
  })
})

http.listen(8080, () => {
  console.log('running node')
})
