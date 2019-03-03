
// keep this line here

#define clockPin A0 // clock   SH_CP   geel
#define latchPin A1 // latch   ST_CP   paars
#define dataPin A2  // data    DS      bruin

int counter = 0;
void setup()
{
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);
}

void loop()
{
  PORTC = B00000010; // digitalWrite(latchPin, HIGH);
  for (int i = 0; i < 336; i++)
  {
    for (int b = 7; b >= 0; b--)
    {
      PORTC = B00000010; // digitalWrite(clockPin, LOW);
      if (bitRead(frame[i], b))
        PORTC = B00000110; // digitalWrite(dataPin, HIGH);
      else
        PORTC = B00000010; // digitalWrite(dataPin, LOW);

      PORTC = B10000011; // digitalWrite(clockPin, HIGH);
    }
    counter++;
    if (counter == maxCounter)
    {
      counter = 0;
      PORTC = B00000000; // digitalWrite(latchPin, LOW);
      delayMicroseconds(9);
      PORTC = B00000010; // digitalWrite(latchPin, HIGH);
    }
  }
}
