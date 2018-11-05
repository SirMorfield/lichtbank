int clockPin = A0; //SH_CP
int latchPin = A1; //ST_CP
int dataPin = A2; //DS

long reversedBitPos[8] = {0b00000001, 0b00000010, 0b00000100, 0b00001000, 0b00010000, 0b00100000, 0b01000000, 0b10000000};
long invertedBitPos[8] = {0b01111111, 0b10111111, 0b11011111, 0b11101111, 0b11110111, 0b11111011, 0b11111101, 0b11111110};

void setup() {
  //  Serial.begin(115200);
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);
}

void loop() {
  for (char yPos = 0; yPos < 8; yPos++) {
    for (char xPos = 0; xPos < 48; xPos++) {
      digitalWrite(latchPin, HIGH);
      displayPixel(xPos, yPos);
      digitalWrite(latchPin, LOW);
    }
  }
}

void displayPixel(char x, char y) { //{x,y} {0-47, 0-7}
  int runs = 0;
  while (1) {
    if (x > 7) {
      runs++;
      x -= 8;
      shiftOut(dataPin, clockPin, LSBFIRST, 0b00000000);
    }
    else break;
  }

  shiftOut(dataPin, clockPin, LSBFIRST, reversedBitPos[y]);

  for (int i = 0; i < (5 - runs); i++) {
    shiftOut(dataPin, clockPin, LSBFIRST, 0b00000000);
  }
  shiftOut(dataPin, clockPin, LSBFIRST, invertedBitPos[x]);
}


