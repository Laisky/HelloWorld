import flask
from flask import Response
import json

from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World2!"

@app.route("/health")
def health():
    return Response(json.dumps({'status': 'UP'}), status=200, mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=80)
