const arr = [192, 0, 0, 0, 192, 0, 127, 0, 0, 0, 0, 224, 0, 127, 0, 48, 0, 2, 0, 0, 127, 0, 0, 44, 0, 0, 0, 127, 0, 16, 0, 1, 64, 0, 127, 128, 0, 0, 0, 128, 0, 127, 32, 0, 0, 0, 128, 0, 191, 0, 3, 0, 0, 28, 0, 191, 0, 8, 0, 12, 0, 0, 191, 0, 0, 68, 0, 0, 0, 191, 0, 16, 0, 1, 64, 0, 191, 192, 0, 0, 0, 128, 1, 191, 16, 0, 0, 0, 0, 0, 223, 0, 14, 0, 0, 2, 0, 223, 0, 8, 0, 8, 0, 0, 223, 0, 0, 130, 0, 0, 0, 223, 0, 96, 0, 0, 32, 0, 223, 96, 0, 0, 0, 0, 6, 223, 8, 0, 0, 0, 0, 0, 239, 0, 24, 0, 0, 1, 0, 239, 0, 6, 0, 48, 0, 0, 239, 0, 0, 2, 129, 0, 0, 239, 0, 64, 0, 0, 16, 0, 239, 32, 0, 0, 0, 0, 8, 239, 4, 0, 0, 0, 0, 0, 247, 0, 32, 0, 0, 0, 0, 247, 0, 1, 0, 96, 0, 0, 247, 0, 0, 1, 65, 0, 0, 247, 0, 128, 1, 0, 24, 0, 247, 16, 0, 0, 0, 0, 24, 247, 2, 0, 0, 0, 0, 8, 251, 0, 64, 0, 0, 0, 0, 251, 0, 0, 128, 128, 0, 0, 251, 0, 0, 1, 34, 0, 0, 251, 0, 128, 0, 0, 12, 0, 251, 0, 0, 0, 0, 0, 48, 251, 0, 0, 0, 0, 0, 24, 253, 0, 128, 0, 0, 0, 0, 253, 0, 0, 128, 0, 0, 0, 253, 0, 0, 0, 20, 0, 0, 253, 0, 0, 2, 0, 4, 0, 253, 0, 0, 0, 0, 0, 32, 253, 0, 0, 0, 0, 0, 96, 254, 0, 0, 0, 0, 0, 0, 254, 0, 0, 64, 0, 1, 0, 254, 0, 0, 0, 24, 0, 0, 254, 0, 0, 8, 0, 2, 128, 254, 0, 0, 0, 0, 0, 64, 254];
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;
const parser = new parsers.Readline({ delimiter: '\r\n' });

const port = '/dev/ttyACM0'; // linux
// const port = '/dev/cu.usbmodemFA131'; //mac
const arduino = new SerialPort(port, { baudRate: 115200 });
arduino.pipe(parser);

let bytesWritten = 0;
let counter = 0;
let running = false;

arduino.on('open', () => {
  setTimeout(() => {
    arduino.write(String(bytesWritten));
    bytesWritten = 1;
    running = true;
  }, 2000);
});

parser.on('data', (data) => {
  if (running) {
    arduino.write(String(arr[bytesWritten]));
    bytesWritten++;

    console.log(counter, data);
    counter++;
    if (bytesWritten > 300) {
      running = false;
    }
  }
});
