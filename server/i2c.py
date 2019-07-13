from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import json


from smbus import SMBus
from time import sleep
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(21, GPIO.OUT)
bus = SMBus(1)

def upload(i2cBytes):
  GPIO.output(21, GPIO.HIGH)
  sleep(0.0001)
  GPIO.output(21, GPIO.LOW)
  sleep(0.0001)

  for i2cByte in i2cBytes:
    bus.write_byte(0x04, i2cByte)


class Server(BaseHTTPRequestHandler):
  def _set_headers(self):
    self.send_response(200)
    self.send_header('Content-type', 'application/json')
    self.end_headers()

  def do_POST(self):
    length = int(self.headers.getheader('content-length'))
    message = json.loads(self.rfile.read(length))
    upload(message)

    self._set_headers()

def run(server_class=HTTPServer, handler_class=Server, port=8081):
  server_address = ('', port)
  httpd = server_class(server_address, handler_class)

  httpd.serve_forever()

if __name__ == "__main__":
  run()
