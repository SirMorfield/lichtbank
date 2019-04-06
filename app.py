from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import logging
import server.convert as Convert
import server.i2c as i2c

app = Flask(__name__)
app.config['SECRET_KEY'] = 'UD&zgg79Cvx!%RYs'
app.config['FLASK_RUN_PORT'] = 8080
socketio = SocketIO(app)
log = logging.getLogger('werkzeug')
log.disabled = True

@app.route('/')
def index():
  return render_template('index.html')

@socketio.on('frames')
def frames(obj):
  frames = Convert.serializeFrames(obj['frames'])
  i2c.uploadAnimation(frames)

@socketio.on('saveAnimation')
def saveAnimation(obj):
  f = open('server/animations/' + obj['name'] + '.json', 'w')
  f.write(str(obj))
  f.close()

if __name__ == '__main__':
  socketio.run(app, port = 8080, debug = True)
