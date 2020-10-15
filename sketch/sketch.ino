#include <Wire.h>
#define address 0x04

#define frameLength 504
#define maxBytesShifted 63	// 7 * (yPix /8)

#define clockPin A0 // clock	SH_CP	geel
#define latchPin A1 // latch	ST_CP	paars
#define dataPin A2	// data		DS		bruin
#define bytePosResetPin A3
#define greenLED 9

uint8_t frame[frameLength] = {};
uint16_t bytesShifted = 0;
uint16_t bytePos = 0;

void receiveData(int byteCount){
	while (Wire.available()) {
		byte number = Wire.read();
		frame[bytePos] = number;
		bytePos++;
	}
}

void setup() {
	Wire.begin(address);
	Wire.onReceive(receiveData);

	pinMode(greenLED, OUTPUT);
	digitalWrite(greenLED, HIGH);
	delay(400);
	digitalWrite(greenLED, LOW);

	pinMode(latchPin, OUTPUT);
	pinMode(clockPin, OUTPUT);
	pinMode(dataPin, OUTPUT);
	pinMode(bytePosResetPin, INPUT);
}

void loop()
{
	PORTC = B00000010; // digitalWrite(latchPin, HIGH);
	for (uint16_t i = 0; i < frameLength; i++) {
		if (digitalRead(bytePosResetPin) == HIGH) {
			bytePos = 0;
			digitalWrite(greenLED, HIGH);
		}
		else {
			digitalWrite(greenLED, LOW);
		}

		for (uint16_t b = 7; b >= 0; b--) {
			PORTC = B00000010; // digitalWrite(clockPin, LOW);
			if (bitRead(frame[i], b))
				PORTC = B00000110; // digitalWrite(dataPin, HIGH);
			else
				PORTC = B00000010; // digitalWrite(dataPin, LOW);
			PORTC = B10000011; // digitalWrite(clockPin, HIGH);
		}
		bytesShifted++;
		if (bytesShifted == maxBytesShifted) {
			bytesShifted = 0;
			PORTC = B00000000; // digitalWrite(latchPin, LOW);
			delayMicroseconds(15);
			PORTC = B00000010; // digitalWrite(latchPin, HIGH);
		}
	}
}
