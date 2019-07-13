import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(21, GPIO.OUT)

from smbus import SMBus
from sys import argv
from time import sleep


def upload(i2cBytes):
  GPIO.output(21, GPIO.HIGH)
  sleep(0.0001)
  GPIO.output(21, GPIO.LOW)
  sleep(0.0001)

  for i2cByte in i2cBytes:
    bus.write_byte(0x04, i2cByte)
