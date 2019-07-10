socketIO = SocketIO('localhost', 8080, LoggingNamespace)
def on_connect():
    print('connect')

def writeToArduino(i2cBytes):
  print(i2cBytes)

socketIO.on('connect', on_connect)
socketIO.on('aaa_response', writeToArduino)
