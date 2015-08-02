import logging

from flask import Flask, render_template, request


log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)
app = Flask(__name__)


@app.route("/index")
def index():
    return render_template("index.html")


def main():
    app.run(port=27855, debug=True)


if __name__ == '__main__':
    main()
