from sanic import Sanic
from sanic.response import json, text


app = Sanic(__name__)


@app.route("/")
async def test(request):
    return text("Hello, World")

app.run(host="0.0.0.0", port=8000)
