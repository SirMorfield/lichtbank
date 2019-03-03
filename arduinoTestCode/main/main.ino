#define frameLength 336
#define maxCounter 42
byte frame[frameLength] = {0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 127, 0, 8, 0, 0, 0, 0, 127, 0, 32, 0, 0, 0, 0, 127, 4, 5, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 191, 0, 0, 0, 0, 0, 0, 191, 0, 8, 0, 0, 0, 0, 191, 0, 192, 0, 4, 0, 0, 191, 134, 0, 0, 0, 0, 0, 191, 0, 0, 0, 0, 0, 0, 191, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 223, 0, 0, 96, 0, 0, 0, 223, 0, 0, 1, 0, 0, 0, 223, 1, 12, 1, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 223, 0, 0, 0, 0, 0, 0, 239, 0, 0, 0, 0, 0, 0, 239, 0, 16, 24, 0, 0, 0, 239, 0, 0, 2, 16, 0, 0, 239, 128, 0, 0, 0, 0, 0, 239, 0, 0, 0, 0, 0, 0, 239, 0, 0, 0, 0, 0, 0, 247, 0, 0, 0, 0, 0, 0, 247, 0, 0, 8, 0, 128, 0, 247, 0, 0, 0, 64, 0, 0, 247, 0, 8, 2, 0, 0, 0, 247, 0, 0, 0, 0, 0, 0, 247, 0, 0, 0, 0, 0, 0, 251, 0, 0, 0, 0, 0, 0, 251, 0, 64, 8, 0, 128, 0, 251, 0, 0, 4, 0, 0, 53, 251, 0, 24, 0, 0, 0, 0, 251, 0, 0, 0, 0, 0, 0, 251, 0, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 253, 0, 0, 4, 0, 0, 0, 253, 0, 0, 8, 0, 0, 64, 253, 0, 8, 4, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 253, 0, 0, 0, 0, 0, 0, 254, 0, 0, 0, 0, 0, 0, 254, 0, 0, 0, 0, 0, 0, 254, 0, 0, 16, 0, 0, 128, 254, 0, 72, 0, 1, 0, 0, 254, 0, 0, 0, 0, 0, 0, 254};

#define clockPin A0 // clock   SH_CP   geel
#define latchPin A1 // latch   ST_CP   paars
#define dataPin A2  // data    DS      bruin

int counter = 0;
int bytePos = 0;
int counter1 = 0;

void setup()
{
  pinMode(latchPin, OUTPUT);
  pinMode(clockPin, OUTPUT);
  pinMode(dataPin, OUTPUT);
}

void loop()
{
  if (Serial.available() > 0)
  {
    if (bytePos < 336)
    {
      byte x = Serial.read();
      frame[bytePos] = x;
      bytePos++;
      Serial.println(x); // new byte
    }
    else
    {
      // bytePos = 0;
    }
  }

  else
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
}
