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
        # test http http://localhost:27855/p/1/ name=ll sort==123 -f
        # 首先顶一个 argparser
        parser = reqparse.RequestParser()

        # 然后就可以随心所欲的指定参数了
        # 来自 query arguments 的名为 sort 的参数，类型为 int
        parser.add_argument('sort', type=int, help='is sorted!', location='args')
        # 在 POST form 中名为 name 的的参数
        parser.add_argument('name', type=str, location='form')
        # 在 POST form 中定义了多个名为 multivar 的参数
        parser.add_argument('multivar', type=str, action='append')
        # 甚至还可以改名，比如我们想把 src 改名为 dest
        parser.add_argument('src', type=str, dest='dest')
        # 在 headers 中名为 User-Agent 的的参数
        parser.add_argument('User-Agent', location='headers')
        # 在 cookies 中名为 session_id 的参数
        parser.add_argument('session_id', location='cookies')
        # 文件中名为 pocture 的参数（这玩意儿我也没试过）
        parser.add_argument('picture', type=werkzeug.datastructures.FileStorage, location='files')

        args = parser.parse_args()
        return args

    def get(self, pid=None):
        args = self.req_parses()
        return {
            'pid': pid or 'list',
            'args': args,
        }

    def post(self, pid):
        args = self.req_parses()
        return {
            'pid': pid,
            'args': args,
        }


class RespObj():

    def __init__(self, pid):
        self.pid = pid
        self.num = 100
        self.yaoezi = 123
        self.member = ['a', 'b', 'c']
        self.date = datetime.datetime.now(tz=pytz.timezone('Asia/Shanghai'))
        self.simpledt = datetime.datetime.now(tz=pytz.timezone('Asia/Shanghai'))


class SimpleDateField(fields.Raw):

    def format(self, dt):
        print(dt)
        return datetime.datetime.strftime(dt, '%Y-%m-%d')


RESOURCE_FIELD = {
    'pid': fields.String,
    'num': fields.Integer,
    'member': fields.List(fields.String),
    'date': fields.DateTime(dt_format='rfc822'),
    'simpledt': SimpleDateField,
}


class ResourceHandler(Resource):

    @marshal_with(RESOURCE_FIELD)
    def get(self, pid):
        return RespObj(pid)


api.add_resource(PostHandler, '/p/<int:pid>/', '/p/')
api.add_resource(ResourceHandler, '/t/<string:pid>/', '/t/')

if __name__ == '__main__':
    app.run(
        debug=True,
        port=27855
    )
