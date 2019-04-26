import smbus
import sys.argv as argv
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


def serializeFrame(frame, log, Ypix):
  arr = []
  for column in range(8):
    for panel in range(Ypix / 8 -1, -1, -1):
      if panel % 2 == 1:
        for block in range(6):
          for y in range(8):
            x = (7 - column) + (block * 8)
            arr.append(frame[y + (panel * 8)][x])

      else:
        for block in range(6):
          for y in range(7, -1, -1):
            x = Xpix - 1 - (7 - column) - (block * 8)
            arr.append(frame[y + (panel * 8)][x])

      for i in range(8):
        if i == column:
           arr.append(0)
        else:
           arr.append(1)

  newArr = []
  for i in range(0, len(arr), 8):
    byte = ''
    for bit in range(8):
      byte += str(arr[bit + i])

    byte = int(byte, 2)
    newArr.append(byte)

  arr = newArr

  if log:
     print(str(arr))
  return arr

def serializeFrames(frames,Ypix):
  newFrames = []
  for frame in frames:
    newFrames.append(serializeFrame(frame, False, Ypix))
  return newFrames

def uploadAnimation(frames, interval, Ypix):
  serializedFrames = serializeFrames(frames, Ypix)
  upload(s, 0, interval, serializedFrames)
  if s.empty():
    s.run()


uploadAnimation(argv[1], argv[2], argv[3])
