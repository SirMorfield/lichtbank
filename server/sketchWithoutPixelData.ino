// keep this line here

#define clockPin A0 // clock   SH_CP   geel
#define latchPin A1 // latch   ST_CP   paars
#define dataPin A2  // data    DS      bruin

byte columnSize = 0;
byte counter1 = 0;
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
  while (Serial.available() > 0)
  {
    frame[columnSize][counter1] = Serial.readStringUntil('\n');
    if (counter1 == 7 * (Ypix / 8))
    {
      counter1 = 0;
      columnSize++;
    }
    if (columnSize == 7)
    {
      columnSize = 0;
    }
    counter1++;
  }

  for (byte column = 0; column < 8; column++)
  {
    PORTC = B00000010; // digitalWrite(latchPin, HIGH);
    for (byte i = 0; i < 7 * (Ypix / 8); i++)
    {
      for (byte b = 0; b < 8; b++)
      {
        PORTC = B00000010; // digitalWrite(clockPin, LOW);
        byte x = bitRead(frame[column][i], 7 - b);
        if (x)
          PORTC = B00000110; // digitalWrite(dataPin, HIGH);
        else
          PORTC = B00000010; // digitalWrite(dataPin, LOW);

        PORTC = B10000011; // digitalWrite(clockPin, HIGH);
      }
    }
    delayMicroseconds(100);
    PORTC = B00000000; // digitalWrite(latchPin, LOW);
    delayMicroseconds(100);
  }
}
