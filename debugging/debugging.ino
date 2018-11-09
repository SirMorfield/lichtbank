#define clockPin A0 //SH_CP
#define latchPin A1 //ST_CP
#define dataPin A2 //DS

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
if (x == 2) {
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
//  digitalWrite(latchPin, LOW);
//  digitalWrite(latchPin, HIGH);
    for (int x = 0; x < 48; x++) {
 if (x == 21) {
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

