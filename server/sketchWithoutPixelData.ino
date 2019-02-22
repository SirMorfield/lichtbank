// keep this line here

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

    // digitalWrite(latchPin, HIGH);
    PORTC = B00000010;
    for (byte i = 0; i < 7 * (Ypix / 8); i++)
    {
      for (byte b = 0; b < 8; b++)
      {
        // digitalWrite(clockPin, LOW);
        PORTC = B00000010;
        byte x = bitRead(frame[column][i], 7 - b);
        if (x)
          // digitalWrite(dataPin, HIGH);
          PORTC = B00000110;
        else
          // digitalWrite(dataPin, LOW);
          PORTC = B00000010;

        // digitalWrite(clockPin, HIGH);
        PORTC = B10000011;
      }
    }
    delayMicroseconds(100);
    PORTC = B00000000;
    delayMicroseconds(100);
    // digitalWrite(latchPin, LOW);
  }
}
