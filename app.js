const path = require('path')
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { exec } = require('child_process')

app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('frame', (frame) => {
    console.log('uploading sketch');

    let command = 'make upload clean'
    let cwd = path.join(__dirname, 'sketch');
    exec(command, { cwd: cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  })
});

http.listen(8080, () => { });
