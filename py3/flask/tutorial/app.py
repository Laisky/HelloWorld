import os
from functools import wraps

from flask import (
    Flask, render_template, request, url_for,
    make_response, session, flash, g
)
from flask.views import View, MethodView

from appdemo.urls import urlpattern


# configuration
DATABASE = '/tmp/flaskr.db'
DEBUG = True
SECRET_KEY = os.urandom(24)  # for session
USERNAME = 'admin'
PASSWORD = 'default'
# app settings
app = Flask(__name__)
app.config.from_object('settings.DebugConfig')


@app.route('/index/')
def index():
    resp = make_response(render_template('index.html'))
    resp.set_cookie('username', 'laisky')
    session['username'] = 'laisky'
    flash('holly chirst!')
    return resp


@app.errorhandler(404)
def pagenotfound(error):
    app.logger.debug(error)
    # return (response, status, headers)
    # resp = make_response(render_template('error.html'), 404)
    return 'Page Not Found!!!', 404


# 类型可选为 int, float, path
@app.route('/t/<int:pid>/', methods=['GET'])
def retrieve_posts(pid):
    return 'You got the post {}'.format(pid)


@app.route('/template', methods=['GET'])
def template_demo():
    return render_template('demo.html')


# filter
@app.template_filter('reverse/')
def reverse_filter(s):
    return s[::-1]


# 在 template 中插入自定义变量
# 变量可以是函数
@app.context_processor
def inject_cust_variable():
    return dict(my_var=13)


@app.context_processor
def inject_cust_func():
    def my_template_func(num):
        return num * 10

    return dict(my_func=my_template_func)


# pluggable view
# 继承 View 的话需要自己实现 method
class MyView(View):
    methods = ['GET', 'POST']

    def dispatch_request(self):
        if request.method == 'GET':
            return 'GET View'


def login_required(f):
    """Checks whether user is logged in or raises error 401."""
    @wraps(f)
    def decorator(*args, **kwargs):
        if not g.get('current_user'):
            return 'login required!', 401
        return f(*args, **kwargs)
    return decorator


# 也可以用 MethodView，flask 已经处理好了 method
class MyMethodView(MethodView):

    def get(self):
        return 'GET MethodView'

    @login_required
    def post(self):
        pass


def main():
    app.add_url_rule('/view/', view_func=MyView.as_view('view'))
    app.add_url_rule('/mview/', view_func=MyMethodView.as_view('methodview'))
    app.register_blueprint(urlpattern, url_prefix='/appdemo')
    app.run(port=27855, debug=True)


def test():
    # 模拟 request 上下文，便与编写单元测试
    with app.test_request_context('index', method='POST'):
        # request.args 可以获取到 url 中的参数
        # request.form 可以获取到 POST 和 PUT 的参数
        # request.files 可以获取到 POST 的文件
        print('request: {}'.format(request))
        print(url_for('index'))
        print(url_for('retrieve_posts', pid=233))


if __name__ == '__main__':
    test()
    main()
