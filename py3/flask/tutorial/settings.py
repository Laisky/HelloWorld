import os


class Config():
    DATABASE = '/tmp/flaskr.db'
    DEBUG = False
    SECRET_KEY = os.urandom(24)  # for session
    USERNAME = 'admin'
    PASSWORD = 'default'


class DebugConfig(Config):
    DEBUG = True
