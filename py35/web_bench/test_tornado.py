import tornado.ioloop
import tornado.web
import tornado.gen


class MainHandler(tornado.web.RequestHandler):

    @tornado.gen.coroutine
    def get(self):
        self.write("Hello, World")

application = tornado.web.Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
