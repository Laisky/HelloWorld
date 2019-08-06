import time

from celery import Celery


app = Celery('hello', broker='redis://localhost/1', backend='redis://localhost/2')


@app.task
def add(x, y):
    time.sleep(5)
    return x + y

if __name__ == '__main__':
    app.worker_main()
