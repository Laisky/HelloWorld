from flask import Flask, Response
import meinheld

app = Flask(__name__)


@app.route('/')
def index():
    return Response('Hello, World')


if __name__ == '__main__':
    meinheld.listen(("0.0.0.0", 8000))
    meinheld.run(app)
