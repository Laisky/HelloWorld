#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from pathlib import Path

import tornado
import tornado.web
import tornado.httpserver

CWD = os.path.dirname(__file__)


class RetrieveMixin():

    def retrieve(self, *args, **kw):
        self.write(str(self.request))


class ViewSet(tornado.web.RequestHandler, RetrieveMixin):
    _ROUTES = {}
    _SERIALIZER = None

    @classmethod
    def as_view(cls, routes):
        cls._ROUTES.update(routes)
        return cls

    def dispatch(self, method, *args, **kw):
        if method not in self._ROUTES:
            raise tornado.web.HTTPError(status_code=405, reason="Not support that method!")

        getattr(self, self._ROUTES[method])(*args, **kw)
        self.finish()

    @tornado.web.asynchronous
    def head(self, *args, **kwargs):
        self.dispatch('head', *args, **kwargs)

    @tornado.web.asynchronous
    def get(self, *args, **kwargs):
        self.dispatch('get', *args, **kwargs)

    @tornado.web.asynchronous
    def post(self, *args, **kwargs):
        self.dispatch('post', *args, **kwargs)

    @tornado.web.asynchronous
    def delete(self, *args, **kwargs):
        self.dispatch('delete', *args, **kwargs)

    @tornado.web.asynchronous
    def patch(self, *args, **kwargs):
        self.dispatch('patch', *args, **kwargs)

    @tornado.web.asynchronous
    def put(self, *args, **kwargs):
        self.dispatch('put', *args, **kwargs)

    @tornado.web.asynchronous
    def options(self, *args, **kwargs):
        self.dispatch('options', *args, **kwargs)


class Application(tornado.web.Application):

    def __init__(self):
        settings = {
            'static_path': str(Path(CWD, 'static')),
            'static_url_prefix': '/static/',
            'template_path': str(Path(CWD, 'templates')),
            'cookie_secret': 'afaffewfwefewfef',
            'login_url': '/login/',
            'xsrf_cookies': True,
            'autoescape': None,
            'debug': True,
        }
        handlers = [
            # -------------- handler --------------
            (r'/(.*)', ViewSet.as_view({'get': 'retrieve'})),
        ]
        super(Application, self).__init__(handlers, **settings)


if __name__ == '__main__':
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(8050)
    ioloop = tornado.ioloop.IOLoop.instance()
    ioloop.start()
