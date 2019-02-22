byte a = 63;

void setup() {
  Serial.begin(115200);
Serial.println(bitRead(a, 7-1));
}

void loop() {
  // put your main code here, to run repeatedly:

}
