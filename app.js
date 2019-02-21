const path = require('path')
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { exec } = require('child_process')
const fs = require('fs');
const jsonfile = require('jsonfile')
app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('frame', (frame) => {
    const sketchWithoutPixelData = fs.readFileSync(path.join(__dirname, 'sketchWithoutPixelData.ino'));
    let sketch = frame + sketchWithoutPixelData;
    let sketchPath = path.join(__dirname, 'sketch/sketch.ino');
    // fs.unlinkSync(sketchPath);
    console.log('Saving file');
    fs.writeFile(sketchPath, sketch, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("The file was saved!");
      let command = 'make upload clean'
      let cwd = path.join(__dirname, 'sketch');
      exec(command, { cwd: cwd }, (err, stdout, stderr) => {
        if (err) console.error(err)
        else {
          console.log(`stderr: ${stderr}`);
          console.log('Sketch uploaded');
          // console.log(`stdout: ${stdout}`);
        }
      });
    });
  })

  socket.on('saveAnimation', ({ arr, name }) => {
    name = name.replace(/\./g, '');
    name += '(' + (new Date()).toLocaleDateString('en-GB').replace(/\//g, '-') + ')';

    let file = path.join(__dirname, 'server/animations', name + '.json')
    jsonfile.writeFile(file, arr, (err) => {
      if (err) console.error(err)
      else console.log('Animation saved');
    })
  })
});

http.listen(8080, () => { console.log('running'); });
