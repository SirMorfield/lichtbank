//keep this line here

#define clockPin A0 // clock   SH_CP   geel
#define latchPin A1 // latch   ST_CP   paars
#define dataPin A2  // data    DS      bruin

void setup()
{
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);
  digitalWrite(dataPin, 0);
  digitalWrite(clockPin, 0);
}

void loop()
{
  for (byte column = 0; column < 8; column++)
  {
    digitalWrite(latchPin, HIGH);
    for (byte i = 0; i < (Xpix + 8) * (Ypix / 8); i++)
    {
      digitalWrite(clockPin, LOW);
      digitalWrite(dataPin, frame[column][i]);
      digitalWrite(clockPin, HIGH);
    }
    digitalWrite(latchPin, LOW);
  }
}
