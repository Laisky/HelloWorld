import datetime

import pytz
import werkzeug
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
        # Look only in the querystring
        parser.add_argument('sort', type=int, help='is sorted!', location=['args', 'values'])
        # Look only in the POST body
        parser.add_argument('name', type=int, location='form')
        # From the request headers
        parser.add_argument('User-Agent', location='headers')
        # From http cookies
        parser.add_argument('session_id', location='cookies')
        # From file uploads
        parser.add_argument('picture', type=werkzeug.datastructures.FileStorage, location='files')
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
        self.date = datetime.datetime.now(tz=pytz.timezone('Asia/Shanghai'))

RESOURCE_FIELD = {
    'id': fields.String,
    'num': fields.Integer,
    'date': fields.DateTime(dt_format='rfc822'),
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
