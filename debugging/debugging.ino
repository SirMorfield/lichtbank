//int clockPin = A0; //SH_CP
//int latchPin = A1; //ST_CP
//int dataPin = A2; //DS
//
//void setup() {
//  Serial.begin(115200);
//  pinMode(latchPin, OUTPUT);
//  pinMode(clockPin, OUTPUT);
//  pinMode(dataPin, OUTPUT);
//}
//
//void loop() {
//  digitalWrite(latchPin, HIGH);
//
//  for (int x = 0; x < 48; x++) {
//    digitalWrite(clockPin, LOW);
//    digitalWrite(dataPin, HIGH); //the money
//    digitalWrite(clockPin, HIGH);
//    digitalWrite(dataPin, LOW);
//
//  }
//
//  for (int x = 0; x < 8; x++) {
//    digitalWrite(clockPin, LOW);
//    digitalWrite(dataPin, LOW); //the money
//    digitalWrite(clockPin, HIGH);
//    digitalWrite(dataPin, LOW);
//  }
//
//  digitalWrite(latchPin, LOW);
//}

int clockPin = A0; //SH_CP
int latchPin = A1; //ST_CP
int dataPin = A2; //DS
int invertedBitPos[8] = {0b01111111, 0b10111111, 0b11011111, 0b11101111, 0b11110111, 0b11111011, 0b11111101, 0b11111110};


void setup() {
  Serial.begin(115200);
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);
  digitalWrite(dataPin, 0);
  digitalWrite(clockPin, 0);
}

void loop() {

  for (int y = 0; y <  8; y++) {
    digitalWrite(latchPin, HIGH);
    for (int x = 0; x < 48; x++) {
      digitalWrite(clockPin, LOW);
      digitalWrite(dataPin, HIGH); //the money
      digitalWrite(clockPin, HIGH);
      digitalWrite(dataPin, LOW);
    }
    
    for (int i = 0; i < 8; i++) {
      if (i == y) {
        digitalWrite(clockPin, LOW);
        digitalWrite(dataPin, LOW); //the money
        digitalWrite(clockPin, HIGH);
        digitalWrite(dataPin, LOW);
      } else {
        digitalWrite(clockPin, LOW);
        digitalWrite(dataPin, HIGH); //the money
        digitalWrite(clockPin, HIGH);
        digitalWrite(dataPin, LOW);
      }
    }
//  delay(450);
  digitalWrite(latchPin, LOW);
  }

}

