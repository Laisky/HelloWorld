# $ gunicorn --workers=1 -b=0.0.0.0 --worker-class="egg:meinheld#gunicorn_worker" test_meinheld:hello_world

from meinheld import server


def hello_world(environ, start_response):
    status = '200 OK'
    res = b"Hello, World"
    start_response(status, [('Content-type', 'text/plain')])
    return [res]

if __name__ == '__main__':
    server.listen(("0.0.0.0", 8000))
    server.run(hello_world)
