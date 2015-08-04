from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)


class PostHandler(Resource):

    def get(self, id_=None):
        return {'get': id_ or 'list'}

    def post(self, id_):
        return {'post': id_}


api.add_resource(PostHandler, '/p/<string:id_>/', '/p/')

if __name__ == '__main__':
    app.run(
        # debug=True,
        port=27855
    )
