const path = require('path')
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { promisify } = require('util');

let { exec } = require('child_process')
exec = promisify(exec)

const fs = require('fs');
const readDir = promisify(fs.readdir);
const unlink = promisify(fs.unlink)

let jsonfile = require('jsonfile');
const Xpix = 48;
const Ypix = 48;

app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

function serializeFrame(frame, log = false) {
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
  return arr;
}

io.on('connection', async (socket) => {
  socket.on('frames', async ({ frames, name }) => {
    let newFrames = serializeFrame(frames[0], true)

    await jsonfile.writeFile(path.join(__dirname, 'server/frames/', name + '.json'), newFrames)

    const currentFramesDir = path.join(__dirname, 'server/frames/currentFrames/')
    const files = await readDir(currentFramesDir)
    for (const file of files) {
      await unlink(path.join(currentFramesDir, file))
    }

    await jsonfile.writeFile(path.join(currentFramesDir, Date.now() + '.json'), newFrames)
    console.log('saved');
  });

  // exec('make upload', { cwd: path.join(__dirname) }, (err, stdout, stderr) => {
  //   if (err) console.error(err);
  //   else {
  //     console.log(`stderr: ${stderr}`);
  //     console.log('Sketch uploaded');
  //     // console.log(`stdout: ${stdout}`);
  //   }
  // });


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
