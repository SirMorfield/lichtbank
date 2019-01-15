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

  digitalWrite(latchPin, HIGH);
  for (int x = 0; x < 48; x++) {
    digitalWrite(clockPin, LOW);
    digitalWrite(dataPin, HIGH); //the money
    digitalWrite(clockPin, HIGH);

  }

  for (int i = 0; i < 8; i++) {
    digitalWrite(clockPin, LOW);
    
    if (i == 2) {
      digitalWrite(dataPin, LOW); //the money
    } else {
      digitalWrite(dataPin, HIGH); //the money
    }

    digitalWrite(clockPin, HIGH);
  }
  digitalWrite(latchPin, LOW);
//  delay(100);
}

