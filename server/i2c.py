import smbus
import sys

frames sys.argv[1].split(',')
bus = smbus.SMBus(1)

address = 0x04

frameLength = int(sys.argv[2])

for i in range(frameLength):
  bus.write_byte(address, frames[i])
