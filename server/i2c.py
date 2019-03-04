import smbus
from time import sleep
import sys
import json

import glob
framesFile = glob.glob("frames/currentFrames/*.json")[0]
print(framesFile)
frames = open(framesFile, 'r').read().replace('\n', '')
frames = json.loads(frames)

bus = smbus.SMBus(1)

address = 0x04

frameLength = 336

# import RPi.GPIO as gpio
# gpio.setmode(gpio.BCM)
# gpio.setup(13, gpio.OUT)
# gpio.output(13, status)

def main():
  for i in range(frameLength):
    bus.write_byte(address, frames[i])
    # sleep(.00001)
    # print( "response", bus.read_byte(address))


if __name__ == '__main__':
  try:
    main()
  except KeyboardInterrupt:
    print ('Interrupted')
    # gpio.cleanup()
    sys.exit(0)
