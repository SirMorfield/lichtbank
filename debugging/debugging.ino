int clockPin = A0; //SH_CP
int latchPin = A1; //ST_CP
int dataPin = A2; //DS

void setup() {
  Serial.begin(115200);
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);
}

void loop() {
  digitalWrite(latchPin, HIGH);

  shiftOut(dataPin, clockPin, LSBFIRST, 0b00000000);
  shiftOut(dataPin, clockPin, LSBFIRST, 0b00000000);
  shiftOut(dataPin, clockPin, LSBFIRST, 0b00000000);
  shiftOut(dataPin, clockPin, LSBFIRST, 0b00000010);
  shiftOut(dataPin, clockPin, LSBFIRST, 0b00000000);
  shiftOut(dataPin, clockPin, LSBFIRST, 0b00000000);


  shiftOut(dataPin, clockPin, LSBFIRST, 0b11111110);//inverted

  delay(500);
  digitalWrite(latchPin, LOW);
}
