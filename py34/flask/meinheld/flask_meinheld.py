# $ python flask_meinheld.py > /dev/null 2>&1

import logging

from flask import Flask, Response
import meinheld


app = Flask(__name__)
logging.getLogger('werkzeug').disabled = True


@app.route('/')
def index():
    return Response('hello')


if __name__ == '__main__':
    meinheld.listen(("0.0.0.0", 8000))
    meinheld.run(app)
