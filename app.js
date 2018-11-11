const path = require('path')
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { exec } = require('child_process')
const fs = require('fs');
const sketchWithoutPixelData = fs.readFileSync(path.join(__dirname, 'sketchWithoutPixelData.ino'));
app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('frame', (frame) => {
    let sketch = frame + sketchWithoutPixelData;
    let sketchPath = path.join(__dirname, 'sketch/sketch.ino');
    // fs.unlinkSync(sketchPath);
    fs.writeFile(sketchPath, sketch, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("The file was saved!");
      console.log('uploading sketch');
      let command = 'make upload clean'
      let cwd = path.join(__dirname, 'sketch');
      exec(command, { cwd: cwd }, (err, stdout, stderr) => {
        if (err) console.error(err)
        else {
          console.log(`stderr: ${stderr}`);
          // console.log(`stdout: ${stdout}`);
        }
      });
    });
  })
});

http.listen(8080, () => { console.log('running'); });
