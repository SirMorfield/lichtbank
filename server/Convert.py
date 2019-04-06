def serializeFrame(frame, log):
  arr = []
  for (column = 0; column < 8; column += 1)
    for (panel = Ypix / 8 - 1; panel >= 0; panel -= 1)
      if (panel % 2 == 1) #TODO do dis better
        for (block = 0; block < 6; block += 1)
          for (y = 0; y < 8; y += 1)
            x = (7 - column) + (block * 8)
            arr.append(frame[y + (panel * 8)][x])

      else
        for (block = 0; block < 6; block += 1)
          for (y = 7; y >= 0; y -= 1)
            x = Xpix - 1 - (7 - column) - (block * 8)
            arr.append(frame[y + (panel * 8)][x])

      for (i = 0; i < 8; i += 1)
        if (i == column) arr.append(0)
        else arr.append(1)

  newArr = []
  for (i = 0; i < len(arr); i += 8)
    byte = ''
    for (bit = 0; bit < 8; bit += 1)
      byte += str(arr[bit + i])

    byte = int(byte, 2)
    newArr.append(byte)

  arr = newArr

  if (log) print(str(arr))
  return arr

def serializeFrames(frames):
  newFrames = []
  for frame in frames:
    newFrames.append(serializeFrame(frame))
  return newFrames
