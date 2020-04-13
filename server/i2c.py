from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import json
from smbus import SMBus
import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(21, GPIO.OUT)
bus = SMBus(1)

def upload(i2cBytes):
	try:
		GPIO.output(21, GPIO.HIGH)
		sleep(0.0001)
		GPIO.output(21, GPIO.LOW)
		sleep(0.0001)

		for i2cByte in i2cBytes:
			bus.write_byte(0x04, i2cByte)
		return 0
	except:
		return 1

class Server(BaseHTTPRequestHandler):
  def _set_headers(self):
	self.send_response(200)
	self.send_header('Content-type', 'application/json')
	self.end_headers()

  def log_message(self, format, *args):
	return

  def do_POST(self):
	length = int(self.headers.getheader('content-length'))
	message = json.loads(self.rfile.read(length))

	errorCounter = 0
	while True:
	  exitcode = upload(message)

	  if exitcode == 0:
		break

	  elif exitcode == 1:
		print 'fail'
		errorCounter += 1
		if errorCounter > 10:
		  print "upload failed 10 times PANIC NOW"
		  break
	self._set_headers()

def run(server_class=HTTPServer, handler_class=Server, port=8081):
  server_address = ('', port)
  httpd = server_class(server_address, handler_class)

  httpd.serve_forever()

if __name__ == "__main__":
  print 'running python'
  run()
