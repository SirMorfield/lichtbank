import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(21, GPIO.OUT)

from smbus import SMBus
from sys import argv
from time import sleep
bus = SMBus(1)

import time


def upload(i2cBytes):

  GPIO.output(21, GPIO.HIGH)
  sleep(0.0001)
  GPIO.output(21, GPIO.LOW)
  sleep(0.0001)

  for i2cByte in i2cBytes:
    bus.write_byte(0x04, i2cByte)

i2cBytes = argv[1]
i2cBytes = i2cBytes.split(',')
i2cBytes = map(int, i2cBytes)


begin = time.time()
upload(i2cBytes)
end = time.time() - begin
print end
