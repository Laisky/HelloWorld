#! /usr/bin/env python
# -*- coding: utf-8

from __future__ import unicode_literals, absolute_import
import hashlib

import jwt
from django.conf import settings


SECRET_KEY = settings.SECRET_KEY


def generate_token(json_, secret=SECRET_KEY):
    return jwt.encode(json_, secret, algorithm='HS512').decode()


def validate_token(token, secret=SECRET_KEY):
    return jwt.decode(token, secret, verify=True)


def generate_md5(content):
    return hashlib.md5(content).hexdigest()
