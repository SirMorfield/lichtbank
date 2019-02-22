const byte frame[8][42] = {{0,128,32,128,0,0,127,0,224,0,2,67,0,127,7,7,25,0,0,0,127,0,1,0,0,0,0,127,248,72,0,15,0,0,127,0,0,0,0,120,0,127},{0,0,96,128,0,0,191,0,48,112,2,66,0,191,3,3,13,0,0,0,191,0,1,0,0,0,0,191,0,72,2,0,0,0,191,0,0,0,0,0,0,191},{0,0,64,0,128,0,223,192,12,76,2,194,0,223,0,1,3,6,0,0,223,0,1,0,0,0,0,223,0,88,2,0,0,0,223,0,0,0,0,0,252,223},{0,0,64,12,136,0,239,96,12,130,3,129,65,239,0,1,0,1,0,0,239,0,1,0,192,0,240,239,0,80,194,0,15,0,239,0,0,192,0,192,128,239},{0,0,128,8,128,0,247,48,8,129,0,129,65,247,193,0,135,0,0,0,247,0,0,0,0,0,0,247,8,240,62,129,25,0,247,0,0,0,0,64,128,247},{0,0,128,24,128,0,251,0,248,0,0,128,65,251,127,0,100,0,0,0,251,0,0,0,0,0,0,251,248,0,4,251,16,0,251,0,0,0,224,64,128,251},{0,0,128,16,128,192,253,0,0,0,15,128,64,253,0,0,20,15,0,0,253,0,0,0,0,0,0,253,0,0,0,14,16,0,253,0,0,0,0,192,128,253},{0,0,128,48,128,64,254,0,0,128,24,131,65,254,0,12,12,25,0,0,254,0,0,0,0,0,0,254,0,0,0,6,25,0,254,0,0,0,0,0,128,254}};
#define Xpix 48
#define Ypix 48
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
