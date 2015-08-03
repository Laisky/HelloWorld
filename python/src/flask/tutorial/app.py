import os
import sys
import logging

from flask import (
    Flask, render_template, request, url_for,
    make_response, session, flash,
)


# configuration
DATABASE = '/tmp/flaskr.db'
DEBUG = True
SECRET_KEY = os.urandom(24)  # for session
USERNAME = 'admin'
PASSWORD = 'default'
# app settings
app = Flask(__name__)
app.config.from_object(__name__)


@app.route('/index')
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
@app.route('/t/<int:pid>', methods=['GET'])
def retrieve_posts(pid):
    return 'You got the post {}'.format(pid)


def main():
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
