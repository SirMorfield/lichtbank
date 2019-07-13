import smbus
import sys
import sched
import time

bus = smbus.SMBus(1)

s = sched.scheduler(time.time, time.sleep)

currentS = None
def upload(sc, pos, interval, frames):
  if currentS:
    s.cancel(currentS)

  address = 0x04
  for byte in frames[pos]:
    bus.write_byte(address, byte)

  pos += 1

  if pos == len(frames):
    pos = 0

  if len(frames) > 1:
    currentS = s.enter(interval, 1, upload, (sc, pos, interval, frames, ))

def uploadAnimation(frames, interval):
  upload(s, 0, interval, frames)
  if s.empty():
    s.run()
