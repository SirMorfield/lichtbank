//keep this line here

#define clockPin A0 //SH_CP   geel
#define latchPin A1 //ST_CP   paars
#define dataPin A2  //DS      bruin

#define Xpix 48 //counting from 0 byteervals of 8
#define Ypix 48 //counting from 0 byteervals of 8

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
    for (byte panel = Ypix / 8 - 1; panel >= 0; panel--)
    {
      if (panel % 2 == 1)
      {
        for (byte block = 0; block < 6; block++) // 6 X 8 by 8 matrixes
        {
          for (byte y = 0; y < 8; y++)
          {
            byte x = (7 - column) + (block * 8);
            digitalWrite(clockPin, LOW);
            digitalWrite(dataPin, frame1[y + (panel * 8)][x]); //LOW = off, HIGH = on
            digitalWrite(clockPin, HIGH);
          }
        }

        for (byte i = 0; i < 8; i++)
        {
          digitalWrite(clockPin, LOW);

          if (i == column)
            digitalWrite(dataPin, LOW); //on

          else
            digitalWrite(dataPin, HIGH); //off

          digitalWrite(clockPin, HIGH);
        }
      }
      else
      {
        for (byte block = 0; block < 6; block++) // 6 X 8 by 8 matrixes
        {
          for (byte y = 7; y >= 0; y--)
          {
            byte x = Xpix - 1 - (7 - column) - (block * 8);
            digitalWrite(clockPin, LOW);
            digitalWrite(dataPin, frame1[y + (panel * 8)][x]); //LOW = off, HIGH = on
            digitalWrite(clockPin, HIGH);
          }
        }

        for (byte i = 0; i < 8; i++)
        {
          digitalWrite(clockPin, LOW);

          if (i == column)
            digitalWrite(dataPin, LOW); //on

          else
            digitalWrite(dataPin, HIGH); //off

          digitalWrite(clockPin, HIGH);
        }
      }
    }
    digitalWrite(latchPin, LOW);
  }
}
