const Ypix = 48
const Xpix = 48

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

function serializeFrames(frames) {
  let newFrames = []
  frames.forEach(frame => {
    newFrames.push(serializeFrame(frame))
  })
  return newFrames
}

const spawn = require('child_process').spawn

const python = spawn('python', ['i2c.py'], { cwd: 'server/' })
process.on('exit', () => {
  python.kill()
})

python.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
})

python.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
})

const request = require('request-promise-native')
async function sendToPython(frames) {
  const options = {
    url: 'http://localhost:8081',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(frames)
  }
  const { err, response, body } = await request(options)
  if (err) console.error(err)
}

let pos = 0
let globalFrames = [[0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 127, 0, 96, 4, 8, 0, 0, 127, 0, 0, 127, 0, 0, 0, 127, 0, 24, 128, 48, 0, 0, 127, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 191, 0, 0, 0, 0, 0, 0, 191, 0, 192, 4, 8, 0, 0, 191, 0, 0, 0, 0, 0, 0, 191, 0, 6, 0, 32, 0, 0, 191, 0, 0, 0, 0, 0, 0, 191, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 223, 0, 128, 8, 8, 0, 0, 223, 0, 0, 0, 0, 0, 0, 223, 0, 3, 64, 64, 0, 0, 223, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 239, 0, 0, 0, 0, 0, 0, 239, 0, 0, 8, 4, 0, 0, 239, 0, 255, 255, 0, 0, 0, 239, 0, 0, 67, 67, 0, 0, 239, 0, 0, 0, 0, 0, 0, 239, 0, 0, 0, 0, 0, 0, 247, 0, 0, 0, 0, 0, 0, 247, 0, 0, 8, 4, 128, 0, 247, 0, 0, 0, 63, 127, 0, 247, 0, 0, 192, 64, 1, 0, 247, 0, 0, 0, 128, 0, 0, 247, 0, 0, 0, 0, 0, 0, 251, 0, 0, 0, 0, 0, 0, 251, 0, 0, 8, 0, 64, 0, 251, 0, 0, 0, 0, 192, 0, 251, 0, 0, 192, 128, 3, 0, 251, 0, 0, 0, 128, 0, 0, 251, 0, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 253, 0, 0, 16, 4, 48, 0, 253, 0, 0, 0, 0, 0, 0, 253, 0, 0, 96, 128, 12, 0, 253, 0, 0, 0, 128, 0, 0, 253, 0, 0, 0, 0, 0, 0, 254, 0, 0, 0, 0, 0, 0, 254, 0, 0, 32, 0, 16, 0, 254, 0, 0, 0, 0, 0, 0, 254, 0, 0, 48, 131, 24, 0, 254, 0, 0, 0, 0, 0, 0, 254]]
let globalInterval = 1000
let timeOut

async function upload(frames, interval, socket) {
  if (frames) {
    if (timeOut) clearTimeout(timeOut)
    pos = 0
    globalFrames = serializeFrames(frames)
    globalInterval = frames.length <= 1 ? 1 : interval
  }

  await sendToPython(globalFrames[pos])

  if (socket) socket.emit('upload', globalFrames[pos])

  // do not start loop if there is only 1 frame
  if (globalFrames.length <= 1) return

  timeOut = setTimeout(() => {
    pos++
    if (pos == globalFrames.length) pos = 0
    upload()
  }, globalInterval)
}

exports.upload = upload
