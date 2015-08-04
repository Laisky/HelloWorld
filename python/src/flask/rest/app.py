from flask import Flask
from flask_restful import (
    Resource, Api, reqparse,
    fields, marshal_with
)

app = Flask(__name__)
api = Api(app)


class PostHandler(Resource):

    def req_parses(self):
        parser = reqparse.RequestParser()
        parser.add_argument('sort', type=int, help='is sorted!')
        args = parser.parse_args()
        return args

    def get(self, id_=None):
        args = self.req_parses()
        return {
            'get': id_ or 'list',
            'args': args,
        }

    def post(self, id_):
        return {'post': id_}


class Resp():

    def __init__(self, id_):
        self.id = id_
        self.num = 100

RESOURCE_FIELD = {
    'id': fields.String,
    'num': fields.Integer,
}


class ResourceHandler(Resource):

    @marshal_with(RESOURCE_FIELD)
    def get(self, id_):
        return Resp(id_)


api.add_resource(PostHandler, '/p/<string:id_>/', '/p/')
api.add_resource(ResourceHandler, '/t/<string:id_>/', '/t/')

if __name__ == '__main__':
    app.run(
        debug=True,
        port=27855
    )
