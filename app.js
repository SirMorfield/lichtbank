const path = require('path')
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { exec } = require('child_process')
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const jsonfile = require('jsonfile');

const Xpix = 48;
const Ypix = 48;

app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

function serializeFrame(frame, arrayOnly = false, log = false) {
  let arr = [];
  for (let column = 0; column < 8; column++) {
    for (let panel = Ypix / 8 - 1; panel >= 0; panel--) {
      if (panel % 2 == 1) {
        for (let block = 0; block < 6; block++) {
          for (let y = 0; y < 8; y++) {
            let x = (7 - column) + (block * 8);
            arr.push(frame[y + (panel * 8)][x]);
          }
        }
      } else {
        for (let block = 0; block < 6; block++) {
          for (let y = 7; y >= 0; y--) {
            let x = Xpix - 1 - (7 - column) - (block * 8);
            arr.push(frame[y + (panel * 8)][x]);
          }
        }
      }
      for (let i = 0; i < 8; i++) {
        if (i == column) arr.push(0);
        else arr.push(1);
      }
    }
  }

  // this replaces the array of bits with an array of bytes
  // so [1,0,0,1,1,1,0,1,1,0,0,1,1,1,0,1](16 bits) becomes [200,145](two bytes in base 10 format because js doesnt want to store bits)
  let newArr = [];
  for (let i = 0; i < arr.length; i += 8) {
    let byte = '';
    for (let bit = 0; bit < 8; bit++) {
      byte += String(arr[bit + i]);
    }
    byte = parseInt(byte, 2);
    newArr.push(byte);
  }
  arr = newArr;

  if (log) console.log(JSON.stringify(arr));
  if (arrayOnly) return arr;

  let frame = `#define frameLength ${arr.length}\n`;
  frame += `byte frame[frameLength] = `;
  frame += JSON.stringify(arr).replace(/\[/g, '{').replace(/\]/g, '}');
  frame += ';\n';

  return { frame };
}


io.on('connection', (socket) => {
  socket.on('frames', async (frames) => {
    const sketchWithoutPixelData = await readFile(path.join(__dirname, 'server/sketchWithoutPixelData.ino'));
    let sketch = serializeFrame(frames[0]).frame
    sketch += sketchWithoutPixelData;

    await writeFile(path.join(__dirname, 'sketch/sketch.ino'), sketch);

    exec('make upload', { cwd: path.join(__dirname, 'sketch') }, (err, stdout, stderr) => {
      if (err) console.error(err);
      else {
        console.log(`stderr: ${stderr}`);
        console.log('Sketch uploaded');
        // console.log(`stdout: ${stdout}`);
      }
    });
  });

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
