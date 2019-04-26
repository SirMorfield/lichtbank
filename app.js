const path = require('path')
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { promisify } = require('util');

const exec = promisify(require('child_process').exec);

let jsonfile = require('jsonfile');

const Ypix = 48

app.use(express.static(path.join(__dirname, 'public/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

io.on('connection', (socket) => {
  socket.on('frames', ({ frames, interval }) => {
    exec(`python3 i2c.py ${frames} ${interval} ${Ypix}`, { cwd: path.join(__dirname, '/server') })
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
