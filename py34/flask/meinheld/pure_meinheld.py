# $ gunicorn --workers=2 --worker-class="egg:meinheld#gunicorn_worker" pure_meinheld:hello_world

from meinheld import server


def hello_world(environ, start_response):
    status = '200 OK'
    res = b"Hello world!"
    response_headers = [
        ('Content-type', 'text/plain'),
        ('Content-Length', str(len(res)))]
    start_response(status, response_headers)
    return [res]

if __name__ == '__main__':
    server.listen(("0.0.0.0", 15000))
    server.run(hello_world)
