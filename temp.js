// const SerialPort = require('serialport');
// const parsers = SerialPort.parsers;
// const parser = new parsers.Readline({ delimiter: '\r\n' });

// // const arduinoPort = '/dev/ttyACM0'; //linux
// const arduinoPort = '/dev/cu.usbmodemFA131'; //mac
// const arduino = new SerialPort(arduinoPort, { baudRate: 115200 });
// arduino.pipe(parser);

// arduino.on('open', () => {
//   console.log('Arduino connection');
//   // parser.on('data', (incomingData) => {
//   //   console.log(incomingData);
//   // });
//   setTimeout(function () {
//     arduino.write("13")
//   }, 1000);
// });

const Avrgirl = require('avrgirl-arduino');

const avrgirl = new Avrgirl({
  board: 'uno'
});

avrgirl.flash('./remove.ino.standard.hex', function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info('done.');
  }
});
