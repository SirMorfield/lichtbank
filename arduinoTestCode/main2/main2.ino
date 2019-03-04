
#include <Wire.h>
#define SLAVE_ADDRESS 0x04
#define LED 13

int number = 0;
int counter = 0;
byte arr[336];

void receiveData(int byteCount)
{
  while (Wire.available())
  {
    number = Wire.read();
    arr[counter] = number;
    counter++;
  }
}

void sendData()
{
  byte result = 0;
  for (int i = 0; i < 336; i++)
  {
    result += arr[i];
  }

  Wire.write(result);
}

void setup()
{
  pinMode(LED, OUTPUT);
  Wire.begin(SLAVE_ADDRESS);
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);
}

void loop()
{
  // delay(100);
}
