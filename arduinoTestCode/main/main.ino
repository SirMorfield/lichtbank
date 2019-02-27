#define Xpix 48
#define Ypix 48

byte columnSize = 0;
byte counter1 = 0;
byte frame[8][48] = {};
bool programmingMode = false;

void setup()
{
  Serial.begin(115200);
  pinMode(13, OUTPUT);
}

void loop()
{
  if (Serial.available() > 0 || programmingMode)
  {
    Serial.println("nb"); // new byte
    programmingMode = true;
    frame[columnSize][counter1] = Serial.readStringUntil('\n').toInt();
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
    digitalWrite(13, programmingMode);
  }
  if (!programmingMode)
  {
    for (int b = 0; b < 8; b++)
    {
      for (int i = 0; i < 48; i++)
      {
        Serial.print(frame[b][i]);
        Serial.print(" ");
      }
      Serial.println("");
    }
    Serial.println("---");
    delay(1000);
  }
}
