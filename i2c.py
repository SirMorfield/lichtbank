import smbus
from time import sleep
import sys
bus = smbus.SMBus(1)
address = 0x04
counter = 0
# import RPi.GPIO as gpio
# gpio.setmode(gpio.BCM)
# gpio.setup(13, gpio.OUT)
# gpio.output(13, status)

def main():
  for i in range(336):
    bus.write_byte(address, 1)
    # sleep(.00001)
  print "response", bus.read_byte(address)

if __name__ == '__main__':
  try:
    main()
  except KeyboardInterrupt:
    print 'Interrupted'
    # gpio.cleanup()
    sys.exit(0)
