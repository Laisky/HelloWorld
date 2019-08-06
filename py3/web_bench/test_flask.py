# gunicorn -w 1 -b 0.0.0.0:8000 test_flask
from flask import Flask
application = Flask(__name__)


@application.route("/")
def hello():
    return "Hello, World"

if __name__ == "__main__":
    application.run(host='0.0.0.0', port=8000)
