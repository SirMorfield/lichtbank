const EventEmitter = require('events')
const Gpio = require('onoff').Gpio
const resetPin = new Gpio(21, 'out')
const i2c = require('i2c-bus')
const arduinoAddress = 0x04

async function writeByte(byte) {
	try {
		await Arduino.i2cWrite(arduinoAddress, 1, Buffer.from([byte]))
		return 0
	} catch (err) {
		console.error('i2c error', err)
		return { error: err }
	}
}

async function write(value) {
	return new Promise((resolve) => {
		resetPin.write(value, (err) => {
			if (err) {
				console.error('gpio error', err)
				resolve({ error: err })
			}
			resolve(0)
		})
	})
}

let Arduino
let isWriting = false
class Writer extends EventEmitter { }
const writer = new Writer()
writer.setMaxListeners(30)

async function writeToArduino(bytes, fails = 0) {
	if (isWriting) {
		// console.log('isWriting')
		await new Promise((resolve) => writer.on('writeDone', resolve))
		await write(bytes)
		return
	}
	isWriting = true
	try {
		if (!Arduino) Arduino = await i2c.openPromisified(1)
	} catch (err) { console.error('i2c open error', err) }

	await write(1)
	// Node is slow enough, no delay necessary
	// await new Promise((resolve) => setTimeout(resolve, 0.001))
	await write(0)
	// await new Promise((resolve) => setTimeout(resolve, 0.001))

	for (const byte of bytes) {
		const exit = await writeByte(byte)
		if (exit.error && fails++ < 4) {
			isWriting = false
			await writeToArduino(bytes, fails)
			return
		}
	}

	isWriting = false
	writer.emit('writeDone')
}

module.exports = writeToArduino
